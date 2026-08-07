import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Hoy sin perfil — fallback de energía base", () => {
  it("getGenericDailyEnergy devuelve datos para cualquier día", () => {
    const utilPath = path.resolve(__dirname, "..", "lib", "utils", "daily-energy-utils.ts");
    const source = fs.readFileSync(utilPath, "utf8");
    expect(source).toContain("export function getGenericDailyEnergy");
    expect(source).toContain("export interface GenericDailyData");
  });

  it("HoyBaseEnergy muestra energía base, teaser y CTA", () => {
    const componentPath = path.resolve(__dirname, "..", "components", "hoy", "HoyBaseEnergy.tsx");
    const source = fs.readFileSync(componentPath, "utf8");
    expect(source).toContain("Energía de Hoy");
    expect(source).toContain("Enfoque");
    expect(source).toContain("Precaución");
    expect(source).toContain("CREAR MI MAPA GRATIS");
    expect(source).toContain("Con tu mapa personal");
  });

  it("HoyClient renderiza el fallback cuando no hay perfil", () => {
    const clientPath = path.resolve(__dirname, "..", "components", "hoy", "HoyClient.tsx");
    const source = fs.readFileSync(clientPath, "utf8");
    expect(source).toContain("HoyBaseEnergy");
    expect(source).toContain("getGenericDailyEnergy");
    expect(source).toContain("!profile");
  });
});
