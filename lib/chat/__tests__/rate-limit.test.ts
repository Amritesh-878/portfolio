import { describe, it, expect } from 'vitest';
import {
  rateLimit,
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS,
} from '@/lib/chat/rate-limit';

describe('rateLimit', () => {
  it('allows requests up to the limit, then blocks with a retry hint', () => {
    const now = 1_000_000;
    for (let i = 0; i < RATE_LIMIT_MAX; i++) {
      expect(rateLimit('ip-a', now).allowed).toBe(true);
    }
    const blocked = rateLimit('ip-a', now);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });

  it('allows again once the window has passed', () => {
    const now = 2_000_000;
    for (let i = 0; i < RATE_LIMIT_MAX; i++) rateLimit('ip-b', now);
    expect(rateLimit('ip-b', now).allowed).toBe(false);
    expect(rateLimit('ip-b', now + RATE_LIMIT_WINDOW_MS + 1).allowed).toBe(
      true,
    );
  });

  it('isolates limits per IP', () => {
    const now = 3_000_000;
    for (let i = 0; i < RATE_LIMIT_MAX; i++) rateLimit('ip-c', now);
    expect(rateLimit('ip-c', now).allowed).toBe(false);
    expect(rateLimit('ip-d', now).allowed).toBe(true);
  });
});
