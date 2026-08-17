/**
 * Client-side premium token management.
 *
 * The device-bound token is stored in localStorage and sent with every
 * premium AI request. It prevents the share-URL bypass: someone who
 * decodes name+birthDate from a shared link can check hasPremiumAccess(),
 * but cannot produce the token that lives only in the paying device's
 * localStorage.
 *
 * This module is safe to import from both client and server. The client
 * helpers (`savePremiumTokenClient`, `getPremiumTokenClient`,
 * `clearPremiumTokenClient`) are browser-only; `isPremium` is strictly
 * server-only (it reads KV) and guards against being called from the client,
 * so the `@vercel/kv` dependency never leaks into the client bundle.
 */

// ════════════════════════════════════════════════════════════════════════
// SERVER-SIDE — premium entitlement backed by @vercel/kv (no PII)
// ════════════════════════════════════════════════════════════════════════

/**
 * Server-side premium check backed by @vercel/kv. Stores only the profile
 * hash + device token — never PII. Returns true when the profile has an
 * active grant (and, when a token is supplied, that the device-bound token
 * matches). Guarded so calling it from a client component is a no-op instead
 * of a build/runtime failure.
 */
export async function isPremium(profileHash: string, token?: string): Promise<boolean> {
  if (typeof window !== "undefined") return false;
  const { hasPremiumAccess, verifyPremiumToken } = await import("@/lib/kv");
  const hasAccess = await hasPremiumAccess(profileHash);
  if (!hasAccess) return false;
  if (!token) return true;
  return verifyPremiumToken(profileHash, token);
}

const TOKEN_KEY = "molino.premium-token";

/** Save a premium token received from server after payment verification. */
export function savePremiumTokenClient(token: string): void {
  if (typeof window === "undefined" || !token) return;
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // localStorage full or unavailable — best effort
  }
}

/** Read the premium token from localStorage. */
export function getPremiumTokenClient(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

/** Clear the premium token (e.g. on logout / access revoked). */
export function clearPremiumTokenClient(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

const PROFILE_SALT_KEY = "molino-profile-salt";

/**
 * Device-bound UUID sent alongside birthDate on every payment request
 * (checkout/recover/coupon) — see hashProfile() in lib/mercadopago.ts for
 * why it's concatenated before the HMAC (two people with the same birth
 * date get different profile hashes).
 */
export function getOrCreateProfileSalt(): string {
  if (typeof window === "undefined") return "";
  let salt = window.localStorage.getItem(PROFILE_SALT_KEY);
  if (!salt) {
    salt = crypto.randomUUID();
    window.localStorage.setItem(PROFILE_SALT_KEY, salt);
  }
  return salt;
}
