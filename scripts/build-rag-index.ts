import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { chunkMarkdown } from '../lib/rag/chunker';
import { embed, embeddingModel } from '../lib/rag/embeddings';
import { assembleIndex } from '../lib/rag/build-index';
import type { RagIndex } from '../lib/rag/types';

// Load .env for local runs; on Vercel the vars are already in process.env.
try {
  process.loadEnvFile();
} catch {
  /* no .env file (e.g. on Vercel); use the injected environment */
}

const CORPUS_FILE = join(process.cwd(), 'content', 'ai-twin', 'knowledge.md');
const OUTPUT_FILE = join(process.cwd(), 'src', 'generated', 'rag-index.json');

function readExistingIndex(): RagIndex | null {
  if (!existsSync(OUTPUT_FILE)) return null;
  try {
    return JSON.parse(readFileSync(OUTPUT_FILE, 'utf8')) as RagIndex;
  } catch {
    return null;
  }
}

async function main(): Promise<void> {
  const corpus = readFileSync(CORPUS_FILE, 'utf8');
  const corpusHash = createHash('sha256').update(corpus).digest('hex');
  const model = embeddingModel();
  const existing = readExistingIndex();

  // A matching committed index lets deploys skip embedding entirely; the daily
  // embed cap cannot fund re-embedding on every deploy.
  if (existing?.model === model && existing.corpusHash === corpusHash) {
    console.log('RAG index is current; reusing the committed index.');
    return;
  }

  const chunks = chunkMarkdown(corpus, 'knowledge.md');
  if (chunks.length === 0) {
    throw new Error(`No chunks produced from ${CORPUS_FILE}.`);
  }

  console.log(`Embedding ${chunks.length} chunks with ${model}...`);
  let index: RagIndex;
  try {
    const vectors: number[][] = [];
    for (const chunk of chunks) {
      vectors.push(await embed(chunk.text, 'RETRIEVAL_DOCUMENT'));
    }
    index = assembleIndex(
      chunks,
      vectors,
      model,
      new Date().toISOString(),
      corpusHash,
    );
  } catch (error) {
    if (existing) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(
        `\nEmbedding unavailable (${message.slice(0, 140)})\n` +
          'Keeping the existing index so the build can proceed.\n',
      );
      return;
    }
    throw error;
  }

  mkdirSync(dirname(OUTPUT_FILE), { recursive: true });
  writeFileSync(OUTPUT_FILE, JSON.stringify(index));
  console.log(
    `Wrote ${OUTPUT_FILE}: ${chunks.length} chunks, ${index.vectors[0].length}-dim vectors.`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`\nRAG index build failed:\n  ${message}\n`);
  process.exit(1);
});
