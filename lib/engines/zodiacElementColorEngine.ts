/**
 * Zodiac Element Color Engine
 *
 * Correspondencia de color por elemento chino (五行 wuxing), tradición
 * independiente del ciclo animal — cada uno de los 5 elementos tiene un
 * color asociado en la cosmología china clásica.
 *
 * NO predicción. Lectura simbólica/cultural.
 */

export interface ElementColor {
  element: string;
  color: string;
  colorHex: string;
  descripcion: string;
}

const ELEMENT_COLORS: Record<string, ElementColor> = {
  Madera: {
    element: "Madera",
    color: "Verde",
    colorHex: "#2D5A3D",
    descripcion: "En la tradición de los cinco elementos (wuxing), la Madera se asocia al verde — crecimiento, expansión, renovación.",
  },
  Fuego: {
    element: "Fuego",
    color: "Rojo",
    colorHex: "#9C2B1F",
    descripcion: "En la tradición de los cinco elementos (wuxing), el Fuego se asocia al rojo — energía, pasión, acción.",
  },
  Tierra: {
    element: "Tierra",
    color: "Amarillo/Dorado",
    colorHex: "#B8860B",
    descripcion: "En la tradición de los cinco elementos (wuxing), la Tierra se asocia al amarillo y al dorado — estabilidad, centro, sostén.",
  },
  Metal: {
    element: "Metal",
    color: "Blanco/Plateado",
    colorHex: "#8C8C8C",
    descripcion: "En la tradición de los cinco elementos (wuxing), el Metal se asocia al blanco y al plateado — claridad, precisión, estructura.",
  },
  Agua: {
    element: "Agua",
    color: "Negro/Azul oscuro",
    colorHex: "#1C2B4A",
    descripcion: "En la tradición de los cinco elementos (wuxing), el Agua se asocia al negro y al azul oscuro — profundidad, sabiduría, flujo.",
  },
};

/** Obtiene el color tradicional del elemento chino de un signo. */
export function getElementColor(element: string): ElementColor {
  return ELEMENT_COLORS[element] ?? ELEMENT_COLORS.Agua;
}
