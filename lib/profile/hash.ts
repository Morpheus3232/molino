import type { UserProfile } from "@/types/user";
import { getPersonalNumber } from "@/lib/numerology/personal";

/**
 * ⚠️ NO CONECTADO A LA UI TODAVÍA — y con un bug conocido si se conecta tal cual.
 *
 * `storeSharedProfile` guarda el perfil en el localStorage del navegador que
 * generó el hash. `decodeProfileHash` lee de ESE MISMO localStorage. Como
 * localStorage no es compartido entre navegadores/dispositivos, un link
 * `/perfil/[hash]` compartido con otra persona no funciona: su navegador
 * nunca tuvo esa entrada guardada.
 *
 * El mecanismo de "compartir perfil" que SÍ funciona hoy en producción es
 * lib/utils/profileShare.ts (buildShareableUrl), que codifica el perfil
 * completo en la URL (base64url) en vez de depender de un storage local.
 *
 * Si en el futuro se quiere usar la ruta /perfil/[hash] con URLs cortas,
 * hace falta un backend real que guarde hash -> perfil (ej. la misma KV que
 * ya usamos para el paywall en lib/kv.ts), no localStorage.
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