"use client";

import { useEffect } from "react";
import { useCachedFetch } from "@/lib/hooks/useCachedFetch";
import { savePremiumTokenClient } from "@/lib/premium";

const PREMIUM_STATUS_CACHE = new Map<string, boolean>();

/** Consumers (usePremiumAccess instances) to notify when premium just got
 * unlocked elsewhere on the page (e.g. PremiumGate) — without this, a
 * `false` fetched before the unlock would stay cached for the rest of the
 * session, since useCachedFetch only re-fetches on mount or explicit retry(). */
const listeners = new Set<() => void>();

function cacheKey(name: string | undefined, birthDate: string): string {
  return birthDate ? `${birthDate}:${name || ""}` : "";
}

/** Call after a real unlock (coupon/verify/recover/payment) so any already-
 * mounted usePremiumAccess consumer drops a stale cached `false` for this
 * profile and re-checks instead of carrying it for the rest of the session. */
export function invalidatePremiumAccessCache(name: string | undefined, birthDate: string): void {
  const key = cacheKey(name, birthDate);
  if (key) PREMIUM_STATUS_CACHE.delete(key);
  listeners.forEach((listener) => listener());
}

/**
 * Independent premium-status check for sections OUTSIDE PremiumGate that
 * still need to know "is this user premium" — e.g. the chat, which sits
 * after PremiumGate in the same screen. Deliberately does NOT reuse
 * PremiumGate's internal state: PremiumGate owns the sales UI (locked/paying/
 * verifying/unlocked) and the "double paywall" bug this codebase already
 * fixed once (see IntelligenceScreen's comment on section 06) came from two
 * places independently deciding whether to show a purchase flow. This hook
 * only ever answers a read-only "yes/no", it never renders a paywall itself
 * — callers show a slim inline nudge, not a second sales screen, when false.
 *
 * Hits the same cheap /api/mp/check endpoint PremiumGate uses (a KV lookup,
 * not a payment operation) — safe to call a second time from a sibling
 * component. Also persists the device-bound premiumToken it returns — the
 * downstream AI call (e.g. ChatWithMolino's /api/intelligence/interpret)
 * needs that token, not just the boolean.
 */
export function usePremiumAccess(name: string | undefined, birthDate: string): { isPremium: boolean | null } {
  const key = cacheKey(name, birthDate);
  const { data, retry } = useCachedFetch(PREMIUM_STATUS_CACHE, key, async () => {
    const res = await fetch("/api/mp/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, birthDate }),
    });
    const json = await res.json();
    if (json.premium === true && json.premiumToken) {
      savePremiumTokenClient(json.premiumToken);
    }
    return json.premium === true;
  });

  useEffect(() => {
    listeners.add(retry);
    return () => {
      listeners.delete(retry);
    };
  }, [retry]);

  return { isPremium: data };
}
