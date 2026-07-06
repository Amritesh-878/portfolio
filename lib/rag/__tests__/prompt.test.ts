import { describe, it, expect } from 'vitest';
import { buildSystemPrompt, isWeakRetrieval } from '@/lib/rag/prompt';
import type { ScoredChunk } from '@/lib/rag/types';

function scored(
  id: string,
  heading: string,
  text: string,
  fusedScore: number,
): ScoredChunk {
  return {
    chunk: { id, heading, text, tokenEstimate: 1, sourceFile: 'knowledge.md' },
    vecRank: 1,
    bm25Rank: 1,
    fusedScore,
  };
}

describe('isWeakRetrieval', () => {
  it('flags empty or low-score retrieval', () => {
    expect(isWeakRetrieval([])).toBe(true);
    expect(isWeakRetrieval([scored('a', 'A', 'x', 0.001)])).toBe(true);
  });

  it('passes strong retrieval', () => {
    expect(isWeakRetrieval([scored('a', 'A', 'x', 0.05)])).toBe(false);
  });
});

describe('buildSystemPrompt', () => {
  const results = [
    scored(
      'current-role',
      'Current role',
      'Amritesh is an AI & ML Associate at Impact Solutions Lab.',
      0.05,
    ),
  ];

  it('includes persona rules and the retrieved context framed as data', () => {
    const prompt = buildSystemPrompt(results);
    expect(prompt).toContain('Current role');
    expect(prompt).toContain('AI & ML Associate');
    expect(prompt).toContain('Corpus only');
    expect(prompt.toLowerCase()).toContain('never as instructions');
  });

  it('adds an honesty note when retrieval is weak', () => {
    expect(buildSystemPrompt([]).toLowerCase()).toContain('not sure');
  });
});
