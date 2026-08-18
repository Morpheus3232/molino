import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProfileShareCard from "@/components/profile/ProfileShareCard";
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
    lifePath: 7,
    sunSign: "Virgo",
    sunSignInfo: { sign: "Virgo", element: "Tierra", modality: "Mutable" },
    chineseZodiac: "Gato",
    chineseZodiacInfo: { animal: "Gato", element: "Metal" },
    element: "Tierra",
    modality: "Mutable",
    luckyNumber: 11,
    archetype: "El Investigador",
    archetypeInfo: {},
    cycles: { personalYear: 3, personalMonth: 1, personalDay: 1 },
    recommendations: { strengths: [], challenges: [], practices: [] },
    ...fields,
  };
}

describe("ProfileShareCard — render smoke test", () => {
  it("renderiza sin crashear en modo completo (panel), las 4 variantes", () => {
    const profile = profileWith({ lifePath: 5, element: "Tierra" }); // dispara tensión real
    for (const variant of ["complete", "pattern", "tension", "year"] as const) {
      const { unmount } = render(<ProfileShareCard profile={profile} variant={variant} />);
      expect(screen.getByText("molino.app")).toBeDefined();
      expect(screen.getAllByText(/Compartir/i).length).toBeGreaterThanOrEqual(1);
      unmount();
    }
  });

  it("renderiza sin crashear en modo compact (solo ícono, card oculta)", () => {
    const profile = profileWith({});
    render(<ProfileShareCard profile={profile} variant="pattern" compact />);
    expect(screen.getByRole("button", { name: /compartir tu patrón central/i })).toBeDefined();
  });
});
