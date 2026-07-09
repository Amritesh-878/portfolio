import { describe, expect, it } from 'vitest';

import { parseChatTrace, parseRetrievalMode, splitChatStream } from './stream';

interface TraceEntry {
  id: string;
  heading: string;
  vecRank: number | null;
  bm25Rank: number | null;
  fusedScore: number;
}

function entry(over: Partial<TraceEntry> = {}): TraceEntry {
  return {
    id: 'c1',
    heading: 'Hunter Wumpus',
    vecRank: 1,
    bm25Rank: 2,
    fusedScore: 0.0312,
    ...over,
  };
}

// Mirror the server: a JSON header line, one newline, then answer text chunks.
function header(trace: TraceEntry[]): string {
  return `${JSON.stringify({ trace })}\n`;
}

describe('splitChatStream', () => {
  it('withholds the header until the first newline arrives', () => {
    const { headerLine, answer } = splitChatStream('{"trace":[]}');
    expect(headerLine).toBeNull();
    expect(answer).toBe('');
  });

  it('splits header from answer on the first newline', () => {
    const { headerLine, answer } = splitChatStream(`${header([])}Hello there`);
    expect(headerLine).toBe('{"trace":[]}');
    expect(answer).toBe('Hello there');
  });

  it('keeps newlines that appear inside the answer body', () => {
    // The model's own error fallback begins with two newlines; those belong to
    // the answer, not the header split.
    const buffer = `${header([])}\n\n(My model dropped mid-thought.)`;
    const { headerLine, answer } = splitChatStream(buffer);
    expect(headerLine).toBe('{"trace":[]}');
    expect(answer).toBe('\n\n(My model dropped mid-thought.)');
  });

  it('follows a growing answer across accumulated chunks', () => {
    const chunks = [
      header([entry()]).slice(0, 5),
      header([entry()]).slice(5),
      ' Answer ',
      'grows',
    ];
    let buffer = '';
    const answers: string[] = [];
    for (const chunk of chunks) {
      buffer += chunk;
      const { headerLine, answer } = splitChatStream(buffer);
      if (headerLine !== null) answers.push(answer);
    }
    expect(answers.at(-1)).toBe(' Answer grows');
  });
});

describe('parseChatTrace', () => {
  it('returns the trace array from a valid header', () => {
    const trace = [entry(), entry({ id: 'c2', fusedScore: 0.01 })];
    expect(parseChatTrace<TraceEntry>(JSON.stringify({ trace }))).toEqual(
      trace,
    );
  });

  it('returns an empty trace for the injection response header', () => {
    expect(parseChatTrace<TraceEntry>('{"trace":[]}')).toEqual([]);
  });

  it('falls back to an empty trace on malformed JSON', () => {
    // A header split from a still-partial buffer can be invalid JSON.
    expect(parseChatTrace<TraceEntry>('{"trace":[{"id"')).toEqual([]);
  });

  it('falls back to an empty trace when trace is missing or not an array', () => {
    expect(parseChatTrace<TraceEntry>('{}')).toEqual([]);
    expect(parseChatTrace<TraceEntry>('{"trace":"nope"}')).toEqual([]);
  });
});

describe('parseRetrievalMode', () => {
  it('reads the degraded retrieval marker when present', () => {
    expect(parseRetrievalMode('{"trace":[],"retrieval":"bm25-only"}')).toBe(
      'bm25-only',
    );
  });

  it('returns null when absent or malformed', () => {
    expect(parseRetrievalMode('{"trace":[]}')).toBeNull();
    expect(parseRetrievalMode('{"trace":[{"id"')).toBeNull();
  });
});
