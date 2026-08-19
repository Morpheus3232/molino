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

    it("calcula nextOwnYear y nextEnemyYear dentro de los próximos 12 años", () => {
      const result = analyzeTiming("Caballo", 2026);
      expect(result.nextOwnYear).toBeGreaterThanOrEqual(2026);
      expect(result.nextOwnYear).toBeLessThan(2026 + 12);
      expect(result.nextEnemyYear).toBeGreaterThanOrEqual(2026);
      expect(result.nextEnemyYear).toBeLessThan(2026 + 12);
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
