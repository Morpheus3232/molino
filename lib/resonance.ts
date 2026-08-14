/**
 * Resonance classification — Chinese Zodiac relationship buckets for the Atlas.
 *
 * Turns the canonical relation types (lib/data/animalRelations) into the
 * three logical buckets the Atlas surfaces:
 *   - AFFINE (armonía): same animal, San He triad, or Liu He harmonious pair.
 *   - TENSION (desafío): direct opposition (Liu Chong clash) or Liu Hai harm.
 *   - NEUTRAL: everything else.
 *
 * Purely algorithmic over the existing engine — no DB, no trackers, no LLM.
 * Client-safe so the Atlas can re-sort/classify on animal selection.
 *
 * VOZ (artículos 20 y 22 del blog): el razonamiento de resonancia debe ser una
 * observación REFUTABLE — "este patrón tuyo se cruza con esta entidad de esta
 * forma" — nunca una validación genérica que aplique a cualquiera (barnum).
 * Si una frase pudiera aplicarse a cualquier usuario, es barnum; si describe
 * un cruce específico que el usuario puede confirmar o refutar, es afinidad.
 */

import { getRelation, type Animal, type RelationType } from "@/lib/data/animalRelations";

export type ResonanceBucket = "affine" | "tension" | "neutral";

export interface ResonanceInfo {
  bucket: ResonanceBucket;
  /** Canonical relation type (same/triad/harmonious/neutral/clash/harm). */
  relationType: RelationType;
  /** Human label, e.g. "Tríada", "Opuestos", "Armonía". */
  label: string;
  /** 0-100 canonical score. */
  score: number;
}

const RELATION_LABELS: Record<RelationType, string> = {
  same: "Mismo animal",
  triad: "Tríada",
  harmonious: "Armonía",
  neutral: "Neutro",
  clash: "Opuestos",
  harm: "Tensión",
};

/** Map a canonical relation type to the Atlas bucket. */
export function bucketForRelation(type: RelationType): ResonanceBucket {
  switch (type) {
    case "same":
    case "triad":
    case "harmonious":
      return "affine";
    case "clash":
    case "harm":
      return "tension";
    default:
      return "neutral";
  }
}

/**
 * Classify the resonance between a reference animal and an entity's animal.
 * Returns a stable, deterministic classification with display metadata.
 */
export function classifyResonance(
  referenceAnimal: string,
  entityAnimal: string,
): ResonanceInfo {
  if (!referenceAnimal || !entityAnimal) {
    return { bucket: "neutral", relationType: "neutral", label: "Neutro", score: 50 };
  }
  const rel = getRelation(referenceAnimal as Animal, entityAnimal as Animal);
  return {
    bucket: bucketForRelation(rel.type),
    relationType: rel.type,
    label: RELATION_LABELS[rel.type],
    score: rel.score,
  };
}

/**
 * Generate a refutable, observational "why" for a resonance — the Molino voice
 * from articles 20 (refutability) and 22 (pattern crossing entity). The phrase
 * names the crossing between the reference animal and the entity's animal and
 * can be confirmed or refuted by the user. It never validates ("this is you"),
 * it observes a specific dynamic.
 *
 * `entityAnimal` is required so the observation is specific; `entityName`
 * optional to embed the entity in the sentence naturally.
 */
export function resonanceReasoning(
  referenceAnimal: string,
  entityAnimal: string,
  entityName?: string,
): string {
  if (!referenceAnimal || !entityAnimal) {
    return "No hay suficiente información para cruzar estos dos puntos.";
  }
  const info = classifyResonance(referenceAnimal, entityAnimal);
  const base = (name: string) =>
    name ? `Tu ${referenceAnimal} se cruza con ${entityName || name}` : `Tu ${referenceAnimal} y su ${entityAnimal}`;

  switch (info.relationType) {
    case "same":
      return `${base(entityAnimal)}: mismo animal, lo que puede leerse como afinidad de ritmo — o como quedar atrapado en los mismos puntos ciegos que ya conocés.`;
    case "triad":
      return `${base(entityAnimal)} comparten la energía de una tríada: se potencian en lo que cada uno ya sabe hacer. La pregunta es si esa potencia se traduce en movimiento.`;
    case "harmonious":
      return `${base(entityAnimal)} forman un par armonioso según la tradición: cubren lo que el otro tiende a descuidar.`;
    case "clash":
      return `${base(entityAnimal)} están en oposición directa: lo que uno empuja, el otro frena. Puede ser tensión que desgasta o contraste que obliga a definir una postura.`;
    case "harm":
      return `${base(entityAnimal)} tienen una relación de atención: no se bloquean, pero exigen cuidado para no rozar un punto sensible.`;
    default:
      return `${base(entityAnimal)} no tienen una relación marcada según la tradición: ni se potencian ni se chocan. Eso no es un veredicto, solo ausencia de señal.`;
  }
}

/**
 * Split a list of lightweight entities into the three resonance buckets for a
 * given reference animal. Order is preserved within each bucket.
 */
export function bucketEntitiesByResonance<T extends { animal: string }>(
  referenceAnimal: string,
  entities: T[],
): { affine: (T & { resonance: ResonanceInfo })[]; tension: (T & { resonance: ResonanceInfo })[]; neutral: (T & { resonance: ResonanceInfo })[] } {
  const affine: (T & { resonance: ResonanceInfo })[] = [];
  const tension: (T & { resonance: ResonanceInfo })[] = [];
  const neutral: (T & { resonance: ResonanceInfo })[] = [];

  for (const entity of entities) {
    const resonance = classifyResonance(referenceAnimal, entity.animal);
    const entry = { ...entity, resonance };
    if (resonance.bucket === "affine") affine.push(entry);
    else if (resonance.bucket === "tension") tension.push(entry);
    else neutral.push(entry);
  }

  // Sort each bucket by score descending (most resonant first).
  const byScore = (a: { resonance: ResonanceInfo }, b: { resonance: ResonanceInfo }) => b.resonance.score - a.resonance.score;
  affine.sort(byScore);
  tension.sort(byScore);
  neutral.sort(byScore);

  return { affine, tension, neutral };
}
