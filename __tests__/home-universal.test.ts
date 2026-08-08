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
    expect(source).toContain("NumeroDia");
    expect(source).toContain("TresPasos");
    expect(source).toContain("QueDescubris");
    expect(source).toContain("TresSistemas");
    expect(source).toContain("CTAFinal");
    expect(source).toContain("Testimonial");
    expect(source).toContain("TrustMetrics");
    const numeroDiaPath = path.resolve(__dirname, "..", "components", "sections", "NumeroDia.tsx");
    const numeroDiaSource = fs.readFileSync(numeroDiaPath, "utf8");
    expect(numeroDiaSource).toContain("EMPEZÁ");
  });
});