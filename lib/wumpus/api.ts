import type { ActionType, Difficulty, GameStateResponse } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_WUMPUS_API;

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
  if (!BASE_URL) throw new Error('The game backend is not configured.');
  const response = await fetch(`${BASE_URL}/game/start`, {
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
  if (!BASE_URL) throw new Error('The game backend is not configured.');
  const response = await fetch(`${BASE_URL}/game/move`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ game_id: gameId, player_action: action }),
  });
  return parseResponse(response);
}

// The backend sleeps on the free HF tier; a fire-and-forget ping on mount wakes
// the container so the player's first real request isn't the ~30s cold start.
export function warmBackend(): void {
  if (!BASE_URL) return;
  void fetch(`${BASE_URL}/docs`, { method: 'GET', mode: 'no-cors' }).catch(
    () => {},
  );
}
