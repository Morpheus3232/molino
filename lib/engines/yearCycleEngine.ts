/**
 * Year Cycle Engine
 *
 * Calculates the Chinese zodiac animal for any year
 * and its relationship to the user's natal animal.
 *
 * NO predictions. Cultural/symbolic reading only.
 */

import { calculateAnimalFromDate } from "@/lib/engines/chineseZodiacEngine";
import { getRelation, type Animal, type RelationType } from "@/lib/data/animalRelations";

// ════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════

export type YearCycleType =
  | "same-sign"
  | "harmonious"
  | "neutral"
  | "challenge";

export interface YearCycle {
  yearAnimal: Animal;
  year: number;
  cycleType: YearCycleType;
  score: number;
  level: number;         // 1-5 stars
  label: string;
  explanation: string;
  themes: string[];
  explore: string[];
  observe: string[];
}

export interface YearCycleHistory {
  year: number;
  animal: Animal;
  cycleType: YearCycleType;
  score: number;
}

// ════════════════════════════════════════════════════
// METADATA
// ════════════════════════════════════════════════════

export const YEAR_CYCLE_META: Record<YearCycleType, {
  label: string;
  color: string;
  stars: number;
  description: string;
}> = {
  "same-sign": {
    label: "Alta resonancia anual",
    color: "#2D5A3D",
    stars: 5,
    description: "Tu signo coincide con el animal del año actual",
  },
  harmonious: {
    label: "Periodo de afinidad simbólica",
    color: "#426393",
    stars: 4,
    description: "El año pertenece a un signo aliado con el tuyo",
  },
  neutral: {
    label: "Periodo de observación y adaptación",
    color: "#7B5E1C",
    stars: 3,
    description: "Sin relación especial con el ciclo actual",
  },
  challenge: {
    label: "Periodo de mayor atención simbólica",
    color: "#9C4808",
    stars: 2,
    description: "Ciclo de contraste — oportunidad de reflexión",
  },
};

// ════════════════════════════════════════════════════
// YEAR ANIMAL
// ════════════════════════════════════════════════════

/**
 * Get the Chinese zodiac animal for any Gregorian year.
 * Uses June 1st as fallback (always after Chinese New Year).
 */
export function getYearAnimal(year: number): Animal {
  const { animal } = calculateAnimalFromDate(undefined, year);
  return animal as Animal;
}

/**
 * Get the current year's zodiac animal.
 */
export function getCurrentYearAnimal(): { animal: Animal; year: number } {
  const year = new Date().getFullYear();
  return { animal: getYearAnimal(year), year };
}

// ════════════════════════════════════════════════════
// YEAR CYCLE RESOLUTION
// ════════════════════════════════════════════════════

/**
 * Resolve the annual cycle for a user in a given year.
 */
export function resolveYearCycle(userAnimal: Animal, year?: number): YearCycle {
  const targetYear = year ?? new Date().getFullYear();
  const yearAnimal = getYearAnimal(targetYear);

  const relation = getRelation(userAnimal, yearAnimal);
  const score = relation.score;

  let cycleType: YearCycleType;
  if (userAnimal === yearAnimal) {
    cycleType = "same-sign";
  } else if (relation.type === "triad" || relation.type === "harmonious") {
    cycleType = "harmonious";
  } else if (relation.type === "clash" || relation.type === "harm") {
    cycleType = "challenge";
  } else {
    cycleType = "neutral";
  }

  const meta = YEAR_CYCLE_META[cycleType];

  return {
    yearAnimal,
    year: targetYear,
    cycleType,
    score,
    level: meta.stars,
    label: meta.label,
    explanation: getYearExplanation(cycleType, userAnimal, yearAnimal),
    themes: getYearThemes(cycleType),
    explore: getYearExplore(cycleType, yearAnimal),
    observe: getYearObserve(cycleType),
  };
}

/**
 * Get cycle history: past 5 + current + next 5 years.
 */
export function getYearCycleHistory(userAnimal: Animal): YearCycleHistory[] {
  const currentYear = new Date().getFullYear();
  const years: YearCycleHistory[] = [];

  for (let y = currentYear - 5; y <= currentYear + 5; y++) {
    const cycle = resolveYearCycle(userAnimal, y);
    years.push({
      year: y,
      animal: cycle.yearAnimal,
      cycleType: cycle.cycleType,
      score: cycle.score,
    });
  }

  return years;
}

// ════════════════════════════════════════════════════
// YEAR RESONANCE
// ════════════════════════════════════════════════════

export type YearResonanceType =
  | "alignment"    // mismo animal — máxima resonancia
  | "harmony"      // signo aliado — buena resonancia
  | "neutral"      // sin relación especial
  | "adaptation";  // relación desafiante — requiere adaptación

export interface YearResonance {
  type: YearResonanceType;
  label: string;
  score: number;
  advice: string;
  color: string;
}

/**
 * Calculate the year resonance between user and current year.
 * Returns a structured result with type, score, and contextual advice.
 */
export function calculateYearResonance(
  userAnimal: Animal,
  currentYearAnimal: Animal,
): YearResonance {
  const relation = getRelation(userAnimal, currentYearAnimal);

  let type: YearResonanceType;
  let label: string;
  let advice: string;
  let color: string;

  if (userAnimal === currentYearAnimal) {
    type = "alignment";
    label = "Año de alineación";
    advice = "Tu signo coincide con el ciclo actual. Un período de fuerte resonancia personal.";
    color = "#2D5A3D";
  } else if (relation.type === "triad" || relation.type === "harmonious") {
    type = "harmony";
    label = "Año de armonía";
    advice = `El ciclo actual pertenece a ${currentYearAnimal}, un signo aliado con tu ${userAnimal}. Favorece la colaboración y la expansión.`;
    color = "#426393";
  } else if (relation.type === "clash" || relation.type === "harm") {
    type = "adaptation";
    label = "Año de mayor adaptación";
    advice = `El ciclo actual presenta un contraste con tu signo. La tradición recomienda priorizar estrategia y estabilidad.`;
    color = "#9C4808";
  } else {
    type = "neutral";
    label = "Año de observación";
    advice = "Sin relación especial con el ciclo actual. Un período de construcción silenciosa.";
    color = "#7B5E1C";
  }

  return {
    type,
    label,
    score: relation.score,
    advice,
    color,
  };
}

// ════════════════════════════════════════════════════
// COPY
// ════════════════════════════════════════════════════

function getYearExplanation(type: YearCycleType, user: string, year: string): string {
  switch (type) {
    case "same-sign":
      return `Según la tradición del zodíaco chino, este es un período de fuerte resonancia simbólica con tu signo. Un año para enfocarte en identidad, movimiento y decisiones alineadas con tus valores.`;
    case "harmonious":
      return `${user} y ${year} tienen una relación tradicional de armonía. Según esta tradición, es un ciclo que favorece la colaboración, las alianzas y la expansión natural.`;
    case "neutral":
      return `${user} y ${year} no tienen una relación especial en el ciclo del zodíaco chino. Un período de observación, adaptación y construcción silenciosa.`;
    case "challenge":
      return `Según esta tradición, ${user} y ${year} presentan un contraste simbólico. Puede ser un ciclo para actuar con más reflexión, evitar decisiones impulsivas y priorizar estabilidad.`;
  }
}

function getYearThemes(type: YearCycleType): string[] {
  switch (type) {
    case "same-sign": return ["Identidad", "Movimiento", "Decisión", "Alineación"];
    case "harmonious": return ["Colaboración", "Expansión", "Alianzas", "Crecimiento"];
    case "neutral": return ["Observación", "Adaptación", "Construcción", "Paciencia"];
    case "challenge": return ["Reflexión", "Planificación", "Estabilidad", "Equilibrio"];
  }
}

function getYearExplore(type: YearCycleType, yearAnimal: string): string[] {
  switch (type) {
    case "same-sign": return [`Marcas ${yearAnimal}`, `Lugares ${yearAnimal}`, `Símbolos compatibles`];
    case "harmonious": return [`Marcas ${yearAnimal}`, `Símbolos de apoyo`];
    case "neutral": return [`Exploración libre`, `Nuevas conexiones`];
    case "challenge": return [`Estabilidad`, `Lo conocido`, `Símbolos de equilibrio`];
  }
}

function getYearObserve(type: YearCycleType): string[] {
  if (type === "challenge") {
    return ["Decisiones impulsivas", "Excesos", "Cambios sin planificación"];
  }
  return [];
}
