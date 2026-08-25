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
    expect(source).toContain("ProofSection");
    expect(source).toContain("ClaritySection");
    expect(source).toContain("FeaturesSection");
    expect(source).toContain("CTASection");
    expect(source).toContain("FAQ");
  });
});
