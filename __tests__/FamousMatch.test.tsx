import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FamousMatch from "@/components/profile/FamousMatch";
import type { UserProfile } from "@/types/user";

describe("FamousMatch Component", () => {
  const mockProfile: Partial<UserProfile> = {
    name: "Franco",
    birthDate: "1990-04-18",
    birthPlace: "Buenos Aires",
    goal: "life",
    interests: [],
    onboardingStep: 4,
    completedSections: ["identity"],
    theme: "light",
    language: "es",
    notifications: true,
    lifePath: 5,
    sunSign: "Aries",
    chineseZodiac: "Caballo",
    cycles: { personalYear: 7, personalMonth: 3, personalDay: 5 },
    recommendations: { strengths: [], challenges: [], practices: [] },
  };

  it("renders the FamousMatch section with matches", () => {
    render(<FamousMatch profile={mockProfile as UserProfile} />);

    expect(screen.getByText(/¿Con quién compartís tu mapa\?/i)).toBeDefined();
    expect(screen.getByText(/Sincronicidad Histórica/i)).toBeDefined();

    // Should find at least one match for Life Path 5 / Aries / Caballo (e.g. Marlon Brando, Vincent van Gogh, etc.)
    const matchesFound = screen.getAllByRole("heading", { level: 3 });
    expect(matchesFound.length).toBeGreaterThanOrEqual(1);
    expect(matchesFound.length).toBeLessThanOrEqual(8);
  });

  it("returns null when no profile or no match exists", () => {
    const { container } = render(<FamousMatch profile={{} as UserProfile} />);
    expect(container.firstChild).toBeNull();
  });
});
