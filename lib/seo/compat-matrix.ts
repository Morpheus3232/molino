/**
 * Element synergy logic for programmatic compat pages.
 * Deterministic, fact-based (uses lib/data/facts element data). Server-only.
 */

export type ElementName = "Fuego" | "Tierra" | "Aire" | "Agua";

export function calculateElementSynergy(
  elA: ElementName,
  elB: ElementName,
): { score: number; level: string; desc: string } {
  if (elA === elB) {
    return { score: 85, level: "Resonancia Natural", desc: `Ambos comparten el elemento ${elA}, generando un entendimiento instintivo de sus ritmos y motivaciones.` };
  }
  if ((elA === "Fuego" && elB === "Aire") || (elA === "Aire" && elB === "Fuego")) {
    return { score: 92, level: "Alta Dinámica & Expansión", desc: "El Aire estimula al Fuego y el Fuego aporta pasión a las ideas del Aire." };
  }
  if ((elA === "Tierra" && elB === "Agua") || (elA === "Agua" && elB === "Tierra")) {
    return { score: 90, level: "Fertilidad & Contención", desc: "La Tierra da estructura al Agua, que nutre y ablanda la firmeza de la Tierra." };
  }
  if ((elA === "Fuego" && elB === "Tierra") || (elA === "Tierra" && elB === "Fuego")) {
    return { score: 72, level: "Pragmatismo vs. Impulso", desc: "El Fuego inspira a la Tierra a arriesgar; la Tierra ayuda al Fuego a materializar." };
  }
  if ((elA === "Aire" && elB === "Agua") || (elA === "Agua" && elB === "Aire")) {
    return { score: 68, level: "Mente vs. Emoción", desc: "El Aire busca comprender racionalmente lo que el Agua siente intuitivamente." };
  }
  return { score: 65, level: "Vapor & Transformación", desc: "Una combinación de magnetismo e intensidad donde el desafío es regular la temperatura." };
}