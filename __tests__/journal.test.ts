import { describe, it, expect, beforeEach } from "vitest";
import {
  type JournalEntry,
  type JournalMood,
  MOOD_CONFIG,
  QUICK_TAGS,
} from "@/types/journal";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import type { UserProfile } from "@/types/user";

describe("Journal Models and Mood Configuration", () => {
  it("defines 5 mood levels with valid emoji and labels", () => {
    const moods: JournalMood[] = [1, 2, 3, 4, 5];
    for (const mood of moods) {
      const cfg = MOOD_CONFIG[mood];
      expect(cfg).toBeDefined();
      expect(cfg.label).toBeTruthy();
      expect(cfg.emoji).toBeTruthy();
      expect(cfg.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it("provides comprehensive quick tags for self-knowledge", () => {
    expect(QUICK_TAGS.length).toBeGreaterThanOrEqual(5);
    expect(QUICK_TAGS).toContain("Trabajo");
    expect(QUICK_TAGS).toContain("Relaciones");
    expect(QUICK_TAGS).toContain("Decisiones");
    expect(QUICK_TAGS).toContain("Creatividad");
  });

  it("calculates cycle context for an entry using user profile", () => {
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
      element: "Fuego",
      cycles: { personalYear: 7, personalMonth: 3, personalDay: 5 },
      recommendations: { strengths: [], challenges: [], practices: [] },
    };

    const targetDate = new Date("2026-08-14T12:00:00");
    const energy = calculateDailyEnergy(mockProfile as UserProfile, targetDate);

    expect(energy.personalDay).toBeGreaterThanOrEqual(1);
    expect(energy.theme).toBeTruthy();
    expect(energy.overallScore).toBeGreaterThanOrEqual(1);
    expect(energy.moonPhase).toBeDefined();
  });
});

describe("Journal Filtering Logic", () => {
  const sampleEntries: JournalEntry[] = [
    {
      id: "j1",
      date: "2026-08-10",
      content: "Tuve una reunión importante de trabajo y tomé una decisión clara.",
      mood: 4,
      tags: ["Trabajo", "Decisiones"],
      cycleContext: {
        dayEnergy: { personalDay: 1, theme: "Iniciación" },
        yearCycle: { personalYear: 7 },
      },
      createdAt: "2026-08-10T10:00:00Z",
    },
    {
      id: "j2",
      date: "2026-08-11",
      content: "Día de descanso, meditación y lectura reflexiva.",
      mood: 3,
      tags: ["Salud", "Introspección"],
      cycleContext: {
        dayEnergy: { personalDay: 2, theme: "Cooperación" },
        yearCycle: { personalYear: 7 },
      },
      createdAt: "2026-08-11T12:00:00Z",
    },
    {
      id: "j3",
      date: "2026-08-12",
      content: "Sentí cierta tensión en las relaciones con el equipo pero pudimos conversar.",
      mood: 2,
      tags: ["Relaciones", "Trabajo"],
      cycleContext: {
        dayEnergy: { personalDay: 3, theme: "Expresión" },
        yearCycle: { personalYear: 7 },
      },
      createdAt: "2026-08-12T15:00:00Z",
    },
  ];

  it("filters entries by mood correctly", () => {
    const mood4Entries = sampleEntries.filter((e) => e.mood === 4);
    expect(mood4Entries.length).toBe(1);
    expect(mood4Entries[0].id).toBe("j1");
  });

  it("filters entries by tag correctly", () => {
    const trabajoEntries = sampleEntries.filter((e) => e.tags.includes("Trabajo"));
    expect(trabajoEntries.length).toBe(2);
  });

  it("searches content text correctly", () => {
    const search = "meditación";
    const found = sampleEntries.filter((e) =>
      e.content.toLowerCase().includes(search.toLowerCase())
    );
    expect(found.length).toBe(1);
    expect(found[0].id).toBe("j2");
  });
});
