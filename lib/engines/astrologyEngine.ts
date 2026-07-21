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
