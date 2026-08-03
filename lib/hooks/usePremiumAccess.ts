"use client";

import { useCachedFetch } from "@/lib/hooks/useCachedFetch";

const PREMIUM_STATUS_CACHE = new Map<string, boolean>();

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
 * component.
 */
export function usePremiumAccess(name: string | undefined, birthDate: string): { isPremium: boolean | null } {
  const key = birthDate ? `${birthDate}:${name || ""}` : "";
  const { data } = useCachedFetch(PREMIUM_STATUS_CACHE, key, async () => {
    const res = await fetch("/api/mp/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, birthDate }),
    });
    const json = await res.json();
    return json.premium === true;
  });

  return { isPremium: data };
}
