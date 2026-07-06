import { describe, it, expect } from 'vitest';
import { retrieve, reciprocalRankFusion } from '@/lib/rag/retrieve';
import { buildBm25 } from '@/lib/rag/bm25';
import type { Chunk, RagIndex } from '@/lib/rag/types';

function chunk(id: string, text: string): Chunk {
  return { id, heading: id, text, tokenEstimate: 1, sourceFile: 'k.md' };
}

describe('reciprocalRankFusion', () => {
  it('rewards documents ranked highly by multiple retrievers', () => {
    const fused = reciprocalRankFusion([
      [0, 1, 2],
      [0, 2, 1],
    ]);
    const ranked = [...fused.entries()].sort((a, b) => b[1] - a[1]);
    expect(ranked[0][0]).toBe(0);
  });
});

describe('retrieve', () => {
  const chunks = [
    chunk('rl', 'reinforcement learning wumpus agent'),
    chunk('rag', 'retrieval augmented generation chatbot'),
    chunk('patent', 'railway track monitoring patent device'),
  ];
  const index: RagIndex = {
    schemaVersion: 1,
    model: 'm',
    builtAt: 't',
    chunks,
    vectors: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
    bm25: buildBm25(chunks),
  };

  it('returns fused results with per-retriever ranks for the trace', () => {
    const results = retrieve([0, 1, 0], 'retrieval chatbot', index, 2);
    expect(results.length).toBeLessThanOrEqual(2);
    expect(results[0].chunk.id).toBe('rag');
    expect(results[0].fusedScore).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('vecRank');
    expect(results[0]).toHaveProperty('bm25Rank');
  });

  it('surfaces an exact-keyword match the vector query misses', () => {
    const results = retrieve([0, 1, 0], 'patent railway', index, 3);
    expect(results.map((r) => r.chunk.id)).toContain('patent');
  });
});
