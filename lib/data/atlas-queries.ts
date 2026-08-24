/**
 * Atlas Visual — server-only taxonomy queries.
 *
 * Provides the read layer for the hierarchical exploration
 * (`Mundo -> País -> Categoría -> Entidad`) built on the existing 522 factual
 * entities. All queries are server-only: they read the rich data layer
 * (SYMBOLIC_ENTITIES) and return only `LightweightEntity[]` / plain metadata
 * to the UI. No Client Component imports SYMBOLIC_ENTITIES.
 */

import "server-only";

import type { LightweightEntity } from "@/types/atlas";
import { SYMBOLIC_ENTITIES, toLightweightEntity, ENTITY_TYPES, getCountryISO, type EntityType } from "./symbolic-entities";
import { getAnimalProfile, type Animal } from "./animalRelations";
import { getRegionCountryISOs } from "./atlas-regions";

/** Categories we expose in the drill-down (skip the "country" type itself). */
const DRILL_DOWN_TYPES: EntityType[] = ["brand", "city", "team", "university", "artist", "movie"];

export interface AtlasCountry {
  /** ISO 3166-1 alpha-2 */
  iso: string;
  /** Human-readable country name (from an entity of that country). */
  name: string;
  /** Flag emoji for the grid tile. */
  flag: string;
  /** Total entity count (non-"country" categories) for display. */
  count: number;
}

export interface AtlasCategory {
  /** EntityType key, e.g. "team". */
  type: EntityType;
  label: string;
  plural: string;
  /** Number of entities of this category in this country. */
  count: number;
}

/** Convert an ISO alpha-2 code to its regional-indicator flag emoji. */
export function isoToFlagEmoji(iso: string): string {
  if (!/^[A-Z]{2}$/.test(iso)) return "🌍";
  const base = 0x1f1e6;
  return String.fromCodePoint(base + iso.charCodeAt(0) - 65, base + iso.charCodeAt(1) - 65);
}

/**
 * Countries with registered (non-"country"-type) entities, alphabetized.
 */
export function getAtlasCountries(): AtlasCountry[] {
  const map = new Map<string, AtlasCountry>();
  for (const entity of SYMBOLIC_ENTITIES) {
    if (entity.type === "country") continue; // skip the country-as-category
    const iso = entity.countryISO;
    if (!iso) continue;
    const entry = map.get(iso) ?? {
      iso,
      name: entity.country,
      flag: isoToFlagEmoji(iso),
      count: 0,
    };
    entry.count += 1;
    map.set(iso, entry);
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name, "es"));
}

/**
 * Categories available for a given country (excluding the "country" type).
 */
export function getCategoriesByCountry(countryISO: string): AtlasCategory[] {
  const categories: AtlasCategory[] = [];
  for (const type of DRILL_DOWN_TYPES) {
    const count = SYMBOLIC_ENTITIES.filter(
      (e) => e.countryISO === countryISO && e.type === type
    ).length;
    if (count === 0) continue;
    const meta = ENTITY_TYPES[type];
    categories.push({ type, label: meta.label, plural: meta.plural, count });
  }
  // Stable order: keep the drill-down order but filter to present ones.
  return categories;
}

/**
 * Lightweight entities of a given category within a country.
 */
export function getEntitiesByTaxonomy(countryISO: string, category: EntityType): LightweightEntity[] {
  return SYMBOLIC_ENTITIES
    .filter((e) => e.countryISO === countryISO && e.type === category)
    .map(toLightweightEntity);
}

/**
 * All countries available for `generateStaticParams` (each with its ISO).
 */
export function getAllCountryISOs(): string[] {
  return getAtlasCountries().map((c) => c.iso);
}

/**
 * Get a country name from its ISO (or fall back to the ISO itself).
 */
export function getCountryName(iso: string): string {
  return getAtlasCountries().find((c) => c.iso === iso)?.name ?? iso;
}

// ════════════════════════════════════════════════════════════════════════
// PERSONALIZACIÓN POR PAÍS DEL USUARIO
//
// El Atlas debe acoplar su inteligencia al país del usuario (que se elige en
// onboarding/settings, nunca se adivina por IP). Estas funciones toman el
// nombre de país del UserContext y lo traducen a ISO / a una posición
// prioritaria en el hub. NUNCA participan del score de afinidad (que sigue
// siendo 100% zodíaco chino): solo ordenan y destacan la presentación.
// ════════════════════════════════════════════════════════════════════════

/** Traduce el nombre de país del usuario (UserContext.country) a ISO si existe en el Atlas. */
export function getUserCountryISO(countryName?: string): string | null {
  if (!countryName) return null;
  const iso = getCountryISO(countryName);
  if (!iso) return null;
  // Solo devolver ISO si el país realmente tiene entidades en el Atlas.
  return getAtlasCountries().some((c) => c.iso === iso) ? iso : null;
}

/**
 * Ordena los países del hub colocando el país del usuario primero (si tiene
 * cobertura), manteniendo el resto alfabético. Puramente presentacional.
 */
export function orderCountriesForUser(countries: AtlasCountry[], userCountryISO?: string | null): AtlasCountry[] {
  if (!userCountryISO) return countries;
  const copy = [...countries];
  const idx = copy.findIndex((c) => c.iso === userCountryISO);
  if (idx <= 0) return copy;
  const [userCountry] = copy.splice(idx, 1);
  return [userCountry, ...copy];
}

/**
 * Top-N países con más entidades — sugerencia útil cuando el país del usuario
 * no tiene cobertura en el Atlas (evita páginas vacías).
 */
export function topCountriesByCount(countries: AtlasCountry[], n = 10): AtlasCountry[] {
  return [...countries].sort((a, b) => b.count - a.count).slice(0, n);
}

/**
 * All non-country entities across the entire Atlas as LightweightEntity[].
 * Used to build a global ranking for personalized recommendations.
 */
export function getAllAtlasEntities(): LightweightEntity[] {
  return SYMBOLIC_ENTITIES
    .filter((e) => e.type !== "country")
    .map(toLightweightEntity);
}

/**
 * All entities across the entire Atlas, INCLUDING "country"-type entities.
 * Used by the animal-grouped views (AtlasHub, /atlas/explorar/[animal]),
 * where "country" is a category like any other. Do not use this for the
 * country-container drill-down (/atlas/[countryISO]/...), where "country"
 * as a category within a country would be recursive/confusing —
 * getAllAtlasEntities() above stays the right choice there.
 */
export function getAllAtlasEntitiesWithCountries(): LightweightEntity[] {
  return SYMBOLIC_ENTITIES.map(toLightweightEntity);
}

/**
 * All 12 Chinese Zodiac animals for `generateStaticParams`.
 */
export function getAllAnimalNames(): string[] {
  return [
    "Rata", "Buey", "Tigre", "Gato", "Dragón",
    "Serpiente", "Caballo", "Cabra", "Mono", "Gallo",
    "Perro", "Cerdo",
  ];
}

/**
 * Non-country entities filtered by Chinese Zodiac animal.
 * Used by the animal exploration pages (/atlas/explorar/[animal]).
 */
export function getEntitiesByAnimal(animal: string): LightweightEntity[] {
  return SYMBOLIC_ENTITIES
    .filter((e) => e.type !== "country")
    .map(toLightweightEntity)
    .filter((e) => e.animal === animal);
}

/**
 * Entities filtered by Chinese Zodiac animal, INCLUDING "country"-type
 * entities. See getAllAtlasEntitiesWithCountries() for why this is a
 * separate function rather than a change to getEntitiesByAnimal().
 */
export function getEntitiesByAnimalWithCountries(animal: string): LightweightEntity[] {
  return SYMBOLIC_ENTITIES
    .map(toLightweightEntity)
    .filter((e) => e.animal === animal);
}

/**
 * Entities of a given category whose primary event maps to the specified
 * Chinese Zodiac animal. Used by /atlas/explorar/[animal]/[category].
 */
export function getEntitiesByAnimalAndCategory(animal: string, category: EntityType): LightweightEntity[] {
  return SYMBOLIC_ENTITIES
    .filter((e) => e.type === category)
    .map(toLightweightEntity)
    .filter((e) => e.animal === animal);
}

// ════════════════════════════════════════════════════════════════════════
// ATLAS PERSONAL — motor de personalización (animal + país opcional)
//
// País nunca es un requisito de existencia, solo un acelerador de
// relevancia: la cascada arranca en country cuando hay countryISO y
// arranca directo en world cuando no lo hay. "Relación" usa exclusivamente
// triada (San He) + par armonioso (Liu He) — NUNCA neutral/choque/daño.
// No hay nivel "world-any": si ni siquiera world+relación alcanza el
// threshold, la categoría vuelve sin resultados (no se inventa contenido).
// Piloto de esta fase: university, team, artist únicamente.
// ════════════════════════════════════════════════════════════════════════

const PERSONAL_ATLAS_THRESHOLD = 3;

/**
 * Categorías que puede resolver getPersonalAtlas. Incluye "football_player"
 * además del EntityType real (usado por /affinity, /atlas y sus Records
 * exhaustivos) a propósito: es un tipo introducido solo para este motor —
 * ver artists-argentina.ts, donde los futbolistas dejaron de clasificarse
 * como "artist" — y ensanchar EntityType en symbolic-entities.ts obligaría
 * a tocar 6+ archivos (AffinityClient.tsx, CategoryGrid.tsx,
 * LocalizedAffinityHub.tsx, seo-jsonld.ts...) que no pertenecen a este
 * piloto y no deben ganar una categoría nueva de la nada.
 */
export type PersonalAtlasCategory = EntityType | "football_player";

/** Categorías habilitadas cuando no se pide una categoría específica. */
export const PERSONAL_ATLAS_PILOT_CATEGORIES: PersonalAtlasCategory[] = [
  "university", "team", "football_player", "artist", "city",
];

export type FallbackLevel =
  | "country-animal"
  | "country-relation"
  | "region-animal"
  | "region-relation"
  | "world-animal"
  | "world-relation";

export interface PersonalAtlasQuery {
  animal: Animal;
  countryISO?: string;
  category?: PersonalAtlasCategory;
  limitPerGroup?: number;
}

export interface PersonalAtlasGroup {
  category: PersonalAtlasCategory;
  level: FallbackLevel;
  entities: LightweightEntity[];
  totalAvailable: number;
}

export interface PersonalAtlasResult {
  groups: PersonalAtlasGroup[];
  usedCountry: boolean;
}

/** Triada (San He) + par armonioso (Liu He) — sin neutral/choque/daño. */
function getRelatedAnimals(animal: Animal): Animal[] {
  const profile = getAnimalProfile(animal);
  return [...profile.harmonyPartners, profile.liuHePartner];
}

function dedupeById(entities: LightweightEntity[]): LightweightEntity[] {
  const seen = new Set<string>();
  const result: LightweightEntity[] = [];
  for (const entity of entities) {
    if (seen.has(entity.id)) continue;
    seen.add(entity.id);
    result.push(entity);
  }
  return result;
}

function entitiesForScope(countryISOs: string[] | null, category: PersonalAtlasCategory, animals: string[]): LightweightEntity[] {
  return dedupeById(
    SYMBOLIC_ENTITIES
      .filter((e) => e.type === category)
      .filter((e) => countryISOs === null || (e.countryISO != null && countryISOs.includes(e.countryISO)))
      .map(toLightweightEntity)
      .filter((e) => animals.includes(e.animal))
  );
}

/**
 * Resuelve el fallback de UNA categoría, de forma independiente de las
 * demás. Cascada: country+same -> country+relation -> region+same ->
 * region+relation -> world+same -> world+relation. Sin countryISO, arranca
 * directo en world+same. Si ni world+relation alcanza el threshold,
 * devuelve el grupo sin resultados (entities: []) en vez de mostrar
 * contenido por debajo del mínimo.
 */
function resolveCategoryFallback(
  category: PersonalAtlasCategory,
  animal: Animal,
  countryISO: string | undefined,
  limitPerGroup: number
): PersonalAtlasGroup {
  const related = getRelatedAnimals(animal);
  const attempts: { level: FallbackLevel; countryISOs: string[] | null; animals: string[] }[] = [];

  if (countryISO) {
    attempts.push({ level: "country-animal", countryISOs: [countryISO], animals: [animal] });
    attempts.push({ level: "country-relation", countryISOs: [countryISO], animals: related });
    const regionISOs = getRegionCountryISOs(countryISO);
    if (regionISOs.length > 0) {
      attempts.push({ level: "region-animal", countryISOs: regionISOs, animals: [animal] });
      attempts.push({ level: "region-relation", countryISOs: regionISOs, animals: related });
    }
  }
  attempts.push({ level: "world-animal", countryISOs: null, animals: [animal] });
  attempts.push({ level: "world-relation", countryISOs: null, animals: related });

  let lastAttempt = attempts[attempts.length - 1];
  let lastEntities: LightweightEntity[] = [];

  for (const attempt of attempts) {
    const entities = entitiesForScope(attempt.countryISOs, category, attempt.animals);
    if (entities.length >= PERSONAL_ATLAS_THRESHOLD) {
      return {
        category,
        level: attempt.level,
        entities: entities.slice(0, limitPerGroup),
        totalAvailable: entities.length,
      };
    }
    lastAttempt = attempt;
    lastEntities = entities;
  }

  return { category, level: lastAttempt.level, entities: [], totalAvailable: lastEntities.length };
}

/**
 * Motor de descubrimiento personal: para cada categoría (por defecto, las
 * del piloto: university/team/artist), resuelve su propia cascada de
 * fallback server-side y devuelve solo LightweightEntity — nunca la
 * entidad completa, nunca un score/porcentaje. `usedCountry` indica si al
 * menos un grupo se resolvió efectivamente a nivel país.
 */
export function getPersonalAtlas(query: PersonalAtlasQuery): PersonalAtlasResult {
  const categories = query.category ? [query.category] : PERSONAL_ATLAS_PILOT_CATEGORIES;
  const limitPerGroup = query.limitPerGroup ?? 8;

  const groups = categories.map((category) =>
    resolveCategoryFallback(category, query.animal, query.countryISO, limitPerGroup)
  );

  const usedCountry = Boolean(
    query.countryISO &&
      groups.some((g) => g.level === "country-animal" || g.level === "country-relation")
  );

  return { groups, usedCountry };
}
