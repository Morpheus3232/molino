/**
 * Astrology Facts — Astronomical date boundaries, glyph symbols, elements and modalities.
 * Pure data, no interpretive prose.
 */

export const WESTERN_SIGNS = [
  "Aries", "Tauro", "Géminis", "Cáncer",
  "Leo", "Virgo", "Libra", "Escorpio",
  "Sagitario", "Capricornio", "Acuario", "Piscis",
] as const;

export type WesternSign = typeof WESTERN_SIGNS[number];

export const WESTERN_ELEMENTS = ["Fuego", "Tierra", "Aire", "Agua"] as const;
export type WesternElement = typeof WESTERN_ELEMENTS[number];

export const MODALITIES = ["Cardinal", "Fijo", "Mutable"] as const;
export type Modality = typeof MODALITIES[number];

export interface SignFact {
  sign: WesternSign;
  element: WesternElement;
  modality: Modality;
  symbol: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
}

export const SIGN_FACTS: Readonly<Record<WesternSign, SignFact>> = {
  Aries: { sign: "Aries", element: "Fuego", modality: "Cardinal", symbol: "♈", startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
  Tauro: { sign: "Tauro", element: "Tierra", modality: "Fijo", symbol: "♉", startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
  Géminis: { sign: "Géminis", element: "Aire", modality: "Mutable", symbol: "♊", startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
  Cáncer: { sign: "Cáncer", element: "Agua", modality: "Cardinal", symbol: "♋", startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
  Leo: { sign: "Leo", element: "Fuego", modality: "Fijo", symbol: "♌", startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
  Virgo: { sign: "Virgo", element: "Tierra", modality: "Mutable", symbol: "♍", startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
  Libra: { sign: "Libra", element: "Aire", modality: "Cardinal", symbol: "♎", startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
  Escorpio: { sign: "Escorpio", element: "Agua", modality: "Fijo", symbol: "♏", startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
  Sagitario: { sign: "Sagitario", element: "Fuego", modality: "Mutable", symbol: "♐", startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
  Capricornio: { sign: "Capricornio", element: "Tierra", modality: "Cardinal", symbol: "♑", startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
  Acuario: { sign: "Acuario", element: "Aire", modality: "Fijo", symbol: "♒", startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
  Piscis: { sign: "Piscis", element: "Agua", modality: "Mutable", symbol: "♓", startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
};

export const ZODIAC_SYMBOLS: Readonly<Record<WesternSign, string>> = {
  Aries: "♈",
  Tauro: "♉",
  Géminis: "♊",
  Cáncer: "♋",
  Leo: "♌",
  Virgo: "♍",
  Libra: "♎",
  Escorpio: "♏",
  Sagitario: "♐",
  Capricornio: "♑",
  Acuario: "♒",
  Piscis: "♓",
};

export const PLANETARY_SYMBOLS: Readonly<Record<string, string>> = {
  Sol: "☉",
  Luna: "☽",
  Mercurio: "☿",
  Venus: "♀",
  Marte: "♂",
  Júpiter: "♃",
  Saturno: "♄",
  Urano: "♅",
  Neptuno: "♆",
  Plutón: "♇",
};

export const ELEMENT_RELATIONS_SCORE: Readonly<Record<WesternElement, Record<WesternElement, number>>> = {
  Fuego: { Fuego: 80, Aire: 90, Tierra: 60, Agua: 40 },
  Tierra: { Tierra: 80, Agua: 90, Fuego: 60, Aire: 40 },
  Aire: { Aire: 80, Fuego: 90, Agua: 60, Tierra: 40 },
  Agua: { Agua: 80, Tierra: 90, Aire: 60, Fuego: 40 },
};
