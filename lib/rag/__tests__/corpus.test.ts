import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { chunkMarkdown } from '@/lib/rag/chunker';

const corpusDir = join(process.cwd(), 'content', 'ai-twin');
const knowledge = readFileSync(join(corpusDir, 'knowledge.md'), 'utf8');
const persona = readFileSync(join(corpusDir, 'persona.md'), 'utf8');

describe('knowledge corpus', () => {
  const chunks = chunkMarkdown(knowledge, 'knowledge.md');

  it('produces several non-empty chunks', () => {
    expect(chunks.length).toBeGreaterThan(5);
    expect(chunks.every((c) => c.text.trim().length > 0)).toBe(true);
  });

  it('gives every chunk a unique id', () => {
    const ids = chunks.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('keeps every chunk within the size budget', () => {
    expect(chunks.every((c) => c.tokenEstimate <= 512)).toBe(true);
  });

  it('retains anchor facts so accidental deletion fails a test', () => {
    const text = chunks.map((c) => c.text).join('\n');
    expect(text).toContain('amritesh.praveen@gmail.com');
    expect(text).toContain('10.5281/zenodo.20076630');
  });
});

describe('corpus review state', () => {
  it('has no unresolved review markers', () => {
    expect(knowledge).not.toContain('⚠️');
    expect(persona).not.toContain('⚠️');
  });
});
