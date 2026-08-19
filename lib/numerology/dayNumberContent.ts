export interface DayNumberContent {
  theme: string;
  description: string;
}

export const DAY_NUMBER_CONTENT: Record<number, DayNumberContent> = {
  1: {
    theme: "Iniciativa y Comienzo",
    description:
      "Es un día para plantar la semilla de lo que querés construir. La energía te impulsa a dar el primer paso sin pedir permiso.",
  },
  2: {
    theme: "Equilibrio y Conexión",
    description:
      "Hoy la balanza se inclina hacia lo relacional. Escuchá más de lo que hablás y encontrá el punto medio entre lo que sentís y lo que pensás.",
  },
  3: {
    theme: "Expresión y Creatividad",
    description:
      "El día te invita a decir lo que llevás adentro. Escribí, hablá, creá. La palabra que sostenés te libera.",
  },
  4: {
    theme: "Estructura y Disciplina",
    description:
      "Lo simple sostiene lo extraordinario. Hoy es día de ordenar, consolidar y poner bases. La paciencia es tu herramienta.",
  },
  5: {
    theme: "Cambio y Libertad",
    description:
      "Lo que ya no te sirve se cae solo. No resistas la transición. El caos es solo el espacio entre lo que era y lo que viene.",
  },
  6: {
    theme: "Armonía y Responsabilidad",
    description:
      "El día te pone frente a lo que cuidás y lo que descuidás. Cuidar de otros empieza por cuidarte a vos mismo.",
  },
  7: {
    theme: "Reflexión y Sabiduría",
    description:
      "Es un día para la introspección, el estudio y la conexión espiritual. Retírate un poco del ruido externo y escuchá tu voz interior. La sabiduría que buscás ya está dentro de vos.",
  },
  8: {
    theme: "Poder y Abundancia",
    description:
      "El día te recuerda que el poder viene de la acción, no del deseo. Alineá tu propósito con lo que hacés y la prosperidad fluye.",
  },
  9: {
    theme: "Cierre y Compasión",
    description:
      "Todo ciclo tiene un final. Hoy es momento de soltar lo que ya cumplió su propósito y abrirte a lo nuevo que se acerca.",
  },
  11: {
    theme: "Intuición y Visión",
    description:
      "Número maestro. Tu intuición está al máximo. No necesitás explicar lo que sentís — solo vivirlo. Confiá en la visión que llega en silencio.",
  },
  22: {
    theme: "Construcción y Maestría",
    description:
      "Número maestro. Podés hacer realidad cualquier sueño. Hoy el universo te da la estructura para materializar lo que imaginás.",
  },
  28: {
    theme: "Riqueza e Iniciativa",
    description:
      "Día de autoridad silenciosa. Tomá la iniciativa en tus decisiones más importantes sin esperar permiso. La riqueza no es solo dinero: es avanzar sin dudar.",
  },
  33: {
    theme: "Guía y Servicio",
    description:
      "Número maestro de maestros. Tu misión hoy es elevar a los demás. Tu compasión transforma todo lo que toca.",
  },
};

/**
 * Build the human-readable calculation breakdown.
 * Example: 7 + 8 + 2026 = 7 + 8 + 1 = 16 → 7
 *
 * Steps: reduce each component (day, month, year), sum, reduce total.
 */
export function buildCalculationBreakdown(date: Date): string {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const reduce = (n: number): number => {
    const sacred = [11, 22, 28, 33];
    let s = n;
    while (s > 9 && !sacred.includes(s)) {
      s = s
        .toString()
        .split("")
        .reduce((acc, d) => acc + parseInt(d, 10), 0);
    }
    return s;
  };

  const ry = reduce(year);
  const total = day + month + ry;
  const final = reduce(total);

  if (ry === year) {
    return `${day} + ${month} + ${year} = ${day} + ${month} + ${year} = ${total} → ${final}`;
  }
  return `${day} + ${month} + ${year} = ${day} + ${month} + ${ry} = ${total} → ${final}`;
}
