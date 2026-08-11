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
    name: 'El Adaptable',
    keywords: ['Adaptabilidad', 'Desapego', 'Flexibilidad'],
    essence: 'El 9 es el swing path. No tiene origen fijo ni destino predeterminado. Su mayor fortaleza es su adaptabilidad extrema: maneja cualquier situación que le toque sin resistencia. Su trabajo es unificar lo que otros separan.',
    strengths: ['Adaptabilidad', 'Fluidez social', 'Lectura de situaciones', 'Capacidad de unificar', 'Desapego funcional'],
    challenges: ['Apego a situaciones que ya no funcionan', 'Identidad difusa', 'Evitar el compromiso', 'Perderse en la energía de otros']
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
