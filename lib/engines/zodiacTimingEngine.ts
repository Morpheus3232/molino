/**
 * Zodiac Timing Engine
 *
 * Envoltorio delgado sobre yearCycleEngine.ts — no duplica la lógica de
 * choques/armonías, solo la traduce a la forma de "año propio / año
 * enemigo" y agrega el próximo año propio y el próximo año enemigo.
 *
 * NO predicción. Lectura simbólica/cultural.
 */

import { getYearAnimal, resolveYearCycle } from "./yearCycleEngine";
import { getClashPartner, type Animal } from "@/lib/data/animalRelations";

export type TimingFavorability = "MUY_FAVORABLE" | "FAVORABLE" | "NEUTRAL" | "MUY_DESFAVORABLE";

export interface TimingAnalysis {
  sign: Animal;
  currentYear: number;
  currentYearSign: Animal;
  isOwnYear: boolean;
  isEnemyYear: boolean;
  isTrineYear: boolean;
  favorability: TimingFavorability;
  nextOwnYear: number;
  nextEnemyYear: number;
  regla: string;
  consejo: string;
}

const REGLA = "Según la tradición, el ciclo tiende a acompañarte en tu propio año y a pedirte más cautela en el año de tu signo opuesto.";

function findNextYear(fromYear: number, target: Animal): number {
  for (let y = fromYear; y < fromYear + 12; y++) {
    if (getYearAnimal(y) === target) return y;
  }
  return fromYear + 12;
}

/** Analiza el timing anual de un signo para un año determinado (por defecto, el actual). */
export function analyzeTiming(sign: Animal, queryYear: number = new Date().getFullYear()): TimingAnalysis {
  const currentYearSign = getYearAnimal(queryYear);
  const enemy = getClashPartner(sign);
  const cycle = resolveYearCycle(sign, queryYear);

  const isOwnYear = cycle.cycleType === "same-sign";
  const isEnemyYear = cycle.cycleType === "challenge";
  const isTrineYear = cycle.cycleType === "harmonious";

  const favorability: TimingFavorability = isOwnYear
    ? "MUY_FAVORABLE"
    : isTrineYear
      ? "FAVORABLE"
      : isEnemyYear
        ? "MUY_DESFAVORABLE"
        : "NEUTRAL";

  let consejo: string;
  if (isOwnYear) {
    consejo = "Este es TU año según el ciclo — un momento tradicionalmente asociado a lanzar proyectos y avanzar con confianza.";
  } else if (isEnemyYear) {
    consejo = "Año de tu signo opuesto en el ciclo — la tradición sugiere ser conservador y priorizar sostener lo que ya construiste.";
  } else if (isTrineYear) {
    consejo = "Año de afinidad según el ciclo — buen momento simbólico para colaboraciones y trabajo en equipo.";
  } else {
    consejo = "Año neutral en el ciclo — podés avanzar, sin la energía extra de un año propio o de afinidad.";
  }

  return {
    sign,
    currentYear: queryYear,
    currentYearSign,
    isOwnYear,
    isEnemyYear,
    isTrineYear,
    favorability,
    nextOwnYear: findNextYear(queryYear, sign),
    nextEnemyYear: enemy ? findNextYear(queryYear, enemy) : queryYear,
    regla: REGLA,
    consejo,
  };
}
