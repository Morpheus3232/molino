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
    const navPath = path.resolve(__dirname, "..", "lib", "data", "navigation.ts");
    const headerPath = path.resolve(__dirname, "..", "components", "layout", "UniversityHeader.tsx");
    expect(fs.readFileSync(navPath, "utf8")).not.toContain("Descubrir");
    expect(fs.readFileSync(headerPath, "utf8")).not.toContain("Descubrir");
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

  test("saved IdentityScreen does not expose DailyInsights", () => {
    const fs = require("fs");
    const path = require("path");
    const screenPath = path.resolve(__dirname, "..", "components", "profile", "screens", "IdentityScreen.tsx");
    const source = fs.readFileSync(screenPath, "utf8");
    expect(source).not.toContain("DailyInsights");
  });

  test("Profile does not contain Daily Energy card references", () => {
    const fs = require("fs");
    const path = require("path");
    const screenPath = path.resolve(__dirname, "..", "components", "profile", "screens", "IdentityScreen.tsx");
    const source = fs.readFileSync(screenPath, "utf8");
    expect(source).not.toContain("calculateDailyEnergy");
    expect(source).not.toContain("EnhancedMomentSection");
  });
});
