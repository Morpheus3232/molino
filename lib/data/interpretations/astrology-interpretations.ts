/**
 * Astrology Interpretations — Textual traits, archetype names, and keywords per Western sign.
 */

import type { WesternSign, WesternElement, Modality } from "@/lib/data/facts/astrology-facts";

export interface SignInterpretation {
  sign: WesternSign;
  archetype: string;
  keywords: string[];
  description: string;
  coreTrait: string;
}

export const SIGN_INTERPRETATIONS_ES: Readonly<Record<WesternSign, SignInterpretation>> = {
  Aries: {
    sign: "Aries",
    archetype: "El Pionero",
    keywords: ["Independiente", "Energético", "Valiente"],
    description: "Iniciador del zodíaco, actúa con coraje, franqueza y dinamismo.",
    coreTrait: "Iniciativa y audacia",
  },
  Tauro: {
    sign: "Tauro",
    archetype: "El Constructor",
    keywords: ["Paciente", "Práctico", "Determinado"],
    description: "Constructor paciente de certezas tangibles, valora la estabilidad y el disfrute sensorial.",
    coreTrait: "Perseverancia y solidez",
  },
  Géminis: {
    sign: "Géminis",
    archetype: "El Narrador",
    keywords: ["Curioso", "Comunicativo", "Versátil"],
    description: "Mente ágil y comunicativa que conecta ideas, personas y puntos de vista diversos.",
    coreTrait: "Curiosidad e ingenio",
  },
  Cáncer: {
    sign: "Cáncer",
    archetype: "El Sanador",
    keywords: ["Sensible", "Protector", "Emocional"],
    description: "Guardián de la memoria y la intimidad, actúa guiado por la empatía y la intuición.",
    coreTrait: "Sensibilidad y cuidado",
  },
  Leo: {
    sign: "Leo",
    archetype: "La Estrella",
    keywords: ["Creativo", "Líder", "Generoso"],
    description: "Corazón generoso y carisma natural que irradia calidez y autoexpresión auténtica.",
    coreTrait: "Nobleza y magnetismo",
  },
  Virgo: {
    sign: "Virgo",
    archetype: "El Organizador",
    keywords: ["Analítico", "Detallista", "Servicial"],
    description: "Observador meticuloso que busca perfeccionar procesos y brindar ayuda práctica.",
    coreTrait: "Claridad y servicio",
  },
  Libra: {
    sign: "Libra",
    archetype: "El Pacificador",
    keywords: ["Diplomático", "Armonioso", "Justo"],
    description: "Buscador de belleza y justicia, equilibra polaridades mediante el diálogo y la armonía.",
    coreTrait: "Diplomacia y balance",
  },
  Escorpio: {
    sign: "Escorpio",
    archetype: "El Investigador",
    keywords: ["Intenso", "Transformador", "Misterioso"],
    description: "Fuerza penetrante y regenerativa que indaga en las profundidades de la psique.",
    coreTrait: "Transformación y lealtad",
  },
  Sagitario: {
    sign: "Sagitario",
    archetype: "El Aventurero",
    keywords: ["Aventurero", "Optimista", "Filósofo"],
    description: "Explorador de horizontes físicos y filosóficos con entusiasmo inquebrantable.",
    coreTrait: "Visión y expansión",
  },
  Capricornio: {
    sign: "Capricornio",
    archetype: "El que Consigue",
    keywords: ["Ambicioso", "Responsable", "Disciplinado"],
    description: "Estratega disciplinado que escala cumbres paso a paso con maestría y paciencia.",
    coreTrait: "Estructura y logro",
  },
  Acuario: {
    sign: "Acuario",
    archetype: "El Visionario",
    keywords: ["Innovador", "Independiente", "Humanitario"],
    description: "Pionero vanguardista orientado a la libertad colectiva y las ideas del futuro.",
    coreTrait: "Originalidad y visión social",
  },
  Piscis: {
    sign: "Piscis",
    archetype: "El Poeta",
    keywords: ["Sensible", "Intuitivo", "Creativo"],
    description: "Sensibilidad mística y compasiva que disuelve fronteras a través del arte y la empatía.",
    coreTrait: "Imaginación y compasión",
  },
};

export const ELEMENT_INTERPRETATIONS_ES: Readonly<Record<WesternElement, string>> = {
  Fuego: "Impulso vital, entusiasmo, creatividad y acción directa.",
  Tierra: "Pragmatismo, estabilidad material, paciencia y arraigo.",
  Aire: "Intelecto, comunicación, perspectiva objetiva y relaciones.",
  Agua: "Mundo emocional, intuición profunda, empatía y sensibilidad.",
};

export const MODALITY_INTERPRETATIONS_ES: Readonly<Record<Modality, string>> = {
  Cardinal: "Iniciativa activa, apertura de caminos y capacidad de liderazgo.",
  Fijo: "Persistencia inamovible, lealtad a los principios y consolidación.",
  Mutable: "Adaptabilidad fluida, versatilidad y facilidad para la transición.",
};
