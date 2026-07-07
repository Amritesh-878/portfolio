import type { GameStateResponse, GameStatus, Senses } from './types';

export interface WumpusState {
  gameId: string | null;
  status: 'idle' | GameStatus;
  gridSize: number;
  turn: number;
  playerPos: [number, number];
  arrowsRemaining: number;
  exploredTiles: [number, number][];
  senses: Senses;
  message: string;
  isLoading: boolean;
  isAiming: boolean;
  error: string | null;
  difficulty: string;
  wumpusesRemaining: number;
}

export const initialState: WumpusState = {
  gameId: null,
  status: 'idle',
  gridSize: 8,
  turn: 0,
  playerPos: [0, 0],
  arrowsRemaining: 1,
  exploredTiles: [],
  senses: { breeze: false, stench_direction: null, shine: false },
  message: '',
  isLoading: false,
  isAiming: false,
  error: null,
  difficulty: 'medium',
  wumpusesRemaining: 1,
};

export type WumpusAction =
  | { type: 'UPDATE_STATE'; payload: GameStateResponse }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_AIMING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'RESET_STATE' };

function tileKey(x: number, y: number): string {
  return `${x},${y}`;
}

export function wumpusReducer(
  state: WumpusState,
  action: WumpusAction,
): WumpusState {
  switch (action.type) {
    case 'UPDATE_STATE': {
      const seen = new Set(state.exploredTiles.map(([x, y]) => tileKey(x, y)));
      const exploredTiles = [...state.exploredTiles];
      for (const tile of action.payload.explored_tiles) {
        if (!seen.has(tileKey(tile[0], tile[1]))) {
          exploredTiles.push(tile);
        }
      }
      return {
        ...state,
        gameId: action.payload.game_id,
        status: action.payload.status,
        gridSize: action.payload.grid_size,
        turn: action.payload.turn,
        playerPos: action.payload.player_pos,
        arrowsRemaining: action.payload.arrows_remaining,
        exploredTiles,
        senses: action.payload.senses,
        message: action.payload.message,
        difficulty: action.payload.difficulty || state.difficulty,
        wumpusesRemaining: action.payload.wumpuses_remaining,
        isLoading: false,
        error: null,
      };
    }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_AIMING':
      return { ...state, isAiming: action.payload };
    case 'SET_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'RESET_STATE':
      return { ...initialState };
    default:
      return state;
  }
}
