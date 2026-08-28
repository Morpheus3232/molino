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

async function revealAll() {
  // Las líneas de la cuenta se van revelando una a una con timers; avanzamos
  // los fake timers en pasos pequeños, dándole a React chance de reprocesar
  // cada render intermedio, hasta que la última línea (Elemento) quede visible.
  for (let i = 0; i < 60 && !screen.queryByText(/Elemento:/); i++) {
    act(() => {
      vi.advanceTimersByTime(300);
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

describe("CalculationMatrix — cuenta real del mapa", () => {
  test("muestra la fecha ingresada del perfil, no un dato de ejemplo", async () => {
    render(<CalculationMatrix profile={PROFILE} />);
    await revealAll();
    expect(screen.getByText("Fecha: 1990-04-18")).toBeInTheDocument();
  });

  test("muestra los pasos reales de la reducción del Camino de Vida", async () => {
    render(<CalculationMatrix profile={PROFILE} />);
    await revealAll();
    // Los dígitos de 1990-04-18 suman 32, y 3+2 = 5.
    expect(screen.getByText("1. 1+9+9+0+0+4+1+8 = 32")).toBeInTheDocument();
    expect(screen.getByText("2. 3+2 = 5")).toBeInTheDocument();
    expect(screen.getByText("Camino de Vida: 5")).toBeInTheDocument();
  });

  test("muestra el signo solar y el zodíaco chino reales del perfil", async () => {
    render(<CalculationMatrix profile={PROFILE} />);
    await revealAll();
    expect(screen.getByText("→ Aries")).toBeInTheDocument();
    expect(screen.getByText("1990 → Caballo")).toBeInTheDocument();
    expect(screen.getByText("Elemento: Metal")).toBeInTheDocument();
  });
});
