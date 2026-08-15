/**
 * Atlas Visual — Curation helpers (client-safe).
 *
 * Pure functions that operate on LightweightEntity[] — no server-only imports.
 * Used by AtlasHub to build the local/global curated sections.
 */

import type { LightweightEntity } from "@/types/atlas";

/** How many entities to show per category in the global section. */
export const GLOBAL_LIMITS: Record<string, number> = {
  city: 10,
  brand: 12,
  team: 8,
  university: 8,
  artist: 8,
  movie: 6,
};

/** How many entities to show per category in the local section. */
export const LOCAL_LIMITS: Record<string, number> = {
  city: 6,
  brand: 6,
  team: 6,
  university: 4,
  artist: 4,
  movie: 4,
};

/** Get localized entities from the lightweight pool, excluding those already in global. */
export function getCuratedLocalFromPool(
  allEntities: LightweightEntity[],
  countryISO: string,
  globalCurated: Record<string, LightweightEntity[]>,
): Record<string, LightweightEntity[]> {
  const byType: Record<string, LightweightEntity[]> = {};
  for (const e of allEntities) {
    if (e.countryISO !== countryISO) continue;
    if (!byType[e.type]) byType[e.type] = [];
    byType[e.type].push(e);
  }

  const curated: Record<string, LightweightEntity[]> = {};
  for (const type of Object.keys(LOCAL_LIMITS)) {
    const globalIds = new Set((globalCurated[type] ?? []).map((e) => e.id));
    const pool = (byType[type] ?? []).filter((e) => !globalIds.has(e.id));
    curated[type] = pool.slice(0, LOCAL_LIMITS[type]);
  }
  return curated;
}

/** Get the label for a curated section category. */
export function getCurationCategoryLabel(type: string): string {
  const labels: Record<string, string> = {
    city: "Ciudades",
    brand: "Marcas",
    team: "Equipos",
    university: "Universidades",
    artist: "Artistas",
    movie: "Películas",
  };
  return labels[type] ?? type;
}

/** Order of sections in the curated display. */
export const CURATION_SECTION_ORDER: string[] = ["city", "brand", "team", "university", "artist", "movie"];

/** Compact list of ISO codes for the country row. */
export const FEATURED_COUNTRY_ISOS: string[] = ["AR", "MX", "ES", "CL", "CO", "UY", "PE"];
