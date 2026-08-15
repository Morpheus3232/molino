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

import { getRelation, getAnimalProfile, ANIMALS, type Animal } from "@/lib/data/animalRelations";
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
export type AffinityBucket = "most" | "least";

export interface AtlasRecommendations {
  most: LightAffinityResult[];
  least: LightAffinityResult[];
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
 * Returns the canonical enemy animal for a given user animal.
 *
 * Enemy = Liu Chong (Six Clashes), the single animal in direct opposition.
 * Uses ANIMAL_PROFILES.challengingRelations as the source of truth.
 */
export function getEnemyAnimal(userAnimal: string): string | null {
  if (!userAnimal || !ANIMALS.includes(userAnimal as Animal)) return null;
  const profile = getAnimalProfile(userAnimal as Animal);
  return profile.challengingRelations[0] ?? null;
}

/**
 * Selects entities into two buckets:
 *
 *   most  → entity.animal === userAnimal (same Chinese zodiac)
 *   least → entity.animal === enemyAnimal(userAnimal) (canonical Liu Chong enemy)
 *
 * Country tie-breaking promotes entities from the user's country first within
 * each bucket, but never changes which bucket an entity belongs to.
 */
export function selectAtlasRecommendations(
  ranked: LightAffinityResult[],
  userCountryISO?: string | null,
): AtlasRecommendations {
  let userAnimal: string | null = null;
  for (const e of ranked) {
    if (e.relationship === "mismo animal" && e.score === 95) {
      userAnimal = e.animal;
      break;
    }
  }

  if (!userAnimal) {
    return { most: [], least: [] };
  }

  const enemy = getEnemyAnimal(userAnimal);

  const most: LightAffinityResult[] = [];
  const least: LightAffinityResult[] = [];

  for (const e of ranked) {
    if (e.animal === userAnimal) {
      most.push(e);
    } else if (enemy && e.animal === enemy) {
      least.push(e);
    }
  }

  const byCountryTieBreak = (a: LightAffinityResult, b: LightAffinityResult) => {
    if (!userCountryISO) return 0;
    const aMatch = a.countryISO === userCountryISO ? 1 : 0;
    const bMatch = b.countryISO === userCountryISO ? 1 : 0;
    return bMatch - aMatch;
  };

  most.sort(byCountryTieBreak);
  least.sort(byCountryTieBreak);

  return {
    most: most.slice(0, 5),
    least: least.slice(0, 5),
  };
}
