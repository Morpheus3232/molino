import { getChineseZodiac as getRealChineseZodiac } from '../data/chineseNewYearDates';
import { ENTITIES, EntityProfile } from '../data/entities';

export function getChineseZodiac(year: number, month: number, day: number): string {
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return getRealChineseZodiac(dateStr);
}

export function getEntityById(id: string): EntityProfile | undefined {
  return ENTITIES.find(entity => entity.id === id);
}

export function getEntitiesByCategory(category: string): EntityProfile[] {
  return ENTITIES.filter(entity => entity.category === category);
}
