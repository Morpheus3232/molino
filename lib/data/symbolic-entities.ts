/**
 * Symbolic Entities — Unified schema for the Affinity System.
 *
 * Every entity has the minimum data the engine needs:
 *   foundingYear → Chinese zodiac animal + element (auto-calculated)
 *   type → category for filtering and SEO
 *
 * All data is REAL and verifiable. No invented facts.
 */

import { getChineseAnimal, getChineseElement, calculateAnimalFromDate } from "@/lib/engines/chineseZodiacEngine";

export type EntityType =
  | "brand"
  | "city"
  | "country"
  | "university"
  | "team"
  | "movie"
  | "artist";

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

/** A documented historical event of an entity */
export interface HistoricalEvent {
  id: string;
  type: EventType;
  label: string;
  /** ISO date string, e.g. "1976-04-01". Optional when only year is known. */
  date?: string;
  /** Year — always required */
  year: number;
  description: string;
  source: string;
  confidence: ConfidenceLevel;
  /** Whether this event participates in the affinity calculation. Only 1 per entity. */
  primaryForAffinity: boolean;
  /** Chinese zodiac animal auto-calculated from date/year. Populated at runtime. */
  calculatedAnimal?: string;
  /** True if the animal was calculated from a year-only fallback (no exact date). */
  isApproximate?: boolean;
}

// ════════════════════════════════════════════════════
// ENTITY SCHEMA
// ════════════════════════════════════════════════════

export interface SymbolicEntity {
  id: string;
  name: string;
  type: EntityType;
  /** @deprecated Use events.find(e => e.primaryForAffinity).year instead. Kept for backward compat. */
  foundingYear: number;
  country: string;
  emoji?: string;
  description: string;
  keyThemes: string[];
  /** Documented historical events. At least one must have primaryForAffinity=true. */
  events: HistoricalEvent[];
  sourceNote?: string;
}

/** Metadata for each entity type (UI labels, icons, SEO) */
export const ENTITY_TYPES: Record<EntityType, { label: string; plural: string; icon: string; description: string }> = {
  brand:      { label: "Marca",      plural: "Marcas",        icon: "\u2726",  description: "Descubr\u00ed qu\u00e9 marcas resuenan con tu energ\u00eda" },
  city:       { label: "Ciudad",     plural: "Ciudades",      icon: "\ud83c\udfef", description: "Explor\u00e9 qu\u00e9 ciudades vibran con tu perfil" },
  country:    { label: "Pa\u00eds",  plural: "Pa\u00edses",   icon: "\ud83c\udf0d", description: "Encontr\u00e1 qu\u00e9 pa\u00edses reson\u00e1n con vos" },
  university: { label: "Universidad", plural: "Universidades", icon: "\ud83c\udf93", description: "Conoc\u00e9 qu\u00e9 instituciones educativas conectan con tu patr\u00f3n" },
  team:       { label: "Equipo",     plural: "Equipos",       icon: "\u26bd",  description: "Ved qu\u00e9 equipos deportivos vibran con tu energ\u00eda" },
  movie:      { label: "Pel\u00edcula", plural: "Pel\u00edculas", icon: "\ud83c\udfac", description: "Descubr\u00ed qu\u00e9 pel\u00edculas resuenan con vos" },
  artist:     { label: "Artista",    plural: "Artistas",      icon: "\ud83c\udfa4", description: "Encontr\u00e9 qu\u00e9 artistas conectan con tu esencia" },
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
 * Returns the event marked primaryForAffinity, or falls back to the first event.
 */
export function getPrimaryEvent(entity: SymbolicEntity): HistoricalEvent | undefined {
  return entity.events.find(e => e.primaryForAffinity) ?? entity.events[0];
}

/**
 * Calculate and populate the animal for a historical event.
 * Uses real Chinese New Year dates when available (1900-2040).
 */
export function resolveEventAnimal(event: HistoricalEvent): HistoricalEvent {
  const { animal, isApproximate } = calculateAnimalFromDate(event.date, event.year);
  return { ...event, calculatedAnimal: animal, isApproximate };
}

// ════════════════════════════════════════════════════
// SAMPLE DATA — Real, verifiable entities
// ════════════════════════════════════════════════════

export const SYMBOLIC_ENTITIES: SymbolicEntity[] = [
  // ──── MARCAS (8) ────
  {
    id: "apple", name: "Apple", type: "brand", foundingYear: 1976, country: "Estados Unidos",
    emoji: "\ud83c\udf4e",
    description: "Apple naci\u00f3 en 1976 en un garaje de Los Altos, California. Revolucion\u00f3 la inform\u00e1tica personal y la experiencia digital.",
    keyThemes: ["Innovaci\u00f3n", "Dise\u00f1o", "Simplicidad", "Rebelde"],
    sourceNote: "Fundada por Steve Jobs, Steve Wozniak y Ronald Wayne el 1 de abril de 1976.",
    events: [
      {
        id: "apple-fundacion",
        type: "fundacion",
        label: "Fundaci\u00f3n de sociedad original",
        date: "1976-04-01",
        year: 1976,
        description: "Steve Jobs, Steve Wozniak y Ronald Wayne fundan Apple Computer Company en el garaje de Los Altos, California.",
        source: "Apple Inc. corporate records",
        confidence: "exacta",
        primaryForAffinity: true,
      },
      {
        id: "apple-incorporacion",
        type: "incorporacion",
        label: "Incorporaci\u00f3n legal",
        date: "1977-01-03",
        year: 1977,
        description: "Apple Computer, Inc. se incorpora formalmente en California.",
        source: "California Secretary of State records",
        confidence: "exacta",
        primaryForAffinity: false,
      },
    ],
  },
  {
    id: "nike", name: "Nike", type: "brand", foundingYear: 1964, country: "Estados Unidos",
    emoji: "\u2713",
    description: "Nike fue fundada como Blue Ribbon Sports en 1964. Su nombre homage a la diosa griega de la victoria.",
    keyThemes: ["Competencia", "Superaci\u00f3n", "Vitalidad", "Rebeld\u00eda"],
    sourceNote: "Fundada por Phil Knight y Bill Bowerman el 25 de enero de 1964.",
    events: [
      {
        id: "nike-fundacion",
        type: "fundacion",
        label: "Fundaci\u00f3n como Blue Ribbon Sports",
        date: "1964-01-25",
        year: 1964,
        description: "Phil Knight y Bill Bowerman fundan Blue Ribbon Sports en Eugene, Oregon.",
        source: "Nike corporate history",
        confidence: "exacta",
        primaryForAffinity: true,
      },
      {
        id: "nike-cambio-nombre",
        type: "cambio-nombre",
        label: "Renombrada como Nike",
        year: 1978,
        description: "Blue Ribbon Sports cambia su nombre oficial a Nike, Inc.",
        source: "Nike corporate history",
        confidence: "alta",
        primaryForAffinity: false,
      },
    ],
  },
  {
    id: "patagonia", name: "Patagonia", type: "brand", foundingYear: 1973, country: "Estados Unidos",
    emoji: "\u26f0\ufe0f",
    description: "Patagonia es una empresa de ropa outdoor fundada por Yvon Chouinard. Lidera la responsabilidad ambiental corporativa.",
    keyThemes: ["Naturaleza", "Sostenibilidad", "Aventura", "Prop\u00f3sito"],
    sourceNote: "Fundada en 1973 por Yvon Chouinard en Ventura, California.",
    events: [
      {
        id: "patagonia-fundacion",
        type: "fundacion",
        label: "Fundaci\u00f3n",
        year: 1973,
        description: "Yvon Chouinard funda Patagonia en Ventura, California, como tienda de ropa outdoor.",
        source: "Patagonia corporate history",
        confidence: "media",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "spotify", name: "Spotify", type: "brand", foundingYear: 2006, country: "Suecia",
    emoji: "\ud83c\udfb5",
    description: "Spotify transform\u00f3 la industria musical con streaming. Fundada en Estocolmo por Daniel Ek y Martin Lorentzon.",
    keyThemes: ["M\u00fasica", "Conectividad", "Accesibilidad", "Innovaci\u00f3n"],
    sourceNote: "Fundada en 2006, lanzada p\u00fablicamente en 2008.",
    events: [
      {
        id: "spotify-fundacion",
        type: "fundacion",
        label: "Fundaci\u00f3n",
        year: 2006,
        description: "Daniel Ek y Martin Lorentzon fundan Spotify en Estocolmo, Suecia.",
        source: "Spotify corporate history",
        confidence: "media",
        primaryForAffinity: true,
      },
      {
        id: "spotify-lanzamiento",
        type: "lanzamiento",
        label: "Lanzamiento p\u00fablico",
        date: "2008-10-07",
        year: 2008,
        description: "Spotify se lanza p\u00fablicamente en mercados europeos.",
        source: "Spotify press releases",
        confidence: "exacta",
        primaryForAffinity: false,
      },
    ],
  },
  {
    id: "coca-cola", name: "Coca-Cola", type: "brand", foundingYear: 1886, country: "Estados Unidos",
    emoji: "\ud83e\udd64",
    description: "Coca-Cola es una de las marcas m\u00e1s reconocidas del mundo. Creada por John Pemberton en Atlanta.",
    keyThemes: ["Tradici\u00f3n", "Nostalgia", "Celebraci\u00f3n", "Global"],
    sourceNote: "Creada el 8 de mayo de 1886 por el farmac\u00e9utico John Pemberton.",
    events: [
      {
        id: "coca-cola-creacion",
        type: "creacion",
        label: "Creaci\u00f3n del producto",
        date: "1886-05-08",
        year: 1886,
        description: "John Pemberton crea la f\u00f3rmula original de Coca-Cola en Atlanta, Georgia.",
        source: "The Coca-Cola Company historical records",
        confidence: "exacta",
        primaryForAffinity: true,
      },
      {
        id: "coca-cola-incorporacion",
        type: "incorporacion",
        label: "Incorporaci\u00f3n de empresa",
        date: "1892-01-29",
        year: 1892,
        description: "Asa Candler incorpora The Coca-Cola Company en Atlanta.",
        source: "Georgia Secretary of State records",
        confidence: "exacta",
        primaryForAffinity: false,
      },
    ],
  },
  {
    id: "tesla", name: "Tesla", type: "brand", foundingYear: 2003, country: "Estados Unidos",
    emoji: "\u26a1",
    description: "Tesla aceler\u00f3 la transici\u00f3n hacia la energ\u00eda sostenible con veh\u00edculos el\u00e9ctricos de alto rendimiento.",
    keyThemes: ["Futuro", "Sostenibilidad", "Rebelde", "Visi\u00f3n"],
    sourceNote: "Fundada en 2003 por Martin Eberhard y Marc Tarpenning. Nombre en honor a Nikola Tesla.",
    events: [
      {
        id: "tesla-fundacion",
        type: "fundacion",
        label: "Fundaci\u00f3n",
        year: 2003,
        description: "Martin Eberhard y Marc Tarpenning fundan Tesla Motors en San Carlos, California.",
        source: "Tesla corporate history",
        confidence: "media",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "adidas", name: "Adidas", type: "brand", foundingYear: 1949, country: "Alemania",
    emoji: "\ud83e\udd7e",
    description: "Adidas fue fundada por Adi Dassler en Herzogenaurach. Sus tres rayas son ic\u00f3nicas en la cultura deportiva.",
    keyThemes: ["Deporte", "Dise\u00f1o", "Cultura", "Perseverancia"],
    sourceNote: "Fundada el 18 de agosto de 1949 por Adi Dassler.",
    events: [
      {
        id: "adidas-fundacion",
        type: "fundacion",
        label: "Fundaci\u00f3n",
        date: "1949-08-18",
        year: 1949,
        description: "Adi Dassler registra Adidas AG en Herzogenaurach, Alemania.",
        source: "Adidas corporate history",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "mercedes-benz", name: "Mercedes-Benz", type: "brand", foundingYear: 1926, country: "Alemania",
    emoji: "\ud83d\ude97",
    description: "Mercedes-Benz naci\u00f3 de la fusi\u00f3n de Benz & Cie y Daimler-Motoren-Gesellschaft. S\u00edmbolo de ingenier\u00eda premium.",
    keyThemes: ["Excellence", "Elegancia", "Ingenier\u00eda", "Legado"],
    sourceNote: "Fusi\u00f3n el 28 de junio de 1926. El nombre Mercedes viene de la hija de Emil Jellinek.",
    events: [
      {
        id: "mercedes-fusion",
        type: "fundacion",
        label: "Fusi\u00f3n Benz & Daimler",
        date: "1926-06-28",
        year: 1926,
        description: "Benz & Cie y Daimler-Motoren-Gesellschaft se fusionan para crear Daimler-Benz AG.",
        source: "Mercedes-Benz corporate history",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },

  // ──── CIUDADES (6) ────
  {
    id: "buenos-aires", name: "Buenos Aires", type: "city", foundingYear: 1580, country: "Argentina",
    emoji: "\ud83c\udfe6",
    description: "Buenos Aires fue fundada dos veces: en 1536 por Pedro de Mendoza y definitivamente en 1580 por Juan de Garay. Capital cultural de Am\u00e9rica Latina.",
    keyThemes: ["Tango", "Literatura", "Contraste", "Melancol\u00eda"],
    sourceNote: "Fundaci\u00f3n definitiva: 11 de junio de 1580 por Juan de Garay.",
    events: [
      {
        id: "ba-primera-fundacion",
        type: "fundacion",
        label: "Primera fundaci\u00f3n",
        year: 1536,
        description: "Pedro de Mendoza funda la ciudad de Santa Mar\u00eda de los Buenos Aires.",
        source: "Historia argentina — Academia Nacional de la Historia",
        confidence: "alta",
        primaryForAffinity: false,
      },
      {
        id: "ba-segunda-fundacion",
        type: "fundacion",
        label: "Fundaci\u00f3n definitiva",
        year: 1580,
        description: "Juan de Garay refunda la ciudad de manera definitiva.",
        source: "Historia argentina — Academia Nacional de la Historia",
        confidence: "alta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "tokio", name: "Tokio", type: "city", foundingYear: 1457, country: "Jap\u00f3n",
    emoji: "\ud83c\udfef",
    description: "Tokio pas\u00f3 de pueblo de pesca (Edo) a la metr\u00f3poli m\u00e1s grande del mundo. La tensi\u00f3n entre tradici\u00f3n y vanguardia la define.",
    keyThemes: ["Tradici\u00f3n", "Innovaci\u00f3n", "Contraste", "Respeto"],
    sourceNote: "El castillo de Edo fue construido en 1457 por Ota D\u014dkan.",
    events: [
      {
        id: "tokio-construccion",
        type: "fundacion",
        label: "Construcci\u00f3n del castillo de Edo",
        year: 1457,
        description: "Ota D\u014dkan construye el castillo de Edo, origen de la actual Tokio.",
        source: "Encyclopaedia Britannica",
        confidence: "alta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "nueva-york", name: "Nueva York", type: "city", foundingYear: 1624, country: "Estados Unidos",
    emoji: "\ud83c\uddfd\ufe0f",
    description: "Nueva York es una de las ciudades m\u00e1s ic\u00f3nicas del mundo. Su diversidad cultural y energ\u00eda constante la hacen \u00fanica.",
    keyThemes: ["Ambici\u00f3n", "Diversidad", "Inspiraci\u00f3n", "Innovaci\u00f3n"],
    sourceNote: "Fundada como Nieuw Amsterdam por colonos holandeses en 1624.",
    events: [
      {
        id: "ny-fundacion",
        type: "fundacion",
        label: "Fundaci\u00f3n como Nieuw Amsterdam",
        year: 1624,
        description: "Colonos holandeses establecen Nieuw Amsterdam en la isla de Manhattan.",
        source: "Encyclopaedia Britannica",
        confidence: "alta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "paris", name: "Par\u00eds", type: "city", foundingYear: -250, country: "Francia",
    emoji: "\ud83c\uddf5\ud83c\uddf1",
    description: "Par\u00eds, la ciudad de la luz, ha sido centro del arte, la filosof\u00eda y la revoluci\u00f3n durante siglos.",
    keyThemes: ["Arte", "Filosof\u00eda", "Elegancia", "Revoluci\u00f3n"],
    sourceNote: "Los parisios (celta) establecieron un asentamiento en la \u00cdsla de la Cite circa 250 a.C.",
    events: [
      {
        id: "paris-origen",
        type: "fecha-tradicional",
        label: "Origen celta (Los Parisios)",
        year: -250,
        description: "La tribu celta de los parisios establece un asentamiento en la \u00cdsla de la Cite.",
        source: "Encyclopaedia Britannica",
        confidence: "baja",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "barcelona", name: "Barcelona", type: "city", foundingYear: -15, country: "Espa\u00f1a",
    emoji: "\ud83c\uddea\ud83c\uddf8",
    description: "Barcelona combina arquitectura vanguardista con ra\u00edces romanas. La obra de Gaud\u00ed define su skyline.",
    keyThemes: ["Creatividad", "Dise\u00f1o", "Sol", "Rebelde"],
    sourceNote: "Fundada como colonia romana Barcino en el 15 a.C.",
    events: [
      {
        id: "barcelona-fundacion",
        type: "fundacion",
        label: "Fundaci\u00f3n romana Barcino",
        year: -15,
        description: "El general romano Quinto Cecilio Metelo funda la colonia Julia Augusta Faventia Paterna Barcino.",
        source: "Encyclopaedia Britannica",
        confidence: "alta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "mendoza", name: "Mendoza", type: "city", foundingYear: 1561, country: "Argentina",
    emoji: "\ud83c\udf77",
    description: "Mendoza es la capital del vino argentino. A los pies de los Andes, combina naturaleza extrema y cultura del vino.",
    keyThemes: ["Naturaleza", "Tranquilidad", "Tierra", "Comunidad"],
    sourceNote: "Fundada el 2 de marzo de 1561 por Pedro del Castillo.",
    events: [
      {
        id: "mendoza-fundacion",
        type: "fundacion",
        label: "Fundaci\u00f3n",
        year: 1561,
        description: "Pedro del Castillo funda la ciudad de Mendoza.",
        source: "Historia argentina — Academia Nacional de la Historia",
        confidence: "alta",
        primaryForAffinity: true,
      },
    ],
  },

  // ──── PA\u00cdSES (5) ────
  {
    id: "argentina", name: "Argentina", type: "country", foundingYear: 1816, country: "Argentina",
    emoji: "\ud83c\udde6\ud83c\uddf7",
    description: "Argentina declar\u00f3 su independencia el 9 de julio de 1816. Un pa\u00eds de contrastes: de la Patagonia a la Pampa.",
    keyThemes: ["Pasión", "Resiliencia", "Contraste", "Identidad"],
    sourceNote: "Independencia declarada el 9 de julio de 1816 en Tucum\u00e1n.",
    events: [
      {
        id: "argentina-indep-declarada",
        type: "independencia-declarada",
        label: "Independencia declarada",
        date: "1816-07-09",
        year: 1816,
        description: "El Congreso de Tucum\u00e1n declara la independencia de las Provincias Unidas del R\u00edo de la Plata.",
        source: "Academia Nacional de la Historia",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "japon", name: "Jap\u00f3n", type: "country", foundingYear: -660, country: "Jap\u00f3n",
    emoji: "\ud83c\uddef\ud83c\uddf5",
    description: "Jap\u00f3n es un archipi\u00e9lago donde tradici\u00f3n milenaria y tecnolog\u00eda futurista coexisten en equilibrio.",
    keyThemes: ["Armon\u00eda", "Disciplina", "Respeto", "Innovaci\u00f3n"],
    sourceNote: "Seg\u00fan la tradici\u00f3n, fundado por el emperador Jimmu en 660 a.C.",
    events: [
      {
        id: "japon-tradicional",
        type: "fecha-tradicional",
        label: "Fundaci\u00f3n m\u00edtica (Emperador Jimmu)",
        year: -660,
        description: "Seg\u00fan el Nihon Shoki, el emperador Jimmu funda Jap\u00f3n el 11 de febrero de 660 a.C.",
        source: "Nihon Shoki (Cr\u00f3nicas de Jap\u00f3n)",
        confidence: "tradicion",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "francia", name: "Francia", type: "country", foundingYear: 843, country: "Francia",
    emoji: "\ud83c\uddeb\ud83c\uddf7",
    description: "Francia naci\u00f3 del Tratado de Verd\u00fan en 843. Cuna de la Ilustraci\u00f3n, la revoluci\u00f3n y la haute couture.",
    keyThemes: ["Filosof\u00eda", "Elegancia", "Revoluci\u00f3n", "Cultura"],
    sourceNote: "Tratado de Verd\u00fan en 843 dividi\u00f3 el Imperio carolingio.",
    events: [
      {
        id: "francia-tratado",
        type: "fundacion",
        label: "Tratado de Verd\u00fan",
        year: 843,
        description: "El Tratado de Verd\u00fan divide el Imperio carolingio, creando la base de la Francia moderna.",
        source: "Encyclopaedia Britannica",
        confidence: "alta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "australia", name: "Australia", type: "country", foundingYear: 1901, country: "Australia",
    emoji: "\ud83c\udde6\ud83c\uddfa",
    description: "Australia se feder\u00f3 en 1901. Su naturaleza \u00fanica y esp\u00edritu aventurero la definen como naci\u00f3n joven.",
    keyThemes: ["Aventura", "Naturaleza", "Libertad", "Resiliencia"],
    sourceNote: "Federaci\u00f3n el 1 de enero de 1901.",
    events: [
      {
        id: "australia-federacion",
        type: "fundacion",
        label: "Federaci\u00f3n",
        date: "1901-01-01",
        year: 1901,
        description: "Las seis colonias brit\u00e1nicas se federan para crear la Mancomunidad de Australia.",
        source: "Australian Government — Constitution",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "brasil", name: "Brasil", type: "country", foundingYear: 1822, country: "Brasil",
    emoji: "\ud83c\udde7\ud83c\uddf7",
    description: "Brasil se independiz\u00f3 en 1822. Es el pa\u00eds m\u00e1s diverso de Am\u00e9rica, con la mayor biodiversidad del planeta.",
    keyThemes: ["Alegr\u00eda", "Diversidad", "Celebraci\u00f3n", "Naturaleza"],
    sourceNote: "Independencia declarada el 7 de septiembre de 1822.",
    events: [
      {
        id: "brasil-indep-declarada",
        type: "independencia-declarada",
        label: "Independencia declarada",
        date: "1822-09-07",
        year: 1822,
        description: "Pedro I declara la independencia de Brasil en el r\u00edo Ipiranga, S\u00e3o Paulo.",
        source: "Encyclopaedia Britannica",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },

  // ──── UNIVERSIDADES (3) ────
  {
    id: "uba", name: "Universidad de Buenos Aires", type: "university", foundingYear: 1821, country: "Argentina",
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
    id: "mit", name: "MIT", type: "university", foundingYear: 1861, country: "Estados Unidos",
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
    id: "oxford", name: "Universidad de Oxford", type: "university", foundingYear: 1096, country: "Reino Unido",
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

  // ──── EQUIPOS (3) ────
  {
    id: "boca-juniors", name: "Boca Juniors", type: "team", foundingYear: 1905, country: "Argentina",
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
    id: "fc-barcelona", name: "FC Barcelona", type: "team", foundingYear: 1899, country: "Espa\u00f1a",
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
    id: "real-madrid", name: "Real Madrid", type: "team", foundingYear: 1902, country: "Espa\u00f1a",
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

  // ──── PEL\u00cdCULAS (3) ────
  {
    id: "matrix", name: "The Matrix", type: "movie", foundingYear: 1999, country: "Estados Unidos",
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
    id: "interstellar", name: "Interstellar", type: "movie", foundingYear: 2014, country: "Estados Unidos",
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
    id: "amelie", name: "Am\u00e9lie", type: "movie", foundingYear: 2001, country: "Francia",
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
    id: "frida-kahlo", name: "Frida Kahlo", type: "artist", foundingYear: 1907, country: "M\u00e9xico",
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
    id: "david-bowie", name: "David Bowie", type: "artist", foundingYear: 1947, country: "Reino Unido",
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
    id: "tango", name: "Carlos Gardel", type: "artist", foundingYear: 1890, country: "Argentina",
    emoji: "\ud83c\udfb5",
    description: "Carlos Gardel es la voz m\u00edtica del tango. Su figura trasciende la m\u00fAsica para convertirse en s\u00edmbolo cultural.",
    keyThemes: ["Tango", "Melancol\u00eda", "Nostalgia", "Leyenda"],
    sourceNote: "Nacimiento disputado entre Francia (1890) y Uruguay (1883). Falleci\u00f3 en 1935.",
    events: [
      {
        id: "gardel-nacimiento",
        type: "creacion",
        label: "Nacimiento (fecha disputada)",
        year: 1890,
        description: "El nacimiento de Gardel est\u00e1 disputado: 11 de diciembre de 1890 en Toulouse, Francia, o 24 de diciembre de 1883 en Tacuaremb\u00f3, Uruguay.",
        source: "Academia Nacional del Tango",
        confidence: "baja",
        primaryForAffinity: true,
      },
    ],
  },
];

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
  const types = new Set(SYMBOLIC_ENTITIES.map(e => e.type));
  return Array.from(types);
}
