export interface RateLimitResult {
  allowed: boolean;
  retryAfterMs: number;
}

export type RateLimiter = (ip: string, now: number) => RateLimitResult;

// Per-instance memory: the effective limit loosens under serverless scale-out;
// acceptable at portfolio traffic.
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
