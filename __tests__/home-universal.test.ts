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
    expect(source).toContain("HeroNew");
    expect(source).toContain("SystemsPreview");
    expect(source).toContain("Journey");
    expect(source).toContain("ConceptsIndex");
    // FinalCTA was removed deliberately: it repeated the exact same "start
    // now" pitch already made by HeroNew and Journey's first step, three
    // times in one scroll. The onboarding CTA now lives once, in HeroNew.
    const heroPath = path.resolve(__dirname, "..", "components", "sections", "HeroNew.tsx");
    const heroSource = fs.readFileSync(heroPath, "utf8");
    expect(heroSource).toContain("DESCUBRIR MI MAPA");
  });
});
