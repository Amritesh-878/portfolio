export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type ChatModelChoice = 'auto' | 'twin';

export interface ChatRequest {
  message: string;
  history: ChatMessage[];
  model: ChatModelChoice;
}

export type ParseResult =
  { ok: true; value: ChatRequest } | { ok: false; error: string };

const MAX_MESSAGE_CHARS = 1000;
const MAX_HISTORY = 8;

function normalizeHistory(raw: unknown): ChatMessage[] {
  if (!Array.isArray(raw)) return [];
  const messages: ChatMessage[] = [];
  for (const item of raw) {
    if (typeof item !== 'object' || item === null) continue;
    const record = item as Record<string, unknown>;
    if (
      (record.role === 'user' || record.role === 'assistant') &&
      typeof record.content === 'string' &&
      record.content.length > 0
    ) {
      messages.push({
        role: record.role,
        content: record.content.slice(0, MAX_MESSAGE_CHARS),
      });
    }
  }
  return messages.slice(-MAX_HISTORY);
}

export function parseChatRequest(body: unknown): ParseResult {
  if (typeof body !== 'object' || body === null) {
    return { ok: false, error: 'Request body must be a JSON object.' };
  }
  const record = body as Record<string, unknown>;
  const message = record.message;
  if (typeof message !== 'string' || message.trim().length === 0) {
    return { ok: false, error: 'A non-empty message is required.' };
  }
  if (message.length > MAX_MESSAGE_CHARS) {
    return {
      ok: false,
      error: `Message exceeds the ${MAX_MESSAGE_CHARS}-character limit.`,
    };
  }
  return {
    ok: true,
    value: {
      message: message.trim(),
      history: normalizeHistory(record.history),
      // Clients never name raw model IDs; only the literal twin pin is honored.
      model: record.model === 'twin' ? 'twin' : 'auto',
    },
  };
}
