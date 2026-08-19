export interface BibliotecaSource {
  id: string;
  slug: string;
  title: string;
  author: string;
  year: string;
  type: "libro" | "articulo" | "video" | "sitio";
  description: string;
  review?: string;
  summary?: string;
  link?: string;
  tags?: string[];
  category: string;
  era: "ancestral" | "moderno";
  metaDescription: string;
}

export const CATEGORY_LABELS: Record<string, string> = {
  numerologia: "Numerología",
  astrologia: "Astrología",
  zodiaco: "Zodíaco chino",
  personalidad: "Sistemas de personalidad",
  filosofia: "Misticismo y filosofía",
};

export const CATEGORY_ORDER = ["numerologia", "astrologia", "zodiaco", "personalidad", "filosofia"];

export const SOURCES: BibliotecaSource[] = [
  {
    id: "pitagoras",
    slug: "pitagoras",
    title: "Numerología Pitagórica",
    author: "Pitágoras (atribuido)",
    year: "~500 a.C.",
    type: "libro",
    category: "numerologia",
    era: "ancestral",
    description: "Sistema de numerología occidental que asigna valores numéricos a las letras.",
    review: "La numerología pitagórica es el sistema más utilizado en occidente. Aunque se atribuye a Pitágoras, los historiadores modernos no encuentran evidencia directa.",
    summary: "Asigna valores del 1 al 9 a cada letra del alfabeto. Se usa para calcular Camino de Vida, Expresión, Alma y Personalidad.",
    tags: ["numerología", "historia"],
    metaDescription:
      "La numerología pitagórica asigna valores del 1 al 9 a las letras del alfabeto. Es la base del cálculo del Camino de Vida, la Expresión, el Alma y la Personalidad en Molino.",
  },
  {
    id: "numerologia-caldaica",
    slug: "numerologia-caldaica",
    title: "Numerología Caldea",
    author: "Tradicional",
    year: "~500 a.C.",
    type: "articulo",
    category: "numerologia",
    era: "ancestral",
    description: "Sistema de numerología basado en valores numéricos de las letras del alfabeto caldeo.",
    review: "Anterior a la pitagórica. Usa un alfabeto diferente con valores distintos.",
    summary: "Asigna valores del 1 al 8 al alfabeto caldeo. Origen babilónico.",
    tags: ["numerología", "caldeo"],
    metaDescription:
      "La numerología caldea es anterior a la pitagórica y asigna valores del 1 al 8 al alfabeto caldeo de origen babilónico.",
  },
  {
    id: "astrologia",
    slug: "astrologia",
    title: "Astrología Tropical",
    author: "Tradicional",
    year: "~300 a.C.",
    type: "libro",
    category: "astrologia",
    era: "ancestral",
    description: "Sistema de 12 signos basados en la posición del sol en el zodíaco.",
    review: "Codificada por astrólogos helenísticos a partir de la tradición babilónica. Sistema más utilizado en occidente.",
    summary: "Asocia la posición del sol con 12 signos zodiacales. Cada signo tiene un elemento y una modalidad.",
    tags: ["astrología", "signos"],
    metaDescription:
      "La astrología asocia la posición del sol con 12 signos zodiacales. Es el sistema más utilizado en occidente y la base del signo solar de tu mapa.",
  },
  {
    id: "tetrabiblos",
    slug: "tetrabiblos",
    title: "Tetrabiblos",
    author: "Claudio Ptolomeo",
    year: "~150 d.C.",
    type: "libro",
    category: "astrologia",
    era: "ancestral",
    description: "Tratado fundamental de astrología occidental que estableció las bases del sistema de 12 signos, casas y aspectos planetarios.",
    review: "La obra astrológica más influyente de la historia. Ptolomeo sistematizó la astrología helenística en cuatro libros que definieron la práctica durante casi dos milenios.",
    summary: "Divide la astrología en cuatro partes: principios generales, predicciones universales, predicciones natales y predicciones por lugar de origen.",
    tags: ["astrología", "historia"],
    metaDescription:
      "El Tetrabiblos de Ptolomeo sistematizó la astrología helenística en cuatro libros y definió la práctica astrológica occidental durante casi dos milenios.",
  },
  {
    id: "astrologia-moderna",
    slug: "astrologia-moderna",
    title: "Astrología Moderna",
    author: "Stephen Arroyo",
    year: "1975",
    type: "libro",
    category: "astrologia",
    era: "moderno",
    description: "Enfoque psicológico y humanista de la astrología.",
    review: "Pionero en reencuadrar la astrología como herramienta psicológica. Enfoque más honesto.",
    summary: "Los signos, planetas y aspectos se interpretan como energías psicológicas, no como destinos.",
    tags: ["astrología", "psicología"],
    metaDescription:
      "Stephen Arroyo reencuadró la astrología como herramienta psicológica: signos, planetas y aspectos como energías internas, no como destinos.",
  },
  {
    id: "rudhyar-astrologia-personalidad",
    slug: "astrologia-de-la-personalidad",
    title: "The Astrology of Personality",
    author: "Dane Rudhyar",
    year: "1936",
    type: "libro",
    category: "astrologia",
    era: "moderno",
    description: "Obra fundacional de la astrología humanista: los planetas como funciones psicológicas, no como fatalidades.",
    review: "El primer intento serio de reformular la astrología con el lenguaje de la psicología junguiana. Base directa del enfoque de Arroyo y Greene.",
    summary: "Cada planeta representa una función de la personalidad en desarrollo; el tránsito no predice, acompaña un proceso de individuación.",
    tags: ["astrología", "psicología"],
    metaDescription:
      "Dane Rudhyar fundó la astrología humanista: los planetas como funciones psicológicas de individuación, no como fatalidades escritas de antemano.",
  },
  {
    id: "greene-saturno",
    slug: "saturno",
    title: "Saturn: A New Look at an Old Devil",
    author: "Liz Greene",
    year: "1976",
    type: "libro",
    category: "astrologia",
    era: "moderno",
    description: "Relectura psicológica de Saturno: de maléfico tradicional a maestro interior de la disciplina y el límite.",
    review: "Texto clave de la astrología psicológica contemporánea. Greene combina astrología junguiana con práctica clínica real.",
    summary: "Saturno como la parte de nosotros que más tememos y que, trabajada, se vuelve la más sólida.",
    tags: ["astrología", "psicología"],
    metaDescription:
      "Liz Greene relee a Saturno desde la psicología junguiana: de maléfico tradicional a maestro interior de la disciplina, el límite y la madurez.",
  },
  {
    id: "jung-arquetipos",
    slug: "arquetipos-e-inconsciente-colectivo",
    title: "Los arquetipos y lo inconsciente colectivo",
    author: "Carl G. Jung",
    year: "1934",
    type: "libro",
    category: "filosofia",
    era: "moderno",
    description: "Teoría del inconsciente colectivo y los arquetipos: patrones simbólicos universales que explican por qué ciertos símbolos resuenan entre culturas.",
    review: "La obra central de Jung sobre arquetipos. Fundamenta por qué sistemas simbólicos distintos (astrología, numerología, zodíaco chino) comparten estructuras narrativas.",
    summary: "Los arquetipos son patrones heredados de la psique humana que se expresan como símbolos — el mismo mecanismo que sostiene la lectura simbólica de un mapa natal o un número.",
    tags: ["psicología", "arquetipos"],
    metaDescription:
      "Carl Jung describe el inconsciente colectivo y los arquetipos: patrones simbólicos universales que explican por qué la lectura simbólica resuena entre culturas y sistemas.",
  },
  {
    id: "zodiaco-chino",
    slug: "zodiaco-chino",
    title: "Zodiaco Chino",
    author: "Tradicional",
    year: "leyenda ~2000 a.C.",
    type: "sitio",
    category: "zodiaco",
    era: "ancestral",
    description: "Ciclo de 12 animales y 5 elementos basado en el calendario lunar chino.",
    review: "El origen de ~2000 a.C. es leyenda, no fecha documentada. La evidencia histórica sólida del sistema arranca en la dinastía Han (desde ~206 a.C.).",
    summary: "El ciclo sexagenario combina 12 animales con 5 elementos creando 60 combinaciones.",
    link: "https://www.chinahighlights.com/travelguide/chinese-zodiac/",
    tags: ["zodiaco chino", "animales"],
    metaDescription:
      "El zodiaco chino combina 12 animales con 5 elementos en un ciclo sexagenario de 60 combinaciones, basado en el calendario lunar. Es uno de los tres ejes del mapa de Molino.",
  },
  {
    id: "i-ching",
    slug: "i-ching",
    title: "I Ching",
    author: "Tradicional",
    year: "~1000 a.C.",
    type: "libro",
    category: "filosofia",
    era: "ancestral",
    description: "Libro de las mutaciones. Base filosófica del zodiaco chino y la adivinación.",
    review: "Uno de los textos filosóficos más antiguos del mundo. Jung lo estudió extensamente.",
    summary: "Utiliza 64 hexagramas para representar situaciones y transiciones. Su valor está en la reflexión.",
    tags: ["i ching", "filosofía", "zodiaco chino"],
    metaDescription:
      "El I Ching, libro de las mutaciones, usa 64 hexagramas para representar situaciones y transiciones. Es la base filosófica del zodiaco chino y su valor está en la reflexión.",
  },
  {
    id: "kybalion",
    slug: "kybalion",
    title: "El Kybalion",
    author: "Tres Iniciados",
    year: "1908",
    type: "libro",
    category: "filosofia",
    era: "ancestral",
    description: "Siete principios herméticos que influyen en la filosofía occidental.",
    review: "Obra influyente en el pensamiento esotérico moderno. Su atribución histórica es cuestionable.",
    summary: "Enuncia siete principios: Mentalismo, Correspondencia, Vibración, Polaridad, Ritmo, Causa y Efecto, y Género.",
    tags: ["hermetismo", "filosofía"],
    metaDescription:
      "El Kybalion enuncia los siete principios herméticos — Mentalismo, Correspondencia, Vibración, Polaridad, Ritmo, Causa y Efecto, y Género — del pensamiento esotérico occidental.",
  },
  {
    id: "kabbalah",
    slug: "kabbalah",
    title: "La Kabbalah",
    author: "Tradicional",
    year: "~1200",
    type: "libro",
    category: "filosofia",
    era: "ancestral",
    description: "Árbol de la vida y sistema místico judío.",
    review: "Sistema místico con siglos de tradición. Su uso popular tiene poco que ver con la tradición original.",
    summary: "El Árbol de la Vida tiene 10 sefirot conectados por 22 caminos. Se usa para meditación y comprensión.",
    tags: ["kabbalah", "misticismo"],
    metaDescription:
      "La Kabbalah y su Árbol de la Vida: 10 sefirot conectados por 22 caminos, un sistema místico de siglos usado para la meditación y la comprensión.",
  },
  {
    id: "eneagrama",
    slug: "eneagrama",
    title: "The Enneagram",
    author: "Don Richard Riso",
    year: "1987",
    type: "libro",
    category: "personalidad",
    era: "ancestral",
    description: "Tipología de 9 personalidades con raíces en tradiciones espirituales.",
    review: "Sistema de tipología con 9 tipos. Funciona mejor como herramienta de autoconocimiento que como ciencia.",
    summary: "Los 9 tipos representan motivaciones centrales: Perfeccionista, Ayudador, Triunfador, etc.",
    tags: ["eneagrama", "personalidad"],
    metaDescription:
      "El Eneagrama describe 9 tipos de personalidad por sus motivaciones centrales. Funciona como herramienta de autoconocimiento, no como ciencia.",
  },
  {
    id: "human-design",
    slug: "human-design",
    title: "Human Design",
    author: "Ra Uru Hu",
    year: "1987",
    type: "sitio",
    category: "personalidad",
    era: "moderno",
    description: "Sistema que combina astrología, I Ching, chakras y Kabbalah.",
    review: "Creado en 1987. Combina múltiples sistemas. No tiene respaldo científico pero tiene comunidad activa.",
    summary: "Define 5 tipos de energía basados en la posición de los planetas y el I Ching.",
    link: "https://www.jovianarchive.com",
    tags: ["human design", "energía"],
    metaDescription:
      "Human Design combina astrología, I Ching, chakras y Kabbalah para definir 5 tipos de energía según la posición de los planetas en tu nacimiento.",
  },
  {
    id: "gene-keys",
    slug: "gene-keys",
    title: "Gene Keys",
    author: "Richard Rudd",
    year: "2009",
    type: "libro",
    category: "personalidad",
    era: "moderno",
    description: "Sistema de 64 hexagramas como dones y sombras.",
    review: "Toma los 64 hexagramas del I Ching y los vincula con el ADN. Creativo pero sin base científica.",
    summary: "Cada hexagrama tiene una Sombra, un Don y una Sidhi. Se mapea a la fecha de nacimiento.",
    tags: ["gene keys", "codigo"],
    metaDescription:
      "Gene Keys toma los 64 hexagramas del I Ching y los vincula con el ADN: cada uno tiene una Sombra, un Don y una Sidhi, mapeados a tu fecha de nacimiento.",
  },
];

export function getSourceBySlug(slug: string): BibliotecaSource | undefined {
  return SOURCES.find((source) => source.slug === slug);
}
