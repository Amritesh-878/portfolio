import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  TWIN_MODEL,
  openTwinModelStream,
  parseTwinSse,
  twinModelConfigured,
} from '@/lib/chat/twin-model';
import type { ContentChunk } from '@/lib/chat/generate';

function sseStream(...pieces: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (const piece of pieces) controller.enqueue(encoder.encode(piece));
      controller.close();
    },
  });
}

function delta(content: string): string {
  return `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`;
}

async function collect(stream: AsyncIterable<ContentChunk>): Promise<string[]> {
  const out: string[] = [];
  for await (const chunk of stream) if (chunk.text) out.push(chunk.text);
  return out;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('twinModelConfigured', () => {
  it('is true only when both env vars are set', () => {
    vi.stubEnv('TWIN_MODEL_URL', 'http://twin.test');
    vi.stubEnv('TWIN_MODEL_API_KEY', 'secret');
    expect(twinModelConfigured()).toBe(true);
  });

  it('is false when either var is missing', () => {
    vi.stubEnv('TWIN_MODEL_URL', 'http://twin.test');
    vi.stubEnv('TWIN_MODEL_API_KEY', '');
    expect(twinModelConfigured()).toBe(false);
    vi.stubEnv('TWIN_MODEL_URL', '');
    vi.stubEnv('TWIN_MODEL_API_KEY', 'secret');
    expect(twinModelConfigured()).toBe(false);
  });
});

describe('parseTwinSse', () => {
  it('yields deltas across multiple events and stops at [DONE]', async () => {
    const stream = sseStream(
      delta('Hello'),
      delta(' world'),
      'data: [DONE]\n\n',
      delta(' ignored'),
    );
    expect(await collect(parseTwinSse(stream))).toEqual(['Hello', ' world']);
  });

  it('ignores malformed data lines and keep-alive comments', async () => {
    const stream = sseStream(
      ': keep-alive\n\n',
      'data: {not valid json\n\n',
      delta('ok'),
    );
    expect(await collect(parseTwinSse(stream))).toEqual(['ok']);
  });

  it('reassembles a delta split across read boundaries', async () => {
    const line = delta('joined');
    const mid = Math.floor(line.length / 2);
    const stream = sseStream(line.slice(0, mid), line.slice(mid));
    expect(await collect(parseTwinSse(stream))).toEqual(['joined']);
  });
});

describe('openTwinModelStream', () => {
  it('throws when not configured', async () => {
    vi.stubEnv('TWIN_MODEL_URL', '');
    vi.stubEnv('TWIN_MODEL_API_KEY', '');
    await expect(openTwinModelStream('sys', [], 'hi')).rejects.toThrow();
  });

  it('sends bearer auth and an OpenAI body, then streams the reply', async () => {
    vi.stubEnv('TWIN_MODEL_URL', 'http://twin.test');
    vi.stubEnv('TWIN_MODEL_API_KEY', 'secret');
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(sseStream(delta('hi there')), { status: 200 }),
      );
    vi.stubGlobal('fetch', fetchMock);

    const stream = await openTwinModelStream(
      'SYSTEM',
      [
        { role: 'user', content: 'earlier' },
        { role: 'assistant', content: 'reply' },
      ],
      'now',
    );
    expect(await collect(stream)).toEqual(['hi there']);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('http://twin.test/v1/chat/completions');
    expect((init.headers as Record<string, string>).authorization).toBe(
      'Bearer secret',
    );
    const body = JSON.parse(String(init.body)) as {
      model?: string;
      stream: boolean;
      max_tokens: number;
      chat_template_kwargs: { enable_thinking: boolean };
      messages: Array<{ role: string; content: string }>;
    };
    expect(body.model).toBeUndefined();
    expect(body.stream).toBe(true);
    expect(body.max_tokens).toBeGreaterThan(0);
    expect(body.chat_template_kwargs.enable_thinking).toBe(false);
    expect(body.messages).toEqual([
      { role: 'system', content: 'SYSTEM' },
      { role: 'user', content: 'earlier' },
      { role: 'assistant', content: 'reply' },
      { role: 'user', content: 'now' },
    ]);
  });

  it('names the model in the body when TWIN_MODEL_NAME is set', async () => {
    vi.stubEnv('TWIN_MODEL_URL', 'http://twin.test');
    vi.stubEnv('TWIN_MODEL_API_KEY', 'secret');
    vi.stubEnv('TWIN_MODEL_NAME', '@cf/some/base-model');
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(sseStream(delta('ok')), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    await collect(await openTwinModelStream('sys', [], 'hi'));

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(init.body)) as { model?: string };
    expect(body.model).toBe('@cf/some/base-model');
  });

  it('throws with the status when the model returns a non-200', async () => {
    vi.stubEnv('TWIN_MODEL_URL', 'http://twin.test');
    vi.stubEnv('TWIN_MODEL_API_KEY', 'secret');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 503 })),
    );
    await expect(openTwinModelStream('sys', [], 'hi')).rejects.toThrow('503');
  });
});

describe('TWIN_MODEL', () => {
  it('is a stable sentinel name', () => {
    expect(TWIN_MODEL).toBe('twin-llm');
  });
});
