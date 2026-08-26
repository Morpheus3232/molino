import { describe, it, expect } from "vitest";
import { generateChatContextualHook } from "../chatContextualHook";
import type { UserProfile } from "@/types/user";

describe("generateChatContextualHook", () => {
  const mockProfile: UserProfile = {
    birthDate: "1990-08-10",
    birthPlace: "Buenos Aires",
    goal: "growth",
    interests: [],
    onboardingStep: 3,
    completedSections: [],
    theme: "light",
    language: "es",
    notifications: true,
    lifePath: 4,
    sunSign: "Leo",
    sunSignInfo: { sign: "Leo", element: "Fuego", modality: "Fijo" },
    chineseZodiac: "Caballo",
    chineseZodiacInfo: { animal: "Caballo", element: "Metal" },
    element: "Fuego",
    modality: "Fijo",
    luckyNumber: 8,
    archetype: "El Creador",
    archetypeInfo: { keywords: ["brillo", "visibilidad", "generosidad"] },
    cycles: {
      personalYear: 4,
      personalMonth: 8,
      personalDay: 1,
    },
    recommendations: { strengths: [], challenges: [], practices: [] },
  };

  it("builds a contextual intro mentioning personal year, life path, and sun sign", () => {
    const hook = generateChatContextualHook(mockProfile);
    expect(hook.personalYear).toBe(4);
    expect(hook.yearCycleName).toBe("Ciclo de Cimiento");
    expect(hook.hookSentence).toContain("Año Personal 4");
    expect(hook.hookSentence).toContain("Ciclo de Cimiento");
    expect(hook.hookSentence).toContain("Camino de Vida 4");
    expect(hook.hookSentence).toContain("Sol en Leo");
    expect(hook.hookSentence).toContain("estructura y consolidación");
    expect(hook.suggestedStarters.length).toBeGreaterThanOrEqual(3);
  });
});
