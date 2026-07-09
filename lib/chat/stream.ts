// The chat endpoint streams a single JSON header line, one newline, then the
// answer text (which may itself contain newlines). Both the twin UI and the
// diagnostics page consume this shape, so the split lives here once.

// Split the accumulated buffer on the FIRST newline: everything before is the
// header line, everything after is the answer so far. headerLine stays null
// until that newline has arrived, so callers keep buffering.
export function splitChatStream(buffer: string): {
  headerLine: string | null;
  answer: string;
} {
  const newline = buffer.indexOf('\n');
  if (newline === -1) return { headerLine: null, answer: '' };
  return {
    headerLine: buffer.slice(0, newline),
    answer: buffer.slice(newline + 1),
  };
}

// Parse the header's trace, best-effort: a malformed or partial header must not
// break the answer stream, so any failure yields an empty trace.
export function parseChatTrace<T>(headerLine: string): T[] {
  try {
    const head = JSON.parse(headerLine) as { trace?: T[] };
    return Array.isArray(head.trace) ? head.trace : [];
  } catch {
    return [];
  }
}

export function parseRetrievalMode(headerLine: string): string | null {
  try {
    const head = JSON.parse(headerLine) as { retrieval?: unknown };
    return typeof head.retrieval === 'string' ? head.retrieval : null;
  } catch {
    return null;
  }
}
