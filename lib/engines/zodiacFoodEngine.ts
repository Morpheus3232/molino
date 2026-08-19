/**
 * Zodiac Food Engine
 *
 * Lectura simbólica de alimentos según el signo del zodíaco chino,
 * basada en el sistema tradicional de Liu Chong (六冲) — los 6 pares
 * de signos en oposición directa. Reutiliza LIU_CHONG_CLASHES como
 * única fuente de verdad, no duplica el par.
 *
 * Solo se asigna alimento a evitar cuando el signo opuesto corresponde
 * a un animal de consumo habitual (cerdo, cabra, vaca, pollo) — el
 * resto de los pares (ej. Rata↔Caballo, Tigre↔Mono, Dragón↔Perro) no
 * tiene una lectura de alimento con sentido y queda sin restricción.
 *
 * NO predicción, NO consejo nutricional. Lectura simbólica/cultural.
 */

import { getClashPartner, type Animal } from "@/lib/data/animalRelations";
import { getChineseAnimal } from "./chineseZodiacEngine";

export type FoodCautionLevel = "ALTO" | "MEDIO" | "BAJO";

export interface FoodRecommendation {
  sign: Animal;
  restriction: "EVITAR" | "LIBRE";
  alimento: string;
  razon: string;
  nivel: FoodCautionLevel;
  ejemplos: string[];
}

const FOOD_BY_ANIMAL: Partial<Record<Animal, { alimento: string; nivel: FoodCautionLevel; ejemplos: string[] }>> = {
  Cerdo: {
    alimento: "Cerdo",
    nivel: "ALTO",
    ejemplos: ["bacon", "jamón", "chorizo", "panceta", "embutidos", "manteca de cerdo"],
  },
  Cabra: {
    alimento: "Cabra",
    nivel: "ALTO",
    ejemplos: ["leche de cabra", "queso de cabra", "carne de cabra", "yogur de cabra"],
  },
  Buey: {
    alimento: "Vaca/Buey",
    nivel: "ALTO",
    ejemplos: ["carne de res", "leche de vaca", "quesos", "manteca", "gelatina"],
  },
  Gallo: {
    alimento: "Pollo/Gallo",
    nivel: "MEDIO",
    ejemplos: ["pollo", "gallina", "huevos", "caldo de ave"],
  },
};

/** Obtiene la recomendación alimentaria simbólica para un signo. */
export function getFoodRecommendation(sign: Animal): FoodRecommendation {
  const clash = getClashPartner(sign);
  const food = clash ? FOOD_BY_ANIMAL[clash] : undefined;

  if (!food) {
    return {
      sign,
      restriction: "LIBRE",
      alimento: "Ninguna",
      razon: "Sin restricción alimentaria específica según esta tradición.",
      nivel: "BAJO",
      ejemplos: [],
    };
  }

  return {
    sign,
    restriction: "EVITAR",
    alimento: food.alimento,
    razon: `${clash} es el signo opuesto de ${sign} en el ciclo de los 6 choques (Liu Chong) — la tradición sugiere moderar alimentos asociados a ese animal.`,
    nivel: food.nivel,
    ejemplos: food.ejemplos,
  };
}

/** Obtiene la recomendación alimentaria a partir de un año o fecha de nacimiento. */
export function getFoodRecommendationByYear(yearOrDate: number | string): FoodRecommendation {
  return getFoodRecommendation(getChineseAnimal(yearOrDate));
}
