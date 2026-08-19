/**
 * Client-side premium token management.
 *
 * The device-bound token is stored in localStorage and sent with every
 * premium AI request. It prevents the share-URL bypass: someone who
 * decodes name+birthDate from a shared link can check hasPremiumAccess(),
 * but cannot produce the token that lives only in the paying device's
 * localStorage.
 */

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
