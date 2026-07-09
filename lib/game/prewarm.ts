import { WUMPUS_API_BASE } from '@/lib/wumpus/api';

let warmed = false;
export function prewarmGame(): void {
  if (warmed) return;
  warmed = true;
  void fetch(`${WUMPUS_API_BASE}/healthz`, {
    method: 'GET',
    mode: 'no-cors',
  }).catch(() => {});
}
