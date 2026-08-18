import type { AtlasEntityInput } from "@/types/atlas";

/**
 * Atlas Visual — España. Todas las fechas son hechos históricos verificables
 * (fundaciones, nacimientos, creaciones) con su fuente. Cero inferencias LLM.
 */

// ─── CIUDADES ─────────────────────────────────────────────
export const CITIES_ESPANA: AtlasEntityInput[] = [
  {
    id: "madrid-es", name: "Madrid", type: "city", country: "España", emoji: "🏙️",
    description: "Capital de España, sede de la Corona y centro político, económico y cultural del país.",
    keyThemes: ["Capital", "Corona", "Cultura", "Centro"],
    sourceNote: "Establecida como capital del Reino en 1561 por Felipe II.",
    events: [
      {
        id: "madrid-es-capital", type: "cambio-nombre", label: "Capital del Reino",
        year: 1561,
        description: "Felipe II fija la Corte en Madrid, convirtiéndola en capital del Imperio español.",
        source: "Ayuntamiento de Madrid — Historia", confidence: "alta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "barcelona", name: "Barcelona", type: "city", country: "España", emoji: "🏖️",
    description: "Capital de Cataluña, gran metrópolis mediterránea y epicentro del modernismo y el arte.",
    keyThemes: ["Mediterráneo", "Modernismo", "Cataluña", "Arte"],
    sourceNote: "Consolidada como ciudad condal medieval; su expansión moderna data de 1854 con el derribo de murallas.",
    events: [
      {
        id: "barcelona-moderna", type: "creacion", label: "Expansión moderna",
        year: 1854,
        description: "Derribo de las murallas de Barcelona, inicio de la expansión (Eixample) de la ciudad moderna.",
        source: "Historia de Barcelona — Ajuntament", confidence: "alta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "valencia", name: "Valencia", type: "city", country: "España", emoji: "🍊",
    description: "Tercera ciudad de España, capital de la Comunidad Valenciana, cuna de la paella y las Fallas.",
    keyThemes: ["Mediterráneo", "Paella", "Fallas", "Huerta"],
    sourceNote: "Conquistada a los musulmanes por Jaime I en 1238.",
    events: [
      {
        id: "valencia-conquista", type: "independencia-consumada", label: "Conquista de Valencia",
        date: "1238-10-09", year: 1238,
        description: "Jaime I de Aragón conquista Valencia a los musulmanes.",
        source: "Historia de Valencia — Generalitat", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "sevilla", name: "Sevilla", type: "city", country: "España", emoji: "💃",
    description: "Capital de Andalucía, ciudad del flamenco y puerto histórico del comercio con América.",
    keyThemes: ["Flamenco", "Andalucía", "Historia", "Río Guadalquivir"],
    sourceNote: "Reconquistada por Fernando III en 1248.",
    events: [
      {
        id: "sevilla-reconquista", type: "independencia-consumada", label: "Reconquista",
        date: "1248-11-23", year: 1248,
        description: "Fernando III de Castilla reconquista Sevilla.",
        source: "Ayuntamiento de Sevilla — Historia", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
];

// ─── CLUBES DE FÚTBOL ─────────────────────────────────────
export const TEAMS_ESPANA: AtlasEntityInput[] = [
  {
    id: "atletico-madrid", name: "Atlético de Madrid", type: "team", country: "España", emoji: "🔴",
    description: "El 'Colchonero', uno de los grandes de España, con una afición apasionada y títulos europeos.",
    keyThemes: ["Colchonero", "Madrid", "Pasión", "Europa"],
    sourceNote: "Fundado el 26 de abril de 1903.",
    events: [
      {
        id: "atleti-fundacion", type: "fundacion", label: "Fundación",
        date: "1903-04-26", year: 1903,
        description: "Se funda el Club Atlético de Madrid.",
        source: "Atlético de Madrid — Historia oficial", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "athletic-bilbao", name: "Athletic Club", type: "team", country: "España", emoji: "⚽",
    description: "El 'Athletic' de Bilbao, famoso por su política de cantera con jugadores vascos.",
    keyThemes: ["Cantera", "Vasco", "Tradición", "Bilbao"],
    sourceNote: "Fundado el 18 de julio de 1898.",
    events: [
      {
        id: "athletic-fundacion", type: "fundacion", label: "Fundación",
        date: "1898-07-18", year: 1898,
        description: "Se funda el Athletic Club en Bilbao.",
        source: "Athletic Club — Historia oficial", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "sevilla-fc", name: "Sevilla FC", type: "team", country: "España", emoji: "⚽",
    description: "El 'Rojiblanco', especialista en la Europa League con un récord histórico de títulos.",
    keyThemes: ["Rojiblanco", "Europa", "Andalucía", "Campeón"],
    sourceNote: "Fundado el 25 de enero de 1890.",
    events: [
      {
        id: "sevilla-fc-fundacion", type: "fundacion", label: "Fundación",
        date: "1890-01-25", year: 1890,
        description: "Se funda el Sevilla Fútbol Club.",
        source: "Sevilla FC — Historia oficial", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "valencia-cf", name: "Valencia CF", type: "team", country: "España", emoji: "🦇",
    description: "Los 'Che', club valenciano con títulos de liga y copas europeas.",
    keyThemes: ["Che", "Valencia", "Campeón", "Europa"],
    sourceNote: "Fundado el 18 de marzo de 1919.",
    events: [
      {
        id: "valencia-cf-fundacion", type: "fundacion", label: "Fundación",
        date: "1919-03-18", year: 1919,
        description: "Se funda el Valencia Club de Fútbol.",
        source: "Valencia CF — Historia oficial", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "real-betis", name: "Real Betis Balompié", type: "team", country: "España", emoji: "🟢",
    description: "El 'Verdiblanco' de Sevilla, con una de las aficiones más fieles de España.",
    keyThemes: ["Verdiblanco", "Sevilla", "Afición", "Historia"],
    sourceNote: "Fundado el 12 de septiembre de 1907.",
    events: [
      {
        id: "betis-fundacion", type: "fundacion", label: "Fundación",
        date: "1907-09-12", year: 1907,
        description: "Se funda el Real Betis Balompié en Sevilla.",
        source: "Real Betis — Historia oficial", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
];

// ─── UNIVERSIDADES ────────────────────────────────────────
export const UNIVERSITIES_ESPANA: AtlasEntityInput[] = [
  {
    id: "complutense", name: "Universidad Complutense de Madrid", type: "university", country: "España", emoji: "🎓",
    description: "La mayor universidad presencial de España, heredera de una tradición académica centenaria.",
    keyThemes: ["Madrid", "Ciencia", "Historia", "Excelencia"],
    sourceNote: "Fundada en 1499 por el Cardenal Cisneros en Alcalá de Henares.",
    events: [
      {
        id: "complutense-fundacion", type: "fundacion", label: "Fundación",
        year: 1499,
        description: "El Cardenal Cisneros funda la Universidad de Alcalá, raíz de la Complutense.",
        source: "Universidad Complutense — Historia", confidence: "alta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "granada", name: "Universidad de Granada", type: "university", country: "España", emoji: "🎓",
    description: "Universidad andaluza con más de 500 años de historia, entre las más antiguas de España.",
    keyThemes: ["Andalucía", "Historia", "Ciencia", "Excelencia"],
    sourceNote: "Fundada el 14 de julio de 1531 por Carlos V.",
    events: [
      {
        id: "granada-univ-fundacion", type: "fundacion", label: "Fundación",
        date: "1531-07-14", year: 1531,
        description: "Carlos V funda la Universidad de Granada.",
        source: "Universidad de Granada — Historia", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "barcelona-univ", name: "Universidad de Barcelona", type: "university", country: "España", emoji: "🎓",
    description: "Universidad pública de Cataluña, referente académico del Mediterráneo.",
    keyThemes: ["Cataluña", "Ciencia", "Mediterráneo", "Pública"],
    sourceNote: "Fundada el 3 de noviembre de 1450.",
    events: [
      {
        id: "ub-fundacion", type: "fundacion", label: "Fundación",
        date: "1450-11-03", year: 1450,
        description: "Se funda la Universidad de Barcelona.",
        source: "Universitat de Barcelona — Historia", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "valladolid", name: "Universidad de Valladolid", type: "university", country: "España", emoji: "🏛️",
    description: "Una de las universidades más antiguas de España, fundada en el siglo XIV.",
    keyThemes: ["Historia", "Castilla", "Derecho", "Excelencia"],
    sourceNote: "Fundada en 1346.",
    events: [
      {
        id: "valladolid-fundacion", type: "fundacion", label: "Fundación",
        year: 1346,
        description: "Se funda el Estudio General de Valladolid.",
        source: "Universidad de Valladolid — Historia", confidence: "media", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "uv-valencia", name: "Universidad de Valencia", type: "university", country: "España", emoji: "🎓",
    description: "La Universitat de València es una de las universidades más antiguas de España, con fuerte tradición en medicina y humanidades.",
    keyThemes: ["Tradición", "Medicina", "Humanismo", "Levante"],
    sourceNote: "Fundada en 1499 por bula papal, sobre la base del Estudi General valenciano.",
    events: [
      {
        id: "uv-fundacion", type: "fundacion", label: "Fundación",
        year: 1499,
        description: "Se funda el Estudi General de Valencia, origen de la Universitat de València.",
        source: "Universitat de València — Historia institucional", confidence: "media", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "uam-espana", name: "Universidad Autónoma de Madrid", type: "university", country: "España", emoji: "🎓",
    description: "La UAM es una de las universidades públicas más prestigiosas de España, referente en ciencias, economía y humanidades.",
    keyThemes: ["Pública", "Excelencia", "Investigación", "Capital"],
    sourceNote: "Fundada en 1968.",
    events: [
      {
        id: "uam-espana-fundacion", type: "fundacion", label: "Fundación",
        year: 1968,
        description: "Se funda la Universidad Autónoma de Madrid, dentro de la reforma universitaria de 1968.",
        source: "Universidad Autónoma de Madrid — Historia institucional", confidence: "media", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "uab", name: "Universidad Autónoma de Barcelona", type: "university", country: "España", emoji: "🎓",
    description: "La UAB es una de las universidades públicas más prestigiosas de Cataluña, con fuerte proyección internacional.",
    keyThemes: ["Pública", "Investigación", "Internacional", "Cataluña"],
    sourceNote: "Fundada en 1968.",
    events: [
      {
        id: "uab-fundacion", type: "fundacion", label: "Fundación",
        year: 1968,
        description: "Se funda la Universidad Autónoma de Barcelona, dentro de la reforma universitaria de 1968.",
        source: "Universidad Autónoma de Barcelona — Historia institucional", confidence: "media", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "comillas", name: "Universidad Pontificia Comillas", type: "university", country: "España", emoji: "🎓",
    description: "Comillas es una universidad jesuita madrileña reconocida por sus programas de derecho, económicas e ingeniería.",
    keyThemes: ["Jesuita", "Humanismo", "Formación", "Capital"],
    sourceNote: "Fundada en 1890.",
    events: [
      {
        id: "comillas-fundacion", type: "fundacion", label: "Fundación",
        year: 1890,
        description: "La Compañía de Jesús funda la Universidad Pontificia Comillas.",
        source: "Universidad Pontificia Comillas — Historia institucional", confidence: "media", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "deusto", name: "Universidad de Deusto", type: "university", country: "España", emoji: "🎓",
    description: "Deusto es una universidad jesuita bilbaína, referente en derecho, negocios y ciencias sociales en el norte de España.",
    keyThemes: ["Jesuita", "Tradición", "Región", "Formación"],
    sourceNote: "Fundada en 1886.",
    events: [
      {
        id: "deusto-fundacion", type: "fundacion", label: "Fundación",
        year: 1886,
        description: "La Compañía de Jesús funda la Universidad de Deusto en Bilbao.",
        source: "Universidad de Deusto — Historia institucional", confidence: "media", primaryForAffinity: true,
      },
    ],
  },
];

// ─── MARCAS ───────────────────────────────────────────────
export const BRANDS_ESPANA: AtlasEntityInput[] = [
  {
    id: "inditex", name: "Inditex", type: "brand", country: "España", emoji: "👗",
    description: "El grupo textil más grande del mundo, propietario de marcas como Zara y Massimo Dutti.",
    keyThemes: ["Moda", "Global", "Zara", "Líder"],
    sourceNote: "Fundado en 1985 por Amancio Ortega.",
    events: [
      {
        id: "inditex-fundacion", type: "fundacion", label: "Fundación",
        year: 1985,
        description: "Se constituye el Grupo Inditex, matriz de Zara.",
        source: "Inditex — Historia corporativa", confidence: "media", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "santander", name: "Banco Santander", type: "brand", country: "España", emoji: "🏦",
    description: "Uno de los mayores bancos del mundo por capitalización, fundado en Santander.",
    keyThemes: ["Banca", "Global", "Líder", "Finanzas"],
    sourceNote: "Fundado el 15 de mayo de 1857 por Real Decreto.",
    events: [
      {
        id: "santander-fundacion", type: "fundacion", label: "Fundación",
        date: "1857-05-15", year: 1857,
        description: "Se funda el Banco de Santander.",
        source: "Banco Santander — Historia", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "telefonica", name: "Telefónica", type: "brand", country: "España", emoji: "📶",
    description: "La compañía de telecomunicaciones más importante de España y referente en Hispanoamérica.",
    keyThemes: ["Telecomunicaciones", "Global", "Conectividad", "Historia"],
    sourceNote: "Fundada el 19 de abril de 1924.",
    events: [
      {
        id: "telefonica-fundacion", type: "fundacion", label: "Fundación",
        date: "1924-04-19", year: 1924,
        description: "Se funda la Compañía Telefónica Nacional de España.",
        source: "Telefónica — Historia corporativa", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "iberia", name: "Iberia", type: "brand", country: "España", emoji: "✈️",
    description: "La aerolínea de bandera de España, miembro fundador de la alianza Oneworld.",
    keyThemes: ["Aviación", "Bandera", "Global", "Historia"],
    sourceNote: "Fundada el 28 de junio de 1927.",
    events: [
      {
        id: "iberia-fundacion", type: "fundacion", label: "Fundación",
        date: "1927-06-28", year: 1927,
        description: "Se funda Iberia, Líneas Aéreas de España.",
        source: "Iberia — Historia corporativa", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
];

// ─── ARTISTAS / PERSONAS ──────────────────────────────────
export const ARTISTS_ESPANA: AtlasEntityInput[] = [
  {
    id: "picasso", name: "Pablo Picasso", type: "artist", country: "España", emoji: "🎨",
    description: "Pintor malagueño, cofundador del cubismo y uno de los artistas más influyentes del siglo XX.",
    keyThemes: ["Cubismo", "Arte", "Pintura", "Vanguardia"],
    sourceNote: "Nacido el 25 de octubre de 1881 en Málaga.",
    events: [
      {
        id: "picasso-nacimiento", type: "creacion", label: "Nacimiento",
        date: "1881-10-25", year: 1881,
        description: "Nace Pablo Ruiz Picasso en Málaga.",
        source: "Biografía — Museo Picasso Málaga", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "dali", name: "Salvador Dalí", type: "artist", country: "España", emoji: "🎨",
    description: "Pintor catalán, figura central del surrealismo, célebre por sus imágenes oníricas.",
    keyThemes: ["Surrealismo", "Arte", "Cataluña", "Vanguardia"],
    sourceNote: "Nacido el 11 de mayo de 1904 en Figueres.",
    events: [
      {
        id: "dali-nacimiento", type: "creacion", label: "Nacimiento",
        date: "1904-05-11", year: 1904,
        description: "Nace Salvador Dalí en Figueres, Girona.",
        source: "Fundació Gala-Salvador Dalí", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "garcia-lorca", name: "Federico García Lorca", type: "artist", country: "España", emoji: "✒️",
    description: "Poeta y dramaturgo granadino, una de las voces más importantes de la Generación del 27.",
    keyThemes: ["Poesía", "Teatro", "Generación del 27", "Granada"],
    sourceNote: "Nacido el 5 de junio de 1898 en Fuente Vaqueros.",
    events: [
      {
        id: "lorca-nacimiento", type: "creacion", label: "Nacimiento",
        date: "1898-06-05", year: 1898,
        description: "Nace Federico García Lorca en Fuente Vaqueros, Granada.",
        source: "Fundación Federico García Lorca", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "rosalia", name: "Rosalía", type: "artist", country: "España", emoji: "🎤",
    description: "Cantante y compositora catalana, ganadora de múltiples Grammys y referente global del pop latino.",
    keyThemes: ["Música", "Flamenco", "Pop", "Global"],
    sourceNote: "Nacida el 25 de septiembre de 1992 en Sant Esteve Sesrovires.",
    events: [
      {
        id: "rosalia-nacimiento", type: "creacion", label: "Nacimiento",
        date: "1992-09-25", year: 1992,
        description: "Nace Rosalía Vila Tobella en Cataluña.",
        source: "Biografía pública — Rosalía", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
];
