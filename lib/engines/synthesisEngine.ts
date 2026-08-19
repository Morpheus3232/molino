/**
 * Synthesis Engine
 *
 * Generates deterministic cross-system insights from real user data.
 * Combines numerology, astrology, chinese zodiac, archetype, and cycles
 * to produce personalized narrative insights.
 *
 * No AI. No external APIs. Pure deterministic logic.
 */

import type { UserProfile } from "@/types/user";
import { ARCHETYPES, ENERGY_TYPES, YEAR_TYPES } from "@/lib/data";
import { safeNumber } from "@/lib/utils/score";

export interface DimensionInsight {
  dimension: string;
  value: number;
  influences: string[];
  explanation: string;
}

export interface PatternInsight {
  label: string;
  keyword: string;
  description: string;
  sources: string[];
}

export interface TensionInsight {
  label: string;
  title: string;
  evidence: string;
  sources: string[];
  hasTension: boolean;
  implication?: string;
}

export interface RuleInsight {
  label: string;
  keyword: string;
  title: string;
  body: string;
  description: string;
  sources: string[];
  source?: string;
  rule?: string;
}

export interface SynthesisInsight {
  type: "identity" | "tension" | "strength" | "attention" | "opportunity";
  title: string;
  text: string;
  sources: string[];
}

export interface PersonalCode {
  lifePath: { number: number; name: string; meaning: string };
  expression: { number: number; name: string; meaning: string };
  soul: { number: number; name: string; meaning: string };
  personality: { number: number; name: string; meaning: string };
}

export interface MomentState {
  energyScore: number;
  energyTheme: string;
  cycleName: string;
  cycleDescription: string;
  personalDay: number;
  personalMonth: number;
  personalYear: number;
  narrative: string;
  focus: string;
}

function getNumberMeaning(n: number, type: "lifePath" | "expression" | "soul" | "personality"): string {
  const meanings: Record<number, Record<string, string>> = {
    1: { lifePath: "Liderazgo e independencia", expression: "Innovación y originalidad", soul: "Necesidad de autonomía", personality: "Impresión de fortaleza" },
    2: { lifePath: "Diplomacia y cooperación", expression: "Armonía en la expresión", soul: "Deseo de conexión profunda", personality: "Sensibilidad percibida" },
    3: { lifePath: "Creatividad y comunicación", expression: "Talento artístico", soul: "Alegría como necesidad", personality: "Carisma natural" },
    4: { lifePath: "Disciplina y estabilidad", expression: "Metodología práctica", soul: "Hogar y seguridad", personality: "Confiabilidad" },
    5: { lifePath: "Libertad y adaptabilidad", expression: "Versatilidad expresiva", soul: "Aventura y cambio", personality: "Dinamismo" },
    6: { lifePath: "Responsabilidad y cuidado", expression: "Belleza y armonía", soul: "Amor incondicional", personality: "Calidez" },
    7: { lifePath: "Búsqueda de verdad", expression: "Análisis profundo", soul: "Retiro y reflexión", personality: "Misterio" },
    8: { lifePath: "Poder y materialización", expression: "Autoridad natural", soul: "Abundancia", personality: "Presencia" },
    9: { lifePath: "Adaptación y desapego", expression: "Fluidez expresiva", soul: "Movimiento interior", personality: "Versatilidad" },
    11: { lifePath: "Intuición elevada", expression: "Inspiración espiritual", soul: "Iluminación personal", personality: "Magnetismo" },
    22: { lifePath: "Manifestación a gran escala", expression: "Visión constructiva", soul: "Propósito divino", personality: "Grandeza" },
    33: { lifePath: "Sanación y servicio", expression: "Maestía expresiva", soul: "Amor universal", personality: "Compasión" },
  };

  const defaults: Record<string, string> = {
    lifePath: "Energía personal",
    expression: "Expresión vital",
    soul: "Deseo interior",
    personality: "Impresión externa",
  };

  return meanings[n]?.[type] || defaults[type];
}

function getNumberName(n: number): string {
  const names: Record<number, string> = {
    1: "El Pionero",
    2: "El Puente",
    3: "El Creador",
    4: "El Cimiento",
    5: "El Nómada",
    6: "El Nutridor",
    7: "El Investigador",
    8: "El Arquitecto",
    9: "El Adaptable",
    11: "El Vidente",
    22: "El Maestro Constructor",
    33: "El Sanador",
  };
  return names[n] || "El Viajero";
}

function getKeywordForLifePath(n: number): string {
  const keywords: Record<number, string> = {
    1: "independencia",
    2: "cooperación",
    3: "expresión",
    4: "estabilidad",
    5: "libertad",
    6: "responsabilidad",
    7: "introspección",
    8: "manifestación",
    9: "adaptación",
    11: "intuición",
    22: "construcción",
    33: "sanación",
  };
  return keywords[n] || "adaptación";
}

function getElementTraits(element: string): string[] {
  const traits: Record<string, string[]> = {
    Fuego: ["iniciativa", "pasión", "coraje", "liderazgo"],
    Tierra: ["practicidad", "estabilidad", "paciencia", "sentido común"],
    Aire: ["comunicación", "intelecto", "socialidad", "flexibilidad"],
    Agua: ["intuición", "emocionalidad", "empatía", "profundidad"],
  };
  return traits[element] || ["adaptabilidad"];
}

function getModalityTraits(modality: string): string[] {
  const traits: Record<string, string[]> = {
    Cardinal: ["iniciativa", "pionero", "decisivo"],
    Fijo: ["determinación", "lealtad", "consistencia"],
    Mutable: ["adaptabilidad", "versatilidad", "flexibilidad"],
  };
  return traits[modality] || ["equilibrio"];
}

function getChineseTraits(animal: string): string[] {
  const traits: Record<string, string[]> = {
    Rata: ["ingenio", "astucia", "adaptable"],
    Buey: ["fuerza", "determinación", "confiabilidad"],
    Tigre: ["valentía", "competitividad", "liderazgo"],
    Gato: ["elegancia", "diplomacia", "sensibilidad"],
    Dragón: ["ambición", "carisma", "poder"],
    Serpiente: ["sabiduría", "intuición", "misterio"],
    Caballo: ["libertad", "energia", "aventura"],
    Cabra: ["creatividad", "sensibilidad", "paz"],
    Mono: ["ingenio", "versatilidad", "curiosidad"],
    Gallo: ["puntualidad", "observación", "coraje"],
    Perro: ["lealtad", "honestidad", "protección"],
    Cerdo: ["generosidad", "compasión", "optimismo"],
  };
  return traits[animal] || ["equilibrio"];
}

export const ELEMENT_PACE: Record<string, "rápido" | "medio" | "lento"> = {
  Fuego: "rápido",
  Aire: "rápido",
  Agua: "medio",
  Tierra: "lento",
};

const LIFEPATH_PACE: Record<number, "rápido" | "medio" | "lento"> = {
  1: "rápido", 2: "lento", 3: "rápido", 4: "lento",
  5: "rápido", 6: "medio", 7: "lento", 8: "rápido",
  9: "rápido", 11: "rápido", 22: "lento", 33: "medio",
};

function getPaceConflict(
  lifePathPace: string,
  elementPace: string,
): boolean {
  return lifePathPace !== elementPace;
}

export function findSharedTheme(
  themesA: string[],
  themesB: string[],
): string | null {
  for (const a of themesA) {
    for (const b of themesB) {
      if (a.toLowerCase() === b.toLowerCase()) return a;
    }
  }
  return null;
}

export function themeOfPhrase(phrase: string): string {
  const keywords = [
    "independencia", "cooperación", "expresión", "estabilidad", "libertad",
    "responsabilidad", "introspección", "manifestación", "adaptación",
    "intuición", "construcción", "sanación",
    "liderazgo", "armonía", "creatividad", "disciplina", "cambio",
    "cuidado", "verdad", "poder", "desapego",
  ];
  for (const kw of keywords) {
    if (phrase.toLowerCase().includes(kw)) return kw;
  }
  return "equilibrio";
}

export function buildTensions(profile: UserProfile): TensionInsight[] {
  const lp = safeNumber(profile.lifePath, 1);
  const element = typeof profile.element === "string" ? profile.element : "";
  const lpPace = LIFEPATH_PACE[lp] || "medio";
  const elPace = ELEMENT_PACE[element] || "medio";

  if (!getPaceConflict(lpPace, elPace)) return [];

  const lpName = getNumberName(lp);
  const lpKeyword = getKeywordForLifePath(lp);
  const elementTraits = getElementTraits(element);

  return [{
    label: "Contradicción de ritmo",
    title: `${lpName} (${lpPace}) vs ${element} (${elPace})`,
    evidence: `Tu Life Path ${lp} tiende a ser ${lpPace} (${lpKeyword}) pero tu elemento ${element} es ${elPace} (${elementTraits[0]}, ${elementTraits[1]})`,
    sources: ["Numerología", "Astrología"],
    hasTension: true,
  }];
}

export function buildRules(profile: UserProfile): RuleInsight[] {
  const lp = safeNumber(profile.lifePath, 1);
  const element = typeof profile.element === "string" ? profile.element : "";

  return [
    {
      label: "Regla de ritmo",
      keyword: "tu ritmo",
      title: "Regla de ritmo",
      body: `Tu Life Path ${lp} marca un ritmo ${LIFEPATH_PACE[lp] || "medio"}. Tu elemento ${element} tiende a ser ${ELEMENT_PACE[element] || "medio"}. Escuchar tu propio tempo es la primera regla.`,
      description: `Tu Life Path ${lp} marca un ritmo ${LIFEPATH_PACE[lp] || "medio"}. Tu elemento ${element} tiende a ser ${ELEMENT_PACE[element] || "medio"}. Escuchar tu propio tempo es la primera regla.`,
      sources: ["Numerología", "Astrología"],
    },
    {
      label: "Regla de elemento",
      keyword: element.toLowerCase(),
      title: "Regla de elemento",
      body: `Tu elemento ${element} define tu forma natural de procesar el mundo. No luches contra tu elemento: úsalo como ventaja.`,
      description: `Tu elemento ${element} define tu forma natural de procesar el mundo. No luches contra tu elemento: úsalo como ventaja.`,
      sources: ["Astrología"],
    },
  ];
}

export function buildPrinciples(
  rules: RuleInsight[],
  patterns?: PatternInsight[],
  archetypeInfo?: UserProfile["archetypeInfo"],
): RuleInsight[] {
  const rule1 = rules[0] || { keyword: "tu ritmo", description: "Escuchar tu propio tempo es la primera regla.", sources: ["Numerología"] };
  const rule2 = rules[1] || { keyword: "tu elemento", description: "Tu elemento define tu forma natural de procesar el mundo.", sources: ["Astrología"] };

  return [
    {
      label: "AVANZÁ",
      keyword: rule1.keyword,
      title: "AVANZÁ",
      body: rule1.description,
      description: rule1.description,
      sources: rule1.sources,
    },
    {
      label: "EVITÁ",
      keyword: rule2.keyword,
      title: "EVITÁ",
      body: rule2.description,
      description: rule2.description,
      sources: rule2.sources,
    },
  ];
}

export function hasCircularSources(insights: { sources: string[] }[] | string[]): boolean {
  if (Array.isArray(insights) && insights.length > 0 && typeof insights[0] === 'string') {
    return (insights as string[]).length !== new Set(insights as string[]).size;
  }
  const allSources = new Set<string>();
  for (const insight of (insights as { sources: string[] }[])) {
    for (const source of insight.sources) {
      if (allSources.has(source)) return true;
      allSources.add(source);
    }
  }
  return false;
}

export function buildPersonalCode(profile: UserProfile): PersonalCode {
  const lp = safeNumber(profile.lifePath, 1);
  const en = safeNumber(profile.expressionNumber, 0);
  const sn = safeNumber(profile.soulNumber, 0);
  const pn = safeNumber(profile.personalityNumber, 0);

  return {
    lifePath: { number: lp, name: getNumberName(lp), meaning: getNumberMeaning(lp, "lifePath") },
    expression: { number: en, name: getNumberName(en), meaning: getNumberMeaning(en, "expression") },
    soul: { number: sn, name: getNumberName(sn), meaning: getNumberMeaning(sn, "soul") },
    personality: { number: pn, name: getNumberName(pn), meaning: getNumberMeaning(pn, "personality") },
  };
}

export function buildSynthesisInsights(profile: UserProfile): SynthesisInsight[] {
  const lp = safeNumber(profile.lifePath, 1);
  const element = typeof profile.element === "string" ? profile.element : "";
  const sunSign = typeof profile.sunSign === "string" ? profile.sunSign : "";
  const modality = typeof profile.modality === "string" ? profile.modality : "";
  const chineseZodiac = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";
  const archetype = typeof profile.archetype === "string" ? profile.archetype : "";
  const archetypeInfo = profile.archetypeInfo;
  const personalYear = safeNumber(profile.cycles?.personalYear, 0);

  const archetypeName = ARCHETYPES[lp]?.name || archetype;
  const archetypeKeywords = ARCHETYPES[lp]?.keywords || [];

  const insights: SynthesisInsight[] = [];

  // Identity insight: Life Path + Element
  const elementTraits = getElementTraits(element);
  insights.push({
    type: "identity",
    title: "Tu identidad",
    text: `Tu Life Path ${lp} (${getKeywordForLifePath(lp)}) combinado con tu elemento ${element} (${elementTraits[0]}, ${elementTraits[1]}) crea una personalidad que busca ${elementTraits[2] || "el equilibrio"} con ${getKeywordForLifePath(lp)}.`,
    sources: ["Numerología", "Astrología"],
  });

  // Tension insight: archetype vs modality
  const modalityTraits = getModalityTraits(modality);
  if (archetypeKeywords.length > 0) {
    insights.push({
      type: "tension",
      title: "Tu tensión",
      text: `Como ${archetypeName}, tu naturaleza tiende a ${archetypeKeywords[0]?.toLowerCase() || "liderar"}. Pero tu modalidad ${modality} (${modalityTraits[0]}) te impulsa a ${modalityTraits[1] || "actuar"} de forma ${modalityTraits[2] || "decidida"}. Esa combinación puede generar momentos donde tu intención choca con tu método.`,
      sources: ["Arquetipos", "Astrología"],
    });
  }

  // Strength insight: numerology + chinese zodiac
  const chineseTraits = getChineseTraits(chineseZodiac);
  insights.push({
    type: "strength",
    title: "Tu fortaleza",
    text: `La energía de tu ${chineseZodiac} (${chineseTraits[0]}, ${chineseTraits[1]}) potencia tu Life Path ${lp}. Cuando这两种 fuerzas trabajan juntas, tu capacidad de ${getKeywordForLifePath(lp)} se amplifica.`,
    sources: ["Zodiaco Chino", "Numerología"],
  });

  // Attention insight based on archetype challenges
  const challenges = archetypeInfo?.challenges || [];
  if (challenges.length > 0) {
    insights.push({
      type: "attention",
      title: "Tu zona de atención",
      text: `El patrón que conviene observar: ${challenges[0]?.toLowerCase() || "la tendencia a..."}. Esto aparece cuando tu energía de ${getKeywordForLifePath(lp)} se intensifica sin regulación.`,
      sources: ["Arquetipos"],
    });
  }

  // Opportunity insight: cycle + element
  const yearType = YEAR_TYPES[personalYear];
  if (yearType) {
    insights.push({
      type: "opportunity",
      title: "Tu oportunidad",
      text: `Tu Año Personal ${personalYear} (${yearType.name?.replace("Año de ", "") || ""}) abre una oportunidad específica para tu perfil: ${yearType.description || "un nuevo ciclo"}. Elementos ${element} como el tuyo están especialmente favorecidos para ${personalYear <= 3 ? "sembrar" : personalYear <= 6 ? "consolidar" : "adaptarte"} en este momento.`,
      sources: ["Ciclos", "Astrología"],
    });
  }

  return insights;
}

export function buildPatterns(profile: UserProfile): PatternInsight[] {
  const lp = safeNumber(profile.lifePath, 1);
  const element = typeof profile.element === "string" ? profile.element : "";
  const sunSign = typeof profile.sunSign === "string" ? profile.sunSign : "";
  const chineseZodiac = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";
  const archetypeInfo = profile.archetypeInfo;
  const personalYear = safeNumber(profile.cycles?.personalYear, 0);

  const archetypeName = ARCHETYPES[lp]?.name || "Tu arquetipo";
  const archetypeKeywords = ARCHETYPES[lp]?.keywords || [];
  const challenges = archetypeInfo?.challenges || [];

  const patterns: PatternInsight[] = [];

  // Pattern 1: Motor
  patterns.push({
    label: "Tu motor",
    keyword: archetypeKeywords[0] || getKeywordForLifePath(lp),
    description: archetypeInfo?.description || `Tu energía natural es la de ${getKeywordForLifePath(lp)}. Esto te impulsa en cada área de tu vida.`,
    sources: ["Arquetipos", "Numerología"],
  });

  // Pattern 2: Tensión
  patterns.push({
    label: "Tu tensión",
    keyword: challenges[0] || "adaptación",
    description: challenges[0]
      ? `Tu necesidad de ${challenges[0].toLowerCase()} puede aparecer cuando tu energía está desbalanceada. Observar este patrón es el primer paso para transformarlo.`
      : "Todo perfil tiene una zona de crecimiento. La clave es reconocerla a tiempo.",
    sources: ["Arquetipos"],
  });

  // Pattern 3: Próximo movimiento
  const yearType = YEAR_TYPES[personalYear];
  patterns.push({
    label: "Tu próximo movimiento",
    keyword: yearType?.name?.replace("Año de ", "").toLowerCase() || "nuevo ciclo",
    description: yearType?.description || `Tu ciclo actual favorece ${personalYear <= 3 ? "empezar" : personalYear <= 6 ? "construir" : "adaptarte"}.`,
    sources: ["Ciclos"],
  });

  return patterns;
}

export function buildDimensions(profile: UserProfile): DimensionInsight[] {
  const lp = safeNumber(profile.lifePath, 1);
  const en = safeNumber(profile.expressionNumber, 0);
  const sn = safeNumber(profile.soulNumber, 0);
  const pn = safeNumber(profile.personalityNumber, 0);
  const element = typeof profile.element === "string" ? profile.element : "";
  const modality = typeof profile.modality === "string" ? profile.modality : "";

  return [
    {
      dimension: "Adaptabilidad",
      value: Math.min((en || lp) * 10, 100),
      influences: ["Expresión", element],
      explanation: `Tu capacidad de adaptación está influenciada por tu expresión${en ? ` (número ${en})` : ""} y tu elemento ${element}.`,
    },
    {
      dimension: "Creatividad",
      value: Math.min((sn || lp) * 10, 100),
      influences: ["Alma", typeof profile.sunSign === "string" ? profile.sunSign : ""],
      explanation: `Tu creatividad viene de la interacción entre tu alma${sn ? ` (número ${sn})` : ""} y tu signo solar.`,
    },
    {
      dimension: "Estructura",
      value: Math.min(lp * 10, 100),
      influences: ["Life Path", modality],
      explanation: `Tu relación con la estructura está determinada por tu Life Path ${lp} y tu modalidad ${modality}.`,
    },
    {
      dimension: "Independencia",
      value: Math.min((pn || lp) * 10, 100),
      influences: ["Personalidad", typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : ""],
      explanation: `Tu independencia se expresa a través de tu personalidad${pn ? ` (número ${pn})` : ""} y tu animal chino.`,
    },
    {
      dimension: "Intuición",
      value: 50 + (lp % 5) * 10,
      influences: ["Life Path", "Elemento"],
      explanation: `Tu intuición se fortalece con tu Life Path ${lp} y la naturaleza de tu elemento.`,
    },
  ];
}

export function buildDateDimensions(profile: UserProfile): DimensionInsight[] {
  const lp = safeNumber(profile.lifePath, 1);
  const sunSign = typeof profile.sunSign === "string" ? profile.sunSign : "";
  const element = typeof profile.element === "string" ? profile.element : "";

  return [
    {
      dimension: "Ritmo diario",
      value: Math.min(lp * 10, 100),
      influences: ["Life Path", sunSign],
      explanation: `Tu ritmo diario natural está marcado por tu Life Path ${lp} y tu signo solar ${sunSign}.`,
    },
    {
      dimension: "Energía mensual",
      value: Math.min((pathStep(lp) || 5) * 10, 100),
      influences: ["Ciclo", element],
      explanation: `Tu energía mensual fluctúa con el paso de tu ciclo personal, modulado por tu elemento ${element}.`,
    },
    {
      dimension: "Timbre anual",
      value: Math.min((lp % 9 || 9) * 10, 100),
      influences: ["Año", "Elemento"],
      explanation: `Tu timbre anual refleja la vibración de tu Life Path ${lp} dentro de tu elemento ${element}.`,
    },
  ];
}

function pathStep(lp: number): number {
  const steps: Record<number, number> = {
    0: 5, 1: 5, 2: 3, 3: 7, 4: 6, 5: 4,
    6: 5, 7: 6, 8: 7, 9: 5, 11: 3, 22: 8, 33: 4,
  };
  return steps[lp] || 5;
}

export function buildMomentState(profile: UserProfile, energyScore: number, energyTheme: string): MomentState {
  const personalYear = safeNumber(profile.cycles?.personalYear, 0);
  const personalMonth = safeNumber(profile.cycles?.personalMonth, 0);
  const personalDay = safeNumber(profile.cycles?.personalDay, 0);
  const element = typeof profile.element === "string" ? profile.element : "";
  const archetype = typeof profile.archetype === "string" ? profile.archetype : "";
  const lp = safeNumber(profile.lifePath, 1);

  const yearType = YEAR_TYPES[personalYear];
  const cycleName = yearType?.name?.replace("Año de ", "") || "Transición";

  let focus = "Observación";
  if (energyScore >= 75) focus = "Acción";
  else if (energyScore >= 55) focus = "Construcción";
  else if (energyScore >= 40) focus = "Preparación";
  else focus = "Descanso";

  const narrative = `Estás en un Año de ${cycleName} (nivel ${personalYear}). Tu energía del día (${energyTheme}) ${energyScore >= 55 ? "favorece" : "sugiere"} ${focus.toLowerCase()}. Tu ${element.toLowerCase()} natural ${energyScore >= 60 ? "potencia" : "modula"} este momento. Para tu Life Path ${lp}, esto significa que ${personalYear <= 3 ? "es momento de sembrar con intención" : personalYear <= 6 ? "la clave está en construir sobre lo que ya empezaste" : "el crecimiento viene de adaptarte a lo que cambia"}.`;

  return {
    energyScore,
    energyTheme,
    cycleName,
    cycleDescription: yearType?.description || "Un ciclo de transición.",
    personalDay,
    personalMonth,
    personalYear,
    narrative,
    focus,
  };
}
