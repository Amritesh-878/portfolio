import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('prewarmGame', () => {
  beforeEach(() => {
    vi.resetModules();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('pings the backend once no matter how many callers fire', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null));
    vi.stubGlobal('fetch', fetchMock);
    const { prewarmGame } = await import('./prewarm');
    prewarmGame();
    prewarmGame();
    prewarmGame();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('swallows network errors instead of throwing', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('offline'));
    vi.stubGlobal('fetch', fetchMock);
    const { prewarmGame } = await import('./prewarm');
    expect(() => prewarmGame()).not.toThrow();
  });
});
