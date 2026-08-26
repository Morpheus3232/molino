import type { MasterNumber } from "@/lib/data/facts/numerology-facts";
import type { WesternSign, WesternElement, Modality } from "@/lib/data/facts/astrology-facts";
import type { ChineseAnimal, ChineseElement } from "@/lib/data/facts/chinese-zodiac-facts";
import type { BirthDayReduction } from "@/lib/engines/numerologyEngine";

export type { BirthDayReduction } from "@/lib/engines/numerologyEngine";

/**
 * Pure, 100% serializable factual user profile data.
 * Contains only numbers, IDs, date strings, and structural enums.
 * Free of UI prose, explanations, or localized narrative texts.
 */
export interface UserProfileData {
  id?: string;
  name?: string;
  birthDate: string; // YYYY-MM-DD
  birthPlace?: string;
  birthTime?: string; // HH:mm
  goal?: "life" | "love" | "career" | "business" | "growth";
  interests?: string[];
  onboardingStep?: number;
  completedSections?: string[];
  theme?: "light" | "dark";
  language?: "es" | "en" | "pt-BR";
  notifications?: boolean;

  // 1. Numerology Facts
  lifePath: number; // 1-9, 11, 22, 33
  birthDay?: BirthDayReduction;
  expressionNumber?: number;
  personalityNumber?: number;
  luckyNumber: number;

  // 2. Astrology Facts
  sunSign: WesternSign;
  sunElement: WesternElement;
  sunModality: Modality;
  moonSign?: WesternSign;
  moonElement?: WesternElement;

  // 3. Chinese Zodiac Facts
  chineseZodiac: ChineseAnimal;
  chineseElement: ChineseElement;
  lunarYear: number;

  // 4. Cycles Facts
  cycles: {
    personalYear: number;
    personalMonth: number;
    personalDay: number;
  };
}

/**
 * Enriched user profile containing both factual calculations
 * and localized interpretive texts. Compatible with existing UserProfile.
 */
export interface InterpretedUserProfile extends UserProfileData {
  element: string;
  modality: string;
  archetype: string;
  archetypeInfo: {
    name: string;
    keywords: string[];
    strengths: string[];
    challenges: string[];
    essence?: string;
  };
  sunSignInfo: {
    sign: string;
    element: string;
    modality: string;
    symbol?: string;
  };
  chineseZodiacInfo: {
    animal: string;
    element: string;
    emoji?: string;
  };
  recommendations: {
    strengths: string[];
    challenges: string[];
    practices: string[];
  };
}
