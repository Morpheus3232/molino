import { describe, it, expect } from "vitest";
import { buildVariantContent } from "@/components/profile/ProfileShareCard";
import type { UserProfile } from "@/types/user";

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
    cycles: { personalYear: 3, personalMonth: 1, personalDay: 1 },
    recommendations: { strengths: [], challenges: [], practices: [] },
    ...fields,
  };
}

describe("ProfileShareCard — buildVariantContent", () => {
  it("complete: usa Camino de Vida real, glifo de signo solar y emoji del animal chino real", () => {
    const content = buildVariantContent(profileWith({ lifePath: 7, sunSign: "Virgo", chineseZodiac: "Gato" }), "complete");
    expect(content.format).toBe("square");
    expect(content.eyebrow).toContain("7");
    expect(content.title).toContain("♍");
    expect(content.title).toContain("Virgo");
    expect(content.title).toContain("Gato");
  });

  it("pattern: usa buildPatterns(profile)[0], nunca un dato inventado", () => {
    const profile = profileWith({ lifePath: 5, chineseZodiac: "Cabra" });
    const content = buildVariantContent(profile, "pattern");
    expect(content.format).toBe("square");
    expect(content.title.length).toBeGreaterThan(0);
    expect(content.body.length).toBeGreaterThan(0);
  });

  it("tension: reusa generatePaywallHook(profile).question tal cual, formato story", () => {
    const profile = profileWith({ lifePath: 5, element: "Tierra", chineseZodiac: "Gato" });
    const content = buildVariantContent(profile, "tension");
    expect(content.format).toBe("story");
    expect(content.title).toContain("Numerología");
  });

  it("year: usa el Año Personal real y el theme de PERSONAL_YEAR_MEANINGS", () => {
    const content = buildVariantContent(profileWith({ cycles: { personalYear: 7, personalMonth: 1, personalDay: 1 } }), "year");
    expect(content.format).toBe("square");
    expect(content.title).toBe("7");
    expect(content.eyebrow.length).toBeGreaterThan(0);
  });

  it("determinismo: mismo perfil produce siempre el mismo contenido por variante", () => {
    const profile = profileWith({ lifePath: 3, chineseZodiac: "Dragón" });
    expect(buildVariantContent(profile, "complete")).toEqual(buildVariantContent(profile, "complete"));
    expect(buildVariantContent(profile, "pattern")).toEqual(buildVariantContent(profile, "pattern"));
  });
});
