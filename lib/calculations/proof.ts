/**
 * Calculation Proof
 *
 * Builds a transparent, step-by-step explanation for the deterministic
 * calculations Molino already performs (lib/calculations.ts).
 *
 * The steps below REPLICATE the exact same algorithms used by the engines so
 * the explanation can never diverge from the official result. Parity is
 * enforced by __tests__/calculation-proof.test.ts.
 *
 * No engine is modified. Presentation-layer only.
 */

export interface CalculationStep {
  /** Short human label of the step. Ej: "Sumás los dígitos". */
  label: string;
  /** The digits/terms involved. Ej: "1 + 8 + 0 + 4 + 1 + 9 + 9 + 0". */
  expression: string;
  /** Intermediate result of this step. */
  result: number;
}

export interface CalculationProofData {
  /** Final number the user sees. */
  result: number;
  /** Ordered steps that lead to the result. */
  steps: CalculationStep[];
  /** One-line disclaimer used by the UI. */
  note: string;
}

const MASTER_NUMBERS = new Set([11, 22, 33]);

function digitsOf(n: number): number[] {
  return String(n)
    .split("")
    .map((c) => parseInt(c, 10));
}

/**
 * Steps for Camino de Vida, replicating calculateLifePath(day, month, year):
 *   1. Concatenate day + month + year (DDMMYYYY).
 *   2. Sum every digit.
 *   3. If the sum is 11/22/33 → keep it (master number).
 *   4. While the sum is > 9 → sum its digits again (checking master numbers).
 */
export function buildLifePathProof(day: number, month: number, year: number): CalculationProofData {
  const dd = String(day).padStart(2, "0");
  const mm = String(month).padStart(2, "0");
  const dateStr = `${dd}${mm}${year}`;
  const digits = dateStr.split("").map((c) => parseInt(c, 10));

  const steps: CalculationStep[] = [];
  const firstSum = digits.reduce((a, b) => a + b, 0);

  steps.push({
    label: `Sumás los dígitos de tu fecha`,
    expression: digits.join(" + "),
    result: firstSum,
  });

  let current = firstSum;
  if (MASTER_NUMBERS.has(current)) {
    steps.push({
      label: "Es un número maestro, se conserva",
      expression: String(current),
      result: current,
    });
  } else {
    while (current > 9) {
      const parts = digitsOf(current);
      const next = parts.reduce((a, b) => a + b, 0);
      steps.push({
        label: `Reducís el resultado a una sola cifra`,
        expression: parts.join(" + "),
        result: next,
      });
      current = next;
      if (MASTER_NUMBERS.has(current)) {
        steps.push({
          label: "Es un número maestro, se conserva",
          expression: String(current),
          result: current,
        });
        break;
      }
    }
  }

  return {
    result: current,
    steps,
    note: "Un cálculo determinista hecho a partir de tu fecha de nacimiento.",
  };
}

/**
 * Steps for Número de la Suerte, replicating calculateLuckyNumber(month, year):
 *   1. Take the first digit of the month.
 *   2. From the year, take the last non-zero digit.
 *   3. Concatenate both digits.
 * Example: 04/1990 → 4 y 9 → 49.
 */
export function buildLuckyNumberProof(month: number, year: number): CalculationProofData {
  const monthStr = String(month).padStart(2, "0");
  const firstDigitOfMonth = Math.floor(month / 10) || month;

  const yearStr = String(year);
  let lastNonZeroDigit = 0;
  for (let i = yearStr.length - 1; i >= 0; i--) {
    const d = parseInt(yearStr[i], 10);
    if (d !== 0) {
      lastNonZeroDigit = d;
      break;
    }
  }
  if (lastNonZeroDigit === 0) lastNonZeroDigit = 1;

  const steps: CalculationStep[] = [
    {
      label: "Tomás la primera cifra del mes",
      expression: monthStr.split("").join(" · "),
      result: firstDigitOfMonth,
    },
    {
      label: "Del año, la última cifra distinta de cero",
      expression: yearStr.split("").join(" · "),
      result: lastNonZeroDigit,
    },
  ];

  const result = firstDigitOfMonth * 10 + lastNonZeroDigit;
  steps.push({
    label: "Combinás ambas cifras",
    expression: `${firstDigitOfMonth} y ${lastNonZeroDigit}`,
    result,
  });

  return {
    result,
    steps,
    note: "Un cálculo determinista hecho a partir de tu fecha de nacimiento.",
  };
}
