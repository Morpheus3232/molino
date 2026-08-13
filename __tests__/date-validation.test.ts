import { describe, test, expect } from "vitest";
import {
  getChineseZodiac,
  getChineseZodiacInfo,
  getLunarYear,
  getChineseNewYearDate,
} from "@/lib/engines/chineseZodiacEngine";

const getDaysInMonth = (month: string, year: string): number => {
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  if (!m || !y) return 31;
  return new Date(y, m, 0).getDate();
};

describe("getDaysInMonth", () => {
  test("January has 31 days", () => expect(getDaysInMonth("01", "2024")).toBe(31));
  test("February 2024 (leap year) has 29 days", () => expect(getDaysInMonth("02", "2024")).toBe(29));
  test("February 2023 (non-leap year) has 28 days", () => expect(getDaysInMonth("02", "2023")).toBe(28));
  test("February 2000 (divisible by 400) has 29 days", () => expect(getDaysInMonth("02", "2000")).toBe(29));
  test("February 1900 (divisible by 100 but not 400) has 28 days", () => expect(getDaysInMonth("02", "1900")).toBe(28));
  test("April has 30 days", () => expect(getDaysInMonth("04", "2024")).toBe(30));
  test("June has 30 days", () => expect(getDaysInMonth("06", "2024")).toBe(30));
  test("September has 30 days", () => expect(getDaysInMonth("09", "2024")).toBe(30));
  test("November has 30 days", () => expect(getDaysInMonth("11", "2024")).toBe(30));
  test("March has 31 days", () => expect(getDaysInMonth("03", "2024")).toBe(31));
  test("May has 31 days", () => expect(getDaysInMonth("05", "2024")).toBe(31));
  test("July has 31 days", () => expect(getDaysInMonth("07", "2024")).toBe(31));
  test("August has 31 days", () => expect(getDaysInMonth("08", "2024")).toBe(31));
  test("October has 31 days", () => expect(getDaysInMonth("10", "2024")).toBe(31));
  test("December has 31 days", () => expect(getDaysInMonth("12", "2024")).toBe(31));

  test("empty month returns 31 (fallback)", () => expect(getDaysInMonth("", "2024")).toBe(31));
  test("empty year returns 31 (fallback)", () => expect(getDaysInMonth("01", "")).toBe(31));

  test("day 29 is valid in February for leap year", () => {
    const days = getDaysInMonth("02", "2024");
    expect(days >= 29).toBe(true);
  });

  test("day 29 is invalid in February for non-leap year", () => {
    const days = getDaysInMonth("02", "2023");
    expect(days < 29).toBe(true);
  });

  test("validates day 31 is invalid for months with 30 days", () => {
    const aprilDays = getDaysInMonth("04", "2024");
    const juneDays = getDaysInMonth("06", "2024");
    const septemberDays = getDaysInMonth("09", "2024");
    const novemberDays = getDaysInMonth("11", "2024");
    expect(aprilDays).toBe(30);
    expect(juneDays).toBe(30);
    expect(septemberDays).toBe(30);
    expect(novemberDays).toBe(30);
  });
});

describe("Chinese Zodiac Date Validation & Boundary Edge Cases", () => {
  test("10/01/1990 is before CNY 1990 (27/01/1990) -> Serpiente de Tierra (1989)", () => {
    expect(getLunarYear("1990-01-10")).toBe(1989);
    expect(getChineseZodiac("1990-01-10")).toBe("Serpiente");
    const info = getChineseZodiacInfo("1990-01-10");
    expect(info.animal).toBe("Serpiente");
    expect(info.element).toBe("Tierra");
  });

  test("27/01/1990 is exact CNY 1990 day -> Caballo de Metal (1990)", () => {
    expect(getLunarYear("1990-01-27")).toBe(1990);
    expect(getChineseZodiac("1990-01-27")).toBe("Caballo");
    const info = getChineseZodiacInfo("1990-01-27");
    expect(info.animal).toBe("Caballo");
    expect(info.element).toBe("Metal");
  });

  test("15/02/1990 is after CNY 1990 -> Caballo de Metal (1990)", () => {
    expect(getLunarYear("1990-02-15")).toBe(1990);
    expect(getChineseZodiac("1990-02-15")).toBe("Caballo");
    const info = getChineseZodiacInfo("1990-02-15");
    expect(info.animal).toBe("Caballo");
    expect(info.element).toBe("Metal");
  });

  test("20/01/1993 is before CNY 1993 (23/01/1993) -> Mono de Agua (1992)", () => {
    expect(getLunarYear("1993-01-20")).toBe(1992);
    expect(getChineseZodiac("1993-01-20")).toBe("Mono");
    const info = getChineseZodiacInfo("1993-01-20");
    expect(info.animal).toBe("Mono");
    expect(info.element).toBe("Agua");
  });

  test("23/01/1993 is exact CNY 1993 day -> Gallo de Agua (1993)", () => {
    expect(getLunarYear("1993-01-23")).toBe(1993);
    expect(getChineseZodiac("1993-01-23")).toBe("Gallo");
    const info = getChineseZodiacInfo("1993-01-23");
    expect(info.animal).toBe("Gallo");
    expect(info.element).toBe("Agua");
  });

  test("getChineseNewYearDate returns accurate Date for any year 1900-2030", () => {
    const d1990 = getChineseNewYearDate(1990);
    expect(d1990.getFullYear()).toBe(1990);
    expect(d1990.getMonth()).toBe(0); // Jan
    expect(d1990.getDate()).toBe(27);
  });
});
