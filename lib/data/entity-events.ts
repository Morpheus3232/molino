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

/**
 * La fecha con la que se puede afirmar el signo del evento: el día exacto
 * ("YYYY-MM-DD") o, si solo se conoce el mes, "YYYY-MM" desde marzo. Sin
 * ninguna de las dos, undefined: el signo no es afirmable.
 */
export function affirmableDate(event?: Pick<AtlasHistoricalEvent, "date" | "month">): string | undefined {
  if (!event) return undefined;
  if (event.date) return event.date;
  if (event.month && /^\d{4}-\d{2}$/.test(event.month) && Number(event.month.slice(5, 7)) >= 3) return event.month;
  return undefined;
}

const MESES_LARGO = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

/** "24 de junio de 1987" o, con solo mes, "mayo de 1975". */
export function fechaDeOrigen(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m) return iso;
  return d ? `${d} de ${MESES_LARGO[m - 1]} de ${y}` : `${MESES_LARGO[m - 1]} de ${y}`;
}
