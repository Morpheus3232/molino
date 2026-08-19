/**
 * Work Profile Engine (Modo Socios · análisis de una fecha puntual)
 *
 * Reutiliza contenido ya existente y auditado — NUMBERS[].manifestation.work
 * (numerologia-content.ts) y ANIMAL_PROFILES[].traits (animalRelations.ts)
 * — no introduce datos nuevos, solo los recompone con foco laboral.
 */

import type { UserProfile } from "@/types/user";
import { NUMBERS } from "@/lib/data/numerologia-content";
import { ANIMAL_PROFILES, type Animal } from "@/lib/data/animalRelations";
import { safeNumber } from "@/lib/utils/score";

export interface WorkProfileResult {
  profile: UserProfile;
  lifePath: number;
  lifePathTitle: string;
  workStyle: string;
  animal: Animal | "";
  animalTraits: string[];
}

export function getWorkProfile(profile: UserProfile): WorkProfileResult {
  const lifePath = safeNumber(profile.lifePath, 1);
  const number = NUMBERS.find((n) => n.number === lifePath) ?? NUMBERS[0];
  const animal = (typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "") as Animal | "";
  const animalProfile = animal ? ANIMAL_PROFILES[animal] : undefined;

  return {
    profile,
    lifePath,
    lifePathTitle: number.title,
    workStyle: number.manifestation.work,
    animal,
    animalTraits: animalProfile?.traits ?? [],
  };
}
