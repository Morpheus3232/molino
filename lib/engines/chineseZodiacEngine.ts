import { getChineseZodiac as getRealChineseZodiac } from '../data/chineseNewYearDates';
import { ANIMALS, getRelation, type Animal } from '../data/animalRelations';

export function getChineseZodiac(birthDate: string): string {
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
): { animal: string; isApproximate: boolean } {
  if (dateStr) {
    return { animal: getRealChineseZodiac(dateStr), isApproximate: false };
  }
  if (year) {
    const fallbackDate = `${year}-06-01`;
    return { animal: getRealChineseZodiac(fallbackDate), isApproximate: true };
  }
  return { animal: "", isApproximate: true };
}

export function getChineseZodiacInfo(birthDate: string): { animal: string; element: string } {
  const animal = getChineseZodiac(birthDate);
  const year = parseInt(birthDate.split('-')[0], 10);
  const element = getChineseElement(year);
  return { animal, element };
}

export function getChineseElement(year: number): string {
  const elements = ['Metal', 'Agua', 'Madera', 'Fuego', 'Tierra'];
  const index = Math.floor((((year - 1900) % 10) + 10) % 10 / 2);
  return elements[index];
}

export function getChineseAnimal(year: number): string {
  const index = (year - 1900) % 12;
  return ANIMALS[index >= 0 ? index : index + 12];
}

export function calculateChineseCompatibility(userAnimal: string, targetAnimal: string): number {
  if (!userAnimal || !targetAnimal) return 50;
  return getRelation(userAnimal as Animal, targetAnimal as Animal).score;
}
