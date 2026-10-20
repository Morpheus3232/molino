/**
 * Entity Story Engine — Builds narrative connections between user and entities.
 *
 * Uses animalRelations.ts as the sole source of truth for zodiac relationships.
 * Produces structured narrative data for "Sos X como Y" moments.
 */

import { relacionCon } from "@/lib/engines/personalMapEngine";
import { t } from "@/lib/i18n";
import type { UserProfile } from "@/types/user";
import { getPrimaryEvent } from "@/lib/data/entity-events";
import type { SymbolicEntity } from "@/lib/data/symbolic-entities";
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
    : { animal: "" as Animal, isApproximate: true };
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

  // Historical grounding — unique per entity thanks to event description + year.
  // Solo se usa en `explanation` (párrafo). `headline` se mantiene siempre
  // corto — antes insertaba el párrafo histórico entero acá también,
  // duplicando el mismo texto dos veces en la misma tarjeta.
  const eventDescription = primaryEvent?.description;
  const eventYear = primaryEvent?.year;
  const hasUniqueEvent = eventDescription && eventDescription !== primaryEvent?.label;

  // Cuatro casillas (CLAUDE.md): Liu He y Liu Hai son "resto del ciclo".
  let meaning: string;
  switch (relation.type) {
    case "same":
      headline = `Energía del ${entityDisplay.name}, como tu ${userDisplay.name}.`;
      subtitle = `Tu propio signo: comparte tu ${userDisplay.name}`;
      meaning = `Comparte tu propio signo, el ${entityDisplay.name}.`;
      isPositive = true;
      break;
    case "triad":
      headline = `${entity.name} es del signo de uno de tus dos amigos.`;
      subtitle = `Signo amigo (三合 San He): ${entityDisplay.name} y ${userDisplay.name} están a cuatro posiciones`;
      meaning = `El ${entityDisplay.name} es uno de los dos amigos de tu ${userDisplay.name}.`;
      isPositive = true;
      break;
    case "clash":
      headline = `${entity.name} es del signo de tu enemigo.`;
      subtitle = `Signo enemigo (六冲 Liu Chong): lo que conviene evitar`;
      meaning = `El ${entityDisplay.name} es el opuesto directo de tu ${userDisplay.name} en el ciclo: la relación que conviene evitar.`;
      isPositive = false;
      break;
    default:
      headline = `${entity.name} y tu ${userDisplay.name} recorren caminos independientes.`;
      subtitle = `Resto del ciclo: ni tu signo, ni tus amigos, ni tu enemigo`;
      meaning = `El ${entityDisplay.name} no es tu signo, ni uno de tus dos amigos, ni tu enemigo.`;
      isPositive = true;
  }

  // Explanation: historical context + relation meaning (unique per entity)
  const historicalContext = eventYear
    ? (hasUniqueEvent ? `${eventDescription} (${eventYear}).` : `${entity.name} quedó definida por ${primaryEvent?.label?.toLowerCase() || "su origen"} de ${eventYear}.`)
    : "";
  const explanation = historicalContext ? `${historicalContext} ${meaning}` : meaning;
  const shareText = `${userDisplay.name}: ${headline} Descubrí la tuya en Molino.`;
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/affinity/${entity.type}/${entity.id}`;

  return {
    userAnimal,
    entityAnimal,
    relationType: relation.type === "harmonious" || relation.type === "harm" ? "neutral" : relation.type,
    relationScore: relation.score,
    relationLabel: t.affinityTiers[relacionCon(userAnimal, entityAnimal)].label,
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
    case "same": return "#515151";
    case "triad": return "#515151";
    case "harmonious": return "#626262";
    case "neutral": return "#656565";
    case "clash": return "#606060";
    case "harm": return "#606060";
    default: return "#656565";
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
