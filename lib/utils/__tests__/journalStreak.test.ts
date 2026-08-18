import { describe, it, expect } from "vitest";
import { computeJournalStreak, findEntryForDate } from "../journalStreak";
import type { JournalEntry } from "@/types/journal";

function entryOn(date: string): JournalEntry {
  return {
    id: `journal-${date}`,
    date,
    content: "reflexión",
    mood: 3,
    tags: [],
    cycleContext: {},
    createdAt: `${date}T12:00:00.000Z`,
  };
}

describe("computeJournalStreak", () => {
  const today = new Date("2026-08-18T12:00:00");

  it("0 si no hay entradas", () => {
    expect(computeJournalStreak([], today)).toBe(0);
  });

  it("0 si la racha está cortada (última entrada no es hoy ni ayer)", () => {
    const entries = [entryOn("2026-08-15"), entryOn("2026-08-14")];
    expect(computeJournalStreak(entries, today)).toBe(0);
  });

  it("cuenta días consecutivos terminando hoy", () => {
    const entries = [entryOn("2026-08-18"), entryOn("2026-08-17"), entryOn("2026-08-16")];
    expect(computeJournalStreak(entries, today)).toBe(3);
  });

  it("sigue activa si la última entrada fue ayer (todavía no escribió hoy)", () => {
    const entries = [entryOn("2026-08-17"), entryOn("2026-08-16")];
    expect(computeJournalStreak(entries, today)).toBe(2);
  });

  it("se corta en el primer hueco, no cuenta días no consecutivos de más atrás", () => {
    const entries = [entryOn("2026-08-18"), entryOn("2026-08-17"), entryOn("2026-08-10")];
    expect(computeJournalStreak(entries, today)).toBe(2);
  });

  it("varias entradas el mismo día cuentan como un solo día de racha", () => {
    const entries = [
      { ...entryOn("2026-08-18"), id: "a" },
      { ...entryOn("2026-08-18"), id: "b" },
      entryOn("2026-08-17"),
    ];
    expect(computeJournalStreak(entries, today)).toBe(2);
  });
});

describe("findEntryForDate", () => {
  it("encuentra la entrada de una fecha exacta", () => {
    const entries = [entryOn("2026-08-18"), entryOn("2026-08-17")];
    expect(findEntryForDate(entries, "2026-08-17")?.id).toBe("journal-2026-08-17");
  });

  it("undefined si no hay entrada para esa fecha", () => {
    expect(findEntryForDate([entryOn("2026-08-17")], "2026-08-18")).toBeUndefined();
  });
});
