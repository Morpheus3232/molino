import { describe, test, expect } from "vitest";
import { ENTITIES } from "../entities";
import { COUNTRIES } from "../countries";

// Fase 6A (2026-08-22): países en ENTITIES tenían chineseZodiac/element
// hardcodeados a mano y divergentes de COUNTRIES (fuente canónica) — mismo
// país, animal distinto según la ruta (/compatibility/[entity] vs
// /compatibility/countries), y por lo tanto un resultado de compatibilidad
// distinto para el mismo usuario según por dónde entrara.

describe("Consistencia de zodíaco chino entre ENTITIES (país) y COUNTRIES", () => {
  const countryEntities = ENTITIES.filter((e) => e.category === "country");

  test("hay al menos un país de prueba conocido en ambos datasets", () => {
    expect(countryEntities.find((e) => e.name === "Argentina")).toBeTruthy();
    expect(COUNTRIES.find((c) => c.name === "Argentina")).toBeTruthy();
  });

  test.each(countryEntities.map((e) => e.name))(
    "%s: chineseZodiac/element coinciden con COUNTRIES (fuente canónica)",
    (name) => {
      const entity = countryEntities.find((e) => e.name === name)!;
      const canonical = COUNTRIES.find((c) => c.name === name);
      if (!canonical) return; // país sin contraparte en COUNTRIES, no hay nada que normalizar
      expect(entity.symbolism.chineseZodiac).toBe(canonical.animal);
      expect(entity.symbolism.element).toBe(canonical.element);
    }
  );

  test("Argentina específicamente: Rata (regresión del bug encontrado en la auditoría)", () => {
    const argentina = countryEntities.find((e) => e.name === "Argentina")!;
    expect(argentina.symbolism.chineseZodiac).toBe("Rata");
  });
});
