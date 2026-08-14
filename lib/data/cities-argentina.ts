import type { AtlasEntityInput } from "@/types/atlas";

/**
 * Ciudades argentinas — fechas de fundación verificadas.
 * Complementa la única ciudad argentina existente en cities-60.ts (Buenos Aires).
 * Rosario queda deliberadamente fuera: no tiene fundador ni fecha de fundación
 * documentada (se formó de manera espontánea desde fines del siglo XVII), por lo
 * que no cumple el criterio de fecha verificable del proyecto.
 */
export const CITIES_ARGENTINA: AtlasEntityInput[] = [
  {
    id: "cordoba-ar", name: "Córdoba", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Córdoba es la segunda ciudad más grande de Argentina, cuna de la universidad más antigua del país y de una fuerte tradición estudiantil.",
    keyThemes: ["Tradición", "Estudio", "Cultura", "Sierras"],
    sourceNote: "Fundada el 6 de julio de 1573 por Jerónimo Luis de Cabrera.",
    events: [
      {
        id: "cordoba-ar-fundacion",
        type: "fundacion",
        label: "Fundación",
        date: "1573-07-06",
        year: 1573,
        description: "Jerónimo Luis de Cabrera funda la ciudad de Córdoba de la Nueva Andalucía.",
        source: "Documentación histórica",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "mendoza-ar", name: "Mendoza", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Mendoza es la capital argentina del vino, al pie de la Cordillera de los Andes.",
    keyThemes: ["Vino", "Montaña", "Tradición", "Paisaje"],
    sourceNote: "Fundada el 2 de marzo de 1561 por Pedro del Castillo.",
    events: [
      {
        id: "mendoza-ar-fundacion",
        type: "fundacion",
        label: "Fundación",
        date: "1561-03-02",
        year: 1561,
        description: "Pedro del Castillo funda la Ciudad de Mendoza del Nuevo Valle de La Rioja.",
        source: "Documentación histórica",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "la-plata-ar", name: "La Plata", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "La Plata es una ciudad planificada, capital de la provincia de Buenos Aires, conocida por su trazado geométrico y su vida universitaria.",
    keyThemes: ["Planificación", "Universidad", "Orden", "Juventud"],
    sourceNote: "Fundada el 19 de noviembre de 1882 por Dardo Rocha.",
    events: [
      {
        id: "la-plata-ar-fundacion",
        type: "fundacion",
        label: "Fundación",
        date: "1882-11-19",
        year: 1882,
        description: "Dardo Rocha funda la ciudad de La Plata como nueva capital de la provincia de Buenos Aires.",
        source: "Documentación histórica",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "mar-del-plata", name: "Mar del Plata", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Mar del Plata es el balneario más popular de Argentina, punto de encuentro veraniego para millones de personas.",
    keyThemes: ["Verano", "Mar", "Encuentro", "Descanso"],
    sourceNote: "Fundada el 10 de febrero de 1874 por Patricio Peralta Ramos.",
    events: [
      {
        id: "mar-del-plata-fundacion",
        type: "fundacion",
        label: "Fundación",
        date: "1874-02-10",
        year: 1874,
        description: "Patricio Peralta Ramos funda Mar del Plata.",
        source: "Documentación histórica",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "tucuman-ar", name: "San Miguel de Tucumán", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Tucumán es cuna de la independencia argentina y corazón del noroeste del país.",
    keyThemes: ["Independencia", "Historia", "Noroeste", "Identidad"],
    sourceNote: "Fundada el 31 de mayo de 1565 por Diego de Villarroel.",
    events: [
      {
        id: "tucuman-ar-fundacion",
        type: "fundacion",
        label: "Fundación",
        date: "1565-05-31",
        year: 1565,
        description: "Diego de Villarroel funda San Miguel de Tucumán.",
        source: "Documentación histórica",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "salta-ar", name: "Salta", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Salta \"la linda\" conserva una fuerte identidad colonial en el noroeste argentino.",
    keyThemes: ["Colonial", "Tradición", "Noroeste", "Identidad"],
    sourceNote: "Fundada el 16 de abril de 1582 por Hernando de Lerma.",
    events: [
      {
        id: "salta-ar-fundacion",
        type: "fundacion",
        label: "Fundación",
        date: "1582-04-16",
        year: 1582,
        description: "Hernando de Lerma funda la ciudad de San Felipe y Santiago de Lerma, actual Salta.",
        source: "Documentación histórica",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
  {
    id: "bariloche", name: "San Carlos de Bariloche", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Bariloche es el destino patagónico por excelencia, entre lagos, montañas y chocolate.",
    keyThemes: ["Montaña", "Patagonia", "Naturaleza", "Aventura"],
    sourceNote: "Fundada oficialmente el 3 de mayo de 1902.",
    events: [
      {
        id: "bariloche-fundacion",
        type: "fundacion",
        label: "Fundación",
        date: "1902-05-03",
        year: 1902,
        description: "San Carlos de Bariloche es fundada oficialmente mediante decreto presidencial.",
        source: "Documentación histórica",
        confidence: "exacta",
        primaryForAffinity: true,
      },
    ],
  },
];
