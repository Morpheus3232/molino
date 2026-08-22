import { describe, test, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDailyEnergy } from "../useDailyEnergy";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";

// Fase 6A (2026-08-22): dailyAdvice ahora deriva de buildOrientation()
// (lib/utils/orientation.ts) en vez de una plantilla concatenada ad-hoc.
// Regresión encontrada durante la implementación: sin perfil, personalYear
// se fuerza a 0 solo para no ramificar otros componentes — eso NO debe
// filtrarse a la evidencia visible como "Año personal: 0" (dato falso).

describe("useDailyEnergy — Consejo del Momento (Fase 6A)", () => {
  test("sin perfil: dailyAdvice existe y NO incluye evidencia de 'Año personal'", () => {
    const { result } = renderHook(() => useDailyEnergy(null, new Date("2026-08-22")));
    expect(result.current?.dailyAdvice).toBeTruthy();
    expect(result.current?.orientationEvidence.find((e) => e.label === "Año personal")).toBeUndefined();
    expect(result.current?.orientationEvidence.find((e) => e.label === "Luna")).toBeTruthy();
  });

  test("con perfil: dailyAdvice existe y SÍ incluye 'Año personal' y 'Foco'", () => {
    const profile = calculateUserProfile("Test", "1990-06-15");
    const { result } = renderHook(() => useDailyEnergy(profile, new Date("2026-08-22")));
    expect(result.current?.dailyAdvice).toBeTruthy();
    expect(result.current?.orientationEvidence.find((e) => e.label === "Año personal")).toBeTruthy();
    expect(result.current?.orientationEvidence.find((e) => e.label === "Foco")).toBeTruthy();
  });
});
