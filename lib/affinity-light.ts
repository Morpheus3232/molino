/**
 * Client-safe affinity calculation over LightweightEntity.
 *
 * Client Components must never import the rich data layer (SYMBOLIC_ENTITIES
 * is `server-only`) nor the heavy engine that imports it. This module
 * provides the exact same score/tier math (getRelation from animalRelations,
 * which is pure data) but takes only `LightweightEntity[]` — so the browser
 * receives a tiny projection instead of the full catalog.
 *
 * IMPORTANT: the score for a (userAnimal, entityAnimal) pair is identical to
 * affinityEngine.calculateAffinity — both call getRelation().score. This is
 * the same rule, no new formula.
 */

import { getRelation, type Animal } from "@/lib/data/animalRelations";
import type { VisualType } from "@/types/atlas";

export type LightTier =
  | "resonancia-alta"
  | "afinidad-media"
  | "complementarios"
  | "desafiante"
  | "distante";

export function tierForScore(score: number): LightTier {
  if (score >= 75) return "resonancia-alta";
  if (score >= 60) return "afinidad-media";
  if (score >= 45) return "complementarios";
  if (score >= 30) return "desafiante";
  return "distante";
}

export interface LightAffinityResult {
  id: string;
  name: string;
  animal: string;
  emoji?: string;
  visualType: VisualType;
  imageUrl?: string;
  country?: string;
  countryISO?: string;
  type: string;
  score: number;
  tier: LightTier;
  relationship: string;
  isApproximate: boolean;
}

/** Buckets used by the Atlas recommendation section. */
export type AffinityBucket = "high" | "medium" | "enemy";

export interface AtlasRecommendations {
  high: LightAffinityResult[];
  medium: LightAffinityResult[];
  enemy: LightAffinityResult[];
}

/**
 * Compute the affinity score for a single entity given the user's animal.
 * Mirrors affinityEngine's score exactly.
 */
export function lightAffinity(userAnimal: string, entity: { animal: string }): {
  score: number;
  tier: LightTier;
  relationship: string;
} {
  if (!userAnimal || !entity?.animal) {
    return { score: 50, tier: "afinidad-media", relationship: "datos insuficientes" };
  }
  const rel = getRelation(userAnimal as Animal, entity.animal as Animal);
  return { score: rel.score, tier: tierForScore(rel.score), relationship: rel.label };
}

/** Sort a lightweight entity list by affinity score, descending. */
export function sortLightEntities(
  userAnimal: string,
  entities: LightweightLike[],
): LightAffinityResult[] {
  return entities
    .map((e) => {
      const { score, tier, relationship } = lightAffinity(userAnimal, e);
      return {
        id: e.id,
        name: e.name,
        animal: e.animal,
        emoji: e.emoji,
        visualType: e.visualType,
        imageUrl: e.imageUrl,
        country: e.country,
        countryISO: e.countryISO,
        type: e.type,
        score,
        tier,
        relationship,
        isApproximate: e.isApproximate ?? false,
      };
    })
    .sort((a, b) => b.score - a.score);
}

type LightweightLike = {
  id: string;
  name: string;
  animal: string;
  emoji?: string;
  visualType: VisualType;
  imageUrl?: string;
  country?: string;
  countryISO?: string;
  type: string;
  isApproximate?: boolean;
};

/**
 * Selects top 5 high-affinity (score >= 75), 3 medium (45 <= score < 75),
 * and 2 enemy (score < 45) entities from a score-sorted list.
 *
 * Tie-breaking within each bucket: entities matching `userCountryISO` are
 * promoted above those from other countries — country is a presentation
 * priority, never a score modifier. Deterministic stable sort ensures same
 * input yields same output every time.
 */
export function selectAtlasRecommendations(
  ranked: LightAffinityResult[],
  userCountryISO?: string | null,
): AtlasRecommendations {
  const high: LightAffinityResult[] = [];
  const medium: LightAffinityResult[] = [];
  const enemy: LightAffinityResult[] = [];

  for (const e of ranked) {
    if (e.score >= 75) high.push(e);
    else if (e.score >= 45) medium.push(e);
    else enemy.push(e);
  }

  const byCountryTieBreak = (a: LightAffinityResult, b: LightAffinityResult) => {
    if (!userCountryISO) return 0;
    const aMatch = a.countryISO === userCountryISO ? 1 : 0;
    const bMatch = b.countryISO === userCountryISO ? 1 : 0;
    return bMatch - aMatch;
  };

  // Sort each bucket: first by country priority, then stable (keeps original score order).
  high.sort(byCountryTieBreak);
  medium.sort(byCountryTieBreak);
  enemy.sort(byCountryTieBreak);

  return {
    high: high.slice(0, 5),
    medium: medium.slice(0, 3),
    enemy: enemy.slice(0, 2),
  };
}
