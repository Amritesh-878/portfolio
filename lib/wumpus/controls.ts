import type { WumpusState } from './reducer';
import type { ActionType, Direction } from './types';

// WASD and the arrow keys both map to the four cardinal moves.
export const CODE_TO_DIRECTION: Record<string, Direction> = {
  KeyW: 'NORTH',
  ArrowUp: 'NORTH',
  KeyS: 'SOUTH',
  ArrowDown: 'SOUTH',
  KeyD: 'EAST',
  ArrowRight: 'EAST',
  KeyA: 'WEST',
  ArrowLeft: 'WEST',
};

export function isTerminal(status: WumpusState['status']): boolean {
  return status !== 'idle' && status !== 'Ongoing';
}

// In aim mode a direction fires the arrow down that corridor; otherwise it steps.
export function directionAction(
  direction: Direction,
  isAiming: boolean,
): ActionType {
  return isAiming ? `SHOOT_${direction}` : direction;
}

export function canMove(params: {
  gameId: string | null;
  status: WumpusState['status'];
  isLoading: boolean;
  inFlight: boolean;
}): boolean {
  return (
    params.gameId !== null &&
    params.status === 'Ongoing' &&
    !params.isLoading &&
    !params.inFlight
  );
}

export function canToggleAim(params: {
  status: WumpusState['status'];
  isLoading: boolean;
  arrowsRemaining: number;
}): boolean {
  return (
    !params.isLoading &&
    params.status === 'Ongoing' &&
    params.arrowsRemaining > 0
  );
}

export type KeyIntent =
  { kind: 'aim' } | { kind: 'move'; direction: Direction };

// Space toggles aim; WASD/arrows move; any other key yields null
export function resolveKey(code: string): KeyIntent | null {
  if (code === 'Space') return { kind: 'aim' };
  const direction = CODE_TO_DIRECTION[code];
  return direction ? { kind: 'move', direction } : null;
}
