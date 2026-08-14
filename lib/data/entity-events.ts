/**
 * Client-safe entity event helpers.
 *
 * `getPrimaryEvent` is a pure, deterministic selector over `events` — no
 * server-only data. It lives here (NOT in lib/data/symbolic-entities.ts,
 * which is `import "server-only"`) so that engines imported by Client
 * Components (e.g. affinityEngine) can use it without dragging the rich
 * catalog into the client bundle.
 */

import type { AtlasHistoricalEvent } from "@/types/atlas";

/**
 * Get the primary event for affinity calculation from an entity.
 * Returns the event marked primaryForAffinity, or falls back to the first event.
 * Accepts the full entity or any shape exposing `events`.
 */
export function getPrimaryEvent(entity: { events: AtlasHistoricalEvent[] }): AtlasHistoricalEvent | undefined {
  return entity.events.find((e) => e.primaryForAffinity) ?? entity.events[0];
}
