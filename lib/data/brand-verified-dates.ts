/**
 * Fechas de fundación exactas para marcas que ya estaban en el catálogo con
 * solo el año (2026-11-03). Dos fuentes de acuerdo Y el mismo año que ya
 * tenía el registro: si el año no coincide, no se usa (McLaren, Isuzu y
 * Daimler quedaron afuera por eso). Se aplica sobre la entidad que sobrevive
 * al dedup. La primera parte es generada; las fechas de abajo se cargaron a
 * mano con dos fuentes independientes (no editar sin otra fuente).
 */
export const VERIFIED_BRAND_DATES: Record<string, { date?: string; month?: string; source: string; description?: string }> = {
  "fedex": { date: "1971-05-05", source: "Wikipedia en español y en inglés (Wikidata coincide en el año) (Q459477)" }, // FedEx
  "dominos": { date: "1960-06-10", source: "Wikidata y Wikipedia en español (Q839466)" }, // Domino's
  "hyundai-autos": { date: "1967-12-29", source: "Wikidata y Wikipedia en inglés (Q55931)" }, // Hyundai
  "opel-autos": { date: "1862-01-21", source: "Wikidata y Wikipedia en inglés (Q40966)" }, // Opel
  "kia-autos": { date: "1944-12-11", source: "Wikidata y Wikipedia en español (Q35349)" }, // Kia
  "arcor": { date: "1951-07-05", source: "Wikipedia en español y en inglés (Wikidata coincide en el año) (Q380022)" }, // Arcor
  "nutresa": { date: "1920-04-12", source: "Wikipedia en español y en inglés (Wikidata coincide en el año) (Q5612238)" }, // Grupo Nutresa
  "bancolombia": { date: "1875-01-29", source: "Wikipedia en español y en inglés (Wikidata coincide en el año) (Q806206)" }, // Bancolombia
  // Día exacto de fuentes oficiales o de prensa + otra fuente independiente (2026-11-03).
  "zara": { date: "1975-05-09", source: "FashionUnited y The Objective (apertura de la primera tienda en A Coruña)" },
  "audi-autos": { date: "1909-07-16", source: "Audi MediaCenter y Wikipedia en inglés (August Horch Automobilwerke)" },
  "porsche-autos": { date: "1931-04-25", source: "Porsche Newsroom y Wikipedia en alemán (inscripción en el registro de comercio)" },
  "red-bull": { date: "1987-04-01", source: "redbull.com y Wikipedia en inglés (lanzamiento en Austria)" },
  "land-rover-autos": { date: "1948-04-30", source: "Wikipedia en inglés y HISTORY.com (presentación en el Salón de Ámsterdam)" },
  // Solo mes, desde marzo (campo month): el signo queda determinado.
  "uniqlo": { month: "1949-03", source: "Wikidata y EDINET / Fast Retailing", description: "Hitoshi Yanai abre en Ube, Japón, la tienda Men's Shop OS, origen de la empresa que creó Uniqlo." },
  "cadillac-autos": { month: "1902-08", source: "Wikipedia en inglés y Cadillac Database" },
  "uber": { month: "2009-03", source: "Wikidata y Wikipedia en español" },
  "auto-rivian": { month: "2009-06", source: "Wikidata y Wikipedia en inglés" },
  "ropa-bershka": { month: "1998-04", source: "Wikidata y Wikipedia en español" },
  "juan-valdez": { month: "2002-09", source: "Wikipedia en español y en inglés" },
};
