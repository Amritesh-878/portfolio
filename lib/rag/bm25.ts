import type { Bm25Stats, Chunk } from '@/lib/rag/types';

// Standard BM25 tuning constants: k1 controls term-frequency saturation,
// b controls length normalization. 1.5 / 0.75 are the common defaults.
const K1 = 1.5;
const B = 0.75;

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter((token) => token.length > 1);
}

export function buildBm25(chunks: Chunk[]): Bm25Stats {
  const termFreqs: Array<Record<string, number>> = [];
  const df: Record<string, number> = {};
  const docLengths: number[] = [];

  for (const chunk of chunks) {
    const tokens = tokenize(chunk.text);
    docLengths.push(tokens.length);
    const tf: Record<string, number> = {};
    for (const token of tokens) tf[token] = (tf[token] ?? 0) + 1;
    termFreqs.push(tf);
    for (const term of Object.keys(tf)) df[term] = (df[term] ?? 0) + 1;
  }

  const docCount = chunks.length;
  const totalLength = docLengths.reduce((sum, len) => sum + len, 0);

  return {
    df,
    termFreqs,
    docLengths,
    avgDocLength: docCount === 0 ? 0 : totalLength / docCount,
    docCount,
  };
}

function idf(term: string, stats: Bm25Stats): number {
  const n = stats.df[term] ?? 0;
  // Smoothed BM25 idf; the outer 1 + keeps it strictly positive for a curated
  // corpus where no term appears in every document.
  return Math.log(1 + (stats.docCount - n + 0.5) / (n + 0.5));
}

export function bm25Score(
  query: string,
  docIndex: number,
  stats: Bm25Stats,
): number {
  const tf = stats.termFreqs[docIndex];
  if (!tf) return 0;
  const docLength = stats.docLengths[docIndex];
  const avg = stats.avgDocLength || 1;
  let score = 0;
  for (const term of tokenize(query)) {
    const freq = tf[term] ?? 0;
    if (freq === 0) continue;
    const denominator = freq + K1 * (1 - B + (B * docLength) / avg);
    score += idf(term, stats) * ((freq * (K1 + 1)) / denominator);
  }
  return score;
}

export function bm25TopK(
  query: string,
  stats: Bm25Stats,
  k: number,
): Array<{ index: number; score: number }> {
  return stats.termFreqs
    .map((_, index) => ({ index, score: bm25Score(query, index, stats) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
