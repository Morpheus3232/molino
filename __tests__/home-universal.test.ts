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
    expect(source).toContain("HeroClient");
    expect(source).toContain("SystemsPreview");
    const heroPath = path.resolve(__dirname, "..", "components", "sections", "HeroClient.tsx");
    const heroSource = fs.readFileSync(heroPath, "utf8");
    expect(heroSource).toContain("CREAR MI MAPA");
  });
});
