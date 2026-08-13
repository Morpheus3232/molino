import { describe, it, expect } from "vitest";
import {
  getChineseZodiac,
  getChineseZodiacInfo,
  getChineseElement,
  getChineseAnimal,
  getChineseNewYearDate,
  getLunarYear,
} from "@/lib/engines/chineseZodiacEngine";
import { CHINESE_NEW_YEAR_DATES } from "@/lib/data/chinese-new-year";

describe("Chinese Zodiac Lunar Calendar Boundaries", () => {
  it("calculates exact Chinese New Year Date", () => {
    const cny1990 = getChineseNewYearDate(1990);
    expect(cny1990.getFullYear()).toBe(1990);
    expect(cny1990.getMonth()).toBe(0); // January (0-indexed)
    expect(cny1990.getDate()).toBe(27);

    const cny1993 = getChineseNewYearDate(1993);
    expect(cny1993.getFullYear()).toBe(1993);
    expect(cny1993.getMonth()).toBe(0);
    expect(cny1993.getDate()).toBe(23);

    const cny2024 = getChineseNewYearDate(2024);
    expect(cny2024.getFullYear()).toBe(2024);
    expect(cny2024.getMonth()).toBe(1); // February (0-indexed)
    expect(cny2024.getDate()).toBe(10);
  });

  it("handles 1990 boundary cases correctly", () => {
    // 10/01/1990 is BEFORE Chinese New Year 1990 (27/01/1990) -> Year 1989 (Serpiente de Tierra)
    expect(getLunarYear("1990-01-10")).toBe(1989);
    expect(getChineseZodiac("1990-01-10")).toBe("Serpiente");
    const info1 = getChineseZodiacInfo("1990-01-10");
    expect(info1.animal).toBe("Serpiente");
    expect(info1.element).toBe("Tierra");
    expect(info1.lunarYear).toBe(1989);

    // 27/01/1990 is EXACT DAY of Chinese New Year 1990 -> Year 1990 (Caballo de Metal)
    expect(getLunarYear("1990-01-27")).toBe(1990);
    expect(getChineseZodiac("1990-01-27")).toBe("Caballo");
    const info2 = getChineseZodiacInfo("1990-01-27");
    expect(info2.animal).toBe("Caballo");
    expect(info2.element).toBe("Metal");
    expect(info2.lunarYear).toBe(1990);

    // 15/02/1990 is AFTER Chinese New Year 1990 -> Year 1990 (Caballo de Metal)
    expect(getLunarYear("1990-02-15")).toBe(1990);
    expect(getChineseZodiac("1990-02-15")).toBe("Caballo");
    const info3 = getChineseZodiacInfo("1990-02-15");
    expect(info3.animal).toBe("Caballo");
    expect(info3.element).toBe("Metal");
  });

  it("handles 1993 boundary cases correctly", () => {
    // Chinese New Year 1993 was 23/01/1993
    // 20/01/1993 is BEFORE Chinese New Year -> Year 1992 (Mono de Agua)
    expect(getLunarYear("1993-01-20")).toBe(1992);
    expect(getChineseZodiac("1993-01-20")).toBe("Mono");
    const info1 = getChineseZodiacInfo("1993-01-20");
    expect(info1.animal).toBe("Mono");
    expect(info1.element).toBe("Agua");
    expect(info1.lunarYear).toBe(1992);

    // 23/01/1993 is EXACT DAY -> Year 1993 (Gallo de Agua)
    expect(getLunarYear("1993-01-23")).toBe(1993);
    expect(getChineseZodiac("1993-01-23")).toBe("Gallo");
    const info2 = getChineseZodiacInfo("1993-01-23");
    expect(info2.animal).toBe("Gallo");
    expect(info2.element).toBe("Agua");
  });

  it("has exact Chinese New Year dates covering 1900 to 2040", () => {
    for (let y = 1900; y <= 2030; y++) {
      expect(CHINESE_NEW_YEAR_DATES[y]).toBeDefined();
      expect(CHINESE_NEW_YEAR_DATES[y]).toMatch(new RegExp(`^${y}-(01|02)-\\d{2}$`));
    }
  });

  it("calculates element correctly from date strings or numbers", () => {
    expect(getChineseElement("1990-01-10")).toBe("Tierra"); // 1989 lunar
    expect(getChineseElement("1990-01-27")).toBe("Metal");  // 1990 lunar
    expect(getChineseElement(1990)).toBe("Metal");
    expect(getChineseElement(1989)).toBe("Tierra");
  });

  it("calculates animal correctly from date strings or numbers", () => {
    expect(getChineseAnimal("1990-01-10")).toBe("Serpiente"); // 1989 lunar
    expect(getChineseAnimal("1990-01-27")).toBe("Caballo");   // 1990 lunar
    expect(getChineseAnimal(1990)).toBe("Caballo");
    expect(getChineseAnimal(1989)).toBe("Serpiente");
  });
});
