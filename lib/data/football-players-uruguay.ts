import type { AtlasEntityInput } from "@/types/atlas";

/**
 * Selección uruguaya de fútbol — jugadores actuales + 3 referentes
 * históricos (piloto de Atlas Personal, category:"actual"/"historico").
 *
 * Actuales: convocatoria oficial al Mundial FIFA 2026 (31 de mayo de 2026),
 * fechas verificadas individualmente en Wikipedia. Facundo Pellistri:
 * confidence "alta" en vez de "exacta" — un primer fetch renderizó el año
 * con un posible error de lectura ("1901"), corregido a 2001 en un segundo
 * fetch pero sin una tercera fuente independiente.
 * Históricos: Diego Forlán, Luis Suárez y Edinson Cavani — verificados en
 * Wikipedia (Balón de Oro del Mundial 2010, goleador histórico, etc.).
 */
export const FOOTBALL_PLAYERS_URUGUAY: AtlasEntityInput[] = [
  {
    id: "uy-jose-maria-gimenez", name: "José María Giménez", type: "football_player", country: "Uruguay",
    emoji: "⚽",
    description: "José María Giménez es defensor y capitán de la selección uruguaya, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Uruguaya", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 20 de enero de 1995. Fuente: Wikipedia; convocatoria AUF Mundial 2026.",
    events: [{ id: "uy-jose-maria-gimenez-nac", type: "creacion", label: "Nacimiento", date: "1995-01-20", year: 1995, description: "José María Giménez nace en Montevideo, Uruguay.", source: "Wikipedia / AUF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "uy-federico-valverde", name: "Federico Valverde", type: "football_player", country: "Uruguay",
    emoji: "⚽",
    description: "Federico Valverde es mediocampista de la selección uruguaya, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Uruguaya", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 22 de julio de 1998. Fuente: Wikipedia; convocatoria AUF Mundial 2026.",
    events: [{ id: "uy-federico-valverde-nac", type: "creacion", label: "Nacimiento", date: "1998-07-22", year: 1998, description: "Federico Valverde nace en Montevideo, Uruguay.", source: "Wikipedia / AUF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "uy-ronald-araujo", name: "Ronald Araújo", type: "football_player", country: "Uruguay",
    emoji: "⚽",
    description: "Ronald Araújo es defensor de la selección uruguaya, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Uruguaya", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 7 de marzo de 1999. Fuente: Wikipedia; convocatoria AUF Mundial 2026.",
    events: [{ id: "uy-ronald-araujo-nac", type: "creacion", label: "Nacimiento", date: "1999-03-07", year: 1999, description: "Ronald Araújo nace en Rivera, Uruguay.", source: "Wikipedia / AUF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "uy-rodrigo-bentancur", name: "Rodrigo Bentancur", type: "football_player", country: "Uruguay",
    emoji: "⚽",
    description: "Rodrigo Bentancur es mediocampista de la selección uruguaya, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Uruguaya", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 25 de junio de 1997. Fuente: Wikipedia; convocatoria AUF Mundial 2026.",
    events: [{ id: "uy-rodrigo-bentancur-nac", type: "creacion", label: "Nacimiento", date: "1997-06-25", year: 1997, description: "Rodrigo Bentancur nace en Nueva Helvecia, Uruguay.", source: "Wikipedia / AUF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "uy-darwin-nunez", name: "Darwin Núñez", type: "football_player", country: "Uruguay",
    emoji: "⚽",
    description: "Darwin Núñez es delantero de la selección uruguaya, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Uruguaya", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 24 de junio de 1999. Fuente: Wikipedia; convocatoria AUF Mundial 2026.",
    events: [{ id: "uy-darwin-nunez-nac", type: "creacion", label: "Nacimiento", date: "1999-06-24", year: 1999, description: "Darwin Núñez nace en Artigas, Uruguay.", source: "Wikipedia / AUF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "uy-manuel-ugarte", name: "Manuel Ugarte", type: "football_player", country: "Uruguay",
    emoji: "⚽",
    description: "Manuel Ugarte es mediocampista de la selección uruguaya, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Uruguaya", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 11 de abril de 2001. Fuente: Wikipedia; convocatoria AUF Mundial 2026.",
    events: [{ id: "uy-manuel-ugarte-nac", type: "creacion", label: "Nacimiento", date: "2001-04-11", year: 2001, description: "Manuel Ugarte nace en Montevideo, Uruguay.", source: "Wikipedia / AUF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "uy-sergio-rochet", name: "Sergio Rochet", type: "football_player", country: "Uruguay",
    emoji: "⚽",
    description: "Sergio Rochet es arquero de la selección uruguaya, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Uruguaya", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 23 de marzo de 1993. Fuente: Wikipedia; convocatoria AUF Mundial 2026.",
    events: [{ id: "uy-sergio-rochet-nac", type: "creacion", label: "Nacimiento", date: "1993-03-23", year: 1993, description: "Sergio Rochet nace en Montevideo, Uruguay.", source: "Wikipedia / AUF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "uy-giorgian-de-arrascaeta", name: "Giorgian de Arrascaeta", type: "football_player", country: "Uruguay",
    emoji: "⚽",
    description: "Giorgian de Arrascaeta es mediocampista de la selección uruguaya, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Uruguaya", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 1 de junio de 1994. Fuente: Wikipedia; convocatoria AUF Mundial 2026.",
    events: [{ id: "uy-giorgian-de-arrascaeta-nac", type: "creacion", label: "Nacimiento", date: "1994-06-01", year: 1994, description: "Giorgian de Arrascaeta nace en Montevideo, Uruguay.", source: "Wikipedia / AUF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "uy-nicolas-de-la-cruz", name: "Nicolás de la Cruz", type: "football_player", country: "Uruguay",
    emoji: "⚽",
    description: "Nicolás de la Cruz es mediocampista de la selección uruguaya, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Uruguaya", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 1 de junio de 1997. Fuente: Wikipedia; convocatoria AUF Mundial 2026.",
    events: [{ id: "uy-nicolas-de-la-cruz-nac", type: "creacion", label: "Nacimiento", date: "1997-06-01", year: 1997, description: "Nicolás de la Cruz nace en Montevideo, Uruguay.", source: "Wikipedia / AUF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "uy-maximiliano-araujo", name: "Maximiliano Araújo", type: "football_player", country: "Uruguay",
    emoji: "⚽",
    description: "Maximiliano Araújo es delantero de la selección uruguaya, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Uruguaya", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 15 de febrero de 2000. Fuente: Wikipedia; convocatoria AUF Mundial 2026.",
    events: [{ id: "uy-maximiliano-araujo-nac", type: "creacion", label: "Nacimiento", date: "2000-02-15", year: 2000, description: "Maximiliano Araújo nace en Uruguay.", source: "Wikipedia / AUF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "uy-facundo-pellistri", name: "Facundo Pellistri", type: "football_player", country: "Uruguay",
    emoji: "⚽",
    description: "Facundo Pellistri es delantero de la selección uruguaya, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Uruguaya", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 20 de diciembre de 2001. Fuente: Wikipedia — un primer fetch mostró una posible lectura errónea del año (\"1901\"), corregida a 2001 en un segundo fetch; sin tercera fuente independiente, de ahí confidence \"alta\" en vez de \"exacta\".",
    events: [{ id: "uy-facundo-pellistri-nac", type: "creacion", label: "Nacimiento", date: "2001-12-20", year: 2001, description: "Facundo Pellistri nace en Montevideo, Uruguay.", source: "Wikipedia / AUF", confidence: "alta", primaryForAffinity: true }],
  },
  {
    id: "uy-diego-forlan", name: "Diego Forlán", type: "football_player", country: "Uruguay",
    emoji: "⚽",
    description: "Diego Forlán ganó el Balón de Oro del Mundial 2010 llevando a Uruguay a semifinales (primera vez desde 1970) y fue campeón de la Copa América 2011.",
    keyThemes: ["Fútbol", "Selección Uruguaya", "Histórico"],
    category: "historico",
    sourceNote: "Nacido el 19 de mayo de 1979. Fuente: Wikipedia.",
    events: [{ id: "uy-diego-forlan-nac", type: "creacion", label: "Nacimiento", date: "1979-05-19", year: 1979, description: "Diego Forlán nace en Montevideo, Uruguay.", source: "Wikipedia", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "uy-luis-suarez", name: "Luis Suárez", type: "football_player", country: "Uruguay",
    emoji: "⚽",
    description: "Luis Suárez es el goleador histórico de la selección uruguaya (69 goles) y campeón de la Copa América 2011.",
    keyThemes: ["Fútbol", "Selección Uruguaya", "Histórico"],
    category: "historico",
    sourceNote: "Nacido el 24 de enero de 1987. Fuente: Wikipedia.",
    events: [{ id: "uy-luis-suarez-nac", type: "creacion", label: "Nacimiento", date: "1987-01-24", year: 1987, description: "Luis Suárez nace en Salto, Uruguay.", source: "Wikipedia", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "uy-edinson-cavani", name: "Edinson Cavani", type: "football_player", country: "Uruguay",
    emoji: "⚽",
    description: "Edinson Cavani es el segundo goleador histórico de la selección uruguaya (58 goles), campeón de la Copa América 2011.",
    keyThemes: ["Fútbol", "Selección Uruguaya", "Histórico"],
    category: "historico",
    sourceNote: "Nacido el 14 de febrero de 1987. Fuente: Wikipedia.",
    events: [{ id: "uy-edinson-cavani-nac", type: "creacion", label: "Nacimiento", date: "1987-02-14", year: 1987, description: "Edinson Cavani nace en Salto, Uruguay.", source: "Wikipedia", confidence: "exacta", primaryForAffinity: true }],
  },
];
