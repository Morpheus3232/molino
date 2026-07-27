/**
 * Entity Story Engine — Builds narrative connections between user and entities.
 *
 * Uses animalRelations.ts as the sole source of truth for zodiac relationships.
 * Produces structured narrative data for "Sos X como Y" moments.
 */

import type { UserProfile } from "@/types/user";
import { getPrimaryEvent, type SymbolicEntity } from "@/lib/data/symbolic-entities";
import { getRelation, type Animal, type RelationType } from "@/lib/data/animalRelations";
import { calculateAnimalFromDate } from "@/lib/engines/chineseZodiacEngine";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";

export interface EntityConnectionStory {
  /** User's zodiac animal */
  userAnimal: Animal;
  /** Entity's zodiac animal */
  entityAnimal: Animal;
  /** Relationship type from animalRelations */
  relationType: RelationType;
  /** Score from animalRelations */
  relationScore: number;
  /** Human-readable relationship label */
  relationLabel: string;
  /** Headline for the story */
  headline: string;
  /** Subtitle / context */
  subtitle: string;
  /** Explanation of the connection */
  explanation: string;
  /** Share text optimized for social */
  shareText: string;
  /** Share URL */
  shareUrl: string;
  /** Whether this is a positive or contrasting relationship */
  isPositive: boolean;
}

/**
 * Build the "Sos X como Y" connection story.
 * Uses animalRelations.ts for all relationship data.
 */
export function buildEntityConnectionStory(
  profile: UserProfile,
  entity: SymbolicEntity,
): EntityConnectionStory | null {
  const userAnimal = (profile.chineseZodiac ?? "") as Animal;
  if (!userAnimal) return null;

  const primaryEvent = getPrimaryEvent(entity);
  const entityAnimalResult = primaryEvent
    ? calculateAnimalFromDate(primaryEvent.date, primaryEvent.year)
    : calculateAnimalFromDate(undefined, entity.foundingYear);
  const entityAnimal = (entityAnimalResult?.animal ?? "") as Animal;
  if (!entityAnimal) return null;

  // Get relationship from animalRelations.ts — THE source of truth
  const relation = getRelation(userAnimal, entityAnimal);

  // Build narrative based on relationship type
  const userDisplay = getZodiacDisplay(userAnimal);
  const entityDisplay = getZodiacDisplay(entityAnimal);

  let headline: string;
  let subtitle: string;
  let isPositive: boolean;

  switch (relation.type) {
    case "same":
      headline = `${entity.name} nació bajo la energía del ${entityDisplay.name}`;
      subtitle = `Compartís el mismo animal zodiacal: ${entityDisplay.name}`;
      isPositive = true;
      break;
    case "triad":
      headline = `${entity.name} y vos comparten una energía especial`;
      subtitle = `${userDisplay.name} y ${entityDisplay.name} comparten un elemento oculto`;
      isPositive = true;
      break;
    case "harmonious":
      headline = `${entity.name} es una conexión armoniosa con tu energía`;
      subtitle = `${userDisplay.name} y ${entityDisplay.name} se complementan naturalmente`;
      isPositive = true;
      break;
    case "neutral":
      headline = `Tu energía y la de ${entity.name} son independientes`;
      subtitle = `${userDisplay.name} y ${entityDisplay.name} no tienen una relación especial`;
      isPositive = true;
      break;
    case "clash":
      headline = `${entity.name} es una energía opuesta a la tuya`;
      subtitle = `${userDisplay.name} y ${entityDisplay.name} son opuestos en el ciclo`;
      isPositive = false;
      break;
    case "harm":
      headline = `${entity.name} es una energía que requiere atención`;
      subtitle = `${userDisplay.name} y ${entityDisplay.name} tienen una tensión según la tradición`;
      isPositive = false;
      break;
    default:
      headline = `Tu conexión con ${entity.name}`;
      subtitle = `Según el zodíaco chino`;
      isPositive = true;
  }

  const explanation = relation.description;
  const shareText = `${userDisplay.name}: ${headline}. ${relation.score}/100 de resonancia simbólica. Descubrí la tuya en Molino.`;
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/affinity/${entity.type}/${entity.id}`;

  return {
    userAnimal,
    entityAnimal,
    relationType: relation.type,
    relationScore: relation.score,
    relationLabel: relation.label,
    headline,
    subtitle,
    explanation,
    shareText,
    shareUrl,
    isPositive,
  };
}

/**
 * Get relationship color based on relation type.
 */
export function getRelationColor(relationType: RelationType): string {
  switch (relationType) {
    case "same": return "#2D5A3D";
    case "triad": return "#2D5A3D";
    case "harmonious": return "#4A6FA5";
    case "neutral": return "#6B7280";
    case "clash": return "#B45309";
    case "harm": return "#B45309";
    default: return "#6B7280";
  }
}

/**
 * Get relationship icon based on relation type.
 */
export function getRelationIcon(relationType: RelationType): string {
  switch (relationType) {
    case "same": return "✦";
    case "triad": return "△";
    case "harmonious": return "∽";
    case "neutral": return "○";
    case "clash": return "⚡";
    case "harm": return "⚠";
    default: return "○";
  }
}
