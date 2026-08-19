import { describe, test, expect } from "vitest";

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