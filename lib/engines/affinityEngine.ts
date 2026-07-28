/**
 * Symbolic Affinity Engine
 *
 * Calculates symbolic alignment between a user profile and any entity.
 * Based SOLELY on Chinese Zodiac animal comparison:
 *   - User's birth date → animal (real Chinese New Year boundary)
 *   - Entity's primary historical event → animal (real Chinese New Year boundary)
 *   - Documented traditional relationship between both animals
 *
 * Deterministic. No AI. No external APIs.
 * All interpretations are labeled as symbolic/traditional, not scientific.
 */

import type { UserProfile } from "@/types/user";
import type { SymbolicEntity, EntityType, HistoricalEvent } from "@/lib/data/symbolic-entities";
import { getPrimaryEvent, SYMBOLIC_ENTITIES } from "@/lib/data/symbolic-entities";
import { calculateAnimalFromDate } from "@/lib/engines/chineseZodiacEngine";
import { ANIMALS, getRelation, type Animal } from "@/lib/data/animalRelations";

// ════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════

export interface AffinityResult {
  entity: SymbolicEntity;
  /** The event used for the affinity calculation */
  primaryEvent: HistoricalEvent;
  /** Other historical events of the entity (for UI display) */
  otherEvents: HistoricalEvent[];
  userYear: number;
  userAnimal: string;
  entityYear: number;
  entityAnimal: string;
  score: number;           // 0–100
  tier: AffinityTier;
  relationship: string;    // "mismo animal", "opuestos", "tríada", etc.
  explanation: string;     // human-readable "why"
  tradition?: string;      // "Según la tradición..." context
  summary: string;
  disclaimer: string;
  methodNote: string;
  /** True if the entity animal was calculated from year-only (no exact date) */
  isApproximate: boolean;
}

export type AffinityTier =
  | "resonancia-alta"
  | "afinidad-media"
  | "complementarios"
  | "desafiante"
  | "distante";

export const TIER_META: Record<AffinityTier, { label: string; color: string; description: string }> = {
  "resonancia-alta":  { label: "Resonancia alta",       color: "#2D5A3D", description: "Patrones simbólicos fuertemente alineados" },
  "afinidad-media":   { label: "Afinidad media",        color: "#4A6FA5", description: "Conexión moderada con puntos de interés compartidos" },
  "complementarios":  { label: "Complementarios",       color: "#D4A843", description: "Diferentes pero que se enriquecen mutuamente" },
  "desafiante":       { label: "Desafiante",            color: "#B45309", description: "Tensión creativa que puede generar crecimiento" },
  "distante":         { label: "Frecuencias lejanas",   color: "#6B7280", description: "Baja resonancia simbólica, pero no excluyente" },
};

export function getTierForScore(score: number): AffinityTier {
  if (score >= 75) return "resonancia-alta";
  if (score >= 60) return "afinidad-media";
  if (score >= 45) return "complementarios";
  if (score >= 30) return "desafiante";
  return "distante";
}

// ════════════════════════════════════════════════════
// ZODIAC RELATIONSHIP
// ════════════════════════════════════════════════════

/** Get zodiac score from canonical animalRelations */
function getZodiacScore(userAnimal: string, entityAnimal: string): number {
  if (!userAnimal || !entityAnimal) return 50;
  return getRelation(userAnimal as Animal, entityAnimal as Animal).score;
}

/** Human-readable relationship label from canonical animalRelations */
function getRelationship(_diff: number, userAnimal: string, entityAnimal: string): string {
  if (!userAnimal || !entityAnimal) return "datos insuficientes";
  return getRelation(userAnimal as Animal, entityAnimal as Animal).label;
}

/** Detailed explanation of the relationship from canonical animalRelations */
function getExplanation(_diff: number, userAnimal: string, entityAnimal: string): string {
  if (!userAnimal || !entityAnimal) return "No hay datos suficientes para calcular la afinidad.";
  return getRelation(userAnimal as Animal, entityAnimal as Animal).description;
}

/** Traditional context for the relationship */
function getTradition(_diff: number, userAnimal: string, entityAnimal: string): string | undefined {
  if (!userAnimal || !entityAnimal) return undefined;
  const rel = getRelation(userAnimal as Animal, entityAnimal as Animal);
  if (rel.type === "triad") {
    return "Las trías San He agrupan animales por elemento oculto: Rata-Dragón-Mono (Agua), Buey-Serpiente-Gallo (Metal), Tigre-Caballo-Perro (Fuego), Gato-Cabra-Cerdo (Madera).";
  }
  if (rel.type === "harmonious") {
    return "Los pares Liu He (六合) son combinaciones armoniosas: Rata-Buey, Tigre-Gato, Dragón-Serpiente, Caballo-Cabra, Mono-Gallo, Perro-Cerdo.";
  }
  if (rel.type === "same") {
    return "Según la tradición, dos personas del mismo animal comparten fortalezas naturales pero también los mismos puntos ciegos.";
  }
  return undefined;
}

// ════════════════════════════════════════════════════
// EVENT ANIMAL RESOLUTION
// ════════════════════════════════════════════════════

function resolveEntityAnimal(entity: SymbolicEntity): { animal: string; isApproximate: boolean } {
  const primaryEvent = getPrimaryEvent(entity);
  return primaryEvent
    ? calculateAnimalFromDate(primaryEvent.date, primaryEvent.year)
    : calculateAnimalFromDate(undefined, entity.foundingYear);
}

// ════════════════════════════════════════════════════
// MAIN CALCULATION
// ════════════════════════════════════════════════════

export function calculateAffinity(
  profile: UserProfile,
  entity: SymbolicEntity,
): AffinityResult {
  const userAnimal = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";
  const userYear = parseInt(profile.birthDate?.split("-")[0] || "0", 10);

  // Resolve primary event
  const primaryEvent = getPrimaryEvent(entity);
  if (!primaryEvent) {
    return buildFallbackResult(profile, entity, "Entidad sin evento histórico primario.");
  }

  const { animal: entityAnimal, isApproximate } = resolveEntityAnimal(entity);

  // Other events (editorial only, never participate in score)
  const otherEvents = entity.events.filter(e => e.id !== primaryEvent.id);

  const ui = ANIMALS.indexOf(userAnimal as Animal);
  const ei = ANIMALS.indexOf(entityAnimal as Animal);

  // Default score if data is missing
  let score = 50;
  let diff = -1;
  let relationship = "datos insuficientes";
  let explanation = "No hay datos suficientes para calcular la afinidad.";
  let tradition: string | undefined;

  if (ui !== -1 && ei !== -1) {
    diff = Math.abs(ui - ei) % 12;
    score = getZodiacScore(userAnimal, entityAnimal);
    relationship = getRelationship(diff, userAnimal, entityAnimal);
    explanation = getExplanation(diff, userAnimal, entityAnimal);
    tradition = getTradition(diff, userAnimal, entityAnimal);
  }

  const tier = getTierForScore(score);
  const tierMeta = TIER_META[tier];

  // Build event date description
  const eventDateStr = primaryEvent.date
    ? formatEventDate(primaryEvent.date)
    : `circa ${primaryEvent.year}`;

  const summary = `${entity.name} tiene una ${tierMeta.label.toLowerCase()} con tu perfil simbólico. Tu animal es ${userAnimal || "—"} y el de ${entity.name} (según ${primaryEvent.label.toLowerCase()}) es ${entityAnimal || "—"}.`;

  return {
    entity,
    primaryEvent: { ...primaryEvent, calculatedAnimal: entityAnimal, isApproximate },
    otherEvents,
    userYear,
    userAnimal,
    entityYear: primaryEvent.year,
    entityAnimal,
    score,
    tier,
    relationship,
    explanation,
    tradition,
    summary,
    disclaimer: "Molino es una plataforma educativa y de entretenimiento. Estas interpretaciones pertenecen al ámbito de los sistemas simbólicos y no constituyen predicción científica, diagnóstico ni asesoramiento profesional. Cada persona puede interpretar estos sistemas de forma diferente.",
    methodNote: `Cálculo: comparación directa entre el animal del zodíaco chino de tu año de nacimiento (${userYear}) y el del evento "${primaryEvent.label}" de ${entity.name} (${eventDateStr}). Basado en la relación documentada entre animales en el ciclo de 12 años.${isApproximate ? " Nota: el año de la entidad fue calculado con aproximación (sin fecha exacta)." : ""}`,
    isApproximate,
  };
}

/** Build a safe fallback result when data is insufficient */
function buildFallbackResult(
  profile: UserProfile,
  entity: SymbolicEntity,
  reason: string,
): AffinityResult {
  const userAnimal = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";
  const userYear = parseInt(profile.birthDate?.split("-")[0] || "0", 10);
  const fallbackEvent: HistoricalEvent = {
    id: "fallback",
    type: "fecha-tradicional",
    label: "Sin evento definido",
    year: entity.foundingYear,
    description: reason,
    source: "Sistema",
    confidence: "baja",
    primaryForAffinity: true,
  };

  return {
    entity,
    primaryEvent: fallbackEvent,
    otherEvents: entity.events,
    userYear,
    userAnimal,
    entityYear: entity.foundingYear,
    entityAnimal: "",
    score: 0,
    tier: "distante",
    relationship: "datos insuficientes",
    explanation: reason,
    summary: `No se pudo calcular la afinidad con ${entity.name}: ${reason}`,
    disclaimer: "Molino es una plataforma educativa y de entretenimiento. Estas interpretaciones pertenecen al ámbito de los sistemas simbólicos y no constituyen predicción científica, diagnóstico ni asesoramiento profesional.",
    methodNote: `Cálculo no realizado: ${reason}`,
    isApproximate: true,
  };
}

/** Format an ISO date string to a readable format */
function formatEventDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const monthIdx = parseInt(month, 10) - 1;
  return `${parseInt(day, 10)} de ${months[monthIdx]} de ${year}`;
}

// ════════════════════════════════════════════════════
// ANIMAL-VERSUS-ANIMAL COMPARISON
// ════════════════════════════════════════════════════

export interface AnimalComparison {
  animalA: string;
  animalB: string;
  score: number;
  tier: AffinityTier;
  relationship: string;
  explanation: string;
  tradition?: string;
}

/**
 * Calculate the symbolic relationship between two Chinese zodiac animals.
 * Used for entity-vs-entity comparison (not user-vs-entity).
 */
export function calculateAnimalComparison(animalA: string, animalB: string): AnimalComparison {
  const ui = ANIMALS.indexOf(animalA as Animal);
  const ei = ANIMALS.indexOf(animalB as Animal);

  if (ui === -1 || ei === -1) {
    return {
      animalA,
      animalB,
      score: 50,
      tier: "distante",
      relationship: "datos insuficientes",
      explanation: "No se pudo determinar la relación entre ambos animales.",
    };
  }

  const diff = Math.abs(ui - ei) % 12;
  const score = getZodiacScore(animalA, animalB);
  const tier = getTierForScore(score);
  const relationship = getRelationship(diff, animalA, animalB);
  const explanation = getExplanation(diff, animalA, animalB);
  const tradition = getTradition(diff, animalA, animalB);

  return { animalA, animalB, score, tier, relationship, explanation, tradition };
}

// ════════════════════════════════════════════════════
// BULK CALCULATIONS
// ════════════════════════════════════════════════════

/** Calculate affinity for all entities of a given type, sorted by score */
export function calculateAllAffinity(
  profile: UserProfile,
  entities: SymbolicEntity[],
): AffinityResult[] {
  return entities
    .map(entity => calculateAffinity(profile, entity))
    .sort((a, b) => b.score - a.score);
}

/** Get top affinity highlight per category for the profile summary */
export type AffinityHighlightType = "brand" | "city" | "country";

export function getTopAffinityHighlights(profile: UserProfile): AffinityResult[] {
  const highlightTypes: AffinityHighlightType[] = ["brand", "city", "country"];
  return highlightTypes
    .map((type) => {
      const entities = SYMBOLIC_ENTITIES.filter((e) => e.type === type);
      if (entities.length === 0) return null;
      return calculateAllAffinity(profile, entities)[0];
    })
    .filter((r): r is AffinityResult => r !== null);
}

/** Compare two entities side by side */
export interface ComparisonResult {
  entityA: AffinityResult;
  entityB: AffinityResult;
}

export function compareEntities(
  profile: UserProfile,
  entityA: SymbolicEntity,
  entityB: SymbolicEntity,
): ComparisonResult {
  return {
    entityA: calculateAffinity(profile, entityA),
    entityB: calculateAffinity(profile, entityB),
  };
}
