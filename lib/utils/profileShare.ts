/**
 * Profile Share — Encode/decode profile data for shareable URLs.
 *
 * Minimal profile data encoded as base64url for URL safety.
 * No secrets, no sensitive data. Only public zodiac/numerology info.
 */

import type { UserProfile } from "@/types/user";

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
    n: profile.name,
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
    // Validate required fields
    if (!data.n || !data.b || !data.l || !data.s || !data.e || !data.c || !data.a) {
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
