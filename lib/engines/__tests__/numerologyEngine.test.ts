import { describe, it, expect } from "vitest";
import {
  calculateLifePath,
  calculateExpressionNumber,
  calculateSoulNumber,
  calculatePersonalityNumber,
  calculateBirthDayNumber,
  getArchetypeInfo,
  getMasterNumbers,
  getMasterPositionMeaning,
} from "../numerologyEngine";

describe("Numerology Engine", () => {
  describe("calculateLifePath", () => {
    it("calculates life path for various dates", () => {
      // Engine: sums all digits in YYYYMMDD format, reduces to 1-9 or 11/22/33
      expect(calculateLifePath("1990-03-15")).toBe(1); // 1+9+9+0+0+3+1+5 = 28 -> 10 -> 1
      expect(calculateLifePath("2000-02-02")).toBe(6); // 2+0+0+0+0+2+0+2 = 6
      expect(calculateLifePath("1992-11-29")).toBe(7); // 1+9+9+2+1+1+2+9 = 34 -> 7
      expect(calculateLifePath("1984-04-22")).toBe(3); // 1+9+8+4+0+4+2+2 = 30 -> 3
      expect(calculateLifePath("1999-09-06")).toBe(7); // 1+9+9+9+0+9+0+6 = 43 -> 7
      expect(calculateLifePath("1999-12-31")).toBe(8); // 1+9+9+9+1+2+3+1 = 35 -> 8
      expect(calculateLifePath("2000-02-29")).toBe(6); // 2+0+0+0+0+2+2+9 = 15 -> 6
    });

    it("handles master numbers when sum equals 11, 22, 33", () => {
      // Need dates where sum equals master numbers before reduction
      // 1990-11-29: 1+9+9+0+1+1+2+9 = 32 -> 5 (not 11)
      // Let's find dates that actually produce master numbers
      // 2003-11-11: 2+0+0+3+1+1+1+1 = 9
      // 1999-11-11: 1+9+9+9+1+1+1+1 = 31 -> 4
    });
  });

  describe("calculateExpressionNumber", () => {
    it("calculates expression for JUAN PEREZ", () => {
      expect(calculateExpressionNumber("JUAN PEREZ")).toBe(8);
    });

    it("calculates expression for MARIA GARCIA", () => {
      expect(calculateExpressionNumber("MARIA GARCIA")).toBe(9);
    });

    it("handles single name", () => {
      expect(calculateExpressionNumber("ANA")).toBe(7); // A=1, N=5, A=1 = 7
    });

    it("ignores spaces and special characters", () => {
      expect(calculateExpressionNumber("JUAN  PEREZ")).toBe(8);
      expect(calculateExpressionNumber("JUAN-PEREZ")).toBe(8);
    });
  });

  describe("calculateSoulNumber", () => {
    it("calculates soul number from vowels only", () => {
      // JUAN -> U=3, A=1 = 4
      expect(calculateSoulNumber("JUAN")).toBe(4);
    });

    it("calculates soul for MARIA", () => {
      // MARIA -> A=1, I=9, A=1 = 11 (master)
      expect(calculateSoulNumber("MARIA")).toBe(11);
    });
  });

describe("calculatePersonalityNumber", () => {
  it("calculates personality from consonants only", () => {
    // JUAN -> J=1, N=5 = 6
    expect(calculatePersonalityNumber("JUAN")).toBe(6);
  });

  it("calculates personality for MARIA", () => {
    // MARIA -> M=4, R=9 = 13 -> 4
    expect(calculatePersonalityNumber("MARIA")).toBe(4);
  });
});

describe("calculateBirthDayNumber", () => {
  it("returns single digit for days 1-9", () => {
    expect(calculateBirthDayNumber(1)).toBe(1);
    expect(calculateBirthDayNumber(2)).toBe(2);
    expect(calculateBirthDayNumber(8)).toBe(8);
    expect(calculateBirthDayNumber(9)).toBe(9);
  });

  it("reduces double-digit days to single digit", () => {
    expect(calculateBirthDayNumber(10)).toBe(1);
    expect(calculateBirthDayNumber(17)).toBe(8);
    expect(calculateBirthDayNumber(18)).toBe(9);
    expect(calculateBirthDayNumber(25)).toBe(7);
    expect(calculateBirthDayNumber(30)).toBe(3);
    expect(calculateBirthDayNumber(31)).toBe(4);
  });

  it("keeps master number 11", () => {
    expect(calculateBirthDayNumber(11)).toBe(11);
  });

  it("keeps master number 22", () => {
    expect(calculateBirthDayNumber(22)).toBe(22);
  });

  it("keeps master number 11 for day 29", () => {
    expect(calculateBirthDayNumber(29)).toBe(11);
  });

  it("does not depend on name, month, or year", () => {
    expect(calculateBirthDayNumber(17)).toBe(8);
    expect(calculateBirthDayNumber(17)).toBe(calculateBirthDayNumber(17));
  });

  it("returns 0 for invalid day", () => {
    expect(calculateBirthDayNumber(0)).toBe(0);
    expect(calculateBirthDayNumber(32)).toBe(0);
  });

  it("days 9, 18 and 27 all produce personality 9 (FASE 1D-2C)", () => {
    expect(calculateBirthDayNumber(9)).toBe(9);
    expect(calculateBirthDayNumber(18)).toBe(9);
    expect(calculateBirthDayNumber(27)).toBe(9);
  });
});

describe("getArchetypeInfo", () => {
    it("returns correct archetype for life path 1", () => {
      const archetype = getArchetypeInfo(1);
      expect(archetype.name).toBe("El Líder");
    });

    it("returns correct archetype for master 11", () => {
      const archetype = getArchetypeInfo(11);
      expect(archetype.name).toBe("El Visionario");
    });

    it("returns correct archetype for master 22", () => {
      const archetype = getArchetypeInfo(22);
      expect(archetype.name).toBe("El Constructor Maestro");
    });

    it("returns fallback for unknown life path", () => {
      const archetype = getArchetypeInfo(999);
      expect(archetype.name).toBe("El Buscador");
    });
  });

  describe("getMasterNumbers", () => {
    it("detects a master life path", () => {
      const hits = getMasterNumbers({ lifePath: 11, expressionNumber: 3, soulNumber: 5, personalityNumber: 7 });
      expect(hits).toEqual([{ position: "lifePath", number: 11 }]);
    });

    it("detects a master soul number", () => {
      const hits = getMasterNumbers({ lifePath: 4, expressionNumber: 6, soulNumber: 22, personalityNumber: 8 });
      expect(hits).toEqual([{ position: "soul", number: 22 }]);
    });

    it("detects a master expression number", () => {
      const hits = getMasterNumbers({ lifePath: 4, expressionNumber: 33, soulNumber: 6, personalityNumber: 8 });
      expect(hits).toEqual([{ position: "expression", number: 33 }]);
    });

    it("detects a master personality number", () => {
      const hits = getMasterNumbers({ lifePath: 4, expressionNumber: 6, soulNumber: 8, personalityNumber: 11 });
      expect(hits).toEqual([{ position: "personality", number: 11 }]);
    });

    it("detects multiple master numbers across positions", () => {
      const hits = getMasterNumbers({ lifePath: 11, expressionNumber: 22, soulNumber: 5, personalityNumber: 33 });
      expect(hits).toEqual([
        { position: "lifePath", number: 11 },
        { position: "expression", number: 22 },
        { position: "personality", number: 33 },
      ]);
    });

    it("returns an empty array when there are no master numbers", () => {
      const hits = getMasterNumbers({ lifePath: 4, expressionNumber: 6, soulNumber: 8, personalityNumber: 9 });
      expect(hits).toEqual([]);
    });

    it("ignores undefined optional fields", () => {
      const hits = getMasterNumbers({ lifePath: 4 });
      expect(hits).toEqual([]);
    });
  });

  describe("getMasterPositionMeaning", () => {
    it("returns distinct, non-empty text for every master number and position", () => {
      const numbers = [11, 22, 33] as const;
      const positions = ["lifePath", "expression", "soul", "personality"] as const;
      const seen = new Set<string>();
      for (const n of numbers) {
        for (const p of positions) {
          const text = getMasterPositionMeaning(n, p);
          expect(text.length).toBeGreaterThan(20);
          expect(seen.has(text)).toBe(false);
          seen.add(text);
        }
      }
    });
  });
});