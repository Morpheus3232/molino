export interface NumerologyProfile {
  lifePath: number;
  expressionNumber?: number;
  soulNumber?: number;
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

export function calculateSoulNumber(name: string): number {
  const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '');
  const vowels = ['A', 'E', 'I', 'O', 'U'];
  const values: Record<string, number> = {
    'A': 1, 'E': 5, 'I': 9, 'O': 6, 'U': 3
  };

  let sum = 0;
  for (const char of cleanName) {
    if (vowels.includes(char)) {
      sum += values[char] || 0;
    }
  }

  if (sum === 0) return 0;
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

export function calculatePersonalityNumber(name: string): number {
  const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '');
  const vowels = ['A', 'E', 'I', 'O', 'U'];
  const values: Record<string, number> = {
    'B': 2, 'C': 3, 'D': 4, 'F': 6, 'G': 7, 'H': 8, 'J': 1, 'K': 2,
    'L': 3, 'M': 4, 'N': 5, 'P': 7, 'Q': 8, 'R': 9, 'S': 1, 'T': 2,
    'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
  };

  let sum = 0;
  for (const char of cleanName) {
    if (!vowels.includes(char)) {
      sum += values[char] || 0;
    }
  }

  if (sum === 0) return 0;
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

export function calculateBirthDayNumber(day: number): number {
  if (day < 1 || day > 31) return 0;
  let sum = day;
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
