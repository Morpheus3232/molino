export { calculateUserProfile, type UserProfile } from './profileBuilder';

import { calculateNumerologyCompatibility } from './numerologyEngine';
import { calculateChineseCompatibility } from './chineseZodiacEngine';
import type { UserProfile } from '@/types/user';
import type { CompatibilityTarget } from '@/types/compatibility';

export type { CompatibilityTarget } from '@/types/compatibility';

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
  target: CompatibilityTarget;
  scores: CompatibilityScore;
  strengths: string[];
  challenges: string[];
  narrative: string;
  insight: string;
}

export function calculateCompatibility(
  user: UserProfile,
  target: CompatibilityTarget
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
