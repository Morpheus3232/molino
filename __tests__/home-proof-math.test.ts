import { describe, it, expect } from "vitest";
import { calculateLifePath } from "@/lib/engines/numerologyEngine";
import { getPersonalYear } from "@/lib/calculations";

describe("ProofSection mathematical verification", () => {
  it("verifica que 15/06/1990 produce exactamente Camino de Vida 4", () => {
    const lp = calculateLifePath("1990-06-15");
    expect(lp).toBe(4);
  });

  it("verifica que 15/06/1990 en 2026 produce exactamente Año Personal 4", () => {
    const py = getPersonalYear(15, 6, 1990, 2026);
    expect(py).toBe(4);
  });
});
