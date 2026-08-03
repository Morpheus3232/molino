import { describe, it, expect } from "vitest";
import { analyzeTiming } from "../timingEngine";
import type { UserProfile } from "@/types/user";

// generateRecommendedWindow() recibía `intention` pero nunca lo usaba: dos
// consultas con propósitos distintos (ej. "iniciar un proyecto" vs. "firmar
// un acuerdo") en la misma fecha/perfil leían la recomendación genérica,
// idéntica salvo por score. Esto verifica que la intención ahora se refleja
// en el texto.
function profileWith(fields: Partial<UserProfile>): UserProfile {
  return {
    name: "",
    birthDate: "1990-06-15",
    birthPlace: "",
    goal: "life",
    interests: [],
    onboardingStep: 1,
    completedSections: [],
    theme: "light",
    language: "es",
    notifications: true,
    lifePath: 4,
    sunSign: "Géminis",
    sunSignInfo: { sign: "Géminis", element: "Aire", modality: "Mutable" },
    chineseZodiac: "Caballo",
    chineseZodiacInfo: { animal: "Caballo", element: "Metal" },
    element: "Fuego",
    modality: "Mutable",
    luckyNumber: 1,
    archetype: "El Constructor",
    archetypeInfo: {},
    cycles: { personalYear: 4, personalMonth: 1, personalDay: 1 },
    recommendations: { strengths: [], challenges: [], practices: [] },
    ...fields,
  };
}

describe("analyzeTiming — recommendedWindow refleja la intención real", () => {
  it("misma fecha/perfil, intención distinta → recommendedWindow distinto", () => {
    const profile = profileWith({});
    const date = new Date("2026-08-10");

    const startProject = analyzeTiming(profile, date, "start_project").recommendedWindow;
    const signAgreement = analyzeTiming(profile, date, "sign_agreement").recommendedWindow;

    expect(startProject).not.toBe(signAgreement);
  });

  it("recommendedWindow nombra la intención en español, no un texto ciego al propósito", () => {
    const profile = profileWith({});
    const date = new Date("2026-08-10");

    const result = analyzeTiming(profile, date, "publish_something").recommendedWindow;
    expect(result.toLowerCase()).toContain("publicar algo");
  });
});
