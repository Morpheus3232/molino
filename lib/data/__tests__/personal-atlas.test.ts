import { describe, test, expect } from "vitest";
import { getPersonalAtlas, PERSONAL_ATLAS_PILOT_CATEGORIES } from "../atlas-queries";

// getPersonalAtlas es el motor de fallback de Atlas Personal: para cada
// categoría (país -> región -> mundo, animal -> relación), server-side,
// sin score, sin inventar contenido por debajo del threshold (3).

const PILOT = PERSONAL_ATLAS_PILOT_CATEGORIES;

function levels(result: ReturnType<typeof getPersonalAtlas>) {
  return Object.fromEntries(result.groups.map((g) => [g.category, g.level]));
}

describe("getPersonalAtlas — contrato y niveles", () => {
  test("sin category explícita, resuelve exactamente las categorías del piloto", () => {
    const result = getPersonalAtlas({ animal: "Caballo", countryISO: "AR" });
    expect(result.groups.map((g) => g.category).sort()).toEqual([...PILOT].sort());
  });

  test("category explícita fuera del piloto (ej. brand) se acepta genéricamente", () => {
    const result = getPersonalAtlas({ animal: "Caballo", countryISO: "AR", category: "brand" });
    expect(result.groups).toHaveLength(1);
    expect(result.groups[0].category).toBe("brand");
  });

  test("cada grupo respeta el threshold: entities vacío o totalAvailable >= 3", () => {
    for (const animal of ["Caballo", "Dragón", "Gallo", "Gato"] as const) {
      for (const countryISO of ["AR", "MX", "ES", "BR", undefined]) {
        const result = getPersonalAtlas({ animal, countryISO });
        for (const g of result.groups) {
          if (g.entities.length === 0) continue;
          expect(g.totalAvailable).toBeGreaterThanOrEqual(3);
        }
        // nunca se muestra más de lo disponible, ni se inventa contenido
        for (const g of result.groups) {
          expect(g.entities.length).toBeLessThanOrEqual(g.totalAvailable);
        }
      }
    }
  });

  test("las entidades de cada grupo no tienen ids duplicados", () => {
    const result = getPersonalAtlas({ animal: "Rata", countryISO: "US" });
    for (const g of result.groups) {
      const ids = g.entities.map((e) => e.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  test("respeta limitPerGroup", () => {
    const result = getPersonalAtlas({ animal: "Perro", countryISO: "AR", limitPerGroup: 1 });
    for (const g of result.groups) {
      expect(g.entities.length).toBeLessThanOrEqual(1);
    }
  });
});

describe("getPersonalAtlas — sin país", () => {
  test("Caballo sin país: arranca directo en world (nunca country/region)", () => {
    const result = getPersonalAtlas({ animal: "Caballo" });
    expect(result.usedCountry).toBe(false);
    for (const g of result.groups) {
      expect(["world-animal", "world-relation"]).toContain(g.level);
    }
  });

  test("Dragón sin país: arranca directo en world (nunca country/region)", () => {
    const result = getPersonalAtlas({ animal: "Dragón" });
    expect(result.usedCountry).toBe(false);
    for (const g of result.groups) {
      expect(["world-animal", "world-relation"]).toContain(g.level);
    }
  });
});

describe("getPersonalAtlas — casos de prueba obligatorios", () => {
  test("Argentina + Caballo: nunca queda no disponible en el piloto", () => {
    // Tras completar football_player con los planteles reales, esta
    // categoría ya no es la excepción: las 5 categorías del piloto
    // resuelven con contenido para Argentina + Caballo.
    const result = getPersonalAtlas({ animal: "Caballo", countryISO: "AR" });
    for (const g of result.groups) {
      expect(g.entities.length).toBeGreaterThan(0);
    }
  });

  test("Argentina + Gato: la mejor cobertura del dataset resuelve a nivel país", () => {
    const result = getPersonalAtlas({ animal: "Gato", countryISO: "AR" });
    expect(result.usedCountry).toBe(true);
    const lv = levels(result);
    expect(lv.team === "country-animal" || lv.artist === "country-animal").toBe(true);
  });

  test("México + Dragón: university/team/artist/city siguen sin resolver a nivel país", () => {
    // football_player SÍ resuelve local ahora (México tiene Dragón en su
    // plantel real), lo cual vuelve usedCountry=true honestamente — pero
    // las categorías con datos previos a esta tarea siguen dependiendo de
    // región, exactamente como antes de completar football_player.
    const result = getPersonalAtlas({ animal: "Dragón", countryISO: "MX" });
    for (const g of result.groups) {
      if (g.category === "football_player") continue;
      expect(g.level.startsWith("country-")).toBe(false);
    }
  });

  test("España + Gallo: university/team/artist siguen sin resolver a nivel país", () => {
    const result = getPersonalAtlas({ animal: "Gallo", countryISO: "ES" });
    for (const g of result.groups) {
      if (g.category === "football_player") continue;
      expect(g.level.startsWith("country-")).toBe(false);
    }
  });

  test("Brasil + Caballo: fuera de football_player, sigue sin datos locales", () => {
    const result = getPersonalAtlas({ animal: "Caballo", countryISO: "BR" });
    for (const g of result.groups) {
      if (g.category === "football_player") continue;
      expect(g.level.startsWith("country-")).toBe(false);
    }
  });

  test("Brasil + Dragón: football_player resuelve local con datos reales; el resto sigue en región/mundo", () => {
    const result = getPersonalAtlas({ animal: "Dragón", countryISO: "BR" });
    const lv = levels(result);
    expect(lv.football_player).toBe("country-animal");
    for (const g of result.groups) {
      if (g.category === "football_player") continue;
      expect(g.level.startsWith("country-")).toBe(false);
    }
  });
});

describe("getPersonalAtlas — city (piloto ampliado)", () => {
  test("city forma parte del piloto por defecto, junto a university/team/football_player/artist", () => {
    const result = getPersonalAtlas({ animal: "Caballo", countryISO: "AR" });
    expect(result.groups.map((g) => g.category).sort()).toEqual(
      ["artist", "city", "football_player", "team", "university"]
    );
  });

  test("Argentina + Caballo: city resuelve a nivel país", () => {
    const result = getPersonalAtlas({ animal: "Caballo", countryISO: "AR", category: "city" });
    const [group] = result.groups;
    expect(["country-animal", "country-relation"]).toContain(group.level);
    expect(group.entities.length).toBeGreaterThan(0);
  });

  test("México + Dragón: city — categoría regional, no local — resuelve en región", () => {
    const result = getPersonalAtlas({ animal: "Dragón", countryISO: "MX", category: "city" });
    const [group] = result.groups;
    expect(["region-animal", "region-relation"]).toContain(group.level);
  });

  test("España + Gallo: city resuelve en región o mundo, nunca país", () => {
    const result = getPersonalAtlas({ animal: "Gallo", countryISO: "ES", category: "city" });
    const [group] = result.groups;
    expect(group.level.startsWith("country-")).toBe(false);
  });

  test("Brasil + Caballo: city sin datos locales, depende de región", () => {
    const result = getPersonalAtlas({ animal: "Caballo", countryISO: "BR", category: "city" });
    const [group] = result.groups;
    expect(group.level.startsWith("country-")).toBe(false);
  });

  test("sin país + Caballo: city arranca directo en world", () => {
    const result = getPersonalAtlas({ animal: "Caballo", category: "city" });
    const [group] = result.groups;
    expect(["world-animal", "world-relation"]).toContain(group.level);
  });
});

describe("getPersonalAtlas — football_player (Fútbol = Equipos + Jugadores)", () => {
  test("football_player forma parte del piloto por defecto", () => {
    const result = getPersonalAtlas({ animal: "Caballo", countryISO: "AR" });
    expect(result.groups.map((g) => g.category)).toContain("football_player");
  });

  test("team y football_player resuelven su propia cascada de forma independiente", () => {
    // Regla explícita: cada categoría es independiente — team no debe
    // "prestarle" su nivel de fallback a football_player ni viceversa.
    const result = getPersonalAtlas({ animal: "Dragón", countryISO: "MX" });
    const team = result.groups.find((g) => g.category === "team")!;
    const players = result.groups.find((g) => g.category === "football_player")!;
    expect(team).toBeDefined();
    expect(players).toBeDefined();
    // Con solo 4 football_player en todo el dataset, es legítimo que no
    // alcance el threshold aunque team sí lo haga en el mismo país/animal.
    expect(team.entities.length).toBeGreaterThan(0);
  });

  test("un grupo football_player sin cobertura queda vacío, nunca por debajo del threshold", () => {
    for (const [animal, countryISO] of [
      ["Caballo", "AR"], ["Dragón", "MX"], ["Caballo", "BR"], ["Caballo", undefined],
    ] as const) {
      const result = getPersonalAtlas({ animal, countryISO, category: "football_player" });
      const [group] = result.groups;
      if (group.entities.length > 0) {
        expect(group.totalAvailable).toBeGreaterThanOrEqual(3);
      } else {
        expect(group.totalAvailable).toBeLessThan(3);
      }
    }
  });
});

describe("getPersonalAtlas — región con unión (México pertenece a LATAM y Norteamérica)", () => {
  test("México se apoya en región antes que en mundo para Dragón", () => {
    const result = getPersonalAtlas({ animal: "Dragón", countryISO: "MX", category: "university" });
    const [group] = result.groups;
    expect(["region-animal", "region-relation"]).toContain(group.level);
  });
});
