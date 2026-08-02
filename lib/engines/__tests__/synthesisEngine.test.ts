import { describe, it, expect } from "vitest";
import { buildPersonalCode } from "../synthesisEngine";
import type { UserProfile } from "@/types/user";

// buildPersonalCode es el único punto de entrada público que expone el
// nombre/significado de cada número (getNumberName/getNumberMeaning son
// privadas). Estos fixtures solo pisan los 4 campos numéricos que esa
// función lee — el resto del shape de UserProfile no le importa.
function profileWith(fields: Partial<UserProfile>): UserProfile {
  return {
    name: "",
    birthDate: "1990-01-09",
    birthPlace: "",
    goal: "life",
    interests: [],
    onboardingStep: 1,
    completedSections: [],
    theme: "light",
    language: "es",
    notifications: true,
    lifePath: 1,
    sunSign: "Capricornio",
    sunSignInfo: { sign: "Capricornio", element: "Tierra", modality: "Cardinal" },
    chineseZodiac: "Caballo",
    chineseZodiacInfo: { animal: "Caballo", element: "Metal" },
    element: "Tierra",
    modality: "Cardinal",
    luckyNumber: 11,
    archetype: "El Líder",
    archetypeInfo: {},
    cycles: { personalYear: 1, personalMonth: 1, personalDay: 1 },
    recommendations: { strengths: [], challenges: [], practices: [] },
    ...fields,
  };
}

describe("buildPersonalCode — FASE 1D-2C: Personalidad 9 ≠ Camino de Vida 9", () => {
  it("Personalidad 9 (día 9/18/27) representa capacidad de adaptación, no 'El Filósofo'/'Generosidad'", () => {
    const code = buildPersonalCode(profileWith({ personalityNumber: 9 }));
    expect(code.personality.number).toBe(9);
    expect(code.personality.name).toBe("El Adaptador");
    expect(code.personality.meaning).toBe("Capacidad de adaptación");
  });

  it("Camino de Vida 9 NO cambia como consecuencia del cambio de Personalidad", () => {
    const code = buildPersonalCode(profileWith({ lifePath: 9 }));
    expect(code.lifePath.number).toBe(9);
    expect(code.lifePath.name).toBe("El Filósofo");
    expect(code.lifePath.meaning).toBe("Compasión y sabiduría");
  });

  it("Expresión 9 y Alma 9 NO cambian como consecuencia del cambio de Personalidad", () => {
    const code = buildPersonalCode(profileWith({ expressionNumber: 9, soulNumber: 9 }));
    expect(code.expression.name).toBe("El Filósofo");
    expect(code.expression.meaning).toBe("Humanitarismo");
    expect(code.soul.name).toBe("El Filósofo");
    expect(code.soul.meaning).toBe("Servicio al todo");
  });

  it("Personalidad 7 conserva 'Misterio' intacto", () => {
    const code = buildPersonalCode(profileWith({ personalityNumber: 7 }));
    expect(code.personality.name).toBe("El Investigador");
    expect(code.personality.meaning).toBe("Misterio");
  });

  it("Camino de Vida 7 conserva su nombre/significado propio (no 'Misterio')", () => {
    const code = buildPersonalCode(profileWith({ lifePath: 7 }));
    expect(code.lifePath.name).toBe("El Investigador");
    expect(code.lifePath.meaning).toBe("Búsqueda de verdad");
  });
});
