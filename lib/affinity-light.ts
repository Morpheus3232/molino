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

import { getRelation, getAnimalProfile, getFriends, ANIMALS, type Animal } from "@/lib/data/animalRelations";
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
  city?: string;
  type: string;
  score: number;
  tier: LightTier;
  relationship: string;
  isApproximate: boolean;
  origin?: string;
}

export interface AtlasSection {
  type: string;
  label: string;
  entities: LightAffinityResult[];
}

export interface AtlasSections {
  sameAnimal: AtlasSection[];
  enemyAnimal: AtlasSection[];
  userAnimal: string | null;
  enemyAnimalName: string | null;
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

/** Sort a lightweight entity list by affinity score, descending.
 * Optional userCountry applies +15 score boost to local entities for prioritization.
 */
export function sortLightEntities(
  userAnimal: string,
  entities: LightweightLike[],
  userCountry?: string,
): LightAffinityResult[] {
  return entities
    .map((e) => {
      const { score, tier, relationship } = lightAffinity(userAnimal, e);
      // Apply country boost: local entities get +15 points
      const COUNTRY_BOOST = 15;
      const boostedScore = userCountry && e.country === userCountry 
        ? score + COUNTRY_BOOST 
        : score;
      return {
        id: e.id,
        name: e.name,
        animal: e.animal,
        emoji: e.emoji,
        visualType: e.visualType,
        imageUrl: e.imageUrl,
        country: e.country,
        countryISO: e.countryISO,
        city: e.city,
        type: e.type,
        score: boostedScore,
        tier,
        relationship,
        isApproximate: e.isApproximate ?? false,
        origin: e.origin,
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
  city?: string;
  type: string;
  isApproximate?: boolean;
  origin?: string;
};

/**
 * Category display order and labels for the Atlas hub.
 */
const CATEGORY_ORDER: { type: string; label: string; singular: string }[] = [
  { type: "country", label: "Países", singular: "país" },
  { type: "city", label: "Ciudades", singular: "ciudad" },
  { type: "brand", label: "Marcas", singular: "marca" },
  { type: "team", label: "Equipos", singular: "equipo" },
  { type: "university", label: "Universidades", singular: "universidad" },
  { type: "artist", label: "Artistas", singular: "artista" },
  { type: "movie", label: "Películas", singular: "película" },
];

/** Max entities to show per category in the hub before "Ver todas →". */
const PER_CATEGORY_PREVIEW = 3;
const MAX_LOCAL_PER_CATEGORY = 2;

/**
 * Build categorized Atlas sections filtered by animal match.
 *
 *   sameAnimal  → entity.animal === userAnimal, grouped by category
 *   enemyAnimal → entity.animal === enemyAnimal(userAnimal), grouped by category
 *
 * Curation: within each category, up to 2 entities from the user's country
 * are shown first, then international entities of the same animal fill the
 * remaining slots (up to PER_CATEGORY_PREVIEW total). Categories with zero
 * entities are excluded.
 */
export function buildAtlasSections(
  userAnimal: string | null,
  entities: LightweightLike[],
  userCountryISO?: string | null,
): AtlasSections {
  if (!userAnimal) {
    return { sameAnimal: [], enemyAnimal: [], userAnimal: null, enemyAnimalName: null };
  }

  const enemy = getEnemyAnimal(userAnimal);

  const ranked = sortLightEntities(userAnimal, entities);

  const sameAnimalEntities = ranked.filter((e) => e.animal === userAnimal);
  const enemyEntities = enemy
    ? ranked.filter((e) => e.animal === enemy)
    : [];

  const sameAnimal: AtlasSection[] = [];
  const enemyAnimal: AtlasSection[] = [];

  function curateCategory(pool: LightAffinityResult[]): LightAffinityResult[] {
    if (!userCountryISO) return pool.slice(0, PER_CATEGORY_PREVIEW);
    const local = pool.filter((e) => e.countryISO === userCountryISO);
    const international = pool.filter((e) => e.countryISO !== userCountryISO);
    return [...local.slice(0, MAX_LOCAL_PER_CATEGORY), ...international]
      .slice(0, PER_CATEGORY_PREVIEW);
  }

  // Universidades: a diferencia del resto de categorías, nunca se muestran
  // internacionales — solo del país del usuario. Si no hay ninguna del
  // mismo animal, se recomiendan las de los animales "amigos" (San He).
  // Dentro del país, las de Buenos Aires (único dato de ciudad cargado hoy)
  // se priorizan primero.
  function sortByCityThenScore(pool: LightAffinityResult[]): LightAffinityResult[] {
    return [...pool].sort((a, b) => {
      const aBA = a.city === "Buenos Aires" ? 0 : 1;
      const bBA = b.city === "Buenos Aires" ? 0 : 1;
      if (aBA !== bBA) return aBA - bBA;
      return b.score - a.score;
    });
  }

  function curateUniversitySection(targetAnimal: string): LightAffinityResult[] {
    if (!userCountryISO) return [];
    const countryPool = ranked.filter(
      (e) => e.type === "university" && e.countryISO === userCountryISO
    );
    if (countryPool.length === 0) return [];
    let pool = countryPool.filter((e) => e.animal === targetAnimal);
    if (pool.length === 0 && ANIMALS.includes(targetAnimal as Animal)) {
      const friendAnimals = new Set<string>(getFriends(targetAnimal as Animal).map((f) => f.animal));
      pool = countryPool.filter((e) => friendAnimals.has(e.animal));
    }
    if (pool.length === 0) return [];
    return sortByCityThenScore(pool).slice(0, PER_CATEGORY_PREVIEW);
  }

  for (const { type, label } of CATEGORY_ORDER) {
    if (type === "university") {
      const entities = curateUniversitySection(userAnimal);
      if (entities.length === 0) continue;
      sameAnimal.push({ type, label, entities });
      continue;
    }
    const pool = sameAnimalEntities.filter((e) => e.type === type);
    if (pool.length === 0) continue;
    sameAnimal.push({
      type,
      label,
      entities: curateCategory(pool),
    });
  }

  for (const { type, label } of CATEGORY_ORDER) {
    if (type === "university") {
      if (!userCountryISO || !enemy) continue;
      const pool = ranked.filter(
        (e) => e.type === "university" && e.countryISO === userCountryISO && e.animal === enemy
      );
      if (pool.length === 0) continue;
      enemyAnimal.push({ type, label, entities: sortByCityThenScore(pool).slice(0, PER_CATEGORY_PREVIEW) });
      continue;
    }
    const pool = enemyEntities.filter((e) => e.type === type);
    if (pool.length === 0) continue;
    enemyAnimal.push({
      type,
      label,
      entities: curateCategory(pool),
    });
  }

  return { sameAnimal, enemyAnimal, userAnimal, enemyAnimalName: enemy };
}

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
