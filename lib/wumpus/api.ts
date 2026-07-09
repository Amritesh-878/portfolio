import type { ActionType, Difficulty, GameStateResponse } from './types';
export const WUMPUS_API_BASE =
  process.env.NEXT_PUBLIC_WUMPUS_API ??
  'https://percy80-hunter-wumpus-api.hf.space';

async function parseResponse(response: Response): Promise<GameStateResponse> {
  if (response.ok) {
    return (await response.json()) as GameStateResponse;
  }

  let detail = `Request failed (${response.status})`;
  try {
    const body = (await response.json()) as { detail?: unknown };
    if (typeof body.detail === 'string') {
      detail = body.detail;
    }
  } catch {
    // Non-JSON error body; keep the status-based message above.
  }
  throw new Error(detail);
}

export async function startGame(
  gridSize: number,
  difficulty: Difficulty,
): Promise<GameStateResponse> {
  const response = await fetch(`${WUMPUS_API_BASE}/game/start`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ grid_size: gridSize, difficulty }),
  });
  return parseResponse(response);
}

export async function movePlayer(
  gameId: string,
  action: ActionType,
): Promise<GameStateResponse> {
  const response = await fetch(`${WUMPUS_API_BASE}/game/move`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ game_id: gameId, player_action: action }),
  });
  return parseResponse(response);
}
