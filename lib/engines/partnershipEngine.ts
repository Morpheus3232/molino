/**
 * Partnership Compatibility Engine (Modo Sociedad)
 *
 * Misma base de cálculo que coupleEngine.ts (computeRawCompatibility) —
 * numerología, astrología occidental y zodíaco chino — pero con una
 * lectura orientada a sociedades, equipos y vínculos empleador/empleado
 * en vez de pareja romántica. No asume géneros ni orientación: es la
 * misma matemática, aplicada a cualquier par de personas que quieran ver
 * cómo se complementan trabajando juntas.
 */

import type { UserProfile } from "@/types/user";
import { ARCHETYPES } from "@/lib/data";
import { computeRawCompatibility, type CoupleConnectionPoint, type CoupleChallengePoint } from "./coupleEngine";

export interface PartnershipCompatibilityResult {
  score: number;
  level: string;
  summary: string;
  connections: CoupleConnectionPoint[];
  challenges: CoupleChallengePoint[];
  workingAdvice: string;
  profileA: UserProfile;
  profileB: UserProfile;
}

export function calculatePartnershipCompatibility(
  profileA: UserProfile,
  profileB: UserProfile
): PartnershipCompatibilityResult {
  const {
    lifePathA,
    lifePathB,
    animalA,
    animalB,
    sunSignA,
    sunSignB,
    elemA,
    elemB,
    zodiacRelation,
    numerologyScore,
    astroScore,
    elemSynergy,
    score,
    level,
  } = computeRawCompatibility(profileA, profileB);

  const connections: CoupleConnectionPoint[] = [];

  if (lifePathA === lifePathB) {
    const arch = ARCHETYPES[lifePathA];
    connections.push({
      id: "lp-same",
      title: `Comparten el Número de Vida ${lifePathA}`,
      description: `Ambos operan desde el arquetipo de "${arch?.name || "El Caminante"}" — un mismo propósito central que facilita entenderse rápido en decisiones de fondo.`,
      system: "numerology",
      score: 100,
    });
  } else if (numerologyScore >= 75) {
    connections.push({
      id: "lp-harmony",
      title: `Caminos de Vida en Armonía (${lifePathA} y ${lifePathB})`,
      description: `La energía del ${lifePathA} (${ARCHETYPES[lifePathA]?.name}) y la del ${lifePathB} (${ARCHETYPES[lifePathB]?.name}) se complementan bien a la hora de repartir roles.`,
      system: "numerology",
      score: numerologyScore,
    });
  }

  if (astroScore >= 75) {
    connections.push({
      id: "astro-harmony",
      title: `Signos solares compatibles: ${sunSignA} + ${sunSignB}`,
      description: `La combinación solar entre ${sunSignA} y ${sunSignB} favorece el entendimiento mutuo y una buena dinámica de trabajo.`,
      system: "astrology",
      score: astroScore,
    });
  }

  connections.push({
    id: "element-synergy",
    title: elemSynergy.title,
    description: elemSynergy.desc,
    system: "elements",
  });

  if (zodiacRelation.type === "triad" || zodiacRelation.type === "harmonious" || zodiacRelation.type === "same") {
    connections.push({
      id: "chinese-alliance",
      title: `Alianza en el Zodíaco Chino: ${animalA} y ${animalB}`,
      description: zodiacRelation.description || `Relación tradicional de ${zodiacRelation.label}.`,
      system: "chinese",
      score: zodiacRelation.score,
    });
  }

  const challenges: CoupleChallengePoint[] = [];

  if (zodiacRelation.type === "clash" || zodiacRelation.type === "harm") {
    challenges.push({
      id: "chinese-contrast",
      area: "Ritmos de Trabajo",
      description: `En el zodíaco chino, ${animalA} y ${animalB} presentan una relación de ${zodiacRelation.label}.`,
      recommendation: "Definir procesos y responsabilidades explícitas por escrito, en vez de asumir que el otro opera igual.",
    });
  }

  if (elemSynergy.type === "tension") {
    challenges.push({
      id: "elem-friction",
      area: "Toma de Decisiones",
      description: `El elemento ${elemA} y el ${elemB} procesan los desacuerdos desde perspectivas opuestas.`,
      recommendation: "Establecer un método claro de decisión (quién decide qué) para no depender de ceder terreno caso a caso.",
    });
  } else if (lifePathA !== lifePathB && numerologyScore < 60) {
    challenges.push({
      id: "lp-friction",
      area: "Prioridades y Estilo de Gestión",
      description: `Los caminos ${lifePathA} y ${lifePathB} pueden tener enfoques distintos respecto al ritmo de las decisiones.`,
      recommendation: "Acordar por escrito cómo se toman las decisiones importantes y respetar la autonomía de cada rol.",
    });
  }

  if (challenges.length === 0) {
    challenges.push({
      id: "comfort-zone",
      area: "Evolución del Vínculo de Trabajo",
      description: "La alta afinidad natural puede tentar a posponer conversaciones difíciles por evitar la fricción.",
      recommendation: "Reservar una revisión periódica del vínculo laboral/societario, aunque las cosas vengan bien.",
    });
  }

  let workingAdvice: string;
  if (score >= 80) {
    workingAdvice = "La mayor fortaleza de este vínculo es la confianza y la complementariedad natural. Aprovechen eso para delegar sin necesidad de supervisar cada paso.";
  } else if (score >= 65) {
    workingAdvice = "Tienen una base sólida donde las diferencias enriquecen la mirada del otro. El consejo es formalizar acuerdos por escrito antes de que una diferencia de criterio se vuelva un conflicto.";
  } else {
    workingAdvice = "Este vínculo funciona mejor con roles y límites bien definidos desde el principio — la claridad en las reglas del juego compensa la falta de afinidad natural.";
  }

  const nameA = profileA.name?.trim() || "Persona A";
  const nameB = profileB.name?.trim() || "Persona B";
  const summary = `La combinación entre ${nameA} (${ARCHETYPES[lifePathA]?.name}, ${sunSignA}) y ${nameB} (${ARCHETYPES[lifePathB]?.name}, ${sunSignB}) da una afinidad de trabajo del ${score}% con perfil de ${level.toLowerCase()}.`;

  return {
    score,
    level,
    summary,
    connections,
    challenges,
    workingAdvice,
    profileA,
    profileB,
  };
}
