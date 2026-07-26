/**
 * Personal Recommendation Engine
 *
 * Multidimensional scoring for personalized recommendations:
 *   60% — Natal affinity (user vs entity animal)
 *   25% — Temporal affinity (current year vs entity)
 *   15% — Contextual bonus (year resonance)
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
  calculateYearResonance,
  type YearResonance,
} from "@/lib/engines/yearCycleEngine";

// ════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════

export type PriorityLevel = 5 | 4 | 3 | 2 | 1;

export interface PersonalRecommendation {
  entity: SymbolicEntity;
  userAnimal: Animal;
  entityAnimal: Animal;
  yearAnimal: Animal;
  natalRelation: RelationType;
  natalScore: number;
  temporalScore: number;
  elementScore: number;
  numerologyScore: number;
  totalScore: number;
  priority: PriorityLevel;
  priorityLabel: string;
  explanation: string;
  category: EntityType;
}

export interface PersonalRecommendationMap {
  userAnimal: Animal;
  userYear: number;
  yearAnimal: Animal;
  yearResonance: YearResonance;
  recommendations: PersonalRecommendation[];
  byPriority: Record<PriorityLevel, PersonalRecommendation[]>;
  byCategory: Record<EntityType, PersonalRecommendation[]>;
  stats: {
    total: number;
    maxAffinity: number;
    highAffinity: number;
    neutral: number;
    contrast: number;
  };
}

// ════════════════════════════════════════════════════
// SCORING — Uses getRelation().score from animalRelations.ts
// ════════════════════════════════════════════════════

const PRIORITY_META: Record<PriorityLevel, { label: string; stars: string }> = {
  5: { label: "Máxima afinidad",       stars: "★★★★★" },
  4: { label: "Afinidad favorable",     stars: "★★★★☆" },
  3: { label: "Neutral",                stars: "★★★☆☆" },
  2: { label: "Mayor contraste",        stars: "★★☆☆☆" },
  1: { label: "Energía desafiante",     stars: "★☆☆☆☆" },
};

// ════════════════════════════════════════════════════
// MAIN ENGINE
// ════════════════════════════════════════════════════

/**
 * Build the complete personal recommendation map.
 */
export function buildPersonalRecommendations(profile: UserProfile): PersonalRecommendationMap {
  const userAnimal = (profile.chineseZodiac ?? "") as Animal;
  const userYear = parseInt(profile.birthDate?.split("-")[0] || "0", 10);
  const { animal: yearAnimal } = getCurrentYearAnimal();
  const yearResonance = calculateYearResonance(userAnimal, yearAnimal);

  const recommendations = SYMBOLIC_ENTITIES.map(entity =>
    calculatePersonalRecommendation(
      userAnimal, userYear, entity, yearAnimal, yearResonance,
      profile.chineseZodiacInfo?.element, profile.lifePath,
    )
  ).sort((a, b) => b.totalScore - a.totalScore);

  // Group by priority
  const byPriority: Record<PriorityLevel, PersonalRecommendation[]> = {
    5: [], 4: [], 3: [], 2: [], 1: [],
  };
  for (const rec of recommendations) {
    byPriority[rec.priority].push(rec);
  }

  // Group by category
  const byCategory: Record<string, PersonalRecommendation[]> = {};
  for (const rec of recommendations) {
    if (!byCategory[rec.category]) byCategory[rec.category] = [];
    byCategory[rec.category].push(rec);
  }

  const stats = {
    total: recommendations.length,
    maxAffinity: byPriority[5].length,
    highAffinity: byPriority[4].length,
    neutral: byPriority[3].length,
    contrast: byPriority[2].length + byPriority[1].length,
  };

  return {
    userAnimal,
    userYear,
    yearAnimal,
    yearResonance,
    recommendations,
    byPriority,
    byCategory: byCategory as Record<EntityType, PersonalRecommendation[]>,
    stats,
  };
}

/**
 * Calculate a single personal recommendation.
 * Score: 40% natal + 30% temporal + 20% element + 10% numerology
 */
function calculatePersonalRecommendation(
  userAnimal: Animal,
  userYear: number,
  entity: SymbolicEntity,
  yearAnimal: Animal,
  yearResonance: YearResonance,
  userElement?: string,
  lifePath?: number,
): PersonalRecommendation {
  const event = getPrimaryEvent(entity);
  const { animal: entityAnimal } = calculateAnimalFromDate(event?.date, event?.year) as { animal: Animal };

  // Natal: user vs entity
  const natalRelation = getRelation(userAnimal, entityAnimal);
  const natalScore = natalRelation.score;

  // Temporal: year vs entity
  const temporalRelation = getRelation(yearAnimal, entityAnimal);
  const temporalScore = temporalRelation.score;

  // Element bonus: same element = +10
  const entityElement = getElementFromAnimal(entityAnimal);
  const elementBonus = (userElement && entityElement && userElement === entityElement) ? 10 : 0;
  const elementScore = 50 + elementBonus;

  // Numerology bonus: life path resonance
  const numerologyBonus = getNumerologyBonus(lifePath, entity.type);
  const numerologyScore = 50 + numerologyBonus;

  // Total: 40/30/20/10
  const totalScore = Math.round(
    natalScore * 0.4 +
    temporalScore * 0.3 +
    elementScore * 0.2 +
    numerologyScore * 0.1
  );

  // Priority
  const priority = scoreToPriority(totalScore);
  const priorityLabel = PRIORITY_META[priority].label;

  // Explanation
  const explanation = buildExplanation(userAnimal, entityAnimal, natalRelation.type, entity.name);

  return {
    entity,
    userAnimal,
    entityAnimal,
    yearAnimal,
    natalRelation: natalRelation.type,
    natalScore,
    temporalScore,
    elementScore,
    numerologyScore,
    totalScore,
    priority,
    priorityLabel,
    explanation,
    category: entity.type,
  };
}

// ════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════

function scoreToPriority(score: number): PriorityLevel {
  if (score >= 85) return 5;
  if (score >= 70) return 4;
  if (score >= 45) return 3;
  if (score >= 30) return 2;
  return 1;
}

/** Get element from animal (simplified mapping) */
function getElementFromAnimal(animal: string): string | null {
  const elementMap: Record<string, string> = {
    Rata: "Agua", Dragón: "Agua", Mono: "Agua",
    Buey: "Metal", Serpiente: "Metal", Gallo: "Metal",
    Tigre: "Fuego", Caballo: "Fuego", Perro: "Fuego",
    Gato: "Madera", Cabra: "Madera", Cerdo: "Madera",
  };
  return elementMap[animal] ?? null;
}

/** Numerology bonus based on life path and entity type */
function getNumerologyBonus(lifePath: number | undefined, entityType: string): number {
  if (!lifePath) return 0;
  // Life paths 1, 3, 5, 7, 9 resonate more with creative/expressive entities
  // Life paths 2, 4, 6, 8 resonate more with stable/structured entities
  const creativePaths = [1, 3, 5, 7, 9];
  const stablePaths = [2, 4, 6, 8];
  const creativeTypes = ["movie", "artist", "city"];
  const stableTypes = ["brand", "country", "university", "team"];

  if (creativePaths.includes(lifePath) && creativeTypes.includes(entityType)) return 5;
  if (stablePaths.includes(lifePath) && stableTypes.includes(entityType)) return 5;
  return 0;
}

function buildExplanation(
  user: Animal,
  entity: Animal,
  natalType: RelationType,
  entityName: string,
): string {
  switch (natalType) {
    case "same":
      return `${entityName} comparte tu misma energía base.`;
    case "triad":
      return `${entityName} conecta con tu perfil a través de una relación simbólica secundaria.`;
    case "harmonious":
      return `${entityName} es una energía complementaria según la tradición.`;
    case "clash":
      return `${entityName} es una energía opuesta a la tuya.`;
    case "harm":
      return `${entityName} tiene una relación de mayor atención según la tradición.`;
    default:
      return `${entityName} y ${user} no tienen una relación especial.`;
  }
}

// ════════════════════════════════════════════════════
// IMPORTS
// ════════════════════════════════════════════════════

import { SYMBOLIC_ENTITIES } from "@/lib/data/symbolic-entities";

/**
 * Get recommendations filtered by category.
 */
export function getRecommendationsByCategory(
  profile: UserProfile,
  category: EntityType,
  limit = 10,
): PersonalRecommendation[] {
  const map = buildPersonalRecommendations(profile);
  return (map.byCategory[category] ?? []).slice(0, limit);
}
