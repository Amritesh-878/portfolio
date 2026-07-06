import { describe, it, expect } from 'vitest';
import { tokenize, buildBm25, bm25Score, bm25TopK } from '@/lib/rag/bm25';
import type { Chunk } from '@/lib/rag/types';

function chunk(id: string, text: string): Chunk {
  return { id, heading: id, text, tokenEstimate: 1, sourceFile: 'k.md' };
}

const CORPUS: Chunk[] = [
  chunk('a', 'reinforcement learning agent'),
  chunk('b', 'retrieval augmented generation rag'),
  chunk('c', 'the learning the learning the'),
];

describe('tokenize', () => {
  it('lowercases, splits on punctuation, and drops single-char tokens', () => {
    expect(tokenize('Hello, World! a b RAG-system')).toEqual([
      'hello',
      'world',
      'rag',
      'system',
    ]);
  });
});

describe('buildBm25', () => {
  it('computes document frequency, lengths, and average length', () => {
    const stats = buildBm25(CORPUS);
    expect(stats.docCount).toBe(3);
    expect(stats.df.learning).toBe(2);
    expect(stats.df.reinforcement).toBe(1);
    expect(stats.docLengths).toEqual([3, 4, 5]);
    expect(stats.avgDocLength).toBe(4);
  });
});

describe('bm25Score', () => {
  it('scores documents containing a query term above zero and misses at zero', () => {
    const stats = buildBm25(CORPUS);
    expect(bm25Score('rag', 1, stats)).toBeGreaterThan(0);
    expect(bm25Score('rag', 0, stats)).toBe(0);
  });

  it('ranks a rarer term above a common one for the same document', () => {
    const stats = buildBm25(CORPUS);
    expect(bm25Score('reinforcement', 0, stats)).toBeGreaterThan(
      bm25Score('learning', 0, stats),
    );
  });
});

describe('bm25TopK', () => {
  it('ranks the document with the most query-term matches first', () => {
    const stats = buildBm25(CORPUS);
    const top = bm25TopK('reinforcement learning', stats, 3);
    expect(top[0].index).toBe(0);
    expect(top.every((entry) => entry.score > 0)).toBe(true);
  });

  it('retrieves the exact-term document for a keyword query', () => {
    const stats = buildBm25(CORPUS);
    const top = bm25TopK('rag', stats, 3);
    expect(top).toHaveLength(1);
    expect(top[0].index).toBe(1);
  });
});
