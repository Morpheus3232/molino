import type { AtlasEntityInput } from "@/types/atlas";

/**
 * Atlas Visual — México. Todas las fechas son hechos históricos verificables
 * (fundaciones, nacimientos, creaciones) con su fuente. Cero inferencias LLM.
 */

// ─── CIUDADES ─────────────────────────────────────────────
export const CITIES_MEXICO: AtlasEntityInput[] = [
  {
    id: "cdmx", name: "Ciudad de México", type: "city", country: "México", emoji: "🇲🇽",
    description: "Capital del país, construida sobre las ruinas de Tenochtitlan. Una de las megalópolis más grandes del mundo.",
    keyThemes: ["Historia", "Cultura", "Megaciudad", "Centro"],
    sourceNote: "Fundada por los españoles en 1521 sobre Tenochtitlan.",
    events: [
      {
        id: "cdmx-fundacion", type: "fundacion", label: "Fundación sobre Tenochtitlan",
        date: "1521-08-13", year: 1521,
        description: "Cae Tenochtitlan y se inicia la construcción de la Ciudad de México sobre sus ruinas.",
        source: "Historia de la Ciudad de México — Archivo Histórico CDMX", confidence: "alta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "guadalajara", name: "Guadalajara", type: "city", country: "México", emoji: "🇲🇽",
    description: "Capital de Jalisco, cuna de la música de mariachi y el tequila. Segunda ciudad más poblada de México.",
    keyThemes: ["Mariachi", "Tequila", "Tradición", "Jalisco"],
    sourceNote: "Fundada en 1542 por orden de la Corona española.",
    events: [
      {
        id: "guadalajara-fundacion", type: "fundacion", label: "Fundación",
        date: "1542-02-14", year: 1542,
        description: "Fundación definitiva de Guadalajara en el Valle de Atemajac.",
        source: "Ayuntamiento de Guadalajara — Historia", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "monterrey", name: "Monterrey", type: "city", country: "México", emoji: "🇲🇽",
    description: "Capital industrial de Nuevo León, conocida como la 'Sultana del Norte' por su pujanza económica.",
    keyThemes: ["Industria", "Norte", "Negocios", "Montaña"],
    sourceNote: "Fundada en 1596 como Ciudad Metropolitana de Nuestra Señora de Monterrey.",
    events: [
      {
        id: "monterrey-fundacion", type: "fundacion", label: "Fundación",
        date: "1596-09-20", year: 1596,
        description: "Fundación de la Ciudad Metropolitana de Nuestra Señora de Monterrey.",
        source: "Gobierno de Nuevo León — Historia de Monterrey", confidence: "alta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "puebla", name: "Puebla de Zaragoza", type: "city", country: "México", emoji: "🇲🇽",
    description: "Ciudad colonial Patrimonio de la Humanidad, famosa por su gastronomía y arquitectura barroca.",
    keyThemes: ["Barroco", "Gastronomía", "Patrimonio", "Colonial"],
    sourceNote: "Fundada en 1531 como Puebla de los Ángeles.",
    events: [
      {
        id: "puebla-fundacion", type: "fundacion", label: "Fundación",
        date: "1531-04-16", year: 1531,
        description: "Fundación de la Puebla de los Ángeles.",
        source: "Ayuntamiento de Puebla — Historia", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
];

// ─── CLUBES DE FÚTBOL ─────────────────────────────────────
export const TEAMS_MEXICO: AtlasEntityInput[] = [
  {
    id: "club-america", name: "Club América", type: "team", country: "México", emoji: "🦅",
    description: "El 'Águila' más laureado del fútbol mexicano, ganador de múltiples títulos de liga y de Concacaf.",
    keyThemes: ["Águila", "Campeón", "Títulos", "Azulcrema"],
    sourceNote: "Fundado el 12 de octubre de 1916.",
    events: [
      {
        id: "america-fundacion", type: "fundacion", label: "Fundación",
        date: "1916-10-12", year: 1916,
        description: "Se funda el Club de Fútbol América en la Ciudad de México.",
        source: "Club América — Historia oficial", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "guadalajara-chivas", name: "Club Deportivo Guadalajara", type: "team", country: "México", emoji: "⚽",
    description: "Las 'Chivas Rayadas del Guadalajara', famosas por jugar históricamente solo con jugadores mexicanos.",
    keyThemes: ["Chivas", "Cantera", "México", "Tradición"],
    sourceNote: "Fundado el 8 de mayo de 1906.",
    events: [
      {
        id: "chivas-fundacion", type: "fundacion", label: "Fundación",
        date: "1906-05-08", year: 1906,
        description: "Se funda el Club Deportivo Guadalajara.",
        source: "Chivas — Historia oficial", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "cruz-azul", name: "Cruz Azul", type: "team", country: "México", emoji: "🔵",
    description: "La 'Máquina Cementera', fundada por trabajadores de la Cooperativa La Cruz Azul.",
    keyThemes: ["Cementero", "Máquina", "Cooperativa", "Azul"],
    sourceNote: "Fundado el 22 de mayo de 1927 como equipo de la cooperativa cementera.",
    events: [
      {
        id: "cruz-azul-fundacion", type: "fundacion", label: "Fundación",
        date: "1927-05-22", year: 1927,
        description: "Trabajadores de la Cooperativa La Cruz Azul fundan el club en Jasso, Hidalgo.",
        source: "Cruz Azul — Historia oficial", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "pumas-unam", name: "Club Universidad Nacional", type: "team", country: "México", emoji: "🐾",
    description: "Los 'Pumas de la UNAM', el club universitario más importante de México, campeón en México y Concacaf.",
    keyThemes: ["Universitario", "Puma", "UNAM", "Cantera"],
    sourceNote: "Fundado el 2 de agosto de 1954.",
    events: [
      {
        id: "pumas-fundacion", type: "fundacion", label: "Fundación",
        date: "1954-08-02", year: 1954,
        description: "Se funda el Club Universidad Nacional (Pumas de la UNAM).",
        source: "Club Universidad Nacional — Historia oficial", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "toluca", name: "Deportivo Toluca", type: "team", country: "México", emoji: "🔴",
    description: "Los 'Diablos Rojos del Toluca', uno de los clubes más ganadores del fútbol mexicano moderno.",
    keyThemes: ["Diablo", "Campeón", "Rojo", "Centro"],
    sourceNote: "Fundado el 12 de febrero de 1917.",
    events: [
      {
        id: "toluca-fundacion", type: "fundacion", label: "Fundación",
        date: "1917-02-12", year: 1917,
        description: "Se funda el Deportivo Toluca.",
        source: "Deportivo Toluca — Historia oficial", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
];

// ─── UNIVERSIDADES ────────────────────────────────────────
export const UNIVERSITIES_MEXICO: AtlasEntityInput[] = [
  {
    id: "unam", name: "Universidad Nacional Autónoma de México", type: "university", country: "México", emoji: "🎓",
    description: "La UNAM es la universidad más grande e importante de México y Latinoamérica, con 4 premios Nobel.",
    keyThemes: ["Autonomía", "Ciencia", "Cultura", "Máxima Casa de Estudios"],
    sourceNote: "Fundada el 21 de septiembre de 1551 como Real y Pontificia Universidad de México.",
    events: [
      {
        id: "unam-fundacion", type: "fundacion", label: "Fundación",
        date: "1551-09-21", year: 1551,
        description: "Carlos V firma la cédula que crea la Real y Pontificia Universidad de México, origen de la UNAM.",
        source: "UNAM — Historia institucional", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "ipn", name: "Instituto Politécnico Nacional", type: "university", country: "México", emoji: "🔧",
    description: "El 'Poli', institución técnica de referencia para la formación de ingenieros y científicos en México.",
    keyThemes: ["Técnica", "Ingeniería", "Ciencia", "Público"],
    sourceNote: "Fundado el 1 de enero de 1936.",
    events: [
      {
        id: "ipn-fundacion", type: "fundacion", label: "Fundación",
        date: "1936-01-01", year: 1936,
        description: "Se funda el Instituto Politécnico Nacional.",
        source: "IPN — Historia institucional", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "itesm", name: "Tecnológico de Monterrey", type: "university", country: "México", emoji: "🎓",
    description: "El Tec de Monterrey, institución privada de referencia en ingeniería y negocios en Latinoamérica.",
    keyThemes: ["Tecnología", "Innovación", "Negocios", "Privado"],
    sourceNote: "Fundado el 6 de septiembre de 1943 por Eugenio Garza Sada.",
    events: [
      {
        id: "itesm-fundacion", type: "fundacion", label: "Fundación",
        date: "1943-09-06", year: 1943,
        description: "Se funda el Instituto Tecnológico y de Estudios Superiores de Monterrey.",
        source: "Tecnológico de Monterrey — Historia", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "uam", name: "Universidad Autónoma Metropolitana", type: "university", country: "México", emoji: "🏛️",
    description: "La UAM, institución pública de la Ciudad de México creada para descentralizar la educación superior.",
    keyThemes: ["Pública", "Metropolitana", "Ciencia", "Autonomía"],
    sourceNote: "Creada el 1 de enero de 1974 por decreto presidencial.",
    events: [
      {
        id: "uam-creacion", type: "creacion", label: "Creación",
        date: "1974-01-01", year: 1974,
        description: "Se crea la Universidad Autónoma Metropolitana.",
        source: "UAM — Historia institucional", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "udg", name: "Universidad de Guadalajara", type: "university", country: "México", emoji: "🎓",
    description: "La UdeG es una de las universidades públicas más grandes de México, eje académico y cultural del occidente del país.",
    keyThemes: ["Región", "Cultura", "Pública", "Tradición"],
    sourceNote: "Refundada el 12 de mayo de 1925, sobre la base de la universidad colonial de 1791.",
    events: [
      {
        id: "udg-fundacion", type: "fundacion", label: "Refundación",
        date: "1925-05-12", year: 1925,
        description: "Se refunda la Universidad de Guadalajara en su forma moderna.",
        source: "Universidad de Guadalajara — Historia institucional", confidence: "media", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "ibero", name: "Universidad Iberoamericana", type: "university", country: "México", emoji: "🎓",
    description: "La Ibero es una universidad jesuita privada, reconocida por sus programas de comunicación, diseño y ciencias sociales.",
    keyThemes: ["Jesuita", "Humanismo", "Comunicación", "Privada"],
    sourceNote: "Fundada en 1943 por la Compañía de Jesús. Fecha exacta no documentada públicamente; se usa el año.",
    events: [
      {
        id: "ibero-fundacion", type: "fundacion", label: "Fundación",
        year: 1943,
        description: "La Compañía de Jesús funda la Universidad Iberoamericana.",
        source: "Universidad Iberoamericana — Historia institucional", confidence: "media", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "uanl", name: "Universidad Autónoma de Nuevo León", type: "university", country: "México", emoji: "🎓",
    description: "La UANL es la principal universidad pública del norte de México, con fuerte presencia en ingeniería y medicina.",
    keyThemes: ["Región", "Autonomía", "Pública", "Formación"],
    sourceNote: "Fundada en 1933 como Universidad de Nuevo León. Fecha exacta no documentada de forma unívoca; se usa el año.",
    events: [
      {
        id: "uanl-fundacion", type: "fundacion", label: "Fundación",
        year: 1933,
        description: "Se funda la Universidad de Nuevo León, origen de la UANL.",
        source: "UANL — Historia institucional", confidence: "media", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "buap", name: "Benemérita Universidad Autónoma de Puebla", type: "university", country: "México", emoji: "🎓",
    description: "La BUAP es una de las universidades públicas más antiguas de México, con fuerte tradición humanista y científica.",
    keyThemes: ["Tradición", "Autonomía", "Humanismo", "Pública"],
    sourceNote: "Origen colonial en 1587; adopta autonomía y su nombre actual en 1956. Fecha exacta no documentada de forma unívoca; se usa el año.",
    events: [
      {
        id: "buap-fundacion", type: "fundacion", label: "Autonomía universitaria",
        year: 1956,
        description: "La universidad poblana adopta su régimen autónomo y el nombre de BUAP.",
        source: "BUAP — Historia institucional", confidence: "media", primaryForAffinity: true,
      },
    ],
  },
];

// ─── MARCAS ───────────────────────────────────────────────
export const BRANDS_MEXICO: AtlasEntityInput[] = [
  {
    id: "bimbo", name: "Grupo Bimbo", type: "brand", country: "México", emoji: "🍞",
    description: "La panificadora más grande del mundo, líder global en pan de caja y productos de panadería.",
    keyThemes: ["Pan", "Global", "Líder", "Alimentación"],
    sourceNote: "Fundada el 2 de diciembre de 1945 en Ciudad de México.",
    events: [
      {
        id: "bimbo-fundacion", type: "fundacion", label: "Fundación",
        date: "1945-12-02", year: 1945,
        description: "Se funda el Grupo Bimbo en la Ciudad de México.",
        source: "Grupo Bimbo — Historia oficial", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "grupo-modelo", name: "Grupo Modelo", type: "brand", country: "México", emoji: "🍺",
    description: "Cervecería mexicana creadora de la marca Corona, una de las cervezas más vendidas del mundo.",
    keyThemes: ["Cerveza", "Corona", "Exportación", "Tradición"],
    sourceNote: "Fundada el 25 de octubre de 1925.",
    events: [
      {
        id: "modelo-fundacion", type: "fundacion", label: "Fundación",
        date: "1925-10-25", year: 1925,
        description: "Se funda el Grupo Modelo en la Ciudad de México.",
        source: "Grupo Modelo — Historia oficial", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "telmex", name: "Telmex", type: "brand", country: "México", emoji: "📞",
    description: "Teléfonos de México, la empresa telefónica que monopolizó las telecomunicaciones mexicanas por décadas.",
    keyThemes: ["Telecomunicaciones", "Teléfono", "Carlos Slim", "Historia"],
    sourceNote: "Constituida el 23 de diciembre de 1947.",
    events: [
      {
        id: "telmex-creacion", type: "creacion", label: "Constitución",
        date: "1947-12-23", year: 1947,
        description: "Se constituye Teléfonos de México (Telmex).",
        source: "Telmex — Historia corporativa", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "aero-mexico", name: "Aeroméxico", type: "brand", country: "México", emoji: "✈️",
    description: "Aeroméxico, la aerolínea de bandera de México y miembro fundador de la alianza SkyTeam.",
    keyThemes: ["Aviación", "Bandera", "Global", "Viajes"],
    sourceNote: "Fundada el 14 de septiembre de 1934 como Aeronaves de México.",
    events: [
      {
        id: "aeromexico-fundacion", type: "fundacion", label: "Fundación",
        date: "1934-09-14", year: 1934,
        description: "Se funda Aeronaves de México, origen de Aeroméxico.",
        source: "Aeroméxico — Historia corporativa", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
];

// ─── ARTISTAS / PERSONAS ──────────────────────────────────
export const ARTISTS_MEXICO: AtlasEntityInput[] = [
  {
    id: "octavio-paz", name: "Octavio Paz", type: "artist", country: "México", emoji: "✒️",
    description: "Poeta y ensayista mexicano, Premio Nobel de Literatura 1990, autor de 'El laberinto de la soledad'.",
    keyThemes: ["Poesía", "Ensayo", "Nobel", "Literatura"],
    sourceNote: "Nacido el 31 de marzo de 1914 en la Ciudad de México.",
    events: [
      {
        id: "paz-nacimiento", type: "creacion", label: "Nacimiento",
        date: "1914-03-31", year: 1914,
        description: "Nace Octavio Paz en la Ciudad de México.",
        source: "Biografía oficial — Nobel Prize", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "diego-rivera", name: "Diego Rivera", type: "artist", country: "México", emoji: "🎨",
    description: "Muralista mexicano, figura central del movimiento muralista y del arte mexicano del siglo XX.",
    keyThemes: ["Muralismo", "Arte", "Revolución", "Historia"],
    sourceNote: "Nacido el 8 de diciembre de 1886 en Guanajuato.",
    events: [
      {
        id: "rivera-nacimiento", type: "creacion", label: "Nacimiento",
        date: "1886-12-08", year: 1886,
        description: "Nace Diego Rivera en Guanajuato.",
        source: "Biografía — Museo Diego Rivera", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "carlos-santana", name: "Carlos Santana", type: "artist", country: "México", emoji: "🎸",
    description: "Guitarrista mexicano-estadounidense, leyenda del rock latino y de la fusión de géneros.",
    keyThemes: ["Guitarra", "Rock", "Fusión", "Leyenda"],
    sourceNote: "Nacido el 20 de julio de 1947 en Autlán de Navarro, Jalisco.",
    events: [
      {
        id: "santana-nacimiento", type: "creacion", label: "Nacimiento",
        date: "1947-07-20", year: 1947,
        description: "Nace Carlos Santana en Jalisco, México.",
        source: "Biografía oficial — Santana", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "frida", name: "Frida Kahlo", type: "artist", country: "México", emoji: "🎨",
    description: "Pintora mexicana, ícono del arte y de la identidad mexicana, reconocida mundialmente.",
    keyThemes: ["Pintura", "Identidad", "Vanguardia", "México"],
    sourceNote: "Nacida el 6 de julio de 1907 en Coyoacán.",
    events: [
      {
        id: "frida-nacimiento", type: "creacion", label: "Nacimiento",
        date: "1907-07-06", year: 1907,
        description: "Nace Frida Kahlo en Coyoacán, Ciudad de México.",
        source: "Museo Frida Kahlo — Casa Azul", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
];
