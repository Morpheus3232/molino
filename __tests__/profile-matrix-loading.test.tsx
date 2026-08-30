import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi, afterEach, beforeEach } from "vitest";
import CalculationMatrix from "@/components/profile/CalculationMatrix";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import type { UserProfile } from "@/types/user";

// El perfil real del ejemplo del usuario: 1990-04-18 → Camino de Vida 5, Aries, Caballo Metal.
const PROFILE: UserProfile = {
  ...calculateUserProfile("", "1990-04-18"),
  birthPlace: "",
  goal: "life",
  interests: [],
  onboardingStep: 4,
  completedSections: ["identity"],
  theme: "light",
  language: "es",
  notifications: true,
};

// Fase 4: la pantalla se rediseñó (de "lluvia de código" Matrix sobre fondo
// oscuro a una tabla editorial etiqueta/valor sobre papel), así que cambian
// los strings. Lo que NO cambia —y es lo único que estos tests protegen— es la
// garantía de fondo: la pantalla muestra la aritmética REAL de ESTE perfil,
// nunca un dato de ejemplo.

async function revealAll() {
  // Las filas se revelan una a una con timers; avanzamos en pasos chicos
  // dándole a React chance de reprocesar hasta que aparezca la última (el
  // bloque del zodíaco chino).
  for (let i = 0; i < 60 && !screen.queryByText(/Caballo · Metal/); i++) {
    act(() => {
      vi.advanceTimersByTime(150);
    });
    await act(async () => {});
  }
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("CalculationMatrix — la cuenta real del mapa", () => {
  test("muestra los pasos reales de la reducción del Camino de Vida, no un dato de ejemplo", async () => {
    render(<CalculationMatrix profile={PROFILE} />);
    await revealAll();
    // Los dígitos de 1990-04-18 suman 32, y 3+2 = 5.
    expect(screen.getByText("1+9+9+0+0+4+1+8")).toBeInTheDocument();
    expect(screen.getByText("32")).toBeInTheDocument();
    expect(screen.getByText("3+2")).toBeInTheDocument();
    expect(screen.getByText("Camino de Vida")).toBeInTheDocument();
  });

  test("muestra el signo solar y el zodíaco chino reales del perfil", async () => {
    render(<CalculationMatrix profile={PROFILE} />);
    await revealAll();
    expect(screen.getByText("Aries")).toBeInTheDocument();
    expect(screen.getByText("Año 1990")).toBeInTheDocument();
    expect(screen.getByText("Caballo · Metal")).toBeInTheDocument();
  });

  test("atribuye cada resultado al sistema del que sale", async () => {
    render(<CalculationMatrix profile={PROFILE} />);
    await revealAll();
    expect(screen.getByText("Numerología")).toBeInTheDocument();
    expect(screen.getByText("Astrología")).toBeInTheDocument();
    expect(screen.getByText("Zodíaco chino")).toBeInTheDocument();
  });

  test("expone la fórmula: la cuenta se puede auditar en el código", async () => {
    render(<CalculationMatrix profile={PROFILE} />);
    const link = screen.getByRole("link", { name: /fórmula en github/i });
    expect(link).toHaveAttribute("href", expect.stringContaining("github.com"));
  });
});
