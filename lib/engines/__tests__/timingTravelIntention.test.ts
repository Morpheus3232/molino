import { describe, test, expect } from "vitest";
import { analyzeTiming, INTENTION_LABELS } from "../timingEngine";
import type { UserProfile } from "@/types/user";

// Fase 6A (2026-08-22): la auditoría encontró el motor de timing correcto
// (personalDay real) sin intención "viajar", y un segundo sistema paralelo
// (/semana, lib/utils/dateVibration.ts) con un cálculo genérico no
// personalizado para lo mismo. En vez de fusionar los dos motores, se agregó
// "travel" a timingEngine.ts — reusa 100% la infraestructura existente
// (Personal Day, luna, elemento), sin datos ni motor nuevo.

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
    lifePath: 5,
    sunSign: "Géminis",
    sunSignInfo: { sign: "Géminis", element: "Aire", modality: "Mutable" },
    chineseZodiac: "Caballo",
    chineseZodiacInfo: { animal: "Caballo", element: "Metal" },
    element: "Fuego",
    modality: "Mutable",
    luckyNumber: 1,
    archetype: "El Constructor",
    ...fields,
  } as UserProfile;
}

describe("timingEngine — intención 'travel'", () => {
  test("INTENTION_LABELS incluye 'Viajar'", () => {
    expect(INTENTION_LABELS.travel).toBe("Viajar");
  });

  test("analyzeTiming no rompe con la intención travel", () => {
    const profile = profileWith({});
    const result = analyzeTiming(profile, new Date("2026-09-05"), "travel");
    expect(result.intention).toBe("travel");
    expect(result.timingScore).toBeGreaterThanOrEqual(1);
    expect(result.timingScore).toBeLessThanOrEqual(100);
    expect(result.theme).toBe("Viajar");
  });
});
