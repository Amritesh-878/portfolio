import { bm25TopK } from './bm25';
import type { RagIndex, ScoredChunk } from './types';

const RRF_K = 60;
const PER_RETRIEVER_K = 8;

function dot(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

// Index and query vectors are unit-normalized, so cosine similarity is a dot product.
function cosineRanking(
  queryVector: number[],
  vectors: number[][],
  k: number,
): number[] {
  return vectors
    .map((vec, index) => ({ index, score: dot(queryVector, vec) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((entry) => entry.index);
}

// Reciprocal Rank Fusion: score(doc) = Σ 1/(RRF_K + rank). It fuses the two
// rankings without having to calibrate the retrievers' incomparable raw scores.
export function reciprocalRankFusion(
  rankings: number[][],
): Map<number, number> {
  const scores = new Map<number, number>();
  for (const ranking of rankings) {
    ranking.forEach((docIndex, position) => {
      const contribution = 1 / (RRF_K + position + 1);
      scores.set(docIndex, (scores.get(docIndex) ?? 0) + contribution);
    });
  }
  return scores;
}

export function retrieve(
  queryVector: number[],
  query: string,
  index: RagIndex,
  k = 4,
): ScoredChunk[] {
  const vectorRanking = cosineRanking(
    queryVector,
    index.vectors,
    PER_RETRIEVER_K,
  );
  const bm25Ranking = bm25TopK(query, index.bm25, PER_RETRIEVER_K).map(
    (entry) => entry.index,
  );

  const vectorRankOf = new Map(
    vectorRanking.map((docIndex, position) => [docIndex, position + 1]),
  );
  const bm25RankOf = new Map(
    bm25Ranking.map((docIndex, position) => [docIndex, position + 1]),
  );

  const fused = reciprocalRankFusion([vectorRanking, bm25Ranking]);
  return [...fused.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([docIndex, fusedScore]) => ({
      chunk: index.chunks[docIndex],
      vecRank: vectorRankOf.get(docIndex) ?? null,
      bm25Rank: bm25RankOf.get(docIndex) ?? null,
      fusedScore,
    }));
}

// Degraded retrieval when query embedding is unavailable; BM25 is fully local.
export function retrieveBm25Only(
  query: string,
  index: RagIndex,
  k = 4,
): ScoredChunk[] {
  const bm25Ranking = bm25TopK(query, index.bm25, PER_RETRIEVER_K).map(
    (entry) => entry.index,
  );
  const fused = reciprocalRankFusion([bm25Ranking]);
  return bm25Ranking.slice(0, k).map((docIndex, position) => ({
    chunk: index.chunks[docIndex],
    vecRank: null,
    bm25Rank: position + 1,
    fusedScore: fused.get(docIndex) ?? 0,
  }));
}
