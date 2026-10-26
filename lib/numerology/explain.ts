/**
 * Las cuentas de Mi Mapa escritas paso a paso, para mostrarlas tal cual las
 * hace el motor (lib/calculations.ts): sumar, y reducir dígito a dígito hasta
 * quedar en 1–9 o en un número maestro (11, 22, 33), que no se reduce.
 *
 * Solo arma texto: si el motor cambia, los tests de explain.test.ts comparan
 * el resultado final contra calculateLifePath / getPersonalYear para que el
 * paso a paso nunca muestre otra cosa que lo que se calculó.
 */

const MASTER = new Set([11, 22, 33]);

function digitSum(n: number): number {
  return String(n)
    .split("")
    .reduce((s, c) => s + Number(c), 0);
}

/** 2044 → [2044, 10, 1]; 29 → [29, 11] (frena en el maestro). */
export function reductionChain(start: number): number[] {
  const chain = [start];
  let n = start;
  while (n > 9 && !MASTER.has(n)) {
    n = digitSum(n);
    chain.push(n);
  }
  return chain;
}

/** [2044, 10, 1] → "2+0+4+4 = 10 → 1+0 = 1". El primer número no se repite. */
export function formatReduction(chain: number[]): string {
  const parts: string[] = [];
  for (let i = 1; i < chain.length; i++) {
    parts.push(`${String(chain[i - 1]).split("").join("+")} = ${chain[i]}`);
  }
  return parts.join(" → ");
}

export interface Step {
  /** La operación en texto, lista para mostrar. */
  text: string;
  /** El resultado de la cuenta completa. */
  result: number;
  /** true si la cuenta terminó en un número maestro. */
  master: boolean;
}

function finish(head: string, total: number): Step {
  const chain = reductionChain(total);
  const result = chain[chain.length - 1];
  const tail = chain.length > 1 ? ` → ${formatReduction(chain)}` : "";
  return { text: `${head} = ${total}${tail}`, result, master: MASTER.has(result) };
}

/** Camino de Vida: todos los dígitos de la fecha (AAAA-MM-DD). */
export function lifePathSteps(birthDate: string): Step {
  const digits = birthDate.replace(/\D/g, "").split("").map(Number);
  const total = digits.reduce((s, d) => s + d, 0);
  if (MASTER.has(total)) {
    return { text: `${digits.join("+")} = ${total}`, result: total, master: true };
  }
  return finish(digits.join("+"), total);
}

/** Año Personal: día + mes de nacimiento + año en curso. */
export function personalYearSteps(birthDate: string, year: number): Step {
  const [, m, d] = birthDate.split("-").map(Number);
  return finish(`${d} + ${m} + ${year}`, d + m + year);
}

/** Mes Personal: año personal + número del mes en curso. */
export function personalMonthSteps(personalYear: number, month: number): Step {
  return finish(`${personalYear} + ${month}`, personalYear + month);
}

/** Día Personal: Camino de Vida + día + mes + año de hoy. */
export function personalDaySteps(lifePath: number, date: Date): Step {
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();
  return finish(`${lifePath} + ${d} + ${m} + ${y}`, lifePath + d + m + y);
}
