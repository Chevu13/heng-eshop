/**
 * Jednostavan in-memory rate limiter (fixed window) za javne forme.
 * Dovoljan za jednu instancu / Vercel edge-lite scenario. Za više instanci
 * zameniti Upstash Redis adapterom — interfejs ostaje isti.
 */
interface Bucket { count: number; resetAt: number }
const buckets = new Map<string, Bucket>();

export interface RateLimitResult { ok: boolean; retryAfter: number }

export function rateLimit(key: string, limit = 5, windowMs = 60_000): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}

export function clientKey(req: Request, scope: string): string {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') || 'nepoznat';
  return `${scope}:${ip}`;
}

// Povremeno čišćenje isteklih ključeva.
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    buckets.forEach((b, k) => { if (b.resetAt < now) buckets.delete(k); });
  }, 300_000).unref?.();
}
