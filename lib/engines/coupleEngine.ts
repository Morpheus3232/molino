/**
 * Couple Compatibility Engine (Modo Pareja)
 *
 * Calculates deterministic multi-system compatibility between two maps:
 * - Numerology Life Path (25%)
 * - Western Astrology Sun Signs & Elements (35%)
 * - Chinese Zodiac Animal Relationships (40%)
 *
 * All interpretations are derived from canonical symbolic rules and traditions.
 */

import type { UserProfile } from "@/types/user";
import { safeNumber } from "@/lib/utils/score";
import { getRelation, type Animal } from "@/lib/data/animalRelations";
import { calculateNumerologyCompatibility } from "@/lib/engines/numerologyEngine";
import { getElement } from "@/lib/engines/astrologyEngine";
import { ARCHETYPES } from "@/lib/data";

export interface CoupleConnectionPoint {
  id: string;
  title: string;
  description: string;
  system: "numerology" | "astrology" | "chinese" | "elements";
  score?: number;
}

export interface CoupleChallengePoint {
  id: string;
  area: string;
  description: string;
  recommendation: string;
}

export interface CoupleCompatibilityResult {
  score: number;
  level: string;
  summary: string;
  connections: CoupleConnectionPoint[];
  challenges: CoupleChallengePoint[];
  dailyAdvice: string;
  profileA: UserProfile;
  profileB: UserProfile;
}

const ELEMENT_SYNERGY: Record<
  string,
  Record<string, { type: "harmony" | "complementary" | "tension"; title: string; desc: string }>
> = {
  Fuego: {
    Fuego: {
      type: "harmony",
      title: "Doble Fuego: Pasión & Dinamismo",
      desc: "Ambos comparten entusiasmo, iniciativa y alta energía. La clave es turnarse para liderar y no competir.",
    },
    Aire: {
      type: "harmony",
      title: "Fuego + Aire: Expansión & Estímulo",
      desc: "El aire alimenta las llamas: las ideas de uno encienden la motivación del otro con fluidez natural.",
    },
    Tierra: {
      type: "complementary",
      title: "Fuego + Tierra: Visión & Estructura",
      desc: "El fuego aporta impulso e inspiración mientras la tierra brinda solidez y concreción práctica.",
    },
    Agua: {
      type: "tension",
      title: "Fuego + Agua: Intensidad & Sensibilidad",
      desc: "Polaridad entre la acción directa y la profundidad emocional. Requiere escucha activa y respeto de ritmos.",
    },
  },
  Tierra: {
    Tierra: {
      type: "harmony",
      title: "Doble Tierra: Estabilidad & Compromiso",
      desc: "Vínculo sólido, confiable y orientado a construir proyectos duraderos con paciencia y lealtad.",
    },
    Agua: {
      type: "harmony",
      title: "Tierra + Agua: Nutrición & Fecundidad",
      desc: "El agua suaviza la tierra y la tierra contiene al agua: una unión fértil de contención y afecto.",
    },
    Fuego: {
      type: "complementary",
      title: "Tierra + Fuego: Realismo & Impulso",
      desc: "Equilibrio entre prudencia y arrojo; logran materializar objetivos ambiciosos cuando se coordinan.",
    },
    Aire: {
      type: "tension",
      title: "Tierra + Aire: Materia & Pensamiento",
      desc: "Contraste entre lo tangible y lo abstracto. Aprender a valorar tanto la teoría como la ejecución es esencial.",
    },
  },
  Aire: {
    Aire: {
      type: "harmony",
      title: "Doble Aire: Conexión Mental & Libertad",
      desc: "Diálogo constante, complicidad intelectual y mutuo respeto por los espacios individuales.",
    },
    Fuego: {
      type: "harmony",
      title: "Aire + Fuego: Inspiración Compartida",
      desc: "Creatividad viva y curiosidad compartida. Generan proyectos estimulantes y viajes mentales y físicos.",
    },
    Agua: {
      type: "complementary",
      title: "Aire + Agua: Razón & Sentimiento",
      desc: "El aire aporta perspectiva lógica mientras el agua aporta empatía e intuición profunda.",
    },
    Tierra: {
      type: "tension",
      title: "Aire + Tierra: Ideas & Realidad",
      desc: "Uno vuela alto en conceptos mientras el otro busca certeza. Complementarios cuando hay paciencia.",
    },
  },
  Agua: {
    Agua: {
      type: "harmony",
      title: "Doble Agua: Profundidad Emocional & Telepatía",
      desc: "Sensibilidad intuitiva compartida. Se entienden sin necesidad de palabras, creando un refugio íntimo.",
    },
    Tierra: {
      type: "harmony",
      title: "Agua + Tierra: Seguridad & Refugio",
      desc: "La estabilidad de la tierra le da paz al agua, y la calidez del agua llena de vida a la tierra.",
    },
    Aire: {
      type: "complementary",
      title: "Agua + Aire: Intuición & Comunicación",
      desc: "Fusión de inteligencia emocional y claridad mental cuando logran traducir lo que sienten en palabras.",
    },
    Fuego: {
      type: "tension",
      title: "Agua + Fuego: Transformación Alquímica",
      desc: "Fuerzas magnéticas pero opuestas. La calidez del encuentro puede ser transformadora si no se apagan mutuamente.",
    },
  },
};

const ASTRO_COMPAT: Record<string, Record<string, number>> = {
  Aries: { Leo: 92, Sagitario: 88, Géminis: 78, Acuario: 75, Libra: 82, Aries: 70 },
  Tauro: { Virgo: 92, Capricornio: 88, Cáncer: 80, Piscis: 78, Escorpio: 84, Tauro: 72 },
  Géminis: { Libra: 92, Acuario: 88, Aries: 80, Leo: 76, Sagitario: 82, Géminis: 70 },
  Cáncer: { Escorpio: 94, Piscis: 90, Tauro: 82, Virgo: 78, Capricornio: 84, Cáncer: 74 },
  Leo: { Aries: 92, Sagitario: 90, Géminis: 78, Libra: 78, Acuario: 85, Leo: 70 },
  Virgo: { Tauro: 92, Capricornio: 90, Cáncer: 80, Escorpio: 80, Piscis: 84, Virgo: 72 },
  Libra: { Géminis: 92, Acuario: 90, Leo: 80, Sagitario: 80, Aries: 82, Libra: 72 },
  Escorpio: { Cáncer: 94, Piscis: 92, Virgo: 80, Capricornio: 80, Tauro: 84, Escorpio: 74 },
  Sagitario: { Aries: 90, Leo: 90, Libra: 80, Acuario: 80, Géminis: 82, Sagitario: 72 },
  Capricornio: { Tauro: 90, Virgo: 90, Escorpio: 80, Piscis: 80, Cáncer: 84, Capricornio: 74 },
  Acuario: { Géminis: 90, Libra: 90, Aries: 78, Sagitario: 80, Leo: 85, Acuario: 72 },
  Piscis: { Cáncer: 92, Escorpio: 92, Tauro: 82, Capricornio: 80, Virgo: 84, Piscis: 74 },
};

export function calculateCoupleCompatibility(
  profileA: UserProfile,
  profileB: UserProfile
): CoupleCompatibilityResult {
  const lifePathA = safeNumber(profileA.lifePath, 1);
  const lifePathB = safeNumber(profileB.lifePath, 1);

  const animalA = (profileA.chineseZodiac || "Rata") as Animal;
  const animalB = (profileB.chineseZodiac || "Rata") as Animal;

  const sunSignA = profileA.sunSign || "Aries";
  const sunSignB = profileB.sunSign || "Aries";

  const elemA = profileA.sunSignInfo?.element || getElement(sunSignA) || "Fuego";
  const elemB = profileB.sunSignInfo?.element || getElement(sunSignB) || "Fuego";

  // 1. Chinese Zodiac relation
  const zodiacRelation = getRelation(animalA, animalB);
  const zodiacScore = zodiacRelation.score;

  // 2. Numerology compatibility
  const numerologyScore = calculateNumerologyCompatibility(lifePathA, lifePathB);

  // 3. Western Astrology compatibility
  const astroScore = ASTRO_COMPAT[sunSignA]?.[sunSignB] || (elemA === elemB ? 75 : 65);

  // Weighted overall score
  const score = Math.round(zodiacScore * 0.4 + astroScore * 0.35 + numerologyScore * 0.25);

  // Level classification
  let level = "Conexión de Aprendizaje & Contraste";
  if (score >= 85) level = "Sinergia Excepcional & Fuerte Resonancia";
  else if (score >= 72) level = "Alta Afinidad & Armonía Natural";
  else if (score >= 58) level = "Complementariedad Dinámica";

  // Connections (Points of connection)
  const connections: CoupleConnectionPoint[] = [];

  // Life Path connection
  if (lifePathA === lifePathB) {
    const arch = ARCHETYPES[lifePathA];
    connections.push({
      id: "lp-same",
      title: `Comparten el Número de Vida ${lifePathA}`,
      description: `Ambos vibran en el arquetipo de "${arch?.name || "El Caminante"}". Comparten el mismo propósito central y una visión de vida afín.`,
      system: "numerology",
      score: 100,
    });
  } else if (numerologyScore >= 75) {
    connections.push({
      id: "lp-harmony",
      title: `Caminos de Vida en Armonía (${lifePathA} y ${lifePathB})`,
      description: `La energía del ${lifePathA} (${ARCHETYPES[lifePathA]?.name}) y la del ${lifePathB} (${ARCHETYPES[lifePathB]?.name}) se complementan con fluidez.`,
      system: "numerology",
      score: numerologyScore,
    });
  }

  // Astrology connection
  if (astroScore >= 75) {
    connections.push({
      id: "astro-harmony",
      title: `Signos solares compatibles: ${sunSignA} + ${sunSignB}`,
      description: `La combinación solar entre ${sunSignA} y ${sunSignB} favorece el entendimiento mutuo y la atracción natural.`,
      system: "astrology",
      score: astroScore,
    });
  }

  // Elements synergy
  const elemSynergy = ELEMENT_SYNERGY[elemA]?.[elemB] || {
    type: "complementary",
    title: `Química Elemental: ${elemA} y ${elemB}`,
    desc: `Combinación de energías de ${elemA} y ${elemB} que aporta variedad a la relación.`,
  };
  connections.push({
    id: "element-synergy",
    title: elemSynergy.title,
    description: elemSynergy.desc,
    system: "elements",
  });

  // Chinese Zodiac connection
  if (zodiacRelation.type === "triad" || zodiacRelation.type === "harmonious" || zodiacRelation.type === "same") {
    connections.push({
      id: "chinese-alliance",
      title: `Alianza en el Zodíaco Chino: ${animalA} y ${animalB}`,
      description: zodiacRelation.description || `Relación tradicional de ${zodiacRelation.label}.`,
      system: "chinese",
      score: zodiacRelation.score,
    });
  }

  // Challenges (Puntos de fricción)
  const challenges: CoupleChallengePoint[] = [];

  if (zodiacRelation.type === "clash" || zodiacRelation.type === "harm") {
    challenges.push({
      id: "chinese-contrast",
      area: "Dinámica y Ritmos",
      description: `En el zodíaco chino, ${animalA} y ${animalB} presentan una relación de ${zodiacRelation.label}.`,
      recommendation: "Evitar dar por sentado las intenciones del otro y dialogar abiertamente ante diferencias de ritmo.",
    });
  }

  if (elemSynergy.type === "tension") {
    challenges.push({
      id: "elem-friction",
      area: "Manejo de Emociones & Comunicación",
      description: `El elemento ${elemA} y el ${elemB} procesan los conflictos desde perspectivas opuestas.`,
      recommendation: "Dar espacio para que cada uno exprese su punto de vista sin imponer la velocidad de resolución.",
    });
  } else if (lifePathA !== lifePathB && numerologyScore < 60) {
    challenges.push({
      id: "lp-friction",
      area: "Prioridades y Estilo de Vida",
      description: `Los caminos ${lifePathA} y ${lifePathB} pueden tener enfoques distintos respecto al ritmo de toma de decisiones.`,
      recommendation: "Acordar acuerdos explícitos en proyectos compartidos y respetar la autonomía individual.",
    });
  }

  // Fallback challenge if none found
  if (challenges.length === 0) {
    challenges.push({
      id: "comfort-zone",
      area: "Evolución y Creatividad",
      description: "La alta armonía natural puede tentar a la pareja a caer en una zona de confort cómoda.",
      recommendation: "Introducir nuevos desafíos compartidos, viajes o proyectos creativos para mantener viva la chispa.",
    });
  }

  // Dynamic daily/context advice
  let dailyAdvice = "";
  if (score >= 80) {
    dailyAdvice = `Su mayor fortaleza radica en la complicidad y el apoyo mutuo. Aprovechen hoy para conversar sobre proyectos a mediano plazo o compartir un momento de desconexión juntos.`;
  } else if (score >= 65) {
    dailyAdvice = `Tienen una base sólida donde las diferencias enriquecen la mirada del otro. El consejo de hoy es validar las ideas de tu pareja antes de sugerir alternativas.`;
  } else {
    dailyAdvice = `Este vínculo es un acelerador de autoconocimiento. La clave no es coincidir en todo, sino convertir cada contraste en una oportunidad de entendimiento sincero.`;
  }

  // Summary
  const nameA = profileA.name?.trim() || "Persona A";
  const nameB = profileB.name?.trim() || "Persona B";
  const summary = `La combinación entre ${nameA} (${ARCHETYPES[lifePathA]?.name}, ${sunSignA}) y ${nameB} (${ARCHETYPES[lifePathB]?.name}, ${sunSignB}) genera una compatibilidad del ${score}% con perfil de ${level.toLowerCase()}.`;

  return {
    score,
    level,
    summary,
    connections,
    challenges,
    dailyAdvice,
    profileA,
    profileB,
  };
}
