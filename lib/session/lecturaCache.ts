import type { MolinoInterpretation } from "@/lib/engines/intelligence/types";

/**
 * Caché local de "La Lectura" — una vez generada, es un documento único e
 * irrepetible (ver brief de /lectura): reabrirla no debe recrearla ni
 * repetir la animación de construcción. Sin TTL a propósito: mismo criterio
 * que el caché server-side de personal_profile (ver interpretationCache.ts).
 */
function storageKey(birthDate: string, name: string): string {
  return `molino_lectura_v1::${birthDate}::${name.trim().toLowerCase()}`;
}

export function getCachedLectura(birthDate: string, name: string): MolinoInterpretation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(storageKey(birthDate, name));
    return raw ? (JSON.parse(raw) as MolinoInterpretation) : null;
  } catch {
    return null;
  }
}

export function setCachedLectura(birthDate: string, name: string, interpretation: MolinoInterpretation): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(birthDate, name), JSON.stringify(interpretation));
  } catch {}
}
