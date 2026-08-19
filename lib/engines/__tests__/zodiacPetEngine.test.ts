import { describe, it, expect } from "vitest";
import {
  getPetRecommendation,
  getPetRecommendationByYear,
  isPetCompatible,
  getSafePets,
  getPetConflictLevel,
} from "../zodiacPetEngine";

describe("Zodiac Pet Engine", () => {
  describe("getPetRecommendation", () => {
    it("Dragón → evita Perro, nivel ALTO", () => {
      const result = getPetRecommendation("Dragón");
      expect(result.petToAvoid).toBe("Perro");
      expect(result.nivel).toBe("ALTO");
      expect(result.razon).toContain("opuesto");
    });

    it("Serpiente → evita Cerdo, nivel ALTO", () => {
      const result = getPetRecommendation("Serpiente");
      expect(result.petToAvoid).toBe("Cerdo");
      expect(result.nivel).toBe("ALTO");
    });

    it("es bidireccional: Dragón evita Perro y Perro evita Dragón", () => {
      const dragon = getPetRecommendation("Dragón");
      const perro = getPetRecommendation("Perro");
      expect(dragon.petToAvoid).toBe("Perro");
      expect(perro.petToAvoid).toBe("Dragón");
      expect(dragon.nivel).toBe(perro.nivel);
    });
  });

  describe("getPetRecommendationByYear", () => {
    it("1988 (Dragón) debe evitar Perros", () => {
      const result = getPetRecommendationByYear(1988);
      expect(result.sign).toBe("Dragón");
      expect(result.petToAvoid).toBe("Perro");
    });

    it("1989 (Serpiente) debe evitar Cerdos", () => {
      const result = getPetRecommendationByYear(1989);
      expect(result.sign).toBe("Serpiente");
      expect(result.petToAvoid).toBe("Cerdo");
    });

    it("1990 (Caballo) debe evitar Ratas", () => {
      const result = getPetRecommendationByYear(1990);
      expect(result.sign).toBe("Caballo");
      expect(result.petToAvoid).toBe("Rata");
    });

    it("1984 (Rata) debe evitar Caballos", () => {
      const result = getPetRecommendationByYear(1984);
      expect(result.sign).toBe("Rata");
      expect(result.petToAvoid).toBe("Caballo");
    });
  });

  describe("isPetCompatible", () => {
    it("Dragón con Perro es incompatible", () => {
      expect(isPetCompatible("Dragón", "Perro")).toBe(false);
    });

    it("Dragón con Gato es compatible", () => {
      expect(isPetCompatible("Dragón", "Gato")).toBe(true);
    });

    it("Serpiente con Cerdo es incompatible", () => {
      expect(isPetCompatible("Serpiente", "Cerdo")).toBe(false);
    });
  });

  describe("getSafePets", () => {
    it("Dragón tiene todas las mascotas excepto Perro", () => {
      const safe = getSafePets("Dragón");
      expect(safe).not.toContain("Perro");
      expect(safe).toContain("Gato");
    });

    it("Serpiente tiene todas excepto Cerdo", () => {
      const safe = getSafePets("Serpiente");
      expect(safe).not.toContain("Cerdo");
    });
  });

  describe("getPetConflictLevel", () => {
    it("Dragón con Perro es ALTO", () => {
      expect(getPetConflictLevel("Dragón", "Perro")).toBe("ALTO");
    });

    it("Serpiente con Cerdo es ALTO", () => {
      expect(getPetConflictLevel("Serpiente", "Cerdo")).toBe("ALTO");
    });

    it("Dragón con mascota del trío de afinidad (Rata, Mono) es NULO", () => {
      expect(getPetConflictLevel("Dragón", "Rata")).toBe("NULO");
      expect(getPetConflictLevel("Dragón", "Mono")).toBe("NULO");
    });
  });
});
