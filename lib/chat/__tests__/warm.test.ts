import { afterEach, describe, expect, it, vi } from 'vitest';
import { GET } from '@/app/api/chat/warm/route';

describe('GET /api/chat/warm', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('reports the twin unavailable when unconfigured, without a ping', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const res = await GET();

    expect(await res.json()).toEqual({ twin: false });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('pings health and reports the twin available when configured', async () => {
    vi.stubEnv('TWIN_MODEL_URL', 'http://twin.test');
    vi.stubEnv('TWIN_MODEL_API_KEY', 'twin-secret');
    const fetchMock = vi.fn().mockResolvedValue(new Response(null));
    vi.stubGlobal('fetch', fetchMock);

    const res = await GET();

    expect(await res.json()).toEqual({ twin: true });
    expect(fetchMock).toHaveBeenCalledWith(
      'http://twin.test/health',
      expect.anything(),
    );
  });

  it('still reports the twin available when the wake ping fails', async () => {
    vi.stubEnv('TWIN_MODEL_URL', 'http://twin.test');
    vi.stubEnv('TWIN_MODEL_API_KEY', 'twin-secret');
    const fetchMock = vi.fn().mockRejectedValue(new Error('cold start'));
    vi.stubGlobal('fetch', fetchMock);

    const res = await GET();

    expect(await res.json()).toEqual({ twin: true });
  });
});
