/**
 * Personal Timeline Engine
 *
 * Calculates personal year, universal year, and cycle positions.
 * NO predictions. Cultural/symbolic reading only.
 */

import type { UserProfile } from "@/types/user";
import { getYearAnimal, resolveYearCycle } from "@/lib/engines/yearCycleEngine";
import type { Animal } from "@/lib/data/animalRelations";

// ════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════

export interface PersonalTimeline {
  currentYear: number;
  personalYear: number;
  universalYear: number;
  yearAnimal: Animal;
  cycleType: string;
  cycleLabel: string;
  cycleDescription: string;
  /** Last similar cycle year */
  lastSimilarCycle: number;
  /** Next similar cycle year */
  nextSimilarCycle: number;
  /** Timeline positions */
  timeline: { year: number; label: string; isCurrent: boolean }[];
}

// ════════════════════════════════════════════════════
// MAIN ENGINE
// ════════════════════════════════════════════════════

/**
 * Calculate personal year number (numerology).
 * Personal Year = birth month + birth day + current year → single digit
 */
export function calculatePersonalYear(birthDate?: string, year?: number): number {
  if (!birthDate) return 0;
  const currentYear = year ?? new Date().getFullYear();
  const parts = birthDate.split("-");
  const month = parseInt(parts[1] || "0", 10);
  const day = parseInt(parts[2] || "0", 10);
  const sum = month + day + currentYear;
  return reduceToSingleDigit(sum);
}

/**
 * Calculate universal year number.
 * Universal Year = current year → single digit
 */
export function calculateUniversalYear(year?: number): number {
  const currentYear = year ?? new Date().getFullYear();
  return reduceToSingleDigit(currentYear);
}

/**
 * Build the complete personal timeline.
 */
export function buildPersonalTimeline(profile: UserProfile): PersonalTimeline {
  const currentYear = new Date().getFullYear();
  const userYear = parseInt(profile.birthDate?.split("-")[0] || "0", 10);
  const personalYear = calculatePersonalYear(profile.birthDate, currentYear);
  const universalYear = calculateUniversalYear(currentYear);
  const yearAnimal = getYearAnimal(currentYear);
  const yearCycle = resolveYearCycle(profile.chineseZodiac as Animal);

  // Find similar cycles (personal year repeats every 9 years)
  const lastSimilar = findSimilarCycle(profile.birthDate, currentYear, -9);
  const nextSimilar = findSimilarCycle(profile.birthDate, currentYear, 9);

  // Build timeline
  const timeline = buildTimelinePoints(lastSimilar, currentYear, nextSimilar);

  return {
    currentYear,
    personalYear,
    universalYear,
    yearAnimal,
    cycleType: yearCycle.cycleType,
    cycleLabel: yearCycle.label,
    cycleDescription: yearCycle.explanation,
    lastSimilarCycle: lastSimilar,
    nextSimilarCycle: nextSimilar,
    timeline,
  };
}

// ════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════

function reduceToSingleDigit(n: number): number {
  while (n > 9 && n !== 11 && n !== 22) {
    n = Math.floor(n / 10) + (n % 10);
  }
  return n;
}

function findSimilarCycle(birthDate: string | undefined, currentYear: number, offset: number): number {
  if (!birthDate) return currentYear + offset;
  const targetYear = currentYear + offset;
  const py = calculatePersonalYear(birthDate, targetYear);
  const currentPy = calculatePersonalYear(birthDate, currentYear);
  // If the personal year matches, we found a similar cycle
  if (py === currentPy) return targetYear;
  // Otherwise search nearby
  for (let i = -2; i <= 2; i++) {
    const y = targetYear + i;
    if (calculatePersonalYear(birthDate, y) === currentPy) return y;
  }
  return targetYear;
}

function buildTimelinePoints(
  last: number,
  current: number,
  next: number,
): { year: number; label: string; isCurrent: boolean }[] {
  return [
    { year: last, label: "Ciclo similar", isCurrent: false },
    { year: current, label: "Ahora", isCurrent: true },
    { year: next, label: "Próximo ciclo", isCurrent: false },
  ];
}
