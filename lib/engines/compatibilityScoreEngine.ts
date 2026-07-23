/**
 * Compatibility Engine
 *
 * Calculates symbolic compatibility between user profile and
 * countries/brands based on Chinese zodiac + numerology.
 *
 * Formula: 70% Chinese Zodiac + 30% Numerology
 * Deterministic. No AI. No external APIs.
 */

import type { UserProfile } from "@/types/user";
import { safeNumber } from "@/lib/utils/score";
import { getCompatibilityScore, getCompatibilityDescription } from "@/lib/data";
import { COUNTRIES, type CountryData } from "@/lib/data/countries";
import { BRANDS, type BrandData } from "@/lib/data/brands";

export interface CompatibilityResult {
  name: string;
  score: number;
  zodiacScore: number;
  numerologyScore: number;
  targetAnimal: string;
  targetElement: string;
  description: string;
  reasons: string[];
  meta: Record<string, string>;
}

// ─── Zodiac compatibility tiers (70% weight) ───
const ZODIAC_COMPAT: Record<number, { label: string; weight: number }> = {
  0: { label: "Mismo signo — Energía idéntica", weight: 80 },
  1: { label: "Adyacente — Complementarios naturales", weight: 70 },
  2: { label: "Amigo — Buena sintonía", weight: 65 },
  3: { label: "Tensión productiva — Crecimiento mutuo", weight: 45 },
  4: { label: "Neutral — Diferentes frecuencias", weight: 55 },
  5: { label: "Desafío — Requiere esfuerzo consciente", weight: 35 },
  6: { label: "Opuestos — Atracción o fricción", weight: 90 },
  7: { label: "Desafío — Dinámica intensa", weight: 30 },
  8: { label: "Neutral — Coexistencia", weight: 55 },
  9: { label: "Tensión — Aprender del otro", weight: 40 },
  10: { label: "Amigo — Respeto mutuo", weight: 60 },
  11: { label: "Complementarios — Ciclos", weight: 70 },
};

function getZodiacScore(userAnimal: string, targetAnimal: string): number {
  const animals = ["Rata", "Buey", "Tigre", "Conejo", "Dragón", "Serpiente", "Caballo", "Cabra", "Mono", "Gallo", "Perro", "Cerdo"];
  const ui = animals.indexOf(userAnimal);
  const ti = animals.indexOf(targetAnimal);
  if (ui === -1 || ti === -1) return 50;
  const diff = Math.abs(ui - ti) % 12;
  const tier = ZODIAC_COMPAT[diff];
  return tier ? tier.weight : 50;
}

function getZodiacLabel(userAnimal: string, targetAnimal: string): string {
  const animals = ["Rata", "Buey", "Tigre", "Conejo", "Dragón", "Serpiente", "Caballo", "Cabra", "Mono", "Gallo", "Perro", "Cerdo"];
  const ui = animals.indexOf(userAnimal);
  const ti = animals.indexOf(targetAnimal);
  if (ui === -1 || ti === -1) return "Sin datos suficientes";
  const diff = Math.abs(ui - ti) % 12;
  const tier = ZODIAC_COMPAT[diff];
  return tier ? tier.label : "Neutral";
}

// ─── Numerology score (30% weight) ───
function getNumerologyScore(userLifePath: number, targetYear: number, targetName: string): number {
  // Digit sum of year
  const yearDigits = String(targetYear).split("").map(Number).reduce((a, b) => a + b, 0);
  const yearReduced = yearDigits > 9 ? String(yearDigits).split("").map(Number).reduce((a, b) => a + b, 0) : yearDigits;

  // Name value: count letters
  const nameValue = targetName.replace(/[^a-zA-Záéíóúñ]/g, "").length;
  const nameReduced = nameValue > 9 ? String(nameValue).split("").map(Number).reduce((a, b) => a + b, 0) : nameValue;

  // Combined
  const combined = (yearReduced + nameReduced + userLifePath) % 9 || 9;

  // How close to user's life path
  const diff = Math.abs(userLifePath - combined);
  if (diff === 0) return 100;
  if (diff === 1) return 85;
  if (diff === 2) return 70;
  if (diff === 3) return 55;
  if (diff === 4) return 40;
  return 30;
}

// ─── Final score ───
function calculateFinalScore(zodiac: number, numerology: number): number {
  return Math.round(zodiac * 0.7 + numerology * 0.3);
}

// ─── Reason generation ───
function generateCountryReasons(
  score: number,
  userAnimal: string,
  country: CountryData,
  userElement: string,
  zodiacLabel: string,
): string[] {
  const reasons: string[] = [];

  reasons.push(zodiacLabel);

  if (userElement === country.element) {
    reasons.push(`Comparten el mismo elemento ${userElement}. Esto fortalece la conexión simbólica.`);
  } else if (
    (userElement === "Fuego" && country.element === "Tierra") ||
    (userElement === "Tierra" && country.element === "Agua") ||
    (userElement === "Agua" && country.element === "Fuego") ||
    (userElement === "Fuego" && country.element === "Agua")
  ) {
    reasons.push(`Tus elementos son complementarios: ${userElement} + ${country.element}.`);
  }

  if (score >= 75) {
    reasons.push(`${country.name} aparece como una de tus compatibilidades más fuertes.`);
  } else if (score >= 55) {
    reasons.push(`${country.name} tiene una compatibilidad moderada con tu perfil.`);
  } else {
    reasons.push(`${country.name} tiene una compatibilidad menor, pero puede generar crecimiento.`);
  }

  return reasons;
}

function generateBrandReasons(
  score: number,
  userAnimal: string,
  brand: BrandData,
  userElement: string,
  zodiacLabel: string,
): string[] {
  const reasons: string[] = [];

  reasons.push(zodiacLabel);

  if (userElement === brand.element) {
    reasons.push(`${brand.name} nació bajo el mismo elemento ${userElement} que vos.`);
  }

  if (score >= 75) {
    reasons.push(`La energía de ${brand.name} vibra fuertemente con tu perfil.`);
  } else if (score >= 55) {
    reasons.push(`Hay una conexión moderada entre ${brand.name} y tu perfil.`);
  } else {
    reasons.push(`${brand.name} opera en una frecuencia diferente a la tuya.`);
  }

  return reasons;
}

// ─── Public API ───
export function calculateCountryCompatibility(
  profile: UserProfile,
  country: CountryData
): CompatibilityResult {
  const userAnimal = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";
  const userElement = typeof profile.element === "string" ? profile.element : "";
  const lifePath = safeNumber(profile.lifePath, 1);

  const zodiacScore = getZodiacScore(userAnimal, country.animal);
  const numerologyScore = getNumerologyScore(lifePath, country.year, country.name);
  const score = calculateFinalScore(zodiacScore, numerologyScore);

  const zodiacLabel = getZodiacLabel(userAnimal, country.animal);

  return {
    name: country.name,
    score,
    zodiacScore,
    numerologyScore,
    targetAnimal: country.animal,
    targetElement: country.element,
    description: getCompatibilityDescription(score, country.animal),
    reasons: generateCountryReasons(score, userAnimal, country, userElement, zodiacLabel),
    meta: {
      flag: country.flag,
      continent: country.continent,
      year: String(country.year),
      reference: country.reference,
    },
  };
}

export function calculateBrandCompatibility(
  profile: UserProfile,
  brand: BrandData
): CompatibilityResult {
  const userAnimal = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";
  const userElement = typeof profile.element === "string" ? profile.element : "";
  const lifePath = safeNumber(profile.lifePath, 1);

  const zodiacScore = getZodiacScore(userAnimal, brand.animal);
  const numerologyScore = getNumerologyScore(lifePath, brand.year, brand.name);
  const score = calculateFinalScore(zodiacScore, numerologyScore);

  const zodiacLabel = getZodiacLabel(userAnimal, brand.animal);

  return {
    name: brand.name,
    score,
    zodiacScore,
    numerologyScore,
    targetAnimal: brand.animal,
    targetElement: brand.element,
    description: getCompatibilityDescription(score, brand.animal),
    reasons: generateBrandReasons(score, userAnimal, brand, userElement, zodiacLabel),
    meta: {
      logo: brand.logo,
      country: brand.country,
      year: String(brand.year),
      category: brand.category,
    },
  };
}

export function calculateAllCountryCompatibility(
  profile: UserProfile
): CompatibilityResult[] {
  return COUNTRIES
    .map(country => calculateCountryCompatibility(profile, country))
    .sort((a, b) => b.score - a.score);
}

export function calculateAllBrandCompatibility(
  profile: UserProfile
): CompatibilityResult[] {
  return BRANDS
    .map(brand => calculateBrandCompatibility(profile, brand))
    .sort((a, b) => b.score - a.score);
}
