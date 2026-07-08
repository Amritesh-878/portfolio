import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '@/app/api/contact/route';

const VALID = {
  name: 'Ada',
  email: 'ada@example.com',
  subject: 'Hello',
  message: 'Nice site.',
  token: 'tok',
};

function post(body: unknown, ip: string): Request {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

interface FetchScript {
  turnstileSuccess?: boolean;
  resendOk?: boolean;
  resendId?: string;
}

function mockFetch(script: FetchScript) {
  return vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.includes('siteverify')) {
      return new Response(
        JSON.stringify({ success: script.turnstileSuccess ?? true }),
        { status: 200 },
      );
    }
    if (url.includes('api.resend.com')) {
      return script.resendOk === false
        ? new Response('{}', { status: 422 })
        : new Response(JSON.stringify({ id: script.resendId ?? 'em_123' }), {
            status: 200,
          });
    }
    throw new Error(`unexpected fetch: ${url}`);
  });
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'secret');
    vi.stubEnv('RESEND_API_KEY', 're_test');
    vi.stubEnv('CONTACT_TO_EMAIL', 'inbox@example.com');
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('rejects invalid JSON with 400', async () => {
    vi.stubGlobal('fetch', mockFetch({}));
    const res = await POST(post('not json', 'c-ip-1'));
    expect(res.status).toBe(400);
  });

  it('rejects a malformed payload with 400', async () => {
    vi.stubGlobal('fetch', mockFetch({}));
    const res = await POST(post({ ...VALID, email: 'bad' }, 'c-ip-2'));
    expect(res.status).toBe(400);
  });

  it('silently accepts and drops a honeypot hit without sending', async () => {
    const fetchMock = mockFetch({});
    vi.stubGlobal('fetch', fetchMock);
    const res = await POST(post({ ...VALID, company: 'spammer' }, 'c-ip-3'));
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns 503 when the pipeline is unconfigured', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    vi.stubGlobal('fetch', mockFetch({}));
    const res = await POST(post(VALID, 'c-ip-4'));
    expect(res.status).toBe(503);
  });

  it('returns 403 when Turnstile verification fails', async () => {
    vi.stubGlobal('fetch', mockFetch({ turnstileSuccess: false }));
    const res = await POST(post(VALID, 'c-ip-5'));
    expect(res.status).toBe(403);
  });

  it('returns 502 when the send fails', async () => {
    vi.stubGlobal('fetch', mockFetch({ resendOk: false }));
    const res = await POST(post(VALID, 'c-ip-6'));
    expect(res.status).toBe(502);
  });

  it('returns 200 with a reference id on success', async () => {
    vi.stubGlobal('fetch', mockFetch({ resendId: 'em_abc' }));
    const res = await POST(post(VALID, 'c-ip-7'));
    expect(res.status).toBe(200);
    const data = (await res.json()) as {
      ok: boolean;
      id: string;
      routedTo: string;
    };
    expect(data.ok).toBe(true);
    expect(data.id).toBe('em_abc');
    expect(data.routedTo).toBe('contact@amritesh.net');
  });

  it('rate-limits after the per-window maximum', async () => {
    vi.stubGlobal('fetch', mockFetch({}));
    const ip = 'c-ip-8';
    for (let i = 0; i < 5; i++) await POST(post(VALID, ip));
    const res = await POST(post(VALID, ip));
    expect(res.status).toBe(429);
  });
});
