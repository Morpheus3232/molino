export interface AcademyPiece {
  id: string;
  slug: string;
  era: string;
  title: string;
  icon: string;
  origin: string;
  idea: string;
  influence: string[];
  molino: string;
  metaDescription: string;
  story: string[];
  /** Slug de la guía práctica (academy-guides.ts) que continúa este tema, si existe. */
  relatedGuideSlug?: string;
}

export const ACADEMY_PIECES: AcademyPiece[] = [
  {
    id: "babilonia",
    slug: "babilonia",
    era: "~3000 a.C.",
    title: "Babilonia",
    icon: "knowledge",
    origin: "Mesopotamia (actual Irak)",
    idea: "Los babilonios observaron los ciclos celestes y los conectaron con la vida terrestre.",
    influence: ["Astronomía", "Ciclos planetarios", "Simbolismo celestial"],
    molino: "Base del sistema de ciclos y timing",
    metaDescription:
      "Babilonia fue la cuna de la observación de los ciclos celestes. Conocé cómo su astronomía y su simbolismo celestial dieron origen a los sistemas que Molino usa para calcular tus ciclos personales.",
    story: [
      "Los sacerdotes de Babilonia registraron durante siglos el movimiento del Sol, la Luna y los planetas visibles. Esa observación sistemática no era solo astronomía: cada ciclo celeste se leía como un ritmo repetible con sentido para la vida en la Tierra, desde la siembra hasta el gobierno de los imperios.",
      "De esa herencia nació la idea de que el tiempo no es un flujo neutral sino una sucesión de ciclos con carácter propio. Es la misma intuición que sostiene la lectura del año personal y el timing en Molino: hay momentos que piden iniciar, sostener y otros que piden cerrar.",
    ],
  },
  {
    id: "pitagoras",
    slug: "pitagoras",
    era: "~570 a.C.",
    title: "Pitágoras",
    icon: "numbers",
    origin: "Grecia antigua",
    idea: "\"Todo es número\" — el universo tiene patrones matemáticos.",
    influence: ["Numerología", "Tetraktys", "Música de las esferas"],
    molino: "Base del sistema de números y Life Path",
    metaDescription:
      "Pitágoras y la idea de que «todo es número». El origen de la numerología occidental y su influencia en el cálculo del Camino de Vida que usa Molino.",
    story: [
      "Para la escuela pitagórica, los números no eran herramientas de medición sino la estructura íntima de la realidad. La tetractys — el uno, el dos, el tres y el cuatro sumando diez — condensaba esa visión: los patrones numéricos ordenaban el cosmos, la música y el carácter humano.",
      "Aunque los historiadores modernos no encuentran evidencia directa de que Pitágoras haya escrito una tabla que asigne letras a números, su intuición atraviesa toda la numerología occidental. Molino la hereda en el cálculo del Camino de Vida, el número principal de tu mapa.",
    ],
  },
  {
    id: "guematia",
    slug: "guematia",
    era: "~300 a.C.",
    title: "Guematría y Cábala",
    icon: "letters",
    origin: "Tradición hebrea",
    idea: "Cada letra tiene un valor numérico. El nombre revela la esencia.",
    influence: ["Valores numéricos", "Conexiones simbólicas", "Significado del nombre"],
    molino: "Influencia en Expression Number y Soul Number",
    metaDescription:
      "La guematría hebrea asigna un valor numérico a cada letra. Descubrí cómo esta tradición influye en los números de Expresión y Alma que Molino calcula a partir de tu nombre.",
    story: [
      "En la tradición hebrea, las letras no solo forman palabras: cada una porta un valor numérico y un peso simbólico. La guematría comparaba palabras y pasajes por su valor total, buscando correspondencias que revelaran sentidos ocultos.",
      "Esa idea — que el nombre dice algo esencial sobre la persona — sobrevive hoy en la numerología. En Molino se traduce directamente en el Expression Number y el Soul Number, calculados a partir de las letras de tu nombre completo.",
    ],
  },
  {
    id: "helenistica",
    slug: "helenistica",
    era: "Siglo I d.C.",
    title: "Astrología helenística",
    icon: "stars",
    origin: "Roma/Egipto",
    idea: "Fusión de babilónica + filosofía griega: signos, casas, aspectos.",
    influence: ["Signos zodiacales", "Casas astrológicas", "Aspectos planetarios"],
    molino: "Base del sistema de astrología occidental",
    metaDescription:
      "La astrología helenística fusionó la observación babilónica con la filosofía griega. Conocé cómo definió los signos, las casas y los aspectos que usa Molino.",
    story: [
      "Cuando la astronomía babilónica llegó al Mediterráneo, la filosofía griega la reinterpretó: los planetas y los signos dejaron de ser señales para convertirse en un lenguaje del carácter y del destino. Así nacieron las casas astrológicas y los aspectos entre planetas.",
      "Ese modelo, codificado y transmitido durante siglos, es la base del zodiaco occidental. Molino lo utiliza para calcular tu signo solar y para conectar las posiciones del cielo con tu perfil personal.",
    ],
  },
  {
    id: "zodiaco-chino",
    slug: "zodiaco-chino",
    era: "Siglo V",
    title: "Zodíaco chino",
    icon: "cycle",
    origin: "China imperial",
    idea: "12 animales, ciclos de 60 años, elementos Yin/Yang.",
    influence: ["12 animales", "Ciclos de 60 años", "Elementos"],
    molino: "Base del sistema de zodíaco chino y animales",
    metaDescription:
      "El zodíaco chino combina 12 animales con los elementos Yin y Yang en ciclos de 60 años. Descubrí su origen imperial y cómo Molino lo integra en tu mapa.",
    story: [
      "En la China imperial, el tiempo se organizaba en ciclos sexagenarios: cada año combinaba uno de los cinco elementos con uno de los doce animales, creando 60 combinaciones distintas. El sistema ordenaba calendarios, decisiones y rituales.",
      "Los doce animales se convirtieron en una forma accesible de leer el carácter y la suerte. Molino lo usa como uno de los tres ejes de tu mapa: tu animal zodiacal, sus afinidades y los ciclos que rigen tu año.",
    ],
    relatedGuideSlug: "como-funciona-el-zodiaco-chino",
  },
  {
    id: "balliett",
    slug: "balliett",
    era: "~1905",
    title: "L. Dow Balliett",
    icon: "book",
    origin: "Estados Unidos",
    idea: "Popularizó la numerología moderna. Introdujo el Life Path como concepto central.",
    influence: ["Life Path", "Números maestros", "Interpretación moderna"],
    molino: "Formalización del cálculo de Camino de Vida",
    metaDescription:
      "L. Dow Balliett popularizó la numerología moderna a principios del siglo XX. Conocé cómo formalizó el Life Path, el concepto central que Molino usa para tu Camino de Vida.",
    story: [
      "A principios del siglo XX, L. Dow Balliett escribió los libros que transformaron la numerología dispersa en un sistema completo y enseñable. Su aporte clave fue convertir el concepto de Life Path — el número que se deriva de la fecha de nacimiento — en el eje de la lectura personal.",
      "Ese número es hoy el punto de partida de casi toda la numerología de habla inglesa y la base del Camino de Vida que Molino calcula primero en tu mapa.",
    ],
  },
  {
    id: "cheiro",
    slug: "cheiro",
    era: "~1920",
    title: "Cheiro y Florence Campbell",
    icon: "hand",
    origin: "Irlanda/EE.UU.",
    idea: "Popularización masiva de la numerología y la quiromancia.",
    influence: ["Numerología popular", "Acessibilidad", "Cultura pop"],
    molino: "Hizo la numerología accesible para el público general",
    metaDescription:
      "Cheiro y Florence Campbell llevaron la numerología al gran público en el siglo XX. Conocé cómo hicieron accesibles los números como herramienta de autoconocimiento.",
    story: [
      "Cheiro — seudónimo del irlandés William John Warner — convirtió la lectura de la mano y los números en espectáculo y consulta para celebridades. Junto a Florence Campbell, llevó la numerología de los círculos esotéricos a un público masivo.",
      "Su legado fue la accesibilidad: cualquiera podía calcular sus números sin ser iniciado. Esa puerta abierta es la razón por la que hoy existe un mapa personal como el de Molino, calculado en segundos desde tu fecha de nacimiento.",
    ],
  },
  {
    id: "jordan",
    slug: "jordan",
    era: "~1960",
    title: "Juno Jordan",
    icon: "graduation",
    origin: "Estados Unidos",
    idea: "Formalizó la escuela de numerología pitagórica moderna.",
    influence: ["Escuela pitagórica", "Análisis profundo", "Compatibilidad"],
    molino: "Base del análisis de compatibilidad numérica",
    metaDescription:
      "Juno Jordan formalizó la escuela de numerología pitagórica moderna a mediados del siglo XX. Conocé su influencia en el análisis profundo y la compatibilidad numérica de Molino.",
    story: [
      "A mediados del siglo XX, Juno Jordan sistematizó las interpretaciones pitagóricas en una escuela coherente, con reglas claras de cálculo y lectura. Su trabajo dio profundidad al sistema: no solo un número, sino un perfil completo con fortalezas, desafíos y patrones de relación.",
      "Esa estructura es la que permite hoy comparar perfiles y analizar afinidades. En Molino, el análisis de compatibilidad numérica entre personas se apoya en la formalización de esta escuela.",
    ],
  },
  {
    id: "mccants",
    slug: "mccants",
    era: "~2000",
    title: "Glynis McCants",
    icon: "computer",
    origin: "Estados Unidos",
    idea: "Numerología para la era digital. Ciclos personales y compatibilidad.",
    influence: ["Ciclos personales", "Compatibilidad digital", "Aplicaciones modernas"],
    molino: "Inspiración para ciclos personales y recomendaciones",
    metaDescription:
      "Glynis McCants adaptó la numerología a la era digital con ciclos personales y compatibilidad. Conocé cómo inspira los ciclos y recomendaciones de Molino.",
    story: [
      "Con libros, programas de televisión y presencia masiva en internet, Glynis McCants demostró que la numerología podía funcionar en la era digital: cálculos inmediatos, ciclos personales por año y compatibilidad entre personas.",
      "Su enfoque práctico — los números como herramienta para decidir, no para adivinar — inspira la forma en que Molino presenta los ciclos personales y las recomendaciones de tu momento actual.",
    ],
  },
  {
    id: "molino",
    slug: "molino",
    era: "Hoy",
    title: "Molino",
    icon: "flame",
    origin: "Plataforma global",
    idea: "Tu mapa: combina tradiciones históricas en una lectura personal.",
    influence: ["Numerología", "Astrología", "Zodíaco chino", "IA", "Recomendaciones"],
    molino: "Convergencia de todas las tradiciones en una plataforma moderna",
    metaDescription:
      "Molino combina miles de años de tradiciones simbólicas — numerología, astrología y zodíaco chino — en un mapa personal calculado en tu navegador, sin registro ni guardado de datos.",
    story: [
      "Después de miles de años, las tradiciones simbólicas dejan de estar separadas. Molino cruza numerología, astrología occidental y zodíaco chino para producir una lectura personal, coherente y honesta: un solo mapa que se lee como un instrumento, no como una profecía.",
      "El cálculo ocurre por completo en tu navegador: tu nombre y tu fecha de nacimiento no salen de tu dispositivo, no se registran ni se guardan. Molino es un instrumento personal y privado de orientación temporal y autoconocimiento.",
    ],
  },
];

export function getAcademyPieceBySlug(slug: string): AcademyPiece | undefined {
  return ACADEMY_PIECES.find((piece) => piece.slug === slug);
}
