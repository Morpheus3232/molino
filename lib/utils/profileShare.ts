/**
 * Profile Share — Encode/decode profile data for shareable URLs.
 *
 * There's no backend for shared profiles (see lib/profile/hash.ts), so the
 * URL itself is the storage: base64url is an *encoding*, not encryption —
 * name and full birthDate (`n`, `b`) are plainly readable by anyone with the
 * link. This is an accepted tradeoff (the app has no user DB), mitigated by
 * `Referrer-Policy: strict-origin-when-cross-origin` in next.config.js,
 * which stops the query string from leaking to third-party origins (Mercado
 * Pago, PayPal, image CDNs) loaded on /profile. Don't log this URL
 * server-side or forward it to analytics/third parties as a full string.
 */

import type { UserProfile } from "@/types/user";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";

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

/** Encode profile data to a URL-safe base64 string */
export function encodeProfileData(profile: UserProfile): string {
  const data: ShareableProfileData = {
    n: profile.name || '',
    b: profile.birthDate,
    l: profile.lifePath,
    s: profile.sunSign,
    e: profile.element,
    c: profile.chineseZodiac,
    a: profile.archetype,
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

/** Decode profile data from a URL-safe base64 string */
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
