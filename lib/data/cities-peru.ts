import type { AtlasEntityInput } from "@/types/atlas";

/**
 * Ciudades de Perú con fecha de fundación exacta. Cada fecha coincide en
 * día, mes y año entre Wikidata y Wikipedia en español (2026-10-04); las que
 * no coincidían se descartaron. Fechas anteriores a 1582 en calendario
 * juliano, como las da la fuente.
 */
export const CITIES_PERU: AtlasEntityInput[] = [
  {
    id: "arequipa", name: "Arequipa", type: "city", country: "Perú", emoji: "🇵🇪",
    description: "La Ciudad Blanca, construida con sillar volcánico al pie del Misti; segunda ciudad del Perú.",
    keyThemes: ["Sillar", "Volcanes", "Sur", "Colonial"],
    sourceNote: "Fundada el 15 de agosto de 1540.",
    events: [
      {
        id: "arequipa-fundacion", type: "fundacion", label: "Fundación",
        date: "1540-08-15", year: 1540,
        description: "Garcí Manuel de Carbajal funda la Villa de la Asunción de Nuestra Señora del Valle Hermoso de Arequipa.",
        source: "Wikidata Q159273 + Wikipedia (es): Arequipa", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "trujillo-peru", name: "Trujillo", type: "city", country: "Perú", emoji: "🇵🇪",
    description: "Capital de La Libertad, en la costa norte del Perú, junto a Chan Chan, la mayor ciudad de barro de América.",
    keyThemes: ["Costa norte", "Chan Chan", "Marinera", "Colonial"],
    sourceNote: "Fundada el 5 de marzo de 1535.",
    events: [
      {
        id: "trujillo-peru-fundacion", type: "fundacion", label: "Fundación",
        date: "1535-03-05", year: 1535,
        description: "Francisco Pizarro formaliza la fundación de Trujillo, nombrada en honor a su ciudad natal en Extremadura.",
        source: "Wikidata Q214173 + Wikipedia (es): Trujillo (Perú)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "huancayo", name: "Huancayo", type: "city", country: "Perú", emoji: "🇵🇪",
    description: "Capital de Junín, principal ciudad del valle del Mantaro en los Andes centrales.",
    keyThemes: ["Andes", "Mantaro", "Comercio", "Sierra"],
    sourceNote: "Fundada el 1 de junio de 1572.",
    events: [
      {
        id: "huancayo-fundacion", type: "fundacion", label: "Fundación",
        date: "1572-06-01", year: 1572,
        description: "Jerónimo de Silva funda el pueblo de Santísima Trinidad de Huancayo.",
        source: "Wikidata Q468782 + Wikipedia (es): Huancayo", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "ica", name: "Ica", type: "city", country: "Perú", emoji: "🇵🇪",
    description: "Capital del departamento de Ica, en el desierto costero; tierra del pisco y del oasis de Huacachina.",
    keyThemes: ["Pisco", "Desierto", "Vino", "Costa"],
    sourceNote: "Fundada el 17 de junio de 1563.",
    events: [
      {
        id: "ica-fundacion", type: "fundacion", label: "Fundación",
        date: "1563-06-17", year: 1563,
        description: "Jerónimo Luis de Cabrera funda la Villa de Valverde del Valle de Ica.",
        source: "Wikidata Q840712 + Wikipedia (es): Ica", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "ayacucho", name: "Ayacucho", type: "city", country: "Perú", emoji: "🇵🇪",
    description: "Llamada Huamanga en la colonia: la ciudad de las iglesias y escenario de la batalla de Ayacucho de 1824.",
    keyThemes: ["Iglesias", "Independencia", "Andes", "Semana Santa"],
    sourceNote: "Fundada el 25 de abril de 1540.",
    events: [
      {
        id: "ayacucho-fundacion", type: "fundacion", label: "Fundación",
        date: "1540-04-25", year: 1540,
        description: "San Juan de la Frontera de Huamanga se funda en su emplazamiento definitivo.",
        source: "Wikidata Q504215 + Wikipedia (es): Ayacucho", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "huanuco", name: "Huánuco", type: "city", country: "Perú", emoji: "🇵🇪",
    description: "Capital del departamento de Huánuco, en la ceja de selva de los Andes centrales.",
    keyThemes: ["Andes", "Clima", "Colonial", "Sierra"],
    sourceNote: "Fundada el 15 de agosto de 1539.",
    events: [
      {
        id: "huanuco-fundacion", type: "fundacion", label: "Fundación",
        date: "1539-08-15", year: 1539,
        description: "Gómez de Alvarado funda la ciudad de León de Huánuco de los Caballeros.",
        source: "Wikidata Q504394 + Wikipedia (es): Huánuco", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
];
