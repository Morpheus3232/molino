/**
 * Viral invite-link helpers — "compare with someone" flow.
 *
 * An invite is a PII-free shareable URL that resolves back into the couple
 * comparison. Person A (the inviter) embeds their birthDate/name; the
 * recipient lands on /pareja with that half pre-filled and adds their own.
 * No server round-trip needed — the map is computed client-side from the
 * dates, so no PII ever leaves the browser.
 *
 * This is the "flujo de compatibilidad": a compact invite that resolves in
 * the compat route without registration.
 */

export interface InvitePayload {
  birthDate: string; // YYYY-MM-DD
  name?: string;
}

/**
 * Build a shareable invite URL that pre-fills the inviter's side.
 * e.g. `${origin}/pareja?a=1990-03-15&na=Lucía`
 */
export function buildInviteUrl(payload: InvitePayload): string {
  const base = typeof window !== "undefined" ? window.location.origin : "https://molino.app";
  const params = new URLSearchParams();
  params.set("a", payload.birthDate);
  if (payload.name) params.set("na", payload.name);
  return `${base}/pareja?${params.toString()}`;
}

/**
 * The copy-paste message sent to a recipient — human, warm, no urgency, no
 * tracking.
 */
export function buildInviteMessage(payload: InvitePayload): string {
  const url = buildInviteUrl(payload);
  const greeting = payload.name ? `Hola, soy ${payload.name}.` : "Hola.";
  return `${greeting} Calculé mi mapa en Molino y quiero ver nuestra compatibilidad. Entrá acá y completá tu fecha: ${url} (Sin registro, 100% privado).`;
}

/**
 * Parse an invite link back into the inviter half. Returns null if malformed.
 * `a` is the inviter's birthDate (YYYY-MM-DD); `na` is the optional name.
 */
export function parseInviteUrl(raw: string): { birthDate: string; name?: string } | null {
  try {
    const url = new URL(raw);
    const a = url.searchParams.get("a");
    if (!a || !/^\d{4}-\d{2}-\d{2}$/.test(a)) return null;
    const name = url.searchParams.get("na") || undefined;
    return { birthDate: a, name };
  } catch {
    return null;
  }
}