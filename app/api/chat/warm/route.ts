export const runtime = 'nodejs';

const WARM_TIMEOUT_MS = 3_000;

export async function GET(): Promise<Response> {
  const url = process.env.TWIN_MODEL_URL;
  if (url && process.env.TWIN_MODEL_API_KEY) {
    try {
      await fetch(`${url}/health`, {
        signal: AbortSignal.timeout(WARM_TIMEOUT_MS),
      });
    } catch {
      // Best-effort wake; ignore a cold or sleeping Space.
    }
  }
  return new Response(null, { status: 204 });
}
