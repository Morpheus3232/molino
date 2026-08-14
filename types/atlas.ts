/**
 * Atlas Visual — typed schema for the Affinity system.
 *
 * `AtlasEntity` is the full, server-only entity. Raw data files emit the
 * lighter `AtlasEntityInput` (no derived visual metadata, no foundingYear —
 * everything derives from `events[primary].year`); the aggregator in
 * lib/data/symbolic-entities.ts enriches each one with `visualType`,
 * `countryISO` and `imageUrl` via deterministic logic.
 *
 * `LightweightEntity` is the minimal payload safe to send to Client
 * Components: only what the UI needs to render a row/card. It must never
 * include `events` (historical prose) or long descriptions.
 */

/** How an entity is rendered visually. */
export type VisualType = "portrait" | "logo" | "flag" | "album" | "emoji";

/** A documented historical event of an entity. */
export interface AtlasHistoricalEvent {
  id: string;
  type: string;
  label: string;
  /** ISO date string, e.g. "1976-04-01". Optional when only year is known. */
  date?: string;
  /** Year — always required. This is the ONLY date used for affinity. */
  year: number;
  description: string;
  source: string;
  confidence: string;
  /** Whether this event participates in the affinity calculation. Only 1 per entity. */
  primaryForAffinity: boolean;
  /** Chinese zodiac animal auto-calculated from date/year. Populated at runtime. */
  calculatedAnimal?: string;
  /** True if the animal was calculated from a year-only fallback. */
  isApproximate?: boolean;
}

/**
 * Raw entity input from the data files. No `foundingYear` — the entity's
 * date comes exclusively from `events[primary].year`.
 */
export interface AtlasEntityInput {
  id: string;
  name: string;
  type: string;
  country: string;
  emoji?: string;
  description: string;
  keyThemes: string[];
  category?: string;
  events: AtlasHistoricalEvent[];
  sourceNote?: string;
}

/** Full Atlas entity — the enriched, server-only shape. */
export interface AtlasEntity extends AtlasEntityInput {
  /** Deterministic visual kind (derived from `type`). */
  visualType: VisualType;
  /** ISO 3166-1 alpha-2 country code (derived from `country` when known). */
  countryISO?: string;
  /** Optional CDN/remote asset URL (logo, portrait, album cover). */
  imageUrl?: string;
}

/** Minimal payload for Client Components — no events, no long prose. */
export interface LightweightEntity {
  id: string;
  name: string;
  /** The Chinese zodiac animal (already resolved from events[primary].year). */
  animal: string;
  /** True when the animal came from a year-only fallback. */
  isApproximate: boolean;
  visualType: VisualType;
  emoji?: string;
  imageUrl?: string;
  country?: string;
  countryISO?: string;
  type: string;
}
