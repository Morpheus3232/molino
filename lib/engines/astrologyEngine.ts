import { getZodiacSign, getMoonPhase, getPlanetaryPositions } from '../calculations';

export function getSunSign(birthDate: string): string {
  const [yearStr, monthStr, dayStr] = birthDate.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  return getZodiacSign(day, month);
}

export function getSunSignInfo(birthDate: string): { sign: string; element: string; modality: string } {
  const sign = getSunSign(birthDate);
  const element = getElement(sign);
  const modality = getModality(sign);
  return { sign, element, modality };
}

export function getElement(sign: string): string {
  const elements: Record<string, string> = {
    'Aries': 'Fuego',
    'Leo': 'Fuego',
    'Sagitario': 'Fuego',
    'Tauro': 'Tierra',
    'Virgo': 'Tierra',
    'Capricornio': 'Tierra',
    'Géminis': 'Aire',
    'Libra': 'Aire',
    'Acuario': 'Aire',
    'Cáncer': 'Agua',
    'Escorpio': 'Agua',
    'Piscis': 'Agua'
  };
  return elements[sign] || 'Desconocido';
}

export const getWesternElement = getElement;

export function getModality(sign: string): string {
  const modalities: Record<string, string> = {
    'Aries': 'Cardinal',
    'Cáncer': 'Cardinal',
    'Libra': 'Cardinal',
    'Capricornio': 'Cardinal',
    'Tauro': 'Fijo',
    'Leo': 'Fijo',
    'Escorpio': 'Fijo',
    'Acuario': 'Fijo',
    'Géminis': 'Mutable',
    'Virgo': 'Mutable',
    'Sagitario': 'Mutable',
    'Piscis': 'Mutable'
  };
  return modalities[sign] || 'Desconocido';
}

export function calculateElementCompatibility(userElement: string, targetElement: string): number {
  const relations: Record<string, Record<string, number>> = {
    'Fuego': { 'Fuego': 80, 'Aire': 90, 'Tierra': 60, 'Agua': 40 },
    'Tierra': { 'Tierra': 80, 'Agua': 90, 'Fuego': 60, 'Aire': 40 },
    'Aire': { 'Aire': 80, 'Fuego': 90, 'Agua': 60, 'Tierra': 40 },
    'Agua': { 'Agua': 80, 'Tierra': 90, 'Aire': 60, 'Fuego': 40 },
  };
  return relations[userElement]?.[targetElement] || 65;
}

export { getZodiacSign, getMoonPhase, getPlanetaryPositions } from '../calculations';

export function getSunSignSymbol(birthDate: string): string {
  const [yearStr, monthStr, dayStr] = birthDate.split('-');
  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);
  const sign = getZodiacSign(day, month);
  const symbols: Record<string, string> = {
    'Aries': '♈',
    'Tauro': '♉',
    'Géminis': '♊',
    'Cáncer': '♋',
    'Leo': '♌',
    'Virgo': '♍',
    'Libra': '♎',
    'Escorpio': '♏',
    'Sagitario': '♐',
    'Capricornio': '♑',
    'Acuario': '♒',
    'Piscis': '♓',
  };
  return symbols[sign] || '♈';
}

/**
 * Calculates Moon Sign (Signo Lunar) using lunar longitude algorithm (Meeus approximation).
 */
export function getMoonSign(birthDate: string, birthTime: string = "12:00"): string {
  if (!birthDate) return "Cáncer";
  const [yearStr, monthStr, dayStr] = birthDate.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  const [hourStr, minStr] = (birthTime || "12:00").split(':');
  const hour = parseInt(hourStr || "12", 10) + (parseInt(minStr || "0", 10) / 60);

  if (isNaN(year) || isNaN(month) || isNaN(day)) return "Cáncer";

  // Julian Day Calculation
  let Y = year;
  let M = month;
  if (M <= 2) {
    Y -= 1;
    M += 12;
  }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const JD = Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + day + (hour / 24) + B - 1524.5;

  // Time in Julian centuries since J2000.0
  const T = (JD - 2451545.0) / 36525;

  const degToRad = Math.PI / 180;

  // Mean orbital elements (in degrees)
  const L0 = (218.3164477 + 481267.88123421 * T) % 360;
  const D = (297.8501921 + 445267.1114034 * T) % 360;
  const M_sun = (357.5291092 + 35999.0502909 * T) % 360;
  const M_moon = (134.9633964 + 477198.8675055 * T) % 360;
  const F = (93.2720950 + 483202.0175233 * T) % 360;

  // Periodic perturbations in longitude (degrees)
  const l = L0
    + 6.288774 * Math.sin(M_moon * degToRad)
    + 1.274027 * Math.sin((2 * D - M_moon) * degToRad)
    + 0.658314 * Math.sin(2 * D * degToRad)
    + 0.213618 * Math.sin(2 * M_moon * degToRad)
    - 0.185116 * Math.sin(M_sun * degToRad)
    - 0.114332 * Math.sin(2 * F * degToRad)
    + 0.058793 * Math.sin((2 * D - 2 * M_moon) * degToRad)
    + 0.057066 * Math.sin((2 * D - M_sun - M_moon) * degToRad)
    + 0.053322 * Math.sin((2 * D + M_moon) * degToRad)
    + 0.045758 * Math.sin((2 * D - M_sun) * degToRad);

  const lon = (l % 360 + 360) % 360;

  const signs = [
    "Aries", "Tauro", "Géminis", "Cáncer",
    "Leo", "Virgo", "Libra", "Escorpio",
    "Sagitario", "Capricornio", "Acuario", "Piscis"
  ];

  const signIndex = Math.floor(lon / 30);
  return signs[signIndex] || "Aries";
}

export function getMoonSignInfo(birthDate: string, birthTime?: string): { sign: string; element: string; modality: string } {
  const sign = getMoonSign(birthDate, birthTime);
  const element = getElement(sign);
  const modality = getModality(sign);
  return { sign, element, modality };
}
