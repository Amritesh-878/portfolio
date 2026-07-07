import { describe, expect, it } from 'vitest';

import { initialState, wumpusReducer } from './reducer';
import type { GameStateResponse } from './types';

function response(over: Partial<GameStateResponse> = {}): GameStateResponse {
  return {
    game_id: 'g1',
    status: 'Ongoing',
    grid_size: 8,
    difficulty: 'medium',
    turn: 1,
    player_pos: [1, 0],
    arrows_remaining: 1,
    explored_tiles: [
      [0, 0],
      [1, 0],
    ],
    senses: { breeze: true, stench_direction: null, shine: false },
    message: 'the hunt begins',
    wumpuses_remaining: 1,
    ...over,
  };
}

describe('wumpusReducer', () => {
  it('UPDATE_STATE maps the payload and clears loading and error', () => {
    const next = wumpusReducer(
      { ...initialState, isLoading: true, error: 'stale' },
      { type: 'UPDATE_STATE', payload: response() },
    );
    expect(next.gameId).toBe('g1');
    expect(next.playerPos).toEqual([1, 0]);
    expect(next.status).toBe('Ongoing');
    expect(next.isLoading).toBe(false);
    expect(next.error).toBeNull();
  });

  it('merges explored tiles across turns without duplicates', () => {
    const first = wumpusReducer(initialState, {
      type: 'UPDATE_STATE',
      payload: response({ explored_tiles: [[0, 0]] }),
    });
    const second = wumpusReducer(first, {
      type: 'UPDATE_STATE',
      payload: response({
        explored_tiles: [
          [0, 0],
          [1, 0],
        ],
      }),
    });
    expect(second.exploredTiles).toEqual([
      [0, 0],
      [1, 0],
    ]);
  });

  it('carries terminal outcomes through UPDATE_STATE', () => {
    const lost = wumpusReducer(initialState, {
      type: 'UPDATE_STATE',
      payload: response({ status: 'PlayerLost_Pit' }),
    });
    expect(lost.status).toBe('PlayerLost_Pit');
  });

  it('SET_AIMING toggles aim and SET_ERROR clears loading', () => {
    expect(
      wumpusReducer(initialState, { type: 'SET_AIMING', payload: true })
        .isAiming,
    ).toBe(true);
    const errored = wumpusReducer(
      { ...initialState, isLoading: true },
      { type: 'SET_ERROR', payload: 'boom' },
    );
    expect(errored.error).toBe('boom');
    expect(errored.isLoading).toBe(false);
  });

  it('RESET_STATE returns a fresh initial state', () => {
    const dirty = wumpusReducer(initialState, {
      type: 'UPDATE_STATE',
      payload: response(),
    });
    expect(wumpusReducer(dirty, { type: 'RESET_STATE' })).toEqual(initialState);
  });
});
