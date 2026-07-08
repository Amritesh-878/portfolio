import { createRateLimiter, type RateLimitResult } from '@/lib/rate-limit';

export type { RateLimitResult };

export const RATE_LIMIT_WINDOW_MS = 5 * 60_000;
export const RATE_LIMIT_MAX = 12;

export const rateLimit = createRateLimiter(
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX,
);
