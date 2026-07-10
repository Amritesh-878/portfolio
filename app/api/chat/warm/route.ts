import { twinModelConfigured } from '@/lib/chat/twin-model';

export const runtime = 'nodejs';

const WARM_TIMEOUT_MS = 3_000;

export async function GET(): Promise<Response> {
  const configured = twinModelConfigured();
  if (configured) {
    try {
      await fetch(`${process.env.TWIN_MODEL_URL}/health`, {
        signal: AbortSignal.timeout(WARM_TIMEOUT_MS),
      });
    } catch {
      // Best-effort wake; ignore a cold or sleeping Space.
    }
  }
  return Response.json(
    { twin: configured },
    { headers: { 'cache-control': 'no-store' } },
  );
}
