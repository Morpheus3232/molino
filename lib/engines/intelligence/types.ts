/**
 * Shared types for the Intelligence Engine — the context/request/response
 * contract shared by buildMolinoContext, buildIntelligencePrompt, and
 * generateFallbackInterpretation. No logic here.
 */

import type { CompatibilityResult } from '../compatibilityEngine';
import type { DailyEnergyResult } from '../dailyEnergyEngine';
import type { TimingResult } from '../timingEngine';
import type { DecisionResult } from '../decisionsEngine';
import type { EntityProfile } from '@/lib/data/entities';

export interface MolinoContext {
  userProfile: {
    name: string;
    lifePath: number;
    archetype: string;
    sunSign: string;
    element: string;
    modality: string;
    chineseZodiac: string;
    chineseElement: string;
    expressionNumber?: number;
    personalityNumber?: number;
    personalYear: number;
    personalMonth: number;
    personalDay: number;
  };
  numerology: {
    lifePath: number;
    baseVibration?: number;
    expressionNumber?: number;
    personalityNumber?: number;
    archetype: string;
    archetypeDescription: string;
    archetypeChallenges: string[];
    archetypeStrengths: string[];
  };
  astrology: {
    sunSign: string;
    moonSign?: string;
    ascendant?: string;
    element: string;
    modality: string;
    symbol: string;
  };
  chineseZodiac: {
    animal: string;
    element: string;
    polarity?: string;
    branch?: string;
  };
  cycles: {
    personalYear: number;
    personalMonth: number;
    personalDay: number;
  };
  dailyEnergy?: DailyEnergyResult;
  timing?: TimingResult;
  compatibility?: CompatibilityResult;
  entity?: EntityProfile;
  decision?: DecisionResult;
}

export type InterpretationType =
  | 'personal_profile'
  | 'daily_energy'
  | 'timing'
  | 'compatibility'
  | 'decision'
  | 'pattern'
  | 'question';

/** A prior question/answer pair from the current chat session only — never persisted. */
export interface ConversationTurn {
  question: string;
  answer: string;
  /** Compact highlights of the reading-level interpretation (corePattern,
   * howYouOperate, closingSynthesis) so follow-up questions keep the same
   * structural grounding without re-sending the whole object. Optional. */
  answerHighlights?: string;
}

/**
 * Structural context from the premium reading (type=personal_profile) that the
 * user just unlocked. The chat sends it once per question so the model can
 * answer against the SAME interpretation the user already read — never
 * repeating the reading verbatim, just grounding on it. Never persisted.
 */
export interface ReadingContext {
  summary?: string;
  corePattern?: { what?: string; source?: string };
  howYouOperate?: string;
  closingSynthesis?: string;
  tensions?: string[];
  alignment?: string;
  timing?: string;
  strengths?: string[];
  whatToConsider?: string[];
  suggestedNextStep?: string;
  opening?: string;
  relationalNote?: string;
}

export interface InterpretationRequest {
  type: InterpretationType;
  context: MolinoContext;
  question?: string;
  template?: string;
  conversationHistory?: ConversationTurn[];
  readingContext?: ReadingContext;
}

export interface MolinoInterpretation {
  summary: string;
  alignment: string;
  timing: string;
  strengths: string[];
  tensions: string[];
  whatToConsider: string[];
  suggestedNextStep: string;
  suggestedQuestions?: string[];
  confidence: string;
  limitations: string[];
  rawContext: MolinoContext;
  /**
   * Narrative extension, populated only for type "personal_profile" (the paid
   * synthesis). Optional and additive so the other interpretation types
   * (daily_energy, timing, compatibility, decision, pattern) are unaffected.
   */
  opening?: string;
  corePattern?: {
    what: string;
    source: string;
    whyItMatters: string;
  };
  howYouOperate?: string;
  relationalNote?: string;
  closingSynthesis?: string;
  /**
   * El punto ciego: lo que el patrón produce sin que la persona lo vea. Es
   * el campo con el registro más frontal de toda la lectura — nombra el
   * costo, no solo la cualidad.
   */
  blindSpot?: string;
  /**
   * El patrón aterrizado en tres dominios concretos. Existe porque
   * "howYouOperate" describe el mecanismo en abstracto y la lectura paga
   * necesitaba decir qué pasa específicamente en el trabajo, en los
   * vínculos y al decidir.
   */
  lifeAreas?: {
    work: string;
    relationships: string;
    decisions: string;
  };
}
