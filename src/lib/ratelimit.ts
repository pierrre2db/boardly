// Minimal fixed-window rate limiter kept in process memory.
// Scope: single-container deployment (our case). It is NOT shared across
// replicas — if you ever scale horizontally, move this to Redis/DB.
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type RateResult = { ok: boolean; retryAfter: number };

export function rateLimit(key: string, limit: number, windowMs: number): RateResult {
  const now = Date.now();

  // Opportunistic cleanup so the map can't grow unbounded over time.
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (now >= b.resetAt) buckets.delete(k);
  }

  const b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  if (b.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((b.resetAt - now) / 1000) };
  }
  b.count++;
  return { ok: true, retryAfter: 0 };
}

// Clear a key after a successful action so legitimate users aren't throttled
// by their own earlier failed attempts.
export function rateLimitReset(key: string): void {
  buckets.delete(key);
}

// Best-effort client IP from the proxy chain (NPM sets X-Forwarded-For).
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}
