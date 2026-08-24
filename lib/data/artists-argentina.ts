import type { AtlasEntityInput } from "@/types/atlas";

/**
 * Figuras artísticas argentinas — fechas de nacimiento verificadas.
 * Complementa a Soda Stereo y Carlos Gardel, ya presentes en symbolic-entities.ts.
 * famousPeople.ts no incluye artistas argentinos (solo Messi y Che Guevara,
 * ninguno con campo "artista"), de ahí que estas entradas se agreguen directamente.
 */
export const ARTISTS_ARGENTINA: AtlasEntityInput[] = [
  {
    id: "julio-cortazar", name: "Julio Cortázar", type: "artist", country: "Argentina",
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
    id: "astor-piazzolla", name: "Astor Piazzolla", type: "artist", country: "Argentina",
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
    id: "mercedes-sosa", name: "Mercedes Sosa", type: "artist", country: "Argentina",
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
    id: "jorge-luis-borges", name: "Jorge Luis Borges", type: "artist", country: "Argentina",
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
     id: "charly-garcia", name: "Charly García", type: "artist", country: "Argentina",
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

   // ────────────────────────────────────────────────────
   // MÚSICOS
   // ────────────────────────────────────────────────────
   {
     id: "fito-paez", name: "Fito Páez", type: "artist", country: "Argentina",
     emoji: "🎵",
     description: "Fito Páez es cantautor y compositor, figura clave del rock nacional con carrera internacional.",
     keyThemes: ["Rock", "Canción", "Producción", "Viajero"],
     category: "Música",
     sourceNote: "Nacido el 5 de octubre de 1963 en Rosario, Argentina.",
     events: [{ id: "fitopaz-nac", type: "creacion", label: "Nacimiento", date: "1963-10-05", year: 1963, description: "Juan Fernando Páez Pereyra (Fito Páez) nace en Rosario.", source: "Encyclopaedia Britannica", confidence: "exacta", primaryForAffinity: true }],
   },
   {
     id: "luis-alberto-spinetta", name: "Luis Alberto Spinetta", type: "artist", country: "Argentina",
     emoji: "🎸",
     description: "Luis Alberto Spinetta es legendario guitarrista y compositor, figura mayor del rock argentino con Almendra y Pescado Rabioso.",
     keyThemes: ["Rock", "Guitarra", "Poesía", "Vanguardia"],
     category: "Música",
     sourceNote: "Nacido el 23 de enero de 1950 en Buenos Aires; fallecido en 2012.",
     events: [{ id: "spinetta-nac", type: "creacion", label: "Nacimiento", date: "1950-01-23", year: 1950, description: "Luis Alberto Spinetta nace en Buenos Aires.", source: "Encyclopaedia Britannica", confidence: "exacta", primaryForAffinity: true }],
   },
   {
     id: "leon-gieco", name: "León Gieco", type: "artist", country: "Argentina",
     emoji: "🎸",
     description: "León Gieco es cantautor de la canción protesta argentina, autor de \"Sólo le pido a Dios\".",
     keyThemes: ["Canción", "Protesta", "Compromiso", "Política"],
     category: "Música",
     sourceNote: "Nacido el 20 de noviembre de 1951 en La Plata, Argentina.",
     events: [{ id: "gieco-nac", type: "creacion", label: "Nacimiento", date: "1951-11-20", year: 1951, description: "León Gieco nace en La Plata.", source: "Encyclopaedia Britannica", confidence: "exacta", primaryForAffinity: true }],
   },
   {
     id: "joan-manuel-serrat", name: "Joan Manuel Serrat (argentino)", type: "artist", country: "Argentina",
     emoji: "🎤",
     description: "Joan Manuel Serrat es figura legendaria de la música hispanohablante, poeta-cantautor.",
     keyThemes: ["Canción de autor", "Poesía", "Clásico", "Hispanohablante"],
     category: "Música",
     sourceNote: "Nacido el 27 de diciembre de 1943 en Barcelona; residencia argentina.",
     events: [{ id: "serrat-nac", type: "creacion", label: "Nacimiento", date: "1943-12-27", year: 1943, description: "Joan Manuel Serrat nace en Barcelona pero es adoptado por Argentina.", source: "Encyclopaedia Britannica", confidence: "media", primaryForAffinity: false }],
   },
   {
     id: "david-lebón", name: "David Lebón", type: "artist", country: "Argentina",
     emoji: "🎸",
     description: "David Lebón es guitarrista y compositor del rock nacional, miembro de Serú Girán.",
     keyThemes: ["Rock", "Guitarra", "Compositor", "Clásico"],
     category: "Música",
     sourceNote: "Nacido el 8 de julio de 1952 en Buenos Aires.",
     events: [{ id: "lebon-nac", type: "creacion", label: "Nacimiento", date: "1952-07-08", year: 1952, description: "David Lebón nace en Buenos Aires.", source: "Encyclopaedia Britannica", confidence: "exacta", primaryForAffinity: true }],
   },

   // ────────────────────────────────────────────────────
   // ACTORES Y CINEASTAS
   // ────────────────────────────────────────────────────
   {
     id: "juan-carlos-altavista", name: "Juan Carlos Altavista", type: "artist", country: "Argentina",
     emoji: "🎬",
     description: "Juan Carlos Altavista es actor consagrado del cine y teatro argentino.",
     keyThemes: ["Cine", "Teatro", "Actuación", "Tradición"],
     category: "Cine",
     sourceNote: "Nacido en 1960.",
     events: [{ id: "altavista-nac", type: "creacion", label: "Nacimiento", year: 1960, description: "Juan Carlos Altavista nace.", source: "Cinemateca Argentina", confidence: "media", primaryForAffinity: true }],
   },
   {
     id: "luis-brandoni", name: "Luis Brandoni", type: "artist", country: "Argentina",
     emoji: "🎭",
     description: "Luis Brandoni es actor de gran trayectoria en cine, teatro y televisión argentina.",
     keyThemes: ["Actuación", "Teatro", "Cine", "Humanista"],
     category: "Cine",
     sourceNote: "Nacido el 7 de mayo de 1952 en Buenos Aires.",
     events: [{ id: "brandoni-nac", type: "creacion", label: "Nacimiento", date: "1952-05-07", year: 1952, description: "Luis Brandoni nace en Buenos Aires.", source: "AFSCA Argentina", confidence: "exacta", primaryForAffinity: true }],
   },
   {
     id: "campanella", name: "Juan José Campanella", type: "artist", country: "Argentina",
     emoji: "🎬",
     description: "Juan José Campanella es director y actor, ganador de Premio Óscar por \"El secreto de sus ojos\".",
     keyThemes: ["Cine", "Dirección", "Oscar", "Narrativa"],
     category: "Cine",
     sourceNote: "Nacido el 21 de noviembre de 1960 en Buenos Aires.",
     events: [{ id: "campanella-nac", type: "creacion", label: "Nacimiento", date: "1960-11-21", year: 1960, description: "Juan José Campanella nace en Buenos Aires.", source: "AFSCA Argentina", confidence: "exacta", primaryForAffinity: true }],
   },
   {
     id: "felipe-solá", name: "Felipe Solá", type: "artist", country: "Argentina",
     emoji: "🎭",
     description: "Felipe Solá es actor y dramaturgo con importante trayectoria en teatro experimental.",
     keyThemes: ["Teatro", "Dramaturgia", "Experimental", "Vanguardia"],
     category: "Teatro",
     sourceNote: "Nacido en 1962.",
     events: [{ id: "felipesola-nac", type: "creacion", label: "Nacimiento", year: 1962, description: "Felipe Solá nace en Argentina.", source: "GETAFE/Archivo", confidence: "media", primaryForAffinity: true }],
   },

   // ────────────────────────────────────────────────────
   // FUTBOLISTAS LEGENDARIOS
   // type: "football_player" — no "artist". Ver Atlas Personal (getPersonalAtlas):
   // el piloto trata equipos y jugadores como dos categorías propias, no como
   // una mezcla de "artistas" con música/literatura/teatro.
   // ────────────────────────────────────────────────────
   {
     id: "diego-maradona", name: "Diego Armando Maradona", type: "football_player", country: "Argentina",
     emoji: "⚽",
     description: "Diego Maradona es el futbolista más grande de Argentina, campeón mundial 1986, símbolo de la pasión deportiva.",
     keyThemes: ["Fútbol", "Campeón", "Mano de Dios", "Legendario"],
     category: "historico",
     sourceNote: "Nacido el 30 de octubre de 1960 en Lanús; fallecido el 25 de noviembre de 2020.",
     events: [{ id: "maradona-nac", type: "creacion", label: "Nacimiento", date: "1960-10-30", year: 1960, description: "Diego Armando Maradona Franco nace en Lanús, Buenos Aires.", source: "Encyclopaedia Britannica", confidence: "exacta", primaryForAffinity: true }],
   },
   {
     id: "lionel-messi", name: "Lionel Messi", type: "football_player", country: "Argentina",
     emoji: "⚽",
     description: "Lionel Messi es el futbolista contemporáneo más grande, ganador de 8 Balones de Oro, campeón mundial 2022.",
     keyThemes: ["Fútbol", "Campeón", "Artista", "Contemporáneo"],
     category: "historico",
     sourceNote: "Nacido el 24 de junio de 1987 en Rosario.",
     events: [{ id: "messi-nac", type: "creacion", label: "Nacimiento", date: "1987-06-24", year: 1987, description: "Lionel Andrés Messi Cuccittini nace en Rosario.", source: "FIFA / Encyclopaedia Britannica", confidence: "exacta", primaryForAffinity: true }],
   },
   {
     id: "juan-roman-riquelme", name: "Juan Román Riquelme", type: "football_player", country: "Argentina",
     emoji: "⚽",
     description: "Juan Román Riquelme es futbolista legendario, símbolo de Boca Juniors, campeón de Libertadores.",
     keyThemes: ["Fútbol", "Boca", "Libertadores", "Magicista"],
     category: "historico",
     sourceNote: "Nacido el 1 de junio de 1978 en La Plata.",
      events: [{ id: "riquelme-nac", type: "creacion", label: "Nacimiento", date: "1978-06-01", year: 1978, description: "Juan Román Riquelme nace en La Plata.", source: "Encyclopaedia Britannica", confidence: "exacta", primaryForAffinity: true }],
   },
   {
     id: "juan-pablo-sorin", name: "Juan Pablo Sorín", type: "football_player", country: "Argentina",
     emoji: "⚽",
     description: "Juan Pablo Sorín es futbolista histórico, campeón mundial 1986 con Argentina, defensor legendario.",
     keyThemes: ["Fútbol", "Campeón", "Defensa", "Histórico"],
     category: "historico",
     sourceNote: "Nacido el 25 de mayo de 1966 en Buenos Aires.",
      events: [{ id: "sorin-nac", type: "creacion", label: "Nacimiento", date: "1966-05-25", year: 1966, description: "Juan Pablo Sorín Tapia nace en Buenos Aires.", source: "Encyclopaedia Britannica", confidence: "exacta", primaryForAffinity: true }],
   },

   // ────────────────────────────────────────────────────
   // MEDIÁTICOS Y PERSONALIDADES
   // ────────────────────────────────────────────────────
   {
     id: "mirtha-legrand", name: "Mirtha Legrand", type: "artist", country: "Argentina",
     emoji: "📺",
     description: "Mirtha Legrand es ícono de la televisión argentina, conductora del legendario programa de entrevistas desde 1968.",
     keyThemes: ["Televisión", "Conversación", "Entrevistas", "Leyenda"],
     category: "Televisión",
     sourceNote: "Nacida el 23 de febrero de 1927 en Buenos Aires.",
      events: [{ id: "mirtha-nac", type: "creacion", label: "Nacimiento", date: "1927-02-23", year: 1927, description: "Mirtha Martínez Trevino nace en Buenos Aires.", source: "AFSCA Argentina", confidence: "exacta", primaryForAffinity: true }],
   },
   {
     id: "susana-gimenez", name: "Susana Giménez", type: "artist", country: "Argentina",
     emoji: "📺",
     description: "Susana Giménez es conductora y productora televisiva, figura mayor de la TV argentina.",
     keyThemes: ["Televisión", "Conducción", "Entretenimiento", "Ícono"],
     category: "Televisión",
     sourceNote: "Nacida el 29 de enero de 1944 en Buenos Aires.",
      events: [{ id: "susana-nac", type: "creacion", label: "Nacimiento", date: "1944-01-29", year: 1944, description: "Susana Giménez Aubert nace en Buenos Aires.", source: "AFSCA Argentina", confidence: "exacta", primaryForAffinity: true }],
    },

    // ────────────────────────────────────────────────────
    // PRÓCERES E HISTÓRICOS
    // ────────────────────────────────────────────────────
    {
      id: "manuel-belgrano", name: "Manuel Belgrano", type: "artist", country: "Argentina",
      emoji: "🇦🇷",
      description: "Manuel Belgrano es prócer de la independencia argentina, creador de la bandera nacional, legislador, militar y educador.",
      keyThemes: ["Independencia", "Bandera", "Legislación", "Educación"],
      category: "Prócer",
      sourceNote: "Nacido el 3 de junio de 1770 en Buenos Aires.",
      events: [{ id: "belgrano-nac", type: "creacion", label: "Nacimiento", date: "1770-06-03", year: 1770, description: "Manuel José Joaquín del Corazón de Jesús Belgrano nace en Buenos Aires.", source: "Historiografía argentina", confidence: "exacta", primaryForAffinity: true }],
    },
    {
      id: "san-martin", name: "José de San Martín", type: "artist", country: "Argentina",
      emoji: "🇦🇷",
      description: "José de San Martín es prócer argentino, libertador de Chile, Perú y alto Perú (Bolivia), militar estratega.",
      keyThemes: ["Independencia", "Libertador", "Militar", "Estrategia"],
      category: "Prócer",
      sourceNote: "Nacido el 25 de febrero de 1778 en Yapeyú, Corrientes.",
      events: [{ id: "sanmartin-nac", type: "creacion", label: "Nacimiento", date: "1778-02-25", year: 1778, description: "José Francisco de San Martín y Matorras nace en Yapeyú.", source: "Historiografía argentina", confidence: "exacta", primaryForAffinity: true }],
    },
    {
      id: "juan-manuel-rosas", name: "Juan Manuel de Rosas", type: "artist", country: "Argentina",
      emoji: "🇦🇷",
      description: "Juan Manuel de Rosas es figura histórica argentina, gobernador de Buenos Aires, símbolo del federalismo.",
      keyThemes: ["Política", "Federalismo", "Historia", "Polémica"],
      category: "Prócer",
      sourceNote: "Nacido el 30 de marzo de 1793 en Buenos Aires.",
      events: [{ id: "rosas-nac", type: "creacion", label: "Nacimiento", date: "1793-03-30", year: 1793, description: "Juan Manuel José Domingo Ortiz de Rozas nace en Buenos Aires.", source: "Historiografía argentina", confidence: "exacta", primaryForAffinity: true }],
    },
    {
      id: "domingo-sarmiento", name: "Domingo Faustino Sarmiento", type: "artist", country: "Argentina",
      emoji: "🇦🇷",
      description: "Domingo Sarmiento es estadista, educador, escritor y presidente de Argentina, símbolo de la educación.",
      keyThemes: ["Educación", "Política", "Literatura", "Civilización"],
      category: "Prócer",
      sourceNote: "Nacido el 15 de febrero de 1811 en San Juan.",
      events: [{ id: "sarmiento-nac", type: "creacion", label: "Nacimiento", date: "1811-02-15", year: 1811, description: "Domingo Faustino Sarmiento de la Igualdad nace en San Juan.", source: "Historiografía argentina", confidence: "exacta", primaryForAffinity: true }],
    },
 ];
