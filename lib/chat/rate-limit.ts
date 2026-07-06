export const RATE_LIMIT_WINDOW_MS = 5 * 60_000;
export const RATE_LIMIT_MAX = 12;

// Per-IP hit timestamps, in-memory. This is per serverless instance rather than
// global, so the effective limit loosens under scale-out; fine at portfolio
// traffic, and Upstash is the documented upgrade path if it ever isn't.
const hits = new Map<string, number[]>();

export interface RateLimitResult {
  allowed: boolean;
  retryAfterMs: number;
}

export function rateLimit(ip: string, now: number): RateLimitResult {
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const recent = (hits.get(ip) ?? []).filter((time) => time > windowStart);
  if (recent.length >= RATE_LIMIT_MAX) {
    return {
      allowed: false,
      retryAfterMs: recent[0] + RATE_LIMIT_WINDOW_MS - now,
    };
  }
  recent.push(now);
  hits.set(ip, recent);
  return { allowed: true, retryAfterMs: 0 };
}
