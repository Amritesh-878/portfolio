import type { Chunk, ChunkOptions } from './types';

const DEFAULT_MAX_TOKENS = 512;
const DEFAULT_OVERLAP_TOKENS = 64;

// Cheap heuristic (~4 chars per token). Size limits here are soft, so a real
// tokenizer would be false precision and a dependency lib/rag deliberately avoids.
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function slugify(heading: string): string {
  return (
    heading
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section'
  );
}

interface Section {
  heading: string;
  body: string;
}

function parseSections(source: string): Section[] {
  const sections: Section[] = [];
  let current: Section | null = null;
  // Normalize CRLF/CR: the heading regex's $ anchor won't match before a stray
  // \r, which would silently yield zero chunks on Windows-authored files.
  const lines = source.replace(/\r\n?/g, '\n').split('\n');
  // Only H2 sections become chunks; content before the first H2 (the doc title
  // and the review-note blockquote) is dropped so the note is never indexed.
  for (const line of lines) {
    const heading = /^##\s+(.+)$/.exec(line);
    if (heading) {
      if (current) sections.push(current);
      current = { heading: heading[1].trim(), body: '' };
    } else if (current) {
      current.body += `${line}\n`;
    }
  }
  if (current) sections.push(current);
  return sections;
}

function normalize(body: string): string {
  return body
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function splitOversized(
  body: string,
  maxTokens: number,
  overlapTokens: number,
): string[] {
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const parts: string[] = [];
  let buffer: string[] = [];
  let bufferTokens = 0;

  for (const paragraph of paragraphs) {
    const tokens = estimateTokens(paragraph);
    if (bufferTokens + tokens > maxTokens && buffer.length > 0) {
      parts.push(buffer.join('\n\n'));
      const overlap: string[] = [];
      let overlapTaken = 0;
      for (
        let i = buffer.length - 1;
        i >= 0 && overlapTaken < overlapTokens;
        i--
      ) {
        overlap.unshift(buffer[i]);
        overlapTaken += estimateTokens(buffer[i]);
      }
      buffer = overlap;
      bufferTokens = overlapTaken;
    }
    buffer.push(paragraph);
    bufferTokens += tokens;
  }
  if (buffer.length > 0) parts.push(buffer.join('\n\n'));
  return parts;
}

export function chunkMarkdown(
  source: string,
  sourceFile: string,
  options: ChunkOptions = {},
): Chunk[] {
  const maxTokens = options.maxTokens ?? DEFAULT_MAX_TOKENS;
  const overlapTokens = options.overlapTokens ?? DEFAULT_OVERLAP_TOKENS;
  const chunks: Chunk[] = [];
  const idCounts = new Map<string, number>();

  for (const section of parseSections(source)) {
    const body = normalize(section.body);
    if (!body) continue;

    const baseId = slugify(section.heading);
    const parts =
      estimateTokens(body) > maxTokens
        ? splitOversized(body, maxTokens, overlapTokens)
        : [body];

    parts.forEach((text, part) => {
      let id = part === 0 ? baseId : `${baseId}-${part + 1}`;
      const seen = idCounts.get(id);
      if (seen) {
        idCounts.set(id, seen + 1);
        id = `${id}-dup${seen + 1}`;
      } else {
        idCounts.set(id, 1);
      }
      chunks.push({
        id,
        heading: section.heading,
        text,
        tokenEstimate: estimateTokens(text),
        sourceFile,
      });
    });
  }
  return chunks;
}
