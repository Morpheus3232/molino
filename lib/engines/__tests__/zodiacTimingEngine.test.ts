import { describe, it, expect } from "vitest";
import { analyzeTiming } from "../zodiacTimingEngine";
import { analyzeTimingByYear } from "../chineseZodiacEngine";

describe("Zodiac Timing Engine", () => {
  describe("analyzeTiming", () => {
    it("Caballo en año Caballo (2026) → MUY_FAVORABLE", () => {
      const result = analyzeTiming("Caballo", 2026);
      expect(result.currentYearSign).toBe("Caballo");
      expect(result.isOwnYear).toBe(true);
      expect(result.favorability).toBe("MUY_FAVORABLE");
    });

    it("Rata en año Caballo (2026) → MUY_DESFAVORABLE", () => {
      const result = analyzeTiming("Rata", 2026);
      expect(result.isEnemyYear).toBe(true);
      expect(result.favorability).toBe("MUY_DESFAVORABLE");
    });

    it("Dragón en año Caballo (2026) → NEUTRAL", () => {
      const result = analyzeTiming("Dragón", 2026);
      expect(result.isOwnYear).toBe(false);
      expect(result.isEnemyYear).toBe(false);
      expect(result.favorability).toBe("NEUTRAL");
    });

    it("calcula nextOwnYear y nextEnemyYear estrictamente posteriores a queryYear", () => {
      const result = analyzeTiming("Caballo", 2026);
      // Caballo en 2026: el próximo año Caballo es 2038 (no 2026)
      expect(result.nextOwnYear).toBe(2038);
      // Rata (opuesto de Caballo): el próximo año Rata desde 2026 es 2032
      expect(result.nextEnemyYear).toBe(2032);
    });

    it("calcula correctamente el próximo año para animales no coincidentes", () => {
      const cabra = analyzeTiming("Cabra", 2026);
      expect(cabra.nextOwnYear).toBe(2027);

      const mono = analyzeTiming("Mono", 2026);
      expect(mono.nextOwnYear).toBe(2028);

      const rata = analyzeTiming("Rata", 2026);
      expect(rata.nextOwnYear).toBe(2032);
    });

    it("garantiza para todos los animales que nextOwnYear y nextEnemyYear son > queryYear y <= queryYear + 12", () => {
      const animals = [
        "Rata", "Buey", "Tigre", "Gato", "Dragón", "Serpiente",
        "Caballo", "Cabra", "Mono", "Gallo", "Perro", "Cerdo",
      ] as const;

      for (const animal of animals) {
        const t = analyzeTiming(animal, 2026);
        expect(t.nextOwnYear).toBeGreaterThan(2026);
        expect(t.nextOwnYear).toBeLessThanOrEqual(2026 + 12);
        expect(t.nextEnemyYear).toBeGreaterThan(2026);
        expect(t.nextEnemyYear).toBeLessThanOrEqual(2026 + 12);
      }
    });
  });

  describe("analyzeTimingByYear (integración con chineseZodiacEngine)", () => {
    it("1990 (Caballo) en 2026 → MUY_FAVORABLE", () => {
      const result = analyzeTimingByYear(1990, 2026);
      expect(result.sign).toBe("Caballo");
      expect(result.favorability).toBe("MUY_FAVORABLE");
    });

    it("1984 (Rata) en 2026 → MUY_DESFAVORABLE", () => {
      const result = analyzeTimingByYear(1984, 2026);
      expect(result.sign).toBe("Rata");
      expect(result.favorability).toBe("MUY_DESFAVORABLE");
    });

    it("1988 (Dragón) en 2026 → NEUTRAL", () => {
      const result = analyzeTimingByYear(1988, 2026);
      expect(result.sign).toBe("Dragón");
      expect(result.favorability).toBe("NEUTRAL");
    });
  });
});
