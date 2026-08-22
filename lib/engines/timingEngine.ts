/**
 * Timing Engine
 *
 * Analyzes favorable dates for specific intentions.
 * Uses existing numerology, astrology, and cycle calculations.
 * All calculations are deterministic: same inputs = same outputs.
 */

import type { UserProfile } from '@/types/user';
import { getPersonalDayForDate, getPersonalYear, getMoonPhase, calculateLifePath } from '@/lib/calculations';
import { getSunSign } from './astrologyEngine';

export type TimingIntention =
  | 'start_project'
  | 'change_job'
  | 'launch_something'
  | 'sign_agreement'
  | 'make_decision'
  | 'start_relationship'
  | 'publish_something'
  | 'travel'
  | 'other';

export interface TimingResult {
  date: string;
  intention: TimingIntention;
  timingScore: number;
  theme: string;
  favorableDimensions: string[];
  challengingDimensions: string[];
  explanation: string;
  recommendedWindow: string;
  caveats: string[];
  personalDay: number;
  personalYear: number;
  moonPhase: string;
  elementInfluence: string;
}

const INTENTION_LABELS: Record<TimingIntention, string> = {
  start_project: "Iniciar un proyecto",
  change_job: "Cambiar de trabajo",
  launch_something: "Lanzar algo",
  sign_agreement: "Firmar un acuerdo",
  make_decision: "Tomar una decisión",
  start_relationship: "Empezar una relación",
  publish_something: "Publicar algo",
  travel: "Viajar",
  other: "Otro",
};

const INTENTION_FAVORABLE_DAYS: Record<TimingIntention, number[]> = {
  start_project: [1, 4, 8],
  change_job: [1, 5, 8],
  launch_something: [1, 3, 9],
  sign_agreement: [2, 6, 9],
  make_decision: [7, 9, 1],
  start_relationship: [2, 6, 3],
  publish_something: [3, 5, 9],
  travel: [5, 1, 3],
  other: [1, 2, 3, 4, 5, 6, 7, 8, 9],
};

const INTENTION_CHALLENGING_DAYS: Record<TimingIntention, number[]> = {
  start_project: [5, 9],
  change_job: [4, 6],
  launch_something: [4, 7],
  sign_agreement: [5, 8],
  make_decision: [5, 3],
  start_relationship: [5, 8],
  publish_something: [7, 4],
  travel: [4, 6],
  other: [],
};

/**
 * Analyze timing for a specific date and intention.
 * Deterministic: same inputs always produce the same output.
 */
export function analyzeTiming(
  profile: UserProfile,
  targetDate: Date,
  intention: TimingIntention
): TimingResult {
  const birthParts = profile.birthDate.split('-').map(Number);
  const birthDay = birthParts[2] || 1;
  const birthMonth = birthParts[1] || 1;
  const birthYear = birthParts[0] || 1990;

  const personalDay = getPersonalDayForDate(birthDay, birthMonth, birthYear, targetDate);
  const personalYear = getPersonalYear(birthDay, birthMonth, birthYear, targetDate.getFullYear());
  const moonPhase = getMoonPhase(targetDate);

  // Calculate timing score
  const timingScore = calculateTimingScore(personalDay, personalYear, intention, moonPhase.phase, profile.element);

  // Determine favorable and challenging dimensions
  const favorableDimensions = getFavorableDimensions(personalDay, personalYear, moonPhase.phase, profile.element);
  const challengingDimensions = getChallengingDimensions(personalDay, personalYear, moonPhase.phase, profile.element);

  // Generate explanation
  const explanation = generateTimingExplanation(profile, intention, personalDay, personalYear, moonPhase.phase, timingScore);

  // Generate recommended window
  const recommendedWindow = generateRecommendedWindow(intention, timingScore);

  // Generate caveats
  const caveats = generateCaveats(timingScore, personalDay, moonPhase.phase);

  const dateStr = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;

  return {
    date: dateStr,
    intention,
    timingScore,
    theme: INTENTION_LABELS[intention],
    favorableDimensions,
    challengingDimensions,
    explanation,
    recommendedWindow,
    caveats,
    personalDay,
    personalYear,
    moonPhase: moonPhase.phase,
    elementInfluence: getElementTimingInfluence(profile.element, personalDay),
  };
}

/**
 * Find the best dates within a range for a specific intention.
 */
export function findBestDates(
  profile: UserProfile,
  startDate: Date,
  endDate: Date,
  intention: TimingIntention,
  maxResults: number = 5
): TimingResult[] {
  const results: TimingResult[] = [];
  const current = new Date(startDate);

  while (current <= endDate && results.length < maxResults * 2) {
    results.push(analyzeTiming(profile, new Date(current), intention));
    current.setDate(current.getDate() + 1);
  }

  // Sort by score descending and return top results
  return results
    .sort((a, b) => b.timingScore - a.timingScore)
    .slice(0, maxResults);
}

function calculateTimingScore(
  personalDay: number,
  personalYear: number,
  intention: TimingIntention,
  moonPhase: string,
  element: string
): number {
  let score = 50;

  // Personal day alignment with intention
  const favorableDays = INTENTION_FAVORABLE_DAYS[intention];
  const challengingDays = INTENTION_CHALLENGING_DAYS[intention];

  if (favorableDays.includes(personalDay)) {
    score += 20;
  } else if (challengingDays.includes(personalDay)) {
    score -= 15;
  }

  // Moon phase influence
  if (moonPhase === "Llena" || moonPhase === "Creciente") {
    score += 10;
  } else if (moonPhase === "Menguante" || moonPhase === "Cuarto Menguante") {
    score -= 5;
  }

  // Element harmony with intention
  const elementBonus = getElementIntentionBonus(element, intention);
  score += elementBonus;

  // Year energy
  if (personalYear >= 1 && personalYear <= 3) {
    score += 5; // Growth years
  } else if (personalYear >= 7 && personalYear <= 9) {
    score -= 3; // Introspective years
  }

  return Math.min(100, Math.max(1, score));
}

function getElementIntentionBonus(element: string, intention: TimingIntention): number {
  const matrix: Record<string, Record<TimingIntention, number>> = {
    Fuego: { start_project: 10, change_job: 5, launch_something: 10, sign_agreement: 0, make_decision: 5, start_relationship: 5, publish_something: 8, travel: 8, other: 5 },
    Tierra: { start_project: 8, change_job: 3, launch_something: 5, sign_agreement: 10, make_decision: 5, start_relationship: 5, publish_something: 3, travel: 3, other: 5 },
    Aire: { start_project: 5, change_job: 8, launch_something: 5, sign_agreement: 8, make_decision: 10, start_relationship: 3, publish_something: 8, travel: 10, other: 5 },
    Agua: { start_project: 3, change_job: 5, launch_something: 3, sign_agreement: 5, make_decision: 5, start_relationship: 10, publish_something: 3, travel: 5, other: 5 },
  };
  return matrix[element]?.[intention] || 0;
}

function getFavorableDimensions(
  personalDay: number,
  personalYear: number,
  moonPhase: string,
  element: string
): string[] {
  const dims: string[] = [];

  if ([1, 4, 8].includes(personalDay)) dims.push("Estructura y organización");
  if ([2, 6].includes(personalDay)) dims.push("Relaciones y cooperación");
  if ([3, 5].includes(personalDay)) dims.push("Creatividad y expresión");
  if ([7, 9].includes(personalDay)) dims.push("Análisis y reflexión");
  if (moonPhase === "Creciente" || moonPhase === "Llena") dims.push("Energía lunar favorable");
  if (personalYear >= 1 && personalYear <= 3) dims.push("Ciclo anual de crecimiento");

  return dims.length > 0 ? dims : ["Energía neutral"];
}

function getChallengingDimensions(
  personalDay: number,
  personalYear: number,
  moonPhase: string,
  element: string
): string[] {
  const dims: string[] = [];

  if ([5, 9].includes(personalDay)) dims.push("Cambio e incertidumbre");
  if (moonPhase === "Menguante" || moonPhase === "Cuarto Menguante") dims.push("Energía lunar descendente");
  if (personalYear >= 7 && personalYear <= 9) dims.push("Ciclo anual de cierre");

  return dims;
}

function getElementTimingInfluence(element: string, personalDay: number): string {
  const influences: Record<string, string> = {
    Fuego: "aporta iniciativa y pasión. Potenciá tu energía natural.",
    Tierra: "aporta estabilidad y prakticidad. Construí sobre bases sólidas.",
    Aire: "aporta claridad mental y comunicación. Compartí ideas.",
    Agua: "aporta intuición y empatía. Escuchá tu instinto.",
    Metal: "aporta determinación y enfoque. Sabé lo que importa.",
    Madera: "aporta crecimiento y expansión. Abríte a nuevas posibilidades.",
  };
  const influence = influences[element] || "es única. Conocétela y usala a tu favor.";
  // "Elemento" sin calificar es ambiguo: Identidad usa el elemento del
  // zodíaco chino (Wu Xing) como dato protagonista; acá es el elemento
  // astrológico occidental. Mismo perfil, dos sistemas — sin la etiqueta
  // lee como una contradicción entre pantallas.
  return `Tu elemento astrológico, ${element}, ${influence}`;
}

function generateTimingExplanation(
  profile: UserProfile,
  intention: TimingIntention,
  personalDay: number,
  personalYear: number,
  moonPhase: string,
  score: number
): string {
  const intentionLabel = INTENTION_LABELS[intention];
  let explanation = `Para ${intentionLabel.toLowerCase()}, este día presenta una energía `;

  if (score >= 75) {
    explanation += "muy favorable. ";
  } else if (score >= 55) {
    explanation += "favorable. ";
  } else if (score >= 40) {
    explanation += "neutral. ";
  } else {
    explanation += "desafiante. ";
  }

  explanation += `Tu personal day (${personalDay}) aporta cualidades de ${getDayQuality(personalDay)}. `;
  explanation += `La fase lunar ${moonPhase.toLowerCase()} ${getMoonInfluence(moonPhase)}. `;
  explanation += getElementTimingInfluence(profile.element, personalDay);

  return explanation;
}

function getDayQuality(day: number): string {
  const qualities: Record<number, string> = {
    1: "iniciativa y liderazgo",
    2: "cooperación y diplomacia",
    3: "creatividad y expresión",
    4: "organización y disciplina",
    5: "cambio y adaptabilidad",
    6: "armonía y responsabilidad",
    7: "introspección y sabiduría",
    8: "poder y manifestación",
    9: "cierre y compasión",
    11: "intuición elevada",
    22: "construcción a gran escala",
    33: "amor y servicio",
  };
  return qualities[day] || "energía mixta";
}

function getMoonInfluence(phase: string): string {
  const influences: Record<string, string> = {
    "Nueva": "favorece los comienzos",
    "Creciente": "potencia el crecimiento",
    "Cuarto Creciente": "marca un punto de decisión",
    "Gibosa Creciente": "favorece la preparación",
    "Llena": "maximiza la manifestación",
    "Gibosa Menguante": "favorece la liberación",
    "Cuarto Menguante": "invita a la reevaluación",
    "Menguante": "favorece el descanso y la introspección",
  };
  return influences[phase] || "agrega una cualidad específica";
}

function generateRecommendedWindow(intention: TimingIntention, score: number): string {
  // Antes esta línea ignoraba `intention` pese a recibirlo: dos consultas
  // con distinto propósito (ej. "iniciar un proyecto" vs. "firmar un
  // acuerdo") pero score similar leían la misma recomendación genérica.
  const intentionLabel = INTENTION_LABELS[intention].toLowerCase();
  if (score >= 75) {
    return `Este es un momento excelente para ${intentionLabel}. Si sentís que es el momento, confiá en tu intuición.`;
  } else if (score >= 55) {
    return `Es un buen momento para ${intentionLabel}. Prepará bien los detalles y actuá con confianza.`;
  } else if (score >= 40) {
    return `El momento es neutral para ${intentionLabel}. Si no tenés prisa, podés esperar un día más favorable.`;
  } else {
    return `Este día presenta desafíos para ${intentionLabel}. Si podés postergar, esperá una ventana más favorable.`;
  }
}

function generateCaveats(score: number, personalDay: number, moonPhase: string): string[] {
  const caveats: string[] = [];

  caveats.push("Estas interpretaciones se basan en sistemas simbólicos, no en predicciones científicas.");
  caveats.push("Son herramientas de reflexión, no reglas absolutas.");

  if (score < 40) {
    caveats.push("Un score bajo no significa que no puedas actuar. Significa que hay más fricción de la habitual.");
  }

  if (personalDay === 5) {
    caveats.push("El día 5 trae cambio e imprevisibilidad. Podría haber sorpresas.");
  }

  if (moonPhase === "Menguante") {
    caveats.push("La luna menguante es un momento de liberación, no de inicio.");
  }

  return caveats;
}

export { INTENTION_LABELS };
