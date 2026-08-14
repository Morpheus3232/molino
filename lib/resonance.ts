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
