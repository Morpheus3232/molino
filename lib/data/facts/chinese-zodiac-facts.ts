/**
 * Chinese Zodiac Facts — Canonical tables, relationship groups and boundaries.
 * Pure data, no interpretive prose.
 */

import { CHINESE_NEW_YEAR_DATES } from "@/lib/data/chinese-new-year";

export { CHINESE_NEW_YEAR_DATES };

export const CHINESE_ANIMALS = [
  "Rata", "Buey", "Tigre", "Gato", "Dragón",
  "Serpiente", "Caballo", "Cabra", "Mono", "Gallo",
  "Perro", "Cerdo",
] as const;

export type ChineseAnimal = typeof CHINESE_ANIMALS[number];

export const CHINESE_ELEMENTS = ["Metal", "Agua", "Madera", "Fuego", "Tierra"] as const;
export type ChineseElement = typeof CHINESE_ELEMENTS[number];

export const ANIMAL_EMOJIS: Readonly<Record<ChineseAnimal, string>> = {
  Rata: "🐀",
  Buey: "🐂",
  Tigre: "🐅",
  Gato: "🐇", // Conejo/Gato
  Dragón: "🐉",
  Serpiente: "🐍",
  Caballo: "🐎",
  Cabra: "🐐",
  Mono: "🐒",
  Gallo: "🐓",
  Perro: "🐕",
  Cerdo: "🐖",
};

export const SAN_HE_TRIADS: readonly { animals: readonly [ChineseAnimal, ChineseAnimal, ChineseAnimal]; element: ChineseElement }[] = [
  { animals: ["Rata", "Dragón", "Mono"], element: "Agua" },
  { animals: ["Buey", "Serpiente", "Gallo"], element: "Metal" },
  { animals: ["Tigre", "Caballo", "Perro"], element: "Fuego" },
  { animals: ["Gato", "Cabra", "Cerdo"], element: "Madera" },
] as const;

export const LIU_HE_PAIRS: readonly (readonly [ChineseAnimal, ChineseAnimal])[] = [
  ["Rata", "Buey"],
  ["Tigre", "Cerdo"],
  ["Gato", "Perro"],
  ["Dragón", "Gallo"],
  ["Serpiente", "Mono"],
  ["Caballo", "Cabra"],
] as const;

export const LIU_CHONG_CLASHES: readonly (readonly [ChineseAnimal, ChineseAnimal])[] = [
  ["Rata", "Caballo"],
  ["Buey", "Cabra"],
  ["Tigre", "Mono"],
  ["Gato", "Gallo"],
  ["Dragón", "Perro"],
  ["Serpiente", "Cerdo"],
] as const;

export const LIU_HAI_HARMS: readonly (readonly [ChineseAnimal, ChineseAnimal])[] = [
  ["Rata", "Cabra"],
  ["Buey", "Caballo"],
  ["Tigre", "Serpiente"],
  ["Gato", "Dragón"],
  ["Mono", "Cerdo"],
  ["Gallo", "Perro"],
] as const;
