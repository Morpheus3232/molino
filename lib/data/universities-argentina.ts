import type { AtlasEntityInput } from "@/types/atlas";

/**
 * Universidades argentinas — fechas de fundación/reconocimiento verificadas
 * (fuentes: sitios institucionales, Wikipedia, boletines oficiales).
 * Complementa las 3 entidades "university" ya existentes en symbolic-entities.ts
 * (UBA, MIT, Oxford).
 */
export const UNIVERSITIES_ARGENTINA: AtlasEntityInput[] = [
  {
    id: "unc", name: "Universidad Nacional de Córdoba", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "La UNC es la universidad más antigua de Argentina y una de las más antiguas de América, fundada por la Compañía de Jesús.",
    keyThemes: ["Tradición", "Rigor", "Legado", "Conocimiento"],
    sourceNote: "Fundada el 19 de junio de 1613 como Colegio Máximo de Córdoba por la Compañía de Jesús.",
    events: [
      {
        id: "unc-fundacion",
        type: "fundacion",
        label: "Fundación",
        date: "1613-06-19",
        year: 1613,
        description: "La Compañía de Jesús funda el Colegio Máximo de Córdoba, origen de la Universidad Nacional de Córdoba.",
        source: "Universidad Nacional de Córdoba — Historia institucional",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "unlp", name: "Universidad Nacional de La Plata", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "La UNLP es una de las universidades públicas más grandes de Argentina, reconocida por su tradición en ciencia e ingeniería.",
    keyThemes: ["Ciencia", "Excelencia", "Compromiso", "Innovación"],
    sourceNote: "Nacionalizada el 25 de septiembre de 1905, sobre la base de la universidad provincial creada en 1897.",
    events: [
      {
        id: "unlp-fundacion",
        type: "fundacion",
        label: "Nacionalización",
        date: "1905-09-25",
        year: 1905,
        description: "El gobierno argentino nacionaliza la Universidad de La Plata.",
        source: "Universidad Nacional de La Plata — Historia institucional",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "unr", name: "Universidad Nacional de Rosario", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "La UNR es una de las universidades públicas más importantes del centro de Argentina, con fuerte presencia en salud e ingeniería.",
    keyThemes: ["Investigación", "Región", "Formación", "Compromiso"],
    sourceNote: "Creada por la Ley 17.987 el 29 de noviembre de 1968.",
    events: [
      {
        id: "unr-fundacion",
        type: "fundacion",
        label: "Creación",
        date: "1968-11-29",
        year: 1968,
        description: "Se crea la Universidad Nacional de Rosario mediante la Ley 17.987.",
        source: "Universidad Nacional de Rosario — Historia institucional",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "utn", name: "Universidad Tecnológica Nacional", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "La UTN es la universidad pública con mayor despliegue territorial de Argentina, especializada en ingeniería y tecnología.",
    keyThemes: ["Ingeniería", "Tecnología", "Territorio", "Trabajo"],
    sourceNote: "Creada por la Ley 14.855 el 14 de octubre de 1959, sobre la base de facultades regionales que operaban desde 1953.",
    events: [
      {
        id: "utn-fundacion",
        type: "fundacion",
        label: "Creación",
        date: "1959-10-14",
        year: 1959,
        description: "Se crea la Universidad Tecnológica Nacional por Ley 14.855.",
        source: "Universidad Tecnológica Nacional — Historia institucional",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "uca", name: "Universidad Católica Argentina", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "La UCA es la principal universidad católica de Argentina, con sedes en Buenos Aires, Rosario, Mendoza y Paraná.",
    keyThemes: ["Humanismo", "Tradición", "Formación", "Comunidad"],
    sourceNote: "Fundada el 7 de marzo de 1958 por declaración del Episcopado Argentino.",
    events: [
      {
        id: "uca-fundacion",
        type: "fundacion",
        label: "Fundación",
        date: "1958-03-07",
        year: 1958,
        description: "El Episcopado Argentino funda la Universidad Católica Argentina.",
        source: "Universidad Católica Argentina — Historia institucional",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "austral", name: "Universidad Austral", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "La Universidad Austral es una universidad privada argentina reconocida por sus programas de negocios, derecho y medicina.",
    keyThemes: ["Excelencia", "Formación", "Negocios", "Rigor"],
    sourceNote: "Reconocida por Resolución 289/91 del Ministerio de Cultura y Educación el 4 de marzo de 1991.",
    events: [
      {
        id: "austral-fundacion",
        type: "fundacion",
        label: "Reconocimiento oficial",
        date: "1991-03-04",
        year: 1991,
        description: "El Ministerio de Cultura y Educación reconoce a la Universidad Austral.",
        source: "Universidad Austral — Historia institucional",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "di-tella", name: "Universidad Torcuato Di Tella", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "La Universidad Di Tella es reconocida por sus programas de economía, ciencia política y negocios, heredera del espíritu innovador del Instituto Di Tella.",
    keyThemes: ["Innovación", "Pensamiento", "Vanguardia", "Rigor"],
    sourceNote: "Fundada en 1991, heredera del Instituto Torcuato Di Tella (1958). Fecha exacta de fundación no documentada públicamente; se usa el año.",
    events: [
      {
        id: "di-tella-fundacion",
        type: "fundacion",
        label: "Fundación",
        year: 1991,
        description: "Se funda la Universidad Torcuato Di Tella.",
        source: "Universidad Torcuato Di Tella — Historia institucional",
        confidence: "media",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "san-andres", name: "Universidad de San Andrés", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "La Universidad de San Andrés es una universidad privada laica sin fines de lucro, reconocida por sus programas de economía y ciencias sociales.",
    keyThemes: ["Excelencia", "Pensamiento crítico", "Comunidad", "Rigor"],
    sourceNote: "Fundada en 1988 por la Asociación Civil Educativa Escocesa San Andrés. Fecha exacta de fundación no documentada públicamente; se usa el año.",
    events: [
      {
        id: "san-andres-fundacion",
        type: "fundacion",
        label: "Fundación",
        year: 1988,
        description: "La Asociación Civil Educativa Escocesa San Andrés funda la Universidad de San Andrés.",
        source: "Universidad de San Andrés — Historia institucional",
        confidence: "media",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "unt", name: "Universidad Nacional de Tucumán", type: "university", country: "Argentina",
    emoji: "🎓",
    description: "La UNT es la universidad pública más importante del norte argentino, con fuerte tradición en ciencias exactas y humanidades.",
    keyThemes: ["Región", "Formación", "Comunidad", "Rigor"],
    sourceNote: "Fundada el 25 de agosto de 1914 en San Miguel de Tucumán.",
    events: [
      {
        id: "unt-fundacion",
        type: "fundacion",
        label: "Fundación",
        date: "1914-08-25",
        year: 1914,
        description: "Se funda la Universidad Nacional de Tucumán.",
        source: "Universidad Nacional de Tucumán — Historia institucional",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
];
