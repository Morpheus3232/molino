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
import { getMasterNumbers, getMasterPositionMeaning, MASTER_POSITION_LABELS_ES } from "@/lib/engines/numerologyEngine";
import { getMoonSign } from "@/lib/engines/astrologyEngine";
import { getYearAnimal } from "@/lib/engines/yearCycleEngine";

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

export interface RuleInsight {
  rule: string;
  source: string;
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

function getNumberMeaning(n: number, type: "lifePath" | "expression" | "personality"): string {
  const meanings: Record<number, Record<string, string>> = {
    1: { lifePath: "Liderazgo e independencia", expression: "Innovación y originalidad", personality: "Impresión de fortaleza" },
    2: { lifePath: "Diplomacia y cooperación", expression: "Armonía en la expresión", personality: "Sensibilidad percibida" },
    3: { lifePath: "Creatividad y comunicación", expression: "Talento artístico", personality: "Carisma natural" },
    4: { lifePath: "Disciplina y estabilidad", expression: "Metodología práctica", personality: "Confiabilidad" },
    5: { lifePath: "Libertad y adaptabilidad", expression: "Versatilidad expresiva", personality: "Dinamismo" },
    6: { lifePath: "Responsabilidad y cuidado", expression: "Belleza y armonía", personality: "Calidez" },
    7: { lifePath: "Búsqueda de verdad", expression: "Análisis profundo", personality: "Misterio" },
    8: { lifePath: "Poder y materialización", expression: "Autoridad natural", personality: "Presencia" },
    9: { lifePath: "Compasión y sabiduría", expression: "Humanitarismo", personality: "Capacidad de adaptación" },
    11: { lifePath: "Intuición elevada", expression: "Inspiración espiritual", personality: "Magnetismo" },
    22: { lifePath: "Manifestación a gran escala", expression: "Visión constructiva", personality: "Grandeza" },
    33: { lifePath: "Sanación y servicio", expression: "Maestía expresiva", personality: "Compasión" },
  };

  const defaults: Record<string, string> = {
    lifePath: "Energía personal",
    expression: "Expresión vital",
    personality: "Impresión externa",
  };

  return meanings[n]?.[type] || defaults[type];
}

function getNumberName(n: number, type: "lifePath" | "expression" | "personality"): string {
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
    9: "El Camaleón",
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
export function themeOfPhrase(phrase: string): string | undefined {
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
export function findSharedTheme(itemsA: string[], itemsB: string[]): { theme: string; wordA: string; wordB: string } | null {
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
  const pn = safeNumber(profile.personalityNumber, 0);

  return {
    lifePath: { number: lp, name: getNumberName(lp, "lifePath"), meaning: getNumberMeaning(lp, "lifePath") },
    expression: { number: en, name: getNumberName(en, "expression"), meaning: getNumberMeaning(en, "expression") },
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
      description: `Tu arquetipo (${motorShared.wordA.toLowerCase()}) y tu animal ${chineseZodiac} (${motorShared.wordB}) se calculan por caminos separados y aterrizan en lo mismo. Es el rasgo que más cuesta apagar cuando querés pasar desapercibido.`,
      sources: motorSources,
    });
  } else {
    patterns.push({
      label: "Tu motor",
      keyword: archetypeKeywords[0] || getKeywordForLifePath(lp),
      description: archetypeInfo?.description || `Tu empuje de base es ${getKeywordForLifePath(lp)}: es lo que aparece primero cuando nadie te está mirando.`,
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
      description: `Tu ${tensionShared.wordA.toLowerCase()} y el clima de este año (${tensionShared.wordB.toLowerCase()}) empujan en el mismo sentido: el año amplifica ese punto en vez de compensarlo. Este es el tramo para no dejarlo en piloto automático.`,
      sources: tensionSources,
    });
  } else {
    patterns.push({
      label: "Tu tensión",
      keyword: challenges[0] || "adaptación",
      description: challenges[0]
        ? `Tu ${challenges[0].toLowerCase()} se activa cuando algo del resto del perfil se desbalancea — es un síntoma, no la causa. Aparece antes en situaciones de cansancio o presión.`
        : "Toda configuración tiene un punto que se tensa bajo presión; en este perfil todavía no hay uno que se destaque sobre el resto.",
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
      description: `Tu ${chineseZodiac} de base y ${yearType?.name?.toLowerCase() || "el ciclo actual"} piden lo mismo: ${movementShared.theme}. Es de los pocos tramos donde no tenés que elegir entre tu forma de ser y el momento.`,
      sources: movementSources,
    });
  } else {
    patterns.push({
      label: "Tu próximo movimiento",
      keyword: yearType?.name?.replace("Año de ", "").toLowerCase() || "nuevo ciclo",
      description: yearType
        ? `${yearType.name}: ${yearType.description.toLowerCase()} Es el eje del año, no una obligación — marca hacia dónde rinde más el esfuerzo.`
        : `Tu ciclo actual favorece ${personalYear <= 3 ? "empezar cosas" : personalYear <= 6 ? "construir sobre lo empezado" : "cerrar lo que ya cumplió"}.`,
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
 * El "modo" en que un Life Path despliega su energía, en los mismos tres
 * términos que las modalidades de la astrología occidental. Solo los grupos
 * con un modo tradicional claro devuelven algo:
 *  - [1, 8]      → "iniciar"     (números de acción / manifestación material)
 *  - [4, 7, 22]  → "consolidar"  (números de estructura)
 *  - [3, 5, 9]   → "adaptar"     (números de expresión / cambio / cierre)
 * Los relacionales/maestros restantes ([2, 6, 11, 33]) no tienen un modo de
 * despliegue propio y devuelven null en vez de forzarles uno.
 * NO es numerología nueva: es la misma agrupación de acción/estructura/
 * expresión que ya usa getLifePathPace, expresada en el vocabulario de las
 * modalidades para poder cruzarla con la astrología.
 */
function getLifePathMode(lifePath: number): "iniciar" | "consolidar" | "adaptar" | null {
  if ([1, 8].includes(lifePath)) return "iniciar";
  if ([4, 7, 22].includes(lifePath)) return "consolidar";
  if ([3, 5, 9].includes(lifePath)) return "adaptar";
  return null;
}

/** Modalidad solar occidental → el mismo vocabulario de modo que getLifePathMode. */
const MODALITY_MODE: Record<string, "iniciar" | "consolidar" | "adaptar"> = {
  Cardinal: "iniciar",
  Fijo: "consolidar",
  Mutable: "adaptar",
};

/**
 * Puente entre elementos occidentales (Fuego/Tierra/Aire/Agua) y elementos
 * del tronco chino (Metal/Agua/Madera/Fuego/Tierra). Solo se afirma una
 * correspondencia donde el nombre coincide literalmente y el sentido
 * tradicional es el mismo: Fuego, Tierra y Agua existen en ambos marcos con
 * la misma cualidad. Aire (occidental) y Metal/Madera (chino) NO tienen
 * equivalente limpio, así que ahí no se afirma nada — ni convergencia ni
 * tensión. Preferimos decir menos que inventar un mapa entre sistemas que
 * cuentan los elementos distinto.
 */
const SHARED_ELEMENTS = new Set(["Fuego", "Tierra", "Agua"]);

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
  const modality = typeof profile.modality === "string" ? profile.modality : "";
  const chineseElement =
    typeof profile.chineseZodiacInfo?.element === "string" ? profile.chineseZodiacInfo.element : "";
  const tensions: TensionInsight[] = [];

  // 1. Ritmo: pace del Life Path vs. pace del elemento solar (la tensión
  //    numerología × astrología que ya existía).
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

  // 2. Modo: cómo despliega su energía tu Life Path vs. tu modalidad solar.
  //    Solo se marca tensión en los dos pares realmente opuestos
  //    (consolidar ↔ adaptar), no cuando uno es "iniciar" (que combina con
  //    cualquiera de los otros dos sin contradicción).
  const lpMode = getLifePathMode(lp);
  const modMode = MODALITY_MODE[modality];
  const opposed =
    (lpMode === "consolidar" && modMode === "adaptar") ||
    (lpMode === "adaptar" && modMode === "consolidar");
  if (opposed) {
    const lpClaim =
      lpMode === "consolidar"
        ? "construir sobre lo que ya está firme y llevarlo hasta el final"
        : "mantener varias opciones abiertas y cambiar de forma cuando hace falta";
    const modClaim =
      modMode === "consolidar"
        ? "por temperamento te aferrás a lo que empezaste"
        : "por temperamento soltás y probás otra cosa apenas algo deja de moverse";
    tensions.push({
      title: "Terminás y soltás con lógicas distintas",
      sources: ["Numerología", "Astrología"],
      evidence: `Tu Life Path ${lp} te pide ${lpClaim}. Tu modalidad ${modality} hace que ${modClaim}. El número y el temperamento no coinciden en cuándo algo está "listo".`,
      implication:
        "El desfasaje aparece al cerrar: uno de los dos te dice que sigas, el otro que ya está. Reconocer cuál está hablando en cada momento evita abandonar algo a mitad o insistir en algo que ya cumplió su función.",
    });
  }

  // 3. Temperatura: elemento solar occidental vs. elemento del tronco chino,
  //    solo en el par inequívoco Fuego ↔ Agua (los dos nombres existen igual
  //    en ambos marcos y son tradicionalmente antagónicos).
  if (
    (element === "Fuego" && chineseElement === "Agua") ||
    (element === "Agua" && chineseElement === "Fuego")
  ) {
    tensions.push({
      title: "Tu temperatura de base tira para dos lados",
      sources: ["Astrología", "Zodiaco Chino"],
      evidence: `Tu elemento solar es ${element} y el elemento de tu año chino es ${chineseElement}. En las dos tradiciones, Fuego y Agua se leen como fuerzas opuestas: una calienta y empuja hacia afuera, la otra enfría y lleva hacia adentro.`,
      implication:
        "No es un defecto: es que tu reacción inmediata (Fuego) y tu procesamiento de fondo (Agua) no tienen la misma temperatura. Sirve para no confiar del todo en el primer impulso ni en la primera cautela — la lectura completa está entre las dos.",
    });
  }

  return tensions;
}

// ════════════════════════════════════════════════════════════════════
// MODELO PERSONAL UNIFICADO — buildSynthesis()
//
// Fuente única de verdad para MAPA (/profile), LECTURA (/lectura) e IA
// (chat + /ia). Las tres superficies presentan esto distinto, pero ninguna
// vuelve a derivar la síntesis por su cuenta.
// ════════════════════════════════════════════════════════════════════

/** Qué capa epistémica es una afirmación — se conserva para no mezclar. */
export type EpistemicLayer =
  | "calculo"        // lo que un motor determinista produjo
  | "fuente"         // de dónde viene el concepto en la tradición
  | "interpretacion" // qué propone el marco simbólico
  | "inferencia"     // qué emerge de combinar varios elementos
  | "incertidumbre"; // lo que no se puede establecer

/** Un cruce real entre dos (o tres) sistemas, con su derivación verificable. */
export interface CrossSystemLink {
  systems: string[];
  kind: "convergencia" | "diferencia";
  /** Casi siempre "inferencia": es un cruce derivado, no un cálculo crudo. */
  layer: EpistemicLayer;
  /** La lectura simbólica del cruce. */
  statement: string;
  /** La derivación que lo hace comprobable (cálculo + fuente). */
  evidence: string;
}

export interface Uncertainty {
  field: string;
  note: string;
}

export interface SynthesisCoordinates {
  lifePath: number;
  lifePathIsMaster: boolean;
  personalityNumber: number;
  /** Ausente en el flujo principal: el onboarding no pide nombre. Ver AUDIT. */
  expressionNumber?: number;
  sunSign: string;
  sunElement: string;
  sunModality: string;
  moonSign?: string;
  /** true mientras no se recolecte la hora de nacimiento (aprox. de mediodía). */
  moonApproximate: boolean;
  chineseAnimal: string;
  chineseElement: string;
  archetype: string;
  personalYear: number;
  personalMonth: number;
  personalDay: number;
}

export interface PersonalSynthesis {
  coordinates: SynthesisCoordinates;
  patterns: PatternInsight[];
  convergences: CrossSystemLink[];
  differences: CrossSystemLink[];
  tensions: TensionInsight[];
  rules: RuleInsight[];
  uncertainties: Uncertainty[];
  /** Cuáles de los 3 sistemas aportaron al menos un cruce real. */
  systemsEngaged: string[];
}

/** Palabras-rasgo estándar de cada signo solar, en el vocabulario que
 * themeOfPhrase ya sabe agrupar (THEME_BUCKETS). Análogo a getChineseTraits:
 * son keywords de manual, no rasgos inventados, y si una palabra no cae en
 * ningún bucket simplemente no produce match (no fuerza uno). */
const SUN_SIGN_TRAITS: Record<string, string[]> = {
  Aries: ["iniciativa", "impulsividad", "liderazgo"],
  Tauro: ["estabilidad", "práctico", "constancia"],
  "Géminis": ["curiosidad", "versátil", "expresivo"],
  "Cáncer": ["sensibilidad", "protección", "vínculo"],
  Leo: ["liderazgo", "carisma", "expresivo"],
  Virgo: ["organizado", "análisis", "práctico"],
  Libra: ["diplomático", "armonioso", "vínculo"],
  Escorpio: ["intuición", "misterio", "análisis"],
  Sagitario: ["libertad", "aventura", "curiosidad"],
  Capricornio: ["disciplina", "estructura", "determinación"],
  Acuario: ["innovador", "libre", "visionario"],
  "Piscis": ["intuición", "sensibilidad", "creativo"],
};

function getSunSignTraits(sign: string): string[] {
  return SUN_SIGN_TRAITS[sign] || [];
}

/**
 * Cruces entre sistemas que apuntan en la MISMA dirección. No infla el
 * conteo: cada uno exige que dos derivaciones independientes coincidan de
 * verdad (igualdad numérica, mismo modo, mismo nombre de elemento, o el
 * mismo tema pasado por findSharedTheme). Si nada coincide, devuelve [].
 */
export function buildConvergences(profile: UserProfile): CrossSystemLink[] {
  const lp = safeNumber(profile.lifePath, 1);
  const personalYear = safeNumber(profile.cycles?.personalYear, 0);
  const personalityNumber = safeNumber(profile.personalityNumber, 0);
  const sunSign = typeof profile.sunSign === "string" ? profile.sunSign : "";
  const element = typeof profile.element === "string" ? profile.element : "";
  const modality = typeof profile.modality === "string" ? profile.modality : "";
  const chineseZodiac = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";
  const chineseElement =
    typeof profile.chineseZodiacInfo?.element === "string" ? profile.chineseZodiacInfo.element : "";
  const archetypeKeywords: string[] = ARCHETYPES[lp]?.keywords || [];

  const links: CrossSystemLink[] = [];

  // A. Numérica: Life Path == Año Personal (numerología × ciclos).
  if (lp === personalYear && personalYear > 0) {
    links.push({
      systems: ["Numerología", "Ciclos"],
      kind: "convergencia",
      layer: "calculo",
      statement: `Tu recorrido de fondo y el clima de este año caen en el mismo número, ${lp}. En la lectura numerológica, un año que repite tu Camino de Vida no pide cambiar de registro sino profundizar el que ya tenés.`,
      evidence: `Camino de Vida ${lp} = Año Personal ${personalYear} (misma reducción teosófica, dos cálculos distintos).`,
    });
  }

  // B. Numérica: número de personalidad (día de nacimiento) == Año Personal.
  if (personalityNumber === personalYear && personalYear > 0) {
    links.push({
      systems: ["Numerología", "Ciclos"],
      kind: "convergencia",
      layer: "calculo",
      statement: `El número del día (${personalityNumber}), que la numerología asocia a cómo te perciben, cae igual que tu Año Personal. En esa lectura, el año favorece mostrarte sin ajustar la fachada.`,
      evidence: `Número de personalidad ${personalityNumber} = Año Personal ${personalYear}.`,
    });
  }

  // B2. Numérica: tu animal natal vuelve a ser el animal del año en curso
  //     (zodíaco chino × ciclo del año). Es "tu año".
  if (chineseZodiac) {
    const yearAnimal = getYearAnimal(new Date().getFullYear());
    if (chineseZodiac === yearAnimal) {
      links.push({
        systems: ["Zodiaco Chino", "Ciclos"],
        kind: "convergencia",
        layer: "calculo",
        statement: `Este es tu año: el animal del año en curso vuelve a ser ${chineseZodiac}. La tradición china lo describe como un año más expuesto — de más oportunidad y también de más fricción con lo establecido.`,
        evidence: `Animal natal ${chineseZodiac} = animal del año ${new Date().getFullYear()} (${yearAnimal}).`,
      });
    }
  }

  // C. Modo: Life Path y modalidad solar despliegan la energía igual.
  const lpMode = getLifePathMode(lp);
  const modMode = MODALITY_MODE[modality];
  if (lpMode && modMode && lpMode === modMode) {
    links.push({
      systems: ["Numerología", "Astrología"],
      kind: "convergencia",
      layer: "inferencia",
      statement: `Leídos con el mismo criterio de "modo", tu Life Path y tu modalidad solar coinciden: los dos ${lpMode === "iniciar" ? "arrancan" : lpMode === "consolidar" ? "consolidan" : "se adaptan"}. En este punto el número y el temperamento no se contradicen — no todo el mapa funciona así.`,
      evidence: `Life Path ${lp} (agrupado como "${lpMode}", misma lógica acción/estructura/expresión que el resto del motor) y modalidad solar ${modality} (modo "${modMode}").`,
    });
  }

  // D. Elemento: elemento solar == elemento del tronco chino, en el conjunto
  //    de nombres que las dos tradiciones comparten literalmente.
  if (element && element === chineseElement && SHARED_ELEMENTS.has(element)) {
    links.push({
      systems: ["Astrología", "Zodiaco Chino"],
      kind: "convergencia",
      layer: "inferencia",
      statement: `La astrología occidental (4 elementos) y el zodíaco chino (5) te asignan el mismo: ${element}. Dos lecturas independientes coinciden en ${element.toLowerCase()}; qué tan literal tomarlo lo matiza el resto del mapa.`,
      evidence: `Elemento solar ${element} = elemento del tronco del año chino ${chineseElement} (solo se afirma en Fuego/Tierra/Agua, los nombres que ambos marcos comparten).`,
    });
  }

  // E. Tres sistemas, un tema: arquetipo (numerología) ∩ rasgos del animal
  //    (chino) ∩ rasgos del signo solar (astrología), todos por el mismo
  //    bucket de findSharedTheme. Es el cruce más exigente y el más raro.
  const chineseTraits = getChineseTraits(chineseZodiac);
  const sunTraits = getSunSignTraits(sunSign);
  const acVsChinese = findSharedTheme(archetypeKeywords, chineseTraits);
  if (acVsChinese) {
    const acVsSun = findSharedTheme(archetypeKeywords, sunTraits);
    if (acVsSun && acVsSun.theme === acVsChinese.theme) {
      links.push({
        systems: ["Numerología", "Astrología", "Zodiaco Chino"],
        kind: "convergencia",
        layer: "inferencia",
        statement: `Los tres marcos —número, signo y animal— caen en el mismo tema: ${acVsChinese.theme}. Es infrecuente que coincidan los tres; cuando pasa, estas tradiciones lo leen como un rasgo central, de los que cuesta mantener a raya.`,
        evidence: `Arquetipo (${acVsChinese.wordA}), animal ${chineseZodiac} (${acVsChinese.wordB}) y signo ${sunSign} (${acVsSun.wordB}) caen los tres en el mismo tema, "${acVsChinese.theme}" — un agrupador temático propio de Molino, no de las tradiciones.`,
      });
    }
  }

  return links;
}

/**
 * Diferencias entre sistemas que NO son contradicciones (esas son
 * buildTensions) pero sí valen la pena nombrar: dos sistemas describen
 * dominios distintos con lógicas distintas. Hoy: modo del Life Path vs.
 * modalidad solar cuando no coinciden y tampoco son el par opuesto.
 */
export function buildDifferences(profile: UserProfile): CrossSystemLink[] {
  const lp = safeNumber(profile.lifePath, 1);
  const modality = typeof profile.modality === "string" ? profile.modality : "";
  const diffs: CrossSystemLink[] = [];

  const lpMode = getLifePathMode(lp);
  const modMode = MODALITY_MODE[modality];
  const isOpposedPair =
    (lpMode === "consolidar" && modMode === "adaptar") ||
    (lpMode === "adaptar" && modMode === "consolidar");
  if (lpMode && modMode && lpMode !== modMode && !isOpposedPair) {
    diffs.push({
      systems: ["Numerología", "Astrología"],
      kind: "diferencia",
      layer: "inferencia",
      statement: `Tu número y tu temperamento no operan igual, pero tampoco chocan: tu Life Path ${lp} tiende a ${lpMode}, tu modalidad ${modality} a ${modMode}. Uno describe qué construís, el otro cómo lo encarás día a día.`,
      evidence: `Life Path ${lp} (modo "${lpMode}") y modalidad ${modality} (modo "${modMode}") son modos distintos y no antagónicos.`,
    });
  }

  return diffs;
}

/**
 * Lo que Molino NO puede afirmar con precisión para este perfil. Se pasa a
 * la IA y se muestra al usuario en vez de presentar una aproximación como
 * dato duro.
 */
export function buildUncertainties(profile: UserProfile): Uncertainty[] {
  const out: Uncertainty[] = [];

  // El signo lunar se calcula con las 12:00 como hora porque el onboarding
  // no pide la hora exacta. La Luna cambia de signo cada ~2,5 días, así que
  // cerca de un borde puede ser el signo anterior o el siguiente.
  if (!profile.birthTime && profile.birthDate) {
    const moon = getMoonSign(profile.birthDate);
    out.push({
      field: "Signo lunar",
      note: `Calculado con las 12:00 como hora de nacimiento (no la pedimos). ${moon} es la mejor estimación, pero si naciste cerca de un cambio de signo lunar podría ser el contiguo. No se usa como señal de alta confianza en ninguna síntesis.`,
    });
  }

  // Número de expresión: necesita el nombre completo, que el flujo principal
  // no recolecta a propósito (privacidad, cero fricción).
  if (!profile.expressionNumber) {
    out.push({
      field: "Número de expresión",
      note: "No se calcula: Molino no pide tu nombre. Tu numerología acá se apoya en el Camino de Vida y el número del día, no en el nombre.",
    });
  }

  // Sin hora ni lugar: no hay ascendente ni casas.
  if (!profile.birthTime) {
    out.push({
      field: "Ascendente y casas",
      note: "Fuera de alcance: requieren hora y lugar de nacimiento exactos. Molino trabaja con Sol, Luna (aprox.) y elemento, no con la carta natal completa.",
    });
  }

  out.push({
    field: "Naturaleza de los sistemas",
    note: "Numerología, astrología y zodíaco chino son marcos simbólicos de reflexión, no medición. Nada de esto es una predicción ni un diagnóstico.",
  });

  return out;
}

/**
 * EL MODELO PERSONAL. Compone todo lo anterior en una sola estructura
 * trazable. No hace I/O, no llama IA — función pura sobre el perfil ya
 * calculado. Es lo que consumen /profile, /lectura y la IA.
 */
export function buildSynthesis(profile: UserProfile): PersonalSynthesis {
  const lp = safeNumber(profile.lifePath, 1);
  const coordinates: SynthesisCoordinates = {
    lifePath: lp,
    lifePathIsMaster: lp === 11 || lp === 22 || lp === 33,
    personalityNumber: safeNumber(profile.personalityNumber, 0),
    expressionNumber: profile.expressionNumber || undefined,
    sunSign: typeof profile.sunSign === "string" ? profile.sunSign : "",
    sunElement: typeof profile.element === "string" ? profile.element : "",
    sunModality: typeof profile.modality === "string" ? profile.modality : "",
    // Descriptivo únicamente — nunca alimenta un detector de convergencia o
    // tensión (todas usan Sol: elemento/modalidad). Sin hora es aproximado.
    moonSign: profile.birthDate ? getMoonSign(profile.birthDate, profile.birthTime) : undefined,
    moonApproximate: !profile.birthTime,
    chineseAnimal: typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "",
    chineseElement:
      typeof profile.chineseZodiacInfo?.element === "string" ? profile.chineseZodiacInfo.element : "",
    archetype: typeof profile.archetype === "string" ? profile.archetype : "",
    personalYear: safeNumber(profile.cycles?.personalYear, 0),
    personalMonth: safeNumber(profile.cycles?.personalMonth, 0),
    personalDay: safeNumber(profile.cycles?.personalDay, 0),
  };

  const patterns = buildPatterns(profile);
  const convergences = buildConvergences(profile);
  const differences = buildDifferences(profile);
  const tensions = buildTensions(profile);
  const rules = buildRules(profile);
  const uncertainties = buildUncertainties(profile);

  const engaged = new Set<string>();
  for (const link of [...convergences, ...differences]) {
    for (const s of link.systems) if (s !== "Ciclos") engaged.add(s);
  }
  for (const t of tensions) for (const s of t.sources) if (s !== "Ciclos") engaged.add(s);
  for (const p of patterns) {
    if (p.sources.length > 1) for (const s of p.sources) if (s !== "Ciclos" && s !== "Arquetipos") engaged.add(s);
  }

  return {
    coordinates,
    patterns,
    convergences,
    differences,
    tensions,
    rules,
    uncertainties,
    systemsEngaged: [...engaged],
  };
}

/**
 * "Tus reglas" — short, personal, imperative statements the user can
 * actually carry around. Deliberately does NOT try to force exactly 10:
 * every rule here traces to a real per-archetype strength/challenge
 * (ARCHETYPE_DESCRIPTIONS has 3-5 of each, never a fixed 10) or to a
 * pattern/tension already computed elsewhere — padding to a round number
 * with invented filler would break the same anti-fabrication discipline
 * buildPatterns/buildTensions already enforce. Order: strengths first
 * (what to lean into), then challenges (what to watch), then the
 * already-computed motor/movement/tension patterns (how they show up in
 * practice) — capped at 10 as an upper bound, not a target.
 */
/**
 * Marcos de frase para las reglas. Se rotan por índice para que 4 reglas de
 * fortaleza seguidas no lean como la misma plantilla con una palabra
 * cambiada — el defecto que la evaluación de calidad marcó. Cada marco sigue
 * siendo concreto y trazable al rasgo real; ninguno inventa contenido.
 */
const STRENGTH_RULE_FRAMES: ((x: string) => string)[] = [
  (x) => `Apoyate en tu ${x}: es de lo poco que sigue firme cuando dudás del resto.`,
  (x) => `Ante una bifurcación, elegí la opción que más use tu ${x}.`,
  (x) => `Tu ${x} no es un adorno recortable — es de donde sacás tracción.`,
  (x) => `Cuando algo te cueste, volvé a tu ${x} antes de buscar una técnica nueva.`,
  (x) => `Protegé el espacio para tu ${x}: rinde más cuando no lo tenés que justificar.`,
];
const CHALLENGE_RULE_FRAMES: ((x: string) => string)[] = [
  (x) => `Tu ${x} es un aviso temprano, no una falla de fábrica: cuando aparece, algo se está desbalanceando.`,
  (x) => `Vigilá tu ${x} en los picos de presión — es ahí donde pasa de rasgo a costo.`,
  (x) => `Cuando notes ${x}, frená y mirá qué la disparó antes de corregir nada.`,
  (x) => `No pelees con tu ${x} de frente: sacale la carga que la alimenta.`,
  (x) => `Tu ${x} se agranda cuando estás cansado o solo — tenelo en cuenta antes de decidir.`,
];

export function buildRules(profile: UserProfile): RuleInsight[] {
  const strengths = profile.archetypeInfo?.strengths || [];
  const challenges = profile.archetypeInfo?.challenges || [];
  const rules: RuleInsight[] = [];

  strengths.forEach((strength: string, i: number) => {
    rules.push({
      rule: STRENGTH_RULE_FRAMES[i % STRENGTH_RULE_FRAMES.length](strength.toLowerCase()),
      source: `Arquetipo · ${strength}`,
    });
  });

  challenges.forEach((challenge: string, i: number) => {
    rules.push({
      rule: CHALLENGE_RULE_FRAMES[i % CHALLENGE_RULE_FRAMES.length](challenge.toLowerCase()),
      source: `Arquetipo · ${challenge}`,
    });
  });

  const patterns = buildPatterns(profile);
  const motor = patterns.find((p) => p.label === "Tu motor");
  if (motor) {
    rules.push({
      rule: `Tu motor es ${motor.keyword.toLowerCase()}: no lo bajes de intensidad solo para que otros estén cómodos.`,
      source: motor.sources.join(" + "),
    });
  }
  const movement = patterns.find((p) => p.label === "Tu próximo movimiento");
  if (movement) {
    rules.push({
      rule: `Este año rinde más el esfuerzo puesto en ${movement.keyword.toLowerCase()} — no lo frenes por costumbre.`,
      source: movement.sources.join(" + "),
    });
  }

  // Regla por tensión: cada tensión estructural (ritmo / modo / temperatura)
  // deja una regla propia, derivada de su título — antes había una sola frase
  // hardcodeada de "ritmo" que quedaba mal cuando la tensión era otra.
  const tensions = buildTensions(profile);
  for (const tension of tensions) {
    rules.push({
      rule: `${tension.title}: no fuerces una sola de las dos señales — la lectura está en el desfasaje, no en elegir un lado.`,
      source: tension.sources.join(" + "),
    });
  }

  return rules.slice(0, 10);
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

/**
 * "Tus reglas" — grouped principles for the compact reading.
 *
 * Reuses the outputs of buildRules() and buildPatterns() (no duplicated
 * logic): rules that trace to real archetype strengths feed AVANZÁ, rules
 * that trace to real archetype challenges feed OBSERVÁ, and the
 * already-computed movement pattern feeds INICIÁ. A category that has no
 * real data falls back to a generic-but-true statement instead of inventing
 * attributes — the UI synthesizes, it never fabricates.
 */
export interface PrincipleInsight {
  title: "AVANZÁ" | "OBSERVÁ" | "INICIÁ";
  body: string;
  /**
   * De dónde sale el principio. El motor ya filtraba por `RuleInsight.source`
* para armarlo, pero no lo devolvía, así que el lector veía la conclusión
   * sin su origen — un proceso opaco, lo contrario de lo que el producto
   * promete.
   */
  source: string;
}

export function buildPrinciples(
  rules: RuleInsight[],
  patterns: PatternInsight[],
  archetypeInfo?: { strengths?: string[]; challenges?: string[] }
): PrincipleInsight[] {
  const strengths = archetypeInfo?.strengths || [];
  const challenges = archetypeInfo?.challenges || [];

  const movement = patterns.find((p) => p.label === "Tu próximo movimiento");

  const arquetipoTerms = (list: string[]) =>
    rules
      .filter((r) => list.some((term) => r.source.includes(term)))
      .map((r) => r.source.replace("Arquetipo · ", "").toLowerCase());

  const unique = (terms: string[]) => [...new Set(terms)];

  // Los patterns (motor/tensión) ya se muestran en "Tus patrones" (01):
  // repetir su keyword acá duplicaría el concepto ("ambición… y ambicioso")
  // y rompería la lista con un adjetivo al final de sustantivos. Los
  // principios se alimentan solo de las fortalezas/desafíos reales del
  // arquetipo, con tope de 3 para que la frase no se vuelva un listado.
  const avanzanTerms = unique(arquetipoTerms(strengths)).slice(0, 3);
  const observaTerms = unique(arquetipoTerms(challenges)).slice(0, 3);
  const iniciTerm = movement?.keyword.toLowerCase();

  const joinTerms = (terms: string[]): string => {
    if (terms.length === 0) return "";
    if (terms.length === 1) return terms[0];
    if (terms.length === 2) {
      const last = terms[1];
      return `${terms[0]} ${/^i/i.test(last) ? "e" : "y"} ${last}`;
    }
    const last = terms[terms.length - 1];
    return `${terms.slice(0, -1).join(", ")} ${/^i/i.test(last) ? "e" : "y"} ${last}`;
  };

  const titleCase = (t: string) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : t);

  return [
    {
      title: "AVANZÁ",
      body:
        avanzanTerms.length > 0
          ? `Cuando dudes, elegí ${joinTerms(avanzanTerms)}.`
          : "Tus fortalezas reales son tu brújula — confiá en ellas cuando dudes.",
      source: "Fortalezas de tu arquetipo",
    },
    {
      title: "OBSERVÁ",
      body:
        observaTerms.length === 1
          ? `${titleCase(observaTerms[0])} es una señal para revisar, no un defecto que eliminar.`
          : observaTerms.length > 1
            ? `${joinTerms(observaTerms.map((t, i) => (i === 0 ? titleCase(t) : t)))} son señales para revisar, no defectos que eliminar.`
            : "Las zonas de exceso son información, no defectos — escuchalas a tiempo.",
      source: "Desafíos de tu arquetipo",
    },
    {
      title: "INICIÁ",
      body: iniciTerm
        ? `Tu ciclo actual favorece ${iniciTerm}. No frenes algo nuevo por costumbre.`
        : "Tu ciclo actual tiene un ritmo propio — dejalo fluir sin forzar.",
      source: "Tu próximo movimiento",
    },
  ];
}

export interface PaywallHook {
  question: string;
  context: string;
}

/**
 * Gancho contextual para el paywall: reformula un dato YA calculado gratis
 * como pregunta abierta, en vez de repetirlo como afirmación cerrada (ver
 * .claude/execution-logs/paywall-redesign-proposal.md). Nunca inventa un
 * dato nuevo — solo cambia cómo se presenta uno que el perfil ya tiene.
 *
 * Prioridad (de más a menos específico): tensión real de ritmo > número
 * maestro > convergencia real entre 2 sistemas > patterns[1] ("Tu tensión")
 * como fallback universal. buildTensions() devuelve tensión en pocos
 * perfiles; buildPatterns() siempre devuelve 3 items, así que patterns[1]
 * es la única rama garantizada de cubrir todo perfil.
 */
export function generatePaywallHook(profile: UserProfile): PaywallHook {
  const tension = buildTensions(profile)[0];
  if (tension) {
    return {
      question: `Tu ${tension.sources[0]} tira para un lado. Tu ${tension.sources[1]} tira para otro. ¿Notaste esa fricción, o todavía no la nombraste?`,
      context: tension.evidence,
    };
  }

  const masters = getMasterNumbers(profile);
  if (masters.length > 0) {
    const hit = masters[0];
    const label = MASTER_POSITION_LABELS_ES[hit.position];
    return {
      question: `Tenés un Número Maestro ${hit.number} en tu ${label}. No es un número más — ¿sabés qué implica realmente?`,
      context: getMasterPositionMeaning(hit.number, hit.position),
    };
  }

  const patterns = buildPatterns(profile);
  const convergent = patterns.find((p) => p.sources.length > 1);
  if (convergent) {
    return {
      question: `${convergent.sources.join(" y ")} coinciden en ${convergent.keyword}. Cuando dos sistemas distintos dicen lo mismo, suele importar. ¿Sabés por qué coinciden?`,
      context: convergent.description,
    };
  }

  const fallback = patterns[1];
  return {
    question: `Tu ${fallback.sources[0]} señala ${fallback.keyword}. Es un solo sistema hablando — ¿los otros dos coinciden o contradicen?`,
    context: fallback.description,
  };
}
