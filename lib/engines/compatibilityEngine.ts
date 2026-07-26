import { calculateLifePath, calculateExpressionNumber, calculateSoulNumber, calculatePersonalityNumber, getArchetypeInfo, calculateNumerologyCompatibility } from './numerologyEngine';
import { getSunSign, getSunSignInfo, getWesternElement, getModality, calculateElementCompatibility, getSunSignSymbol } from './astrologyEngine';
import { getChineseZodiac, getChineseZodiacInfo, calculateChineseCompatibility } from './chineseZodiacEngine';
import type { UserProfile } from '@/types/user';
export type { UserProfile } from '@/types/user';
import { getPersonalYear, getPersonalDayForDate, calculateLuckyNumber } from '@/lib/calculations';

export interface CompatibilityScore {
  numerology: number;
  westernAstrology: number;
  chineseAstrology: number;
  archetype: number;
  element: number;
  overall: number;
}

export interface CompatibilityResult {
  user: UserProfile;
  target: any;
  scores: CompatibilityScore;
  strengths: string[];
  challenges: string[];
  narrative: string;
  insight: string;
}

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

export function calculateCompatibility(
  user: UserProfile,
  target: {
    lifePath?: number;
    birthDate?: string;
    sunSign?: string;
    chineseZodiac?: string;
    archetype?: string;
    element?: string;
    name?: string;
  }
): CompatibilityResult {
  const scores: CompatibilityScore = {
    numerology: calculateNumerologyCompatibility(user.lifePath, target.lifePath || 5),
    westernAstrology: target.sunSign
      ? (() => {
          const userSign = user.sunSign;
          const targetSign = target.sunSign || userSign;
          const compat: Record<string, Record<string, number>> = {
            'Aries': { 'Leo': 85, 'Sagitario': 80, 'Géminis': 70, 'Acuario': 65 },
            'Tauro': { 'Virgo': 85, 'Capricornio': 80, 'Cáncer': 70, 'Escorpio': 65 },
            'Géminis': { 'Libra': 85, 'Acuario': 80, 'Aries': 70, 'Leo': 65 },
            'Cáncer': { 'Escorpio': 85, 'Piscis': 80, 'Tauro': 70, 'Virgo': 65 },
            'Leo': { 'Aries': 85, 'Sagitario': 80, 'Géminis': 70, 'Libra': 65 },
            'Virgo': { 'Tauro': 85, 'Capricornio': 80, 'Cáncer': 70, 'Escorpio': 65 },
            'Libra': { 'Géminis': 85, 'Acuario': 80, 'Leo': 70, 'Sagitario': 65 },
            'Escorpio': { 'Cáncer': 85, 'Piscis': 80, 'Tauro': 70, 'Virgo': 65 },
            'Sagitario': { 'Aries': 85, 'Leo': 80, 'Acuario': 70, 'Géminis': 65 },
            'Capricornio': { 'Tauro': 85, 'Virgo': 80, 'Escorpio': 70, 'Piscis': 65 },
            'Acuario': { 'Géminis': 85, 'Libra': 80, 'Sagitario': 70, 'Aries': 65 },
            'Piscis': { 'Cáncer': 85, 'Escorpio': 80, 'Tauro': 70, 'Capricornio': 65 },
          };
          return compat[userSign]?.[targetSign] || 65;
        })()
      : 70,
    chineseAstrology: target.chineseZodiac
      ? calculateChineseCompatibility(user.chineseZodiac, target.chineseZodiac)
      : 70,
    archetype: target.archetype
      ? (() => {
          const compatibleArchetypes: Record<string, string[]> = {
            'El Líder': ['El Constructor', 'El Visionario', 'El Rebelde'],
            'El Constructor': ['El Líder', 'El Guardián', 'El Estoico'],
            'El Visionario': ['El Líder', 'El Innovador', 'El Soñador'],
          };
          const matches = compatibleArchetypes[user.archetype]?.includes(target.archetype) ||
                          compatibleArchetypes[target.archetype]?.includes(user.archetype);
          return matches ? 85 : 60;
        })()
      : 70,
    element: target.element
      ? (() => {
          const userElement = user.element;
          const targetElement = target.element || userElement;
          const relations: Record<string, Record<string, number>> = {
            'Fuego': { 'Fuego': 80, 'Aire': 90, 'Tierra': 60, 'Agua': 40 },
            'Tierra': { 'Tierra': 80, 'Agua': 90, 'Fuego': 60, 'Aire': 40 },
            'Aire': { 'Aire': 80, 'Fuego': 90, 'Agua': 60, 'Tierra': 40 },
            'Agua': { 'Agua': 80, 'Tierra': 90, 'Aire': 60, 'Fuego': 40 },
          };
          return relations[userElement]?.[targetElement] || 65;
        })()
      : 70,
    overall: 0,
  };

  const weights = { numerology: 0.25, westernAstrology: 0.25, chineseAstrology: 0.20, archetype: 0.20, element: 0.10 };
  scores.overall = Math.round(
    scores.numerology * weights.numerology +
    scores.westernAstrology * weights.westernAstrology +
    scores.chineseAstrology * weights.chineseAstrology +
    scores.archetype * weights.archetype +
    scores.element * weights.element
  );

  const strengths: string[] = [];
  const challenges: string[] = [];

  if (scores.numerology >= 75) strengths.push('Resonancia numerológica profunda');
  else if (scores.numerology <= 45) challenges.push('Diferencias en vibración numerológica');

  if (scores.westernAstrology >= 75) strengths.push('Afinidad astrológica natural');
  else if (scores.westernAstrology <= 45) challenges.push('Desalineación zodiacal');

  if (scores.chineseAstrology >= 75) strengths.push('Armonía en el zodiaco chino');
  else if (scores.chineseAstrology <= 45) challenges.push('Ritmos energéticos diferentes');

  if (scores.archetype >= 75) strengths.push('Complementariedad arquetípica');
  else if (scores.archetype <= 45) challenges.push('Arquetipos en tensión');

  if (scores.element >= 75) strengths.push('Compatibilidad elemental');
  else if (scores.element <= 45) challenges.push('Elementos en conflicto');

  const level = scores.overall >= 80 ? 'muy alta' : scores.overall >= 60 ? 'alta' : scores.overall >= 40 ? 'moderada' : 'baja';

  return {
    user,
    target,
    scores,
    strengths: strengths.length > 0 ? strengths : ['Potencial de conexión en áreas no exploradas'],
    challenges: challenges.length > 0 ? challenges : ['Las diferencias son principalmente de estilo y enfoque'],
    narrative: `Existe una compatibilidad ${level} entre tu energía de ${user.archetype} y la esencia de ${target.name || 'esta entidad'}.`,
    insight: `Esta conexión te invita a reflexionar sobre cómo tu propia energía de ${user.archetype} se proyecta en el mundo exterior.`,
  };
}
