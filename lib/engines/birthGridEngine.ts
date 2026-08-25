/**
 * Cuadro de nacimiento (grilla Lo Shu)
 *
 * Reemplaza al radar de "dimensiones", cuyos valores eran aritmética
 * arbitraria (`lifePath * 10`, `50 + (lp % 5) * 10`) y, peor, trataban
 * etiquetas ordinales como magnitudes: un Camino de Vida 1 no es "menos" que
 * un 9, son nombres de categorías. Ningún ajuste de pesos arregla eso.
 *
 * Esto sí es una distribución real: se cuenta cuántas veces aparece cada
 * dígito 1-9 en la fecha de nacimiento y se ubica en la grilla Lo Shu. Que el
 * 3 aparezca dos veces y el 7 ninguna es una cantidad, no una etiqueta — y
 * cualquiera puede verificarlo contando los dígitos de su propia fecha.
 *
 * El 0 no se coloca: la grilla Lo Shu tiene nueve casillas, del 1 al 9.
 *
 * Fuente: cuadro de nacimiento pitagórico sobre la disposición Lo Shu, técnica
 * documentada de la numerología occidental. Las lecturas de líneas completas
 * ("flechas") y de dígitos ausentes son interpretación cultural, no medición:
 * el dato verificable es el conteo.
 */

/** Disposición Lo Shu, de arriba-izquierda a abajo-derecha. */
export const LO_SHU_LAYOUT: readonly (readonly number[])[] = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
] as const;

export interface GridCell {
  /** Dígito 1-9. */
  digit: number;
  /** Cuántas veces aparece en la fecha. */
  count: number;
  /** Qué representa esa casilla en la tradición. */
  meaning: string;
}

export interface GridLine {
  /** Los tres dígitos de la línea, en orden. */
  digits: [number, number, number];
  /** Nombre tradicional de la flecha. */
  name: string;
  /** Fila, columna o diagonal. */
  kind: "fila" | "columna" | "diagonal";
  /** `full` si los tres dígitos aparecen; `empty` si no aparece ninguno. */
  state: "full" | "empty";
  /** Lectura cultural de la línea en ese estado. */
  reading: string;
}

export interface BirthGrid {
  /** Los dígitos de la fecha efectivamente contados (sin ceros). */
  digits: number[];
  /** Conteo por dígito, índice 1-9. */
  counts: Record<number, number>;
  /** Grilla en disposición Lo Shu, lista para renderizar. */
  grid: GridCell[][];
  /** Dígitos que no aparecen ninguna vez. */
  missing: number[];
  /** Dígitos que aparecen dos o más veces, del más repetido al menos. */
  repeated: { digit: number; count: number }[];
  /** Líneas completas y líneas vacías. */
  lines: GridLine[];
}

/** Qué representa cada casilla. Interpretación tradicional, no medición. */
const CELL_MEANING: Record<number, string> = {
  1: "Expresión y voluntad propia",
  2: "Sensibilidad e intuición",
  3: "Imaginación y comunicación",
  4: "Orden y trabajo concreto",
  5: "Libertad y equilibrio emocional",
  6: "Vínculos y responsabilidad",
  7: "Aprendizaje por experiencia",
  8: "Método y organización",
  9: "Ambición y visión amplia",
};

interface LineDef {
  digits: [number, number, number];
  name: string;
  kind: GridLine["kind"];
  full: string;
  empty: string;
}

/** Las ocho líneas de la grilla: 3 filas, 3 columnas, 2 diagonales. */
const LINES: LineDef[] = [
  {
    digits: [4, 9, 2],
    name: "Flecha del intelecto",
    kind: "fila",
    full: "Los tres dígitos del plano mental aparecen en tu fecha. En esta tradición se lee como una inclinación a resolver por análisis antes que por impulso.",
    empty: "Ninguno de los tres dígitos del plano mental aparece. La tradición lo lee como una invitación a apoyarse menos en el análisis y más en lo que ya se sabe hacer.",
  },
  {
    digits: [3, 5, 7],
    name: "Flecha de la sensibilidad",
    kind: "fila",
    full: "El plano emocional está completo. Se lee como una lectura fina de los climas ajenos, con el costo de absorberlos.",
    empty: "El plano emocional no aparece. Se lee como una tendencia a procesar lo afectivo por vías indirectas.",
  },
  {
    digits: [8, 1, 6],
    name: "Flecha de la acción",
    kind: "fila",
    full: "El plano práctico está completo. Se lee como facilidad para llevar las cosas del plan al hecho.",
    empty: "El plano práctico no aparece. Se lee como una preferencia por pensar y sentir antes que por ejecutar.",
  },
  {
    digits: [4, 3, 8],
    name: "Flecha del orden",
    kind: "columna",
    full: "La columna de lo concreto está completa. Se lee como necesidad de estructura y método para sostener lo que se empieza.",
    empty: "La columna de lo concreto no aparece. Se lee como una relación más suelta con el orden y la rutina.",
  },
  {
    digits: [9, 5, 1],
    name: "Flecha de la determinación",
    kind: "columna",
    full: "La columna de la voluntad está completa. Es la línea que la tradición asocia con la persistencia frente a la resistencia.",
    empty: "La columna de la voluntad no aparece. Se lee como una tendencia a sostener por interés más que por insistencia.",
  },
  {
    digits: [2, 7, 6],
    name: "Flecha de la compasión",
    kind: "columna",
    full: "La columna del vínculo está completa. Se lee como facilidad para ponerse en el lugar del otro.",
    empty: "La columna del vínculo no aparece. Se lee como una manera más reservada de acercarse a los demás.",
  },
  {
    digits: [4, 5, 6],
    name: "Flecha de la constancia",
    kind: "diagonal",
    full: "La diagonal que une orden, equilibrio y vínculo está completa. Se lee como continuidad en el tiempo largo.",
    empty: "Esa diagonal no aparece. Se lee como una energía que va por etapas más que en línea recta.",
  },
  {
    digits: [2, 5, 8],
    name: "Flecha de la serenidad",
    kind: "diagonal",
    full: "La diagonal que une sensibilidad, equilibrio y método está completa. Se lee como templanza bajo presión.",
    empty: "Esa diagonal no aparece. Se lee como una respuesta más inmediata frente a la presión.",
  },
];

/**
 * Construye el cuadro de nacimiento desde una fecha `YYYY-MM-DD`.
 *
 * Determinista y sin I/O: la misma fecha siempre da el mismo cuadro, y el
 * conteo se puede rehacer a mano con los dígitos a la vista.
 */
export function buildBirthGrid(birthDate: string): BirthGrid {
  const digits = (birthDate || "")
    .split("")
    .filter((c) => c >= "1" && c <= "9")
    .map(Number);

  const counts: Record<number, number> = {};
  for (let d = 1; d <= 9; d++) counts[d] = 0;
  for (const d of digits) counts[d] += 1;

  const grid: GridCell[][] = LO_SHU_LAYOUT.map((row) =>
    row.map((digit) => ({
      digit,
      count: counts[digit],
      meaning: CELL_MEANING[digit],
    }))
  );

  const missing: number[] = [];
  for (let d = 1; d <= 9; d++) if (counts[d] === 0) missing.push(d);

  const repeated = Object.entries(counts)
    .map(([digit, count]) => ({ digit: Number(digit), count }))
    .filter((e) => e.count >= 2)
    .sort((a, b) => b.count - a.count || a.digit - b.digit);

  const lines: GridLine[] = [];
  for (const def of LINES) {
    const presentes = def.digits.filter((d) => counts[d] > 0).length;
    if (presentes === 3) {
      lines.push({ digits: def.digits, name: def.name, kind: def.kind, state: "full", reading: def.full });
    } else if (presentes === 0) {
      lines.push({ digits: def.digits, name: def.name, kind: def.kind, state: "empty", reading: def.empty });
    }
  }

  return { digits, counts, grid, missing, repeated, lines };
}

/** Lectura de un dígito ausente. Ausencia = lo que la tradición llama lección. */
export function getMissingReading(digit: number): string {
  return CELL_MEANING[digit] ?? "";
}
