import { describe, test, expect } from "vitest";
import { calculateLifePath } from "@/lib/calculations";
import { calculateLuckyNumber } from "@/lib/engines/numerologyEngine";
import { buildLifePathProof, buildLuckyNumberProof } from "@/lib/calculations/proof";

describe("buildLifePathProof — parity with calculateLifePath", () => {
  const cases: Array<[number, number, number]> = [
    [18, 4, 1990],
    [15, 3, 1990],
    [1, 1, 2000],
    [29, 8, 2000],
    [6, 1, 2002],   // suma inicial 11 → maestro
    [31, 12, 1999],
    [1, 10, 1980],
    [7, 2, 2010],
    [24, 6, 1975],
    [9, 9, 2001],
  ];

  for (const [d, m, y] of cases) {
    test(`parity for ${d}/${m}/${y}`, () => {
      const official = calculateLifePath(d, m, y);
      const proof = buildLifePathProof(d, m, y);
      expect(proof.result).toBe(official);
      expect(proof.steps.length).toBeGreaterThan(0);
      expect(proof.steps[proof.steps.length - 1].result).toBe(official);
      expect(proof.note.length).toBeGreaterThan(0);
    });
  }

  test("covers every day/month combination without divergence", () => {
    for (let month = 1; month <= 12; month++) {
      for (let day = 1; day <= 28; day++) {
        for (const year of [1990, 1980, 2000, 2010, 1975, 2001]) {
          const official = calculateLifePath(day, month, year);
          const proof = buildLifePathProof(day, month, year);
          expect(proof.result).toBe(official);
        }
      }
    }
  });

  test("master numbers are preserved and explained", () => {
    const proof = buildLifePathProof(6, 1, 2002); // 2+0+0+2+0+1+0+6 = 11
    expect(proof.result).toBe(11);
    const masterStep = proof.steps.find((s) => s.label.includes("maestro"));
    expect(masterStep).toBeTruthy();
  });

  test("always reaches a single digit or master number", () => {
    for (let year = 1950; year <= 2020; year += 3) {
      const proof = buildLifePathProof(11, 5, year);
      expect(proof.result).toBeGreaterThanOrEqual(1);
      expect(proof.result).toBeLessThanOrEqual(33);
      expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33]).toContain(proof.result);
    }
  });
});

describe("buildLuckyNumberProof — parity with calculateLuckyNumber", () => {
  const cases: Array<[number, number]> = [
    [4, 1990],
    [7, 1980],
    [12, 2000],
    [9, 2024],
    [10, 1980],
    [1, 2000],
    [8, 1970],
    [12, 1999],
    [1, 1999],
    [6, 2010],
    [3, 200],
    [11, 1000],
  ];

  for (const [m, y] of cases) {
    test(`parity for month ${m}/${y}`, () => {
      const official = calculateLuckyNumber(m, y);
      const proof = buildLuckyNumberProof(m, y);
      expect(proof.result).toBe(official);
      expect(proof.steps.length).toBe(3);
      expect(proof.steps[proof.steps.length - 1].result).toBe(official);
    });
  }

  test("steps explain month digit and year last non-zero digit", () => {
    const proof = buildLuckyNumberProof(4, 1990);
    expect(proof.result).toBe(49);
    expect(proof.steps[0].result).toBe(4);
    expect(proof.steps[1].result).toBe(9);
  });
});
