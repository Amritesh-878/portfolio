import { describe, it, expect } from 'vitest';
import { assembleIndex, SCHEMA_VERSION } from '@/lib/rag/build-index';
import { buildBm25 } from '@/lib/rag/bm25';
import type { Chunk } from '@/lib/rag/types';

const chunks: Chunk[] = [
  {
    id: 'a',
    heading: 'A',
    text: 'reinforcement learning agent',
    tokenEstimate: 7,
    sourceFile: 'knowledge.md',
  },
  {
    id: 'b',
    heading: 'B',
    text: 'retrieval augmented generation',
    tokenEstimate: 7,
    sourceFile: 'knowledge.md',
  },
];
const vectors = [
  [0.1, 0.2],
  [0.3, 0.4],
];

describe('assembleIndex', () => {
  it('records schema version, model, builtAt, chunks, and vectors', () => {
    const index = assembleIndex(
      chunks,
      vectors,
      'gemini-embedding-001',
      '2026-07-07T00:00:00.000Z',
    );
    expect(index.schemaVersion).toBe(SCHEMA_VERSION);
    expect(index.model).toBe('gemini-embedding-001');
    expect(index.builtAt).toBe('2026-07-07T00:00:00.000Z');
    expect(index.chunks).toEqual(chunks);
    expect(index.vectors).toEqual(vectors);
  });

  it('embeds bm25 statistics computed from the same chunks', () => {
    const index = assembleIndex(chunks, vectors, 'm', 't');
    expect(index.bm25).toEqual(buildBm25(chunks));
    expect(index.bm25.docCount).toBe(2);
  });

  it('is deterministic for identical inputs', () => {
    const a = assembleIndex(chunks, vectors, 'm', 't');
    const b = assembleIndex(chunks, vectors, 'm', 't');
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('rejects a chunk/vector count mismatch', () => {
    expect(() => assembleIndex(chunks, [[0.1, 0.2]], 'm', 't')).toThrow(
      /mismatch/,
    );
  });
});
