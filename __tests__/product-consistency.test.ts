import { describe, test, expect } from "vitest";
import { ANIMALS } from "@/lib/data/animalRelations";
import { BRANDS } from "@/lib/data/brands";

describe("Product consistency — Molino", () => {
  test("Gato is canonical sign, not Conejo", () => {
    expect(ANIMALS).toContain("Gato");
    expect(ANIMALS).not.toContain("Conejo");
  });

  test("Brands data has valid categories", () => {
    const categories = new Set(BRANDS.map((b: any) => b.category));
    expect(categories.size).toBeGreaterThan(0);
    for (const brand of BRANDS.slice(0, 20)) {
      expect(brand.category).toBeTruthy();
      expect(brand.animal).toBeTruthy();
    }
  });

  test("UniversityHeader nav links do not contain 'Descubrir'", () => {
    const fs = require("fs");
    const path = require("path");
    const headerPath = path.resolve(__dirname, "..", "components", "layout", "UniversityHeader.tsx");
    expect(fs.readFileSync(headerPath, "utf8")).not.toContain("Descubrir");
  });

  // lib/data/navigation.ts se eliminó en Fase 4 (2026-08-22): 0 imports en
  // todo el repo, footer real vive hardcodeado en UniversityFooter.tsx.
  test("lib/data/navigation.ts (huérfano) fue eliminado", () => {
    const fs = require("fs");
    const path = require("path");
    const navPath = path.resolve(__dirname, "..", "lib", "data", "navigation.ts");
    expect(fs.existsSync(navPath)).toBe(false);
  });

  test("saved ProfileHub does not expose DailyInsights", () => {
    const fs = require("fs");
    const path = require("path");
    const hubPath = path.resolve(__dirname, "..", "components", "profile", "ProfileHub.tsx");
    const hubSource = fs.readFileSync(hubPath, "utf8");
    expect(hubSource).not.toContain("DailyInsights");
    expect(hubSource).not.toContain("Daily Energy");
    expect(hubSource).not.toContain("Tu energía de hoy");
  });

});
