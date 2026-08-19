import { describe, test, expect } from "vitest";
import { getPersonalYear } from "@/lib/calculations";

describe("getPersonalYear — targetYear must actually change the evaluated year", () => {
  test("consecutive target years produce distinct personal-year numbers for a fixed birthdate", () => {
    // Regression test for the Evolution bug: getPersonalYear(day, month, birthYear, targetYear)
    // was silently ignoring targetYear (it fell into an unused parameter) and always
    // evaluating against the real current calendar year instead.
    const y2025 = getPersonalYear(18, 4, 1990, 2025);
    const y2026 = getPersonalYear(18, 4, 1990, 2026);
    const y2027 = getPersonalYear(18, 4, 1990, 2027);

    expect(y2025).toBe(4);
    expect(y2026).toBe(5);
    expect(y2027).toBe(6);

    expect(y2025).not.toBe(y2026);
    expect(y2026).not.toBe(y2027);
    expect(y2025).not.toBe(y2027);
  });

  test("currentYear (6th positional arg) still takes priority when explicitly passed", () => {
    // profileBuilder.ts computes a "personal month" by exploiting the 6th positional
    // slot to pass a month number instead of a year — that call must keep working
    // exactly as before this fix.
    const withExplicitCurrentYear = getPersonalYear(18, 4, 1990, 2025, undefined, 7);
    const withOnlyMonthAsSixthArg = getPersonalYear(18, 4, 1990, undefined, undefined, 7);
    expect(withExplicitCurrentYear).toBe(withOnlyMonthAsSixthArg);
  });
});
