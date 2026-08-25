import { describe, it, expect } from "vitest";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import { buildPrinciples, buildRules, buildPatterns } from "@/lib/engines/synthesisEngine";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import type { UserProfile } from "@/types/user";

const FECHAS = ["1990-05-14", "1994-01-08", "1985-11-02", "1972-12-31"];
const perfil = (d: string) => calculateUserProfile("", d) as UserProfile;

describe("áreas del día: el puntaje se puede reconstruir", () => {
  it("más factores a favor nunca dan menos puntaje", () => {
    for (const f of FECHAS) {
      const { areas } = calculateDailyEnergy(perfil(f));
      for (const area of Object.values(areas)) {
        expect(Array.isArray(area.reasons)).toBe(true);
        // El puntaje sube con la cantidad de factores; sin factores, la base.
        expect(area.score).toBeGreaterThanOrEqual(50);
        if ((area.reasons ?? []).length > 0) expect(area.score).toBeGreaterThan(50);
      }
    }
  });

  it("un área sin factores a favor queda en la base y sin reglas", () => {
    for (const f of FECHAS) {
      const { areas } = calculateDailyEnergy(perfil(f));
      for (const area of Object.values(areas)) {
        if ((area.reasons ?? []).length === 0) expect(area.score).toBe(50);
      }
    }
  });

  it("las razones son lenguaje llano, sin aritmética ni jerga interna", () => {
    for (const f of FECHAS) {
      const { areas } = calculateDailyEnergy(perfil(f));
      for (const area of Object.values(areas)) {
        for (const r of area.reasons ?? []) {
          expect(r.trim().length).toBeGreaterThan(0);
          expect(r).not.toMatch(/\(\+\d+\)/);        // sin "+15"
          expect(r.toLowerCase()).not.toContain("base"); // sin "Base 50"
          expect(r.toLowerCase()).not.toContain("día personal");
        }
      }
    }
  });
});

describe("principios: cada uno declara de dónde sale", () => {
  it("los tres traen source", () => {
    for (const f of FECHAS) {
      const p = perfil(f);
      const principios = buildPrinciples(buildRules(p), buildPatterns(p), p.archetypeInfo);
      expect(principios).toHaveLength(3);
      for (const pr of principios) {
        expect(pr.source.trim().length).toBeGreaterThan(0);
        expect(pr.body.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("el source no repite el cuerpo", () => {
    const p = perfil("1990-05-14");
    for (const pr of buildPrinciples(buildRules(p), buildPatterns(p), p.archetypeInfo)) {
      expect(pr.body).not.toContain(pr.source);
    }
  });
});
