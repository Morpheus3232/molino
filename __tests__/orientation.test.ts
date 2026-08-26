import { describe, test, expect } from "vitest";
import type { UserProfile } from "@/types/user";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import { buildMomentState } from "@/lib/engines/synthesisEngine";
import { buildOrientation } from "@/lib/utils/orientation";

const TEST_PROFILE: UserProfile = {
  id: "test-orientation",
  name: "Lucía Fernández",
  birthDate: "1990-04-18",
  birthPlace: "Buenos Aires",
  birthTime: "14:30",
  goal: "growth",
  interests: [],
  onboardingStep: 4,
  completedSections: ["identity", "world"],
  theme: "light",
  language: "es",
  notifications: true,
  lifePath: 5,
  sunSign: "Aries",
  sunSignInfo: { sign: "Aries", element: "Fuego", modality: "Cardinal", symbol: "♈" },
  chineseZodiac: "Caballo",
  chineseZodiacInfo: { animal: "Caballo", element: "Fuego", emoji: "🐴" },
  element: "Fuego",
  modality: "Cardinal",
  luckyNumber: 49,
  archetype: "El Nómada",
  archetypeInfo: { name: "El Nómada", color: "#C49A2A", description: "", quote: "", keywords: [], strengths: [], challenges: [] },
  expressionNumber: 3,
  personalityNumber: 5,
  cycles: { personalYear: 3, personalMonth: 7, personalDay: 5 },
  recommendations: { strengths: [], challenges: [], practices: [] },
};

const FIXED_DATE = new Date("2026-07-31T12:00:00");

describe("buildOrientation", () => {
  test("is deterministic for the same profile and date", () => {
    const energy1 = calculateDailyEnergy(TEST_PROFILE, new Date(FIXED_DATE));
    const energy2 = calculateDailyEnergy(TEST_PROFILE, new Date(FIXED_DATE));
    const moment1 = buildMomentState(TEST_PROFILE, energy1.overallScore, energy1.theme);
    const moment2 = buildMomentState(TEST_PROFILE, energy2.overallScore, energy2.theme);
    const a = buildOrientation(energy1, moment1);
    const b = buildOrientation(energy2, moment2);
    expect(a).toEqual(b);
  });

  test("uses the daily energy theme as its headline", () => {
    const energy = calculateDailyEnergy(TEST_PROFILE, new Date(FIXED_DATE));
    const moment = buildMomentState(TEST_PROFILE, energy.overallScore, energy.theme);
    const orientation = buildOrientation(energy, moment);
    expect(orientation.theme).toBe(energy.theme);
    expect(orientation.expression).toBe(energy.description);
  });

  test("always produces a single actionable orientation line", () => {
    const energy = calculateDailyEnergy(TEST_PROFILE, new Date(FIXED_DATE));
    const moment = buildMomentState(TEST_PROFILE, energy.overallScore, energy.theme);
    const orientation = buildOrientation(energy, moment);
    expect(orientation.orientation.length).toBeGreaterThan(20);
    expect(orientation.orientation.endsWith(".")).toBe(true);
  });

  test("formats the date in editorial Spanish", () => {
    const energy = calculateDailyEnergy(TEST_PROFILE, new Date(FIXED_DATE));
    const moment = buildMomentState(TEST_PROFILE, energy.overallScore, energy.theme);
    const orientation = buildOrientation(energy, moment);
    expect(orientation.dateLabel).toMatch(/\d{1,2} de [a-z]+/);
  });

  test("includes focus, moon phase and personal year as evidence", () => {
    const energy = calculateDailyEnergy(TEST_PROFILE, new Date(FIXED_DATE));
    const moment = buildMomentState(TEST_PROFILE, energy.overallScore, energy.theme);
    const orientation = buildOrientation(energy, moment);
    const labels = orientation.evidence.map((e) => e.label);
    expect(labels).toContain("Foco");
    expect(labels).toContain("Luna");
    expect(labels).toContain("Año personal");
  });

  test("orientation keyed to the personal day theme stays within known set", () => {
    for (let i = 1; i <= 9; i++) {
      const profile = { ...TEST_PROFILE, cycles: { ...TEST_PROFILE.cycles, personalDay: i } };
      const energy = calculateDailyEnergy(profile, new Date(FIXED_DATE));
      const moment = buildMomentState(profile, energy.overallScore, energy.theme);
      const orientation = buildOrientation(energy, moment);
      expect(orientation.orientation.length).toBeGreaterThan(20);
    }
  });
});
