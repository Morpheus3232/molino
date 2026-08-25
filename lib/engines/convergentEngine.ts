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

/** Una coincidencia concreta entre dos capas, con su regla explícita. */
export interface ConvergentMatch {
  /** Las dos capas que coinciden, por id. */
  between: [string, string];
  /** Qué coincide, en una línea legible. */
  label: string;
  /** La regla que la produjo — lo que hace verificable el hallazgo. */
  rule: string;
}

export interface Convergence {
  layers: ConvergentLayer[];
  matches: ConvergentMatch[];
  convergentCount: number;
  totalLayers: number;
  convergenceLevel: "strong" | "moderate" | "low";
  message: string;
  insight: string;
}

/**
 * Qué describe el número del día en que naciste.
 *
 * En la numerología pitagórica esta posición es la que habla de RASGOS DE
 * PERSONALIDAD: cómo se te ve y cómo encarás las cosas, a diferencia del
 * Camino de Vida, que describe el recorrido. El nombre "número de cumpleaños"
 * que se usaba antes describía de dónde sale el dato, no qué dice.
 *
 * Se calcula reduciendo el día (1-31) a un dígito, conservando 11 y 22 como
 * maestros. Con días hasta 31, el 33 no es alcanzable.
 *
 * Cada entrada nombra el rasgo y su costo: sin el costo es un horóscopo.
 */
export const BIRTH_DAY_PERSONALITY: Record<number, string> = {
  1: "Iniciativa y empuje propio. Arrancás sin esperar permiso, y te cuesta delegar lo que sabés hacer.",
  2: "Lectura fina del clima ajeno. Negociás bien y sostenés vínculos, con la contra de que imponerte te cuesta.",
  3: "Expresión y humor. Se te da contar y conectar, y el riesgo es dispersarte entre demasiadas cosas.",
  4: "Método y constancia. Construís sobre lo que ya está firme, y la rigidez es el precio.",
  5: "Versatilidad e inquietud. Te adaptás rápido a lo nuevo, y quedarte quieto es lo difícil.",
  6: "Responsabilidad afectiva. Te hacés cargo de los tuyos, a veces cargando más de lo que te toca.",
  7: "Análisis y reserva. Entendés antes de opinar, y esa misma distancia puede leerse como frialdad.",
  8: "Ambición y criterio práctico. Ves el resultado y el camino, con una exigencia que también aplicás a otros.",
  9: "Visión amplia y generosidad. Pensás en el conjunto, y el idealismo te puede dejar sin límites propios.",
  11: "Intuición marcada. Percibís antes de razonar, con una intensidad que por dentro se siente como tensión.",
  22: "Capacidad de construir en grande. Aguantás proyectos largos, y la vara que te ponés es alta.",
};

/** Lectura del número del día. Devuelve string vacío si no hay dato. */
export function getBirthDayPersonality(n: number): string {
  return BIRTH_DAY_PERSONALITY[n] ?? "";
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
      name: "Número de personalidad",
      value: birthdayNumber,
      emoji: "🎂",
      description: getBirthDayPersonality(birthdayNumber) || `Número del día: ${birthdayNumber}`,
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
  const matches = detectConvergences(layers, lifePath, personalYear, userAnimal, yearAnimal);
  const convergentCount = matches.length;

  let convergenceLevel: Convergence["convergenceLevel"];
  let message: string;
  let insight: string;

  if (convergentCount >= 3) {
    convergenceLevel = "strong";
    message = "Alta resonancia de patrones";
  } else if (convergentCount >= 2) {
    convergenceLevel = "moderate";
    message = "Resonancia moderada de patrones";
  } else {
    convergenceLevel = "low";
    message = "Patrones independientes";
  }

  // El insight nombra QUÉ coincide, no solo que algo coincide. Un texto que
  // dice "algunos de tus patrones muestran alineación" no aporta nada que el
  // número de al lado no diga ya.
  if (convergentCount === 0) {
    insight =
      "Ninguna de tus capas coincide con otra este año: cada sistema apunta a algo distinto. En estas tradiciones eso se lee como un año de exploración en varios frentes, no como una falta.";
  } else {
    const listado = matches.map((m) => m.rule.toLowerCase()).join("; ");
    insight =
      convergentCount === 1
        ? `Hay una coincidencia entre tus capas (${listado}). El resto de los sistemas apunta a lugares distintos.`
        : `Hay ${convergentCount} coincidencias entre tus capas (${listado}). Cuando sistemas que se calculan por separado dan el mismo resultado, estas tradiciones lo leen como un patrón más marcado.`;
  }

  return {
    layers,
    matches,
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
): ConvergentMatch[] {
  const matches: ConvergentMatch[] = [];

  // Antes esta función solo devolvía un número, y contaba
  // `lifePath === personalYear` DOS veces (una como "Life Path = Personal
  // Year number" y otra como "Life Path matches personal year digit": misma
  // condición, distinto comentario), lo que inflaba el nivel de resonancia.
  // Ahora devuelve las coincidencias concretas, cada una con la regla que la
  // produjo — el conteo sale de la longitud, así que no se puede volver a
  // duplicar sin que se vea.

  if (lifePath === personalYear) {
    matches.push({
      between: ["life-path", "personal-year"],
      label: `Tu Camino de Vida y tu Año Personal son el mismo número: ${lifePath}`,
      rule: "Camino de Vida = Año Personal",
    });
  }

  if (userAnimal === yearAnimal) {
    matches.push({
      between: ["animal", "year-animal"],
      label: `Este es tu año: el animal del año vuelve a ser ${userAnimal}`,
      rule: "Animal natal = animal del año en curso",
    });
  }

  const birthday = layers.find((l) => l.id === "birthday");
  if (birthday && birthday.value === personalYear) {
    matches.push({
      between: ["birthday", "personal-year"],
      label: `Tu número de personalidad coincide con tu Año Personal: ${personalYear}`,
      rule: "Número de personalidad = Año Personal",
    });
  }

  const yangAnimals = ["Rata", "Tigre", "Dragón", "Caballo", "Mono", "Perro"];
  const isYangAnimal = yangAnimals.includes(userAnimal);
  const isOddLifePath = lifePath % 2 === 1;
  if (isYangAnimal === isOddLifePath) {
    const polaridad = isYangAnimal ? "Yang" : "Yin";
    const paridad = isOddLifePath ? "impar" : "par";
    matches.push({
      between: ["life-path", "animal"],
      label: `Tu Camino de Vida ${paridad} y tu animal ${polaridad} comparten polaridad`,
      rule: `Camino de Vida ${paridad} ↔ animal ${polaridad}`,
    });
  }

  return matches;
}

function extractBirthdayNumber(birthDate?: string): number {
  if (!birthDate) return 0;
  const day = parseInt(birthDate.split("-")[2] || "0", 10);
  return calculateBirthDayNumber(day);
}
