import type { AtlasEntityInput } from "@/types/atlas";

/**
 * Selección argentina de fútbol — jugadores actuales (piloto de Atlas
 * Personal, category:"football_player"). Los 4 referentes históricos
 * (Maradona, Messi, Riquelme, Sorín) ya existen en artists-argentina.ts —
 * no se duplican acá. Lionel Messi también integra el plantel actual del
 * Mundial 2026, pero se omite de este archivo porque ya existe como
 * histórico ("lionel-messi") — un mismo jugador no se carga dos veces.
 *
 * Fuente de convocatoria: lista oficial de 26 jugadores de AFA para la
 * Copa del Mundo FIFA 2026 (afa.com.ar) + plantilla "Argentina squad 2026
 * FIFA World Cup" de Wikipedia. Fechas de nacimiento verificadas
 * individualmente en la página de Wikipedia de cada jugador.
 */
export const FOOTBALL_PLAYERS_ARGENTINA: AtlasEntityInput[] = [
  {
    id: "ar-emiliano-martinez", name: "Emiliano Martínez", type: "football_player", country: "Argentina",
    emoji: "⚽",
    description: "Emiliano \"Dibu\" Martínez es arquero de la selección argentina, campeón del mundo en 2022.",
    keyThemes: ["Fútbol", "Selección Argentina", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 2 de septiembre de 1992. Fuente: Wikipedia; convocatoria AFA Mundial 2026.",
    events: [{ id: "ar-emiliano-martinez-nac", type: "creacion", label: "Nacimiento", date: "1992-09-02", year: 1992, description: "Emiliano Martínez nace en Mar del Plata, Argentina.", source: "Wikipedia / AFA", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "ar-julian-alvarez", name: "Julián Álvarez", type: "football_player", country: "Argentina",
    emoji: "⚽",
    description: "Julián Álvarez es delantero de la selección argentina, campeón del mundo en 2022.",
    keyThemes: ["Fútbol", "Selección Argentina", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 31 de enero de 2000. Fuente: Wikipedia; convocatoria AFA Mundial 2026.",
    events: [{ id: "ar-julian-alvarez-nac", type: "creacion", label: "Nacimiento", date: "2000-01-31", year: 2000, description: "Julián Álvarez nace en Calchín, Argentina.", source: "Wikipedia / AFA", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "ar-lautaro-martinez", name: "Lautaro Martínez", type: "football_player", country: "Argentina",
    emoji: "⚽",
    description: "Lautaro Martínez es delantero de la selección argentina, campeón del mundo en 2022.",
    keyThemes: ["Fútbol", "Selección Argentina", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 22 de agosto de 1997. Fuente: Wikipedia; convocatoria AFA Mundial 2026.",
    events: [{ id: "ar-lautaro-martinez-nac", type: "creacion", label: "Nacimiento", date: "1997-08-22", year: 1997, description: "Lautaro Martínez nace en Bahía Blanca, Argentina.", source: "Wikipedia / AFA", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "ar-rodrigo-de-paul", name: "Rodrigo De Paul", type: "football_player", country: "Argentina",
    emoji: "⚽",
    description: "Rodrigo De Paul es mediocampista de la selección argentina, campeón del mundo en 2022.",
    keyThemes: ["Fútbol", "Selección Argentina", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 24 de mayo de 1994. Fuente: Wikipedia; convocatoria AFA Mundial 2026.",
    events: [{ id: "ar-rodrigo-de-paul-nac", type: "creacion", label: "Nacimiento", date: "1994-05-24", year: 1994, description: "Rodrigo De Paul nace en Sarandí, Argentina.", source: "Wikipedia / AFA", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "ar-enzo-fernandez", name: "Enzo Fernández", type: "football_player", country: "Argentina",
    emoji: "⚽",
    description: "Enzo Fernández es mediocampista de la selección argentina, campeón del mundo en 2022.",
    keyThemes: ["Fútbol", "Selección Argentina", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 17 de enero de 2001. Fuente: Wikipedia; convocatoria AFA Mundial 2026.",
    events: [{ id: "ar-enzo-fernandez-nac", type: "creacion", label: "Nacimiento", date: "2001-01-17", year: 2001, description: "Enzo Fernández nace en San Martín, Argentina.", source: "Wikipedia / AFA", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "ar-alexis-mac-allister", name: "Alexis Mac Allister", type: "football_player", country: "Argentina",
    emoji: "⚽",
    description: "Alexis Mac Allister es mediocampista de la selección argentina, campeón del mundo en 2022.",
    keyThemes: ["Fútbol", "Selección Argentina", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 24 de diciembre de 1998. Fuente: Wikipedia; convocatoria AFA Mundial 2026.",
    events: [{ id: "ar-alexis-mac-allister-nac", type: "creacion", label: "Nacimiento", date: "1998-12-24", year: 1998, description: "Alexis Mac Allister nace en Santa Rosa, Argentina.", source: "Wikipedia / AFA", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "ar-cristian-romero", name: "Cristian Romero", type: "football_player", country: "Argentina",
    emoji: "⚽",
    description: "Cristian Romero es defensor de la selección argentina, campeón del mundo en 2022.",
    keyThemes: ["Fútbol", "Selección Argentina", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 27 de abril de 1998. Fuente: Wikipedia; convocatoria AFA Mundial 2026.",
    events: [{ id: "ar-cristian-romero-nac", type: "creacion", label: "Nacimiento", date: "1998-04-27", year: 1998, description: "Cristian Romero nace en Córdoba, Argentina.", source: "Wikipedia / AFA", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "ar-nicolas-otamendi", name: "Nicolás Otamendi", type: "football_player", country: "Argentina",
    emoji: "⚽",
    description: "Nicolás Otamendi es defensor de la selección argentina, campeón del mundo en 2022.",
    keyThemes: ["Fútbol", "Selección Argentina", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 12 de febrero de 1988. Fuente: Wikipedia; convocatoria AFA Mundial 2026.",
    events: [{ id: "ar-nicolas-otamendi-nac", type: "creacion", label: "Nacimiento", date: "1988-02-12", year: 1988, description: "Nicolás Otamendi nace en Villa Gobernador Gálvez, Argentina.", source: "Wikipedia / AFA", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "ar-nahuel-molina", name: "Nahuel Molina", type: "football_player", country: "Argentina",
    emoji: "⚽",
    description: "Nahuel Molina es defensor de la selección argentina, campeón del mundo en 2022.",
    keyThemes: ["Fútbol", "Selección Argentina", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 6 de abril de 1998. Fuente: Wikipedia; convocatoria AFA Mundial 2026.",
    events: [{ id: "ar-nahuel-molina-nac", type: "creacion", label: "Nacimiento", date: "1998-04-06", year: 1998, description: "Nahuel Molina nace en Río Cuarto, Argentina.", source: "Wikipedia / AFA", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "ar-lisandro-martinez", name: "Lisandro Martínez", type: "football_player", country: "Argentina",
    emoji: "⚽",
    description: "Lisandro Martínez es defensor de la selección argentina, campeón del mundo en 2022.",
    keyThemes: ["Fútbol", "Selección Argentina", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 18 de enero de 1998. Fuente: Wikipedia; convocatoria AFA Mundial 2026.",
    events: [{ id: "ar-lisandro-martinez-nac", type: "creacion", label: "Nacimiento", date: "1998-01-18", year: 1998, description: "Lisandro Martínez nace en Gualeguay, Argentina.", source: "Wikipedia / AFA", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "ar-exequiel-palacios", name: "Exequiel Palacios", type: "football_player", country: "Argentina",
    emoji: "⚽",
    description: "Exequiel Palacios es mediocampista de la selección argentina, campeón del mundo en 2022.",
    keyThemes: ["Fútbol", "Selección Argentina", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 5 de octubre de 1998. Fuente: Wikipedia; convocatoria AFA Mundial 2026.",
    events: [{ id: "ar-exequiel-palacios-nac", type: "creacion", label: "Nacimiento", date: "1998-10-05", year: 1998, description: "Exequiel Palacios nace en Famaillá, Argentina.", source: "Wikipedia / AFA", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "ar-thiago-almada", name: "Thiago Almada", type: "football_player", country: "Argentina",
    emoji: "⚽",
    description: "Thiago Almada es mediocampista de la selección argentina, convocado al ciclo del Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Argentina", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 26 de abril de 2001. Fuente: Wikipedia; convocatoria AFA Mundial 2026.",
    events: [{ id: "ar-thiago-almada-nac", type: "creacion", label: "Nacimiento", date: "2001-04-26", year: 2001, description: "Thiago Almada nace en Sarandí, Argentina.", source: "Wikipedia / AFA", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "ar-valentin-barco", name: "Valentín Barco", type: "football_player", country: "Argentina",
    emoji: "⚽",
    description: "Valentín Barco es defensor de la selección argentina, convocado al ciclo del Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Argentina", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 23 de julio de 2004. Fuente: Wikipedia; convocatoria AFA Mundial 2026.",
    events: [{ id: "ar-valentin-barco-nac", type: "creacion", label: "Nacimiento", date: "2004-07-23", year: 2004, description: "Valentín Barco nace en Argentina.", source: "Wikipedia / AFA", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "ar-nicolas-gonzalez", name: "Nicolás González", type: "football_player", country: "Argentina",
    emoji: "⚽",
    description: "Nicolás González es delantero de la selección argentina, campeón del mundo en 2022.",
    keyThemes: ["Fútbol", "Selección Argentina", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 6 de abril de 1998. Fuente: Wikipedia; convocatoria AFA Mundial 2026.",
    events: [{ id: "ar-nicolas-gonzalez-nac", type: "creacion", label: "Nacimiento", date: "1998-04-06", year: 1998, description: "Nicolás González nace en Canning, Argentina.", source: "Wikipedia / AFA", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "ar-nicolas-tagliafico", name: "Nicolás Tagliafico", type: "football_player", country: "Argentina",
    emoji: "⚽",
    description: "Nicolás Tagliafico es defensor de la selección argentina, campeón del mundo en 2022.",
    keyThemes: ["Fútbol", "Selección Argentina", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 31 de agosto de 1992. Fuente: Wikipedia; convocatoria AFA Mundial 2026.",
    events: [{ id: "ar-nicolas-tagliafico-nac", type: "creacion", label: "Nacimiento", date: "1992-08-31", year: 1992, description: "Nicolás Tagliafico nace en Rafael Calzada, Argentina.", source: "Wikipedia / AFA", confidence: "exacta", primaryForAffinity: true }],
  },
];
