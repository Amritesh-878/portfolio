import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { chunkMarkdown } from '../lib/rag/chunker';
import { embed, embeddingModel } from '../lib/rag/embeddings';
import { assembleIndex } from '../lib/rag/build-index';

const CORPUS_FILE = join(process.cwd(), 'content', 'ai-twin', 'knowledge.md');
const OUTPUT_FILE = join(process.cwd(), 'src', 'generated', 'rag-index.json');

async function main(): Promise<void> {
  const chunks = chunkMarkdown(
    readFileSync(CORPUS_FILE, 'utf8'),
    'knowledge.md',
  );
  if (chunks.length === 0) {
    throw new Error(`No chunks produced from ${CORPUS_FILE}.`);
  }

  console.log(`Embedding ${chunks.length} chunks with ${embeddingModel()}...`);
  const vectors: number[][] = [];
  for (const chunk of chunks) {
    vectors.push(await embed(chunk.text, 'RETRIEVAL_DOCUMENT'));
  }

  const index = assembleIndex(
    chunks,
    vectors,
    embeddingModel(),
    new Date().toISOString(),
  );

  mkdirSync(dirname(OUTPUT_FILE), { recursive: true });
  writeFileSync(OUTPUT_FILE, JSON.stringify(index));
  console.log(
    `Wrote ${OUTPUT_FILE} — ${chunks.length} chunks, ${vectors[0].length}-dim vectors.`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`\nRAG index build failed:\n  ${message}\n`);
  process.exit(1);
});
