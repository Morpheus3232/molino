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
import { SYMBOLIC_ENTITIES, toLightweightEntity, ENTITY_TYPES, type EntityType } from "./symbolic-entities";

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
