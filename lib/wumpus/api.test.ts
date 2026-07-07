import { afterEach, describe, expect, it, vi } from 'vitest';

import { movePlayer, startGame, WUMPUS_API_BASE } from './api';

function ok(): Response {
  return new Response(JSON.stringify({ status: 'Ongoing' }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}

afterEach(() => vi.unstubAllGlobals());

describe('wumpus api', () => {
  it('defaults the base URL to the deployed Space', () => {
    expect(WUMPUS_API_BASE).toContain('hf.space');
  });

  it('startGame posts grid size and difficulty', async () => {
    const fetchMock = vi.fn().mockResolvedValue(ok());
    vi.stubGlobal('fetch', fetchMock);
    await startGame(6, 'easy');
    const [url, opts] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/game/start');
    expect(JSON.parse(opts.body as string)).toEqual({
      grid_size: 6,
      difficulty: 'easy',
    });
  });

  it('movePlayer posts the game id and action', async () => {
    const fetchMock = vi.fn().mockResolvedValue(ok());
    vi.stubGlobal('fetch', fetchMock);
    await movePlayer('g1', 'EAST');
    const [url, opts] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/game/move');
    expect(JSON.parse(opts.body as string)).toEqual({
      game_id: 'g1',
      player_action: 'EAST',
    });
  });

  it('normalizes a non-ok response into an Error carrying the detail', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ detail: 'No arrows remaining.' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);
    await expect(movePlayer('g1', 'SHOOT_EAST')).rejects.toThrow(
      'No arrows remaining.',
    );
  });
});
