import type { UserProfile } from "@/types/user";
import { getPersonalNumber } from "@/lib/numerology/personal";

/**
 * @deprecated Estrategia de compartir basada en LocalStorage — REEMPLAZADA
 * por tokens JWT efímeros (lib/share.ts) + almacenamiento en KV
 * (lib/kv.ts::storeShareProfile / resolveShareProfile), resueltos server-side
 * en `/api/profile/share` y `/perfil/[hash]`.
 *
 * `storeSharedProfile`/`decodeProfileHash` guardan/leen el perfil en el
 * localStorage del navegador que generó el hash. Como localStorage no se
 * comparte entre navegadores/dispositivos, un link `/perfil/[hash]`
 * compartido con otra persona no funcionaba: su navegador nunca tuvo esa
 * entrada guardada. La síntesis/complejidad nunca debe persistir en el
 * cliente (filosofía de privacidad radical + PII en URLs).
 *
 * NO usar las funciones de almacenamiento de este archivo en código nuevo.
 * `generateProfileHash` se conserva exclusivamente por compatibilidad con
 * tests existentes y como ID secundario.
 */

async function sha256Hex(message: string): Promise<string> {
  const data = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b: number) => b.toString(16).padStart(2, "0")).join("").slice(0, 12);
}

export async function generateProfileHash(profile: UserProfile): Promise<string> {
  const birthParts = profile.birthDate?.split("-") || [];
  const personalNumber = birthParts.length === 3
    ? getPersonalNumber(parseInt(birthParts[2], 10), parseInt(birthParts[1], 10), parseInt(birthParts[0], 10))
    : 0;

  const data = JSON.stringify({
    birthDate: profile.birthDate,
    name: profile.name,
    chineseZodiac: profile.chineseZodiac,
    personalNumber,
  });
  return sha256Hex(data);
}

export function storeSharedProfile(profile: UserProfile, hash: string): void {
  try {
    const stored = localStorage.getItem("molino-shared-profiles");
    const profiles: Record<string, UserProfile> = stored ? JSON.parse(stored) : {};
    profiles[hash] = profile;
    localStorage.setItem("molino-shared-profiles", JSON.stringify(profiles));
  } catch {}
}

export function decodeProfileHash(hash: string): UserProfile | null {
  try {
    const stored = localStorage.getItem("molino-shared-profiles");
    if (!stored) return null;
    const profiles: Record<string, UserProfile> = JSON.parse(stored);
    return profiles[hash] || null;
  } catch {
    return null;
  }
}