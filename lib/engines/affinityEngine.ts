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
import { getPrimaryEvent } from "@/lib/data/entity-events";
import { calculateAnimalFromDate } from "@/lib/engines/chineseZodiacEngine";
import { ANIMALS, SAN_HE_TRIADS, getRelation, type Animal } from "@/lib/data/animalRelations";
import { relacionCon, type MapRelation } from "@/lib/engines/personalMapEngine";
import { t } from "@/lib/i18n";

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
  relationship: string;    // "tu propio signo", "signo amigo", "signo enemigo", "resto del ciclo"
  explanation: string;     // human-readable "why"
  tradition?: string;      // "Según la tradición..." context
  summary: string;
  disclaimer: string;
  methodNote: string;
  /** True if the entity animal was calculated from year-only (no exact date) */
  isApproximate: boolean;
}

/**
 * Las cuatro casillas del ciclo: tu propio signo, tus dos amigos (San He), tu
 * enemigo (Liu Chong) y el resto. Salen del TIPO de relación, no de un
 * puntaje: Liu He y Liu Hai caen en "otro" (CLAUDE.md).
 */
export type AffinityTier = MapRelation;

// Colores por tier: token de diseño, no depende del locale — por eso vive
// acá y no en el diccionario (lib/i18n solo tiene label/description).
const AFFINITY_TIER_COLORS: Record<AffinityTier, string> = {
  // Hex y no var(): varios call sites arman el fondo con `${color}15`.
  mismo: "#0A0A0A",
  amigo: "#0A0A0A",
  enemigo: "#474747",
  otro: "#474747",
};

// Copy vive en lib/i18n (transcreable por idioma); el engine combina texto +
// color para no romper los call sites existentes (TIER_META[tier].label/.color/.description).
export const TIER_META: Record<AffinityTier, { label: string; color: string; description: string }> = Object.fromEntries(
  (Object.keys(AFFINITY_TIER_COLORS) as AffinityTier[]).map((tier) => [
    tier,
    { ...t.affinityTiers[tier], color: AFFINITY_TIER_COLORS[tier] },
  ])
) as Record<AffinityTier, { label: string; color: string; description: string }>;

/** Casilla de `entityAnimal` vista desde `userAnimal`. Sin datos, "otro". */
export function getTier(userAnimal: string, entityAnimal: string): AffinityTier {
  return userAnimal && entityAnimal ? relacionCon(userAnimal, entityAnimal) : "otro";
}

// ════════════════════════════════════════════════════
// ZODIAC RELATIONSHIP
// ════════════════════════════════════════════════════

/** Get zodiac score from canonical animalRelations */
function getZodiacScore(userAnimal: string, entityAnimal: string): number {
  if (!userAnimal || !entityAnimal) return 50;
  return getRelation(userAnimal as Animal, entityAnimal as Animal).score;
}

/** Nombre de la casilla, en minúscula para usarlo dentro de una frase. */
function getRelationship(_diff: number, userAnimal: string, entityAnimal: string): string {
  if (!userAnimal || !entityAnimal) return "datos insuficientes";
  return TIER_META[getTier(userAnimal, entityAnimal)].label.toLowerCase();
}

/**
 * Detailed explanation of the relationship, naming the entity.
 *
 * Composes a unique explanation by combining:
 * 1. The entity's historical grounding (event label + year)
 * 2. The relational meaning (specific to this animal pair)
 *
 * Never uses generic template phrases like "comparte tu energía".
 * The historical part ensures every entity reads as distinct, even when
 * two entities share the same animal relation type.
 */
function getExplanation(
  _diff: number,
  userAnimal: string,
  entityAnimal: string,
  entityName?: string,
  primaryEvent?: HistoricalEvent
): string {
  if (!userAnimal || !entityAnimal) return "No hay datos suficientes para calcular la afinidad.";

  if (!entityName) {
    return getRelation(userAnimal as Animal, entityAnimal as Animal).description;
  }

  const rel = getRelation(userAnimal as Animal, entityAnimal as Animal);

  // Historical grounding — unique per entity thanks to event year + description
  const eventYear = primaryEvent?.year;
  const eventLabel = primaryEvent?.label?.toLowerCase() || "evento histórico";
  const eventDescription = primaryEvent?.description;

  const hasUniqueEvent = eventDescription && eventDescription !== primaryEvent?.label;

  // Build the historical context (unique per entity)
  const historicalContext = eventYear
    ? (hasUniqueEvent
      ? `${eventDescription} (${eventYear}).`
      : `${entityName} quedó definida por ${eventLabel} de ${eventYear}.`)
    : "";

  // Build the relational meaning (specific to this pair)
  let relationalMeaning: string;
  switch (rel.type) {
    case "same":
      relationalMeaning = `Comparte tu propio signo, el ${entityAnimal}.`;
      break;
    case "triad": {
      const triad = SAN_HE_TRIADS.find(t => t.animals.includes(userAnimal as Animal) && t.animals.includes(entityAnimal as Animal));
      relationalMeaning = `El ${entityAnimal} es uno de los dos amigos de tu ${userAnimal} (三合 San He${triad ? `, elemento ${triad.element}` : ""}).`;
      break;
    }
    case "clash":
      relationalMeaning = `El ${entityAnimal} es el enemigo de tu ${userAnimal}: su opuesto directo en el ciclo (六冲 Liu Chong). Es la relación que conviene evitar.`;
      break;
    default:
      relationalMeaning = `El ${entityAnimal} no es tu signo, ni uno de tus dos amigos, ni tu enemigo: queda en el resto del ciclo.`;
      break;
  }

  return historicalContext
    ? `${historicalContext} ${relationalMeaning}`
    : relationalMeaning;
}

/** Traditional context for the relationship */
function getTradition(_diff: number, userAnimal: string, entityAnimal: string): string | undefined {
  if (!userAnimal || !entityAnimal) return undefined;
  const rel = getRelation(userAnimal as Animal, entityAnimal as Animal);
  if (rel.type === "triad") {
    return "Los doce signos se agrupan en cuatro triángulos de amigos (三合 San He), separados por cuatro posiciones: Rata-Dragón-Mono (Agua), Buey-Serpiente-Gallo (Metal), Tigre-Caballo-Perro (Fuego), Gato-Cabra-Cerdo (Madera).";
  }
  if (rel.type === "clash") {
    return "Cada signo tiene un solo enemigo (六冲 Liu Chong): el que está a seis posiciones, en la otra punta del ciclo. Es la relación de más tensión, no una condena.";
  }
  if (rel.type === "same") {
    return "Según la tradición, dos del mismo signo comparten fortalezas naturales pero también los mismos puntos ciegos.";
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
    : { animal: "", isApproximate: true };
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
  return calculateAffinityForAnimal(userAnimal, userYear, entity);
}

/**
 * Same calculation as calculateAffinity, but takes the user's Chinese zodiac
 * animal directly instead of a full UserProfile — for contexts (like the
 * /affinity animal switcher) where the user is exploring affinity for an
 * animal that isn't necessarily their own. Same rule, same scores, no new
 * formula: this is calculateAffinity with its two inputs (userAnimal,
 * userYear) exposed instead of read off a profile.
 */
export function calculateAffinityForAnimal(
  userAnimal: string,
  userYear: number,
  entity: SymbolicEntity,
): AffinityResult {
  // Resolve primary event
  const primaryEvent = getPrimaryEvent(entity);
  if (!primaryEvent) {
    return buildFallbackResult(userAnimal, userYear, entity, "Entidad sin evento histórico primario.");
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
    explanation = getExplanation(diff, userAnimal, entityAnimal, entity.name, primaryEvent);
    tradition = getTradition(diff, userAnimal, entityAnimal);
  }

  const tier = getTier(userAnimal, entityAnimal);

  // Build event date description
  const eventDateStr = primaryEvent.date
    ? formatEventDate(primaryEvent.date)
    : String(primaryEvent.year);

  const summary = `Tu signo es ${userAnimal || "—"} y el de ${entity.name} (según ${primaryEvent.label.toLowerCase()}) es ${entityAnimal || "—"}: ${relationship}.`;

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
    summary,
    tradition,
    disclaimer: "Molino es una plataforma educativa y de entretenimiento. Estas interpretaciones pertenecen al ámbito de los sistemas simbólicos y no constituyen predicción científica, diagnóstico ni asesoramiento profesional.",
    methodNote: `Cálculo: comparación directa entre el signo del zodíaco chino de tu fecha de nacimiento (${userYear}) y el del evento "${primaryEvent.label}" de ${entity.name} (${eventDateStr}). Signo contra signo: mismo signo, amigos (三合 San He), enemigo (六冲 Liu Chong) o resto del ciclo.${isApproximate ? " Nota: el cálculo utiliza el año documentado en fuentes históricas." : ""}`,
    isApproximate,
  };
}

/** Build a safe fallback result when data is insufficient */
function buildFallbackResult(
  userAnimal: string,
  userYear: number,
  entity: SymbolicEntity,
  reason: string,
): AffinityResult {
  const fallbackEvent: HistoricalEvent = {
    id: "fallback",
    type: "fecha-tradicional",
    label: "Sin evento definido",
    year: getPrimaryEvent(entity)?.year ?? 0,
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
    entityYear: getPrimaryEvent(entity)?.year ?? 0,
    entityAnimal: "",
    score: 0,
    tier: "otro",
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
      tier: "otro",
      relationship: "datos insuficientes",
      explanation: "No se pudo determinar la relación entre ambos animales.",
    };
  }

  const diff = Math.abs(ui - ei) % 12;
  const score = getZodiacScore(animalA, animalB);
  const tier = getTier(animalA, animalB);
  // Entre dos entidades no hay "tu": la relación se nombra en tercera persona.
  const { relationship, explanation } = {
    mismo: { relationship: "mismo signo", explanation: `Las dos son ${animalA}: comparten casilla en el ciclo de doce.` },
    amigo: { relationship: "amigos", explanation: `${animalA} y ${animalB} son amigos: están a cuatro posiciones en el ciclo (三合 San He).` },
    enemigo: { relationship: "enemigos", explanation: `${animalA} y ${animalB} son enemigos: opuestos directos en el ciclo (六冲 Liu Chong).` },
    otro: { relationship: "sin relación especial", explanation: `${animalA} y ${animalB} no son amigos ni enemigos: el ciclo no los relaciona.` },
  }[tier];
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

/** Same as calculateAllAffinity, for a raw animal instead of a full profile. */
export function calculateAllAffinityForAnimal(
  animal: string,
  entities: SymbolicEntity[],
): AffinityResult[] {
  return entities
    .map(entity => calculateAffinityForAnimal(animal, 0, entity))
    .sort((a, b) => b.score - a.score);
}

export interface RepresentativeAffinitySet {
  positive: AffinityResult[];
  mixed: AffinityResult[];
  negative: AffinityResult[];
}

/**
 * Picks 8 representative results out of an already-scored, already-sorted
 * set: the top 5 (positivas), 2 from the middle of what's left (mixtas), and
 * the single lowest-scored one (negativa). Pure selection over existing
 * scores — no new scoring rule, no change to what calculateAffinity(...)
 * returns for any entity.
 */
export function getRepresentativeAffinitySet(
  sortedResults: AffinityResult[],
): RepresentativeAffinitySet {
  if (sortedResults.length < 8) {
    return { positive: sortedResults, mixed: [], negative: [] };
  }
  const positive = sortedResults.slice(0, 5);
  const negative = sortedResults.slice(-1);
  const remaining = sortedResults.slice(5, -1);
  const midStart = Math.max(0, Math.floor(remaining.length / 2) - 1);
  const mixed = remaining.slice(midStart, midStart + 2);
  return { positive, mixed, negative };
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
