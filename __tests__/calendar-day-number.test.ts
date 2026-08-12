import { describe, it, expect } from "vitest";
import {
  reduceDateNumber,
  getCalendarDayContent,
  reduceDayNumber,
} from "@/lib/numerology/calendar";
import { getDateVibration } from "@/lib/utils/dateVibration";

describe("reduceDateNumber (número del día — suma pitagórica de la fecha completa)", () => {
  it("reduce una fecha completa a un solo dígito", () => {
    expect(reduceDateNumber("2026-08-11")).toBe(2);
    expect(reduceDateNumber("2026-09-08")).toBe(9);
    expect(reduceDateNumber("2026-01-01")).toBe(3);
  });

  it("conserva los números maestros 11, 22, 28 y 33", () => {
    expect(reduceDateNumber("2026-08-19")).toBe(28);
    expect(reduceDateNumber("2026-08-28")).toBe(28);
  });

  it("usa la fecha completa, no solo el día del mes", () => {
    // El día 11 del 08-2026 suma 20 → 2; no corresponde el maestro 11 del día del mes.
    expect(reduceDateNumber("2026-08-11")).toBe(2);
    expect(reduceDayNumber(11)).toBe(11);
  });
});

describe("getDateVibration", () => {
  it("reduce la fecha completa y respeta los maestros 11/22/28/33", () => {
    expect(getDateVibration("2026-08-11").number).toBe(2);
    expect(getDateVibration("2026-08-19").number).toBe(28);
    expect(getDateVibration("2026-08-28").number).toBe(28);
  });
});

describe("getCalendarDayContent", () => {
  it("resuelve el contenido del día por la fecha completa", () => {
    const content = getCalendarDayContent("2026-08-11");
    expect(content.number).toBe(2);
    expect(content.master).toBe(false);
    expect(content.title).toBeTruthy();
  });
});
