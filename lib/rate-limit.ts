export interface RateLimitResult {
  allowed: boolean;
  retryAfterMs: number;
}

export type RateLimiter = (ip: string, now: number) => RateLimitResult;

// Per-IP hit timestamps kept in-memory per serverless instance rather than
// globally, so the effective limit loosens under scale-out; fine at portfolio
// traffic, and Upstash is the documented upgrade path if it ever isn't.
export function createRateLimiter(windowMs: number, max: number): RateLimiter {
  const hits = new Map<string, number[]>();
  return (ip, now) => {
    const windowStart = now - windowMs;
    const recent = (hits.get(ip) ?? []).filter((time) => time > windowStart);
    if (recent.length >= max) {
      return { allowed: false, retryAfterMs: recent[0] + windowMs - now };
    }
    recent.push(now);
    hits.set(ip, recent);
    return { allowed: true, retryAfterMs: 0 };
  };
}
