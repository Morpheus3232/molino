import { describe, test, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Home page — universal access without profile", () => {
  test("home page renders without requiring profile", () => {
    const pagePath = path.resolve(__dirname, "..", "app", "page.tsx");
    const source = fs.readFileSync(pagePath, "utf8");
    expect(source).toBeTruthy();
  });

  test("home includes onboarding form and conversion sections", () => {
    const pagePath = path.resolve(__dirname, "..", "app", "page.tsx");
    const source = fs.readFileSync(pagePath, "utf8");
    expect(source).toBeTruthy();
    expect(source).toContain("HeroInstrument");
    expect(source).toContain("ClaritySection");
    // Fase 4: los tres NIVELES (Mapa → Lectura → IA). Sin esta sección, un
    // visitante nuevo no tiene cómo distinguirlos. `ProofSection` que se
    // esperaba acá antes ya no existe en la home.
    expect(source).toContain("ThreeLevelsSection");
    expect(source).toContain("FeaturesSection");
    expect(source).toContain("CTASection");
    expect(source).toContain("FAQ");
  });
});
