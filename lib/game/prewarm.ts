import { WUMPUS_API_BASE } from '@/lib/wumpus/api';

let warmed = false;

// Fire-and-forget wake for the sleeping HF Space, deduped so hover, the popup, and
// the play-page mount together cost at most one request per session.
export function prewarmGame(): void {
  if (warmed) return;
  warmed = true;
  void fetch(`${WUMPUS_API_BASE}/docs`, {
    method: 'GET',
    mode: 'no-cors',
  }).catch(() => {});
}
