import { describe, it, expect } from "vitest";
import { computeMoodInsights } from "../journalInsights";
import type { JournalEntry } from "@/types/journal";

function entry(overrides: Partial<JournalEntry> & { mood: JournalEntry["mood"] }): JournalEntry {
  return {
    id: Math.random().toString(36),
    date: "2026-08-18",
    content: "x",
    tags: [],
    cycleContext: {},
    createdAt: "2026-08-18T12:00:00.000Z",
    ...overrides,
  };
}

describe("computeMoodInsights", () => {
  it("agrupa por tema del día y promedia el mood, ordenado de mayor a menor", () => {
    const entries = [
      entry({ mood: 5, cycleContext: { dayEnergy: { theme: "Expresión" } } }),
      entry({ mood: 3, cycleContext: { dayEnergy: { theme: "Expresión" } } }),
      entry({ mood: 2, cycleContext: { dayEnergy: { theme: "Introspección" } } }),
      entry({ mood: 4, cycleContext: { dayEnergy: { theme: "Introspección" } } }),
    ];
    const insights = computeMoodInsights(entries);
    expect(insights.byTheme).toEqual([
      { label: "Expresión", avgMood: 4, count: 2 },
      { label: "Introspección", avgMood: 3, count: 2 },
    ]);
  });

  it("descarta grupos con una sola entrada (no es un patrón)", () => {
    const entries = [
      entry({ mood: 5, cycleContext: { dayEnergy: { theme: "Único" } } }),
      entry({ mood: 3, cycleContext: { dayEnergy: { theme: "Repetido" } } }),
      entry({ mood: 4, cycleContext: { dayEnergy: { theme: "Repetido" } } }),
    ];
    const insights = computeMoodInsights(entries);
    expect(insights.byTheme).toEqual([{ label: "Repetido", avgMood: 3.5, count: 2 }]);
  });

  it("agrupa por fase lunar", () => {
    const entries = [
      entry({ mood: 4, cycleContext: { dayEnergy: { moonPhase: "Creciente" } } }),
      entry({ mood: 2, cycleContext: { dayEnergy: { moonPhase: "Creciente" } } }),
    ];
    const insights = computeMoodInsights(entries);
    expect(insights.byMoonPhase).toEqual([{ label: "Creciente", avgMood: 3, count: 2 }]);
  });

  it("agrupa por Año Personal con label legible", () => {
    const entries = [
      entry({ mood: 5, cycleContext: { yearCycle: { personalYear: 3 } } }),
      entry({ mood: 3, cycleContext: { yearCycle: { personalYear: 3 } } }),
    ];
    const insights = computeMoodInsights(entries);
    expect(insights.byPersonalYear).toEqual([{ label: "Año 3", avgMood: 4, count: 2 }]);
  });

  it("sin entradas o sin cycleContext, todos los grupos vacíos", () => {
    expect(computeMoodInsights([])).toEqual({ byTheme: [], byMoonPhase: [], byPersonalYear: [] });
    expect(computeMoodInsights([entry({ mood: 3 })])).toEqual({ byTheme: [], byMoonPhase: [], byPersonalYear: [] });
  });
});
