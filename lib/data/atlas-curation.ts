/**
 * Atlas Visual — Curation layer (server-only).
 *
 * Server-side entity selection from the rich data layer (SYMBOLIC_ENTITIES).
 * Client-safe helpers are in atlas-curation-helpers.ts.
 */

import "server-only";

import type { LightweightEntity } from "@/types/atlas";
import { SYMBOLIC_ENTITIES, toLightweightEntity } from "./symbolic-entities";
import { GLOBAL_LIMITS } from "./atlas-curation-helpers";

/**
 * All non-country entities in a stable, curated order.
 * The source datasets (BRANDS_60, CITIES_60, etc.) are already ordered
 * by the Chinese zodiac cycle — the first entities are the most canonical. */
export function getCuratedGlobalEntities(): Record<string, LightweightEntity[]> {
  const all = SYMBOLIC_ENTITIES
    .filter((e) => e.type !== "country")
    .map(toLightweightEntity);

  const byType: Record<string, LightweightEntity[]> = {};
  for (const e of all) {
    if (!byType[e.type]) byType[e.type] = [];
    byType[e.type].push(e);
  }

  const curated: Record<string, LightweightEntity[]> = {};
  for (const type of Object.keys(GLOBAL_LIMITS)) {
    const pool = byType[type] ?? [];
    curated[type] = pool.slice(0, GLOBAL_LIMITS[type]);
  }
  return curated;
}
