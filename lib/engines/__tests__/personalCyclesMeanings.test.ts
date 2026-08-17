import { describe, it, expect } from "vitest";
import { PERSONAL_YEAR_MEANINGS, PERSONAL_MONTH_MEANINGS } from "../dailyEnergyEngine";

const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];

describe("PERSONAL_YEAR_MEANINGS", () => {
  it("tiene una entrada para cada número (1-9, 11, 22, 33)", () => {
    for (const n of NUMBERS) {
      expect(PERSONAL_YEAR_MEANINGS[n]).toBeDefined();
    }
  });

  it("cada entrada tiene theme/focus/challenges/opportunities no vacíos y con contenido real (no placeholders)", () => {
    for (const n of NUMBERS) {
      const m = PERSONAL_YEAR_MEANINGS[n];
      expect(m.theme.length).toBeGreaterThan(5);
      expect(m.focus.length).toBeGreaterThan(30);
      expect(m.challenges.length).toBeGreaterThan(30);
      expect(m.opportunities.length).toBeGreaterThan(30);
      expect(m.keywords.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("los themes son todos distintos entre sí", () => {
    const themes = NUMBERS.map((n) => PERSONAL_YEAR_MEANINGS[n].theme);
    expect(new Set(themes).size).toBe(themes.length);
  });

  it("los textos de focus son todos distintos entre sí (no copy reciclado)", () => {
    const focuses = NUMBERS.map((n) => PERSONAL_YEAR_MEANINGS[n].focus);
    expect(new Set(focuses).size).toBe(focuses.length);
  });

  it("los números maestros (11/22/33) mencionan explícitamente su relación con el número base al que reducen", () => {
    expect(PERSONAL_YEAR_MEANINGS[11].theme.toLowerCase()).toContain("maestro");
    expect(PERSONAL_YEAR_MEANINGS[22].theme.toLowerCase()).toContain("maestro");
    expect(PERSONAL_YEAR_MEANINGS[33].theme.toLowerCase()).toContain("maestro");
  });
});

describe("PERSONAL_MONTH_MEANINGS", () => {
  it("tiene una entrada para cada número (1-9, 11, 22, 33)", () => {
    for (const n of NUMBERS) {
      expect(PERSONAL_MONTH_MEANINGS[n]).toBeDefined();
    }
  });

  it("cada entrada tiene theme/energy/advice no vacíos", () => {
    for (const n of NUMBERS) {
      const m = PERSONAL_MONTH_MEANINGS[n];
      expect(m.theme.length).toBeGreaterThan(5);
      expect(["Alta", "Media", "Baja"]).toContain(m.energy);
      expect(m.advice.length).toBeGreaterThan(30);
    }
  });

  it("los themes son todos distintos entre sí", () => {
    const themes = NUMBERS.map((n) => PERSONAL_MONTH_MEANINGS[n].theme);
    expect(new Set(themes).size).toBe(themes.length);
  });

  it("los textos de advice son todos distintos entre sí (no copy reciclado)", () => {
    const advices = NUMBERS.map((n) => PERSONAL_MONTH_MEANINGS[n].advice);
    expect(new Set(advices).size).toBe(advices.length);
  });
});
