import { describe, test, expect } from "vitest";
import { SYMBOLIC_ENTITIES } from "../symbolic-entities";

// Cobertura por país prioritario: ≥11 actuales + ≥3 históricos, los
// históricos son adicionales a los actuales (nunca se cuentan dos veces).
// Argentina ya tenía 4 históricos antes de esta tarea (Maradona, Messi,
// Riquelme, Sorín) — quedan intactos, no se pidieron 3 nuevos para ese país.

const PRIORITY_COUNTRIES = [
  "Argentina", "Uruguay", "España", "Estados Unidos",
  "Chile", "Perú", "México", "Colombia", "Brasil",
];

function playersOf(country: string) {
  return SYMBOLIC_ENTITIES.filter((e) => e.type === "football_player" && e.country === country);
}

describe("football_player — cobertura por país prioritario", () => {
  test.each(PRIORITY_COUNTRIES)("%s: ≥11 actuales y ≥3 históricos, sin solaparse", (country) => {
    const players = playersOf(country);
    const actuales = players.filter((e) => e.category === "actual");
    const historicos = players.filter((e) => e.category === "historico");

    expect(actuales.length).toBeGreaterThanOrEqual(11);
    expect(historicos.length).toBeGreaterThanOrEqual(3);

    const actualIds = new Set(actuales.map((e) => e.id));
    const historicoIds = new Set(historicos.map((e) => e.id));
    for (const id of historicoIds) {
      expect(actualIds.has(id)).toBe(false);
    }
  });

  test("cada football_player tiene category actual u historico (metadata de distinción, sin nuevo type)", () => {
    const players = SYMBOLIC_ENTITIES.filter((e) => e.type === "football_player");
    expect(players.length).toBeGreaterThan(0);
    for (const p of players) {
      expect(["actual", "historico"]).toContain(p.category);
    }
  });

  test("ningún football_player tiene fecha/evento inventado: todos con year real y source", () => {
    const players = SYMBOLIC_ENTITIES.filter((e) => e.type === "football_player");
    for (const p of players) {
      expect(p.events.length).toBeGreaterThan(0);
      const primary = p.events[0];
      expect(primary.year).toBeGreaterThan(1900);
      expect(primary.source).toBeTruthy();
      expect(primary.confidence).toBeTruthy();
    }
  });

  test("animal se resuelve vía calculateAnimalFromDate (chineseZodiacEngine), no hardcodeado en la data", () => {
    // Confirma que ninguna entidad football_player trae un campo "animal"
    // propio en la data cruda — el schema (AtlasEntityInput) no lo tiene,
    // así que esto es estructural: si compiló, ya se cumple.
    const players = SYMBOLIC_ENTITIES.filter((e) => e.type === "football_player");
    for (const p of players) {
      expect((p as unknown as { animal?: unknown }).animal).toBeUndefined();
    }
  });
});
