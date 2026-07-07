export type Difficulty =
  | 'easy'
  | 'medium'
  | 'hard'
  | 'impossible_i'
  | 'impossible_ii'
  | 'impossible_iii';

export type Direction = 'NORTH' | 'SOUTH' | 'EAST' | 'WEST';

export type ActionType = Direction | `SHOOT_${Direction}`;

export type GameStatus =
  | 'Ongoing'
  | 'PlayerWon'
  | 'WumpusKilled'
  | 'PlayerLost_Pit'
  | 'PlayerLost_Wumpus';

export interface Senses {
  breeze: boolean;
  stench_direction: string | null;
  shine: boolean;
}

export interface GameStateResponse {
  game_id: string;
  status: GameStatus;
  grid_size: number;
  difficulty: string;
  turn: number;
  player_pos: [number, number];
  arrows_remaining: number;
  explored_tiles: [number, number][];
  senses: Senses;
  message: string;
  wumpuses_remaining: number;
}
