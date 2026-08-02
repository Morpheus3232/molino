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
    expect(source).toContain("HeroNew");
    expect(source).toContain("SystemsPreview");
    expect(source).toContain("Journey");
    expect(source).toContain("ConceptsIndex");
    expect(source).toContain("FinalCTA");
    expect(source).toContain("DESCUBRIR MI MAPA");
    expect(source).toContain("Identidad, mundo, círculo e inteligencia");
  });
});
