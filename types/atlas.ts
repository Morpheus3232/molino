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
  /**
   * String libre — ya soporta cualquier categoría nueva sin tocar este tipo
   * (ej. "neighborhood", "venue", "restaurant") con solo agregar entradas
   * con ese `type` a un dataset. País → Ciudad → Barrio → Lugar/local se
   * modela así: country (país) → city (ciudad) → neighborhood (barrio,
   * Fase 6A) → una entidad type:"venue" con neighborhood seteado (el lugar
   * en sí). No hace falta un tipo nuevo por nivel de la jerarquía.
   */
  type: string;
  country: string;
  /** Ciudad de sede/fundación — solo se usa hoy para priorizar universidades de la capital dentro del mismo país. */
  city?: string;
  /** Barrio dentro de la ciudad (Fase 6A, sin datos cargados todavía) — ej. "Palermo" para una entidad type:"venue" con city:"Buenos Aires". */
  neighborhood?: string;
  emoji?: string;
  description: string;
  keyThemes: string[];
  category?: string;
  events: AtlasHistoricalEvent[];
  sourceNote?: string;
  /** Optional CDN/remote asset URL (logo, portrait, album cover) — enriquecido automáticamente para marcas vía Clearbit. */
  imageUrl?: string;
  /**
   * Solo para type:"university" (Fase 6A) — criterio explícito de por qué
   * esta institución es una de las 3-5 relevantes de su país, en vez de una
   * lista sin criterio documentado. Ausente = universidad legacy pre-Fase 6A,
   * no representa que no tenga criterio, solo que no se migró todavía.
   */
  relevance?: string;
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
  city?: string;
  type: string;
  /** Breve origen: momento de fundación/creación, p. ej. "Fundación · 1905". Derivado (server-side) del evento primario. */
  origin?: string;
  /** Año del evento primario, en crudo. Es lo que produce el signo. */
  year?: number;
  /**
   * Fecha exacta del evento primario en ISO (YYYY-MM-DD), presente SOLO cuando
   * el registro la documenta. Sin ella el signo del zodíaco chino no puede
   * afirmarse: el Año Nuevo chino cae entre el 21 de enero y el 21 de febrero,
   * así que un evento fechado solo por año podría pertenecer al signo
   * anterior. Los tres campos `origin*` viajan juntos y solo con fecha exacta.
   */
  originDate?: string;
  /** Etiqueta del evento primario, ej. "Fundación", "Independencia". */
  originLabel?: string;
  /** Frase breve que documenta el origen, tal como la trae el registro. */
  originNote?: string;
  /**
   * La entidad es de gama alta según los datos del propio registro
   * (`category: "Lujo"` o un `keyThemes` con Lujo/Exclusivo/Premium/Alta gama).
   * No es un juicio de precio inventado: es la etiqueta que el dataset ya
   * traía. Se usa para que una lista no quede compuesta solo por marcas caras.
   */
  premium?: boolean;
  /** Passthrough de AtlasEntityInput.category — hoy solo distingue "actual"/"historico" en football_player. */
  category?: string;
}
