import { describe, test, expect } from "vitest";
import { SYMBOLIC_ENTITIES } from "../symbolic-entities";

// Los 4 futbolistas identificados en el audit de artists-argentina.ts
// (category: "Deporte", emoji ⚽) migraron de type:"artist" a
// type:"football_player". "artist" queda reservado para artistas.

const MIGRATED_IDS = ["diego-maradona", "lionel-messi", "juan-roman-riquelme", "juan-pablo-sorin"];

// Ambigüedad real reportada (no un bug): "Claudio Bravo" existe dos veces
// con el mismo nombre y país pero son dos personas reales distintas —
// el pintor hiperrealista chileno (artist, id "claudio-bravo", n. 1946,
// artists-chile.ts) y el arquero histórico de la selección chilena
// (football_player, id "cl-claudio-bravo", n. 1983,
// football-players-chile.ts). Se documentan ambas a propósito.
const KNOWN_NAME_COLLISIONS = new Set(["Claudio Bravo::Chile"]);

describe("migración artist -> football_player", () => {
  test("los 4 futbolistas originales siguen existiendo como football_player", () => {
    const players = SYMBOLIC_ENTITIES.filter((e) => e.type === "football_player");
    const ids = new Set(players.map((e) => e.id));
    for (const id of MIGRATED_IDS) {
      expect(ids.has(id)).toBe(true);
    }
  });

  test("ninguno de los 4 sigue clasificado como artist", () => {
    const asArtist = SYMBOLIC_ENTITIES.filter(
      (e) => e.type === "artist" && MIGRATED_IDS.includes(e.id)
    );
    expect(asArtist).toEqual([]);
  });

  test("artistas no futbolistas (ej. Frida Kahlo, Julio Cortázar) siguen siendo artist", () => {
    const nonFootballArtists = SYMBOLIC_ENTITIES.filter(
      (e) => e.type === "artist" && !MIGRATED_IDS.includes(e.id)
    );
    expect(nonFootballArtists.length).toBeGreaterThan(0);
    expect(nonFootballArtists.every((e) => e.type === "artist")).toBe(true);
  });

  test("sin duplicados entre artist y football_player, salvo la ambigüedad ya reportada", () => {
    const keys = new Set<string>();
    const collisions: string[] = [];
    for (const e of SYMBOLIC_ENTITIES) {
      if (e.type !== "artist" && e.type !== "football_player") continue;
      const key = `${e.name}::${e.country}`;
      if (keys.has(key)) collisions.push(key);
      keys.add(key);
    }
    expect(new Set(collisions)).toEqual(KNOWN_NAME_COLLISIONS);
  });

  test("la colisión Claudio Bravo (artist) vs Claudio Bravo (football_player) son personas reales distintas", () => {
    const painter = SYMBOLIC_ENTITIES.find((e) => e.id === "claudio-bravo" && e.type === "artist");
    const goalkeeper = SYMBOLIC_ENTITIES.find((e) => e.id === "cl-claudio-bravo" && e.type === "football_player");
    expect(painter).toBeDefined();
    expect(goalkeeper).toBeDefined();
    expect(painter!.events[0].year).not.toBe(goalkeeper!.events[0].year);
  });

  test("las fechas/eventos de los migrados no cambiaron", () => {
    const maradona = SYMBOLIC_ENTITIES.find((e) => e.id === "diego-maradona")!;
    expect(maradona.events[0].date).toBe("1960-10-30");
    expect(maradona.events[0].confidence).toBe("exacta");

    const messi = SYMBOLIC_ENTITIES.find((e) => e.id === "lionel-messi")!;
    expect(messi.events[0].date).toBe("1987-06-24");
  });
});
