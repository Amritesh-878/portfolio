import { GoogleGenAI } from '@google/genai';

const MODEL = 'gemini-embedding-001';
const OUTPUT_DIMENSIONS = 768;
const MAX_ATTEMPTS = 4;

export type EmbeddingTask = 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY';

export function embeddingModel(): string {
  return MODEL;
}

function requireClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not set. Add it to .env.local for local runs, and to the Vercel project environment variables for deploys.',
    );
  }
  return new GoogleGenAI({ apiKey });
}

function unitNormalize(vector: number[]): number[] {
  const magnitude = Math.sqrt(
    vector.reduce((sum, value) => sum + value * value, 0),
  );
  return magnitude === 0 ? vector : vector.map((value) => value / magnitude);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function embed(
  text: string,
  task: EmbeddingTask,
): Promise<number[]> {
  const ai = requireClient();
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await ai.models.embedContent({
        model: MODEL,
        contents: text,
        config: { outputDimensionality: OUTPUT_DIMENSIONS, taskType: task },
      });
      const values = response.embeddings?.[0]?.values;
      if (!values || values.length === 0) {
        throw new Error('Gemini returned an empty embedding.');
      }
      // Gemini embeddings truncated below 3072 dims are not unit vectors, so
      // normalize here to let cosine similarity reduce to a dot product later.
      return unitNormalize(values);
    } catch (error) {
      lastError = error;
      if (attempt < MAX_ATTEMPTS) await sleep(250 * 2 ** (attempt - 1));
    }
  }
  throw new Error(
    `Gemini embedding failed after ${MAX_ATTEMPTS} attempts: ${String(lastError)}`,
  );
}
