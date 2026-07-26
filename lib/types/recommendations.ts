/**
 * Future Recommendation Entity — Interface for future recommendation expansion.
 *
 * Prepared for connecting:
 *   - Brands (Apple, Nike, Coca-Cola, etc.)
 *   - Countries (Argentina, Brasil, etc.)
 *   - Cities (Buenos Aires, Tokio, etc.)
 *   - Hotels, restaurants, products
 *   - Historical figures
 *
 * This interface is NOT yet consumed by any engine.
 * It's a contract for future development.
 */

import type { Animal } from "@/lib/data/animalRelations";
import type { EntityType } from "@/lib/data/symbolic-entities";

export interface FutureRecommendationEntity {
  /** Display name */
  name: string;
  /** Entity type */
  type: EntityType;
  /** Chinese zodiac animal */
  animal: Animal;
  /** Country (if applicable) */
  country?: string;
  /** City (if applicable) */
  city?: string;
  /** Symbolic score for a given user animal */
  score: number;
  /** Relation type from animalRelations */
  relationType: "same" | "triad" | "harmonious" | "neutral" | "clash" | "harm";
  /** Why this entity is recommended */
  reason: string;
  /** Optional emoji for display */
  emoji?: string;
  /** Confidence level */
  confidence: "exacta" | "alta" | "media" | "baja";
}

/**
 * Future use: convert a SymbolicEntity + recommendation
 * into a FutureRecommendationEntity.
 *
 * Example:
 *   const entity = getEntityById("apple");
 *   const rec = calculateSymbolicRecommendation("Caballo", "Dragón", "Caballo");
 *   const future = toFutureRecommendation(entity, rec);
 */
export function toFutureRecommendation(
  entity: { name: string; type: EntityType; emoji?: string; country?: string },
  animal: Animal,
  score: number,
  relationType: FutureRecommendationEntity["relationType"],
  reason: string,
  confidence: FutureRecommendationEntity["confidence"] = "media",
): FutureRecommendationEntity {
  return {
    name: entity.name,
    type: entity.type,
    animal,
    country: entity.country,
    score,
    relationType,
    reason,
    emoji: entity.emoji,
    confidence,
  };
}
