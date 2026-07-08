import { createRateLimiter } from '@/lib/rate-limit';

export const CONTACT_RATE_LIMIT_WINDOW_MS = 10 * 60_000;
export const CONTACT_RATE_LIMIT_MAX = 5;

export const contactRateLimit = createRateLimiter(
  CONTACT_RATE_LIMIT_WINDOW_MS,
  CONTACT_RATE_LIMIT_MAX,
);
