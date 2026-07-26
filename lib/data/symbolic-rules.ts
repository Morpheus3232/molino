/**
 * Symbolic Rules — Centralized knowledge base for Molino.
 *
 * All rules are cultural/symbolic interpretations, NOT scientific facts.
 * Reused by Daily Insight, Timing, Home, Knowledge, and future features.
 * No engine modifications required — this is pure data + interpretation helpers.
 */

// ════════════════════════════════════════════════════
// 1. NUMBER SYMBOLISM
// ════════════════════════════════════════════════════

export interface NumberSymbolism {
  number: number;
  meaning: string;
  domain: string;
  interpretation: string;
}

export const NUMBER_SYMBOLISM: Record<number, NumberSymbolism> = {
  8: {
    number: 8,
    meaning: "Abundancia y flujo",
    domain: "finanzas",
    interpretation: "El 8 se asocia con la abundancia, el flujo y la materialización. En numerología, se considera un número de manifestación.",
  },
  28: {
    number: 28,
    meaning: "Riqueza",
    domain: "finanzas",
    interpretation: "El 28 es el número de la riqueza en la tradición simbólica. Se asocia con oportunidades materiales y prosperidad.",
  },
};

// ════════════════════════════════════════════════════
// 2. PRICE RECOMMENDATION
// ════════════════════════════════════════════════════

export const PRICE_RECOMMENDATION = {
  rule: "Poné precios que sumados den 8.",
  domain: "precios",
  interpretation: "En numerología simbólica, los precios cuya suma de dígitos da 8 se asocian con abundancia y flujo. Esto es una interpretación cultural, no una regla financiera objetiva.",
  examples: [
    { price: 8, sum: 8 },
    { price: 17, sum: 8 },
    { price: 26, sum: 8 },
    { price: 35, sum: 8 },
    { price: 44, sum: 8 },
    { price: 53, sum: 8 },
    { price: 62, sum: 8 },
    { price: 71, sum: 8 },
    { price: 80, sum: 8 },
  ],
};

// ════════════════════════════════════════════════════
// 3. DAY RULES
// ════════════════════════════════════════════════════

export interface DayRule {
  day: number;
  theme: string;
  interpretation: string;
  favors: string[];
  watchOut: string[];
}

export const DAY_RULES: Record<number, DayRule> = {
  1: {
    day: 1,
    theme: "Iniciación",
    interpretation: "Buen momento simbólico para comenzar algo nuevo.",
    favors: ["Empezar proyectos", "Tomar decisiones", "Actuar con iniciativa"],
    watchOut: ["Impulsividad", "Exceso de confianza"],
  },
  6: {
    day: 6,
    theme: "Familia",
    interpretation: "Un día para priorizar la familia y las personas que están cerca tuyo.",
    favors: ["Conexión familiar", "Cuidar de otros", "Armonía doméstica"],
    watchOut: ["Sobrecarga emocional", "Autosacrificio"],
  },
  7: {
    day: 7,
    theme: "Aprendizaje",
    interpretation: "Un día favorable para aprender, estudiar y profundizar.",
    favors: ["Estudiar", "Investigar", "Reflexionar"],
    watchOut: ["Aislamiento", "Exceso de análisis"],
  },
  11: {
    day: 11,
    theme: "Intuición",
    interpretation: "Un día de intuición elevada. Si podés elegir, considerá evitar viajes importantes.",
    favors: ["Intuición", "Creatividad", "Conexión espiritual"],
    watchOut: ["Viajes importantes", "Sobreestimulación"],
  },
  28: {
    day: 28,
    theme: "Riqueza",
    interpretation: "Un día con energía asociada a la prosperidad y los recursos materiales.",
    favors: ["Negocios", "Finanzas", "Planificación económica"],
    watchOut: ["Gastos impulsivos", "Materialismo excesivo"],
  },
};

// ════════════════════════════════════════════════════
// 4. YEAR 2026
// ════════════════════════════════════════════════════

export const YEAR_2026 = {
  year: 2026,
  reducedTo: 1,
  theme: "Iniciativa y acción",
  interpretation: "2026 es un año 1. El año 1 representa iniciativa, comienzos, independencia y energía de acción. Simbólicamente, puede sentirse como un período de mayor impulso individual y confrontación, por lo que algunas personas pueden percibir un ambiente más competitivo o agresivo.",
  advice: "Un buen año para iniciar proyectos nuevos, tomar la iniciativa y trabajar de forma independiente.",
};

// ════════════════════════════════════════════════════
// 5. ENEMY YEAR GUIDANCE
// ════════════════════════════════════════════════════

export const ENEMY_YEAR_GUIDANCE = {
  title: "Años de mayor resistencia",
  interpretation: "Años enemigos pueden traer mayor resistencia. En esos períodos, conviene evitar riesgos innecesarios, mantener un perfil bajo y actuar con disciplina.",
  advice: [
    "Evitá riesgos innecesarios",
    "Mantené un perfil bajo",
    "Actuá con disciplina y paciencia",
    "Invertí en relaciones y alianzas",
  ],
  disclaimer: "Esta es una interpretación simbólica basada en la tradición del zodíaco chino. No constituye una predicción ni asesoramiento profesional.",
};

// ════════════════════════════════════════════════════
// 6. WESTERN ZODIAC ARCHETYPES
// ════════════════════════════════════════════════════

export interface ZodiacArchetype {
  sign: string;
  archetype: string;
  archetypeEn: string;
  description: string;
}

export const ZODIAC_ARCHETYPES: Record<string, ZodiacArchetype> = {
  Aries:      { sign: "Aries",      archetype: "El Pionero",       archetypeEn: "The Pioneer",     description: "Energía de inicio, acción y liderazgo natural." },
  Tauro:      { sign: "Tauro",      archetype: "El Constructor",   archetypeEn: "The Builder",     description: "Energía de estabilidad, persistencia y creación tangible." },
  "Géminis":  { sign: "Géminis",   archetype: "El Narrador",      archetypeEn: "The Storyteller", description: "Energía de comunicación, curiosidad y conexión." },
  Cáncer:     { sign: "Cáncer",    archetype: "El Sanador",       archetypeEn: "The Healer",      description: "Energía de protección, hogar y cuidado emocional." },
  Leo:        { sign: "Leo",        archetype: "La Estrella",      archetypeEn: "The Star",        description: "Energía de creatividad, carisma y expresión." },
  Virgo:      { sign: "Virgo",      archetype: "El Organizador",   archetypeEn: "The Organizer",   description: "Energía de precisión, servicio y mejora continua." },
  Libra:      { sign: "Libra",      archetype: "El Pacificador",   archetypeEn: "The Peacemaker",  description: "Energía de armonía, justicia y equilibrio." },
  Escorpio:   { sign: "Escorpio",   archetype: "El Investigador",  archetypeEn: "The Investigator", description: "Energía de profundidad, transformación y misterio." },
  Sagitario:  { sign: "Sagitario",  archetype: "El Aventurero",    archetypeEn: "The Adventurer",  description: "Energía de libertad, expansión y filosofía." },
  Capricornio:{ sign: "Capricornio",archetype: "El que consigue",  archetypeEn: "The Achiever",    description: "Energía de ambición, disciplina y logro." },
  Acuario:    { sign: "Acuario",    archetype: "El Visionario",    archetypeEn: "The Visionary",   description: "Energía de innovación, independencia y visión de futuro." },
  Piscis:     { sign: "Piscis",     archetype: "El Poeta",         archetypeEn: "The Poet",        description: "Energía de intuición, sensibilidad y conexión espiritual." },
};

// ════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ════════════════════════════════════════════════════

/** Get the day rule for a personal day number */
export function getDayRule(personalDay: number): DayRule | null {
  return DAY_RULES[personalDay] ?? null;
}

/** Get zodiac archetype for a western sign */
export function getZodiacArchetype(sign: string): ZodiacArchetype | null {
  return ZODIAC_ARCHETYPES[sign] ?? null;
}

/** Check if a year is a "1" year (sum reduced to 1) */
export function isYearOne(year: number): boolean {
  const digits = String(year).split("").map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  while (sum > 9) {
    sum = String(sum).split("").map(Number).reduce((a, b) => a + b, 0);
  }
  return sum === 1;
}

/** Get symbolic interpretation for a specific year */
export function getYearInterpretation(year: number): { reducedTo: number; theme: string; interpretation: string } | null {
  if (year === 2026) return YEAR_2026;
  const digits = String(year).split("").map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  while (sum > 9) {
    sum = String(sum).split("").map(Number).reduce((a, b) => a + b, 0);
  }
  const themes: Record<number, string> = {
    1: "Iniciativa y acción",
    2: "Cooperación y relaciones",
    3: "Expresión y creatividad",
    4: "Construcción y estabilidad",
    5: "Cambio y aventura",
    6: "Familia y responsabilidad",
    7: "Introspección y sabiduría",
    8: "Manifestación y poder",
    9: "Cierre y compasión",
  };
  return {
    reducedTo: sum,
    theme: themes[sum] || "Energía mixta",
    interpretation: `El año ${year} se reduce a ${sum}. ${themes[sum] || "Un período de transición."}`,
  };
}

/** Sum digits of a number and reduce to single digit */
export function sumDigits(n: number): number {
  let sum = String(n).split("").map(Number).reduce((a, b) => a + b, 0);
  while (sum > 9) {
    sum = String(sum).split("").map(Number).reduce((a, b) => a + b, 0);
  }
  return sum;
}
