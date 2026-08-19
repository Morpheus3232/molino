import { describe, it, expect } from "vitest";
import { getFoodRecommendation, getFoodRecommendationByYear } from "../zodiacFoodEngine";

describe("Zodiac Food Engine", () => {
  describe("getFoodRecommendation", () => {
    it("Serpiente → nivel ALTO, alimento Cerdo", () => {
      const result = getFoodRecommendation("Serpiente");
      expect(result.nivel).toBe("ALTO");
      expect(result.alimento).toBe("Cerdo");
      expect(result.restriction).toBe("EVITAR");
      expect(result.ejemplos).toContain("bacon");
      expect(result.ejemplos).toContain("jamón");
    });

    it("Buey → nivel ALTO, alimento Cabra", () => {
      const result = getFoodRecommendation("Buey");
      expect(result.nivel).toBe("ALTO");
      expect(result.alimento).toBe("Cabra");
    });

    it("Dragón → nivel BAJO, sin restricción", () => {
      const result = getFoodRecommendation("Dragón");
      expect(result.nivel).toBe("BAJO");
      expect(result.restriction).toBe("LIBRE");
      expect(result.ejemplos).toEqual([]);
    });

    it("es simétrico con getClashPartner: Cabra evita Vaca/Buey", () => {
      const result = getFoodRecommendation("Cabra");
      expect(result.alimento).toBe("Vaca/Buey");
      expect(result.nivel).toBe("ALTO");
    });
  });

  describe("getFoodRecommendationByYear", () => {
    it("1989 (Serpiente) → alimento Cerdo", () => {
      const result = getFoodRecommendationByYear(1989);
      expect(result.sign).toBe("Serpiente");
      expect(result.alimento).toBe("Cerdo");
    });
  });
});
