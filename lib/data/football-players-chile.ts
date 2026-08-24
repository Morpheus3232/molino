import type { AtlasEntityInput } from "@/types/atlas";

/**
 * Selección chilena de fútbol — jugadores actuales + 3 referentes
 * históricos (piloto de Atlas Personal, category:"actual"/"historico").
 *
 * Actuales: nómina de marzo de 2026 vs. Cabo Verde/Nueva Zelanda (Chile no
 * clasificó al Mundial 2026), fechas verificadas en Wikipedia. Rodrigo
 * Echeverría: Wikipedia en inglés es internamente inconsistente entre su
 * infobox (7 abril) y el cuerpo del artículo (17 abril); se usó la versión
 * consistente de Wikipedia en español (7 abril), con confidence "alta" en
 * vez de "exacta" por la discrepancia encontrada.
 * Históricos: Elías Figueroa, Iván Zamorano y Claudio Bravo.
 */
export const FOOTBALL_PLAYERS_CHILE: AtlasEntityInput[] = [
  {
    id: "cl-gabriel-suazo", name: "Gabriel Suazo", type: "football_player", country: "Chile",
    emoji: "⚽",
    description: "Gabriel Suazo es defensor de la selección chilena, convocado a la nómina de 2026.",
    keyThemes: ["Fútbol", "Selección Chilena", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 9 de agosto de 1997. Fuente: Wikipedia; nómina ANFP marzo 2026.",
    events: [{ id: "cl-gabriel-suazo-nac", type: "creacion", label: "Nacimiento", date: "1997-08-09", year: 1997, description: "Gabriel Suazo nace en Chile.", source: "Wikipedia / ANFP", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "cl-guillermo-maripan", name: "Guillermo Maripán", type: "football_player", country: "Chile",
    emoji: "⚽",
    description: "Guillermo Maripán es defensor de la selección chilena, convocado a la nómina de 2026.",
    keyThemes: ["Fútbol", "Selección Chilena", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 6 de mayo de 1994. Fuente: Wikipedia; nómina ANFP marzo 2026.",
    events: [{ id: "cl-guillermo-maripan-nac", type: "creacion", label: "Nacimiento", date: "1994-05-06", year: 1994, description: "Guillermo Maripán nace en Santiago, Chile.", source: "Wikipedia / ANFP", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "cl-igor-lichnovsky", name: "Igor Lichnovsky", type: "football_player", country: "Chile",
    emoji: "⚽",
    description: "Igor Lichnovsky es defensor de la selección chilena, convocado a la nómina de 2026.",
    keyThemes: ["Fútbol", "Selección Chilena", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 7 de marzo de 1994. Fuente: Wikipedia; nómina ANFP marzo 2026.",
    events: [{ id: "cl-igor-lichnovsky-nac", type: "creacion", label: "Nacimiento", date: "1994-03-07", year: 1994, description: "Igor Lichnovsky nace en Santiago, Chile.", source: "Wikipedia / ANFP", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "cl-vicente-pizarro", name: "Vicente Pizarro", type: "football_player", country: "Chile",
    emoji: "⚽",
    description: "Vicente Pizarro es mediocampista de la selección chilena, convocado a la nómina de 2026.",
    keyThemes: ["Fútbol", "Selección Chilena", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 5 de noviembre de 2002. Fuente: Wikipedia; nómina ANFP marzo 2026.",
    events: [{ id: "cl-vicente-pizarro-nac", type: "creacion", label: "Nacimiento", date: "2002-11-05", year: 2002, description: "Vicente Pizarro nace en Chile.", source: "Wikipedia / ANFP", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "cl-rodrigo-echeverria", name: "Rodrigo Echeverría", type: "football_player", country: "Chile",
    emoji: "⚽",
    description: "Rodrigo Echeverría es mediocampista de la selección chilena, convocado a la nómina de 2026.",
    keyThemes: ["Fútbol", "Selección Chilena", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 7 de abril de 1995 según Wikipedia en español (versión consistente); Wikipedia en inglés muestra una discrepancia interna (infobox: 7 abril, cuerpo del artículo: 17 abril) — de ahí confidence \"alta\" en vez de \"exacta\".",
    events: [{ id: "cl-rodrigo-echeverria-nac", type: "creacion", label: "Nacimiento", date: "1995-04-07", year: 1995, description: "Rodrigo Echeverría nace en Chile.", source: "Wikipedia (ES)", confidence: "alta", primaryForAffinity: true }],
  },
  {
    id: "cl-dario-osorio", name: "Darío Osorio", type: "football_player", country: "Chile",
    emoji: "⚽",
    description: "Darío Osorio es delantero de la selección chilena, convocado a la nómina de 2026.",
    keyThemes: ["Fútbol", "Selección Chilena", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 24 de enero de 2004. Fuente: Wikipedia; nómina ANFP marzo 2026.",
    events: [{ id: "cl-dario-osorio-nac", type: "creacion", label: "Nacimiento", date: "2004-01-24", year: 2004, description: "Darío Osorio nace en Chile.", source: "Wikipedia / ANFP", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "cl-benjamin-brereton", name: "Benjamin Brereton Díaz", type: "football_player", country: "Chile",
    emoji: "⚽",
    description: "Benjamin Brereton Díaz es delantero de la selección chilena, convocado a la nómina de 2026.",
    keyThemes: ["Fútbol", "Selección Chilena", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 18 de abril de 1999. Fuente: Wikipedia; nómina ANFP marzo 2026.",
    events: [{ id: "cl-benjamin-brereton-nac", type: "creacion", label: "Nacimiento", date: "1999-04-18", year: 1999, description: "Benjamin Brereton nace en Stoke-on-Trent, Inglaterra (elegible para Chile).", source: "Wikipedia / ANFP", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "cl-benjamin-kuscevic", name: "Benjamín Kuscevic", type: "football_player", country: "Chile",
    emoji: "⚽",
    description: "Benjamín Kuscevic es defensor de la selección chilena, convocado a la nómina de 2026.",
    keyThemes: ["Fútbol", "Selección Chilena", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 2 de mayo de 1996. Fuente: Wikipedia; nómina ANFP marzo 2026.",
    events: [{ id: "cl-benjamin-kuscevic-nac", type: "creacion", label: "Nacimiento", date: "1996-05-02", year: 1996, description: "Benjamín Kuscevic nace en Santiago, Chile.", source: "Wikipedia / ANFP", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "cl-lawrence-vigouroux", name: "Lawrence Vigouroux", type: "football_player", country: "Chile",
    emoji: "⚽",
    description: "Lawrence Vigouroux es arquero de la selección chilena, convocado a la nómina de 2026.",
    keyThemes: ["Fútbol", "Selección Chilena", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 19 de noviembre de 1993. Fuente: Wikipedia; nómina ANFP marzo 2026.",
    events: [{ id: "cl-lawrence-vigouroux-nac", type: "creacion", label: "Nacimiento", date: "1993-11-19", year: 1993, description: "Lawrence Vigouroux nace en Londres, Inglaterra (elegible para Chile).", source: "Wikipedia / ANFP", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "cl-gonzalo-tapia", name: "Gonzalo Tapia", type: "football_player", country: "Chile",
    emoji: "⚽",
    description: "Gonzalo Tapia es delantero de la selección chilena, convocado a la nómina de 2026.",
    keyThemes: ["Fútbol", "Selección Chilena", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 18 de febrero de 2002. Fuente: Wikipedia; nómina ANFP marzo 2026.",
    events: [{ id: "cl-gonzalo-tapia-nac", type: "creacion", label: "Nacimiento", date: "2002-02-18", year: 2002, description: "Gonzalo Tapia nace en Chile.", source: "Wikipedia / ANFP", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "cl-alexander-aravena", name: "Alexander Aravena", type: "football_player", country: "Chile",
    emoji: "⚽",
    description: "Alexander Aravena es delantero de la selección chilena, convocado a la nómina de 2026.",
    keyThemes: ["Fútbol", "Selección Chilena", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 6 de septiembre de 2002. Fuente: Wikipedia; nómina ANFP marzo 2026.",
    events: [{ id: "cl-alexander-aravena-nac", type: "creacion", label: "Nacimiento", date: "2002-09-06", year: 2002, description: "Alexander Aravena nace en Chile.", source: "Wikipedia / ANFP", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "cl-fabian-hormazabal", name: "Fabián Hormazábal", type: "football_player", country: "Chile",
    emoji: "⚽",
    description: "Fabián Hormazábal es defensor de la selección chilena, convocado a la nómina de 2026.",
    keyThemes: ["Fútbol", "Selección Chilena", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 26 de abril de 1996. Fuente: Wikipedia; nómina ANFP marzo 2026.",
    events: [{ id: "cl-fabian-hormazabal-nac", type: "creacion", label: "Nacimiento", date: "1996-04-26", year: 1996, description: "Fabián Hormazábal nace en Chile.", source: "Wikipedia / ANFP", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "cl-felipe-loyola", name: "Felipe Loyola", type: "football_player", country: "Chile",
    emoji: "⚽",
    description: "Felipe Loyola es mediocampista de la selección chilena, convocado a la nómina de 2026.",
    keyThemes: ["Fútbol", "Selección Chilena", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 9 de noviembre de 2000. Fuente: Wikipedia; nómina ANFP marzo 2026.",
    events: [{ id: "cl-felipe-loyola-nac", type: "creacion", label: "Nacimiento", date: "2000-11-09", year: 2000, description: "Felipe Loyola nace en Chile.", source: "Wikipedia / ANFP", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "cl-ivan-roman", name: "Iván Román", type: "football_player", country: "Chile",
    emoji: "⚽",
    description: "Iván Román es defensor de la selección chilena, convocado a la nómina de 2026.",
    keyThemes: ["Fútbol", "Selección Chilena", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 12 de julio de 2006. Fuente: Wikipedia; nómina ANFP marzo 2026.",
    events: [{ id: "cl-ivan-roman-nac", type: "creacion", label: "Nacimiento", date: "2006-07-12", year: 2006, description: "Iván Román nace en Chile.", source: "Wikipedia / ANFP", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "cl-elias-figueroa", name: "Elías Figueroa", type: "football_player", country: "Chile",
    emoji: "⚽",
    description: "Elías Figueroa es considerado el mejor futbolista chileno de la historia, elegido Futbolista Sudamericano del Año tres veces consecutivas (1974-76).",
    keyThemes: ["Fútbol", "Selección Chilena", "Histórico"],
    category: "historico",
    sourceNote: "Nacido el 25 de octubre de 1946. Fuente: Wikipedia.",
    events: [{ id: "cl-elias-figueroa-nac", type: "creacion", label: "Nacimiento", date: "1946-10-25", year: 1946, description: "Elías Figueroa nace en Valparaíso, Chile.", source: "Wikipedia", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "cl-ivan-zamorano", name: "Iván Zamorano", type: "football_player", country: "Chile",
    emoji: "⚽",
    description: "Iván Zamorano fue el emblemático delantero chileno de los años 90, campeón de la Copa UEFA con el Inter y nombrado entre los 100 mejores jugadores vivos por la FIFA.",
    keyThemes: ["Fútbol", "Selección Chilena", "Histórico"],
    category: "historico",
    sourceNote: "Nacido el 18 de enero de 1967. Fuente: Wikipedia.",
    events: [{ id: "cl-ivan-zamorano-nac", type: "creacion", label: "Nacimiento", date: "1967-01-18", year: 1967, description: "Iván Zamorano nace en Santiago, Chile.", source: "Wikipedia", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "cl-claudio-bravo", name: "Claudio Bravo", type: "football_player", country: "Chile",
    emoji: "⚽",
    description: "Claudio Bravo capitaneó a la \"Generación Dorada\" chilena en sus dos primeros títulos mayores: la Copa América 2015 y 2016.",
    keyThemes: ["Fútbol", "Selección Chilena", "Histórico"],
    category: "historico",
    sourceNote: "Nacido el 13 de abril de 1983. Fuente: Wikipedia.",
    events: [{ id: "cl-claudio-bravo-nac", type: "creacion", label: "Nacimiento", date: "1983-04-13", year: 1983, description: "Claudio Bravo nace en Buin, Chile.", source: "Wikipedia", confidence: "exacta", primaryForAffinity: true }],
  },
];
