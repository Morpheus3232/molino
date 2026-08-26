import { describe, it, expect } from "vitest";
import { computeTheosophicalSteps } from "@/components/ui/MethodReductionLoader";
import { calculateLifePath, getPersonalYear } from "@/lib/calculations";
import { calculateBirthDayReduction } from "@/lib/engines/numerologyEngine";

describe("MethodReductionLoader & Theosophical Reduction", () => {
  it("calculates accurate steps for date 1987-05-23", () => {
    const steps = computeTheosophicalSteps("1987-05-23", 2026);

    // 1+9+8+7 + 0+5 + 2+3 = 35 -> 3+5 = 8
    expect(steps.lifePath.result).toBe(8);
    expect(steps.lifePath.result).toBe(calculateLifePath(23, 5, 1987));
    expect(steps.lifePath.formula).toContain("1 + 9 + 8 + 7 + 0 + 5 + 2 + 3 = 35");
    expect(steps.lifePath.reduced).toBe("3 + 5 = 8");
    expect(steps.lifePath.name).toBe("El Poderoso");

    // Vibración Base: Día 23 -> 2 + 3 = 5
    expect(steps.vibracionBase.result).toBe(5);
    expect(steps.vibracionBase.result).toBe(calculateBirthDayReduction(23).finalValue);
    expect(steps.vibracionBase.formula).toContain("Día 23 → 2 + 3 = 5");

    // Año Personal: 23 + 5 + 2026
    expect(steps.anoPersonal.result).toBe(getPersonalYear(23, 5, 1987, 2026));
  });

  it("handles master number 11 correctly (does not reduce 11)", () => {
    // 1990-01-01 -> 1+9+9+0 + 0+1 + 0+1 = 21 -> 3 (not master)
    // 1999-09-29 -> 1+9+9+9 + 0+9 + 2+9 = 48 -> 12 -> 3
    // 1980-01-01 -> 1+9+8+0 + 0+1 + 0+1 = 20 -> 2
    // 1975-07-29 -> 1+9+7+5 + 0+7 + 2+9 = 40 -> 4
    // 1989-11-09 -> 1+9+8+9 + 1+1 + 0+9 = 38 -> 11 (Master 11)
    const steps = computeTheosophicalSteps("1989-11-09", 2026);
    expect(steps.lifePath.result).toBe(11);
    expect(steps.lifePath.name).toBe("El Visionario");
  });

  it("handles single-digit days properly in Vibración Base", () => {
    const steps = computeTheosophicalSteps("2000-03-07", 2026);
    expect(steps.vibracionBase.result).toBe(7);
    expect(steps.vibracionBase.formula).toBe("Día 7");
  });
});
