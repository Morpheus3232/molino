import { calculateLifePath, calculateExpressionNumber, calculateSoulNumber, calculatePersonalityNumber, getArchetypeInfo } from './numerologyEngine';
import { getSunSign, getSunSignInfo, getSunSignSymbol } from './astrologyEngine';
import { getChineseZodiac, getChineseZodiacInfo } from './chineseZodiacEngine';
import type { UserProfile } from '@/types/user';
import { getPersonalYear, getPersonalDayForDate, calculateLuckyNumber } from '@/lib/calculations';

export type { UserProfile } from '@/types/user';

export function calculateUserProfile(name: string, birthDate: string, overrides?: Partial<UserProfile>): UserProfile {
  const lifePath = calculateLifePath(birthDate);
  const sunSign = getSunSign(birthDate);
  const sunSignInfo = getSunSignInfo(birthDate);
  const chineseZodiac = getChineseZodiac(birthDate);
  const chineseZodiacInfo = getChineseZodiacInfo(birthDate);
  const archetypeInfo = getArchetypeInfo(lifePath);

  const now = new Date();
  const birthParts = birthDate.split('-').map((part) => parseInt(part, 10));
  const birthDay = Number.isFinite(birthParts[2]) ? birthParts[2] : now.getDate();
  const birthMonth = Number.isFinite(birthParts[1]) ? birthParts[1] : now.getMonth() + 1;
  const birthYear = Number.isFinite(birthParts[0]) ? birthParts[0] : now.getFullYear();

  const personalYear = getPersonalYear(birthDay, birthMonth, birthYear, now.getFullYear());
  const personalMonth = getPersonalYear(birthDay, birthMonth, birthYear, now.getFullYear(), undefined, now.getMonth() + 1);
  const personalDay = getPersonalDayForDate(birthDay, birthMonth, birthYear, now);

  const baseStrength =
    archetypeInfo.strengths?.length > 0
      ? archetypeInfo.strengths.slice(0, 4)
      : ['Aprendizaje', 'Flexibilidad', 'Conexión'];
  const baseChallenge =
    archetypeInfo.challenges?.length > 0
      ? archetypeInfo.challenges.slice(0, 3)
      : ['Indecisión', 'Dispersión', 'Inconstancia'];
  const practices = [
    'Registrá 3 logros pequeños por semana.',
    'Dedicá 10 minutos a respirar o escribir sin filtro.',
    'Elegí una palabra foco para el mes y revisala cada domingo.',
  ];

  return {
    name,
    birthDate,
    birthPlace: overrides?.birthPlace || '',
    birthTime: overrides?.birthTime,
    goal: overrides?.goal || 'life',
    interests: overrides?.interests || [],
    onboardingStep: overrides?.onboardingStep || 1,
    completedSections: overrides?.completedSections || [],
    theme: overrides?.theme || 'light',
    language: overrides?.language || 'es',
    notifications: overrides?.notifications ?? true,
    lifePath,
    expressionNumber: name ? calculateExpressionNumber(name) : undefined,
    soulNumber: name ? calculateSoulNumber(name) : undefined,
    personalityNumber: name ? calculatePersonalityNumber(name) : undefined,
    sunSign,
    sunSignInfo: { sign: sunSignInfo.sign, element: sunSignInfo.element, modality: sunSignInfo.modality, symbol: getSunSignSymbol(birthDate) },
    chineseZodiac,
    chineseZodiacInfo,
    element: sunSignInfo.element,
    modality: sunSignInfo.modality,
    luckyNumber: calculateLuckyNumber(birthMonth, birthYear),
    archetype: archetypeInfo.name,
    archetypeInfo,
    cycles: {
      personalYear,
      personalDay,
      personalMonth,
    },
    recommendations: {
      strengths: baseStrength,
      challenges: baseChallenge,
      practices,
    },
  };
}
