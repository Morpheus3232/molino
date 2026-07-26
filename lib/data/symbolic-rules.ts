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
// 7. NUMBER LOSS PREVENTION — What each number should not lose
// ════════════════════════════════════════════════════

export interface NumberLossPrevention {
  number: number;
  asset: string;
  sentence: string;
}

export const NUMBER_LOSS_PREVENTION: Record<number, NumberLossPrevention> = {
  1:  { number: 1,  asset: "enfoque",     sentence: "Tu n\u00famero debe cuidar especialmente su enfoque." },
  2:  { number: 2,  asset: "paz",         sentence: "Tu n\u00famero debe cuidar especialmente su paz." },
  3:  { number: 3,  asset: "voz",         sentence: "Tu n\u00famero debe cuidar especialmente su voz." },
  4:  { number: 4,  asset: "disciplina",  sentence: "Tu n\u00famero debe cuidar especialmente su disciplina." },
  5:  { number: 5,  asset: "libertad",    sentence: "Tu n\u00famero debe cuidar especialmente su libertad." },
  6:  { number: 6,  asset: "tiempo",      sentence: "Tu n\u00famero debe cuidar especialmente su tiempo." },
  7:  { number: 7,  asset: "foco",        sentence: "Tu n\u00famero debe cuidar especialmente su foco." },
  8:  { number: 8,  asset: "poder",       sentence: "Tu n\u00famero debe cuidar especialmente su poder." },
  9:  { number: 9,  asset: "experiencia", sentence: "Tu n\u00famero debe cuidar especialmente su experiencia." },
  11: { number: 11, asset: "intuici\u00f3n",  sentence: "Tu n\u00famero debe cuidar especialmente su intuici\u00f3n." },
  22: { number: 22, asset: "visi\u00f3n",     sentence: "Tu n\u00famero debe cuidar especialmente su visi\u00f3n." },
  33: { number: 33, asset: "influencia",  sentence: "Tu n\u00famero debe cuidar especialmente su influencia." },
};

// ════════════════════════════════════════════════════
// 8. ZODIAC POWER PATHS — How each animal gains power
// ════════════════════════════════════════════════════

export interface ZodiacPowerPath {
  animal: string;
  powerPath: string;
}

export const ZODIAC_POWER_PATHS: Record<string, ZodiacPowerPath> = {
  Rata:      { animal: "Rata",      powerPath: "a trav\u00e9s de amigos poderosos" },
  Buey:      { animal: "Buey",      powerPath: "siendo lento y constante" },
  Tigre:     { animal: "Tigre",     powerPath: "mediante la fuerza" },
  Gato:      { animal: "Gato",      powerPath: "mediante juegos mentales" },
  Drag\u00f3n:  { animal: "Drag\u00f3n",  powerPath: "mediante la transmutaci\u00f3n" },
  Mono:      { animal: "Mono",      powerPath: "mediante ingenio y versatilidad" },
  Serpiente: { animal: "Serpiente", powerPath: "mediante la sabidur\u00eda" },
  Caballo:   { animal: "Caballo",   powerPath: "yendo en contra de las masas" },
  Cabra:     { animal: "Cabra",     powerPath: "mediante la amabilidad" },
  Gallo:     { animal: "Gallo",     powerPath: "mediante la acci\u00f3n masiva" },
  Perro:     { animal: "Perro",     powerPath: "vendiendo su historia" },
  Cerdo:     { animal: "Cerdo",     powerPath: "mediante la pol\u00edtica" },
};

// ════════════════════════════════════════════════════
// 9. ZODIAC ARCHETYPAL TRITS — Core archetype per animal
// ════════════════════════════════════════════════════

export interface ZodiacArchetypalTrait {
  animal: string;
  trait: string | null;
}

export const ZODIAC_ARCHETYPAL_TRAITS: Record<string, ZodiacArchetypalTrait> = {
  Mono:      { animal: "Mono",      trait: "el m\u00e1s inteligente" },
  Serpiente: { animal: "Serpiente", trait: "la sabidur\u00eda" },
  Cabra:     { animal: "Cabra",     trait: "la m\u00e1s bella" },
  Tigre:     { animal: "Tigre",     trait: "el m\u00e1s atl\u00e9tico" },
  Gallo:     { animal: "Gallo",     trait: "el m\u00e1s leal" },
  Caballo:   { animal: "Caballo",   trait: "el rebelde" },
  Rata:      { animal: "Rata",      trait: "los manipuladores" },
  Gato:      { animal: "Gato",      trait: "el fisi\u00f3logo" },
  Drag\u00f3n:  { animal: "Drag\u00f3n",  trait: "el l\u00edder" },
  Buey:      { animal: "Buey",      trait: null },
  Perro:     { animal: "Perro",     trait: null },
  Cerdo:     { animal: "Cerdo",     trait: null },
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

/** Get what a number should not lose */
export function getNumberLossPrevention(number: number): NumberLossPrevention | null {
  return NUMBER_LOSS_PREVENTION[number] ?? null;
}

/** Get the power path for a Chinese zodiac animal */
export function getZodiacPowerPath(animal: string): ZodiacPowerPath | null {
  return ZODIAC_POWER_PATHS[animal] ?? null;
}

/** Get the archetypal trait for a Chinese zodiac animal */
export function getZodiacArchetypalTrait(animal: string): ZodiacArchetypalTrait | null {
  return ZODIAC_ARCHETYPAL_TRAITS[animal] ?? null;
}
