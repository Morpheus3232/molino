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
import { getPrimaryEvent, resolveEventAnimal, SYMBOLIC_ENTITIES } from "@/lib/data/symbolic-entities";
import { calculateAnimalFromDate } from "@/lib/engines/chineseZodiacEngine";

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

const ANIMALS = ["Rata", "Buey", "Tigre", "Conejo", "Dragón", "Serpiente", "Caballo", "Cabra", "Mono", "Gallo", "Perro", "Cerdo"];

/** Score table based on traditional Chinese zodiac relationships */
const ZODIAC_SCORES: Record<number, number> = {
  0: 85,   // mismo animal
  1: 80,   // Liu He (六合) — harmonía
  2: 50,   // neutral
  3: 40,   // tensión
  4: 75,   // San He (三合) — tríada
  5: 35,   // daño (害)
  6: 90,   // Si Hai (四害) — opuestos complementarios
  7: 35,   // daño (害)
  8: 40,   // tensión
  9: 50,   // neutral
  10: 80,  // Liu He (六合) — harmonía
  11: 50,  // neutral
};

/** Human-readable relationship label */
function getRelationship(diff: number, userAnimal: string, entityAnimal: string): string {
  if (diff === 0) return "mismo animal";
  if (diff === 6) return "opuestos complementarios";
  if (diff === 4 || diff === 8) return "tríada compatible";
  if (diff === 1 || diff === 10) return "armonía natural";
  if (diff === 5 || diff === 7) return "relación desafiante";
  if (diff === 3 || diff === 9) return "tensión creativa";
  return "energías independientes";
}

/** Detailed explanation of the relationship */
function getExplanation(diff: number, userAnimal: string, entityAnimal: string): string {
  if (diff === 0) {
    return `Ambos nacieron en un año de ${userAnimal}. Según la tradición china, compartir el mismo animal indica una energía base similar: fortalezas parecidas y desafíos parejos.`;
  }
  if (diff === 6) {
    return `${userAnimal} y ${entityAnimal} son opuestos en el ciclo del zodíaco chino. La tradición dice que los opuestos se atraen: cada uno tiene lo que el otro necesita.`;
  }
  if (diff === 4 || diff === 8) {
    return `${userAnimal} y ${entityAnimal} pertenecen a la misma tríada (San He). Comparten un elemento oculto y una sintonía natural.`;
  }
  if (diff === 1 || diff === 10) {
    return `${userAnimal} y ${entityAnimal} forman una pareja armoniosa (Liu He). Se complementan de forma natural.`;
  }
  if (diff === 5 || diff === 7) {
    return `${userAnimal} y ${entityAnimal} tienen una relación desafiante. No es negativa, pero requiere conciencia y adaptación mutua.`;
  }
  if (diff === 3 || diff === 9) {
    return `La tensión entre ${userAnimal} y ${entityAnimal} puede generar crecimiento. Son diferentes, pero esa diferencia puede ser productiva.`;
  }
  return `${userAnimal} y ${entityAnimal} tienen energías independientes. No hay una conexión fuerte en el ciclo, pero tampoco conflicto.`;
}

/** Traditional context for the relationship */
function getTradition(diff: number, userAnimal: string, entityAnimal: string): string | undefined {
  if (diff === 0) {
    return "Según la tradición, dos personas del mismo animal comparten fortalezas naturales pero también los mismos puntos ciegos.";
  }
  if (diff === 6) {
    return "Los opuestos en el zodíaco chino (Si Hai) representan la tensión más productiva del ciclo: polaridades que se completan.";
  }
  if (diff === 4 || diff === 8) {
    return "Las trías San He agrupan animales por elemento oculto: Rata-Dragón-Mono (Agua), Buey-Serpiente-Gallo (Metal), Tigre-Caballo-Perro (Fuego), Conejo-Cabra-Cerdo (Madera).";
  }
  if (diff === 1 || diff === 10) {
    return "Los pares Liu He (六合) son combinaciones armoniosas: Rata-Buey, Tigre-Conejo, Dragón-Serpiente, Caballo-Cabra, Mono-Gallo, Perro-Cerdo.";
  }
  return undefined;
}

// ════════════════════════════════════════════════════
// EVENT ANIMAL RESOLUTION
// ════════════════════════════════════════════════════

/**
 * Resolve the Chinese zodiac animal for a historical event.
 * Uses real Chinese New Year dates when available (1886-2040).
 * Falls back to year-only calculation for dates outside the table.
 */
function resolveEntityAnimal(event: HistoricalEvent): { animal: string; isApproximate: boolean } {
  return calculateAnimalFromDate(event.date, event.year);
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

  // Resolve entity animal from the primary event's date
  const { animal: entityAnimal, isApproximate } = resolveEntityAnimal(primaryEvent);

  // Other events (editorial only, never participate in score)
  const otherEvents = entity.events.filter(e => e.id !== primaryEvent.id);

  const ui = ANIMALS.indexOf(userAnimal);
  const ei = ANIMALS.indexOf(entityAnimal);

  // Default score if data is missing
  let score = 50;
  let diff = -1;
  let relationship = "datos insuficientes";
  let explanation = "No hay datos suficientes para calcular la afinidad.";
  let tradition: string | undefined;

  if (ui !== -1 && ei !== -1) {
    diff = Math.abs(ui - ei) % 12;
    score = ZODIAC_SCORES[diff] ?? 50;
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
  const ui = ANIMALS.indexOf(animalA);
  const ei = ANIMALS.indexOf(animalB);

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
  const score = ZODIAC_SCORES[diff] ?? 50;
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
