import {
  getChineseZodiac as getRealChineseZodiac,
  getLunarYear,
  getChineseNewYearDate,
  CHINESE_NEW_YEAR_DATES,
} from "@/lib/data/chinese-new-year";
import { ANIMALS, getRelation, type Animal } from "@/lib/data/animalRelations";
import { getFoodRecommendation } from "./zodiacFoodEngine";
import { getPetRecommendation } from "./zodiacPetEngine";
import { analyzeTiming } from "./zodiacTimingEngine";
import { getElementColor } from "./zodiacElementColorEngine";

export { getChineseNewYearDate, getLunarYear, CHINESE_NEW_YEAR_DATES };
export { getFoodRecommendation, getFoodRecommendationByYear } from "./zodiacFoodEngine";
export { getPetRecommendation, getPetRecommendationByYear } from "./zodiacPetEngine";
export { analyzeTiming } from "./zodiacTimingEngine";
export { getElementColor } from "./zodiacElementColorEngine";

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
/**
 * El Año Nuevo chino cae entre el 21 de enero y el 21 de febrero. La tabla
 * real (`CHINESE_NEW_YEAR_DATES`) cubre 1886-2040; fuera de ese rango
 * `getLunarYear` aproxima el corte con un 4 de febrero fijo.
 *
 * Esa aproximación es inocua para cualquier fecha FUERA de la ventana en la
 * que el Año Nuevo puede caer: un 16 de abril pertenece a su año calendario
 * sin importar el día exacto del corte. Dentro de la ventana, en cambio, el
 * signo puede quedar corrido un lugar — y una fecha exacta que produce un
 * signo dudoso es peor que ninguna, porque se presenta como verificada.
 *
 * Ejemplos reales que esto atrapa: Buenos Aires (1580-02-03), Santiago
 * (1541-02-12), Guadalajara (1542-02-14). Quedan marcadas como aproximadas y
 * el Mapa Personal las descarta.
 */
function boundaryIsCertain(dateStr: string): boolean {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return false;
  if (CHINESE_NEW_YEAR_DATES[y]) return true; // corte real documentado
  const enVentana = (m === 1 && d >= 21) || (m === 2 && d <= 21);
  return !enVentana;
}

export function calculateAnimalFromDate(
  dateStr?: string,
  year?: number
): { animal: Animal | ""; isApproximate: boolean } {
  if (dateStr) {
    return {
      animal: getRealChineseZodiac(dateStr),
      isApproximate: !boundaryIsCertain(dateStr),
    };
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

/**
 * Combina las lecturas simbólicas de alimento, mascota y timing anual
 * para un signo — punto de entrada único para consumir los 3 motores
 * nuevos sin tener que importarlos por separado.
 */
export function getChineseZodiacRecommendations(yearOrDate: number | string) {
  const animal = getChineseAnimal(yearOrDate);
  return {
    sign: animal,
    food: getFoodRecommendation(animal),
    pet: getPetRecommendation(animal),
    timing: analyzeTiming(animal),
    elementColor: getElementColor(getChineseElement(yearOrDate)),
  };
}

/** Analiza el timing anual a partir de un año o fecha de nacimiento. */
export function analyzeTimingByYear(yearOrDate: number | string, queryYear?: number) {
  return analyzeTiming(getChineseAnimal(yearOrDate), queryYear);
}

/** Obtiene el color tradicional del elemento a partir de un año o fecha de nacimiento. */
export function getElementColorByYear(yearOrDate: number | string) {
  return getElementColor(getChineseElement(yearOrDate));
}
