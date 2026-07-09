import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  isQuotaError,
  streamWithFallback,
  type ContentChunk,
} from '@/lib/chat/generate';

function chunks(...texts: string[]): AsyncIterable<ContentChunk> {
  return {
    async *[Symbol.asyncIterator]() {
      for (const text of texts) yield { text };
    },
  };
}

function chunksThenThrow(
  texts: string[],
  error: unknown,
): AsyncIterable<ContentChunk> {
  return {
    async *[Symbol.asyncIterator]() {
      for (const text of texts) yield { text };
      throw error;
    },
  };
}

describe('isQuotaError', () => {
  it('flags an ApiError with status 429', () => {
    expect(isQuotaError({ status: 429, message: 'too many' })).toBe(true);
  });

  it('flags messages naming the quota condition', () => {
    expect(isQuotaError(new Error('RESOURCE_EXHAUSTED'))).toBe(true);
    expect(isQuotaError(new Error('quota exceeded'))).toBe(true);
    expect(isQuotaError('got a 429 back')).toBe(true);
  });

  it('does not flag unrelated failures', () => {
    expect(isQuotaError({ status: 404 })).toBe(false);
    expect(isQuotaError(new Error('network down'))).toBe(false);
    expect(isQuotaError(undefined)).toBe(false);
  });
});

describe('streamWithFallback', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('streams the first model and never opens the fallback', async () => {
    const opened: string[] = [];
    const out: string[] = [];
    const result = await streamWithFallback(
      ['primary', 'fallback'],
      (model) => {
        opened.push(model);
        return Promise.resolve(chunks('hello', ' world'));
      },
      (text) => out.push(text),
    );
    expect(out.join('')).toBe('hello world');
    expect(opened).toEqual(['primary']);
    expect(result).toEqual({
      emitted: true,
      error: undefined,
      model: 'primary',
    });
  });

  it('falls back when the primary fails before emitting', async () => {
    const opened: string[] = [];
    const out: string[] = [];
    const result = await streamWithFallback(
      ['primary', 'fallback'],
      (model) => {
        opened.push(model);
        if (model === 'primary') return Promise.reject({ status: 429 });
        return Promise.resolve(chunks('recovered'));
      },
      (text) => out.push(text),
    );
    expect(out.join('')).toBe('recovered');
    expect(opened).toEqual(['primary', 'fallback']);
    expect(result.emitted).toBe(true);
    expect(result.error).toBeUndefined();
    expect(result.model).toBe('fallback');
  });

  it('does not restart after tokens are emitted', async () => {
    const opened: string[] = [];
    const out: string[] = [];
    const result = await streamWithFallback(
      ['primary', 'fallback'],
      (model) => {
        opened.push(model);
        return Promise.resolve(
          chunksThenThrow(['par', 'tial'], { status: 500 }),
        );
      },
      (text) => out.push(text),
    );
    expect(out.join('')).toBe('partial');
    expect(opened).toEqual(['primary']);
    expect(result.emitted).toBe(true);
    expect(result.error).toEqual({ status: 500 });
    expect(result.model).toBe('primary');
  });

  it('reports the last error when every model is exhausted', async () => {
    const result = await streamWithFallback(
      ['primary', 'fallback'],
      () => Promise.reject({ status: 429 }),
      () => {},
    );
    expect(result.emitted).toBe(false);
    expect(isQuotaError(result.error)).toBe(true);
    expect(result.model).toBeNull();
  });
});
