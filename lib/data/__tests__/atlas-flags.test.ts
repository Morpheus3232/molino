import { describe, it, expect } from "vitest";
import { getAllAtlasEntitiesWithCountries } from "../atlas-queries";

/** 🇦🇷 son los indicadores regionales de A y R: la bandera ES el ISO. */
function flagToISO(flag?: string): string | null {
  const cps = [...(flag ?? "")].map((c) => c.codePointAt(0) ?? 0);
  if (cps.length !== 2 || !cps.every((c) => c >= 0x1f1e6 && c <= 0x1f1ff)) return null;
  return cps.map((c) => String.fromCharCode(c - 0x1f1e6 + 65)).join("");
}

/**
 * Países y ciudades llevan la bandera de su país como logo (EntityVisual).
 * Sin ISO caen al 🌐 genérico sin que nadie se entere: este test es el candado.
 */
describe("banderas del Atlas", () => {
  const territorio = getAllAtlasEntitiesWithCountries().filter(
    (e) => e.type === "country" || e.type === "city",
  );

  it("todo país y toda ciudad se dibuja como bandera con un ISO", () => {
    const sinBandera = territorio
      .filter((e) => e.visualType !== "flag" || !e.countryISO)
      .map((e) => `${e.id} (${e.country})`);
    expect(sinBandera).toEqual([]);
  });

  it("el ISO coincide con la bandera que trae el propio registro", () => {
    const conflictos = territorio
      .filter((e) => flagToISO(e.emoji) && flagToISO(e.emoji) !== e.countryISO)
      .map((e) => `${e.id}: ${e.emoji} vs ${e.countryISO}`);
    expect(conflictos).toEqual([]);
  });

  it("cada país lleva su propia bandera", () => {
    const ajenas = territorio
      .filter((e) => e.type === "country" && e.country !== e.name)
      .map((e) => `${e.name} → ${e.country}`);
    expect(ajenas).toEqual([]);
  });
});
