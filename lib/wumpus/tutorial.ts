import type { Direction, GameStatus, Senses } from './types';

export type Coord = [number, number];

export type TutorialPhase =
  | 'welcome'
  | 'move'
  | 'breeze'
  | 'stench'
  | 'wumpus_killed'
  | 'shine'
  | 'complete'
  | 'death_pit'
  | 'death_wumpus'
  | 'exploring'
  | 'aim'
  | 'find_gold';

export const GRID_SIZE = 10;
export const START_POS: Coord = [0, 0];
export const PIT_TILES: Coord[] = [
  [3, 2],
  [6, 1],
  [8, 4],
  [2, 7],
  [7, 7],
];
export const WUMPUS_POS: Coord = [6, 5];
export const GOLD_POS: Coord = [4, 8];

export const POPUP_PHASES = new Set<TutorialPhase>([
  'welcome',
  'move',
  'breeze',
  'stench',
  'wumpus_killed',
  'shine',
  'complete',
  'death_pit',
  'death_wumpus',
]);

export function toTileKey([x, y]: Coord): string {
  return `${x},${y}`;
}

export function isSameTile(a: Coord, b: Coord): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

export function isAdjacent(a: Coord, b: Coord): boolean {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) === 1;
}

export function getStenchDirection(
  player: Coord,
  target: Coord,
): Direction | null {
  const dx = target[0] - player[0];
  const dy = target[1] - player[1];
  if (dx === 0 && dy === -1) return 'NORTH';
  if (dx === 0 && dy === 1) return 'SOUTH';
  if (dx === 1 && dy === 0) return 'EAST';
  if (dx === -1 && dy === 0) return 'WEST';
  return null;
}

export function getSenses(player: Coord, isWumpusAlive: boolean): Senses {
  return {
    breeze: PIT_TILES.some((pit) => isAdjacent(player, pit)),
    stench_direction: isWumpusAlive
      ? getStenchDirection(player, WUMPUS_POS)
      : null,
    shine: isAdjacent(player, GOLD_POS) || isSameTile(player, GOLD_POS),
  };
}

export function getNextPosition(player: Coord, direction: Direction): Coord {
  const [x, y] = player;
  switch (direction) {
    case 'NORTH':
      return [x, Math.max(0, y - 1)];
    case 'SOUTH':
      return [x, Math.min(GRID_SIZE - 1, y + 1)];
    case 'EAST':
      return [Math.min(GRID_SIZE - 1, x + 1), y];
    case 'WEST':
      return [Math.max(0, x - 1), y];
    default:
      return player;
  }
}

export function canHitWumpus(player: Coord, direction: Direction): boolean {
  const [px, py] = player;
  const [wx, wy] = WUMPUS_POS;
  if (direction === 'NORTH') return px === wx && wy < py;
  if (direction === 'SOUTH') return px === wx && wy > py;
  if (direction === 'EAST') return py === wy && wx > px;
  if (direction === 'WEST') return py === wy && wx < px;
  return false;
}

// After a teaching death the player is stepped back, so the run resumes at the
// phase it would have reached had the fatal step been a safe one.
export function resolvePostDeathPhase(phase: TutorialPhase): TutorialPhase {
  if (phase === 'welcome' || phase === 'move') return 'exploring';
  if (phase === 'stench') return 'aim';
  return phase;
}

export function gridStatusFor(phase: TutorialPhase): GameStatus {
  if (phase === 'death_pit') return 'PlayerLost_Pit';
  if (phase === 'death_wumpus') return 'PlayerLost_Wumpus';
  if (phase === 'complete') return 'PlayerWon';
  return 'Ongoing';
}
