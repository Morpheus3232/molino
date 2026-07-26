/**
 * Motor de Perspectivas
 *
 * Toma los resultados de cada sistema por separado y los presenta
 * como visiones comparables del mismo usuario.
 *
 * Molino no dice qué sistema "tiene razón".
 * Muestra qué dicen cada uno y dónde coinciden/divergen.
 */

import type { UserProfile } from "@/types/user";
import { safeNumber } from "@/lib/utils/score";
import { ARCHETYPES } from "@/lib/data";
import { ZODIAC_SIGNS } from "@/lib/data/knowledge";

export interface SystemPerspective {
  system: "numerologia" | "astrologia" | "zodiaco-chino";
  systemLabel: string;
  headline: string;
  detail: string;
  keywords: string[];
  color: string;
  icon: string;
}

export interface ConvergencePoint {
  theme: string;
  systems: string[];
  explanation: string;
}

export interface DivergencePoint {
  theme: string;
  systemA: string;
  viewA: string;
  systemB: string;
  viewB: string;
  explanation: string;
}

export interface IdentityProfile {
  perspectives: SystemPerspective[];
  convergences: ConvergencePoint[];
  divergences: DivergencePoint[];
  synthesis: string;
}

// ── Numerología: qué dice sobre el usuario ──

function getNumerologyPerspective(profile: UserProfile): SystemPerspective {
  const lp = safeNumber(profile.lifePath, 1);
  const en = safeNumber(profile.expressionNumber, 0);
  const sn = safeNumber(profile.soulNumber, 0);
  const pn = safeNumber(profile.personalityNumber, 0);
  const archetype = ARCHETYPES[lp];

  const lpMeanings: Record<number, string> = {
    1: "liderazgo e iniciativa",
    2: "cooperación y sensibilidad",
    3: "expresión creativa",
    4: "estabilidad y disciplina",
    5: "libertad y versatilidad",
    6: "responsabilidad y cuidado",
    7: "introspección y búsqueda de verdad",
    8: "poder y manifestación material",
    9: "sabiduría y compasión",
    11: "intuición elevada e inspiración",
    22: "construcción a gran escala",
    33: "compasión universal y sanación",
  };

  const keywords = archetype?.keywords || [];
  const description = archetype?.description || `Tu energía principal está orientada hacia ${lpMeanings[lp] || "la acción"}.`;

  return {
    system: "numerologia",
    systemLabel: "Numerología",
    headline: `Camino de vida ${lp}`,
    detail: description,
    keywords: [...keywords.slice(0, 3), `Expresión ${en}`, `Alma ${sn}`, `Personalidad ${pn}`],
    color: "var(--element-fire)",
    icon: "🔢",
  };
}

// ── Astrología: qué dice sobre el usuario ──

function getAstrologyPerspective(profile: UserProfile): SystemPerspective {
  const sunSign = typeof profile.sunSign === "string" ? profile.sunSign : "";
  const element = typeof profile.element === "string" ? profile.element : "";
  const modality = typeof profile.modality === "string" ? profile.modality : "";

  const signData = ZODIAC_SIGNS.find(s => s.name === sunSign);

  const elementTraits: Record<string, string> = {
    "Fuego": "pasión e iniciativa",
    "Tierra": "practicidad y estabilidad",
    "Aire": "intelecto y comunicación",
    "Agua": "emoción e intuición",
  };

  const keywords = signData?.keywords || [];
  const detail = `Seg\u00fan la astrolog\u00eda, tu Sol en ${sunSign} te orienta hacia ${elementTraits[element] || element}. ${signData ? `Es un signo ${signData.modality.toLowerCase()} de elemento ${signData.element.toLowerCase()}.` : ""}`;

  return {
    system: "astrologia",
    systemLabel: "Astrología",
    headline: `Sol en ${sunSign}`,
    detail: detail,
    keywords: [...keywords.slice(0, 3), `${element}`, `${modality}`],
    color: "var(--layer-astrology)",
    icon: "⭐",
  };
}

// ── Zodiaco Chino: qué dice sobre el usuario ──

function getChineseZodiacPerspective(profile: UserProfile): SystemPerspective {
  const chineseZodiac = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";
  const chineseElement = typeof profile.chineseZodiacInfo?.element === "string" ? profile.chineseZodiacInfo.element : "";

  const animalTraits: Record<string, { keywords: string[]; detail: string }> = {
    "Rata": { keywords: ["ingenio", "astucia", "versatilidad"], detail: "Tu Rata aporta ingenio y capacidad de adaptación. Buscás resolver problemas con creatividad." },
    "Buey": { keywords: ["fuerza", "determinación", "confiabilidad"], detail: "Tu Buey aporta determinación inquebrantable. Construís con paciencia y consistencia." },
    "Tigre": { keywords: ["valentía", "liderazgo", "energía"], detail: "Tu Tigre aporta coraje y presencia. Actuás con fuerza y carisma natural." },
    "Gato": { keywords: ["elegancia", "diplomacia", "sensibilidad"], detail: "Tu Gato aporta elegancia y sensibilidad artística. Buscás armonía en todo." },
    "Dragón": { keywords: ["ambición", "carisma", "poder"], detail: "Tu Dragón aporta fuerza imperial y visión. Tenés energía para lograr cosas grandes." },
    "Serpiente": { keywords: ["sabiduría", "intuición", "misterio"], detail: "Tu Serpiente aporta sabiduría profunda. Vés más allá de lo superficial." },
    "Caballo": { keywords: ["libertad", "energía", "aventura"], detail: "Tu Caballo aporta libertad de espíritu y energía contagiosa. Necesitás movimiento." },
    "Cabra": { keywords: ["creatividad", "sensibilidad", "paz"], detail: "Tu Cabra aporta creatividad y sensibilidad. Tenés un ojo artístico natural." },
    "Mono": { keywords: ["ingenio", "versatilidad", "curiosidad"], detail: "Tu Mono aporta ingenio y versatilidad. Resolvés problemas con inteligencia rápida." },
    "Gallo": { keywords: ["puntualidad", "honestidad", "coraje"], detail: "Tu Gallo aporta honestidad y precisión. Decís las cosas como son." },
    "Perro": { keywords: ["lealtad", "honestidad", "protección"], detail: "Tu Perro aporta lealtad incondicional. Protegés a quienes te rodean." },
    "Cerdo": { keywords: ["generosidad", "compasión", "optimismo"], detail: "Tu Cerdo aporta generosidad y optimismo. Vivís con amplitud." },
  };

  const data = animalTraits[chineseZodiac] || { keywords: [], detail: `Tu ${chineseZodiac} aporta cualidades de ciclo que se conectan con tu identidad.` };

  return {
    system: "zodiaco-chino",
    systemLabel: "Zodiaco Chino",
    headline: `${chineseZodiac} de ${chineseElement}`,
    detail: data.detail,
    keywords: [...data.keywords, chineseElement],
    color: "var(--layer-moment)",
    icon: "🐉",
  };
}

// ── Análisis de convergencias y divergencias ──

function analyzeConvergences(profile: UserProfile, perspectives: SystemPerspective[]): ConvergencePoint[] {
  const convergences: ConvergencePoint[] = [];
  const element = typeof profile.element === "string" ? profile.element : "";
  const lp = safeNumber(profile.lifePath, 1);
  const chineseZodiac = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";

  // Elemento Fuego en astrología + números altos en numerología = iniciativa
  if (element === "Fuego" && lp >= 1 && lp <= 3) {
    convergences.push({
      theme: "Iniciativa y acción",
      systems: ["Numerología", "Astrología"],
      explanation: `Tu elemento Fuego en astrología y tu Camino de vida ${lp} en numerología coinciden en una energía orientada a la acción y el inicio.`,
    });
  }

  // Elemento Tierra + números 4, 6, 8 = estabilidad
  if (element === "Tierra" && (lp === 4 || lp === 6 || lp === 8)) {
    convergences.push({
      theme: "Estabilidad y construición",
      systems: ["Numerología", "Astrología"],
      explanation: `Tu elemento Tierra y tu Camino de vida ${lp} refuerzan una energía orientada a construir cosas duraderas.`,
    });
  }

  // Elemento Agua + números 2, 7 = intuición
  if (element === "Agua" && (lp === 2 || lp === 7)) {
    convergences.push({
      theme: "Profundidad e intuición",
      systems: ["Numerología", "Astrología"],
      explanation: `Tu elemento Agua y tu Camino de vida ${lp} crean una combinación de intuición profunda y percepción.`,
    });
  }

  // Rata/Dragón/Mono + números 1, 5, 7 = ingenio
  if (["Rata", "Dragón", "Mono"].includes(chineseZodiac) && [1, 5, 7].includes(lp)) {
    convergences.push({
      theme: "Ingenio y versatilidad",
      systems: ["Numerología", "Zodiaco Chino"],
      explanation: `Tu ${chineseZodiac} en el zodiaco chino y tu Camino de vida ${lp} convergen en una energía de ingenio y adaptabilidad.`,
    });
  }

  // Caballo/Tigre + fuego = energía pura
  if (["Caballo", "Tigre"].includes(chineseZodiac) && element === "Fuego") {
    convergences.push({
      theme: "Energía y dinamismo",
      systems: ["Astrología", "Zodiaco Chino"],
      explanation: `Tu ${chineseZodiac} y tu elemento Fuego se refuerzan mutuamente. Tu energía es especialmente dinámica.`,
    });
  }

  // Si no hay convergencias, crear una genérica
  if (convergences.length === 0) {
    convergences.push({
      theme: "Complementariedad",
      systems: ["Numerología", "Astrología", "Zodiaco Chino"],
      explanation: `Tus sistemas no coinciden directamente, pero se complementan. Cada uno aporta una perspectiva distinta de tu identidad.`,
    });
  }

  return convergences;
}

function analyzeDivergences(profile: UserProfile): DivergencePoint[] {
  const divergences: DivergencePoint[] = [];
  const element = typeof profile.element === "string" ? profile.element : "";
  const lp = safeNumber(profile.lifePath, 1);
  const chineseZodiac = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";

  // Fuego (astro) + 7 (numerología) = tensión entre acción e introspección
  if (element === "Fuego" && lp === 7) {
    divergences.push({
      theme: "Acción vs. Introspección",
      systemA: "Astrología",
      viewA: "Tu Fuego te impulsa a actuar y liderar.",
      systemB: "Numerología",
      viewB: "Tu 7 te invita a observar y analizar antes de actuar.",
      explanation: "Esta tensión es productiva: te permite actuar con reflexión.",
    });
  }

  // Tierra + 5 = estabilidad vs. cambio
  if (element === "Tierra" && lp === 5) {
    divergences.push({
      theme: "Estabilidad vs. Cambio",
      systemA: "Astrología",
      viewA: "Tu Tierra te busca estabilidad y raíces.",
      systemB: "Numerología",
      viewB: "Tu 5 te impulsa al cambio y la aventura.",
      explanation: "Podés usar la estabilidad como base para explorar.",
    });
  }

  // Agua + 1 = emoción vs. liderazgo
  if (element === "Agua" && lp === 1) {
    divergences.push({
      theme: "Emoción vs. Liderazgo",
      systemA: "Astrología",
      viewA: "Tu Agua te conecta con las emociones y la intuición.",
      systemB: "Numerología",
      viewB: "Tu 1 te posiciona como líder independiente.",
      explanation: "El liderazgo desde la emoción es una cualidad poderosa.",
    });
  }

  // Caballo (movimiento) + 4 (estabilidad)
  if (chineseZodiac === "Caballo" && lp === 4) {
    divergences.push({
      theme: "Movimiento vs. Construcción",
      systemA: "Zodiaco Chino",
      viewA: "Tu Caballo necesita libertad y movimiento.",
      systemB: "Numerología",
      viewB: "Tu 4 construye con disciplina y paciencia.",
      explanation: "Podés canalizar el movimiento del Caballo dentro de estructuras que construís con el 4.",
    });
  }

  // Si no hay divergencias marcadas
  if (divergences.length === 0) {
    divergences.push({
      theme: "Perspectivas complementarias",
      systemA: "Numerología",
      viewA: `Tu Camino de vida ${lp} describe tu energía central.`,
      systemB: "Astrología / Zodiaco Chino",
      viewB: "Otros sistemas aportan matices y dimensiones adicionales.",
      explanation: "Todos los sistemas aportan algo distinto. Ninguno tiene la verdad completa.",
    });
  }

  return divergences;
}

// ── Síntesis ──

function generateSynthesis(profile: UserProfile, perspectives: SystemPerspective[]): string {
  const name = typeof profile.name === "string" ? profile.name : "";
  const lp = safeNumber(profile.lifePath, 1);
  const element = typeof profile.element === "string" ? profile.element : "";
  const chineseZodiac = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";
  const archetype = ARCHETYPES[lp];

  return `${name} tiene un perfil que conecta ${getKeywordForLifePath(lp)} (numerología) con energía de ${element.toLowerCase()} (astrología) y las cualidades del ${chineseZodiac} (zodiaco chino). ${archetype?.description || ""} Estos tres sistemas ofrecen perspectivas distintas pero complementarias de quién sos.`;
}

function getKeywordForLifePath(n: number): string {
  const keywords: Record<number, string> = {
    1: "liderazgo", 2: "cooperación", 3: "creatividad", 4: "estabilidad",
    5: "libertad", 6: "responsabilidad", 7: "introspección", 8: "poder",
    9: "sabiduría", 11: "intuición", 22: "construcción", 33: "compasión",
  };
  return keywords[n] || "identidad";
}

// ── API pública ──

export function buildIdentityProfile(profile: UserProfile): IdentityProfile {
  const perspectives = [
    getNumerologyPerspective(profile),
    getAstrologyPerspective(profile),
    getChineseZodiacPerspective(profile),
  ];

  const convergences = analyzeConvergences(profile, perspectives);
  const divergences = analyzeDivergences(profile);
  const synthesis = generateSynthesis(profile, perspectives);

  return { perspectives, convergences, divergences, synthesis };
}
