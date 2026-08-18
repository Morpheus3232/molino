import type { AtlasEntityInput } from "@/types/atlas";

/**
 * Universidades uruguayas — fechas de fundación/reconocimiento verificadas
 * (fuentes: sitios institucionales, Wikipedia).
 */
export const UNIVERSITIES_URUGUAY: AtlasEntityInput[] = [
  {
    id: "udelar", name: "Universidad de la República", type: "university", country: "Uruguay",
    emoji: "🎓",
    description: "La UDELAR es la universidad pública más grande e histórica de Uruguay, cuna de gran parte de la vida académica del país.",
    keyThemes: ["Pública", "Tradición", "Nación", "Excelencia"],
    sourceNote: "Fundada el 27 de mayo de 1849.",
    events: [
      {
        id: "udelar-fundacion",
        type: "fundacion",
        label: "Fundación",
        date: "1849-05-27",
        year: 1849,
        description: "Se funda la Universidad Mayor de la República, origen de la UDELAR.",
        source: "Universidad de la República — Historia institucional",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "ucu", name: "Universidad Católica del Uruguay", type: "university", country: "Uruguay",
    emoji: "🎓",
    description: "La UCU es la principal universidad privada de Uruguay, reconocida por sus programas de negocios, comunicación y ciencias sociales.",
    keyThemes: ["Privada", "Católica", "Formación", "Comunidad"],
    sourceNote: "Fundada en 1985. Fecha exacta no documentada de forma unívoca; se usa el año.",
    events: [
      {
        id: "ucu-fundacion",
        type: "fundacion",
        label: "Fundación",
        year: 1985,
        description: "Se funda la Universidad Católica del Uruguay en Montevideo.",
        source: "Universidad Católica del Uruguay — Historia institucional",
        confidence: "media",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "um-uruguay", name: "Universidad de Montevideo", type: "university", country: "Uruguay",
    emoji: "🎓",
    description: "La UM es una universidad privada uruguaya reconocida por sus programas de negocios, derecho e ingeniería.",
    keyThemes: ["Privada", "Negocios", "Derecho", "Formación"],
    sourceNote: "Fundada en 1986. Fecha exacta no documentada de forma unívoca; se usa el año.",
    events: [
      {
        id: "um-fundacion",
        type: "fundacion",
        label: "Fundación",
        year: 1986,
        description: "Se funda la Universidad de Montevideo.",
        source: "Universidad de Montevideo — Historia institucional",
        confidence: "media",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "ort-uruguay", name: "Universidad ORT Uruguay", type: "university", country: "Uruguay",
    emoji: "🎓",
    description: "ORT Uruguay es una universidad privada reconocida por sus programas de ingeniería, tecnología y comunicación.",
    keyThemes: ["Tecnología", "Ingeniería", "Innovación", "Privada"],
    sourceNote: "Reconocida como universidad en 1996, sobre la base del Instituto ORT fundado en 1942. Se usa el año de reconocimiento como universidad.",
    events: [
      {
        id: "ort-fundacion",
        type: "fundacion",
        label: "Reconocimiento como universidad",
        year: 1996,
        description: "El Instituto ORT es reconocido oficialmente como Universidad ORT Uruguay.",
        source: "Universidad ORT Uruguay — Historia institucional",
        confidence: "media",
        primaryForAffinity: true,
      },
    ],
  },
];
