/**
 * Fechas de fundación exactas para marcas que ya estaban en el catálogo con
 * solo el año (2026-11-03). Dos fuentes de acuerdo Y el mismo año que ya
 * tenía el registro: si el año no coincide, no se usa (McLaren, Isuzu y
 * Daimler quedaron afuera por eso). Se aplica sobre la entidad que sobrevive
 * al dedup. Generado, no editar a mano.
 */
export const VERIFIED_BRAND_DATES: Record<string, { date: string; source: string }> = {
  "fedex": { date: "1971-05-05", source: "Wikipedia en español y en inglés (Wikidata coincide en el año) (Q459477)" }, // FedEx
  "dominos": { date: "1960-06-10", source: "Wikidata y Wikipedia en español (Q839466)" }, // Domino's
  "hyundai-autos": { date: "1967-12-29", source: "Wikidata y Wikipedia en inglés (Q55931)" }, // Hyundai
  "opel-autos": { date: "1862-01-21", source: "Wikidata y Wikipedia en inglés (Q40966)" }, // Opel
  "kia-autos": { date: "1944-12-11", source: "Wikidata y Wikipedia en español (Q35349)" }, // Kia
  "arcor": { date: "1951-07-05", source: "Wikipedia en español y en inglés (Wikidata coincide en el año) (Q380022)" }, // Arcor
  "nutresa": { date: "1920-04-12", source: "Wikipedia en español y en inglés (Wikidata coincide en el año) (Q5612238)" }, // Grupo Nutresa
  "bancolombia": { date: "1875-01-29", source: "Wikipedia en español y en inglés (Wikidata coincide en el año) (Q806206)" }, // Bancolombia
};
