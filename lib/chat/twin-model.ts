import type { ChatMessage } from '@/lib/chat/schema';
import type { ContentChunk } from '@/lib/chat/generate';

export const TWIN_MODEL = 'twin-llm';

const MAX_TOKENS = 350;
const REQUEST_TIMEOUT_MS = 50_000;

const SSE_DATA_PREFIX = 'data:';
const SSE_DONE = '[DONE]';

interface OpenAiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export function twinModelConfigured(): boolean {
  return Boolean(process.env.TWIN_MODEL_URL && process.env.TWIN_MODEL_API_KEY);
}

const DONE = Symbol('twin-sse-done');

function parseSseLine(line: string): ContentChunk | null | typeof DONE {
  const trimmed = line.trim();
  if (!trimmed.startsWith(SSE_DATA_PREFIX)) return null;
  const data = trimmed.slice(SSE_DATA_PREFIX.length).trim();
  if (data === SSE_DONE) return DONE;
  try {
    const parsed = JSON.parse(data) as {
      choices?: Array<{ delta?: { content?: string } }>;
    };
    const content = parsed.choices?.[0]?.delta?.content;
    return content ? { text: content } : null;
  } catch {
    return null;
  }
}

export async function* parseTwinSse(
  stream: ReadableStream<Uint8Array>,
): AsyncGenerator<ContentChunk> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let newline = buffer.indexOf('\n');
      while (newline !== -1) {
        const chunk = parseSseLine(buffer.slice(0, newline));
        buffer = buffer.slice(newline + 1);
        if (chunk === DONE) return;
        if (chunk) yield chunk;
        newline = buffer.indexOf('\n');
      }
    }
    const tail = parseSseLine(buffer);
    if (tail && tail !== DONE) yield tail;
  } finally {
    reader.releaseLock();
  }
}

export async function openTwinModelStream(
  system: string,
  history: ChatMessage[],
  message: string,
): Promise<AsyncIterable<ContentChunk>> {
  const url = process.env.TWIN_MODEL_URL;
  const key = process.env.TWIN_MODEL_API_KEY;
  if (!url || !key) {
    throw new Error('Twin model is not configured.');
  }

  const messages: OpenAiMessage[] = [
    { role: 'system', content: system },
    ...history.map((entry) => ({ role: entry.role, content: entry.content })),
    { role: 'user', content: message },
  ];

  const response = await fetch(`${url}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${key}`,
    },
    // Single-model servers (llama-server) ignore `model`; gateway hosts
    // (e.g. Workers AI) require it, so send it only when configured.
    body: JSON.stringify({
      ...(process.env.TWIN_MODEL_NAME
        ? { model: process.env.TWIN_MODEL_NAME }
        : {}),
      messages,
      stream: true,
      max_tokens: MAX_TOKENS,
      chat_template_kwargs: { enable_thinking: false },
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok || !response.body) {
    throw new Error(`Twin model returned ${response.status}.`);
  }
  return parseTwinSse(response.body);
}
