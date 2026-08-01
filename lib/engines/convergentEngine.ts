/**
 * Convergent Layers Engine
 *
 * Detects when multiple symbolic systems align:
 *   - Life Path number
 *   - Birthday number
 *   - Chinese zodiac animal
 *   - Annual cycle
 *   - Personal year number
 *
 * When layers converge → stronger resonance signal.
 * NO predictions. Cultural/symbolic reading only.
 */

import type { UserProfile } from "@/types/user";
import { getRelation, type Animal } from "@/lib/data/animalRelations";
import { getCurrentYearAnimal, getYearAnimal, resolveYearCycle } from "@/lib/engines/yearCycleEngine";
import { calculatePersonalYear } from "@/lib/engines/personalTimelineEngine";
import { calculateBirthDayNumber } from "@/lib/engines/numerologyEngine";

// ════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════

export interface ConvergentLayer {
  id: string;
  name: string;
  value: string | number;
  emoji: string;
  description: string;
}

export interface Convergence {
  layers: ConvergentLayer[];
  convergentCount: number;
  totalLayers: number;
  convergenceLevel: "strong" | "moderate" | "low";
  message: string;
  insight: string;
}

// ════════════════════════════════════════════════════
// MAIN ENGINE
// ════════════════════════════════════════════════════

/**
 * Build convergent layers from user profile.
 */
export function buildConvergence(profile: UserProfile): Convergence {
  const userAnimal = (profile.chineseZodiac ?? "") as Animal;
  const userYear = parseInt(profile.birthDate?.split("-")[0] || "0", 10);
  const lifePath = profile.lifePath;
  const birthdayNumber = extractBirthdayNumber(profile.birthDate);
  const currentYear = new Date().getFullYear();
  const yearAnimal = getYearAnimal(currentYear);
  const personalYear = calculatePersonalYear(profile.birthDate, currentYear);

  const layers: ConvergentLayer[] = [
    {
      id: "life-path",
      name: "Camino de Vida",
      value: lifePath,
      emoji: "🔢",
      description: `Tu número principal: ${lifePath}`,
    },
    {
      id: "birthday",
      name: "Número de cumpleaños",
      value: birthdayNumber,
      emoji: "🎂",
      description: `Tu número de nacimiento: ${birthdayNumber}`,
    },
    {
      id: "animal",
      name: "Animal zodiacal",
      value: userAnimal,
      emoji: "🐉",
      description: `Tu animal: ${userAnimal}`,
    },
    {
      id: "year-animal",
      name: "Animal del año",
      value: yearAnimal,
      emoji: "📅",
      description: `Año actual: ${yearAnimal}`,
    },
    {
      id: "personal-year",
      name: "Año personal",
      value: personalYear,
      emoji: "🔄",
      description: `Año personal: ${personalYear}`,
    },
  ];

  // Detect convergences
  const convergentCount = detectConvergences(layers, lifePath, personalYear, userAnimal, yearAnimal);

  let convergenceLevel: Convergence["convergenceLevel"];
  let message: string;
  let insight: string;

  if (convergentCount >= 3) {
    convergenceLevel = "strong";
    message = "Alta resonancia de patrones";
    insight = "Varios de tus patrones personales están alineados este año. Según estas tradiciones, es un momento de coherencia simbólica.";
  } else if (convergentCount >= 2) {
    convergenceLevel = "moderate";
    message = "Resonancia moderada de patrones";
    insight = "Algunos de tus patrones muestran alineación. Un momento de observación y conexión.";
  } else {
    convergenceLevel = "low";
    message = "Patrones independientes";
    insight = "Tus patrones actúan de forma independiente. Un momento de exploración diversa.";
  }

  return {
    layers,
    convergentCount,
    totalLayers: layers.length,
    convergenceLevel,
    message,
    insight,
  };
}

// ════════════════════════════════════════════════════
// CONVERGENCE DETECTION
// ════════════════════════════════════════════════════

function detectConvergences(
  layers: ConvergentLayer[],
  lifePath: number,
  personalYear: number,
  userAnimal: Animal,
  yearAnimal: Animal,
): number {
  let count = 0;

  // Life Path = Personal Year number
  if (lifePath === personalYear) count++;

  // Animal matches year animal
  if (userAnimal === yearAnimal) count++;

  // Life Path matches personal year digit
  if (lifePath === personalYear) count++;

  // Birthday number matches personal year
  const birthday = layers.find(l => l.id === "birthday");
  if (birthday && birthday.value === personalYear) count++;

  // Life Path odd/even matches animal Yang/Yin
  const yangAnimals = ["Rata", "Tigre", "Dragón", "Caballo", "Mono", "Perro"];
  const isYangAnimal = yangAnimals.includes(userAnimal);
  const isOddLifePath = lifePath % 2 === 1;
  if (isYangAnimal === isOddLifePath) count++;

  return count;
}

function extractBirthdayNumber(birthDate?: string): number {
  if (!birthDate) return 0;
  const day = parseInt(birthDate.split("-")[2] || "0", 10);
  return calculateBirthDayNumber(day);
}
