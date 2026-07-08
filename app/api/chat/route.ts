import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { GoogleGenAI } from '@google/genai';
import { parseChatRequest } from '@/lib/chat/schema';
import { rateLimit } from '@/lib/chat/rate-limit';
import { injectionQuip, isInjectionAttempt } from '@/lib/chat/injection';
import {
  CHAT_MODELS,
  isQuotaError,
  streamWithFallback,
} from '@/lib/chat/generate';
import { embed, embeddingModel } from '@/lib/rag/embeddings';
import { retrieve } from '@/lib/rag/retrieve';
import { buildSystemPrompt } from '@/lib/rag/prompt';
import type { RagIndex, ScoredChunk } from '@/lib/rag/types';

export const runtime = 'nodejs';

const EMAIL = 'contact@amritesh.net';

let indexCache: RagIndex | null | undefined;

function loadIndex(): RagIndex | null {
  if (indexCache === undefined) {
    try {
      const raw = readFileSync(
        join(process.cwd(), 'src', 'generated', 'rag-index.json'),
        'utf8',
      );
      indexCache = JSON.parse(raw) as RagIndex;
    } catch {
      indexCache = null;
    }
  }
  return indexCache;
}

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function clientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  );
}

function traceOf(results: ScoredChunk[]) {
  return results.map((result) => ({
    id: result.chunk.id,
    heading: result.chunk.heading,
    vecRank: result.vecRank,
    bm25Rank: result.bm25Rank,
    fusedScore: Number(result.fusedScore.toFixed(4)),
  }));
}

// Injection attempts short-circuit here: a canned in-character deflection with an
// empty trace, so we never spend embedding or model quota answering a jailbreak.
function injectionResponse(): Response {
  const encoder = new TextEncoder();
  const quip = injectionQuip(Math.random());
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(`${JSON.stringify({ trace: [] })}\n`));
      controller.enqueue(encoder.encode(quip));
      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
  });
}

export async function POST(request: Request): Promise<Response> {
  if (!rateLimit(clientIp(request), Date.now()).allowed) {
    return jsonError(
      'Too many messages in a short window. Give it a minute.',
      429,
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError('Request body must be valid JSON.', 400);
  }
  const parsed = parseChatRequest(body);
  if (!parsed.ok) return jsonError(parsed.error, 400);

  if (isInjectionAttempt(parsed.value.message)) {
    return injectionResponse();
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return jsonError(
      `The twin is offline (no API key configured). Email ${EMAIL}.`,
      503,
    );
  }

  const index = loadIndex();
  if (!index) {
    return jsonError(
      `My knowledge index isn't built yet. Email ${EMAIL} and the human will answer.`,
      503,
    );
  }
  if (index.model !== embeddingModel()) {
    return jsonError(
      'My search index is stale (model mismatch); a rebuild is pending.',
      503,
    );
  }

  let results: ScoredChunk[];
  try {
    const queryVector = await embed(parsed.value.message, 'RETRIEVAL_QUERY');
    results = retrieve(queryVector, parsed.value.message, index, 4);
  } catch {
    return jsonError(
      `I can't reach my language model right now (quota or outage). Email ${EMAIL}.`,
      503,
    );
  }

  const contents = [
    ...parsed.value.history.map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content }],
    })),
    { role: 'user', parts: [{ text: parsed.value.message }] },
  ];

  const ai = new GoogleGenAI({ apiKey });
  const encoder = new TextEncoder();
  const trace = traceOf(results);
  const systemInstruction = buildSystemPrompt(results);

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(encoder.encode(`${JSON.stringify({ trace })}\n`));
      const result = await streamWithFallback(
        CHAT_MODELS,
        (model) =>
          ai.models.generateContentStream({
            model,
            contents,
            config: { systemInstruction },
          }),
        (text) => controller.enqueue(encoder.encode(text)),
      );
      if (result.error) {
        const tail = isQuotaError(result.error)
          ? `\n\n(I've hit today's free-tier limit on my language model, which resets at midnight Pacific. Email ${EMAIL} and the human will reply.)`
          : `\n\n(My model dropped mid-thought, likely a hiccup. Try again, or email ${EMAIL}.)`;
        controller.enqueue(encoder.encode(tail));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
  });
}
