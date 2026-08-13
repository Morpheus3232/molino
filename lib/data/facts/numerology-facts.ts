/**
 * Numerology Facts — Pure mathematical and tabular rules without UI prose.
 */

export const MASTER_NUMBERS = [11, 22, 33] as const;
export type MasterNumber = typeof MASTER_NUMBERS[number];
export type LifePathNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | MasterNumber;

export const PYTHAGOREAN_LETTER_VALUES: Readonly<Record<string, number>> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

export const CHALDEAN_LETTER_VALUES: Readonly<Record<string, number>> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 8, G: 3, H: 5, I: 1,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 7, P: 8, Q: 1, R: 2,
  S: 3, T: 4, U: 6, V: 6, W: 6, X: 5, Y: 1, Z: 7,
};

export const VOWELS = ["A", "E", "I", "O", "U"] as const;

export const NUMEROLOGY_COMPATIBILITY_MATRIX: Readonly<Record<number, number>> = {
  0: 95, // Same number
  1: 75,
  2: 60,
  3: 50,
  4: 85,
  5: 40,
  6: 80,
  7: 55,
  8: 70,
};

/**
 * Reduces a number to a single digit (1-9) or preserves master numbers (11, 22, 33).
 */
export function reduceNumerologySum(sum: number, preserveMaster: boolean = true): number {
  if (preserveMaster && (sum === 11 || sum === 22 || sum === 33)) {
    return sum;
  }
  while (sum > 9) {
    let temp = 0;
    for (const digit of String(sum)) {
      temp += parseInt(digit, 10);
    }
    sum = temp;
    if (preserveMaster && (sum === 11 || sum === 22 || sum === 33)) {
      return sum;
    }
  }
  return sum;
}
