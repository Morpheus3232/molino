/**
 * Symbolic Entities — Unified schema for the Affinity System (Atlas Visual).
 *
 * SERVER-ONLY: this module is the rich data layer and must never be imported
 * by Client Components. It aggregates the raw entity inputs, enriches each
 * with deterministic visual metadata (visualType, countryISO), and exposes
 * lightweight projections for the client. The affinity date comes EXCLUSIVELY
 * from `events[primary].year` — there is no `foundingYear` anywhere.
 *
 * All data is REAL and verifiable. No invented facts.
 */

import "server-only";

import { getChineseAnimal, getChineseElement, calculateAnimalFromDate } from "@/lib/engines/chineseZodiacEngine";
import { getPrimaryEvent } from "./entity-events";
import type { AtlasEntity, AtlasEntityInput, AtlasHistoricalEvent, LightweightEntity, VisualType } from "@/types/atlas";
import { BRANDS_60 } from "./brands-60";
import { BRANDS_AUTOS_60 } from "./brands-autos-60";
import { AUTOS_ATLAS } from "./autos-atlas";
import { ROPA_ATLAS } from "./ropa-atlas";
import { BRANDS_ARGENTINA } from "./brands-argentina";
import { BRAND_LOGO_DOMAINS } from "./brand-logo-domains";
import { COUNTRIES_60 } from "./countries-60";
import { COUNTRIES_ATLAS } from "./countries-atlas";
import { CITIES_60 } from "./cities-60";
import { CITIES_ATLAS } from "./cities-atlas";
import { CITIES_ARGENTINA } from "./cities-argentina";
import { CITIES_ARGENTINA_COMPLETO } from "./cities-argentina-completo";
import { CITIES_URUGUAY } from "./cities-uruguay";
import { TEAMS_ARGENTINA } from "./teams-argentina";
import { TEAMS_CHILE } from "./teams-chile";
import { TEAMS_PERU } from "./teams-peru";
import { TEAMS_URUGUAY } from "./teams-uruguay";
import { UNIVERSITIES_ARGENTINA } from "./universities-argentina";
import { UNIVERSITIES_BUENOS_AIRES } from "./universities-buenos-aires";
import { UNIVERSITIES_CHILE } from "./universities-chile";
import { UNIVERSITIES_PERU } from "./universities-peru";
import { UNIVERSITIES_URUGUAY } from "./universities-uruguay";
import { MOVIES } from "./movies";
import { ARTISTS_ARGENTINA } from "./artists-argentina";
import { ARTISTS_CHILE } from "./artists-chile";
import { ARTISTS_PERU } from "./artists-peru";
import { ARTISTS_URUGUAY } from "./artists-uruguay";
import { FAMOUS_PEOPLE_ENTITIES } from "./famousPeopleToEntities";
import { CITIES_MEXICO, TEAMS_MEXICO, UNIVERSITIES_MEXICO, BRANDS_MEXICO, ARTISTS_MEXICO } from "./atlas/mexico";
import { CITIES_COLOMBIA, TEAMS_COLOMBIA, UNIVERSITIES_COLOMBIA, BRANDS_COLOMBIA, ARTISTS_COLOMBIA } from "./atlas/colombia";
import { CITIES_ESPANA, TEAMS_ESPANA, UNIVERSITIES_ESPANA, BRANDS_ESPANA, ARTISTS_ESPANA } from "./atlas/espana";
import { FOOTBALL_PLAYERS_ARGENTINA } from "./football-players-argentina";
import { FOOTBALL_PLAYERS_URUGUAY } from "./football-players-uruguay";
import { FOOTBALL_PLAYERS_ESPANA } from "./football-players-espana";
import { FOOTBALL_PLAYERS_USA } from "./football-players-usa";
import { FOOTBALL_PLAYERS_CHILE } from "./football-players-chile";
import { FOOTBALL_PLAYERS_PERU } from "./football-players-peru";
import { FOOTBALL_PLAYERS_MEXICO } from "./football-players-mexico";
import { FOOTBALL_PLAYERS_COLOMBIA } from "./football-players-colombia";
import { FOOTBALL_PLAYERS_BRASIL } from "./football-players-brasil";

export type EntityType =
  | "brand"
  | "city"
  | "country"
  | "university"
  | "team"
  | "movie"
  | "artist";

/** Visual kind by entity type — deterministic mapping, no per-entity hacks. */
export const VISUAL_TYPE_BY_TYPE: Record<EntityType, VisualType> = {
  brand: "logo",
  city: "flag",
  country: "flag",
  university: "logo",
  team: "logo",
  movie: "album",
  artist: "portrait",
};

export type { AtlasEntity, AtlasEntityInput, AtlasHistoricalEvent, LightweightEntity, VisualType };

// ════════════════════════════════════════════════════
// HISTORICAL EVENT TYPES
// ════════════════════════════════════════════════════

/** Type of historical event */
export type EventType =
  | "fundacion"
  | "incorporacion"
  | "creacion"
  | "lanzamiento"
  | "cambio-nombre"
  | "independencia-declarada"
  | "independencia-consumada"
  | "fecha-tradicional";

/** Confidence level for the date data */
export type ConfidenceLevel =
  | "exacta"     // exact documented date
  | "alta"       // year known, month approximate
  | "media"      // only year known
  | "baja"       // uncertain dating
  | "tradicion"; // mythological/traditional date

/** Back-compat alias: the enriched entity shape is now AtlasEntity. */
export type HistoricalEvent = AtlasHistoricalEvent;
/** Back-compat alias: the full entity is now AtlasEntity. */
export type SymbolicEntity = AtlasEntity;

// ════════════════════════════════════════════════════
// ENTITY SCHEMA — see types/atlas.ts (AtlasEntity / AtlasEntityInput)
// ════════════════════════════════════════════════════

/** ISO 3166-1 alpha-2 by common country name (client-safe map, see country-iso.ts). */
export { getCountryISO } from "./country-iso";
import { getCountryISO as resolveCountryISO } from "./country-iso";

/**
 * Enrich a raw entity input into a full AtlasEntity: attach the deterministic
 * visualType (by entity type) and countryISO (from the country name). No
 * per-entity hand-written visual data — the mapping is the source of truth.
 *
 * Para marcas sin imageUrl, se genera automáticamente desde Clearbit Logo API
 * usando el dominio del mapa BRAND_LOGO_DOMAINS.
 */
export function enrichEntity(input: AtlasEntityInput): AtlasEntity {
  const type = input.type as EntityType;
  const visualType = VISUAL_TYPE_BY_TYPE[type] ?? "emoji";
  const countryISO = resolveCountryISO(input.country);
  const imageUrl =
    input.imageUrl ??
    (type === "brand"
      ? (() => {
          const domain = BRAND_LOGO_DOMAINS[input.name];
          return domain ? `https://logo.clearbit.com/${domain}` : undefined;
        })()
      : undefined);
  return { ...input, visualType, countryISO, ...(imageUrl ? { imageUrl } : {}) };
}

/**
 * Resolve the Chinese zodiac animal for an entity from its primary event.
 * Uses the real Chinese New Year boundary when an exact date exists; falls
 * back to year-only (marked approximate) otherwise. This is the ONLY place
 * the affinity date is derived — never `foundingYear`.
 */
export function resolveEntityAnimalData(input: Pick<AtlasEntityInput, "events">): {
  animal: string;
  year: number;
  isApproximate: boolean;
} {
  const primary = getPrimaryEvent(input);
  const { animal, isApproximate } = primary
    ? calculateAnimalFromDate(primary.date, primary.year)
    : { animal: "", isApproximate: true };
  return { animal, year: primary?.year ?? 0, isApproximate };
}

/**
 * Project a full entity to the minimal `LightweightEntity` shape safe for the
 * client: id/name/animal/visualType/emoji. No events, no prose. Agrega
 * `origin` (etiqueta del evento primario + año) para mostrar de un vistazo
 * el momento de fundación/creación de la entidad.
 */
/** Etiquetas de `keyThemes` que el dataset usa para marcar gama alta. */
const PREMIUM_THEMES = new Set(["Lujo", "Exclusivo", "Premium", "Alta gama", "Alta costura"]);

export function toLightweightEntity(input: AtlasEntityInput): LightweightEntity {
  const enriched = enrichEntity(input);
  const { animal, isApproximate } = resolveEntityAnimalData(input);
  const primary = getPrimaryEvent(input);
  const origin = primary && primary.year ? `${primary.label} · ${primary.year}` : undefined;
  // La frase de origen y la fecha exacta viajan juntas y SOLO cuando el evento
  // trae `date`. Sin fecha completa el signo no es afirmable (ver originDate en
  // types/atlas.ts), así que mandar la prosa igual sería mostrar un respaldo
  // que no respalda nada. Además mantiene el payload del cliente acotado a las
  // entidades que el Mapa Personal puede usar.
  const hasExactDate = Boolean(primary?.date);
  // Gama alta según lo que el propio registro declara — nunca inferido de la
  // fama de la marca. Sirve para acotar cuántas marcas caras puede tener una
  // recomendación: el público del sitio es mayoritariamente clase media y una
  // lista de puro lujo no es una recomendación, es una vidriera.
  const premium =
    input.category === "Lujo" ||
    (input.keyThemes ?? []).some((t) => PREMIUM_THEMES.has(t));
  return {
    id: enriched.id,
    name: enriched.name,
    animal,
    isApproximate,
    visualType: enriched.visualType,
    emoji: enriched.emoji,
    imageUrl: enriched.imageUrl,
    country: enriched.country,
    countryISO: enriched.countryISO,
    city: enriched.city,
    type: enriched.type,
    origin,
    year: primary?.year,
    ...(premium ? { premium: true } : {}),
    ...(hasExactDate && primary
      ? {
          originDate: primary.date,
          originLabel: primary.label,
          originNote: primary.description || input.sourceNote,
        }
      : {}),
    category: enriched.category,
  };
}

/** Metadata for each entity type (UI labels, icons, SEO) */
export const ENTITY_TYPES: Record<EntityType, { label: string; plural: string; icon: string; description: string }> = {
  brand:      { label: "Marca",      plural: "Marcas",        icon: "\u2726",  description: "Descubr\u00ed qu\u00e9 marcas resuenan con tu energ\u00eda" },
  city:       { label: "Ciudad",     plural: "Ciudades",      icon: "\ud83c\udfef", description: "Explor\u00e9 qu\u00e9 ciudades vibran con tu perfil" },
  country:    { label: "Pa\u00eds",  plural: "Pa\u00edses",   icon: "\ud83c\udf0d", description: "Encontr\u00e1 qu\u00e9 pa\u00edses reson\u00e1n con vos" },
  university: { label: "Universidad", plural: "Universidades", icon: "\ud83c\udf93", description: "Conoc\u00e9 qu\u00e9 instituciones educativas conectan con tu patr\u00f3n" },
  team:       { label: "Equipo",     plural: "Equipos",       icon: "\u26bd",  description: "Ved qu\u00e9 equipos deportivos vibran con tu energ\u00eda" },
  movie:      { label: "Pel\u00edcula", plural: "Pel\u00edculas", icon: "\ud83c\udfac", description: "Descubr\u00ed qu\u00e9 pel\u00edculas resuenan con vos" },
  artist:     { label: "Famoso",     plural: "Famosos",       icon: "\ud83c\udfa4", description: "Encontr\u00e1 qu\u00e9 famosos conectan con tu esencia" },
};

/** Chinese zodiac animal for a given year (Gregorian fallback, pre-1900 compatible) */
export function getEntityAnimal(year: number): string {
  return getChineseAnimal(year);
}

/** Chinese element for a given year */
export function getEntityElement(year: number): string {
  return getChineseElement(year);
}

/**
 * Get the primary event for affinity calculation from an entity.
 * Pure selector — defined in the client-safe module lib/data/entity-events.ts
 * and re-exported here for backward compatibility (this module is server-only,
 * but the function itself is importable by engines via entity-events).
 */
export { getPrimaryEvent } from "./entity-events";

/**
 * Calculate and populate the animal for a historical event.
 * Uses real Chinese New Year dates when available (1900-2040).
 */
export function resolveEventAnimal(event: HistoricalEvent): HistoricalEvent {
  const { animal, isApproximate } = calculateAnimalFromDate(event.date, event.year);
  return { ...event, calculatedAnimal: animal, isApproximate };
}

// ════════════════════════════════════════════════════
// DEDUPLICATION — same real-world entity added twice across dataset files
// ════════════════════════════════════════════════════

const CONFIDENCE_RANK: Record<string, number> = {
  exacta: 5,
  alta: 4,
  media: 3,
  baja: 2,
  tradicion: 1,
};

/**
 * Higher is better. Confidence of the primary event dominates (a
 * well-sourced exact date beats a vague one); description length is only a
 * tiebreaker within the same confidence tier.
 */
function entityQualityScore(entity: AtlasEntity): number {
  const primary = getPrimaryEvent(entity);
  const confidenceScore = primary ? (CONFIDENCE_RANK[primary.confidence] ?? 0) : 0;
  return confidenceScore * 1000 + (entity.description?.length ?? 0);
}

/**
 * The dataset is assembled from many source files (base catalogs + later
 * regional expansions — México/Colombia/España, autos, ropa, ciudades
 * completas de Argentina) that sometimes add an entity that already exists
 * under a different id. Without this, the same real brand/city/country
 * appears twice in every Affinity list. Dedupe by (type, name, country) —
 * NOT by id, since the whole problem is that duplicates use different ids —
 * keeping whichever entry has the best-sourced primary event. Deterministic:
 * no Date.now/Math.random, same input always produces the same output.
 */
function dedupeAtlasEntities(entities: AtlasEntity[]): AtlasEntity[] {
  // El nombre se normaliza (minúsculas, sin diacríticos, sin puntuación de
  // adorno) porque los datasets escriben la misma marca de dos formas —
  // "Skoda" en autos-atlas y "Škoda" en brands-autos-60 se colaban como dos
  // entidades distintas y aparecían duplicadas en toda lista de afinidad.
  const normalizeName = (name: string) =>
    name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

  const keyOf = (e: AtlasEntity) => `${e.type}::${normalizeName(e.name)}::${e.country ?? ""}`;

  const bestByKey = new Map<string, AtlasEntity>();
  for (const entity of entities) {
    const key = keyOf(entity);
    const existing = bestByKey.get(key);
    if (!existing || entityQualityScore(entity) > entityQualityScore(existing)) {
      bestByKey.set(key, entity);
    }
  }

  const seen = new Set<string>();
  const result: AtlasEntity[] = [];
  for (const entity of entities) {
    const key = keyOf(entity);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(bestByKey.get(key)!);
  }
  return result;
}

// ════════════════════════════════════════════════════
// SAMPLE DATA — Real, verifiable entities
// ════════════════════════════════════════════════════

export const SYMBOLIC_ENTITIES: SymbolicEntity[] = dedupeAtlasEntities([
  ...BRANDS_60,
  ...BRANDS_AUTOS_60,
  ...AUTOS_ATLAS,
  ...ROPA_ATLAS,
  ...BRANDS_ARGENTINA,
  ...COUNTRIES_60,
  ...COUNTRIES_ATLAS,
  ...CITIES_60,
  ...CITIES_ATLAS,
    ...CITIES_ARGENTINA,
    ...CITIES_ARGENTINA_COMPLETO,
    ...CITIES_URUGUAY,

  ...TEAMS_ARGENTINA,
  ...TEAMS_CHILE,
  ...TEAMS_PERU,
  ...TEAMS_URUGUAY,
   ...UNIVERSITIES_ARGENTINA,
   ...UNIVERSITIES_BUENOS_AIRES,
   ...UNIVERSITIES_CHILE,
  ...UNIVERSITIES_PERU,
  ...UNIVERSITIES_URUGUAY,

  ...MOVIES,
  ...ARTISTS_ARGENTINA,
  ...ARTISTS_CHILE,
  ...ARTISTS_PERU,
  ...ARTISTS_URUGUAY,
  ...FAMOUS_PEOPLE_ENTITIES,

  // ──── ATLAS VISUAL — México, Colombia, España (Fase 2) ────
  ...CITIES_MEXICO,
  ...TEAMS_MEXICO,
  ...UNIVERSITIES_MEXICO,
  ...BRANDS_MEXICO,
  ...ARTISTS_MEXICO,

  ...CITIES_COLOMBIA,
  ...TEAMS_COLOMBIA,
  ...UNIVERSITIES_COLOMBIA,
  ...BRANDS_COLOMBIA,
  ...ARTISTS_COLOMBIA,

  ...CITIES_ESPANA,
  ...TEAMS_ESPANA,
  ...UNIVERSITIES_ESPANA,
  ...BRANDS_ESPANA,
  ...ARTISTS_ESPANA,

  // ──── FÚTBOL: jugadores actuales + referentes históricos (piloto de
  // Atlas Personal, type:"football_player") — países prioritarios ────
  ...FOOTBALL_PLAYERS_ARGENTINA,
  ...FOOTBALL_PLAYERS_URUGUAY,
  ...FOOTBALL_PLAYERS_ESPANA,
  ...FOOTBALL_PLAYERS_USA,
  ...FOOTBALL_PLAYERS_CHILE,
  ...FOOTBALL_PLAYERS_PERU,
  ...FOOTBALL_PLAYERS_MEXICO,
  ...FOOTBALL_PLAYERS_COLOMBIA,
  ...FOOTBALL_PLAYERS_BRASIL,

  // ──── UNIVERSIDADES (3) ────
  {
    // Nombre incluye "(UBA)" para que la búsqueda por acrónimo la encuentre
    // (mismo patrón que el resto de las universidades de universities-buenos-aires.ts).
    id: "uba", name: "Universidad de Buenos Aires (UBA)", type: "university", country: "Argentina", city: "Buenos Aires",
    emoji: "\ud83c\udf93",
    description: "La UBA es la universidad p\u00fablica m\u00e1s prestigiosa de Latinoam\u00e9rica. Ha producido 5 premios Nobel.",
    keyThemes: ["Conocimiento", "Excelencia", "Accesibilidad", "Compromiso"],
    sourceNote: "Fundada el 9 de agosto de 1821 por el gobernador Mart\u00edn Rodr\u00edguez.",
    events: [
      {
        id: "uba-fundacion",
        type: "fundacion",
        label: "Fundaci\u00f3n",
        date: "1821-08-09",
        year: 1821,
        description: "El gobernador Mart\u00edn Rodr\u00edguez y su min Bernardino Rivadavia fundan la Universidad de Buenos Aires.",
        source: "Universidad de Buenos Aires — Historia institucional",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "mit", name: "MIT", type: "university", country: "Estados Unidos",
    emoji: "\ud83d\udd2c",
    description: "El Massachusetts Institute of Technology es l\u00edder mundial en ciencia, ingenier\u00eda e innovaci\u00f3n tecnol\u00f3gica.",
    keyThemes: ["Innovaci\u00f3n", "Ciencia", "Visi\u00f3n", "Impacto"],
    sourceNote: "Fundado el 10 de abril de 1861. Abri\u00f3 sus puertas en 1865.",
    events: [
      {
        id: "mit-fundacion",
        type: "fundacion",
        label: "Charter firmado",
        date: "1861-04-10",
        year: 1861,
        description: "William Barton Rogers firma el charter de incorporaci\u00f3n del MIT.",
        source: "MIT — Institute History",
        confidence: "exacta",
        primaryForAffinity: true,
      },
      {
        id: "mit-apertura",
        type: "lanzamiento",
        label: "Apertura de puertas",
        year: 1865,
        description: "El MIT abre sus puertas a sus primeros estudiantes en Boston.",
        source: "MIT — Institute History",
        confidence: "alta",
        primaryForAffinity: false,
      },
    ],
  },
  {
    id: "oxford", name: "Universidad de Oxford", type: "university", country: "Reino Unido",
    emoji: "\ud83d\udcd6",
    description: "Oxford es la universidad de habla inglesa m\u00e1s antigua del mundo. M\u00e1s de 900 a\u00f1os de continuaci\u00f3n acad\u00e9mica.",
    keyThemes: ["Legado", "Sabidur\u00eda", "Tradici\u00f3n", "Rigor"],
    sourceNote: "Evidencia de ense\u00f1anza desde 1096. Estatutos reales desde 1249.",
    events: [
      {
        id: "oxford-origen",
        type: "fecha-tradicional",
        label: "Primera evidencia de ense\u00f1anza",
        year: 1096,
        description: "Primera evidencia documentada de ense\u00f1anza en la Universidad de Oxford.",
        source: "University of Oxford — History",
        confidence: "baja",
        primaryForAffinity: true,
      },
    ],
  },

  {
    id: "salamanca", name: "Universidad de Salamanca", type: "university", country: "España",
    emoji: "📖",
    description: "Salamanca es la universidad más antigua del mundo hispanohablante. Referencia histórica del pensamiento jurídico y humanista.",
    keyThemes: ["Legado", "Sabiduría", "Tradición", "Humanismo"],
    sourceNote: "Fundada en 1218 por el rey Alfonso IX de León. Fecha exacta de fundación no documentada; se usa el año.",
    events: [
      {
        id: "salamanca-fundacion",
        type: "fundacion",
        label: "Fundación",
        year: 1218,
        description: "El rey Alfonso IX de León funda el Estudio General de Salamanca, origen de la universidad.",
        source: "Universidad de Salamanca — Historia institucional",
        confidence: "media",
        primaryForAffinity: true,
      },
    ],
  },

  // ──── EQUIPOS (3) ────
  {
    id: "boca-juniors", name: "Boca Juniors", type: "team", country: "Argentina",
    emoji: "\u26bd",
    description: "Boca Juniors es el club m\u00e1s ic\u00f3nico del f\u00fatbol argentino. Fundado por inmigrantes italianos en La Boca.",
    keyThemes: ["Pasión", "Identidad", "Garra", "Comunidad"],
    sourceNote: "Fundado el 3 de abril de 1905 por ocho j\u00f3venes italianos en La Boca.",
    events: [
      {
        id: "boca-fundacion",
        type: "fundacion",
        label: "Fundaci\u00f3n",
        date: "1905-04-03",
        year: 1905,
        description: "Ocho j\u00f3venes inmigrantes italianos fundan Club Atl\u00e9tico Boca Juniors en el barrio de La Boca, Buenos Aires.",
        source: "Boca Juniors — Historia oficial",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "fc-barcelona", name: "FC Barcelona", type: "team", country: "Espa\u00f1a",
    emoji: "\u26bd",
    description: "El FC Barcelona es m\u00e1s que un club. Su lema \u00abM\u00e9s que un club\u00bb refleja su identidad cultural.",
    keyThemes: ["Identidad", "Excelencia", "Cultura", "Rebelde"],
    sourceNote: "Fundado el 29 de noviembre de 1899 por Joan Gamper.",
    events: [
      {
        id: "barca-fundacion",
        type: "fundacion",
        label: "Fundaci\u00f3n",
        date: "1899-11-29",
        year: 1899,
        description: "Joan Gamper y un grupo de futbolistas suizos, catalanes e ingleses fundan el Futbol Club Barcelona.",
        source: "FC Barcelona — Historia del Club",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "real-madrid", name: "Real Madrid", type: "team", country: "Espa\u00f1a",
    emoji: "\u26bd",
    description: "Real Madrid es el club con m\u00e1s t\u00edtulos de la Champions League. S\u00edmbolo de excelencia deportiva global.",
    keyThemes: ["Excellence", "Ambici\u00f3n", "Legado", "Glory"],
    sourceNote: "Fundado el 6 de marzo de 1902 como Madrid Football Club.",
    events: [
      {
        id: "rm-fundacion",
        type: "fundacion",
        label: "Fundaci\u00f3n como Madrid Football Club",
        date: "1902-03-06",
        year: 1902,
        description: "Juli\u00e1n Palacios y los hermanos Juan y Carlos Padr\u00f3s fundan el Madrid Football Club.",
        source: "Real Madrid — Historia del Club",
        confidence: "exacta",
        primaryForAffinity: true,
      },
      {
        id: "rm-titulo-real",
        type: "cambio-nombre",
        label: "T\u00edtulo de Real",
        year: 1920,
        description: "El rey Alfonso XIII concede el t\u00edtulo de \"Real\" al club.",
        source: "Real Madrid — Historia del Club",
        confidence: "alta",
        primaryForAffinity: false,
      },
    ],
  },

  {
    id: "sporting-cp", name: "Sporting CP", type: "team", country: "Portugal",
    emoji: "⚽",
    description: "Sporting Clube de Portugal es uno de los tres grandes del fútbol portugués, cantera histórica de figuras como Cristiano Ronaldo.",
    keyThemes: ["Cantera", "Identidad", "Tradición", "Formación"],
    sourceNote: "Fundado el 1 de julio de 1906 en Lisboa por José Alvalade.",
    events: [
      {
        id: "sporting-fundacion",
        type: "fundacion",
        label: "Fundación",
        date: "1906-07-01",
        year: 1906,
        description: "José Alvalade funda el Sporting Clube de Portugal en Lisboa.",
        source: "Sporting Clube de Portugal — Historia oficial",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },

  // ──── PEL\u00cdCULAS (3) ────
  {
    id: "matrix", name: "The Matrix", type: "movie", country: "Estados Unidos",
    emoji: "\ud83d\udcbb",
    description: "The Matrix cuestiona la naturaleza de la realidad. Una obra que fusiona filosof\u00eda, ciencia ficci\u00f3n y acci\u00f3n.",
    keyThemes: ["Realidad", "Despertar", "Libertad", "Filosof\u00eda"],
    sourceNote: "Estrenada el 31 de marzo de 1999. Dirigida por las hermanas Wachowski.",
    events: [
      {
        id: "matrix-estreno",
        type: "lanzamiento",
        label: "Estreno",
        date: "1999-03-31",
        year: 1999,
        description: "The Matrix se estrena en cines de Estados Unidos.",
        source: "Warner Bros.",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "interstellar", name: "Interstellar", type: "movie", country: "Estados Unidos",
    emoji: "\ud83c\udf0c",
    description: "Interstellar explora el amor como fuerza que trasciende el espacio y el tiempo. Ciencia rigurosa y emoci\u00f3n humana.",
    keyThemes: ["Amor", "Tiempo", "Espacio", "Esperanza"],
    sourceNote: "Estrenada el 7 de noviembre de 2014. Dirigida por Christopher Nolan.",
    events: [
      {
        id: "interstellar-estreno",
        type: "lanzamiento",
        label: "Estreno",
        date: "2014-11-07",
        year: 2014,
        description: "Interstellar se estrena en cines de Estados Unidos.",
        source: "Paramount Pictures",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "amelie", name: "Am\u00e9lie", type: "movie", country: "Francia",
    emoji: "\ud83c\udf35",
    description: "Am\u00e9lie es una ode a la fantas\u00eda cotidiana. Una pel\u00edcula que celebra los peque\u00f1os gestos de humanidad.",
    keyThemes: ["Fantas\u00eda", "Bondad", "Soledad", "Conexi\u00f3n"],
    sourceNote: "Estrenada el 25 de abril de 2001. Dirigida por Jean-Pierre Jeunet.",
    events: [
      {
        id: "amelie-estreno",
        type: "lanzamiento",
        label: "Estreno en Francia",
        date: "2001-04-25",
        year: 2001,
        description: "Am\u00e9lie (Le Fabuleux Destin d'Am\u00e9lie Poulain) se estrena en Francia.",
        source: "Universal Pictures",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },

  // ──── ARTISTAS (3) ────
  {
    id: "frida-kahlo", name: "Frida Kahlo", type: "artist", country: "M\u00e9xico",
    emoji: "\ud83c\udfa8",
    description: "Frida Kahlo transform\u00f3 el dolor en arte. Su obra es un acto de identidad, resistencia y vulnerabilidad.",
    keyThemes: ["Identidad", "Resistencia", "Vulnerabilidad", "Arte"],
    sourceNote: "Nacida el 6 de julio de 1907 en Coyoac\u00e1n, M\u00e9xico.",
    events: [
      {
        id: "frida-nacimiento",
        type: "creacion",
        label: "Nacimiento",
        date: "1907-07-06",
        year: 1907,
        description: "Magdalena Carmen Frida Kahlo y Calder\u00f3n nace en Coyoac\u00e1n, Ciudad de M\u00e9xico.",
        source: "Museo Frida Kahlo — Casa Azul",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "david-bowie", name: "David Bowie", type: "artist", country: "Reino Unido",
    emoji: "\ud83c\udfa4",
    description: "David Bowie reinvencion\u00f3 la identidad art\u00edstica. Cada \u00e1lbum era una nueva persona, una nueva exploraci\u00f3n.",
    keyThemes: ["Reinvenci\u00f3n", "Creatividad", "Oscurecimiento", "Vanguardia"],
    sourceNote: "Nacido el 8 de enero de 1947 como David Robert Jones en Brixton, Londres.",
    events: [
      {
        id: "bowie-nacimiento",
        type: "creacion",
        label: "Nacimiento",
        date: "1947-01-08",
        year: 1947,
        description: "David Robert Jones nace en Brixton, Londres.",
        source: "Encyclopaedia Britannica",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "soda-stereo", name: "Soda Stereo", type: "artist", country: "Argentina",
    emoji: "🎸",
    description: "Soda Stereo es la banda de rock en español más influyente de Latinoamérica, referencia ineludible del new wave y el rock latino.",
    keyThemes: ["Reinvención", "Vanguardia", "Latinoamérica", "Elegancia"],
    sourceNote: "Formada en 1982 en Buenos Aires por Gustavo Cerati, Zeta Bosio y Charly Alberti. Fecha exacta de formación no documentada públicamente; se usa el año.",
    events: [
      {
        id: "soda-stereo-formacion",
        type: "creacion",
        label: "Formación de la banda",
        year: 1982,
        description: "Gustavo Cerati, Héctor «Zeta» Bosio y Charly Alberti forman Soda Stereo en Buenos Aires.",
        source: "Soda Stereo — Historia oficial / Wikipedia",
        confidence: "media",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "tango", name: "Carlos Gardel", type: "artist", country: "Argentina",
    emoji: "\ud83c\udfb5",
    description: "Carlos Gardel es la voz m\u00edtica del tango. Su figura trasciende la m\u00fAsica para convertirse en s\u00edmbolo cultural.",
    keyThemes: ["Tango", "Melancol\u00eda", "Nostalgia", "Leyenda"],
    sourceNote: "Nacimiento disputado entre Francia (1890) y Uruguay (1883). Falleci\u00f3 en 1935.",
    events: [
      {
        id: "gardel-nacimiento",
        type: "creacion",
        label: "Nacimiento (fecha disputada)",
        year: 1890, date: "1890-12-11",
        description: "El nacimiento de Gardel est\u00e1 disputado: 11 de diciembre de 1890 en Toulouse, Francia, o 24 de diciembre de 1883 en Tacuaremb\u00f3, Uruguay.",
        source: "Academia Nacional del Tango",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
].map(enrichEntity));

/** Helper: get all entities of a given type */
export function getEntitiesByType(type: EntityType): SymbolicEntity[] {
  return SYMBOLIC_ENTITIES.filter(e => e.type === type);
}

/** Helper: get entity by id */
export function getEntityById(id: string): SymbolicEntity | undefined {
  return SYMBOLIC_ENTITIES.find(e => e.id === id);
}

/** Helper: get all available types that have at least one entity */
export function getAvailableTypes(): EntityType[] {
  const types = new Set<EntityType>(SYMBOLIC_ENTITIES.map(e => e.type as EntityType));
  // "football_player" existe en la data (ver artists-argentina.ts) para el
  // piloto de Atlas Personal (getPersonalAtlas), pero no es un EntityType
  // real (no está en ENTITY_TYPES/VISUAL_TYPE_BY_TYPE) ni tiene ruta en
  // /affinity/[type] — excluirlo acá evita un tile o URL de sitemap que
  // devuelve 404. Los dos consumidores de esta función son
  // app/affinity/page.tsx y app/sitemap.ts.
  types.delete("football_player" as EntityType);
  return Array.from(types);
}

/**
 * Entity types with real per-country coverage (ciudades, artistas,
 * universidades, equipos all have dedicated country data files —
 * cities-argentina.ts, artists-chile.ts, etc.). "country" itself and
 * global-only types (brand, movie) are excluded: narrowing "país" to just
 * the user's own country would be a trivial, uninformative single result.
 */
const COUNTRY_FOCUSABLE_TYPES: EntityType[] = ["city", "artist", "university", "team"];

function normalizeCountryName(name: string): string {
  return name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

/**
 * Narrows entities to the user's own country for types where that's
 * meaningful — un visitante de Chile ve ciudades/artistas/universidades/
 * equipos de Chile, no una mezcla global de docenas de países. Si no hay
 * datos locales para ese tipo (país sin cobertura todavía), devuelve la
 * lista completa sin filtrar: mejor mostrar algo global que una página vacía.
 */
export function focusEntitiesByCountry(
  entities: SymbolicEntity[],
  type: EntityType,
  userCountry?: string,
): SymbolicEntity[] {
  if (!userCountry || !COUNTRY_FOCUSABLE_TYPES.includes(type)) return entities;
  const normalized = normalizeCountryName(userCountry);
  const local = entities.filter(e => normalizeCountryName(e.country) === normalized);
  return local.length > 0 ? local : entities;
}
