import { describe, it, expect } from "vitest";
import {
  calculateLifePath,
  calculateExpressionNumber,
  calculateBirthDayReduction,
  calculateBirthDayNumber,
  calculatePersonalityNumber,
  getArchetypeInfo,
  getMasterNumbers,
  getMasterPositionMeaning,
} from "../numerologyEngine";
import { calculateUserProfileData } from "../profileBuilder";

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
      // 1975-08-17: 1+9+7+5+0+8+1+7 = 38 -> 11 (master)
      expect(calculateLifePath("1975-08-17")).toBe(11);
      // 2002-01-06: 2+0+0+2+0+1+0+6 = 11 (master)
      expect(calculateLifePath("2002-01-06")).toBe(11);
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

  describe("calculateBirthDayReduction (Personalidad en Molino)", () => {
    it("day 1 -> original: 1, reductionPath: [1], finalValue: 1", () => {
      const res = calculateBirthDayReduction(1);
      expect(res.original).toBe(1);
      expect(res.reductionPath).toEqual([1]);
      expect(res.finalValue).toBe(1);
      expect(res.isMaster).toBe(false);
    });

    it("day 9 -> original: 9, reductionPath: [9], finalValue: 9", () => {
      const res = calculateBirthDayReduction(9);
      expect(res.original).toBe(9);
      expect(res.reductionPath).toEqual([9]);
      expect(res.finalValue).toBe(9);
      expect(res.isMaster).toBe(false);
    });

    it("day 18 -> original: 18, reductionPath: [18, 9], finalValue: 9", () => {
      const res = calculateBirthDayReduction(18);
      expect(res.original).toBe(18);
      expect(res.reductionPath).toEqual([18, 9]);
      expect(res.finalValue).toBe(9);
      expect(res.isMaster).toBe(false);
    });

    it("day 28 -> original: 28, reductionPath: [28, 10, 1], finalValue: 1", () => {
      const res = calculateBirthDayReduction(28);
      expect(res.original).toBe(28);
      expect(res.reductionPath).toEqual([28, 10, 1]);
      expect(res.finalValue).toBe(1);
      expect(res.isMaster).toBe(false);
    });

    it("day 11 -> original: 11, reductionPath: [11], finalValue: 11 (master)", () => {
      const res = calculateBirthDayReduction(11);
      expect(res.original).toBe(11);
      expect(res.reductionPath).toEqual([11]);
      expect(res.finalValue).toBe(11);
      expect(res.isMaster).toBe(true);
    });

    it("day 22 -> original: 22, reductionPath: [22], finalValue: 22 (master)", () => {
      const res = calculateBirthDayReduction(22);
      expect(res.original).toBe(22);
      expect(res.reductionPath).toEqual([22]);
      expect(res.finalValue).toBe(22);
      expect(res.isMaster).toBe(true);
    });

    it("day 29 -> original: 29, reductionPath: [29, 11], finalValue: 11 (master)", () => {
      const res = calculateBirthDayReduction(29);
      expect(res.original).toBe(29);
      expect(res.reductionPath).toEqual([29, 11]);
      expect(res.finalValue).toBe(11);
      expect(res.isMaster).toBe(true);
    });

    it("returns 0 for invalid days", () => {
      expect(calculateBirthDayReduction(0).finalValue).toBe(0);
      expect(calculateBirthDayReduction(32).finalValue).toBe(0);
    });
  });

  describe("calculatePersonalityNumber & calculateBirthDayNumber parity", () => {
    it("calculatePersonalityNumber(day) delegates directly to birth day reduction", () => {
      expect(calculatePersonalityNumber(1)).toBe(1);
      expect(calculatePersonalityNumber(9)).toBe(9);
      expect(calculatePersonalityNumber(18)).toBe(9);
      expect(calculatePersonalityNumber(28)).toBe(1);
      expect(calculatePersonalityNumber(11)).toBe(11);
      expect(calculatePersonalityNumber(22)).toBe(22);
      expect(calculatePersonalityNumber(29)).toBe(11);
    });

    it("calculateBirthDayNumber matches calculatePersonalityNumber for every day 1-31", () => {
      for (let day = 1; day <= 31; day++) {
        expect(calculatePersonalityNumber(day)).toBe(calculateBirthDayNumber(day));
      }
    });
  });

  describe("Personalidad / Life Path independence and name insulation", () => {
    it("changing the name with the same birthDate produces the exact same personalityNumber", () => {
      const profileA = calculateUserProfileData("Juan Perez", "1990-04-18");
      const profileB = calculateUserProfileData("Maria Garcia", "1990-04-18");
      const profileC = calculateUserProfileData("", "1990-04-18");

      expect(profileA.personalityNumber).toBe(9);
      expect(profileB.personalityNumber).toBe(9);
      expect(profileC.personalityNumber).toBe(9);
      expect(profileA.personalityNumber).toBe(profileB.personalityNumber);
    });

    it("Life Path and Personalidad are calculated independently", () => {
      // 15/03/1990:
      // Date sum: 1+5+0+3+1+9+9+0 = 28 -> 10 -> 1 (Life Path = 1)
      // Day: 15 -> 1+5 = 6 (Personalidad = 6)
      const profile = calculateUserProfileData("Sofia", "1990-03-15");
      expect(profile.lifePath).toBe(1);
      expect(profile.personalityNumber).toBe(6);
      expect(profile.birthDay?.original).toBe(15);
      expect(profile.birthDay?.reductionPath).toEqual([15, 6]);
      expect(profile.birthDay?.finalValue).toBe(6);
    });

    it("day 28 produces personality 1 independently of Life Path", () => {
      // 28/07/1985:
      // Date sum: 1+9+8+5+0+7+2+8 = 40 -> 4 (Life Path = 4)
      // Day: 28 -> 2+8 = 10 -> 1 (Personalidad = 1)
      const profile = calculateUserProfileData("Lucas", "1985-07-28");
      expect(profile.lifePath).toBe(4);
      expect(profile.personalityNumber).toBe(1);
      expect(profile.birthDay?.reductionPath).toEqual([28, 10, 1]);
    });

    it("UserProfileData does not expose soulNumber", () => {
      const profile = calculateUserProfileData("Sofia", "1990-03-15");
      expect("soulNumber" in profile).toBe(false);
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
      const hits = getMasterNumbers({ lifePath: 11, expressionNumber: 3, personalityNumber: 7 });
      expect(hits).toEqual([{ position: "lifePath", number: 11 }]);
    });

    it("detects a master expression number", () => {
      const hits = getMasterNumbers({ lifePath: 4, expressionNumber: 33, personalityNumber: 8 });
      expect(hits).toEqual([{ position: "expression", number: 33 }]);
    });

    it("detects a master personality number", () => {
      const hits = getMasterNumbers({ lifePath: 4, expressionNumber: 6, personalityNumber: 11 });
      expect(hits).toEqual([{ position: "personality", number: 11 }]);
    });

    it("detects multiple master numbers across positions", () => {
      const hits = getMasterNumbers({ lifePath: 11, expressionNumber: 22, personalityNumber: 33 });
      expect(hits).toEqual([
        { position: "lifePath", number: 11 },
        { position: "expression", number: 22 },
        { position: "personality", number: 33 },
      ]);
    });

    it("returns an empty array when there are no master numbers", () => {
      const hits = getMasterNumbers({ lifePath: 4, expressionNumber: 6, personalityNumber: 9 });
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
      const positions = ["lifePath", "expression", "personality"] as const;
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