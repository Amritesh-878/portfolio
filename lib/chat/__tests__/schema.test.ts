import { describe, it, expect } from 'vitest';
import { parseChatRequest } from '@/lib/chat/schema';

describe('parseChatRequest', () => {
  it('accepts a valid request and trims the message', () => {
    const result = parseChatRequest({ message: '  hello  ', history: [] });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.message).toBe('hello');
  });

  it('rejects an empty, missing, or non-object body', () => {
    expect(parseChatRequest({ message: '   ' }).ok).toBe(false);
    expect(parseChatRequest({}).ok).toBe(false);
    expect(parseChatRequest(null).ok).toBe(false);
    expect(parseChatRequest('nope').ok).toBe(false);
  });

  it('rejects an oversized message', () => {
    expect(parseChatRequest({ message: 'x'.repeat(1001) }).ok).toBe(false);
  });

  it('drops malformed history entries and caps the length', () => {
    const history = [
      { role: 'user', content: 'a' },
      { role: 'system', content: 'nope' },
      { bad: true },
      ...Array.from({ length: 10 }, () => ({
        role: 'assistant',
        content: 'x',
      })),
    ];
    const result = parseChatRequest({ message: 'hi', history });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.history.length).toBeLessThanOrEqual(8);
      expect(
        result.value.history.every(
          (m) => m.role === 'user' || m.role === 'assistant',
        ),
      ).toBe(true);
    }
  });
});
