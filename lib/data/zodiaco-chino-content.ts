/**
 * Contenido profundo de zodiaco chino para Molino.
 * Cada animal incluye: historia, caract\u00e9risticas, fortalezas, desaf\u00edos,
 * compatibilidades, elementos, a\u00f1os, fuentes, disclaimer.
 */

export interface ChineseAnimal {
  name: string;
  emoji: string;
  years: string;
  meaning: string;
  history: string;
  traits: string[];
  strengths: string[];
  challenges: string[];
  compatibility: { friendly: string[]; challenging: string[] };
  elements: { element: string; modifier: string }[];
  scientificNote: string;
  sourceIds: string[];
}

export const CHINESE_ANIMALS: ChineseAnimal[] = [
  {
    name: "Rata",
    emoji: "\ud83d\udc00",
    years: "1924, 1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020",
    meaning: "Seg\u00fan la tradici\u00f3n china, la Rata representa ingenio, astucia y adaptabilidad. Es el primer animal del ciclo zodiacal.",
    history: "Seg\u00fan la leyenda, el Emperador de Jade organiz\u00f3 una carrera para determinar el orden de los animales. La Rata lleg\u00f3 primera subi\u00e9ndose sobre el lomo del Buey y saltando al final.",
    traits: ["Inteligente", "Astuta", "Vers\u00e1til", "Sociable", "Resourceful"],
    strengths: ["Ingenio y astucia", "Capacidad de adaptaci\u00f3n", "Sociabilidad", "Observaci\u00f3n", "Resourcefulness"],
    challenges: ["Tendencia a la avaricia", "Dificultad para confiar", "Impaciencia", "Cr\u00edtica excesiva", "Duplicidad percibida"],
    compatibility: { friendly: ["Drag\u00f3n", "Mono", "Buey"], challenging: ["Caballo", "Conejo"] },
    elements: [
      { element: "Madera", modifier: "Creativo e idealista" },
      { element: "Fuego", modifier: "Energ\u00e9tico y carism\u00e1tico" },
      { element: "Tierra", modifier: "Pr\u00e1ctico y estable" },
      { element: "Metal", modifier: "Dedicado y determinado" },
      { element: "Agua", modifier: "Intuitivo y flexible" },
    ],
    scientificNote: "El zodiaco chino es un sistema de creencias. No existe evidencia de que el a\u00f1o de nacimiento determine rasgos de personalidad.",
    sourceIds: ["britannica-chinese-zodiac", "smith-chinese-astrology"],
  },
  {
    name: "Buey",
    emoji: "\ud83d\udc02",
    years: "1925, 1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021",
    meaning: "El Buey representa fuerza, determinaci\u00f3n y confiabilidad. Es s\u00edmbolo de perseverancia y trabajo duro.",
    history: "En la tradici\u00f3n china, el Buey es s\u00edmbolo de agricultura y prosperidad. Lleg\u00f3 segundo en la carrera del Emperador Jade, despu\u00e9s de la Rata.",
    traits: ["Dedicado", "Fuerte", "Determinado", "Paciente", "Confi"],
    strengths: ["Determinaci\u00f3n inquebrantable", "Confiabilidad", "Paciencia", "Fuerza f\u00edsica y mental", "Lealtad"],
    challenges: ["Terquedad", "Rigidez", "Dificultad para adaptarse", "Resentimiento", "Trabajo excesivo"],
    compatibility: { friendly: ["Serpiente", "Gallo", "Rata"], challenging: ["Cabra", "Conejo"] },
    elements: [
      { element: "Madera", modifier: "Rebelde y visionario" },
      { element: "Fuego", modifier: "Aventurero y optimista" },
      { element: "Tierra", modifier: "Trabajador y s\u00f3lido" },
      { element: "Metal", modifier: "Fortificado y seguro" },
      { element: "Agua", modifier: "Persuasivo y tranquilo" },
    ],
    scientificNote: "La tradici\u00f3n del zodiaco chino es un sistema cultural. Las caracter\u00edsticas del Buey son interpretaciones simb\u00f3licas, no datos cient\u00edficos.",
    sourceIds: ["britannica-chinese-zodiac", "smith-chinese-astrology"],
  },
  {
    name: "Tigre",
    emoji: "\ud83d\udc2f",
    years: "1926, 1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022",
    meaning: "El Tigre representa valent\u00eda, energ\u00eda y competitividad. Es s\u00edmbolo de poder y car\u00e1cter.",
    history: "El Tigre es considerado el rey de las bestias en la cultura china. Su presencia en el zodiaco refleja su importancia en la mitolog\u00eda oriental.",
    traits: ["Valiente", "Competitivo", "Carism\u00e1tico", "Impulsivo", "Generoso"],
    strengths: ["Valent\u00eda", "Liderazgo natural", "Carisma", "Energ\u00eda", "Generosidad"],
    challenges: ["Impulsividad", "Autoritarismo", "Impaciencia", "Dificultad para delegar", "Reactividad"],
    compatibility: { friendly: ["Caballo", "Perro", "Drag\u00f3n"], challenging: ["Serpiente", "Mono"] },
    elements: [
      { element: "Madera", modifier: "Competitivo y ambicioso" },
      { element: "Fuego", modifier: "Carism\u00e1tico y en\u00e9rgico" },
      { element: "Tierra", modifier: "Confiado y estable" },
      { element: "Metal", modifier: "Determinado y\u00a0resiliente" },
      { element: "Agua", modifier: "Intuitivo y perspicaz" },
    ],
    scientificNote: "El zodiaco chino no tiene evidencia cient\u00edfica. Las asociaciones son culturales y simb\u00f3licas.",
    sourceIds: ["britannica-chinese-zodiac", "smith-chinese-astrology"],
  },
  {
    name: "Conejo",
    emoji: "\ud83d\udc30",
    years: "1927, 1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023",
    meaning: "El Conejo representa elegancia, diplomacia y sensibilidad. Es s\u00edmbolo de paz y fortuna en la cultura china.",
    history: "El Conejo es uno de los animales m\u00e1s apreciados en el zodiaco chino. Se asocia con la luna y la elegancia.",
    traits: ["Elegante", "Diplom\u00e1tico", "Sensible", "Pac\u00edfico", "Astuto"],
    strengths: ["Elegancia", "Diplomacia", "Sensibilidad art\u00edstica", "Paciencia", "Buena intuici\u00f3n"],
    challenges: ["Cautela excesiva", "Indecisi\u00f3n", "Resentimiento silencioso", "Evitaci\u00f3n de conflicto", "Inseguridad"],
    compatibility: { friendly: ["Cabra", "Cerdo", "Perro"], challenging: ["Rata", "Gallo"] },
    elements: [
      { element: "Madera", modifier: "Generoso y compasivo" },
      { element: "Fuego", modifier: "Energ\u00e9tico y carism\u00e1tico" },
      { element: "Tierra", modifier: "Pr\u00e1ctico y confiable" },
      { element: "Metal", modifier: "Determinado y noble" },
      { element: "Agua", modifier: "Intuitivo y adaptable" },
    ],
    scientificNote: "Las caracter\u00edsticas del Conejo en el zodiaco chino son interpretaciones culturales sin base cient\u00edfica.",
    sourceIds: ["britannica-chinese-zodiac", "smith-chinese-astrology"],
  },
  {
    name: "Drag\u00f3n",
    emoji: "\ud83d\udc09",
    years: "1928, 1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024",
    meaning: "El Drag\u00f3n representa fuerza, poder y buena fortuna. Es el \u00fanico animal mitol\u00f3gico del zodiaco chino.",
    history: "El Drag\u00f3n es el \u00fanico animal mitol\u00f3gico en el zodiaco chino. En la cultura china, es s\u00edmbolo de poder imperial y buena fortuna, a diferencia de la tradici\u00f3n occidental donde se le asocia con peligro.",
    traits: ["Ambicioso", "Carism\u00e1tico", "Energ\u00e9tico", "Confiado", "L\u00edder"],
    strengths: ["Carisma extraordinario", "Ambici\u00f3n", "Energ\u00eda ilimitada", "Confianza", "Liderazgo visionario"],
    challenges: ["Intolerancia", "Exigencia", "Impaciencia", "Arrogancia", "Dificultad para escuchar"],
    compatibility: { friendly: ["Rata", "Serpiente", "Mono"], challenging: ["Perro", "Conejo"] },
    elements: [
      { element: "Madera", modifier: "Visionario y generoso" },
      { element: "Fuego", modifier: "En\u00e9rgico y apasionado" },
      { element: "Tierra", modifier: "Trabajador y estable" },
      { element: "Metal", modifier: "Determinado y\u00a0resiliente" },
      { element: "Agua", modifier: "Intuitivo y flexible" },
    ],
    scientificNote: "El Drag\u00f3n es un animal mitol\u00f3gico. Las asociaciones son puramente culturales y simb\u00f3licas.",
    sourceIds: ["britannica-chinese-zodiac", "met-chinese-calendar"],
  },
  {
    name: "Serpiente",
    emoji: "\ud83d\udc0d",
    years: "1929, 1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025",
    meaning: "La Serpiente representa sabidur\u00eda, intuici\u00f3n y misterio. Es considerada el animal m\u00e1s astuto del zodiaco.",
    history: "La Serpiente tiene una importancia especial en la cultura china, asociada con la sabidur\u00eda y la medicina tradicional.",
    traits: ["Intuitiva", "Estrat\u00e9gica", "Misteriosa", "Elegante", "Determinada"],
    strengths: ["Intuici\u00f3n extraordinaria", "Estrategia", "Elegancia", "Determinaci\u00f3n", "Sabidur\u00eda"],
    challenges: ["Secretismo", "Celos", "Desconfianza", "Venganza", "Intensidad"],
    compatibility: { friendly: ["Mono", "Gallo", "Buey"], challenging: ["Cerdo", "Tigre"] },
    elements: [
      { element: "Madera", modifier: "Creativo y filos\u00f3fico" },
      { element: "Fuego", modifier: "Carism\u00e1tico y en\u00e9rgico" },
      { element: "Tierra", modifier: "Pr\u00e1ctico y confiable" },
      { element: "Metal", modifier: "Diligente y constante" },
      { element: "Agua", modifier: "Intuitivo y\u00a0perspicaz" },
    ],
    scientificNote: "La Serpiente en el zodiaco chino es un s\u00edmbolo cultural. No tiene relaci\u00f3n con evidencia cient\u00edfica.",
    sourceIds: ["britannica-chinese-zodiac", "smith-chinese-astrology"],
  },
  {
    name: "Caballo",
    emoji: "\ud83d\udc34",
    years: "1930, 1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026",
    meaning: "El Caballo representa libertad, energ\u00eda y aventura. Es s\u00edmbolo de movimiento y dinamismo.",
    history: "El Caballo ha sido un s\u00edmbolo de estatus y libertad en la cultura china durante milenios. Su presencia en el zodiaco refleja su importancia en la guerra y el transporte.",
    traits: ["Libre", "En\u00e9rgico", "Aventurero", "Sociable", "Impulsivo"],
    strengths: ["Libertad de esp\u00edritu", "Energ\u00eda contagiosa", "Entusiasmo", "Versatilidad", "Lealtad"],
    challenges: ["Inquietud", "Impaciencia", "Dificultad para comprometerse", "Inconsistencia", "Egocentrismo"],
    compatibility: { friendly: ["Tigre", "Perro", "Cabra"], challenging: ["Rata", "Conejo"] },
    elements: [
      { element: "Madera", modifier: "En\u00e9rgico y carism\u00e1tico" },
      { element: "Fuego", modifier: "Apasionado y\u00a0entusiasta" },
      { element: "Tierra", modifier: "Trabajador y estable" },
      { element: "Metal", modifier: "Determinado y valiente" },
      { element: "Agua", modifier: "Vers\u00e1til y\u00a0resiliente" },
    ],
    scientificNote: "El Caballo en el zodiaco es una construcci\u00f3n cultural. No hay evidencia de que determine personalidad aventurera.",
    sourceIds: ["britannica-chinese-zodiac", "smith-chinese-astrology"],
  },
  {
    name: "Cabra",
    emoji: "\ud83d\udc10",
    years: "1931, 1943, 1955, 1967, 1979, 1991, 2003, 2015, 2027",
    meaning: "La Cabra representa creatividad, sensibilidad y armon\u00eda. Es s\u00edmbolo de arte y paz.",
    history: "La Cabra (o Oveja) es uno de los animales m\u00e1s pac\u00edficos del zodiaco. Se asocia con el arte y la creatividad en la cultura china.",
    traits: ["Creativa", "Sensible", "Pac\u00edfica", "Art\u00edstica", "Generosa"],
    strengths: ["Creatividad", "Sensibilidad est\u00e9tica", "Empat\u00eda", "Paciencia", "Imaginaci\u00f3n"],
    challenges: ["Indecisi\u00f3n", "Dependencia", "Pessimismo", "Inseguridad", "Evitaci\u00f3n"],
    compatibility: { friendly: ["Conejo", "Cerdo", "Caballo"], challenging: ["Buey", "Perro"] },
    elements: [
      { element: "Madera", modifier: "Generoso y compasivo" },
      { element: "Fuego", modifier: "Art\u00edstico y en\u00e9rgico" },
      { element: "Tierra", modifier: "Pr\u00e1ctico y confiable" },
      { element: "Metal", modifier: "Elegante y\u00a0refinado" },
      { element: "Agua", modifier: "Intuitivo y creativo" },
    ],
    scientificNote: "Las caracter\u00edsticas de la Cabra son interpretaciones culturales sin base cient\u00edfica.",
    sourceIds: ["britannica-chinese-zodiac", "smith-chinese-astrology"],
  },
  {
    name: "Mono",
    emoji: "\ud83d\udc35",
    years: "1932, 1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028",
    meaning: "El Mono representa ingenio, versatilidad y curiosidad. Es el animal m\u00e1s astuto y juguet\u00f3n del zodiaco.",
    history: "El Mono es un s\u00edmbolo de ingenio en la mitolog\u00eda china, representado como el Rey Mono en la novela cl\u00e1sica 'Viaje al Oeste'.",
    traits: ["Ingenioso", "Vers\u00e1til", "Curioso", "Sociable", "Competitivo"],
    strengths: ["Ingenio extraordinario", "Versatilidad", "Curiosidad intelectual", "Sociabilidad", "Resoluci\u00f3n de problemas"],
    challenges: ["Inconstancia", "Arrogancia", "Picard\u00eda", "Dificultad para comprometerse", "Impaciencia"],
    compatibility: { friendly: ["Rata", "Drag\u00f3n", "Serpiente"], challenging: ["Tigre", "Cerdo"] },
    elements: [
      { element: "Madera", modifier: "Ambicioso y lidera" },
      { element: "Fuego", modifier: "En\u00e9rgico y carism\u00e1tico" },
      { element: "Tierra", modifier: "Pr\u00e1ctico y confiable" },
      { element: "Metal", modifier: "Constante y decidido" },
      { element: "Agua", modifier: "Flexible y\u00a0adaptable" },
    ],
    scientificNote: "El Mono en el zodiaco es un s\u00edmbolo cultural sin respaldo cient\u00edfico.",
    sourceIds: ["britannica-chinese-zodiac", "smith-chinese-astrology"],
  },
  {
    name: "Gallo",
    emoji: "\ud83d\udc13",
    years: "1933, 1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029",
    meaning: "El Gallo representa puntualidad, observaci\u00f3n y coraje. Es s\u00edmbolo de honestidad y precis\u00f3n.",
    history: "El Gallo es s\u00edmbolo de amanecer y renovaci\u00f3n en la cultura china. Su canto marca el inicio de un nuevo d\u00eda.",
    traits: ["Observador", "Valiente", "Puntual", "Honesto", "Organizado"],
    strengths: ["Observaci\u00f3n aguda", "Puntualidad", "Coraje", "Organizaci\u00f3n", "Honestidad"],
    challenges: ["Cr\u00edtica excesiva", "Vanidad", "Dureza", "Crueldad percibida", "Testarudez"],
    compatibility: { friendly: ["Buey", "Serpiente", "Mono"], challenging: ["Conejo", "Perro"] },
    elements: [
      { element: "Madera", modifier: "Creativo y expansivo" },
      { element: "Fuego", modifier: "En\u00e9rgico y\u00a0carism\u00e1tico" },
      { element: "Tierra", modifier: "Pr\u00e1ctico y confiable" },
      { element: "Metal", modifier: "Resiliente y\u00a0puntual" },
      { element: "Agua", modifier: "Intuitivo y adaptable" },
    ],
    scientificNote: "El Gallo en el zodiaco es una construcci\u00f3n cultural. No tiene base cient\u00edfica.",
    sourceIds: ["britannica-chinese-zodiac", "smith-chinese-astrology"],
  },
  {
    name: "Perro",
    emoji: "\ud83d\udc15",
    years: "1934, 1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030",
    meaning: "El Perro representa lealtad, honestidad y protecci\u00f3n. Es s\u00edmbolo de fidelidad incondicional.",
    history: "El Perro es considerado uno de los animales m\u00e1s leales en todas las culturas. En China, representa la protecci\u00f3n y la compa\u00f1\u00eda.",
    traits: ["Leal", "Honesto", "Protector", "Confiable", "Compasivo"],
    strengths: ["Lealtad incondicional", "Honestidad", "Protecci\u00f3n", "Confianza", "Empat\u00eda"],
    challenges: ["Ansiedad", "C\u00e1nomo", "Cr\u00edtica", "Terquedad moral", "Preocupaci\u00f3n excesiva"],
    compatibility: { friendly: ["Tigre", "Conejo", "Caballo"], challenging: ["Drag\u00f3n", "Gallo"] },
    elements: [
      { element: "Madera", modifier: "Compasivo y\u00a0generoso" },
      { element: "Fuego", modifier: "En\u00e9rgico y\u00a0carism\u00e1tico" },
      { element: "Tierra", modifier: "Pr\u00e1ctico y\u00a0confi" },
      { element: "Metal", modifier: "Resiliente y\u00a0justo" },
      { element: "Agua", modifier: "Intuitivo y\u00a0flexible" },
    ],
    scientificNote: "El Perro en el zodiaco es una construcci\u00f3n cultural sin base cient\u00edfica.",
    sourceIds: ["britannica-chinese-zodiac", "smith-chinese-astrology"],
  },
  {
    name: "Cerdo",
    emoji: "\ud83d\udc37",
    years: "1935, 1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031",
    meaning: "El Cerdo representa generosidad, compasi\u00f3n y optimismo. Es s\u00edmbolo de prosperidad y bienestar.",
    history: "El Cerdo es considerado s\u00edmbolo de prosperidad y fortuna en la cultura china. Su presencia al final del ciclo representa completitud.",
    traits: ["Generoso", "Compasivo", "Optimista", "Diligente", "Pac\u00edfico"],
    strengths: ["Generosidad", "Compasi\u00f3n", "Optimismo", "Diligencia", "Tolerancia"],
    challenges: ["Ingenuidad", "Autoindulgencia", "Dificultad para decir no", "Exceso de confianza", "Pereza percibida"],
    compatibility: { friendly: ["Conejo", "Cabra", "Buey"], challenging: ["Serpiente", "Mono"] },
    elements: [
      { element: "Madera", modifier: "Generoso y compasivo" },
      { element: "Fuego", modifier: "En\u00e9rgico y\u00a0apasionado" },
      { element: "Tierra", modifier: "Pr\u00e1ctico y\u00a0confiable" },
      { element: "Metal", modifier: "Determinado y\u00a0constante" },
      { element: "Agua", modifier: "Intuitivo y\u00a0flexible" },
    ],
    scientificNote: "El Cerdo en el zodiaco es una construcci\u00f3n cultural sin base cient\u00edfica.",
    sourceIds: ["britannica-chinese-zodiac", "smith-chinese-astrology"],
  },
];

/**
 * Los 5 elementos del zodiaco chino.
 */
export const CHINESE_ELEMENTS = [
  { name: "Madera", qualities: ["Crecimiento", "Generosidad", "Flexibilidad", "Idealismo"], yinYang: "Yin" },
  { name: "Fuego", qualities: ["Pasión", "Energía", "Espontaneidad", "Liderazgo"], yinYang: "Yang" },
  { name: "Tierra", qualities: ["Estabilidad", "Practicidad", "Paciencia", "Nutrici\u00f3n"], yinYang: "Yin" },
  { name: "Metal", qualities: ["Determinaci\u00f3n", "Precisi\u00f3n", "Organizaci\u00f3n", "Resiliencia"], yinYang: "Yang" },
  { name: "Agua", qualities: ["Intuici\u00f3n", "Comunicaci\u00f3n", "Adaptabilidad", "Flexibilidad"], yinYang: "Yin" },
];

/**
 * Disclaimer del zodiaco chino.
 */
export const CHINESE_ZODIAC_DISCLAIMER = "El zodiaco chino es un sistema de creencias milenario con ra\u00edces en la cultura china. Molino lo utiliza como herramienta de reflexi\u00f3n y autoconocimiento. Las interpretaciones no constituyen evidencia cient\u00edfica, predicciones ni diagn\u00f3sticos. Los c\u00e1lculos son deterministas y reproducibles a partir del a\u00f1o de nacimiento.";
