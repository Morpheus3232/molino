import { getChineseZodiac as getRealChineseZodiac } from '../data/chineseNewYearDates';

export function getChineseZodiac(birthDate: string): string {
  return getRealChineseZodiac(birthDate);
}

export function getChineseZodiacInfo(birthDate: string): { animal: string; element: string } {
  const animal = getChineseZodiac(birthDate);
  const year = parseInt(birthDate.split('-')[0], 10);
  const element = getChineseElement(year);
  return { animal, element };
}

export function getChineseElement(year: number): string {
  const elements = ['Metal', 'Agua', 'Madera', 'Fuego', 'Tierra'];
  const index = Math.floor(((year - 1900) % 10) / 2);
  return elements[index >= 0 && index < 5 ? index : 0];
}

export function getChineseAnimal(year: number): string {
  const animals = ['Rata', 'Buey', 'Tigre', 'Conejo', 'Dragón', 'Serpiente', 'Caballo', 'Cabra', 'Mono', 'Gallo', 'Perro', 'Cerdo'];
  const index = (year - 1900) % 12;
  return animals[index >= 0 ? index : index + 12];
}

export function calculateChineseCompatibility(userAnimal: string, targetAnimal: string): number {
  const animals = ['Rata', 'Buey', 'Tigre', 'Conejo', 'Dragón', 'Serpiente', 'Caballo', 'Cabra', 'Mono', 'Gallo', 'Perro', 'Cerdo'];
  const userIndex = animals.indexOf(userAnimal);
  const targetIndex = animals.indexOf(targetAnimal);
  if (userIndex === -1 || targetIndex === -1) return 50;
  const diff = Math.abs(userIndex - targetIndex) % 12;
  const scores: Record<number, number> = { 0: 80, 1: 70, 2: 50, 3: 40, 4: 60, 5: 30, 6: 90, 7: 30, 8: 60, 9: 40, 10: 50, 11: 70 };
  return scores[diff] || 50;
}
