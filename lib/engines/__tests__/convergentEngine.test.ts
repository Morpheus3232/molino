import { describe, it, expect } from "vitest";
import { buildConvergence, BIRTH_DAY_PERSONALITY, getBirthDayPersonality } from "@/lib/engines/convergentEngine";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import type { UserProfile } from "@/types/user";

function perfil(birthDate: string): UserProfile {
  return calculateUserProfile("", birthDate) as UserProfile;
}

describe("convergentEngine", () => {
  it("devuelve las 5 capas y un conteo que es la cantidad real de coincidencias", () => {
    const c = buildConvergence(perfil("1990-05-14"));
    expect(c.layers).toHaveLength(5);
    expect(c.totalLayers).toBe(5);
    expect(c.convergentCount).toBe(c.matches.length);
  });

  it("no cuenta dos veces la misma coincidencia", () => {
    // El bug original sumaba `lifePath === personalYear` dos veces, con lo
    // que un perfil con esa sola alineación reportaba 2. Cada par de capas
    // puede aparecer una sola vez.
    for (const fecha of ["1990-05-14", "1985-11-02", "2000-01-01", "1972-07-19", "1966-03-30"]) {
      const { matches } = buildConvergence(perfil(fecha));
      const pares = matches.map((m) => [...m.between].sort().join("+"));
      expect(new Set(pares).size).toBe(pares.length);
    }
  });

  it("el nivel de resonancia se corresponde con el conteo", () => {
    for (const fecha of ["1990-05-14", "1985-11-02", "2000-01-01", "1972-07-19"]) {
      const { convergentCount, convergenceLevel } = buildConvergence(perfil(fecha));
      const esperado =
        convergentCount >= 3 ? "strong" : convergentCount >= 2 ? "moderate" : "low";
      expect(convergenceLevel).toBe(esperado);
    }
  });

  it("cada coincidencia trae la regla que la produjo", () => {
    const { matches } = buildConvergence(perfil("1990-05-14"));
    for (const m of matches) {
      expect(m.rule.trim().length).toBeGreaterThan(0);
      expect(m.label.trim().length).toBeGreaterThan(0);
      expect(m.between).toHaveLength(2);
      expect(m.between[0]).not.toBe(m.between[1]);
    }
  });

  it("el insight nombra las coincidencias en vez de describirlas en abstracto", () => {
    const c = buildConvergence(perfil("1990-05-14"));
    if (c.convergentCount > 0) {
      // Tiene que mencionar al menos una regla concreta, no solo "algunos
      // de tus patrones muestran alineación".
      const alguna = c.matches.some((m) => c.insight.includes(m.rule.toLowerCase()));
      expect(alguna).toBe(true);
    } else {
      expect(c.insight.length).toBeGreaterThan(0);
    }
  });

  it("es determinista: la misma fecha da el mismo resultado", () => {
    const a = buildConvergence(perfil("1990-05-14"));
    const b = buildConvergence(perfil("1990-05-14"));
    expect(a).toEqual(b);
  });

  it("no explota con una fecha sin datos derivables", () => {
    expect(() =>
      buildConvergence({ birthDate: "", lifePath: 0 } as unknown as UserProfile)
    ).not.toThrow();
  });

  it("la capa del día se presenta como personalidad, no como cumpleaños", () => {
    const { layers } = buildConvergence(perfil("1990-05-14"));
    const capa = layers.find((l) => l.id === "birthday");
    expect(capa?.name).toBe("Número de personalidad");
    // El nombre viejo describía de dónde sale el dato, no qué dice.
    expect(capa?.name.toLowerCase()).not.toContain("cumpleaños");
  });

  it("esa capa trae una lectura de rasgos, no una tautología", () => {
    const { layers } = buildConvergence(perfil("1990-05-14"));
    const capa = layers.find((l) => l.id === "birthday");
    expect(capa?.description.length).toBeGreaterThan(30);
    // No puede limitarse a repetir el número que ya está al lado.
    expect(capa?.description).not.toMatch(/^(Tu )?[Nn]úmero (de nacimiento|del día): \d+$/);
  });

  it("cubre todos los números alcanzables desde un día 1-31", () => {
    // Reducción a un dígito conservando maestros: 1-9, 11 y 22. Con días
    // hasta 31 el 33 no es alcanzable.
    for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22]) {
      expect(BIRTH_DAY_PERSONALITY[n]).toBeDefined();
      expect(getBirthDayPersonality(n).length).toBeGreaterThan(30);
    }
    expect(getBirthDayPersonality(99)).toBe("");
  });

  it("cada lectura nombra el rasgo y su costo", () => {
    // Una descripción sin contrapeso es un horóscopo. Todas tienen dos
    // oraciones o una coordinación explícita.
    for (const texto of Object.values(BIRTH_DAY_PERSONALITY)) {
      const tieneContrapeso = /(, y |, con |, a veces |, y el |, con la )/.test(texto);
      expect(tieneContrapeso).toBe(true);
    }
  });
});
