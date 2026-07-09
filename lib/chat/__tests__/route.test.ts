import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { generateContentStream, embedMock } = vi.hoisted(() => ({
  generateContentStream: vi.fn(),
  embedMock: vi.fn(),
}));

vi.mock('@google/genai', () => ({
  GoogleGenAI: class {
    models = { generateContentStream };
  },
}));

vi.mock('@/lib/rag/embeddings', () => ({
  embed: embedMock,
  embeddingModel: () => 'gemini-embedding-001',
}));

import { POST } from '@/app/api/chat/route';

function post(body: string, ip: string): Request {
  return new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body,
  });
}

function ask(message: string, ip: string): Request {
  return post(JSON.stringify({ message, history: [] }), ip);
}

function sseResponse(...texts: string[]): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const text of texts) {
        const event = { choices: [{ delta: { content: text } }] };
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(event)}\n\n`),
        );
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });
  return new Response(stream, { status: 200 });
}

function geminiStream(...texts: string[]): AsyncIterable<{ text: string }> {
  return {
    async *[Symbol.asyncIterator]() {
      for (const text of texts) yield { text };
    },
  };
}

async function readBody(res: Response): Promise<string> {
  if (!res.body) throw new Error('response has no body');
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let out = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    out += decoder.decode(value, { stream: true });
  }
  return out;
}

describe('POST /api/chat guards', () => {
  it('rejects invalid JSON with 400', async () => {
    const res = await POST(post('not json', 'route-ip-1'));
    expect(res.status).toBe(400);
  });

  it('rejects an empty message with 400', async () => {
    const res = await POST(
      post(JSON.stringify({ message: '   ' }), 'route-ip-2'),
    );
    expect(res.status).toBe(400);
  });

  it('rate-limits after the per-window maximum', async () => {
    const ip = 'route-ip-3';
    for (let i = 0; i < 12; i++) await POST(post('not json', ip));
    const res = await POST(post('not json', ip));
    expect(res.status).toBe(429);
  });
});

describe('POST /api/chat tier-3 fallback', () => {
  beforeEach(() => {
    vi.stubEnv('GEMINI_API_KEY', 'test-key');
    embedMock.mockReset();
    embedMock.mockResolvedValue(new Array(768).fill(0.1));
    generateContentStream.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('does not attempt the twin when the env vars are unset', async () => {
    generateContentStream.mockReturnValue(
      Promise.resolve(geminiStream('gemini answer')),
    );
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const res = await POST(ask('what is the wumpus paper?', 'route-twin-off'));
    const body = await readBody(res);

    expect(res.status).toBe(200);
    expect(body).toContain('gemini answer');
    expect(body).not.toContain('self-hosted model answered');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('falls through both Gemini tiers to the twin and labels the answer', async () => {
    vi.stubEnv('TWIN_MODEL_URL', 'http://twin.test');
    vi.stubEnv('TWIN_MODEL_API_KEY', 'twin-secret');
    generateContentStream.mockRejectedValue({ status: 429 });
    const fetchMock = vi
      .fn()
      .mockResolvedValue(sseResponse('The Wumpus paper ', 'is real.'));
    vi.stubGlobal('fetch', fetchMock);

    const res = await POST(ask('what is the wumpus paper?', 'route-twin-on'));
    const body = await readBody(res);

    expect(res.status).toBe(200);
    expect(generateContentStream).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url] = fetchMock.mock.calls[0] as [string];
    expect(url).toBe('http://twin.test/v1/chat/completions');
    expect(body).toContain('The Wumpus paper is real.');
    expect(body).toContain('self-hosted model answered this one');
  });
});

describe('POST /api/chat degraded retrieval', () => {
  beforeEach(() => {
    vi.stubEnv('GEMINI_API_KEY', 'test-key');
    embedMock.mockReset();
    generateContentStream.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('degrades to BM25-only and still answers when embedding fails', async () => {
    embedMock.mockRejectedValue(new Error('embed quota exhausted'));
    generateContentStream.mockReturnValue(
      Promise.resolve(geminiStream('answered from keywords')),
    );

    const res = await POST(
      ask('reinforcement learning wumpus', 'route-degrade'),
    );
    const body = await readBody(res);
    const headerLine = body.slice(0, body.indexOf('\n'));

    expect(res.status).toBe(200);
    expect(JSON.parse(headerLine)).toMatchObject({ retrieval: 'bm25-only' });
    expect(body).toContain('answered from keywords');
    expect(embedMock).toHaveBeenCalledOnce();
  });
});
