import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import { ARCHETYPES, YEAR_TYPES } from "@/lib/data";

export interface SynthesisInsight {
  title: string;
  description: string;
}

export interface SynthesisSummary {
  headline: string;
  summary: string;
  patterns: string[];
  insights: SynthesisInsight[];
  recommendations: string[];
}

function getYearMeaning(lifePath: number) {
  return YEAR_TYPES[(lifePath % 9) || 9] || YEAR_TYPES[1];
}

function getArchetypeInfo(lifePath: number) {
  return ARCHETYPES[lifePath] || ARCHETYPES[1];
}

export function buildSynthesis(profile: UserProfile): SynthesisSummary {
  const archetype = getArchetypeInfo(profile.lifePath);
  const yearMeaning = getYearMeaning(profile.lifePath);
  const numbers = [
    profile.lifePath,
    profile.expressionNumber,
    profile.soulNumber,
    profile.personalityNumber,
  ].filter((n): n is number => typeof n === "number");

  const patterns: string[] = [];
  if (profile.lifePath === 11 || profile.lifePath === 22 || profile.lifePath === 33) {
    patterns.push("Número maestro presente");
  }
  if (profile.element === "Fuego") {
    patterns.push("Energía de impulso y acción");
  } else if (profile.element === "Agua") {
    patterns.push("Energía de profundidad emocional");
  } else if (profile.element === "Aire") {
    patterns.push("Energía de comunicación y cambio");
  } else if (profile.element === "Tierra") {
    patterns.push("Energía de construcción y estabilidad");
  }

  if (profile.modality === "Cardinal") {
    patterns.push("Iniciador natural");
  } else if (profile.modality === "Fijo") {
    patterns.push("Estabilidad y constancia");
  } else if (profile.modality === "Mutable") {
    patterns.push("Adaptabilidad y transformación");
  }

  if (numbers.includes(7)) {
    patterns.push("Busca significado profundo");
  }
  if (numbers.includes(3)) {
    patterns.push("Expresión creativa");
  }
  if (numbers.includes(6)) {
    patterns.push("Responsabilidad y servicio");
  }

  const insights: SynthesisInsight[] = [
    {
      title: "Arquitectura personal",
      description: `Tu Life Path ${profile.lifePath} se expresa a través de ${archetype.name || profile.archetype}.`,
    },
    {
      title: "Ritmo anual",
      description: `Estás en un ciclo de tipo ${yearMeaning.name}.`,
    },
    {
      title: "Firma elemental",
      description: `Tu elemento ${profile.element} y modality ${profile.modality} definen tu estilo básico.`,
    },
  ];

  if (profile.sunSign) {
    insights.push({
      title: "Arquetipo solar",
      description: `Tu signo solar ${profile.sunSign} aporta una capa de expresión visible.`,
    });
  }

  if (profile.chineseZodiac) {
    insights.push({
      title: "Capa cultural",
      description: `El zodiaco chino suma la figura de ${profile.chineseZodiac}.`,
    });
  }

  const recommendations: string[] = [];
  if (profile.goal === "career" || profile.interests.includes("career")) {
    recommendations.push("Explorá profesiones alineadas con tu Life Path y arquetipo.");
  }
  if (profile.goal === "love" || profile.interests.includes("relationships")) {
    recommendations.push("Usá tu número del alma para entender tus vínculos.");
  }
  if (profile.element === "Fuego") {
    recommendations.push("Buscá entornos donde puedas liderar sin fricción.");
  } else if (profile.element === "Agua") {
    recommendations.push("Reservá espacios de introspección para sostener tu energía.");
  }
  recommendations.push("Revisá tus patrones en fechas con energía numerológica similar.");

  const headline = `Síntesis: ${profile.name}`;
  const summary =
    profile.lifePath && profile.element && profile.modality
      ? `Tu perfil integra Life Path ${profile.lifePath}, arquetipo ${archetype.name || profile.archetype}, elemento ${profile.element} y modality ${profile.modality}.`
      : "Tu perfil está listo para integrarse en una síntesis.";

  return {
    headline,
    summary,
    patterns: patterns.slice(0, 6),
    insights: insights.slice(0, 5),
    recommendations: recommendations.slice(0, 4),
  };
}
