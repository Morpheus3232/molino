import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi } from "vitest";
import ProfileHub from "@/components/profile/ProfileHub";
import ProfileCoordinatesSection from "@/components/profile/ProfileCoordinatesSection";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import { ARCHETYPES } from "@/lib/data";
import type { UserProfile } from "@/types/user";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// Mock framer-motion to render children directly in tests
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: any) => <div>{children}</div>,
      section: ({ children, ...props }: any) => <section>{children}</section>,
      article: ({ children, ...props }: any) => <article>{children}</article>,
      nav: ({ children, ...props }: any) => <nav>{children}</nav>,
    },
  };
});

const PROFILE_LP4: UserProfile = {
  ...calculateUserProfile("Franco", "1990-06-15"),
  birthPlace: "Argentina",
  goal: "life",
  interests: [],
  onboardingStep: 4,
  completedSections: ["identity"],
  theme: "light",
  language: "es",
  notifications: true,
  cycles: { personalYear: 4, personalMonth: 6, personalDay: 3 },
};

// 1990-09-08 -> 1+9+9+0 + 0+9 + 0+8 = 36 -> 3+6 = 9 (Life Path 9)
const PROFILE_LP9: UserProfile = {
  ...calculateUserProfile("Camila", "1990-09-08"),
  birthPlace: "Argentina",
  goal: "life",
  interests: [],
  onboardingStep: 4,
  completedSections: ["identity"],
  theme: "light",
  language: "es",
  notifications: true,
  cycles: { personalYear: 9, personalMonth: 9, personalDay: 9 },
};

describe("Arquetipo del 9 — El Camaleón", () => {
  test("ARCHETYPES[9] se llama EL CAMALEÓN / EL MÍSTICO", () => {
    expect(ARCHETYPES[9].name).toContain("CAMALEÓN");
    expect(ARCHETYPES[9].name).not.toContain("ADAPTADOR");
  });

  test("Perfil con Camino de Vida 9 renderiza El Camaleón", () => {
    render(<ProfileHub profile={PROFILE_LP9} />);
    expect(screen.getAllByText(/El Camaleón/i).length).toBeGreaterThan(0);
  });
});

describe("ProfileHub — Hero Editorial y Tríada Simbólica", () => {
  test("Hero muestra la tríada simbólica en display: Camino de Vida, Sol, Zodíaco Chino con Polaridad", () => {
    render(<ProfileHub profile={PROFILE_LP4} />);

    // Line 1: Camino de Vida + Arquetipo
    expect(screen.getByRole("heading", { level: 1, name: /Camino de Vida 4 · El Constructor/i })).toBeInTheDocument();

    // Line 2: Sol en Géminis
    expect(screen.getAllByText(/Sol en Géminis/i).length).toBeGreaterThan(0);

    // Line 3: Caballo · Metal · Yang
    expect(screen.getByText(/Caballo · Metal · Yang/i)).toBeInTheDocument();

    // Local calculation & birth date
    expect(screen.getByText(/Naciste el 15 de junio de 1990/i)).toBeInTheDocument();
    expect(screen.getByText(/Calculado 100% localmente en tu dispositivo/i)).toBeInTheDocument();
  });
});

describe("ProfileCoordinatesSection — Los Cuatro Pilares", () => {
  test("renderiza los 4 pilares: Numerología, Astrología, Zodíaco Chino y Ciclos", () => {
    render(<ProfileCoordinatesSection profile={PROFILE_LP4} />);

    // Pilar 1: Numerología
    expect(screen.getByText(/NUMEROLOGÍA PITAGÓRICA/i)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Camino de Vida 4/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /El Constructor/i })).toBeInTheDocument();

    // Pilar 2: Astrología
    expect(screen.getByText(/ASTROLOGÍA/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /Sol en Géminis/i })).toBeInTheDocument();

    // Pilar 3: Zodíaco Chino
    expect(screen.getByText(/ZODÍACO CHINO/i)).toBeInTheDocument();
    expect(screen.getByText(/Tus dos amigos \(三合 San He\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Tu energía opuesta \(六冲 Liu Chong\)/i)).toBeInTheDocument();

    // Pilar 4: Ciclos
    expect(screen.getByText(/CICLOS DE TIEMPO/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /Año Personal 4/i })).toBeInTheDocument();
  });
});
