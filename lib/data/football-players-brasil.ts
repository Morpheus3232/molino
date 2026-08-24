import type { AtlasEntityInput } from "@/types/atlas";

/**
 * Selección brasileña de fútbol — jugadores actuales + 3 referentes
 * históricos (piloto de Atlas Personal, category:"actual"/"historico").
 * Antes de este archivo, Brasil tenía solo 2 entidades en todo el Atlas
 * (una ciudad y el país) — este es el primer contenido real del país.
 *
 * Actuales: plantel del Mundial FIFA 2026, confirmado por CBF/Wikipedia.
 * Danilo Luiz da Silva fue excluido por una discrepancia de fecha entre
 * dos lecturas de la misma fuente (15 vs. 16 de julio) sin poder
 * resolverla con una tercera fuente — se prefiere reportarlo como faltante
 * antes que adivinar.
 * Históricos: Pelé, Ronaldo Nazário y Ronaldinho.
 */
export const FOOTBALL_PLAYERS_BRASIL: AtlasEntityInput[] = [
  {
    id: "br-marquinhos", name: "Marquinhos", type: "football_player", country: "Brasil",
    emoji: "⚽",
    description: "Marquinhos es defensor y capitán de la selección brasileña, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Brasileña", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 14 de mayo de 1994. Fuente: Wikipedia; convocatoria CBF Mundial 2026.",
    events: [{ id: "br-marquinhos-nac", type: "creacion", label: "Nacimiento", date: "1994-05-14", year: 1994, description: "Marquinhos (Marcos Aoás Corrêa) nace en São Paulo, Brasil.", source: "Wikipedia / CBF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "br-casemiro", name: "Casemiro", type: "football_player", country: "Brasil",
    emoji: "⚽",
    description: "Casemiro es mediocampista y capitán de la selección brasileña, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Brasileña", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 23 de febrero de 1992. Fuente: Wikipedia; convocatoria CBF Mundial 2026.",
    events: [{ id: "br-casemiro-nac", type: "creacion", label: "Nacimiento", date: "1992-02-23", year: 1992, description: "Casemiro nace en São José dos Campos, Brasil.", source: "Wikipedia / CBF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "br-neymar", name: "Neymar", type: "football_player", country: "Brasil",
    emoji: "⚽",
    description: "Neymar es delantero de la selección brasileña, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Brasileña", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 5 de febrero de 1992. Fuente: Wikipedia; convocatoria CBF Mundial 2026.",
    events: [{ id: "br-neymar-nac", type: "creacion", label: "Nacimiento", date: "1992-02-05", year: 1992, description: "Neymar da Silva Santos Júnior nace en Mogi das Cruzes, Brasil.", source: "Wikipedia / CBF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "br-vinicius-junior", name: "Vinícius Júnior", type: "football_player", country: "Brasil",
    emoji: "⚽",
    description: "Vinícius Júnior es delantero de la selección brasileña, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Brasileña", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 12 de julio de 2000. Fuente: Wikipedia; convocatoria CBF Mundial 2026.",
    events: [{ id: "br-vinicius-junior-nac", type: "creacion", label: "Nacimiento", date: "2000-07-12", year: 2000, description: "Vinícius José Paixão de Oliveira Júnior nace en São Gonçalo, Brasil.", source: "Wikipedia / CBF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "br-raphinha", name: "Raphinha", type: "football_player", country: "Brasil",
    emoji: "⚽",
    description: "Raphinha es delantero de la selección brasileña, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Brasileña", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 14 de diciembre de 1996. Fuente: Wikipedia; convocatoria CBF Mundial 2026.",
    events: [{ id: "br-raphinha-nac", type: "creacion", label: "Nacimiento", date: "1996-12-14", year: 1996, description: "Raphael Dias Belloli nace en Porto Alegre, Brasil.", source: "Wikipedia / CBF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "br-alisson-becker", name: "Alisson Becker", type: "football_player", country: "Brasil",
    emoji: "⚽",
    description: "Alisson Becker es arquero de la selección brasileña, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Brasileña", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 2 de octubre de 1992. Fuente: Wikipedia; convocatoria CBF Mundial 2026.",
    events: [{ id: "br-alisson-becker-nac", type: "creacion", label: "Nacimiento", date: "1992-10-02", year: 1992, description: "Alisson Ramsés Becker nace en Novo Hamburgo, Brasil.", source: "Wikipedia / CBF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "br-bruno-guimaraes", name: "Bruno Guimarães", type: "football_player", country: "Brasil",
    emoji: "⚽",
    description: "Bruno Guimarães es mediocampista de la selección brasileña, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Brasileña", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 16 de noviembre de 1997. Fuente: Wikipedia; convocatoria CBF Mundial 2026.",
    events: [{ id: "br-bruno-guimaraes-nac", type: "creacion", label: "Nacimiento", date: "1997-11-16", year: 1997, description: "Bruno Guimarães Rodriguez Moura nace en Rio de Janeiro, Brasil.", source: "Wikipedia / CBF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "br-gabriel-magalhaes", name: "Gabriel Magalhães", type: "football_player", country: "Brasil",
    emoji: "⚽",
    description: "Gabriel Magalhães es defensor de la selección brasileña, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Brasileña", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 19 de diciembre de 1997. Fuente: Wikipedia; convocatoria CBF Mundial 2026.",
    events: [{ id: "br-gabriel-magalhaes-nac", type: "creacion", label: "Nacimiento", date: "1997-12-19", year: 1997, description: "Gabriel dos Santos Magalhães nace en Salvador, Brasil.", source: "Wikipedia / CBF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "br-gabriel-martinelli", name: "Gabriel Martinelli", type: "football_player", country: "Brasil",
    emoji: "⚽",
    description: "Gabriel Martinelli es delantero de la selección brasileña, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Brasileña", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 18 de junio de 2001. Fuente: Wikipedia; convocatoria CBF Mundial 2026.",
    events: [{ id: "br-gabriel-martinelli-nac", type: "creacion", label: "Nacimiento", date: "2001-06-18", year: 2001, description: "Gabriel Teodoro Martinelli Silva nace en Guarulhos, Brasil.", source: "Wikipedia / CBF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "br-lucas-paqueta", name: "Lucas Paquetá", type: "football_player", country: "Brasil",
    emoji: "⚽",
    description: "Lucas Paquetá es mediocampista de la selección brasileña, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Brasileña", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 27 de agosto de 1997. Fuente: Wikipedia; convocatoria CBF Mundial 2026.",
    events: [{ id: "br-lucas-paqueta-nac", type: "creacion", label: "Nacimiento", date: "1997-08-27", year: 1997, description: "Lucas Tolentino Coelho de Lima nace en Rio de Janeiro, Brasil.", source: "Wikipedia / CBF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "br-endrick", name: "Endrick", type: "football_player", country: "Brasil",
    emoji: "⚽",
    description: "Endrick es delantero de la selección brasileña, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Brasileña", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 21 de julio de 2006. Fuente: Wikipedia; convocatoria CBF Mundial 2026.",
    events: [{ id: "br-endrick-nac", type: "creacion", label: "Nacimiento", date: "2006-07-21", year: 2006, description: "Endrick Felipe Moreira de Sousa nace en Taguatinga, Brasil.", source: "Wikipedia / CBF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "br-alex-sandro", name: "Alex Sandro", type: "football_player", country: "Brasil",
    emoji: "⚽",
    description: "Alex Sandro es defensor de la selección brasileña, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Brasileña", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 26 de enero de 1991. Fuente: Wikipedia; convocatoria CBF Mundial 2026.",
    events: [{ id: "br-alex-sandro-nac", type: "creacion", label: "Nacimiento", date: "1991-01-26", year: 1991, description: "Alex Sandro Lobo Silva nace en Catanduva, Brasil.", source: "Wikipedia / CBF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "br-fabinho", name: "Fabinho", type: "football_player", country: "Brasil",
    emoji: "⚽",
    description: "Fabinho es mediocampista de la selección brasileña, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Brasileña", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 23 de octubre de 1993. Fuente: Wikipedia; convocatoria CBF Mundial 2026.",
    events: [{ id: "br-fabinho-nac", type: "creacion", label: "Nacimiento", date: "1993-10-23", year: 1993, description: "Fábio Henrique Tavares nace en Campinas, Brasil.", source: "Wikipedia / CBF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "br-gleison-bremer", name: "Gleison Bremer", type: "football_player", country: "Brasil",
    emoji: "⚽",
    description: "Gleison Bremer es defensor de la selección brasileña, convocado al Mundial 2026.",
    keyThemes: ["Fútbol", "Selección Brasileña", "Actual"],
    category: "actual",
    sourceNote: "Nacido el 18 de marzo de 1997. Fuente: Wikipedia; convocatoria CBF Mundial 2026.",
    events: [{ id: "br-gleison-bremer-nac", type: "creacion", label: "Nacimiento", date: "1997-03-18", year: 1997, description: "Gleison Bremer Silva Nascimento nace en Itapiranga, Brasil.", source: "Wikipedia / CBF", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "br-pele", name: "Pelé", type: "football_player", country: "Brasil",
    emoji: "⚽",
    description: "Pelé ganó tres Mundiales (1958, 1962, 1970) y es el ícono futbolístico más reconocido globalmente de la historia de Brasil.",
    keyThemes: ["Fútbol", "Selección Brasileña", "Histórico"],
    category: "historico",
    sourceNote: "Nacido el 23 de octubre de 1940. Fuente: Wikipedia.",
    events: [{ id: "br-pele-nac", type: "creacion", label: "Nacimiento", date: "1940-10-23", year: 1940, description: "Edson Arantes do Nascimento \"Pelé\" nace en Três Corações, Brasil.", source: "Wikipedia", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "br-ronaldo-nazario", name: "Ronaldo Nazário", type: "football_player", country: "Brasil",
    emoji: "⚽",
    description: "Ronaldo Nazário ganó dos Mundiales (1994, 2002) y es máximo goleador histórico de Brasil en Copas del Mundo, considerado uno de los mejores delanteros de la historia.",
    keyThemes: ["Fútbol", "Selección Brasileña", "Histórico"],
    category: "historico",
    sourceNote: "Nacido el 18 de septiembre de 1976. Fuente: Wikipedia.",
    events: [{ id: "br-ronaldo-nazario-nac", type: "creacion", label: "Nacimiento", date: "1976-09-18", year: 1976, description: "Ronaldo Luís Nazário de Lima nace en Rio de Janeiro, Brasil.", source: "Wikipedia", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "br-ronaldinho", name: "Ronaldinho", type: "football_player", country: "Brasil",
    emoji: "⚽",
    description: "Ronaldinho fue campeón del Mundial 2002 y dos veces Mejor Jugador del Mundo de la FIFA, uno de los volantes más icónicos de Brasil en los 2000.",
    keyThemes: ["Fútbol", "Selección Brasileña", "Histórico"],
    category: "historico",
    sourceNote: "Nacido el 21 de marzo de 1980. Fuente: Wikipedia.",
    events: [{ id: "br-ronaldinho-nac", type: "creacion", label: "Nacimiento", date: "1980-03-21", year: 1980, description: "Ronaldo de Assis Moreira \"Ronaldinho\" nace en Porto Alegre, Brasil.", source: "Wikipedia", confidence: "exacta", primaryForAffinity: true }],
  },
];
