/**
 * Profile Share — Encode/decode profile data for shareable URLs.
 *
 * NEW (preferred): the PII-free path. Use `buildEphemeralShareUrl` /
 * `resolveEphemeralShare` which talk to `/api/profile/share`. The token
 * (JWT, 24h TTL, stored in KV) travels in the URL — never name or birthDate.
 * Call `buildEphemeralShareUrl` to mint a share and `resolveEphemeralShare`
 * to turn the `?share=` param back into a profile.
 *
 * LEGACY (kept for backward compatibility with already-shared links): the
 * base64url functions below embed name and full birthDate (`n`, `b`) plainly
 * in the URL — an *encoding*, not encryption. Do not create NEW links with
 * them; keep only to decode links shared before the JWT migration.
 */

import type { UserProfile } from "@/types/user";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";

// ════════════════════════════════════════════════════════════════════════
// PII-FREE SHARE — JWT token backed by KV (preferred)
// ════════════════════════════════════════════════════════════════════════

/**
 * Mint a PII-free ephemeral share for a profile via /api/profile/share.
 * Returns the full URL to share (or null on failure).
 */
export async function buildEphemeralShareUrl(
  profile: UserProfile,
): Promise<string | null> {
  try {
    const res = await fetch("/api/profile/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: profile.name || "", birthDate: profile.birthDate || "" }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.url || null;
  } catch {
    return null;
  }
}

/**
 * Resolve an ephemeral share token (`?share=<token>`) into a UserProfile,
 * or null if invalid/expired/unreachable.
 */
export async function resolveEphemeralShare(token: string): Promise<UserProfile | null> {
  try {
    const res = await fetch(`/api/profile/share?token=${encodeURIComponent(token)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data?.profile || null;
  } catch {
    return null;
  }
}

/**
 * Legacy decode fallback for `?data=` links: returns the token if it's a
 * JWT-shaped share token, otherwise delegates to base64url decode. This lets
 * ProfileClient accept BOTH the old `?data=` base64 and the new `?share=`
 * token without branching at every call site.
 */
export function decodeShareParam(value: string): ShareableProfileData | null {
  if (value.includes(".") && value.split(".").length === 3) {
    // JWT-shaped token — not decodable client-side; caller should resolve
    // via resolveEphemeralShare.
    return null;
  }
  return decodeProfileData(value);
}

/** Minimal data needed to reconstruct a shared profile view */
export interface ShareableProfileData {
  n: string;      // name
  b: string;      // birthDate (YYYY-MM-DD)
  l: number;      // lifePath
  s: string;      // sunSign
  e: string;      // element
  c: string;      // chineseZodiac
  a: string;      // archetype
  en?: number;    // expressionNumber
  sn?: number;    // soulNumber
  pn?: number;    // personalityNumber
}

/**
 * Public share data for /circulo and /mundo — NO name, NO birthDate.
 * Only symbolic public data: lifePath, sunSign, element, chineseZodiac, archetype.
 */
export interface PublicShareData {
  l: number;      // lifePath
  s: string;      // sunSign
  e: string;      // element (sun sign element)
  c: string;      // chineseZodiac animal
  a: string;      // archetype
  ce?: string;    // chineseZodiac element (optional, derived from year)
}

/**
 * @deprecated Embedding name + birthDate in the URL exposes PII. Use
 * `buildEphemeralShareUrl` instead (JWT token backed by KV).
 * Encode profile data to a URL-safe base64 string
 */
export function encodeProfileData(profile: UserProfile): string {
  const data: ShareableProfileData = {
    n: profile.name || '',
    b: profile.birthDate || '',
    l: profile.lifePath || 1,
    s: profile.sunSign || '',
    e: profile.element || (profile.sunSignInfo?.element) || '',
    c: profile.chineseZodiac || (profile.chineseZodiacInfo?.animal) || '',
    a: profile.archetype || (profile.archetypeInfo?.name) || '',
  };
  if (profile.expressionNumber) data.en = profile.expressionNumber;
  if (profile.soulNumber) data.sn = profile.soulNumber;
  if (profile.personalityNumber) data.pn = profile.personalityNumber;

  const json = JSON.stringify(data);
  // Use btoa with encodeURIComponent to handle Unicode properly
  const encoded = btoa(encodeURIComponent(json));
  // Make URL-safe: replace + with -, / with _, remove =
  return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * @deprecated Legacy base64 path — decodes PII from the URL. Prefer
 * `resolveEphemeralShare` for new shares.
 * Decode profile data from a URL-safe base64 string
 */
export function decodeProfileData(encoded: string): ShareableProfileData | null {
  try {
    // Restore base64 characters
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    // Add padding
    while (base64.length % 4) base64 += "=";
    const json = decodeURIComponent(atob(base64));
    const data = JSON.parse(json) as ShareableProfileData;
    // Validate required fields. `n` (name) is deliberately not required here —
    // onboarding is birthDate-first and most shared profiles have no name.
    if (!data.b || !data.l || !data.s || !data.e || !data.c || !data.a) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

/** Build a full shareable URL for a profile */
export function buildShareableUrl(profile: UserProfile, tab: string = "identity"): string {
  const encoded = encodeProfileData(profile);
  const base = typeof window !== "undefined" ? window.location.origin : "";
  return `${base}/profile?tab=${tab}&data=${encoded}`;
}

/** Reconstruct a minimal UserProfile from shared data */
export function profileFromShareData(data: ShareableProfileData): Partial<UserProfile> {
  return {
    name: data.n,
    birthDate: data.b,
    lifePath: data.l,
    sunSign: data.s,
    element: data.e,
    chineseZodiac: data.c === "Conejo" ? "Gato" : data.c,
    archetype: data.a,
    expressionNumber: data.en,
    soulNumber: data.sn,
    personalityNumber: data.pn,
  };
}

/**
 * Same defaults ProfilePage fills in server-side for a fresh calculation —
 * kept here too so hash-based reconstruction (client-only, see ProfileClient)
 * produces an identical UserProfile shape without re-deriving it a third time.
 */
function hydrateSharedProfile(calculated: UserProfile, name: string, birthDate: string): UserProfile {
  return {
    ...calculated,
    name,
    birthDate,
    birthPlace: "",
    birthTime: undefined,
    goal: "life" as const,
    interests: [],
    onboardingStep: 4,
    completedSections: ["identity"],
    theme: "light" as const,
    language: "es" as const,
    notifications: true,
    cycles: calculated.cycles || { personalYear: 0, personalMonth: 0, personalDay: 0 },
    recommendations: calculated.recommendations || { strengths: [], challenges: [], practices: [] },
  };
}

/** Decode an encoded share string and recompute the full UserProfile from its birthDate. */
export function profileFromEncoded(encoded: string): UserProfile | null {
  const decoded = decodeProfileData(encoded);
  if (!decoded?.b) return null;
  const calculated = calculateUserProfile(decoded.n || "", decoded.b);
  return hydrateSharedProfile(calculated, decoded.n || "", decoded.b);
}

// ════════════════════════════════════════════════════
// PUBLIC SHARE — /circulo and /mundo (NO name, NO birthDate)
// ════════════════════════════════════════════════════

/** Encode public share data (no personal info) to URL-safe base64 */
export function encodePublicShareData(profile: UserProfile): string {
  const data: PublicShareData = {
    l: profile.lifePath,
    s: profile.sunSign,
    e: profile.element,
    c: profile.chineseZodiac,
    a: profile.archetype,
  };
  if (profile.chineseZodiacInfo?.element) data.ce = profile.chineseZodiacInfo.element;

  const json = JSON.stringify(data);
  const encoded = btoa(encodeURIComponent(json));
  return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Decode public share data from URL-safe base64 string */
export function decodePublicShareData(encoded: string): PublicShareData | null {
  try {
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    const json = decodeURIComponent(atob(base64));
    const data = JSON.parse(json) as PublicShareData;
    if (!data.l || !data.s || !data.e || !data.c || !data.a) return null;
    return data;
  } catch {
    return null;
  }
}

/** Build a public shareable URL for /circulo or /mundo */
export function buildPublicShareUrl(profile: UserProfile, path: "/circulo" | "/mundo"): string {
  const encoded = encodePublicShareData(profile);
  const base = typeof window !== "undefined" ? window.location.origin : "";
  return `${base}${path}?ref=${encoded}`;
}

/** Reconstruct a minimal UserProfile from public share data (for /circulo, /mundo rendering) */
export function profileFromPublicShareData(data: PublicShareData): UserProfile {
  return {
    lifePath: data.l,
    sunSign: data.s,
    element: data.e,
    chineseZodiac: data.c === "Conejo" ? "Gato" : data.c,
    chineseZodiacInfo: {
      animal: data.c === "Conejo" ? "Gato" : data.c,
      element: data.ce || data.e,
    },
    archetype: data.a,
    sunSignInfo: {
      sign: data.s,
      element: data.e,
      modality: "",
    },
    // Required fields with safe defaults
    birthDate: "1990-01-01", // Required but not used in calculations
    birthPlace: "",
    goal: "life" as const,
    interests: [],
    onboardingStep: 4,
    completedSections: [],
    theme: "light" as const,
    language: "es" as const,
    notifications: true,
    modality: "",
    luckyNumber: 0,
    archetypeInfo: {},
    cycles: { personalYear: 0, personalMonth: 0, personalDay: 0 },
    recommendations: { strengths: [], challenges: [], practices: [] },
  };
}
