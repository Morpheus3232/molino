import type { UserProfile } from '@/types/user';
import type { CompatibilityResult } from '../compatibilityEngine';
import type { DailyEnergyResult } from '../dailyEnergyEngine';
import type { TimingResult } from '../timingEngine';
import type { DecisionResult } from '../decisionsEngine';
import type { EntityProfile } from '@/lib/data/entities';
import type { MolinoContext } from './types';

/**
 * Build a MolinoContext from user profile and optional modules.
 * All data is deterministic - no AI calls here.
 */
export function buildMolinoContext(
  profile: UserProfile,
  options: {
    dailyEnergy?: DailyEnergyResult;
    timing?: TimingResult;
    compatibility?: CompatibilityResult;
    entity?: EntityProfile;
    decision?: DecisionResult;
  } = {}
): MolinoContext {
  return {
    userProfile: {
      name: profile.name || '',
      lifePath: profile.lifePath,
      archetype: profile.archetype,
      sunSign: profile.sunSign,
      element: profile.element,
      modality: profile.modality,
      chineseZodiac: profile.chineseZodiac,
      chineseElement: profile.chineseZodiacInfo?.element || '',
      expressionNumber: profile.expressionNumber,
      personalityNumber: profile.personalityNumber,
      personalYear: profile.cycles?.personalYear || 0,
      personalMonth: profile.cycles?.personalMonth || 0,
      personalDay: profile.cycles?.personalDay || 0,
    },
    numerology: {
      lifePath: profile.lifePath,
      expressionNumber: profile.expressionNumber,
      personalityNumber: profile.personalityNumber,
      archetype: profile.archetype,
      // ARCHETYPE_DESCRIPTIONS (numerologyEngine.ts) no tiene un campo
      // `.description` — solo `keywords`/`strengths`/`challenges`. Leer
      // `.description` devolvía siempre '' para cualquier perfil real,
      // apagando en silencio la rama de texto más específica en
      // generateFallbackInterpretation. `keywords` sí existe siempre (3 por
      // arquetipo) — se usa para construir una frase real, no fabricada.
      archetypeDescription: profile.archetypeInfo?.keywords?.length
        ? `Tu arquetipo se define por ${profile.archetypeInfo.keywords.join(', ').toLowerCase()}.`
        : '',
      archetypeChallenges: profile.archetypeInfo?.challenges || [],
      archetypeStrengths: profile.archetypeInfo?.strengths || [],
    },
    astrology: {
      sunSign: profile.sunSign,
      element: profile.element,
      modality: profile.modality,
      symbol: profile.sunSignInfo?.symbol || '',
    },
    chineseZodiac: {
      animal: profile.chineseZodiac,
      element: profile.chineseZodiacInfo?.element || '',
    },
    cycles: {
      personalYear: profile.cycles?.personalYear || 0,
      personalMonth: profile.cycles?.personalMonth || 0,
      personalDay: profile.cycles?.personalDay || 0,
    },
    dailyEnergy: options.dailyEnergy,
    timing: options.timing,
    compatibility: options.compatibility,
    entity: options.entity,
    decision: options.decision,
  };
}
