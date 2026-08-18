import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProfileShareCard from "@/components/profile/ProfileShareCard";
import ProfileSharePanel from "@/components/profile/ProfileSharePanel";
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

  it("ProfileSharePanel oculta la variante 'tension' cuando el perfil no tiene tensión real", () => {
    // lifePath 2 no tiene pace inherente (getLifePathPace) → buildTensions vacío
    const profile = profileWith({ lifePath: 2, element: "Agua" });
    render(<ProfileSharePanel profile={profile} />);
    expect(screen.queryByRole("button", { name: /^Tensión$/i })).toBeNull();
    expect(screen.getByRole("button", { name: /Mapa completo/i })).toBeDefined();
  });

  it("ProfileSharePanel muestra la variante 'tension' cuando sí existe", () => {
    const profile = profileWith({ lifePath: 5, element: "Tierra" });
    render(<ProfileSharePanel profile={profile} />);
    expect(screen.getByRole("button", { name: /^Tensión$/i })).toBeDefined();
  });
});
