import type { UserProfile } from "@/types/user";

export interface BirthDayReduction {
  readonly original: number;
  readonly reductionPath: readonly number[];
  readonly finalValue: number;
  readonly isMaster: boolean;
}

export interface NumerologyProfile {
  lifePath: number;
  birthDayReduction?: BirthDayReduction;
  expressionNumber?: number;
  personalityNumber?: number;
  archetype: string;
  archetypeKeywords: string[];
  archetypeStrengths: string[];
  archetypeChallenges: string[];
}

export const ARCHETYPE_DESCRIPTIONS: Record<number, {
  name: string;
  keywords: string[];
  strengths: string[];
  challenges: string[];
  essence?: string;
}> = {
  1: {
    name: 'El Líder',
    keywords: ['Independiente', 'Innovador', 'Determinado'],
    strengths: ['Iniciativa', 'Creatividad', 'Coraje', 'Originalidad'],
    challenges: ['Impaciencia', 'Ego', 'Control']
  },
  2: {
    name: 'El Mediador',
    keywords: ['Diplomático', 'Sensible', 'Cooperativo'],
    strengths: ['Diplomacia', 'Intuición', 'Paciencia', 'Empatía'],
    challenges: ['Indecisión', 'Dependencia', 'Hipersensibilidad']
  },
  3: {
    name: 'El Comunicador',
    keywords: ['Creativo', 'Expresivo', 'Optimista'],
    strengths: ['Creatividad', 'Comunicación', 'Carisma', 'Optimismo'],
    challenges: ['Dispersión', 'Exageración', 'Falta de disciplina']
  },
  4: {
    name: 'El Constructor',
    keywords: ['Práctico', 'Organizado', 'Confiable'],
    strengths: ['Organización', 'Disciplina', 'Lealtad', 'Persistencia'],
    challenges: ['Rigidez', 'Terquedad', 'Resistencia al cambio']
  },
  5: {
    name: 'El Aventurero',
    keywords: ['Versátil', 'Libre', 'Curioso'],
    strengths: ['Adaptabilidad', 'Curiosidad', 'Entusiasmo', 'Magnetismo'],
    challenges: ['Inquietud', 'Impulsividad', 'Inconstancia']
  },
  6: {
    name: 'El Nutridor',
    keywords: ['Responsable', 'Protector', 'Armonioso'],
    strengths: ['Responsabilidad', 'Empatía', 'Generosidad', 'Armonía'],
    challenges: ['Autosacrificio', 'Control', 'Culpa']
  },
  7: {
    name: 'El Investigador',
    keywords: ['Curioso', 'Analítico', 'Observador'],
    strengths: ['Análisis', 'Sabiduría', 'Observación', 'Intuición'],
    challenges: ['Aislamiento', 'Escepticismo', 'Perfeccionismo']
  },
  8: {
    name: 'El Poderoso',
    keywords: ['Ambicioso', 'Estratégico', 'Autoritario'],
    strengths: ['Ambición', 'Estrategia', 'Liderazgo', 'Visión'],
    challenges: ['Materialismo', 'Control', 'Intimidación']
  },
  9: {
    name: 'El Adaptador / El Místico',
    keywords: ['Adaptación', 'Compasión', 'Sabiduría Universal', 'Finalización'],
    essence: 'El 9 es el número de la culminación y la sabiduría adquirida. Su mayor fortaleza es su capacidad de adaptación: absorbe la energía de su entorno y se moldea a sí mismo para tener éxito. Es el "espejo" que ayuda a otros a verse a sí mismos. Su misión es completar ciclos y dejar un legado, pero debe protegerse de los apegos emocionales que pueden desviarlo.',
    strengths: ['Adaptabilidad', 'Compasión', 'Sabiduría', 'Capacidad de reflejar a otros', 'Visión global'],
    challenges: ['Apego emocional', 'Ego excesivo', 'Influencia del entorno negativo', 'Dificultad para soltar']
  },
  11: {
    name: 'El Visionario',
    keywords: ['Intuitivo', 'Inspirador', 'Iluminado'],
    strengths: ['Intuición', 'Inspiración', 'Sensibilidad', 'Creatividad'],
    challenges: ['Ansiedad', 'Inseguridad', 'Presión']
  },
  22: {
    name: 'El Constructor Maestro',
    keywords: ['Práctico', 'Visionario', 'Manifestador'],
    strengths: ['Manifestación', 'Organización', 'Visión', 'Inspiración'],
    challenges: ['Presión', 'Perfeccionismo', 'Rigidez']
  },
  33: {
    name: 'El Maestro',
    keywords: ['Compasivo', 'Sabio', 'Transformador'],
    strengths: ['Compasión', 'Sabiduría', 'Sanación', 'Liderazgo'],
    challenges: ['Autosacrificio', 'Carga emocional', 'Perfeccionismo']
  }
};

export function calculateLifePath(birthDate: string): number {
  const cleanDate = birthDate.replace(/-/g, '');
  let sum = 0;
  for (const char of cleanDate) {
    sum += parseInt(char, 10);
  }

  if (sum === 11 || sum === 22 || sum === 33) return sum;

  while (sum > 9) {
    let temp = 0;
    for (const char of String(sum)) {
      temp += parseInt(char, 10);
    }
    sum = temp;
    if (sum === 11 || sum === 22 || sum === 33) return sum;
  }

  return sum;
}

export function calculateExpressionNumber(name: string): number {
  const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '');
  const values: Record<string, number> = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
    'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
  };

  let sum = 0;
  for (const char of cleanName) {
    sum += values[char] || 0;
  }

  if (sum === 11 || sum === 22 || sum === 33) return sum;

  while (sum > 9) {
    let temp = 0;
    for (const char of String(sum)) {
      temp += parseInt(char, 10);
    }
    sum = temp;
    if (sum === 11 || sum === 22 || sum === 33) return sum;
  }

  return sum;
}

/**
 * Calcula la reducción simbólica del día de nacimiento (1-31).
 * En Molino, la Personalidad se obtiene EXCLUSIVAMENTE a partir del día de nacimiento.
 *
 * Preserva números maestros (11, 22, 33) y registra todos los pasos de reducción
 * realizados (reductionPath).
 */
export function calculateBirthDayReduction(day: number): BirthDayReduction {
  if (!Number.isFinite(day) || day < 1 || day > 31) {
    return {
      original: day || 0,
      reductionPath: [],
      finalValue: 0,
      isMaster: false,
    };
  }

  const reductionPath: number[] = [day];

  if (day === 11 || day === 22 || day === 33) {
    return {
      original: day,
      reductionPath,
      finalValue: day,
      isMaster: true,
    };
  }

  let current = day;
  while (current > 9) {
    let temp = 0;
    for (const char of String(current)) {
      temp += parseInt(char, 10);
    }
    reductionPath.push(temp);
    current = temp;
    if (current === 11 || current === 22 || current === 33) break;
  }

  return {
    original: day,
    reductionPath,
    finalValue: current,
    isMaster: current === 11 || current === 22 || current === 33,
  };
}

/**
 * Devuelve el número de Personalidad / natalicio a partir del día de nacimiento (1-31).
 */
export function calculateBirthDayNumber(day: number): number {
  return calculateBirthDayReduction(day).finalValue;
}

/**
 * En Molino, el número de Personalidad se deriva EXCLUSIVAMENTE del día de nacimiento,
 * NUNCA del nombre ni de consonantes.
 */
export function calculatePersonalityNumber(day: number): number {
  return calculateBirthDayNumber(day);
}

/**
 * Calculate the Lucky Number (Número de la Suerte) from birth month and year.
 * Day does NOT participate.
 * Rules:
 *   1. Take the first digit of the birth month.
 *   2. From the birth year, take the last non-zero digit (ignore trailing zeros).
 *   3. Concatenate both digits to form the number.
 * Example: 18/04/1990 → month=04 → first digit=4, year=1990 → last non-zero=9 → 49.
 */
export function calculateLuckyNumber(month: number, year: number): number {
  const firstDigitOfMonth = Math.floor(month / 10) || month;
  const yearStr = String(year);
  let lastNonZeroDigit = 0;
  for (let i = yearStr.length - 1; i >= 0; i--) {
    const d = parseInt(yearStr[i], 10);
    if (d !== 0) {
      lastNonZeroDigit = d;
      break;
    }
  }
  if (lastNonZeroDigit === 0) lastNonZeroDigit = 1;
  return firstDigitOfMonth * 10 + lastNonZeroDigit;
}

export function getArchetypeInfo(lifePath: number) {
  return ARCHETYPE_DESCRIPTIONS[lifePath] || {
    name: 'El Buscador',
    keywords: ['Curioso', 'Versátil', 'Adaptable'],
    strengths: ['Aprendizaje', 'Flexibilidad', 'Conexión'],
    challenges: ['Indecisión', 'Dispersión', 'Inconstancia']
  };
}

export function calculateNumerologyCompatibility(lp1: number, lp2: number): number {
  const diff = Math.abs(lp1 - lp2) % 9;
  const scores: Record<number, number> = {
    0: 95, 1: 75, 2: 60, 3: 50, 4: 85, 5: 40, 6: 80, 7: 55, 8: 70
  };
  return scores[diff] || 65;
}

export type MasterNumber = 11 | 22 | 33;
export type MasterPosition = 'lifePath' | 'expression' | 'personality';

export interface MasterNumberHit {
  position: MasterPosition;
  number: MasterNumber;
}

const MASTER_NUMBERS: readonly MasterNumber[] = [11, 22, 33];

function isMasterNumber(n: number | undefined): n is MasterNumber {
  return n !== undefined && (MASTER_NUMBERS as readonly number[]).includes(n);
}

/**
 * Detecta números maestros (11/22/33) ya presentes en un perfil calculado —
 * no recalcula nada, lee los campos numerológicos que profileBuilder.ts
 * ya llena con calculateLifePath/calculateExpressionNumber/calculateBirthDayNumber
 * (todas preservan maestros en cada paso de reducción).
 */
export function getMasterNumbers(
  profile: Pick<UserProfile, 'lifePath' | 'expressionNumber' | 'personalityNumber'>
): MasterNumberHit[] {
  const hits: MasterNumberHit[] = [];
  if (isMasterNumber(profile.lifePath)) hits.push({ position: 'lifePath', number: profile.lifePath });
  if (isMasterNumber(profile.expressionNumber)) hits.push({ position: 'expression', number: profile.expressionNumber });
  if (isMasterNumber(profile.personalityNumber)) hits.push({ position: 'personality', number: profile.personalityNumber });
  return hits;
}

/**
 * Significado específico de cada maestro según en qué número cae — el
 * mismo 11/22/33 se lee distinto si es tu Camino de Vida (la trayectoria
 * completa) que si es tu Personalidad (cómo te proyectás). ARCHETYPE_DESCRIPTIONS
 * ya cubre Life Path con un tratamiento general; esto lo desglosa por posición.
 */
export const MASTER_POSITION_MEANINGS: Record<MasterNumber, Record<MasterPosition, string>> = {
  11: {
    lifePath: 'Tu Camino de Vida no es el del constructor paso a paso: es el del canal. El 11 percibe antes de entender, y esa intuición elevada es tanto tu herramienta más filosa como tu mayor fuente de ansiedad — tenés que aprender a confiar en lo que ves antes de poder explicarlo. Tu trayectoria completa se juega en sostener esa sensibilidad sin que te desborde.',
    expression: 'Cuando te expresás, algo en tu forma de comunicar contagia una claridad que no siempre podés justificar con datos — la gente sale de hablar con vos con una idea más nítida de lo que ya sabía, aunque no sepa por qué. Tu desafío es no diluir esa inspiración en la necesidad de caerle bien a todos.',
    personality: 'La primera impresión que dejás tiene un matiz que la gente identifica pero le cuesta nombrar — cierta profundidad, cierta sabiduría prestada. Te perciben como alguien que "sabe algo", aunque vos mismo dudes de qué exactamente.',
  },
  22: {
    lifePath: 'Tu Camino de Vida combina la visión del 11 con la capacidad de aterrizarla en algo real y duradero — no soñás en abstracto, soñás en estructuras que otros puedan usar. La presión que sentís no es paranoia: es proporcional a la escala de lo que estás capacitado para construir, y el riesgo real es el perfeccionismo que te frena antes de empezar.',
    expression: 'Te expresás con una practicidad que esconde ambición grande — hablás de planes concretos, pero detrás hay una visión de largo alcance que pocos captan de entrada. Tu forma de comunicar convence porque suena factible, no solo inspirador.',
    personality: 'Los demás te ven como alguien confiable con planes serios — no un soñador, sino alguien capaz de ejecutar lo que otros solo imaginan. Esa reputación de "el que sí lo hace" te precede.',
  },
  33: {
    lifePath: 'Tu Camino de Vida está orientado al servicio elevado — no el sacrificio silencioso, sino la capacidad real de sostener a otros sin perderte en el proceso. Combinás la intuición del 11 con la estructura del 22, aplicadas a cuidar en vez de construir. El riesgo es cargar responsabilidades ajenas hasta el agotamiento; el trabajo es aprender a dar sin vaciarte.',
    expression: 'Cuando te comunicás, hay una calidez que sana más que convence — la gente se siente escuchada, no solo persuadida. Tu forma de expresarte funciona mejor cuando viene de un lugar genuino y no de la obligación de estar disponible para todos.',
    personality: 'Te perciben como un refugio — alguien a quien se puede acudir sin miedo al juicio. Esa reputación de compasión genuina atrae a gente que necesita apoyo, a veces más de la que podés sostener.',
  },
};

export function getMasterPositionMeaning(number: MasterNumber, position: MasterPosition): string {
  return MASTER_POSITION_MEANINGS[number][position];
}

export const MASTER_POSITION_LABELS_ES: Record<MasterPosition, string> = {
  lifePath: 'Camino de Vida',
  expression: 'Expresión',
  personality: 'Personalidad',
};
