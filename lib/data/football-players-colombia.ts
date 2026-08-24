import type { AtlasEntityInput } from "@/types/atlas";

/**
 * Selección colombiana de fútbol — jugadores actuales + 3 referentes
 * históricos (piloto de Atlas Personal, category:"actual"/"historico").
 * Nota de disambiguación: "Luis Javier Suárez" (delantero colombiano
 * actual, id "co-luis-suarez") NO es la misma persona que "Luis Alberto
 * Suárez" (histórico uruguayo, id "uy-luis-suarez") — ids con prefijo de
 * país para evitar cualquier colisión.
 *
 * Actuales: plantel del Mundial FIFA 2026, confirmado por FCF oficial,
 * fechas verificadas individualmente en Wikipedia.
 * Históricos: Carlos Valderrama, Freddy Rincón y Faustino Asprilla — la
 * generación de los años 90.
 */
export const FOOTBALL_PLAYERS_COLOMBIA: AtlasEntityInput[] = [
  {
    id: "co-james-rodriguez", name: "James Rodríguez", type: "football_player", country: "Colombia",
    emoji: "⚽",
    description: "James Rodríguez es mediocampista de la selección colombiana, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Colombiana", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 12 de julio de 1991. Fuente: Wikipedia; convocatoria FCF Mundial 2026.",
    events: [{ id: "co-james-rodriguez-nac", type: "creacion", label: "Nacimiento", date: "1991-07-12", year: 1991, description: "James Rodríguez nace en Cúcuta, Colombia.", source: "Wikipedia / FCF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "co-luis-diaz", name: "Luis Díaz", type: "football_player", country: "Colombia",
    emoji: "⚽",
    description: "Luis Díaz es delantero de la selección colombiana, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Colombiana", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 13 de enero de 1997. Fuente: Wikipedia; convocatoria FCF Mundial 2026.",
    events: [{ id: "co-luis-diaz-nac", type: "creacion", label: "Nacimiento", date: "1997-01-13", year: 1997, description: "Luis Díaz nace en Barrancas, Colombia.", source: "Wikipedia / FCF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "co-davinson-sanchez", name: "Davinson Sánchez", type: "football_player", country: "Colombia",
    emoji: "⚽",
    description: "Davinson Sánchez es defensor de la selección colombiana, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Colombiana", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 12 de junio de 1996. Fuente: Wikipedia; convocatoria FCF Mundial 2026.",
    events: [{ id: "co-davinson-sanchez-nac", type: "creacion", label: "Nacimiento", date: "1996-06-12", year: 1996, description: "Davinson Sánchez nace en Colombia.", source: "Wikipedia / FCF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "co-yerry-mina", name: "Yerry Mina", type: "football_player", country: "Colombia",
    emoji: "⚽",
    description: "Yerry Mina es defensor de la selección colombiana, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Colombiana", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 23 de septiembre de 1994. Fuente: Wikipedia; convocatoria FCF Mundial 2026.",
    events: [{ id: "co-yerry-mina-nac", type: "creacion", label: "Nacimiento", date: "1994-09-23", year: 1994, description: "Yerry Mina nace en Guachené, Colombia.", source: "Wikipedia / FCF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "co-jefferson-lerma", name: "Jefferson Lerma", type: "football_player", country: "Colombia",
    emoji: "⚽",
    description: "Jefferson Lerma es mediocampista de la selección colombiana, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Colombiana", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 25 de octubre de 1994. Fuente: Wikipedia; convocatoria FCF Mundial 2026.",
    events: [{ id: "co-jefferson-lerma-nac", type: "creacion", label: "Nacimiento", date: "1994-10-25", year: 1994, description: "Jefferson Lerma nace en Colombia.", source: "Wikipedia / FCF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "co-david-ospina", name: "David Ospina", type: "football_player", country: "Colombia",
    emoji: "⚽",
    description: "David Ospina es arquero de la selección colombiana, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Colombiana", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 31 de agosto de 1988. Fuente: Wikipedia; convocatoria FCF Mundial 2026.",
    events: [{ id: "co-david-ospina-nac", type: "creacion", label: "Nacimiento", date: "1988-08-31", year: 1988, description: "David Ospina nace en Medellín, Colombia.", source: "Wikipedia / FCF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "co-richard-rios", name: "Richard Ríos", type: "football_player", country: "Colombia",
    emoji: "⚽",
    description: "Richard Ríos es mediocampista de la selección colombiana, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Colombiana", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 2 de junio de 2000. Fuente: Wikipedia; convocatoria FCF Mundial 2026.",
    events: [{ id: "co-richard-rios-nac", type: "creacion", label: "Nacimiento", date: "2000-06-02", year: 2000, description: "Richard Ríos nace en Colombia.", source: "Wikipedia / FCF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "co-daniel-munoz", name: "Daniel Muñoz", type: "football_player", country: "Colombia",
    emoji: "⚽",
    description: "Daniel Muñoz es defensor de la selección colombiana, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Colombiana", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 26 de mayo de 1996. Fuente: Wikipedia; convocatoria FCF Mundial 2026.",
    events: [{ id: "co-daniel-munoz-nac", type: "creacion", label: "Nacimiento", date: "1996-05-26", year: 1996, description: "Daniel Muñoz nace en Colombia.", source: "Wikipedia / FCF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "co-jhon-arias", name: "Jhon Arias", type: "football_player", country: "Colombia",
    emoji: "⚽",
    description: "Jhon Arias es mediocampista de la selección colombiana, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Colombiana", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 21 de septiembre de 1997. Fuente: Wikipedia; convocatoria FCF Mundial 2026.",
    events: [{ id: "co-jhon-arias-nac", type: "creacion", label: "Nacimiento", date: "1997-09-21", year: 1997, description: "Jhon Arias nace en Colombia.", source: "Wikipedia / FCF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "co-camilo-vargas", name: "Camilo Vargas", type: "football_player", country: "Colombia",
    emoji: "⚽",
    description: "Camilo Vargas es arquero de la selección colombiana, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Colombiana", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 9 de marzo de 1989. Fuente: Wikipedia; convocatoria FCF Mundial 2026.",
    events: [{ id: "co-camilo-vargas-nac", type: "creacion", label: "Nacimiento", date: "1989-03-09", year: 1989, description: "Camilo Vargas nace en Colombia.", source: "Wikipedia / FCF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "co-juan-fernando-quintero", name: "Juan Fernando Quintero", type: "football_player", country: "Colombia",
    emoji: "⚽",
    description: "Juan Fernando Quintero es mediocampista de la selección colombiana, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Colombiana", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 18 de enero de 1993. Fuente: Wikipedia; convocatoria FCF Mundial 2026.",
    events: [{ id: "co-juan-fernando-quintero-nac", type: "creacion", label: "Nacimiento", date: "1993-01-18", year: 1993, description: "Juan Fernando Quintero nace en Colombia.", source: "Wikipedia / FCF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "co-luis-suarez", name: "Luis Javier Suárez", type: "football_player", country: "Colombia",
    emoji: "⚽",
    description: "Luis Javier Suárez es delantero de la selección colombiana, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Colombiana", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 2 de diciembre de 1997. Fuente: Wikipedia; convocatoria FCF Mundial 2026. No confundir con el histórico uruguayo Luis Alberto Suárez (id uy-luis-suarez).",
    events: [{ id: "co-luis-suarez-nac", type: "creacion", label: "Nacimiento", date: "1997-12-02", year: 1997, description: "Luis Javier Suárez Charris nace en Colombia.", source: "Wikipedia / FCF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "co-santiago-arias", name: "Santiago Arias", type: "football_player", country: "Colombia",
    emoji: "⚽",
    description: "Santiago Arias es defensor de la selección colombiana, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Colombiana", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 13 de enero de 1992. Fuente: Wikipedia; convocatoria FCF Mundial 2026.",
    events: [{ id: "co-santiago-arias-nac", type: "creacion", label: "Nacimiento", date: "1992-01-13", year: 1992, description: "Santiago Arias nace en Colombia.", source: "Wikipedia / FCF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "co-carlos-valderrama", name: "Carlos Valderrama", type: "football_player", country: "Colombia",
    emoji: "⚽",
    description: "Carlos Valderrama es el capitán y volante icónico de la generación colombiana de los años 90, considerado el mejor jugador de la historia del país.",
    keyThemes: ["Fútbol", "Selección Colombiana", "Histórico"],
    category: "historico",
    sourceNote: "Nacido el 2 de septiembre de 1961. Fuente: Wikipedia.",
    events: [{ id: "co-carlos-valderrama-nac", type: "creacion", label: "Nacimiento", date: "1961-09-02", year: 1961, description: "Carlos Valderrama nace en Santa Marta, Colombia.", source: "Wikipedia", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "co-freddy-rincon", name: "Freddy Rincón", type: "football_player", country: "Colombia",
    emoji: "⚽",
    description: "Freddy Rincón marcó el dramático gol del empate ante Alemania Occidental en el Mundial 1990 y jugó tres Mundiales con Colombia.",
    keyThemes: ["Fútbol", "Selección Colombiana", "Histórico"],
    category: "historico",
    sourceNote: "Nacido el 14 de agosto de 1966. Fuente: Wikipedia.",
    events: [{ id: "co-freddy-rincon-nac", type: "creacion", label: "Nacimiento", date: "1966-08-14", year: 1966, description: "Freddy Rincón nace en Buenaventura, Colombia.", source: "Wikipedia", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "co-faustino-asprilla", name: "Faustino Asprilla", type: "football_player", country: "Colombia",
    emoji: "⚽",
    description: "Faustino Asprilla fue una figura clave de los planteles colombianos de los Mundiales 1994 y 1998.",
    keyThemes: ["Fútbol", "Selección Colombiana", "Histórico"],
    category: "historico",
    sourceNote: "Nacido el 10 de noviembre de 1969. Fuente: Wikipedia.",
    events: [{ id: "co-faustino-asprilla-nac", type: "creacion", label: "Nacimiento", date: "1969-11-10", year: 1969, description: "Faustino Asprilla nace en Tuluá, Colombia.", source: "Wikipedia", confidence: "exacta", primaryForAffinity: true }],
  },
];
