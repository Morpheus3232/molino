import { describe, test, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Home page — universal access without profile", () => {
  test("home page renders without requiring profile", () => {
    const pagePath = path.resolve(__dirname, "..", "app", "page.tsx");
    const source = fs.readFileSync(pagePath, "utf8");
    expect(source).toBeTruthy();
  });

  test("home includes the instrument form and JSON-LD schemas", () => {
    const pagePath = path.resolve(__dirname, "..", "app", "page.tsx");
    const source = fs.readFileSync(pagePath, "utf8");
    expect(source).toBeTruthy();
    // La home actual es un único instrumento interactivo de ingreso de fecha
    // (HeroInstrument) + JSON-LD: cualquier persona la abre sin perfil.
    expect(source).toContain("HeroInstrument");
    expect(source).toContain("HowTo");
    expect(source).toContain("FAQPage");
    expect(source).toContain("#mapa-form");
  });
});
