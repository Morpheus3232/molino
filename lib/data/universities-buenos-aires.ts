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
  // UBA vive en symbolic-entities.ts (id "uba") — no duplicar acá.
  // UNLP vive en universities-argentina.ts (id "unlp") — no duplicar acá.
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
  // Universidad Torcuato Di Tella vive en universities-argentina.ts (id "di-tella",
  // año 1991 verificado) — esta entrada duplicaba la universidad con un año
  // incorrecto (1989); no duplicar acá.
  {
    id: "ucema", name: "Universidad del CEMA (UCEMA)", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "UCEMA es universidad privada especializada en economía y ciencias empresariales.",
    keyThemes: ["Privada", "Economía", "Especializada", "Investigación"],
    category: "Privada",
    // id anterior "uces" era incorrecto: ese acrónimo pertenece a otra universidad real
    // (Universidad de Ciencias Empresariales y Sociales, agregada más abajo). Año
    // corregido de 1984 (no verificable) a 1978, verificado: nace como Centro de
    // Estudios Macroeconómicos de Argentina (CEMA) en 1978 y se reconoce como
    // Universidad del CEMA en 1995.
    sourceNote: "Fundada en 1978 como Centro de Estudios Macroeconómicos de Argentina (CEMA); reconocida como Universidad del CEMA en 1995. URL: www.ucema.edu.ar",
    events: [{ id: "ucema-fund", type: "fundacion", label: "Fundación", year: 1978, description: "Nace el Centro de Estudios Macroeconómicos de Argentina (CEMA), origen de la Universidad del CEMA.", source: "UCEMA — Historia institucional", confidence: "media", primaryForAffinity: true }],
  },
  {
    id: "uces", name: "Universidad de Ciencias Empresariales y Sociales (UCES)", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "UCES es universidad privada con programas en ciencias empresariales, comunicación, psicología y derecho.",
    keyThemes: ["Privada", "Empresariales", "Comunicación", "Sociales"],
    category: "Privada",
    sourceNote: "Autorizada a funcionar como universidad el 4 de octubre de 1991 por resolución del Ministerio de Cultura, Educación y Justicia; sus antecedentes organizacionales (Asociación de Dirigentes de Venta) datan de 1942. URL: www.uces.edu.ar",
    events: [{ id: "uces-fund", type: "fundacion", label: "Autorización como universidad", date: "1991-10-04", year: 1991, description: "El Ministerio de Cultura, Educación y Justicia autoriza a la UCES a funcionar como universidad.", source: "UCES — Historia institucional", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "itba", name: "Instituto Tecnológico de Buenos Aires (ITBA)", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "ITBA es universidad privada especializada en ingeniería, tecnología y ciencias vinculadas al mar.",
    keyThemes: ["Privada", "Ingeniería", "Tecnología", "Excelencia"],
    category: "Privada",
    sourceNote: "Fundado el 20 de noviembre de 1959 por un grupo de marinos y civiles; reconocido por Ley 14.557 como una de las primeras universidades privadas de Argentina. URL: www.itba.edu.ar",
    events: [{ id: "itba-fund", type: "fundacion", label: "Fundación", date: "1959-11-20", year: 1959, description: "Se funda el Instituto Tecnológico de Buenos Aires.", source: "ITBA — Historia institucional", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "usal", name: "Universidad del Salvador (USAL)", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "USAL es universidad privada de la Compañía de Jesús con programas en humanidades, ciencias sociales y ciencias jurídicas.",
    keyThemes: ["Privada", "Jesuita", "Humanidades", "Tradición"],
    sourceNote: "Se firma el Acta Fundacional de las Facultades Universitarias del Salvador el 2 de mayo de 1956, tras el decreto de diciembre de 1955 que habilitó universidades privadas en Argentina; recibió reconocimiento oficial como universidad privada el 3 de diciembre de 1959. URL: www.usal.edu.ar",
    category: "Privada",
    events: [{ id: "usal-fund", type: "fundacion", label: "Acta fundacional", date: "1956-05-02", year: 1956, description: "Se firma el Acta Fundacional de las Facultades Universitarias del Salvador.", source: "USAL — Historia institucional", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "una-artes", name: "Universidad Nacional de las Artes (UNA)", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "La UNA es universidad pública especializada en música, artes visuales, danza, teatro y folklore, heredera del Instituto Universitario Nacional del Arte (IUNA).",
    keyThemes: ["Pública", "Arte", "Música", "Creatividad"],
    category: "Pública",
    sourceNote: "Creada a fines de 1996 como Instituto Universitario Nacional del Arte (IUNA), sobre la base de siete instituciones terciarias de arte preexistentes; el Congreso cambió su denominación a Universidad Nacional de las Artes en 2014.",
    events: [{ id: "una-artes-fund", type: "fundacion", label: "Creación (como IUNA)", year: 1996, description: "Se crea el Instituto Universitario Nacional del Arte, origen de la Universidad Nacional de las Artes.", source: "UNA — Historia institucional", confidence: "media", primaryForAffinity: true }],
  },
  {
    id: "ucine", name: "Universidad del Cine (FUC)", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "La Universidad del Cine (FUC) es institución privada especializada en cine, guion y realización audiovisual.",
    keyThemes: ["Privada", "Cine", "Guion", "Creatividad"],
    category: "Privada",
    sourceNote: "Fundada en 1991 por el director de cine Manuel Antín; autorizada definitivamente por Decreto 856/2003. Fecha exacta de fundación no documentada públicamente; se usa el año.",
    events: [{ id: "ucine-fund", type: "fundacion", label: "Fundación", year: 1991, description: "El director de cine Manuel Antín funda la Universidad del Cine.", source: "FUC — Historia institucional", confidence: "media", primaryForAffinity: true }],
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
    id: "isalud-arg", name: "ISALUD Argentina (Instituto de Salud)", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "ISALUD es institución privada especializada en salud y ciencias médicas.",
    keyThemes: ["Privada", "Salud", "Medicina", "Especializada"],
    category: "Privada",
    sourceNote: "Presente en Buenos Aires desde 1990s. URL: www.isalud.edu.ar",
    events: [{ id: "isalud-arg-fund", type: "fundacion", label: "Operaciones", year: 1990, description: "ISALUD expande operaciones a Buenos Aires.", source: "ISALUD — Historia institucional", confidence: "media", primaryForAffinity: false }],
  },
  {
    id: "universidad-notarial", name: "Universidad Notarial Argentina (UNA)", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "Universidad Notarial Argentina es institución especializada en derecho notarial.",
    keyThemes: ["Privada", "Derecho", "Especializada", "Profesión"],
    category: "Privada",
    sourceNote: "Fundada en 1970.",
    events: [{ id: "una-fund", type: "fundacion", label: "Fundación", year: 1970, description: "Se funda la Universidad Notarial Argentina.", source: "UNA — Historia", confidence: "media", primaryForAffinity: true }],
  },
];
