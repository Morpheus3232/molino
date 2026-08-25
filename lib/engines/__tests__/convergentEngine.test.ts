import { describe, it, expect } from "vitest";
import { buildConvergence } from "@/lib/engines/convergentEngine";
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
});
