import { describe, it, expect } from "vitest";
import {
  lifePathSteps,
  personalYearSteps,
  personalMonthSteps,
  personalDaySteps,
  reductionChain,
  formatReduction,
} from "../explain";
import { calculateLifePath } from "@/lib/engines/numerologyEngine";
import { getPersonalYear, getPersonalDayForDate, reduceToSingleDigit } from "@/lib/calculations";

describe("cuentas paso a paso de Mi Mapa", () => {
  it("arma la cadena de reducción y frena en los maestros", () => {
    expect(reductionChain(2044)).toEqual([2044, 10, 1]);
    expect(reductionChain(29)).toEqual([29, 11]);
    expect(formatReduction([2044, 10, 1])).toBe("2+0+4+4 = 10 → 1+0 = 1");
  });

  it("el ejemplo se lee como la cuenta a mano", () => {
    expect(lifePathSteps("1990-03-15").text).toBe("1+9+9+0+0+3+1+5 = 28 → 2+8 = 10 → 1+0 = 1");
    expect(personalYearSteps("1990-03-15", 2026).text).toBe("15 + 3 + 2026 = 2044 → 2+0+4+4 = 10 → 1+0 = 1");
  });

  it("da siempre el mismo resultado que el motor", () => {
    const dates: string[] = [];
    for (let y = 1930; y <= 2015; y += 7) {
      for (let m = 1; m <= 12; m += 1) {
        for (const d of [1, 9, 11, 19, 22, 29]) {
          dates.push(`${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
        }
      }
    }
    const today = new Date(2026, 9, 25);
    for (const date of dates) {
      const [y, m, d] = date.split("-").map(Number);
      const lp = calculateLifePath(date);
      expect(lifePathSteps(date).result, date).toBe(lp);
      const py = getPersonalYear(d, m, y, 2026);
      expect(personalYearSteps(date, 2026).result, date).toBe(py);
      expect(personalMonthSteps(py, 10).result, date).toBe(reduceToSingleDigit(py + 10));
      expect(personalDaySteps(lp, today).result, date).toBe(getPersonalDayForDate(d, m, y, today));
    }
  });
});
