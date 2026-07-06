import { describe, it, expect } from 'vitest';
import { chunkMarkdown } from '@/lib/rag/chunker';

const SRC = `# AI Twin knowledge corpus

> Review note that must never be indexed.

## Current role

He is an ML engineer.

## Education

B.Tech in CSE.
`;

describe('chunkMarkdown', () => {
  it('splits into one chunk per H2 heading with slug ids', () => {
    const chunks = chunkMarkdown(SRC, 'knowledge.md');
    expect(chunks.map((c) => c.id)).toEqual(['current-role', 'education']);
    expect(chunks[0].heading).toBe('Current role');
    expect(chunks[0].text).toBe('He is an ML engineer.');
    expect(chunks[0].sourceFile).toBe('knowledge.md');
    expect(chunks[0].tokenEstimate).toBeGreaterThan(0);
  });

  it('drops the title and review-note blockquote before the first heading', () => {
    const text = chunkMarkdown(SRC, 'knowledge.md')
      .map((c) => c.text)
      .join('\n');
    expect(text).not.toContain('Review note');
    expect(text).not.toContain('knowledge corpus');
  });

  it('produces stable ids across cosmetic whitespace edits', () => {
    const messy = SRC.replace('## Education', '## Education   ').replace(
      'B.Tech in CSE.',
      'B.Tech in CSE.   \n\n\n',
    );
    expect(chunkMarkdown(messy, 'knowledge.md').map((c) => c.id)).toEqual(
      chunkMarkdown(SRC, 'knowledge.md').map((c) => c.id),
    );
  });

  it('splits oversized sections into overlapping parts with suffixed ids', () => {
    const src = `## Big

Alpha alpha alpha.

Beta beta beta.

Gamma gamma gamma.
`;
    const chunks = chunkMarkdown(src, 'knowledge.md', {
      maxTokens: 6,
      overlapTokens: 5,
    });
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks[0].id).toBe('big');
    expect(chunks[1].id).toBe('big-2');
    expect(chunks.every((c) => c.heading === 'Big')).toBe(true);
    const tailOfFirst = chunks[0].text.split('\n\n').at(-1);
    expect(chunks[1].text).toContain(tailOfFirst);
  });

  it('skips empty sections', () => {
    const chunks = chunkMarkdown('## Empty\n\n## Real\n\nContent.', 'k.md');
    expect(chunks.map((c) => c.id)).toEqual(['real']);
  });
});
