/**
 * Decisions Engine
 *
 * Analyzes decisions based on user profile, daily energy, and timing.
 * Uses existing numerology, astrology, and cycle calculations.
 * All calculations are deterministic: same inputs = same outputs.
 */

import type { UserProfile } from '@/types/user';
import { getPersonalDayForDate, getPersonalYear, getMoonPhase } from '@/lib/calculations';
import { calculateDailyEnergy, type DailyEnergyResult } from './dailyEnergyEngine';
import { detectDecisionIntent, type DecisionIntent } from './decisionIntent';

export type DecisionCategory =
  | 'career'
  | 'relationships'
  | 'creativity'
  | 'finances'
  | 'health'
  | 'education'
  | 'travel'
  | 'personal'
  | 'other';

export interface DecisionResult {
  question: string;
  category: DecisionCategory;
  overallScore: number;
  alignmentScore: number;
  timingScore: number;
  energyScore: number;
  recommendation: string;
  reasoning: string;
  considerations: string[];
  nextSteps: string[];
  personalDay: number;
  personalYear: number;
  moonPhase: string;
  elementInfluence: string;
  detectedIntent?: DecisionIntent;
}

const CATEGORY_LABELS: Record<DecisionCategory, string> = {
  career: "Carrera y trabajo",
  relationships: "Relaciones",
  creativity: "Creatividad",
  finances: "Finanzas",
  health: "Salud",
  education: "Educación",
  travel: "Viajes",
  personal: "Personal",
  other: "Otro",
};

const CATEGORY_ELEMENT_AFFINITY: Record<DecisionCategory, string[]> = {
  career: ['Fuego', 'Tierra'],
  relationships: ['Agua', 'Aire'],
  creativity: ['Fuego', 'Aire'],
  finances: ['Tierra', 'Fuego'],
  health: ['Tierra', 'Agua'],
  education: ['Aire', 'Tierra'],
  travel: ['Fuego', 'Aire'],
  personal: ['Aire', 'Agua'],
  other: ['Fuego', 'Tierra', 'Aire', 'Agua'],
};

/**
 * Analyze a decision based on user profile and current state.
 * Deterministic: same inputs always produce the same output.
 */
export function analyzeDecision(
  profile: UserProfile,
  question: string,
  category: DecisionCategory
): DecisionResult {
  const now = new Date();
  const birthParts = profile.birthDate.split('-').map(Number);
  const birthDay = birthParts[2] || 1;
  const birthMonth = birthParts[1] || 1;
  const birthYear = birthParts[0] || 1990;

  const personalDay = getPersonalDayForDate(birthDay, birthMonth, birthYear, now);
  const personalYear = getPersonalYear(birthDay, birthMonth, birthYear, now.getFullYear());
  const moonPhase = getMoonPhase(now);

  // Calculate energy for today
  const energy = calculateDailyEnergy(profile, now);

  // Calculate alignment score (how well the decision aligns with the user's profile)
  const alignmentScore = calculateAlignmentScore(profile, category);

  // Calculate timing score (is now a good time?)
  const timingScore = calculateTimingScore(personalDay, personalYear, moonPhase.phase, category);

  // Energy score from today's energy
  const energyScore = energy.overallScore;

  // Overall score (weighted average)
  const overallScore = Math.round(
    alignmentScore * 0.4 +
    timingScore * 0.3 +
    energyScore * 0.3
  );

  const detectedIntent = detectDecisionIntent(question, category);

  // Generate recommendation
  const recommendation = generateRecommendation(overallScore, category, personalDay, detectedIntent);

  // Generate reasoning
  const reasoning = generateReasoning(profile, category, overallScore, personalDay, moonPhase.phase, detectedIntent);

  // Generate considerations
  const considerations = generateConsiderations(profile, category, personalDay, personalYear, detectedIntent);

  // Generate next steps
  const nextSteps = generateNextSteps(overallScore, category, detectedIntent);

  return {
    question,
    category,
    overallScore,
    alignmentScore,
    timingScore,
    energyScore,
    recommendation,
    reasoning,
    considerations,
    nextSteps,
    personalDay,
    personalYear,
    moonPhase: moonPhase.phase,
    elementInfluence: getElementDecisionInfluence(profile.element, category),
    detectedIntent: detectedIntent ?? undefined,
  };
}

function calculateAlignmentScore(profile: UserProfile, category: DecisionCategory): number {
  let score = 50;

  // Element affinity with category
  const affinityElements = CATEGORY_ELEMENT_AFFINITY[category];
  if (affinityElements.includes(profile.element)) {
    score += 15;
  }

  // Life Path influence on decision-making
  const lifePathDecisionStyle: Record<number, number> = {
    1: 75, // Leaders make decisions quickly
    2: 60, // Diplomats consider others
    3: 65, // Communicators express through words
    4: 70, // Builders plan carefully
    5: 55, // Adventurers are impulsive
    6: 65, // Nurturers consider relationships
    7: 70, // Investigators analyze deeply
    8: 80, // Powerhouses decide strategically
    9: 60, // Humanitarians consider impact
    11: 65, // Visionaries trust intuition
    22: 75, // Master builders plan big
    33: 70, // Masters consider service
  };
  score = (score + (lifePathDecisionStyle[profile.lifePath] || 65)) / 2;

  // Sun sign decision style
  const sunSignDecisionBonus: Record<string, number> = {
    'Aries': 10, 'Leo': 8, 'Sagitario': 8,
    'Tauro': 5, 'Virgo': 5, 'Capricornio': 5,
    'Géminis': 3, 'Libra': 3, 'Acuario': 3,
    'Cáncer': 0, 'Escorpio': 0, 'Piscis': 0,
  };
  score += sunSignDecisionBonus[profile.sunSign] || 0;

  return Math.min(100, Math.max(1, Math.round(score)));
}

function calculateTimingScore(
  personalDay: number,
  personalYear: number,
  moonPhase: string,
  category: DecisionCategory
): number {
  let score = 50;

  // Personal day influence on timing
  const goodDecisionDays = [1, 7, 8, 9];
  const badDecisionDays = [5];

  if (goodDecisionDays.includes(personalDay)) {
    score += 15;
  } else if (badDecisionDays.includes(personalDay)) {
    score -= 10;
  }

  // Moon phase influence
  if (moonPhase === 'Llena' || moonPhase === 'Creciente') {
    score += 10;
  } else if (moonPhase === 'Menguante' || moonPhase === 'Cuarto Menguante') {
    score -= 5;
  }

  // Year energy
  if (personalYear >= 1 && personalYear <= 3) {
    score += 5;
  } else if (personalYear >= 7 && personalYear <= 9) {
    score -= 3;
  }

  return Math.min(100, Math.max(1, score));
}

function generateRecommendation(score: number, category: DecisionCategory, personalDay: number, intent: DecisionIntent | null): string {
  const categoryLabel = CATEGORY_LABELS[category];

  let recommendation: string;
  if (score >= 75) {
    recommendation = `El momento es favorable para tomar decisiones sobre ${categoryLabel.toLowerCase()}. Tu energía está alineada.`;
  } else if (score >= 55) {
    recommendation = `Es un buen momento para reflexionar sobre ${categoryLabel.toLowerCase()}. Considerá los pros y contras.`;
  } else if (score >= 40) {
    recommendation = `El momento es neutral para ${categoryLabel.toLowerCase()}. Si no tenés prisa, podés esperar.`;
  } else {
    recommendation = `Este momento presenta desafíos para decisiones sobre ${categoryLabel.toLowerCase()}. Considerá postergar.`;
  }

  if (intent) {
    const intentLine: Record<DecisionIntent['kind'], string> = {
      accion: ' Tu pregunta apunta a dar un paso concreto. Si te sentís alineado, avanzá con confianza.',
      espera: ' Tu pregunta refleja una intención de esperar. Aprovechá el momento para no apurarte.',
      revisar: ' Tu pregunta apunta a cerrar o abandonar algo. Valorá el cierre como parte del proceso.',
    };
    recommendation += intentLine[intent.kind];
  }

  return recommendation;
}

function generateReasoning(
  profile: UserProfile,
  category: DecisionCategory,
  overallScore: number,
  personalDay: number,
  moonPhase: string,
  intent: DecisionIntent | null
): string {
  const categoryLabel = CATEGORY_LABELS[category];

  let reasoning = `Analizando tu perfil para una decisión sobre ${categoryLabel.toLowerCase()}: `;
  reasoning += `Tu Life Path ${profile.lifePath} como ${profile.archetype} te da una perspectiva única. `;
  reasoning += `Tu elemento ${profile.element} ${getElementDecisionInfluence(profile.element, category).toLowerCase()}. `;
  reasoning += `Hoy es personal day ${personalDay}, lo que ${getDayDecisionInfluence(personalDay).toLowerCase()}. `;
  reasoning += `La fase lunar ${moonPhase.toLowerCase()} ${getMoonDecisionInfluence(moonPhase).toLowerCase()}.`;

  if (intent) {
    const intentLine: Record<DecisionIntent['kind'], string> = {
      accion: ' Tu intención de actuar es clara; el momento acompaña la iniciativa.',
      espera: ' Tu señal de espera sugiere cautela; conviene darte más margen antes de ejecutar.',
      revisar: ' Tu señal de revisión indica que este cierre puede liberarte energía.',
    };
    reasoning += intentLine[intent.kind];
  }

  return reasoning;
}

function generateConsiderations(
  profile: UserProfile,
  category: DecisionCategory,
  personalDay: number,
  personalYear: number,
  intent: DecisionIntent | null
): string[] {
  const considerations: string[] = [];

  // Life Path considerations
  if (profile.lifePath === 1 || profile.lifePath === 8) {
    considerations.push("Tu energía de liderazgo te impulsa a decidir rápido. Asegurate de considerar todas las opciones.");
  } else if (profile.lifePath === 2 || profile.lifePath === 6) {
    considerations.push("Tu naturaleza cooperativa te hace considerar a otros. No olvides tus propias necesidades.");
  } else if (profile.lifePath === 7) {
    considerations.push("Tu tendencia al análisis puede llevarte a sobre-pensar. Establecé un límite temporal.");
  }

  // Element considerations
  if (profile.element === 'Fuego') {
    considerations.push("Tu energía de fuego te hace impulsivo. Respirá profundo antes de decidir.");
  } else if (profile.element === 'Tierra') {
    considerations.push("Tu naturaleza práctica te hace metodico. Asegurate de no perderte en detalles.");
  } else if (profile.element === 'Aire') {
    considerations.push("Tu mente analítica ve muchas perspectivas. Elegí una y comprometete.");
  } else if (profile.element === 'Agua') {
    considerations.push("Tu intuición es fuerte. Pero verificá con datos objetivos.");
  }

  // Timing considerations
  if (personalDay === 5) {
    considerations.push("El día 5 trae cambio e imprevisibilidad. Podría haber sorpresas.");
  }

  if (personalYear === 4 || personalYear === 8) {
    considerations.push("Tu año personal favorece la estructura y el trabajo metódico.");
  }

  if (intent) {
    if (intent.kind === 'accion') {
      considerations.push("Tu intención de actuar es fuerte. Definí el paso concreto antes de comprometerte.");
    } else if (intent.kind === 'espera') {
      considerations.push("Elegiste esperar. Usá ese tiempo para reunir más información.");
    } else {
      considerations.push("Estás evaluando un cierre o abandono. Asegurate de no dejar pendientes importantes.");
    }
  }

  return considerations;
}

function generateNextSteps(score: number, category: DecisionCategory, intent: DecisionIntent | null): string[] {
  const steps: string[] = [];

  if (score >= 75) {
    steps.push("Escribí los pros y contras de cada opción.");
    steps.push("Hablá con alguien de confianza sobre tu decisión.");
    steps.push("Dale una semana antes de ejecutar para confirmar tu intuición.");
  } else if (score >= 55) {
    steps.push("Tomate tiempo para reflexionar sin presión.");
    steps.push("Investigá más sobre las opciones disponibles.");
    steps.push("Consultá con alguien que tenga experiencia en el tema.");
  } else if (score >= 40) {
    steps.push("No te apures. Este momento no es ideal para decisiones grandes.");
    steps.push("Enfocá tu energía en otras áreas por ahora.");
    steps.push("Volvé a evaluar en una semana.");
  } else {
    steps.push("Este momento presenta desafíos. Esperá una ventana más favorable.");
    steps.push("Enfocá tu energía en el autoconocimiento y la reflexión.");
    steps.push("La paciencia es tu mejor herramienta ahora.");
  }

  if (intent) {
    if (intent.kind === 'accion') {
      steps.push("Concretá el primer paso pequeño de tu plan de acción.");
    } else if (intent.kind === 'espera') {
      steps.push("Fijá una fecha para reevaluar tu decisión.");
    } else {
      steps.push("Planificá cómo cerrar este ciclo de forma ordenada.");
    }
  }

  return steps;
}

function getElementDecisionInfluence(element: string, category: DecisionCategory): string {
  const influences: Record<string, string> = {
    Fuego: "aporta pasión e iniciativa a tus decisiones",
    Tierra: "aporta estabilidad y practicidad a tus decisiones",
    Aire: "aporta claridad mental y comunicación a tus decisiones",
    Agua: "aporta intuición y empatía a tus decisiones",
  };
  return influences[element] || "influye en tu proceso de decisión";
}

function getDayDecisionInfluence(day: number): string {
  const influences: Record<number, string> = {
    1: "favorece las decisiones nuevas",
    2: "favorece las decisiones cooperativas",
    3: "favorece las decisiones creativas",
    4: "favorece las decisiones estructuradas",
    5: "trae cambio e imprevisibilidad",
    6: "favorece las decisiones de armonía",
    7: "favorece la introspección antes de decidir",
    8: "favorece las decisiones estratégicas",
    9: "favorece los cierres y finalizaciones",
  };
  return influences[day] || "ofrece una energía neutra";
}

function getMoonDecisionInfluence(phase: string): string {
  const influences: Record<string, string> = {
    "Nueva": "favorece los comienzos",
    "Creciente": "potencia el crecimiento",
    "Cuarto Creciente": "marca un punto de decisión",
    "Gibosa Creciente": "favorece la preparación",
    "Llena": "maximiza la manifestación",
    "Gibosa Menguante": "favorece la liberación",
    "Cuarto Menguante": "invita a la reevaluación",
    "Menguante": "favorece el descanso y la reflexión",
  };
  return influences[phase] || "agrega una cualidad específica";
}

export { CATEGORY_LABELS };
