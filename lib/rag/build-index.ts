import { buildBm25 } from './bm25';
import type { Chunk, RagIndex } from './types';

export const SCHEMA_VERSION = 1;

export function assembleIndex(
  chunks: Chunk[],
  vectors: number[][],
  model: string,
  builtAt: string,
): RagIndex {
  if (chunks.length !== vectors.length) {
    throw new Error(
      `Chunk/vector count mismatch: ${chunks.length} chunks vs ${vectors.length} vectors.`,
    );
  }
  return {
    schemaVersion: SCHEMA_VERSION,
    model,
    builtAt,
    chunks,
    vectors,
    bm25: buildBm25(chunks),
  };
}
