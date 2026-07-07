import { WUMPUS_API_BASE } from '@/lib/wumpus/api';

let warmed = false;

// Fire-and-forget wake for the sleeping HF Space, deduped so hover, the popup, and
// the play-page mount together cost at most one request per session. /healthz also
// warms every difficulty's model cache, so the first real move never pays a cold load.
export function prewarmGame(): void {
  if (warmed) return;
  warmed = true;
  void fetch(`${WUMPUS_API_BASE}/healthz`, {
    method: 'GET',
    mode: 'no-cors',
  }).catch(() => {});
}
