/**
 * Fuentes y referencias bibliográficas de Molino.
 * Cada fuente es verificable y corresponde a una tradición o disciplina específica.
 * NO inventar fuentes ni URLs.
 */

export interface Source {
  id: string;
  title: string;
  author: string;
  institution?: string;
  year?: string;
  url?: string;
  system: "numerologia" | "astrologia" | "zodiaco-chino" | "general" | "compatibilidad";
  type: "academic" | "museum" | "encyclopedia" | "historical" | "institutional";
  relevance: string;
}

export const SOURCES: Source[] = [
  // ═══════════════════════════════════════════
  // NUMEROLOGÍA
  // ═══════════════════════════════════════════
  {
    id: "britannica-numerology",
    title: "Numerology",
    author: "Encyclopaedia Britannica",
    institution: "Encyclopaedia Britannica",
    url: "https://www.britannica.com/science/numerology",
    system: "numerologia",
    type: "encyclopedia",
    relevance: "Definición general y contexto histórico de la numerología como práctica esotérica.",
  },
  {
    id: "stanford-pythagoras",
    title: "Pythagoras",
    author: "Stanford Encyclopedia of Philosophy",
    institution: "Stanford University",
    url: "https://plato.stanford.edu/entries/pythagoras/",
    system: "numerologia",
    type: "academic",
    relevance: "Contexto histórico sobre Pitágoras y el pitagorismo como escuela filosófica-matemática.",
  },
  {
    id: "iep-pythagoreanism",
    title: "Pythagoreanism",
    author: "Internet Encyclopedia of Philosophy",
    institution: "University of Tennessee",
    url: "https://iep.utm.edu/pythagoreanism/",
    system: "numerologia",
    type: "academic",
    relevance: "Análisis académico del pitagorismo y su relación con los números.",
  },
  {
    id: "buchanan-numerology-book",
    title: "Numerology and the Divine Triangle",
    author: "Faith Javane and Dusty Bunker",
    year: "1979",
    system: "numerologia",
    type: "historical",
    relevance: "Referencia clásica de numerología moderna. Documenta tradiciones interpretativas.",
  },
  {
    id: "lavoselle-numerology",
    title: "Numerology: Key to Your Inner Self",
    author: "Hans Decoz",
    year: "1994",
    system: "numerologia",
    type: "historical",
    relevance: "Una de las referencias más citadas en numerología moderna occidental.",
  },

  // ═══════════════════════════════════════════
  // ASTROLOGÍA
  // ═══════════════════════════════════════════
  {
    id: "britannica-astrology",
    title: "Astrology",
    author: "Encyclopaedia Britannica",
    institution: "Encyclopaedia Britannica",
    url: "https://www.britannica.com/science/astrology",
    system: "astrologia",
    type: "encyclopedia",
    relevance: "Definición y contexto histórico de la astrología. Documenta su origen en Mesopotamia.",
  },
  {
    id: "oxford-hellenistic-astrology",
    title: "Hellenistic Astrology: A History",
    author: "Chris Brennan",
    year: "2017",
    institution: "Aphrodisias Press",
    url: "https://theastrologypodcast.com/hellenistic-astrology/",
    system: "astrologia",
    type: "academic",
    relevance: "Estudio académico de la astrología helenística, sus orígenes y su influencia en la tradición occidental.",
  },
  {
    id: "penn-astrology-collection",
    title: "Ancient Astrology Collection",
    author: "University of Pennsylvania Museum",
    institution: "University of Pennsylvania",
    url: "https://www.penn.museum/",
    system: "astrologia",
    type: "museum",
    relevance: "Colección de tablillas cuneiformes babilónicas con registros astronómicos/astrológicos.",
  },
  {
    id: "bm-astrology-tablets",
    title: "Babylonian Astronomy and Astrology",
    author: "The British Museum",
    institution: "The British Museum",
    url: "https://www.britishmuseum.org/collection",
    system: "astrologia",
    type: "museum",
    relevance: "Tablillas cuneiformes con registros astronómicos que preceden la astrología occidental.",
  },
  {
    id: "green-astrology-interpretation",
    title: "Astrology for Yourself",
    author: "Robert Pelletier",
    year: "1987",
    system: "astrologia",
    type: "historical",
    relevance: "Referencia de interpretación astrológica occidental moderna.",
  },

  // ═══════════════════════════════════════════
  // ZODIACO CHINO
  // ═══════════════════════════════════════════
  {
    id: "britannica-chinese-zodiac",
    title: "Chinese Zodiac",
    author: "Encyclopaedia Britannica",
    institution: "Encyclopaedia Britannica",
    url: "https://www.britannica.com/topic/Chinese-zodiac",
    system: "zodiaco-chino",
    type: "encyclopedia",
    relevance: "Definición y descripción general del zodiaco chino y sus componentes.",
  },
  {
    id: "met-chinese-calendar",
    title: "The Chinese Calendar",
    author: "Metropolitan Museum of Art",
    institution: "Metropolitan Museum of Art",
    url: "https://www.metmuseum.org/",
    system: "zodiaco-chino",
    type: "museum",
    relevance: "Contexto cultural del calendario chino en la tradición artística.",
  },
  {
    id: "smithsonian-chinese-new-year",
    title: "Chinese New Year",
    author: "Smithsonian Institution",
    institution: "Smithsonian Institution",
    url: "https://www.smithsonianmag.com/",
    system: "zodiaco-chino",
    type: "museum",
    relevance: "Contexto cultural de las tradiciones del Año Nuevo chino y el zodiaco.",
  },
  {
    id: "tuttle-chinese-zodiac",
    title: "The Handbook of Chinese Horoscopes",
    author: "Theodora Lau",
    year: "1979",
    institution: "Tuttle Publishing",
    system: "zodiaco-chino",
    type: "historical",
    relevance: "Referencia clásica sobre el zodiaco chino y sus interpretaciones tradicionales.",
  },
  {
    id: "smith-chinese-astrology",
    title: "Chinese Astrology: A Primer",
    author: "Stephen Skinner",
    year: "2000",
    system: "zodiaco-chino",
    type: "historical",
    relevance: "Introducción accesible al sistema del zodiaco chino con contexto histórico.",
  },

  // ═══════════════════════════════════════════
  // GENERAL
  // ═══════════════════════════════════════════
  {
    id: "britannica-superstition",
    title: "Superstition",
    author: "Encyclopaedia Britannica",
    institution: "Encyclopaedia Britannica",
    url: "https://www.britannica.com/topic/superstition",
    system: "general",
    type: "encyclopedia",
    relevance: "Contexto sobre prácticas creenciales y su distinción con evidencia científica.",
  },
  {
    id: "nasa-astronomy",
    title: "Astronomy Picture of the Day",
    author: "NASA",
    institution: "NASA",
    url: "https://apod.nasa.gov/",
    system: "general",
    type: "institutional",
    relevance: "Referencia de astronomía científica para contrastar con astrología tradicional.",
  },
];

/**
 * Disclaimer estándar de Molino.
 * Debe aparecer en todas las páginas de conocimiento.
 */
export const MOLINO_DISCLAIMER = "Molino es una plataforma educativa y de entretenimiento. Sus interpretaciones pertenecen al ámbito de los sistemas simbólicos y no constituyen predicciones científicas, diagnósticos ni asesoramiento profesional.";

/**
 * Helper: obtener fuentes por sistema.
 */
export function getSourcesBySystem(system: Source["system"]): Source[] {
  return SOURCES.filter(s => s.system === system);
}

/**
 * Helper: obtener fuente por ID.
 */
export function getSourceById(id: string): Source | undefined {
  return SOURCES.find(s => s.id === id);
}
