import type { AtlasEntityInput } from "@/types/atlas";

/**
 * Ciudades de Chile con fecha de fundación exacta. Cada fecha coincide en
 * día, mes y año entre Wikidata y Wikipedia en español (2026-10-04); las que
 * no coincidían se descartaron. Fechas anteriores a 1582 en calendario
 * juliano, como las da la fuente.
 */
export const CITIES_CHILE: AtlasEntityInput[] = [
  {
    id: "antofagasta", name: "Antofagasta", type: "city", country: "Chile", emoji: "🇨🇱",
    description: "Capital de la Región de Antofagasta, puerto del norte de Chile sobre el Pacífico y centro de la minería del cobre.",
    keyThemes: ["Puerto", "Minería", "Desierto", "Norte"],
    sourceNote: "Fundada el 22 de octubre de 1868.",
    events: [
      {
        id: "antofagasta-fundacion", type: "fundacion", label: "Fundación",
        date: "1868-10-22", year: 1868,
        description: "Fundación oficial de Antofagasta, entonces puerto boliviano sobre el Pacífico.",
        source: "Wikidata Q3612 + Wikipedia (es): Antofagasta", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "talca", name: "Talca", type: "city", country: "Chile", emoji: "🇨🇱",
    description: "Capital de la Región del Maule, en el corazón del valle central y de la zona vitivinícola de Chile.",
    keyThemes: ["Valle central", "Vino", "Maule", "Colonial"],
    sourceNote: "Fundada el 12 de mayo de 1742.",
    events: [
      {
        id: "talca-fundacion", type: "fundacion", label: "Fundación",
        date: "1742-05-12", year: 1742,
        description: "Por orden del gobernador José Antonio Manso de Velasco se funda la villa de San Agustín de Talca.",
        source: "Wikidata Q4469 + Wikipedia (es): Talca", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "rancagua", name: "Rancagua", type: "city", country: "Chile", emoji: "🇨🇱",
    description: "Capital de la Región de O'Higgins, escenario del Desastre de Rancagua de 1814 en la guerra de independencia.",
    keyThemes: ["Independencia", "Historia", "Valle central", "O'Higgins"],
    sourceNote: "Fundada el 5 de octubre de 1743.",
    events: [
      {
        id: "rancagua-fundacion", type: "fundacion", label: "Fundación",
        date: "1743-10-05", year: 1743,
        description: "El gobernador José Antonio Manso de Velasco funda la villa de Santa Cruz de Triana, hoy Rancagua.",
        source: "Wikidata Q4582 + Wikipedia (es): Rancagua", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "copiapo", name: "Copiapó", type: "city", country: "Chile", emoji: "🇨🇱",
    description: "Capital de la Región de Atacama, en el borde sur del desierto más árido del mundo; su historia está ligada a la plata y al cobre.",
    keyThemes: ["Desierto", "Minería", "Atacama", "Norte"],
    sourceNote: "Fundada el 8 de diciembre de 1744.",
    events: [
      {
        id: "copiapo-fundacion", type: "fundacion", label: "Fundación",
        date: "1744-12-08", year: 1744,
        description: "Se funda la villa de San Francisco de la Selva de Copiapó durante el gobierno de José Antonio Manso de Velasco.",
        source: "Wikidata Q3868 + Wikipedia (es): Copiapó", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "punta-arenas", name: "Punta Arenas", type: "city", country: "Chile", emoji: "🇨🇱",
    description: "Capital de la Región de Magallanes, sobre el estrecho de Magallanes; una de las ciudades más australes del mundo.",
    keyThemes: ["Patagonia", "Estrecho", "Sur", "Frontera"],
    sourceNote: "Fundada el 18 de diciembre de 1848.",
    events: [
      {
        id: "punta-arenas-fundacion", type: "fundacion", label: "Fundación",
        date: "1848-12-18", year: 1848,
        description: "El gobernador José de los Santos Mardones funda Punta Arenas a orillas del estrecho de Magallanes.",
        source: "Wikidata Q51599 + Wikipedia (es): Punta Arenas", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
];
