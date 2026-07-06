import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const CONTENT_DIR = join(process.cwd(), 'content', 'docs');

function findMetaFiles(dir: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) found.push(...findMetaFiles(full));
    else if (entry === 'meta.json') found.push(full);
  }
  return found;
}

function resolves(dir: string, page: string): boolean {
  if (existsSync(join(dir, `${page}.mdx`))) return true;
  const asFolder = join(dir, page);
  return existsSync(asFolder) && statSync(asFolder).isDirectory();
}

interface Meta {
  pages?: string[];
}

describe('content tree', () => {
  const metas = findMetaFiles(CONTENT_DIR);

  it('finds at least the root meta.json', () => {
    expect(metas.length).toBeGreaterThan(0);
  });

  for (const meta of metas) {
    const dir = dirname(meta);
    const parsed = JSON.parse(readFileSync(meta, 'utf8')) as Meta;
    for (const page of parsed.pages ?? []) {
      if (page.startsWith('---') || page.startsWith('!')) continue;
      const label = relative(CONTENT_DIR, meta).replace(/\\/g, '/');
      it(`"${page}" in ${label} resolves to a page or folder`, () => {
        expect(
          resolves(dir, page),
          `dead sidebar link: "${page}" referenced in ${label}`,
        ).toBe(true);
      });
    }
  }
});
