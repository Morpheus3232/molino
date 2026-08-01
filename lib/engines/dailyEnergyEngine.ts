/**
 * Daily Energy Engine
 *
 * Calculates daily energy based on user profile and target date.
 * All calculations are deterministic: same inputs = same outputs.
 *
 * Uses existing numerology, astrology, and cycle calculations.
 * No random values, no external APIs.
 */

import type { UserProfile } from '@/types/user';
import { getPersonalDayForDate, getPersonalYear, getMoonPhase, calculateLifePath } from '@/lib/calculations';
import { getSunSign } from './astrologyEngine';
import { getChineseZodiac } from './chineseZodiacEngine';

export interface DailyEnergyResult {
  date: string;
  overallScore: number;
  theme: string;
  description: string;
  strengths: string[];
  cautions: string[];
  areas: {
    work: { score: number; label: string };
    relationships: { score: number; label: string };
    creativity: { score: number; label: string };
    decisions: { score: number; label: string };
  };
  moonPhase: { phase: string; emoji: string; description: string };
  personalDay: number;
  personalYear: number;
  personalMonth: number;
  elementInfluence: string;
  explanation: string;
}

const THEME_BY_PERSONAL_DAY: Record<number, { theme: string; description: string }> = {
  1: { theme: "Iniciación", description: "Un día para comenzar algo nuevo. Tu energía está orientada hacia la acción y la iniciativa." },
  2: { theme: "Cooperación", description: "Un día para conectar con otros. La paciencia y la escucha activa son tus mejores herramientas." },
  3: { theme: "Expresión", description: "Un día para comunicar y crear. Tu voz tiene poder especial hoy." },
  4: { theme: "Construcción", description: "Un día para organizar y trabajar. La disciplina te recompensará." },
  5: { theme: "Cambio", description: "Un día para adaptarse y explorar. Abríte a lo inesperado." },
  6: { theme: "Armonía", description: "Un día para cuidar de quienes te rodean. El equilibrio es la clave." },
  7: { theme: "Introspección", description: "Un día para mirar hacia adentro. La sabiduría viene del silencio." },
  8: { theme: "Manifestación", description: "Un día de poder personal. Asumí liderazgo en lo que importa." },
  9: { theme: "Cierre", description: "Un día para completar y soltar. Liberá lo que ya no te sirve." },
  11: { theme: "Iluminación", description: "Un día de intuición elevada. Prestá atención a las señales." },
  22: { theme: "Construcción Divina", description: "Un día de visión práctica. Soñá en grande, construí con determinación." },
  33: { theme: "Amor Universal", description: "Un día de servicio y compasión. Tu energía sanadora está al máximo." },
};

const STRENGTHS_BY_PERSONAL_DAY: Record<number, string[]> = {
  1: ["Iniciativa", "Claridad", "Coraje"],
  2: ["Diplomacia", "Paciencia", "Intuición"],
  3: ["Creatividad", "Comunicación", "Carisma"],
  4: ["Organización", "Disciplina", "Persistencia"],
  5: ["Adaptabilidad", "Curiosidad", "Entusiasmo"],
  6: ["Empatía", "Responsabilidad", "Armonía"],
  7: ["Análisis", "Observación", "Sabiduría"],
  8: ["Estrategia", "Liderazgo", "Visión"],
  9: ["Compasión", "Sabiduría", "Soltar"],
  11: ["Intuición", "Inspiración", "Conexión"],
  22: ["Organización", "Visión", "Manifestación"],
  33: ["Sanación", "Compasión", "Servicio"],
};

const CAUTIONS_BY_PERSONAL_DAY: Record<number, string[]> = {
  1: ["Impaciencia", "Ego", "Aislamiento"],
  2: ["Dependencia", "Indecisión", "Hipersensibilidad"],
  3: ["Dispersión", "Exageración", "Superficialidad"],
  4: ["Rigidez", "Terquedad", "Resistencia al cambio"],
  5: ["Inquietud", "Impulsividad", "Inconstancia"],
  6: ["Autosacrificio", "Control", "Culpa"],
  7: ["Aislamiento", "Escepticismo", "Perfeccionismo"],
  8: ["Materialismo", "Control", "Intimidación"],
  9: ["Apego", "Ego excesivo", "Dificultad para soltar"],
  11: ["Ansiedad", "Inseguridad", "Sobreestimulación"],
  22: ["Presión", "Perfeccionismo", "Rigidez"],
  33: ["Autosacrificio", "Carga emocional", "Agotamiento"],
};

/**
 * Calculate daily energy for a user on a specific date.
 * Deterministic: same inputs always produce the same output.
 */
export function calculateDailyEnergy(
  profile: UserProfile,
  targetDate: Date = new Date()
): DailyEnergyResult {
  const birthParts = profile.birthDate.split('-').map(Number);
  const birthDay = birthParts[2] || 1;
  const birthMonth = birthParts[1] || 1;
  const birthYear = birthParts[0] || 1990;

  // Calculate personal cycles for the target date
  const personalDay = getPersonalDayForDate(birthDay, birthMonth, birthYear, targetDate);
  const personalYear = getPersonalYear(birthDay, birthMonth, birthYear, targetDate.getFullYear());
  const personalMonth = getPersonalYear(birthDay, birthMonth, birthYear, targetDate.getFullYear(), undefined, targetDate.getMonth() + 1);

  // Get moon phase
  const moonPhase = getMoonPhase(targetDate);

  // Get element influence based on sun sign
  const daySunSign = getSunSign(
    `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`
  );
  const elementInfluence = getElementInfluence(profile.element, daySunSign);

  // Calculate overall score (deterministic)
  const baseScore = calculateEnergyScore(personalDay, personalYear, personalMonth, moonPhase.phase, profile.element);
  const overallScore = Math.min(100, Math.max(1, baseScore));

  // Get theme and description
  const themeData = THEME_BY_PERSONAL_DAY[personalDay] || THEME_BY_PERSONAL_DAY[1];
  const strengths = STRENGTHS_BY_PERSONAL_DAY[personalDay] || ["Claridad", "Acción", "Conexión"];
  const cautions = CAUTIONS_BY_PERSONAL_DAY[personalDay] || ["Impaciencia", "Distracción"];

  // Calculate area scores (deterministic based on personal day and element)
  const areas = calculateAreaScores(personalDay, profile.element, moonPhase.phase);

  // Generate explanation
  const explanation = generateExplanation(profile, personalDay, personalYear, moonPhase.phase, overallScore);

  return {
    date: targetDate.toISOString().split('T')[0],
    overallScore,
    theme: themeData.theme,
    description: themeData.description,
    strengths,
    cautions,
    areas,
    moonPhase,
    personalDay,
    personalYear,
    personalMonth,
    elementInfluence,
    explanation,
  };
}

/**
 * Calculate energy score deterministically.
 * Based on personal day number, element harmony, and moon phase.
 */
function calculateEnergyScore(
  personalDay: number,
  personalYear: number,
  personalMonth: number,
  moonPhase: string,
  element: string
): number {
  // Base score from personal day (1-9, 11, 22, 33)
  let score = 50;

  // Personal day influence (1-9 scale, master numbers boost)
  if (personalDay >= 1 && personalDay <= 9) {
    score = 40 + (personalDay * 6);
  } else if (personalDay === 11) {
    score = 85;
  } else if (personalDay === 22) {
    score = 90;
  } else if (personalDay === 33) {
    score = 95;
  }

  // Year-Month harmony bonus
  if (personalYear === personalMonth) {
    score += 5;
  }

  // Moon phase influence
  if (moonPhase === "Llena" || moonPhase === "Creciente") {
    score += 5;
  } else if (moonPhase === "Menguante" || moonPhase === "Cuarto Menguante") {
    score -= 3;
  }

  // Element bonus (elements that are naturally energizing)
  if (element === "Fuego" || element === "Aire") {
    score += 3;
  }

  return Math.min(100, Math.max(1, score));
}

/**
 * Calculate area-specific scores (deterministic).
 */
function calculateAreaScores(
  personalDay: number,
  element: string,
  moonPhase: string
): DailyEnergyResult['areas'] {
  const base = 50;

  // Work: influenced by structured numbers (4, 8) and earth element
  let work = base;
  if ([4, 8].includes(personalDay)) work += 15;
  if (element === "Tierra") work += 10;
  if (moonPhase === "Creciente") work += 5;

  // Relationships: influenced by cooperative numbers (2, 6) and water element
  let relationships = base;
  if ([2, 6].includes(personalDay)) relationships += 15;
  if (element === "Agua") relationships += 10;
  if (moonPhase === "Llena") relationships += 5;

  // Creativity: influenced by expressive numbers (3, 5) and fire element
  let creativity = base;
  if ([3, 5].includes(personalDay)) creativity += 15;
  if (element === "Fuego") creativity += 10;
  if (moonPhase === "Creciente") creativity += 5;

  // Decisions: influenced by analytical numbers (7, 9) and air element
  let decisions = base;
  if ([7, 9].includes(personalDay)) decisions += 15;
  if (element === "Aire") decisions += 10;
  if (moonPhase === "Llena") decisions += 5;

  return {
    work: { score: Math.min(100, work), label: getAreaLabel(work) },
    relationships: { score: Math.min(100, relationships), label: getAreaLabel(relationships) },
    creativity: { score: Math.min(100, creativity), label: getAreaLabel(creativity) },
    decisions: { score: Math.min(100, decisions), label: getAreaLabel(decisions) },
  };
}

function getAreaLabel(score: number): string {
  if (score >= 80) return "Muy favorable";
  if (score >= 65) return "Favorable";
  if (score >= 50) return "Neutral";
  if (score >= 35) return "Desafiante";
  return "Muy desafiante";
}

/**
 * Get element influence description.
 */
function getElementInfluence(userElement: string, dayElement: string): string {
  if (userElement === dayElement) {
    return `Tu elemento ${userElement} resuena con el elemento del día. Energía alineada.`;
  }
  if (
    (userElement === "Fuego" && dayElement === "Aire") ||
    (userElement === "Aire" && dayElement === "Fuego") ||
    (userElement === "Tierra" && dayElement === "Agua") ||
    (userElement === "Agua" && dayElement === "Tierra")
  ) {
    return `Tu elemento ${userElement} se complementa con el elemento del día (${dayElement}). Energía armoniosa.`;
  }
  return `Tu elemento ${userElement} entra en tensión con el elemento del día (${dayElement}). Momento de equilibrio.`;
}

/**
 * Generate a personalized explanation.
 */
function generateExplanation(
  profile: UserProfile,
  personalDay: number,
  personalYear: number,
  moonPhase: string,
  score: number
): string {
  const theme = THEME_BY_PERSONAL_DAY[personalDay]?.theme || "Energía mixta";
  const yearTheme = getYearTheme(personalYear);

  let explanation = `Hoy es un día de energía ${theme.toLowerCase()}. `;
  explanation += `Tu año personal (${personalYear}) indica ${yearTheme}. `;
  explanation += `La fase lunar ${moonPhase.toLowerCase()} agrega una cualidad específica a tu día.`;

  if (score >= 75) {
    explanation += " Es un día favorable para acciones importantes.";
  } else if (score >= 50) {
    explanation += " Es un día equilibrado. Ideal para planificar y reflexionar.";
  } else {
    explanation += " Es un día de mayor intensidad. Conocé tus límites y actuá con consciencia.";
  }

  return explanation;
}

export function getYearTheme(year: number): string {
  const themes: Record<number, string> = {
    1: "un año de nuevos comienzos",
    2: "un año de cooperación y relaciones",
    3: "un año de expresión y creatividad",
    4: "un año de trabajo y estabilidad",
    5: "un año de cambio y aventura",
    6: "un año de responsabilidad y hogar",
    7: "un año de introspección y sabiduría",
    8: "un año de manifestación y poder",
    9: "un año de cierre y compasión",
    11: "un año de intuición elevada",
    22: "un año de construcción a gran escala",
    33: "un año de servicio y amor",
  };
  return themes[year] || "un año de crecimiento";
}
