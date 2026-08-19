/**
 * Zodiac Pet Engine
 *
 * Lectura simbólica de mascotas según el zodíaco chino, basada en el
 * sistema tradicional de Liu Chong (六冲) — los 6 pares de signos en
 * oposición directa — y San He (三合) para las afinidades. Reutiliza
 * animalRelations.ts como única fuente de verdad; no duplica pares.
 *
 * NO predicción. Lectura simbólica/cultural, igual que el resto del
 * sitio (ver getRelation en animalRelations.ts).
 */

import { getClashPartner, getAnimalProfile, ANIMALS, type Animal } from "@/lib/data/animalRelations";
import { getChineseAnimal } from "./chineseZodiacEngine";

export type PetConflictLevel = "ALTO" | "MEDIO" | "BAJO" | "NULO";

export interface PetRecommendation {
  sign: Animal;
  petToAvoid: Animal;
  razon: string;
  nivel: "ALTO" | "MEDIO";
  explicacionEnergia: string;
}

// Nivel de atención por par de choque (Liu Chong) — un único valor por
// par para que la lectura sea bidireccional y consistente en ambos
// signos, en vez de asignarlo por animal.
const CLASH_PAIR_LEVEL: [Animal, Animal, "ALTO" | "MEDIO"][] = [
  ["Rata", "Caballo", "MEDIO"],
  ["Buey", "Cabra", "ALTO"],
  ["Tigre", "Mono", "MEDIO"],
  ["Gato", "Gallo", "MEDIO"],
  ["Dragón", "Perro", "ALTO"],
  ["Serpiente", "Cerdo", "ALTO"],
];

function getClashLevel(animal: Animal): "ALTO" | "MEDIO" {
  const entry = CLASH_PAIR_LEVEL.find(([a, b]) => a === animal || b === animal);
  return entry?.[2] ?? "MEDIO";
}

const ENERGY_DESCRIPTIONS: Record<Animal, string> = {
  Rata: "Astuta y estratégica, en contraste con la energía libre y desprendida del Caballo.",
  Buey: "Disciplinado y metódico, en contraste con la energía creativa y cambiante de la Cabra.",
  Tigre: "Apasionado e independiente, en contraste con la energía adaptable y sociable del Mono.",
  Gato: "Intuitivo y reservado, en contraste con la energía directa y madrugadora del Gallo.",
  Dragón: "Ambicioso y expansivo, en contraste con la energía leal y cuestionadora del Perro.",
  Serpiente: "Reflexiva y reservada, en contraste con la energía generosa y despreocupada del Cerdo.",
  Caballo: "Libre y aventurero, en contraste con la energía calculadora y ahorrativa de la Rata.",
  Cabra: "Sensible y artística, en contraste con la energía rígida y tradicional del Buey.",
  Mono: "Ingenioso y versátil, en contraste con la energía intensa y territorial del Tigre.",
  Gallo: "Preciso y organizado, en contraste con la energía misteriosa e independiente del Gato.",
  Perro: "Justo y protector, en contraste con la energía dominante y ambiciosa del Dragón.",
  Cerdo: "Cálido y optimista, en contraste con la energía analítica y estratégica de la Serpiente.",
};

/** Obtiene la recomendación de mascota simbólica para un signo. */
export function getPetRecommendation(sign: Animal): PetRecommendation {
  const petToAvoid = getClashPartner(sign) ?? "Caballo";
  return {
    sign,
    petToAvoid,
    razon: `${petToAvoid} es el signo opuesto de ${sign} en el ciclo de los 6 choques (Liu Chong) — según esta tradición, la energía entre ambos genera fricción incluso cuando hay cariño mutuo.`,
    nivel: getClashLevel(sign),
    explicacionEnergia: ENERGY_DESCRIPTIONS[sign],
  };
}

/** Obtiene la recomendación a partir de un año o fecha de nacimiento. */
export function getPetRecommendationByYear(yearOrDate: number | string): PetRecommendation {
  return getPetRecommendation(getChineseAnimal(yearOrDate));
}

/** Verifica si una mascota es compatible (no es el signo enemigo) con un signo. */
export function isPetCompatible(sign: Animal, pet: Animal): boolean {
  return getClashPartner(sign) !== pet;
}

/** Lista de mascotas domésticas seguras (excluye la enemiga del signo). */
export function getSafePets(sign: Animal): Animal[] {
  const petToAvoid = getClashPartner(sign);
  return ANIMALS.filter((animal) => animal !== petToAvoid);
}

/**
 * Nivel de conflicto energético entre un signo y una mascota específica.
 * ALTO/MEDIO si es el signo enemigo (Liu Chong), NULO si es del mismo
 * trío de afinidad (San He), BAJO en cualquier otro caso.
 */
export function getPetConflictLevel(sign: Animal, pet: Animal): PetConflictLevel {
  if (getClashPartner(sign) === pet) return getClashLevel(sign);
  if (getAnimalProfile(sign).harmonyPartners.includes(pet)) return "NULO";
  return "BAJO";
}
