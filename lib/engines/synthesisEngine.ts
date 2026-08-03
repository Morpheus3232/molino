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
  title: string;
  sources: string[];
  evidence: string;
  implication: string;
}

/**
 * Señal fundamental de la que depende cada `sources` label. Un insight/pattern
 * con `sources.length > 1` solo es una convergencia real si sus señales son
 * distintas entre sí — si dos labels resuelven a la misma señal, es el mismo
 * dato repetido con otro nombre, no dos sistemas coincidiendo.
 *
 * "Arquetipos" y "Numerología" comparten señal (`lifePath`) porque
 * ARCHETYPES[lifePath] se deriva enteramente del Camino de Vida: nunca deben
 * aparecer juntos en un mismo insight/pattern. "Ciclos" es distinto de
 * "Numerología" aunque ambos partan de la fecha de nacimiento: el año/día
 * personal también depende de la fecha *actual*, no es un alias estático del
 * mismo valor. Cubierto por el test de no-circularidad en
 * synthesisEngine.test.ts.
 */
export const SOURCE_SIGNAL: Record<string, string> = {
  "Numerología": "lifePath",
  "Arquetipos": "lifePath",
  "Ciclos": "personalCycle",
  "Astrología": "sunSign",
  "Zodiaco Chino": "chineseZodiac",
};

/** true si dos o más sources del mismo insight/pattern resuelven a la misma señal fundamental. */
export function hasCircularSources(sources: string[]): boolean {
  const signals = sources.map((s) => SOURCE_SIGNAL[s] ?? s);
  return new Set(signals).size < signals.length;
}

/**
 * hasCircularSources() solo se validaba en tests — buildPatterns() nunca la
 * llamaba, así que un futuro pair de sources circular (ej. agregar
 * ["Numerología","Arquetipos"], que resuelven a la misma señal lifePath)
 * podía pasar a producción y renderizar una "convergencia" fabricada sin que
 * nada lo detectara en runtime. Esto lo hace explícito en el propio engine.
 */
function assertNotCircular(sources: string[]): void {
  if (hasCircularSources(sources)) {
    throw new Error(
      `synthesisEngine: fuentes circulares detectadas en un pattern (${sources.join(", ")}) — resuelven a la misma señal subyacente y no pueden presentarse como una convergencia real.`
    );
  }
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
    9: { lifePath: "Compasión y sabiduría", expression: "Humanitarismo", soul: "Servicio al todo", personality: "Capacidad de adaptación" },
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

function getNumberName(n: number, type: "lifePath" | "expression" | "soul" | "personality"): string {
  const names: Record<number, string> = {
    1: "El Pionero",
    2: "El Puente",
    3: "El Creador",
    4: "El Cimiento",
    5: "El Nómada",
    6: "El Nutridor",
    7: "El Investigador",
    8: "El Arquitecto",
    9: "El Filósofo",
    11: "El Vidente",
    22: "El Maestro Constructor",
    33: "El Sanador",
  };
  // Personalidad 9 (días 9/18/27) se nombra distinto de Camino de Vida 9:
  // ver FASE 1D-2C. El resto de los números/tipos conserva el nombre compartido.
  const personalityNames: Partial<Record<number, string>> = {
    9: "El Adaptador",
  };
  if (type === "personality" && personalityNames[n]) return personalityNames[n] as string;
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
    9: "compasión",
    11: "intuición",
    22: "construcción",
    33: "sanación",
  };
  return keywords[n] || "adaptación";
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

/**
 * Buckets temáticos usados para verificar convergencia real entre sistemas
 * independientes (ver buildPatterns "Tu motor"). Cada palabra —de arquetipo
 * o de animal chino— se mapea a un tema compartido. Dos sistemas "convergen"
 * solo si comparten un tema; si no, no se etiquetan como coincidentes.
 * Sin este chequeo, `sources` era una etiqueta asertada, no algo calculado.
 */
const THEME_BUCKETS: Record<string, string> = {
  // liderazgo / impulso hacia adelante
  independiente: "liderazgo", innovador: "liderazgo", determinado: "liderazgo",
  ambicioso: "liderazgo", estratégico: "liderazgo", autoritario: "liderazgo",
  valentía: "liderazgo", competitividad: "liderazgo", liderazgo: "liderazgo",
  ambición: "liderazgo", poder: "liderazgo", coraje: "liderazgo",
  independencia: "liderazgo", // variante sustantiva de "independiente"
  // diplomacia / vínculo con otros
  diplomático: "vínculo", cooperativo: "vínculo", armonioso: "vínculo",
  responsable: "vínculo", protector: "vínculo", diplomacia: "vínculo",
  sensibilidad: "vínculo", paz: "vínculo", lealtad: "vínculo",
  honestidad: "vínculo", protección: "vínculo", generosidad: "vínculo",
  compasión: "vínculo", optimismo: "vínculo",
  servicio: "vínculo", relaciones: "vínculo", // YEAR_TYPES[2].description, YEAR_TYPES[6/33].description
  // creatividad / expresión
  creativo: "creatividad", expresivo: "creatividad", curioso: "creatividad",
  versátil: "creatividad", creatividad: "creatividad", versatilidad: "creatividad",
  ingenio: "creatividad", carisma: "creatividad",
  curiosidad: "creatividad", // variante sustantiva de "curioso" (getChineseTraits: Rata, Mono)
  dispersión: "creatividad", // numerologia-content challenges LP3/LP5: exceso de ideas sin foco
  // análisis / sabiduría interior
  analítico: "introspección", observador: "introspección", sabiduría: "introspección",
  intuitivo: "introspección", inspirador: "introspección", iluminado: "introspección",
  intuición: "introspección", misterio: "introspección", observación: "introspección",
  astucia: "introspección",
  análisis: "introspección", inspiración: "introspección", // YEAR_TYPES[7/11].description
  aislamiento: "introspección", // numerologia-content challenges LP1/LP7: retiro hacia adentro, llevado al extremo
  // estructura / practicidad
  práctico: "estructura", organizado: "estructura", confiable: "estructura",
  visionario: "estructura", manifestador: "estructura", fuerza: "estructura",
  determinación: "estructura", confiabilidad: "estructura", puntualidad: "estructura",
  estabilidad: "estructura", disciplina: "estructura", práctica: "estructura", // YEAR_TYPES[4/22].description
  rigidez: "estructura", control: "estructura", perfeccionismo: "estructura", // numerologia-content challenges LP4/6/7/8/22: la misma estructura llevada al extremo
  // libertad / movimiento
  libre: "libertad", adaptación: "libertad", finalización: "libertad",
  libertad: "libertad", energia: "libertad", aventura: "libertad", adaptable: "libertad",
  impulsividad: "libertad", inconstancia: "libertad", // numerologia-content challenges LP5: la misma energía sin freno
};

/** Conectores sin peso temático — se descartan antes de buscar un tema. */
const STOPWORDS = new Set([
  "de", "del", "la", "el", "los", "las", "al", "a", "en", "con", "sin", "por", "para",
  "tu", "su", "un", "una", "y", "e", "o", "que", "cualquier", "costo", "entre",
  "exceso", "excesivo", "excesiva", "extremo", "extrema",
]);

/**
 * Normaliza una frase (challenge de numerología, descripción de YEAR_TYPES)
 * a sus palabras de contenido: minúsculas, sin puntuación, sin conectores.
 * Una palabra suelta (ej. un trait de animal chino) se normaliza a sí misma,
 * así que esta función reemplaza a la vieja `themeOf` sin cambiar su
 * comportamiento para los casos que ya andaban.
 */
function normalizeToThemeWords(phrase: string): string[] {
  return phrase
    .toLowerCase()
    .split(/[\s,.;:]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0 && !STOPWORDS.has(w));
}

/** Tema (si existe) de la primera palabra de contenido de `phrase` que esté en THEME_BUCKETS. */
function themeOfPhrase(phrase: string): string | undefined {
  for (const word of normalizeToThemeWords(phrase)) {
    const theme = THEME_BUCKETS[word];
    if (theme) return theme;
  }
  return undefined;
}

/**
 * Busca un tema compartido entre dos listas de rasgos/frases de sistemas
 * distintos. Cada entrada puede ser una palabra sola (trait de animal
 * chino, keyword de arquetipo) o una frase (challenge de numerología,
 * descripción de un YEAR_TYPES) — `themeOfPhrase` normaliza ambas por igual.
 * Sin este chequeo, `sources` sería una etiqueta asertada, no calculada.
 */
function findSharedTheme(itemsA: string[], itemsB: string[]): { theme: string; wordA: string; wordB: string } | null {
  for (const a of itemsA) {
    const themeA = themeOfPhrase(a);
    if (!themeA) continue;
    for (const b of itemsB) {
      if (themeOfPhrase(b) === themeA) {
        return { theme: themeA, wordA: a, wordB: b };
      }
    }
  }
  return null;
}

/**
 * Palabras de contenido de la descripción de un año personal (YEAR_TYPES),
 * la única señal textual real que expone `personalCycle` — se usa para
 * buscar convergencia entre "el momento del ciclo" y otro sistema.
 */
function getCycleThemeWords(personalYear: number): string[] {
  const description = YEAR_TYPES[personalYear]?.description;
  return description ? description.split(/[,.]/).map((w: string) => w.trim()).filter(Boolean) : [];
}

export function buildPersonalCode(profile: UserProfile): PersonalCode {
  const lp = safeNumber(profile.lifePath, 1);
  const en = safeNumber(profile.expressionNumber, 0);
  const sn = safeNumber(profile.soulNumber, 0);
  const pn = safeNumber(profile.personalityNumber, 0);

  return {
    lifePath: { number: lp, name: getNumberName(lp, "lifePath"), meaning: getNumberMeaning(lp, "lifePath") },
    expression: { number: en, name: getNumberName(en, "expression"), meaning: getNumberMeaning(en, "expression") },
    soul: { number: sn, name: getNumberName(sn, "soul"), meaning: getNumberMeaning(sn, "soul") },
    personality: { number: pn, name: getNumberName(pn, "personality"), meaning: getNumberMeaning(pn, "personality") },
  };
}

export function buildPatterns(profile: UserProfile): PatternInsight[] {
  const lp = safeNumber(profile.lifePath, 1);
  const element = typeof profile.element === "string" ? profile.element : "";
  const sunSign = typeof profile.sunSign === "string" ? profile.sunSign : "";
  const chineseZodiac = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";
  const archetypeInfo = profile.archetypeInfo;
  const personalYear = safeNumber(profile.cycles?.personalYear, 0);

  const archetypeName = ARCHETYPES[lp]?.name || "Tu arquetipo";
  const archetypeKeywords: string[] = ARCHETYPES[lp]?.keywords || [];
  const challenges = archetypeInfo?.challenges || [];

  const patterns: PatternInsight[] = [];

  // Pattern 1: Motor.
  // El arquetipo se deriva del mismo Life Path (ver ARCHETYPES[lp] en lib/data),
  // así que no es un segundo sistema — es el mismo número con otro nombre.
  // Para no inventar una convergencia, el arquetipo (Numerología) se compara
  // contra el animal chino (sistema real e independiente, viene del año de
  // nacimiento) y solo se etiqueta como coincidencia de "dos sistemas" cuando
  // ambos comparten un tema de verdad (findSharedTheme).
  const chineseTraitsForMotor = getChineseTraits(chineseZodiac);
  const motorShared = findSharedTheme(archetypeKeywords, chineseTraitsForMotor);
  if (motorShared) {
    const motorSources = ["Arquetipos", "Zodiaco Chino"];
    assertNotCircular(motorSources);
    patterns.push({
      label: "Tu motor",
      keyword: motorShared.wordA,
      description: `Tu arquetipo (${motorShared.wordA.toLowerCase()}) y tu animal chino ${chineseZodiac} (${motorShared.wordB}) parten de sistemas distintos — pero apuntan a lo mismo. Esto te impulsa en cada área de tu vida.`,
      sources: motorSources,
    });
  } else {
    patterns.push({
      label: "Tu motor",
      keyword: archetypeKeywords[0] || getKeywordForLifePath(lp),
      description: archetypeInfo?.description || `Tu energía natural es la de ${getKeywordForLifePath(lp)}. Esto te impulsa en cada área de tu vida.`,
      sources: ["Numerología"],
    });
  }

  // Pattern 2: Tensión.
  // "challenges" viene de numerologia-content.ts (keyed por Life Path) — es
  // Numerología, no un segundo sistema por sí solo. Para una convergencia
  // real se compara contra el año personal (Ciclos/personalCycle, una señal
  // temporal independiente de la fecha de nacimiento en sí). Si el tema de
  // algún challenge coincide con el tema del año actual, la tensión no es
  // un dato aislado: dos sistemas distintos están señalando lo mismo. Si no
  // coincide, fallback honesto de una sola fuente — no se inventa la segunda.
  const yearType = YEAR_TYPES[personalYear];
  const cycleThemeWords = getCycleThemeWords(personalYear);
  const tensionShared = findSharedTheme(challenges, cycleThemeWords);
  if (tensionShared) {
    const tensionSources = ["Numerología", "Ciclos"];
    assertNotCircular(tensionSources);
    patterns.push({
      label: "Tu tensión",
      keyword: tensionShared.wordA,
      description: `Tu ${tensionShared.wordA.toLowerCase()} y tu momento actual (${tensionShared.wordB.toLowerCase()}) tocan el mismo punto: cuando tu energía está desbalanceada, este año la amplifica en vez de compensarla. Observar el patrón es el primer paso para transformarlo.`,
      sources: tensionSources,
    });
  } else {
    patterns.push({
      label: "Tu tensión",
      keyword: challenges[0] || "adaptación",
      description: challenges[0]
        ? `Tu necesidad de ${challenges[0].toLowerCase()} puede aparecer cuando tu energía está desbalanceada. Observar este patrón es el primer paso para transformarlo.`
        : "Todo perfil tiene una zona de crecimiento. La clave es reconocerla a tiempo.",
      sources: ["Numerología"],
    });
  }

  // Pattern 3: Próximo movimiento.
  // El año personal (Ciclos) es una lectura temporal aislada por defecto.
  // Se compara contra el animal chino (Zodiaco Chino/chineseZodiac, señal
  // fija de nacimiento e independiente del ciclo) para ver si tu naturaleza
  // de base refuerza lo que este año ya propone — misma regla que "Tu motor".
  const chineseTraitsForMovement = getChineseTraits(chineseZodiac);
  const movementShared = findSharedTheme(cycleThemeWords, chineseTraitsForMovement);
  if (movementShared) {
    const movementSources = ["Ciclos", "Zodiaco Chino"];
    assertNotCircular(movementSources);
    patterns.push({
      label: "Tu próximo movimiento",
      keyword: movementShared.wordA,
      description: `Tu ${yearType?.name?.toLowerCase() || "ciclo actual"} y tu ${chineseZodiac} de base coinciden en ${movementShared.theme}: tu naturaleza no está peleando contra el momento, lo está empujando en la misma dirección.`,
      sources: movementSources,
    });
  } else {
    patterns.push({
      label: "Tu próximo movimiento",
      keyword: yearType?.name?.replace("Año de ", "").toLowerCase() || "nuevo ciclo",
      description: yearType?.description || `Tu ciclo actual favorece ${personalYear <= 3 ? "empezar" : personalYear <= 6 ? "construir" : "cerrar"}.`,
      sources: ["Ciclos"],
    });
  }

  return patterns;
}

/**
 * Whether an element's natural pace tends to move fast, slow down to check,
 * or flow contextually. Shared with intelligenceEngine's operating-pattern
 * narrative (getOperatingPattern/combineWithElement) — kept here as the
 * single source so both the narrative text and buildTensions() below agree
 * on what counts as "fast" vs "slow" for a given element.
 */
export const ELEMENT_PACE: Record<string, "fast" | "slow" | "fluid"> = {
  Fuego: "fast",
  Tierra: "slow",
  Metal: "slow",
  Aire: "fluid",
  Agua: "fluid",
};

/**
 * Whether a Life Path group has an inherent pace claim. Only [1,8] and [3,5]
 * (material-action / expression-freedom numbers) carry a real "moves first"
 * tendency, and only [4,7] (structure numbers) carry a real "checks before
 * moving" tendency — see getOperatingPattern in intelligenceEngine.ts for the
 * numerological reasoning behind each grouping. [2,6] (relational) and
 * [9,11,22,33] (master/completion) don't have an inherent speed claim, so
 * they return null rather than forcing a pace onto a group that doesn't have
 * one.
 */
function getLifePathPace(lifePath: number): "fast" | "slow" | null {
  if ([1, 8, 3, 5].includes(lifePath)) return "fast";
  if ([4, 7].includes(lifePath)) return "slow";
  return null;
}

/**
 * Detects when two independent, already-computed signals point in opposite
 * directions instead of reinforcing each other — the counterpart to
 * buildPatterns' convergence detection. Currently checks one real structural
 * contradiction: Life Path's inherent pace (only defined for groups that
 * actually carry one, see getLifePathPace) vs. the element's natural pace.
 * Returns an empty array rather than a weak/inferred tension when the two
 * signals don't actually disagree, or when the Life Path group has no
 * inherent pace claim to compare against.
 */
export function buildTensions(profile: UserProfile): TensionInsight[] {
  const lp = safeNumber(profile.lifePath, 1);
  const element = typeof profile.element === "string" ? profile.element : "";
  const tensions: TensionInsight[] = [];

  const lpPace = getLifePathPace(lp);
  const elementPace = ELEMENT_PACE[element];
  if (lpPace && elementPace && elementPace !== "fluid" && elementPace !== lpPace) {
    const lpClaim = lpPace === "fast" ? "moverte primero y ajustar en el camino" : "analizar antes de moverte";
    const elementClaim = elementPace === "fast" ? "empuja a actuar ya" : "pide más tiempo de verificación antes de avanzar";
    tensions.push({
      title: "Tu ritmo interno no es parejo",
      sources: ["Numerología", "Astrología"],
      evidence: `Tu Life Path ${lp} tiende a ${lpClaim}, pero tu elemento ${element} ${elementClaim}. Son dos señales independientes — una del número, otra del elemento — tirando en direcciones distintas.`,
      implication:
        "Esto no significa que una de las dos señales esté \"equivocada\": significa que tu impulso y tu forma de procesar operan a velocidades distintas entre sí. Cuando sentís ese desfasaje, es información — no un error a corregir.",
    });
  }

  return tensions;
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

/**
 * Dimensiones calculables SOLO con la fecha de nacimiento.
 *
 * `buildDimensions` usa los numeros de Expresion, Alma y Personalidad, que se
 * derivan del nombre. Sin nombre esos numeros son 0 y las cuatro dimensiones
 * caen al mismo valor (lifePath * 10), con lo que el radar queda colapsado y
 * muestra un dato que no significa nada. Este set usa unicamente lo que la
 * fecha si determina, para que el grafico varie de verdad.
 */
export function buildDateDimensions(profile: UserProfile): DimensionInsight[] {
  const lp = safeNumber(profile.lifePath, 1);
  const element = typeof profile.element === "string" ? profile.element : "";
  const modality = typeof profile.modality === "string" ? profile.modality : "";
  const sunSign = typeof profile.sunSign === "string" ? profile.sunSign : "";
  const animal = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";
  const personalYear = safeNumber(profile.cycles?.personalYear, 0);
  const personalDay = safeNumber(profile.cycles?.personalDay, 0);

  // Escala 1..9 -> 20..100, para que ninguna dimension quede en cero visual.
  const scale = (n: number) => Math.max(20, Math.min(Math.round((n / 9) * 100), 100));

  const ELEMENT_WEIGHT: Record<string, number> = {
    Fuego: 9, Aire: 7, Madera: 6, Agua: 5, Tierra: 4, Metal: 3,
  };
  const MODALITY_WEIGHT: Record<string, number> = {
    Cardinal: 9, Mutable: 6, Fijo: 3,
  };

  return [
    {
      dimension: "Propósito",
      value: scale(lp),
      influences: ["Camino de Vida", String(lp)],
      explanation: `Tu Camino de Vida ${lp} marca el eje de tu recorrido: es el número que sale de sumar tu fecha completa.`,
    },
    {
      dimension: "Impulso",
      value: scale(ELEMENT_WEIGHT[element] ?? 5),
      influences: ["Elemento", element],
      explanation: `Tu elemento ${element || "asignado"} describe con cuánta intensidad tendés a mover la energía hacia afuera.`,
    },
    {
      dimension: "Estructura",
      value: scale(10 - (MODALITY_WEIGHT[modality] ?? 6)),
      influences: ["Modalidad", modality],
      explanation: `Tu modalidad ${modality || "asignada"} indica qué tanto necesitás forma y continuidad para sostener lo que empezás.`,
    },
    {
      dimension: "Ciclo",
      value: scale(personalYear || lp),
      influences: ["Año personal", String(personalYear || lp)],
      explanation: `Estás en un año personal ${personalYear || lp}: es la etapa del ciclo de nueve años en la que te encontrás hoy.`,
    },
    {
      dimension: "Momento",
      value: scale(personalDay || lp),
      influences: ["Día personal", String(personalDay || lp)],
      explanation: `Tu dia personal ${personalDay || lp} describe la energía disponible específicamente hoy, y cambia cada día.`,
    },
    {
      dimension: "Intuición",
      value: scale(((lp * 2) % 9) + 1),
      influences: ["Camino de Vida", animal],
      explanation: `El cruce entre tu Camino de Vida y tu animal ${animal || "chino"} describe cuánto te apoyás en lo que percibís antes de razonarlo.`,
    },
  ];
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

  const narrative = `Estás en un Año de ${cycleName} (nivel ${personalYear}). Tu energía del día (${energyTheme}) ${energyScore >= 55 ? "favorece" : "sugiere"} ${focus.toLowerCase()}. Tu ${element.toLowerCase()} natural ${energyScore >= 60 ? "potencia" : "modula"} este momento. Para tu Life Path ${lp}, esto significa que ${personalYear <= 3 ? "es momento de sembrar con intención" : personalYear <= 6 ? "la clave está en construir sobre lo que ya empezaste" : "el crecimiento viene de soltar lo que ya cumplió su ciclo"}.`;

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
