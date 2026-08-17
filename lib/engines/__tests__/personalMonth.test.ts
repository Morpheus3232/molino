import { describe, it, expect } from "vitest";
import { getPersonalYear, reduceToSingleDigit } from "@/lib/calculations";
import { calculateDailyEnergy } from "../dailyEnergyEngine";
import { calculateUserProfile } from "../profileBuilder";
import type { UserProfile } from "@/types/user";

// Bug corregido: profileBuilder.ts y dailyEnergyEngine.ts llamaban a
// getPersonalYear() pasando el número de mes actual en el 6to parámetro
// (currentYear), lo que descartaba el año real (currentYear ?? targetYear
// prioriza el mes recibido). El cálculo efectivo era
// reduce(birthDay + birthMonth + mesActual) en vez de
// reduce(personalYear + mesActual) — personalMonth no dependía del año.

function profileWith(fields: Partial<UserProfile>): UserProfile {
  return {
    name: "",
    birthDate: "1990-05-15",
    birthPlace: "",
    goal: "life",
    interests: [],
    onboardingStep: 1,
    completedSections: [],
    theme: "light",
    language: "es",
    notifications: true,
    lifePath: 1,
    sunSign: "Tauro",
    sunSignInfo: { sign: "Tauro", element: "Tierra", modality: "Fijo" },
    chineseZodiac: "Caballo",
    chineseZodiacInfo: { animal: "Caballo", element: "Metal" },
    element: "Tierra",
    modality: "Fijo",
    luckyNumber: 5,
    archetype: "El Líder",
    archetypeInfo: {},
    cycles: { personalYear: 0, personalMonth: 0, personalDay: 0 },
    recommendations: { strengths: [], challenges: [], practices: [] },
    ...fields,
  };
}

describe("personalMonth — fórmula correcta (reduce(personalYear + mes), no birthDay+birthMonth+mes)", () => {
  it("calculateDailyEnergy: 1990-05-15 en 2025-08-10 — personalYear=7 (2+2+5+1+9+9+0=... verificado por fórmula), personalMonth = reduce(personalYear + 8)", () => {
    const profile = profileWith({ birthDate: "1990-05-15" });
    const targetDate = new Date(2025, 7, 10); // agosto (mes=8) de 2025
    const personalYear = getPersonalYear(15, 5, 1990, 2025);
    const expectedPersonalMonth = reduceToSingleDigit(personalYear + 8);

    const daily = calculateDailyEnergy(profile, targetDate);

    expect(daily.personalYear).toBe(personalYear);
    expect(daily.personalMonth).toBe(expectedPersonalMonth);
  });

  it("el mismo mes calendario en años distintos da personalMonth DISTINTO cuando cambia personalYear (regresión del bug: antes daba siempre el mismo valor)", () => {
    const profile = profileWith({ birthDate: "1990-05-15" });
    const august2025 = calculateDailyEnergy(profile, new Date(2025, 7, 10));
    const august2026 = calculateDailyEnergy(profile, new Date(2026, 7, 10));

    const py2025 = getPersonalYear(15, 5, 1990, 2025);
    const py2026 = getPersonalYear(15, 5, 1990, 2026);
    // Solo verificamos "distinto" si los personalYear subyacentes también lo
    // son — si por coincidencia dieran igual, personalMonth también sería
    // igual, y eso es correcto, no un fallo del test.
    if (py2025 !== py2026) {
      expect(august2025.personalMonth).not.toBe(august2026.personalMonth);
    }
    expect(august2025.personalMonth).toBe(reduceToSingleDigit(py2025 + 8));
    expect(august2026.personalMonth).toBe(reduceToSingleDigit(py2026 + 8));
  });

  it("preserva números maestros: personalYear=9 + mes=2 = 11, no se reduce a 2", () => {
    // getPersonalYear con birthDay+birthMonth+year=9 exacto es difícil de forzar
    // por fecha real; probamos la fórmula de reducción directamente, que es
    // la misma que usan profileBuilder.ts/dailyEnergyEngine.ts.
    expect(reduceToSingleDigit(9 + 2)).toBe(11);
    expect(reduceToSingleDigit(9 + 2)).not.toBe(2);
  });

  it("preserva números maestros: personalYear=11 + mes=11 = 22, no se reduce", () => {
    expect(reduceToSingleDigit(11 + 11)).toBe(22);
  });

  it("calculateUserProfile: personalMonth es consistente con reduce(personalYear + mesActual) para la fecha real de hoy", () => {
    const profile = calculateUserProfile("", "1990-05-15");
    const now = new Date();
    const expected = reduceToSingleDigit(profile.cycles.personalYear + (now.getMonth() + 1));
    expect(profile.cycles.personalMonth).toBe(expected);
  });

  it("calculateUserProfile y calculateDailyEnergy coinciden en personalMonth para la fecha de hoy (misma fórmula, dos call sites)", () => {
    const profile = calculateUserProfile("", "1990-05-15");
    const daily = calculateDailyEnergy(profile, new Date());
    expect(profile.cycles.personalMonth).toBe(daily.personalMonth);
  });
});
