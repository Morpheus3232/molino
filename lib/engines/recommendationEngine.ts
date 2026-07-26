/**
 * Symbolic Recommendation Engine
 *
 * Multidimensional scoring:
 *   50% — Natal relationship (user vs entity)
 *   30% — Temporal relationship (year vs entity)
 *   20% — Year resonance bonus (user vs year)
 *
 * NO predictions. Cultural/symbolic reading only.
 */

import type { UserProfile } from "@/types/user";
import type { SymbolicEntity, EntityType } from "@/lib/data/symbolic-entities";
import { getPrimaryEvent } from "@/lib/data/symbolic-entities";
import { calculateAnimalFromDate } from "@/lib/engines/chineseZodiacEngine";
import {
  getRelation,
  getAnimalProfile,
  type Animal,
  type RelationType,
} from "@/lib/data/animalRelations";
import {
  getCurrentYearAnimal,
  resolveYearCycle,
  calculateYearResonance,
  type YearCycle,
  type YearResonance,
} from "@/lib/engines/yearCycleEngine";

// ════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════

export type RecommendationCategory =
  | "triple-resonance"
  | "recommended"
  | "compatible"
  | "strategic";

export type RecommendationLevel = "high" | "medium" | "neutral" | "attention";

export interface SymbolicRecommendation {
  level: RecommendationLevel;
  score: number;
  relationType: RelationType;
  explanation: string;
  priority: number;
}

export interface Recommendation {
  entity: SymbolicEntity;
  userAnimal: Animal;
  entityAnimal: Animal;
  yearAnimal: Animal;
  natalRelation: RelationType;
  temporalRelation: RelationType;
  totalScore: number;
  category: RecommendationCategory;
  priority: number;
  title: string;
  explanation: string;
  actionSuggestion: string;
  isTripleResonance: boolean;
}

export interface SymbolicMap {
  userAnimal: Animal;
  userYear: number;
  yearAnimal: Animal;
  yearCycle: YearCycle;
  yearResonance: YearResonance;
  recommendations: Recommendation[];
  byCategory: Record<RecommendationCategory, Recommendation[]>;
  stats: {
    total: number;
    tripleResonance: number;
    recommended: number;
    compatible: number;
    strategic: number;
  };
}

// ════════════════════════════════════════════════════
// SCORING — Uses getRelation().score from animalRelations.ts
// ════════════════════════════════════════════════════

const LEVEL_PRIORITY: Record<RecommendationLevel, number> = {
  high: 5,
  medium: 4,
  neutral: 3,
  attention: 2,
};

// ════════════════════════════════════════════════════
// PHASE 2: calculateSymbolicRecommendation
// ════════════════════════════════════════════════════

/**
 * Calculate a symbolic recommendation between user and entity.
 * Pure function — no side effects.
 */
export function calculateSymbolicRecommendation(
  userAnimal: Animal,
  entityAnimal: Animal,
  currentYearAnimal: Animal,
): SymbolicRecommendation {
  const natalRelation = getRelation(userAnimal, entityAnimal);
  const temporalRelation = getRelation(currentYearAnimal, entityAnimal);
  const yearResonance = calculateYearResonance(userAnimal, currentYearAnimal);

  // Determine level
  let level: RecommendationLevel;
  if (natalRelation.type === "same") {
    level = "high";
  } else if (natalRelation.type === "triad" || natalRelation.type === "harmonious") {
    level = "high";
  } else if (natalRelation.type === "clash" || natalRelation.type === "harm") {
    level = "attention";
  } else if (temporalRelation.type === "triad" || temporalRelation.type === "harmonious") {
    level = "medium";
  } else {
    level = "neutral";
  }

  // Score: 50% natal + 30% temporal + 20% year bonus
  const natalScore = natalRelation.score;
  const temporalScore = temporalRelation.score;
  const yearBonus = yearResonance.score;
  const score = Math.round(natalScore * 0.5 + temporalScore * 0.3 + yearBonus * 0.2);

  const priority = LEVEL_PRIORITY[level];

  const explanation = buildExplanation(
    userAnimal, entityAnimal, currentYearAnimal,
    natalRelation.type, temporalRelation.type, level,
  );

  return {
    level,
    score,
    relationType: natalRelation.type,
    explanation,
    priority,
  };
}

// ════════════════════════════════════════════════════
// PHASE 3: Multidimensional ranking
// ════════════════════════════════════════════════════

/**
 * Build the complete symbolic map for a user profile.
 * Uses 50/30/20 scoring weights.
 */
export function buildSymbolicMap(profile: UserProfile): SymbolicMap {
  const userAnimal = (profile.chineseZodiac ?? "") as Animal;
  const userYear = parseInt(profile.birthDate?.split("-")[0] || "0", 10);
  const { animal: yearAnimal } = getCurrentYearAnimal();
  const yearCycle = resolveYearCycle(userAnimal);
  const yearResonance = calculateYearResonance(userAnimal, yearAnimal);

  const recommendations = SYMBOLIC_ENTITIES.map(entity =>
    buildRecommendation(userAnimal, userYear, entity, yearAnimal, yearResonance)
  ).sort((a, b) => b.totalScore - a.totalScore);

  const byCategory: Record<RecommendationCategory, Recommendation[]> = {
    "triple-resonance": [],
    recommended: [],
    compatible: [],
    strategic: [],
  };

  for (const rec of recommendations) {
    byCategory[rec.category].push(rec);
  }

  return {
    userAnimal,
    userYear,
    yearAnimal,
    yearCycle,
    yearResonance,
    recommendations,
    byCategory,
    stats: {
      total: recommendations.length,
      tripleResonance: byCategory["triple-resonance"].length,
      recommended: byCategory.recommended.length,
      compatible: byCategory.compatible.length,
      strategic: byCategory.strategic.length,
    },
  };
}

/**
 * Build a single recommendation for one entity.
 * Uses 50/30/20 scoring.
 */
function buildRecommendation(
  userAnimal: Animal,
  userYear: number,
  entity: SymbolicEntity,
  yearAnimal: Animal,
  yearResonance: YearResonance,
): Recommendation {
  const event = getPrimaryEvent(entity);
  const { animal: entityAnimal } = calculateAnimalFromDate(event?.date, event?.year) as { animal: Animal };

  // Symbolic recommendation
  const symbolic = calculateSymbolicRecommendation(userAnimal, entityAnimal, yearAnimal);

  // Triple resonance
  const isTripleResonance = userAnimal === entityAnimal && entityAnimal === yearAnimal;

  // Category
  const category = categorizeRecommendation(
    symbolic.relationType,
    isTripleResonance,
    symbolic.score,
  );

  // Copy
  const { title, explanation, actionSuggestion } = buildCopy(
    userAnimal, entityAnimal, yearAnimal,
    symbolic.relationType, isTripleResonance, entity.name,
  );

  return {
    entity,
    userAnimal,
    entityAnimal,
    yearAnimal,
    natalRelation: symbolic.relationType,
    temporalRelation: getRelation(yearAnimal, entityAnimal).type,
    totalScore: symbolic.score,
    category,
    priority: symbolic.priority,
    title,
    explanation,
    actionSuggestion,
    isTripleResonance,
  };
}

// ════════════════════════════════════════════════════
// CATEGORIZATION
// ════════════════════════════════════════════════════

function categorizeRecommendation(
  natalType: RelationType,
  isTriple: boolean,
  score: number,
): RecommendationCategory {
  if (isTriple) return "triple-resonance";
  if (natalType === "same" || natalType === "triad" || natalType === "harmonious") {
    return "recommended";
  }
  if (natalType === "clash" || natalType === "harm") {
    return "strategic";
  }
  return "compatible";
}

// ════════════════════════════════════════════════════
// EXPLANATIONS
// ════════════════════════════════════════════════════

function buildExplanation(
  user: Animal,
  entity: Animal,
  year: Animal,
  natalType: RelationType,
  temporalType: RelationType,
  level: RecommendationLevel,
): string {
  const profile = getAnimalProfile(entity);
  const natalRel = getRelation(user, entity);

  if (level === "high") {
    if (natalType === "same") {
      return `${entity} comparte tu mismo signo. Energía de sintonía natural según la tradición.`;
    }
    if (natalType === "triad") {
      return `${entity} pertenece al círculo de apoyo tradicional de ${user}. Tríada compatible.`;
    }
    if (natalType === "harmonious") {
      return `${entity} es la pareja armoniosa natural de ${user} según la tradición (Liu He).`;
    }
  }

  if (level === "attention") {
    if (natalType === "clash") {
      return `${entity} representa una relación de mayor adaptación simbólica para ${user}.`;
    }
    if (natalType === "harm") {
      return `${entity} tiene una relación de atención con ${user} según la tradición (Liu Hai).`;
    }
  }

  if (level === "medium") {
    return `${entity} tiene una buena relación temporal con el ciclo actual.`;
  }

  return `${entity} y ${user} no tienen una relación especial. Energías independientes.`;
}

function buildCopy(
  userAnimal: Animal,
  entityAnimal: Animal,
  yearAnimal: Animal,
  natalType: RelationType,
  isTriple: boolean,
  entityName: string,
): { title: string; explanation: string; actionSuggestion: string } {
  if (isTriple) {
    return {
      title: "Resonancia triple",
      explanation: `Tu signo, ${entityName} y el ciclo actual comparten la misma energía simbólica.`,
      actionSuggestion: `Puede ser un buen momento para conectar con ${entityName}.`,
    };
  }

  switch (natalType) {
    case "same":
      return {
        title: "Alta resonancia simbólica",
        explanation: `${entityName} comparte tu mismo animal. Según la tradición, una energía similar genera sintonía natural.`,
        actionSuggestion: `${entityName} puede ser una referencia alineada con tu energía simbólica.`,
      };
    case "triad":
      return {
        title: "Tríada compatible",
        explanation: `${userAnimal} y ${entityAnimal} pertenecen a la misma tríada (San He). Comparten un elemento oculto.`,
        actionSuggestion: `Una relación que la tradición presenta como favorable.`,
      };
    case "harmonious":
      return {
        title: "Armonía natural",
        explanation: `${userAnimal} y ${entityAnimal} forman una pareja armoniosa (Liu He).`,
        actionSuggestion: `${entityName} tiene una energía que se complementa con la tuya.`,
      };
    case "clash":
      return {
        title: "Contraste simbólico",
        explanation: `${userAnimal} y ${entityAnimal} son opuestos en el ciclo (Liu Chong). Requiere más consciencia.`,
        actionSuggestion: `La tradición sugiere actuar con estrategia y mayor reflexión.`,
      };
    case "harm":
      return {
        title: "Atención simbólica",
        explanation: `${userAnimal} y ${entityAnimal} tienen una relación de mayor atención (Liu Hai).`,
        actionSuggestion: `La tradición recomienda planificación y cuidado.`,
      };
    default:
      return {
        title: "Energías independientes",
        explanation: `${userAnimal} y ${entityAnimal} no tienen una relación especial en el ciclo.`,
        actionSuggestion: `Sin interferencias simbólicas — la decisión es completamente libre.`,
      };
  }
}

// ════════════════════════════════════════════════════
// IMPORTS & EXPORTS
// ════════════════════════════════════════════════════

import { SYMBOLIC_ENTITIES } from "@/lib/data/symbolic-entities";

/**
 * Get recommendations filtered by entity type, sorted by score.
 */
export function getRecommendationsByType(
  profile: UserProfile,
  entityType: EntityType,
  limit = 10,
): Recommendation[] {
  const map = buildSymbolicMap(profile);
  return map.recommendations
    .filter(r => r.entity.type === entityType)
    .slice(0, limit);
}
