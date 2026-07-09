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
