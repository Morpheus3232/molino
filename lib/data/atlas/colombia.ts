import type { AtlasEntityInput } from "@/types/atlas";

/**
 * Atlas Visual — Colombia. Todas las fechas son hechos históricos verificables
 * (fundaciones, nacimientos, creaciones) con su fuente. Cero inferencias LLM.
 */

// ─── CIUDADES ─────────────────────────────────────────────
export const CITIES_COLOMBIA: AtlasEntityInput[] = [
  {
    id: "bogota-col", name: "Bogotá", type: "city", country: "Colombia", emoji: "🏙️",
    description: "Capital de Colombia, fundada sobre el altiplano cundiboyacense. Centro político y cultural del país.",
    keyThemes: ["Capital", "Andes", "Cultura", "Centro"],
    sourceNote: "Fundada el 6 de agosto de 1538 por Gonzalo Jiménez de Quesada.",
    events: [
      {
        id: "bogota-col-fundacion", type: "fundacion", label: "Fundación",
        date: "1538-08-06", year: 1538,
        description: "Gonzalo Jiménez de Quesada funda Santa Fe de Bogotá.",
        source: "Historia de Bogotá — Alcaldía Mayor", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "medellin", name: "Medellín", type: "city", country: "Colombia", emoji: "🌄",
    description: "Capital de Antioquia, conocida como la 'Ciudad de la Eterna Primavera' y hub de innovación.",
    keyThemes: ["Antioquia", "Innovación", "Montaña", "Transformación"],
    sourceNote: "Fundada el 2 de noviembre de 1675.",
    events: [
      {
        id: "medellin-fundacion", type: "fundacion", label: "Fundación",
        date: "1675-11-02", year: 1675,
        description: "Se funda el Valle de San Lorenzo de Aburrá, origen de Medellín.",
        source: "Alcaldía de Medellín — Historia", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "cali", name: "Cali", type: "city", country: "Colombia", emoji: "🌴",
    description: "Capital del Valle del Cauca y capital mundial de la salsa. Centro económico del suroccidente.",
    keyThemes: ["Salsa", "Valle", "Tropical", "Deporte"],
    sourceNote: "Fundada el 25 de julio de 1536 por Sebastián de Belalcázar.",
    events: [
      {
        id: "cali-fundacion", type: "fundacion", label: "Fundación",
        date: "1536-07-25", year: 1536,
        description: "Sebastián de Belalcázar funda Santiago de Cali.",
        source: "Alcaldía de Cali — Historia", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "cartagena", name: "Cartagena de Indias", type: "city", country: "Colombia", emoji: "⚓",
    description: "Ciudad amurallada del Caribe colombiano, Patrimonio de la Humanidad y joya colonial.",
    keyThemes: ["Colonial", "Caribe", "Murallas", "Patrimonio"],
    sourceNote: "Fundada el 1 de junio de 1533 por Pedro de Heredia.",
    events: [
      {
        id: "cartagena-fundacion", type: "fundacion", label: "Fundación",
        date: "1533-06-01", year: 1533,
        description: "Pedro de Heredia funda Cartagena de Indias.",
        source: "Alcaldía de Cartagena — Historia", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
];

// ─── CLUBES DE FÚTBOL ─────────────────────────────────────
export const TEAMS_COLOMBIA: AtlasEntityInput[] = [
  {
    id: "atletico-nacional", name: "Atlético Nacional", type: "team", country: "Colombia", emoji: "🦁",
    description: "El 'Rey de Copas' de Colombia, uno de los clubes más laureados y ganador de la Copa Libertadores 1989 y 2016.",
    keyThemes: ["Verdolaga", "Campeón", "Libertadores", "Historia"],
    sourceNote: "Fundado el 30 de abril de 1947.",
    events: [
      {
        id: "nacional-fundacion", type: "fundacion", label: "Fundación",
        date: "1947-04-30", year: 1947,
        description: "Se funda el Atlético Nacional en Medellín.",
        source: "Atlético Nacional — Historia oficial", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "millonarios", name: "Millonarios", type: "team", country: "Colombia", emoji: "⚽",
    description: "El 'Ballet Azul' de Bogotá, club que marcó época con Alfredo Di Stéfano en los años 50.",
    keyThemes: ["Ballet Azul", "Bogotá", "Historia", "Campeón"],
    sourceNote: "Fundado el 18 de junio de 1946.",
    events: [
      {
        id: "millonarios-fundacion", type: "fundacion", label: "Fundación",
        date: "1946-06-18", year: 1946,
        description: "Se funda el Club Deportivo Los Millonarios en Bogotá.",
        source: "Millonarios — Historia oficial", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "america-cali", name: "América de Cali", type: "team", country: "Colombia", emoji: "🔴",
    description: "Los 'Diablos Rojos', campeones invictos de la Copa Libertadores 1996, un hito histórico.",
    keyThemes: ["Diablo", "Cali", "Rojo", "Campeón"],
    sourceNote: "Fundado el 13 de febrero de 1927.",
    events: [
      {
        id: "america-cali-fundacion", type: "fundacion", label: "Fundación",
        date: "1927-02-13", year: 1927,
        description: "Se funda la Sociedad Deportiva América en Cali.",
        source: "América de Cali — Historia oficial", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "santa-fe", name: "Independiente Santa Fe", type: "team", country: "Colombia", emoji: "🔴",
    description: "Uno de los clubes más antiguos de Colombia, campeón de la Copa Sudamericana 2015.",
    keyThemes: ["Cardenal", "Bogotá", "Historia", "Sudamericana"],
    sourceNote: "Fundado el 28 de febrero de 1941.",
    events: [
      {
        id: "santa-fe-fundacion", type: "fundacion", label: "Fundación",
        date: "1941-02-28", year: 1941,
        description: "Se funda el Club Independiente Santa Fe en Bogotá.",
        source: "Santa Fe — Historia oficial", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "junior", name: "Junior de Barranquilla", type: "team", country: "Colombia", emoji: "🦈",
    description: "Los 'Tiburones' de la costa Caribe, el club más querido del litoral colombiano.",
    keyThemes: ["Tiburón", "Caribe", "Barranquilla", "Pasión"],
    sourceNote: "Fundado el 7 de agosto de 1924.",
    events: [
      {
        id: "junior-fundacion", type: "fundacion", label: "Fundación",
        date: "1924-08-07", year: 1924,
        description: "Se funda el Junior de Barranquilla.",
        source: "Junior de Barranquilla — Historia oficial", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
];

// ─── UNIVERSIDADES ────────────────────────────────────────
export const UNIVERSITIES_COLOMBIA: AtlasEntityInput[] = [
  {
    id: "unal", name: "Universidad Nacional de Colombia", type: "university", country: "Colombia", emoji: "🎓",
    description: "La universidad pública más importante de Colombia, referente nacional en ciencia y formación.",
    keyThemes: ["Pública", "Ciencia", "Nacional", "Formación"],
    sourceNote: "Fundada el 22 de septiembre de 1867.",
    events: [
      {
        id: "unal-fundacion", type: "fundacion", label: "Fundación",
        date: "1867-09-22", year: 1867,
        description: "Se funda la Universidad Nacional de Colombia.",
        source: "Universidad Nacional — Historia institucional", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "uniandes", name: "Universidad de los Andes", type: "university", country: "Colombia", emoji: "🎓",
    description: "Universidad privada de Bogotá, líder en investigación y reconocida entre las mejores de la región.",
    keyThemes: ["Investigación", "Privada", "Bogotá", "Excelencia"],
    sourceNote: "Fundada el 16 de noviembre de 1948.",
    events: [
      {
        id: "uniandes-fundacion", type: "fundacion", label: "Fundación",
        date: "1948-11-16", year: 1948,
        description: "Se funda la Universidad de los Andes en Bogotá.",
        source: "Universidad de los Andes — Historia", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "javeriana", name: "Pontificia Universidad Javeriana", type: "university", country: "Colombia", emoji: "🏛️",
    description: "Universidad jesuita de Bogotá con más de 390 años de historia académica.",
    keyThemes: ["Jesuita", "Historia", "Bogotá", "Humanismo"],
    sourceNote: "Fundada el 13 de junio de 1623.",
    events: [
      {
        id: "javeriana-fundacion", type: "fundacion", label: "Fundación",
        date: "1623-06-13", year: 1623,
        description: "Se funda la Pontificia Universidad Javeriana en Bogotá.",
        source: "Pontificia Universidad Javeriana — Historia", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "udea", name: "Universidad de Antioquia", type: "university", country: "Colombia", emoji: "🏛️",
    description: "La UdeA, institución pública de Medellín con más de dos siglos de historia.",
    keyThemes: ["Pública", "Medellín", "Antioquia", "Historia"],
    sourceNote: "Fundada en 1803 como Colegio Franciscano.",
    events: [
      {
        id: "udea-fundacion", type: "fundacion", label: "Fundación",
        year: 1803,
        description: "Origen de la Universidad de Antioquia en el Colegio Franciscano de Medellín.",
        source: "Universidad de Antioquia — Historia", confidence: "media", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "urosario", name: "Universidad del Rosario", type: "university", country: "Colombia", emoji: "🎓",
    description: "El Rosario es una de las universidades más antiguas de América, reconocida por sus programas de derecho y ciencia política.",
    keyThemes: ["Tradición", "Derecho", "Política", "Legado"],
    sourceNote: "Fundada en 1653 por el Arzobispo Fray Cristóbal de Torres. Fecha exacta no documentada de forma unívoca; se usa el año.",
    events: [
      {
        id: "urosario-fundacion", type: "fundacion", label: "Fundación",
        year: 1653,
        description: "Fray Cristóbal de Torres funda el Colegio Mayor de Nuestra Señora del Rosario.",
        source: "Universidad del Rosario — Historia institucional", confidence: "media", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "eafit", name: "Universidad EAFIT", type: "university", country: "Colombia", emoji: "🎓",
    description: "EAFIT es una universidad privada de Medellín, referente en negocios, ingeniería y economía.",
    keyThemes: ["Negocios", "Ingeniería", "Innovación", "Región"],
    sourceNote: "Fundada en 1960. Fecha exacta no documentada de forma unívoca; se usa el año.",
    events: [
      {
        id: "eafit-fundacion", type: "fundacion", label: "Fundación",
        year: 1960,
        description: "Se funda la Escuela de Administración y Finanzas, origen de EAFIT.",
        source: "Universidad EAFIT — Historia institucional", confidence: "media", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "externado", name: "Universidad Externado de Colombia", type: "university", country: "Colombia", emoji: "🎓",
    description: "El Externado es una universidad privada bogotana de fuerte tradición jurídica y en ciencias sociales.",
    keyThemes: ["Derecho", "Tradición", "Pensamiento", "Formación"],
    sourceNote: "Fundada en 1886. Fecha exacta no documentada de forma unívoca; se usa el año.",
    events: [
      {
        id: "externado-fundacion", type: "fundacion", label: "Fundación",
        year: 1886,
        description: "Se funda la Universidad Externado de Colombia en Bogotá.",
        source: "Universidad Externado de Colombia — Historia institucional", confidence: "media", primaryForAffinity: true,
      },
    ],
  },
];

// ─── MARCAS ───────────────────────────────────────────────
export const BRANDS_COLOMBIA: AtlasEntityInput[] = [
  {
    id: "avianca", name: "Avianca", type: "brand", country: "Colombia", emoji: "✈️",
    description: "Aerolínea colombiana, una de las más antiguas del mundo en operación continua, fundada como SCADTA.",
    keyThemes: ["Aviación", "Historia", "Bandera", "Latinoamérica"],
    sourceNote: "Fundada el 5 de diciembre de 1919 como SCADTA.",
    events: [
      {
        id: "avianca-fundacion", type: "fundacion", label: "Fundación (SCADTA)",
        date: "1919-12-05", year: 1919,
        description: "Se funda la Sociedad Colombo-Alemana de Transporte Aéreo (SCADTA), origen de Avianca.",
        source: "Avianca — Historia corporativa", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "nutresa", name: "Grupo Nutresa", type: "brand", country: "Colombia", emoji: "🍫",
    description: "El conglomerado alimenticio más grande de Colombia, líder en chocolates y alimentos procesados.",
    keyThemes: ["Alimentación", "Chocolate", "Líder", "Grupo"],
    sourceNote: "Origen en 1920 como Compañía Nacional de Chocolates.",
    events: [
      {
        id: "nutresa-fundacion", type: "fundacion", label: "Origen",
        year: 1920,
        description: "Origen del Grupo Nutresa en la Compañía Nacional de Chocolates.",
        source: "Grupo Nutresa — Historia corporativa", confidence: "media", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "bancolombia", name: "Bancolombia", type: "brand", country: "Colombia", emoji: "🏦",
    description: "El banco más grande de Colombia y una de las mayores instituciones financieras de la región.",
    keyThemes: ["Banca", "Finanzas", "Líder", "Grupo"],
    sourceNote: "Origen en 1875 en el Banco de Colombia.",
    events: [
      {
        id: "bancolombia-origen", type: "creacion", label: "Origen",
        year: 1875,
        description: "Origen del Banco de Colombia, raíz de Bancolombia.",
        source: "Bancolombia — Historia corporativa", confidence: "media", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "juan-valdez", name: "Juan Valdez Café", type: "brand", country: "Colombia", emoji: "☕",
    description: "La marca icónica del café colombiano, nacida de la imagen del caficultor Juan Valdez.",
    keyThemes: ["Café", "Colombia", "Icono", "Exportación"],
    sourceNote: "Marca creada en 2002 por la Federación Nacional de Cafeteros.",
    events: [
      {
        id: "juan-valdez-creacion", type: "creacion", label: "Creación de la marca",
        year: 2002,
        description: "La Federación Nacional de Cafeteros crea la marca Juan Valdez Café.",
        source: "Federación Nacional de Cafeteros", confidence: "media", primaryForAffinity: true,
      },
    ],
  },
];

// ─── ARTISTAS / PERSONAS ──────────────────────────────────
export const ARTISTS_COLOMBIA: AtlasEntityInput[] = [
  {
    id: "garcia-marquez", name: "Gabriel García Márquez", type: "artist", country: "Colombia", emoji: "📚",
    description: "Escritor colombiano, Premio Nobel de Literatura 1982 y figura cumbre del realismo mágico.",
    keyThemes: ["Literatura", "Nobel", "Realismo Mágico", "Escritura"],
    sourceNote: "Nacido el 6 de marzo de 1927 en Aracataca.",
    events: [
      {
        id: "gabo-nacimiento", type: "creacion", label: "Nacimiento",
        date: "1927-03-06", year: 1927,
        description: "Nace Gabriel García Márquez en Aracataca, Magdalena.",
        source: "Biografía oficial — Nobel Prize", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "shakira", name: "Shakira", type: "artist", country: "Colombia", emoji: "🎤",
    description: "Cantante y compositora barranquillera, una de las artistas latinas más exitosas del mundo.",
    keyThemes: ["Música", "Latino", "Global", "Artista"],
    sourceNote: "Nacida el 2 de febrero de 1977 en Barranquilla.",
    events: [
      {
        id: "shakira-nacimiento", type: "creacion", label: "Nacimiento",
        date: "1977-02-02", year: 1977,
        description: "Nace Shakira Isabel Mebarak Ripoll en Barranquilla.",
        source: "Biografía pública — Shakira", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "botero", name: "Fernando Botero", type: "artist", country: "Colombia", emoji: "🎨",
    description: "Pintor y escultor colombiano, célebre por su estilo 'boterista' de figuras voluminosas.",
    keyThemes: ["Pintura", "Escultura", "Estilo", "Reconocido"],
    sourceNote: "Nacido el 19 de abril de 1932 en Medellín.",
    events: [
      {
        id: "botero-nacimiento", type: "creacion", label: "Nacimiento",
        date: "1932-04-19", year: 1932,
        description: "Nace Fernando Botero en Medellín.",
        source: "Biografía — Museo Botero", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "carlos-vives", name: "Carlos Vives", type: "artist", country: "Colombia", emoji: "🎶",
    description: "Cantautor samario, pionero en fusionar el vallenato con sonidos modernos y pop.",
    keyThemes: ["Vallenato", "Música", "Colombia", "Fusión"],
    sourceNote: "Nacido el 7 de agosto de 1961 en Santa Marta.",
    events: [
      {
        id: "vives-nacimiento", type: "creacion", label: "Nacimiento",
        date: "1961-08-07", year: 1961,
        description: "Nace Carlos Vives en Santa Marta.",
        source: "Biografía pública — Carlos Vives", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
];
