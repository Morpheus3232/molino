import {
  getChineseZodiac as getRealChineseZodiac,
  getLunarYear,
  getChineseNewYearDate,
  CHINESE_NEW_YEAR_DATES,
} from "@/lib/data/chinese-new-year";
import { ANIMALS, getRelation, type Animal } from "@/lib/data/animalRelations";

export { getChineseNewYearDate, getLunarYear, CHINESE_NEW_YEAR_DATES };

export function getChineseZodiac(birthDate: string): Animal {
  return getRealChineseZodiac(birthDate);
}

/**
 * Calculate Chinese zodiac animal from an exact date or year-only.
 *
 * Priority:
 *   1. Exact date string → uses real Chinese New Year boundary
 *   2. Year only → fallback to YYYY-06-01 (always after CNY), marked approximate
 *   3. Never presents a fallback as an exact historical date
 */
export function calculateAnimalFromDate(
  dateStr?: string,
  year?: number
): { animal: Animal | ""; isApproximate: boolean } {
  if (dateStr) {
    return { animal: getRealChineseZodiac(dateStr), isApproximate: false };
  }
  if (year) {
    const fallbackDate = `${year}-06-01`;
    return { animal: getRealChineseZodiac(fallbackDate), isApproximate: true };
  }
  return { animal: "", isApproximate: true };
}

export function getChineseZodiacInfo(birthDate: string): {
  animal: Animal;
  element: string;
  lunarYear: number;
} {
  const lunarYear = getLunarYear(birthDate);
  const animal = getChineseAnimal(lunarYear);
  const element = getChineseElement(lunarYear);
  return { animal, element, lunarYear };
}

export function getChineseElement(yearOrDate: number | string): string {
  const year = typeof yearOrDate === "string" ? getLunarYear(yearOrDate) : yearOrDate;
  const elements = ["Metal", "Agua", "Madera", "Fuego", "Tierra"];
  const index = Math.floor(((((year - 1900) % 10) + 10) % 10) / 2);
  return elements[index];
}

export function getChineseAnimal(yearOrDate: number | string): Animal {
  const year = typeof yearOrDate === "string" ? getLunarYear(yearOrDate) : yearOrDate;
  const index = ((year - 1900) % 12 + 12) % 12;
  return ANIMALS[index];
}

export function calculateChineseCompatibility(userAnimal: string, targetAnimal: string): number {
  if (!userAnimal || !targetAnimal) return 50;
  return getRelation(userAnimal as Animal, targetAnimal as Animal).score;
}
