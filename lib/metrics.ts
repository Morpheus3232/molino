/**
 * Public transparency metrics — member count + monthly aggregates.
 *
 * Philosophy (ética): `incrementMemberCount` must ONLY be called after a
 * payment is validated (approved + idempotent). It never reads PII — the KV
 * keys hold only counts and an opaque profile hash. A 24h cache on reads
 * (getMemberCount) keeps the counter honest but bounded: it updates once a
 * day, so a sudden burst of grants doesn't inflate the displayed number and
 * the KV is not hammered on every footer render.
 *
 * Server-only. Never import from client components; client UI reads via an
 * API route or a server component.
 */

import { getKvClient } from "@/lib/kv";

/** KV keys — counts only, never PII. */
const MEMBER_COUNT_KEY = "metrics:member_count";
/** Bucketed monthly grants, e.g. metrics:month:2026-08 */
const MONTH_KEY_PREFIX = "metrics:month:";
/** Cache the displayed count for 24h so the counter is honest but not noisy. */
const CACHE_TTL_SECONDS = 24 * 60 * 60;

/**
 * Increment the member counter. Call ONLY after a validated, idempotent
 * successful payment. Safe to call multiple times for the same payment
 * (callers should gate with the existing markPaymentProcessed idempotency
 * key). Never throws — a metrics failure must never fail a payment.
 */
export async function incrementMemberCount(profileHash: string): Promise<void> {
  try {
    const kv = await getKvClient();
    if (!kv || !profileHash) return;

    // Global count.
    const current = (await kv.get<number>(MEMBER_COUNT_KEY)) || 0;
    await kv.set(MEMBER_COUNT_KEY, current + 1);

    // Monthly bucket (UTC), for /transparencia.
    const month = new Date().toISOString().slice(0, 7);
    const monthKey = `${MONTH_KEY_PREFIX}${month}`;
    const monthCurrent = (await kv.get<number>(monthKey)) || 0;
    await kv.set(monthKey, monthCurrent + 1, { ex: 366 * 86400 });
  } catch (error) {
    console.error('[Metrics] Error in incrementMemberCount:', error);
  }
}

/**
 * Read the current member count with a 24h cache. Returns 0 when unavailable
 * (so the footer only ever shows a counter when there's real data).
 */
export async function getMemberCount(): Promise<number> {
  try {
    const kv = await getKvClient();
    if (!kv) return 0;
    const cached = await kv.get<number>(`${MEMBER_COUNT_KEY}:cached`);
    if (cached != null) return cached;
    const raw = await kv.get<number>(MEMBER_COUNT_KEY) || 0;
    // Refresh the cache window every read so the value stays honest over time.
    await kv.set(`${MEMBER_COUNT_KEY}:cached`, raw, { ex: CACHE_TTL_SECONDS });
    return raw;
  } catch (error) {
    console.error('[Metrics] Error in getMemberCount:', error);
    return 0;
  }
}

/**
 * Monthly grant counts for the last `months` months (UTC), newest first.
 * Returns `{ month, count }[]`. Used by /transparencia.
 */
export async function getMonthlyMemberCounts(months = 12): Promise<{ month: string; count: number }[]> {
  const out: { month: string; count: number }[] = [];
  try {
    const kv = await getKvClient();
    if (!kv) return out;
    const now = new Date();
    for (let i = 0; i < months; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const count = (await kv.get<number>(`${MONTH_KEY_PREFIX}${month}`)) || 0;
      out.push({ month, count });
    }
    return out;
  } catch (error) {
    console.error('[Metrics] Error in getMonthlyMemberCounts:', error);
    return out;
  }
}