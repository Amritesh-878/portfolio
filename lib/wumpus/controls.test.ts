import { describe, expect, it } from 'vitest';

import {
  canMove,
  canToggleAim,
  directionAction,
  isTerminal,
  resolveKey,
} from './controls';
import type { Direction, GameStatus } from './types';

const DIRECTIONS: Direction[] = ['NORTH', 'SOUTH', 'EAST', 'WEST'];

describe('resolveKey', () => {
  it('maps both WASD and the arrow keys to the four moves', () => {
    const cases: [string, Direction][] = [
      ['KeyW', 'NORTH'],
      ['ArrowUp', 'NORTH'],
      ['KeyS', 'SOUTH'],
      ['ArrowDown', 'SOUTH'],
      ['KeyD', 'EAST'],
      ['ArrowRight', 'EAST'],
      ['KeyA', 'WEST'],
      ['ArrowLeft', 'WEST'],
    ];
    for (const [code, direction] of cases) {
      expect(resolveKey(code), code).toEqual({ kind: 'move', direction });
    }
  });

  it('treats Space as the aim toggle', () => {
    expect(resolveKey('Space')).toEqual({ kind: 'aim' });
  });

  it('ignores any other key so the caller can skip preventDefault', () => {
    expect(resolveKey('Enter')).toBeNull();
    expect(resolveKey('KeyQ')).toBeNull();
  });
});

describe('directionAction', () => {
  it('steps in move mode', () => {
    for (const direction of DIRECTIONS) {
      expect(directionAction(direction, false)).toBe(direction);
    }
  });

  it('fires down the corridor in aim mode', () => {
    for (const direction of DIRECTIONS) {
      expect(directionAction(direction, true)).toBe(`SHOOT_${direction}`);
    }
  });
});

describe('isTerminal', () => {
  it('is false while the game is idle or ongoing', () => {
    expect(isTerminal('idle')).toBe(false);
    expect(isTerminal('Ongoing')).toBe(false);
  });

  it('is true for every end state', () => {
    const ends: GameStatus[] = [
      'PlayerWon',
      'WumpusKilled',
      'PlayerLost_Pit',
      'PlayerLost_Wumpus',
    ];
    for (const status of ends) {
      expect(isTerminal(status), status).toBe(true);
    }
  });
});

describe('canMove', () => {
  const ready = {
    gameId: 'g1',
    status: 'Ongoing' as const,
    isLoading: false,
    inFlight: false,
  };

  it('allows a move once a game is live and idle', () => {
    expect(canMove(ready)).toBe(true);
  });

  it('blocks before a game exists', () => {
    expect(canMove({ ...ready, gameId: null })).toBe(false);
  });

  it('blocks once the game has ended', () => {
    expect(canMove({ ...ready, status: 'PlayerWon' })).toBe(false);
  });

  it('blocks while loading or a request is already in flight', () => {
    expect(canMove({ ...ready, isLoading: true })).toBe(false);
    expect(canMove({ ...ready, inFlight: true })).toBe(false);
  });
});

describe('canToggleAim', () => {
  const ready = {
    status: 'Ongoing' as const,
    isLoading: false,
    arrowsRemaining: 1,
  };

  it('allows aiming with an arrow in hand on a live turn', () => {
    expect(canToggleAim(ready)).toBe(true);
  });

  it('blocks with no arrows left', () => {
    expect(canToggleAim({ ...ready, arrowsRemaining: 0 })).toBe(false);
  });

  it('blocks while loading or after the game ends', () => {
    expect(canToggleAim({ ...ready, isLoading: true })).toBe(false);
    expect(canToggleAim({ ...ready, status: 'PlayerLost_Pit' })).toBe(false);
  });
});
