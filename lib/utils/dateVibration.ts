/**
 * Date vibration numerology.
 *
 * Cada fecha tiene una "energía" que se obtiene sumando los dígitos de su
 * fecha completa (YYYY-MM-DD) y reduciendo el resultado a un número entre
 * 1 y 9 (conservando 11 y 22 como números maestros).
 *
 * Reglas prácticas usadas en el calendario:
 *  - Viajes: días cuya energía reducida es 5.
 *  - Negocios/emprender: días cuya energía reducida es 8, o cuya suma
 *    directa es 28 (día de liderazgo en algunas escuelas).
 */

export type TopicId = "viajes" | "negocios";

export interface VibrationDay {
  date: string;
  /** Suma directa de todos los dígitos de la fecha. */
  sum: number;
  /** Energía del día (1-9, o 11/22 como maestros). */
  number: number;
  favorable: boolean;
  label: string;
  color: string;
}

export const TOPIC_LABELS: Record<TopicId, string> = {
  viajes: "Viajes",
  negocios: "Negocios",
};

const COLOR_GOOD = "var(--score-excellent)";
const COLOR_OK = "var(--score-good)";
const COLOR_NEUTRAL = "var(--score-neutral)";

export function getDateVibration(dateStr: string): { sum: number; number: number } {
  const digits = dateStr.replace(/-/g, "").split("").map(Number);
  const sum = digits.reduce((a, b) => a + b, 0);

  let num = sum;
  const MASTER = [11, 22, 28, 33];
  while (num > 9 && !MASTER.includes(num)) {
    num = String(num)
      .split("")
      .reduce((a, b) => a + Number(b), 0);
  }
  return { sum, number: num };
}

function isFavorable(topic: TopicId, sum: number, number: number): boolean {
  if (topic === "viajes") return number === 5;
  if (topic === "negocios") return number === 8 || sum === 28;
  return false;
}

export function getDayVibration(topic: TopicId, dateStr: string): VibrationDay {
  const { sum, number } = getDateVibration(dateStr);
  const favorable = isFavorable(topic, sum, number);

  let label: string;
  if (favorable) {
    label = topic === "viajes" ? "Ideal para viajar" : "Ideal para emprender";
  } else if (number === 5 || number === 8 || sum === 28) {
    label = "Afinidad parcial";
  } else {
    label = "Neutro";
  }

  return {
    date: dateStr,
    sum,
    number,
    favorable,
    label,
    color: favorable ? COLOR_GOOD : number === 5 || number === 8 || sum === 28 ? COLOR_OK : COLOR_NEUTRAL,
  };
}

/** Devuelve las energías favorables de un topic, para la leyenda. */
export function getFavorableNumbers(topic: TopicId): string {
  if (topic === "viajes") return "5";
  return "8 o 28";
}
