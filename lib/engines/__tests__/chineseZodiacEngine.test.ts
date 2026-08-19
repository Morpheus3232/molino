import { describe, it, expect } from "vitest";
import {
  calculateAnimalFromDate,
  getChineseElement,
  getChineseAnimal,
  calculateChineseCompatibility,
} from "../chineseZodiacEngine";

describe("Chinese Zodiac Engine", () => {
  describe("calculateAnimalFromDate", () => {
    it("returns correct animal for known years", () => {
      // 2024 = Dragon
      const result2024 = calculateAnimalFromDate("2024-06-01");
      expect(result2024.animal).toBe("Dragón");
      expect(result2024.isApproximate).toBe(false);
    });

    it("returns correct animal for 2020 (Rat)", () => {
      const result2020 = calculateAnimalFromDate("2020-06-01");
      expect(result2020.animal).toBe("Rata");
    });

    it("returns correct animal for 2021 (Ox)", () => {
      const result2021 = calculateAnimalFromDate("2021-06-01");
      expect(result2021.animal).toBe("Buey");
    });

    it("returns correct animal for 2022 (Tiger)", () => {
      const result2022 = calculateAnimalFromDate("2022-06-01");
      expect(result2022.animal).toBe("Tigre");
    });

    it("returns Gato for 2023 (engine uses Gato for Rabbit)", () => {
      const result2023 = calculateAnimalFromDate("2023-06-01");
      expect(result2023.animal).toBe("Gato");
    });

    it("returns isApproximate true when only year provided", () => {
      const result = calculateAnimalFromDate(undefined, 1990);
      expect(result.animal).toBe("Caballo");
      expect(result.isApproximate).toBe(true);
    });

    it("handles year-only fallback correctly", () => {
      const result = calculateAnimalFromDate(undefined, 2024);
      expect(result.animal).toBe("Dragón");
      expect(result.isApproximate).toBe(true);
    });
  });

  describe("getChineseElement", () => {
    it("returns correct elements for known years", () => {
      // 1984 = Wood
      expect(getChineseElement(1984)).toBe("Madera");
      // 1985 = Wood
      expect(getChineseElement(1985)).toBe("Madera");
      // 1986 = Fire
      expect(getChineseElement(1986)).toBe("Fuego");
      // 1987 = Fire
      expect(getChineseElement(1987)).toBe("Fuego");
      // 1988 = Earth
      expect(getChineseElement(1988)).toBe("Tierra");
      // 1989 = Earth
      expect(getChineseElement(1989)).toBe("Tierra");
      // 1990 = Metal
      expect(getChineseElement(1990)).toBe("Metal");
      // 1991 = Metal
      expect(getChineseElement(1991)).toBe("Metal");
      // 1992 = Water
      expect(getChineseElement(1992)).toBe("Agua");
      // 1993 = Water
      expect(getChineseElement(1993)).toBe("Agua");
    });

    it("cycles correctly every 10 years", () => {
      expect(getChineseElement(2024)).toBe("Madera");
      expect(getChineseElement(2034)).toBe("Madera");
    });
  });

  describe("getChineseAnimal", () => {
    it("returns correct animals for cycle", () => {
      // 2020 = Rat (index 0)
      expect(getChineseAnimal(2020)).toBe("Rata");
      // 2021 = Ox (index 1)
      expect(getChineseAnimal(2021)).toBe("Buey");
      // 2022 = Tiger (index 2)
      expect(getChineseAnimal(2022)).toBe("Tigre");
      // 2023 = Gato (index 3 - engine uses Gato for Rabbit)
      expect(getChineseAnimal(2023)).toBe("Gato");
      // 2024 = Dragon (index 4)
      expect(getChineseAnimal(2024)).toBe("Dragón");
      // 2025 = Snake (index 5)
      expect(getChineseAnimal(2025)).toBe("Serpiente");
      // 2026 = Horse (index 6)
      expect(getChineseAnimal(2026)).toBe("Caballo");
      // 2027 = Goat (index 7)
      expect(getChineseAnimal(2027)).toBe("Cabra");
      // 2028 = Monkey (index 8)
      expect(getChineseAnimal(2028)).toBe("Mono");
      // 2029 = Rooster (index 9)
      expect(getChineseAnimal(2029)).toBe("Gallo");
      // 2030 = Dog (index 10)
      expect(getChineseAnimal(2030)).toBe("Perro");
      // 2031 = Pig (index 11)
      expect(getChineseAnimal(2031)).toBe("Cerdo");
      // 2032 = Rat again (index 0)
      expect(getChineseAnimal(2032)).toBe("Rata");
    });

    it("handles years before 1900 correctly per engine logic", () => {
      // 1899 = Pig (index 11)
      expect(getChineseAnimal(1899)).toBe("Cerdo");
      // 1896 = Monkey (engine calculates differently)
      expect(getChineseAnimal(1896)).toBe("Mono");
    });
  });

  describe("calculateChineseCompatibility", () => {
    it("returns high score for same animal", () => {
      expect(calculateChineseCompatibility("Rata", "Rata")).toBeGreaterThan(70);
    });

    it("returns valid score for known triads", () => {
      // Rata, Dragón, Mono are triad
      expect(calculateChineseCompatibility("Rata", "Dragón")).toBeGreaterThan(70);
      expect(calculateChineseCompatibility("Rata", "Mono")).toBeGreaterThan(70);
    });

    it("returns valid score for opposites", () => {
      // Rata opposite Caballo
      const score = calculateChineseCompatibility("Rata", "Caballo");
      expect(score).toBeLessThan(60);
    });

    it("handles empty strings", () => {
      expect(calculateChineseCompatibility("", "Rata")).toBe(50);
      expect(calculateChineseCompatibility("Rata", "")).toBe(50);
    });
  });
});