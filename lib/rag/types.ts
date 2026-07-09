export interface Chunk {
  id: string;
  heading: string;
  text: string;
  tokenEstimate: number;
  sourceFile: string;
}

export interface ChunkOptions {
  maxTokens?: number;
  overlapTokens?: number;
}

export interface ScoredChunk {
  chunk: Chunk;
  vecRank: number | null;
  bm25Rank: number | null;
  fusedScore: number;
}

export interface Bm25Stats {
  df: Record<string, number>;
  termFreqs: Array<Record<string, number>>;
  docLengths: number[];
  avgDocLength: number;
  docCount: number;
}

export interface RagIndex {
  schemaVersion: number;
  model: string;
  builtAt: string;
  // sha256 of the corpus; a match lets deploys reuse the index. Absent in pre-hash indexes.
  corpusHash?: string;
  chunks: Chunk[];
  vectors: number[][];
  bm25: Bm25Stats;
}
