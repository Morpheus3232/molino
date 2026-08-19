import type { SymbolicEntity } from "./symbolic-entities";

/**
 * Figuras artísticas argentinas — fechas de nacimiento verificadas.
 * Complementa a Soda Stereo y Carlos Gardel, ya presentes en symbolic-entities.ts.
 * famousPeople.ts no incluye artistas argentinos (solo Messi y Che Guevara,
 * ninguno con campo "artista"), de ahí que estas entradas se agreguen directamente.
 */
export const ARTISTS_ARGENTINA: SymbolicEntity[] = [
  {
    id: "julio-cortazar", name: "Julio Cortázar", type: "artist", foundingYear: 1914, country: "Argentina",
    emoji: "📚",
    description: "Julio Cortázar es una de las voces centrales de la literatura latinoamericana, referente del boom con \"Rayuela\".",
    keyThemes: ["Literatura", "Vanguardia", "Fantástico", "Latinoamérica"],
    category: "Literatura",
    sourceNote: "Nacido el 26 de agosto de 1914 en Ixelles, Bélgica, de padres argentinos; se formó y desarrolló su identidad literaria en Argentina.",
    events: [
      {
        id: "cortazar-nacimiento",
        type: "creacion",
        label: "Nacimiento",
        date: "1914-08-26",
        year: 1914,
        description: "Julio Florencio Cortázar nace el 26 de agosto de 1914.",
        source: "Fundación Cortázar / Encyclopaedia Britannica",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "astor-piazzolla", name: "Astor Piazzolla", type: "artist", foundingYear: 1921, country: "Argentina",
    emoji: "🎵",
    description: "Astor Piazzolla revolucionó el tango con el \"tango nuevo\", fusionando tradición porteña y música de vanguardia.",
    keyThemes: ["Tango", "Innovación", "Fusión", "Bandoneón"],
    category: "Música",
    sourceNote: "Nacido el 11 de marzo de 1921 en Mar del Plata, Argentina.",
    events: [
      {
        id: "piazzolla-nacimiento",
        type: "creacion",
        label: "Nacimiento",
        date: "1921-03-11",
        year: 1921,
        description: "Astor Pantaleón Piazzolla nace el 11 de marzo de 1921 en Mar del Plata.",
        source: "Fundación Astor Piazzolla / Encyclopaedia Britannica",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "mercedes-sosa", name: "Mercedes Sosa", type: "artist", foundingYear: 1935, country: "Argentina",
    emoji: "🎤",
    description: "Mercedes Sosa, \"la Negra\", fue la voz mayor del folklore latinoamericano y referente del movimiento del Nuevo Cancionero.",
    keyThemes: ["Folklore", "Voz", "Latinoamérica", "Compromiso"],
    category: "Música",
    sourceNote: "Nacida el 9 de julio de 1935 en San Miguel de Tucumán, Argentina.",
    events: [
      {
        id: "sosa-nacimiento",
        type: "creacion",
        label: "Nacimiento",
        date: "1935-07-09",
        year: 1935,
        description: "Haydée Mercedes Sosa nace el 9 de julio de 1935 en Tucumán.",
        source: "Fundación Mercedes Sosa / Encyclopaedia Britannica",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "jorge-luis-borges", name: "Jorge Luis Borges", type: "artist", foundingYear: 1899, country: "Argentina",
    emoji: "📖",
    description: "Jorge Luis Borges es uno de los escritores más influyentes del siglo XX, maestro del cuento fantástico y el ensayo.",
    keyThemes: ["Literatura", "Laberintos", "Erudición", "Universalidad"],
    category: "Literatura",
    sourceNote: "Nacido el 24 de agosto de 1899 en Buenos Aires, Argentina.",
    events: [
      {
        id: "borges-nacimiento",
        type: "creacion",
        label: "Nacimiento",
        date: "1899-08-24",
        year: 1899,
        description: "Jorge Luis Borges nace el 24 de agosto de 1899 en Buenos Aires.",
        source: "Fundación Internacional Jorge Luis Borges / Encyclopaedia Britannica",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "charly-garcia", name: "Charly García", type: "artist", foundingYear: 1951, country: "Argentina",
    emoji: "🎸",
    description: "Charly García es una figura fundacional del rock en español, con una obra que atraviesa Sui Generis, Serú Girán y su carrera solista.",
    keyThemes: ["Rock nacional", "Innovación", "Provocación", "Poesía"],
    category: "Música",
    sourceNote: "Nacido el 23 de octubre de 1951 en Buenos Aires, Argentina.",
    events: [
      {
        id: "garcia-nacimiento",
        type: "creacion",
        label: "Nacimiento",
        date: "1951-10-23",
        year: 1951,
        description: "Carlos Alberto García Moreno nace el 23 de octubre de 1951 en Buenos Aires.",
        source: "Encyclopaedia Britannica / Rock and Pop — biografía oficial",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
];
