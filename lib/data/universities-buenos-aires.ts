import type { AtlasEntityInput } from "@/types/atlas";

/**
 * Universidades de Buenos Aires — Públicas y Privadas con Links
 * Includes major institutions in the Buenos Aires metropolitan area.
 * Separadas por tipo (pública/privada) e incluye URLs de referencia.
 */
export const UNIVERSITIES_BUENOS_AIRES: AtlasEntityInput[] = [
  // ────────────────────────────────────────────────────
  // PÚBLICAS
  // ────────────────────────────────────────────────────
  {
    id: "uba", name: "Universidad de Buenos Aires (UBA)", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "La UBA es la universidad pública más grande de Argentina y una de las más prestigiosas de América Latina. Fundada en 1821, es la cuna de científicos, artistas e intelectuales.",
    keyThemes: ["Pública", "Prestigio", "Ciencia", "Excelencia"],
    category: "Pública",
    sourceNote: "Fundada el 9 de agosto de 1821. URL: www.uba.ar",
    events: [{ id: "uba-fund", type: "fundacion", label: "Fundación", date: "1821-08-09", year: 1821, description: "Bernardino Rivadavia funda la Universidad de Buenos Aires.", source: "UBA — Historia institucional", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "unlp", name: "Universidad Nacional de La Plata (UNLP)", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "La UNLP es la universidad pública más importante del interior bonaerense, con fuerte presencia en investigación y formación profesional.",
    keyThemes: ["Pública", "La Plata", "Investigación", "Excelencia"],
    category: "Pública",
    sourceNote: "Fundada el 7 de noviembre de 1888. URL: www.unlp.edu.ar",
    events: [{ id: "unlp-fund", type: "fundacion", label: "Fundación", date: "1888-11-07", year: 1888, description: "Se funda la Universidad Nacional de La Plata.", source: "UNLP — Historia institucional", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "ungs", name: "Universidad Nacional de General Sarmiento (UNGS)", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "La UNGS es universidad pública del conurbano norte, con énfasis en inclusión educativa.",
    keyThemes: ["Pública", "Conurbano", "Inclusión", "Acceso"],
    category: "Pública",
    sourceNote: "Fundada en 1995. URL: www.ungs.edu.ar",
    events: [{ id: "ungs-fund", type: "fundacion", label: "Fundación", year: 1995, description: "Se funda la UNGS en Los Polvorines.", source: "UNGS — Historia institucional", confidence: "media", primaryForAffinity: true }],
  },
  {
    id: "untref", name: "Universidad Nacional de Tres de Febrero (UNTREF)", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "UNTREF es universidad pública del conurbano oeste con programas innovadores.",
    keyThemes: ["Pública", "Conurbano", "Innovación", "Acceso"],
    category: "Pública",
    sourceNote: "Fundada en 1996. URL: www.untref.edu.ar",
    events: [{ id: "untref-fund", type: "fundacion", label: "Fundación", year: 1996, description: "Se funda la UNTREF en Caseros.", source: "UNTREF — Historia institucional", confidence: "media", primaryForAffinity: true }],
  },
  {
    id: "unq", name: "Universidad Nacional de Quilmes (UNQ)", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "UNQ es universidad pública del conurbano sur con énfasis en tecnología e innovación.",
    keyThemes: ["Pública", "Conurbano", "Tecnología", "Innovación"],
    category: "Pública",
    sourceNote: "Fundada en 1989. URL: www.unq.edu.ar",
    events: [{ id: "unq-fund", type: "fundacion", label: "Fundación", year: 1989, description: "Se funda la UNQ en Bernal.", source: "UNQ — Historia institucional", confidence: "media", primaryForAffinity: true }],
  },
  {
    id: "unsam", name: "Universidad Nacional de San Martín (UNSAM)", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "UNSAM es universidad pública del conurbano norte con programas de investigación.",
    keyThemes: ["Pública", "Conurbano norte", "Investigación", "Innovación"],
    category: "Pública",
    sourceNote: "Fundada en 1992. URL: www.unsam.edu.ar",
    events: [{ id: "unsam-fund", type: "fundacion", label: "Fundación", year: 1992, description: "Se funda la UNSAM en San Martín.", source: "UNSAM — Historia institucional", confidence: "media", primaryForAffinity: true }],
  },

  // ────────────────────────────────────────────────────
  // PRIVADAS
  // ────────────────────────────────────────────────────
  {
    id: "uade", name: "Universidad Argentina de la Empresa (UADE)", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "UADE es universidad privada especializada en negocios, administración y tecnología.",
    keyThemes: ["Privada", "Negocios", "Administración", "Empresa"],
    category: "Privada",
    sourceNote: "Fundada en 1957. URL: www.uade.edu.ar",
    events: [{ id: "uade-fund", type: "fundacion", label: "Fundación", year: 1957, description: "Se funda la UADE.", source: "UADE — Historia institucional", confidence: "media", primaryForAffinity: true }],
  },
  {
    id: "usf", name: "Universidad San Francisco de Asís (USFA)", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "USFA es universidad privada con énfasis en humanidades y ciencias sociales.",
    keyThemes: ["Privada", "Humanidades", "Ciencias sociales", "Tradición"],
    category: "Privada",
    sourceNote: "Fundada en 1972. URL: www.usf.edu.ar",
    events: [{ id: "usfa-fund", type: "fundacion", label: "Fundación", year: 1972, description: "Se funda la USFA.", source: "USFA — Historia institucional", confidence: "media", primaryForAffinity: true }],
  },
  {
    id: "universidad-torcuato", name: "Universidad Torcuato Di Tella", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "Torcuato Di Tella es universidad privada de élite con fuerte presencia en ciencias sociales y economía.",
    keyThemes: ["Privada", "Élite", "Ciencias sociales", "Investigación"],
    category: "Privada",
    sourceNote: "Fundada en 1989. URL: www.utdt.edu.ar",
    events: [{ id: "utdt-fund", type: "fundacion", label: "Fundación", year: 1989, description: "Se funda la Universidad Torcuato Di Tella.", source: "UTDT — Historia institucional", confidence: "media", primaryForAffinity: true }],
  },
  {
    id: "uces", name: "Universidad del Centro de Estudios Macroeconómicos Argentinos (UCEMA)", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "UCEMA es universidad privada especializada en economía y ciencias empresariales.",
    keyThemes: ["Privada", "Economía", "Especializada", "Investigación"],
    category: "Privada",
    sourceNote: "Fundada en 1984. URL: www.ucema.edu.ar",
    events: [{ id: "ucema-fund", type: "fundacion", label: "Fundación", year: 1984, description: "Se funda la UCEMA.", source: "UCEMA — Historia institucional", confidence: "media", primaryForAffinity: true }],
  },
  {
    id: "universidad-belgrano", name: "Universidad de Belgrano (UB)", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "Universidad de Belgrano es institución privada con programas en derecho, economía y administración.",
    keyThemes: ["Privada", "Derecho", "Administración", "Tradición"],
    category: "Privada",
    sourceNote: "Fundada en 1964. URL: www.ub.edu.ar",
    events: [{ id: "ub-fund", type: "fundacion", label: "Fundación", year: 1964, description: "Se funda la Universidad de Belgrano.", source: "UB — Historia institucional", confidence: "media", primaryForAffinity: true }],
  },
  {
    id: "universidad-blas-pascal", name: "Universidad Blas Pascal", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "Universidad Blas Pascal es institución privada con énfasis en formación integral.",
    keyThemes: ["Privada", "Formación", "Integral", "Humanidades"],
    category: "Privada",
    sourceNote: "Fundada en 1980. URL: www.ubp.edu.ar",
    events: [{ id: "ubp-fund", type: "fundacion", label: "Fundación", year: 1980, description: "Se funda la Universidad Blas Pascal.", source: "UBP — Historia institucional", confidence: "media", primaryForAffinity: true }],
  },
  {
    id: "universidad-palermo", name: "Universidad de Palermo (UP)", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "Universidad de Palermo es institución privada con énfasis en diseño, comunicación y negocios.",
    keyThemes: ["Privada", "Diseño", "Comunicación", "Creatividad"],
    category: "Privada",
    sourceNote: "Fundada en 1989. URL: www.palermo.edu.ar",
    events: [{ id: "up-fund", type: "fundacion", label: "Fundación", year: 1989, description: "Se funda la Universidad de Palermo.", source: "UP — Historia institucional", confidence: "media", primaryForAffinity: true }],
  },
  {
    id: "universidad-siglo-21", name: "Universidad Siglo 21", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "Universidad Siglo 21 es institución privada con programas a distancia y presenciales.",
    keyThemes: ["Privada", "Educación a distancia", "Innovación", "Acceso"],
    category: "Privada",
    sourceNote: "Fundada en 1995. URL: www.21.edu.ar",
    events: [{ id: "s21-fund", type: "fundacion", label: "Fundación", year: 1995, description: "Se funda la Universidad Siglo 21.", source: "Siglo 21 — Historia institucional", confidence: "media", primaryForAffinity: true }],
  },
  {
    id: "isalud-arg", name: "ISALUD Argentina", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "ISALUD es institución privada especializada en salud y ciencias médicas.",
    keyThemes: ["Privada", "Salud", "Medicina", "Especializada"],
    category: "Privada",
    sourceNote: "Presente en Buenos Aires desde 1990s. URL: www.isalud.edu.ar",
    events: [{ id: "isalud-arg-fund", type: "fundacion", label: "Operaciones", year: 1990, description: "ISALUD expande operaciones a Buenos Aires.", source: "ISALUD — Historia institucional", confidence: "media", primaryForAffinity: false }],
  },
  {
    id: "universidad-notarial", name: "Universidad Notarial Argentina", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "Universidad Notarial Argentina es institución especializada en derecho notarial.",
    keyThemes: ["Privada", "Derecho", "Especializada", "Profesión"],
    category: "Privada",
    sourceNote: "Fundada en 1970.",
    events: [{ id: "una-fund", type: "fundacion", label: "Fundación", year: 1970, description: "Se funda la Universidad Notarial Argentina.", source: "UNA — Historia", confidence: "media", primaryForAffinity: true }],
  },
];
