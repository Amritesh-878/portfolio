// Primary first, higher-free-tier-quota fallback second: when the primary model's
// daily free-tier cap is spent, generation 429s while embeddings (a separate quota)
// still work, so the twin must fall through rather than die at the answer step.
export const CHAT_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
] as const;

export function isQuotaError(error: unknown): boolean {
  if (
    error &&
    typeof error === 'object' &&
    (error as { status?: unknown }).status === 429
  ) {
    return true;
  }
  return /\b429\b|RESOURCE_EXHAUSTED|quota/i.test(String(error));
}

export interface ContentChunk {
  text?: string;
}

export type StreamFactory = (
  model: string,
) => Promise<AsyncIterable<ContentChunk>>;

export interface StreamResult {
  emitted: boolean;
  error: unknown;
  model: string | null;
}

export async function streamWithFallback(
  models: readonly string[],
  openStream: StreamFactory,
  onText: (text: string) => void,
): Promise<StreamResult> {
  let emitted = false;
  let emittingModel: string | null = null;
  let lastError: unknown;
  for (const model of models) {
    try {
      const response = await openStream(model);
      for await (const chunk of response) {
        if (chunk.text) {
          onText(chunk.text);
          emitted = true;
          emittingModel = model;
        }
      }
      return { emitted, error: undefined, model: emittingModel };
    } catch (error) {
      lastError = error;
      console.error(`[twin] ${model} generation failed:`, error);
      // Once tokens are on the wire, restarting with the next model would replay a
      // duplicate answer to the reader, so stop and let the caller append a note.
      if (emitted) break;
    }
  }
  return { emitted, error: lastError, model: emittingModel };
}
