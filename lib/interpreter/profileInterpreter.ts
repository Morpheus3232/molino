/**
 * Profile Interpreter — Translates pure UserProfileData into localized texts & narratives.
 * Decouples factual calculations from UI strings and i18n copy.
 */

import type { UserProfileData, InterpretedUserProfile } from "@/types/profile";
import type { UserProfile } from "@/types/user";
import { NUMEROLOGY_ARCHETYPES_ES, PERSONAL_YEAR_INTERPRETATIONS_ES } from "@/lib/data/interpretations/numerology-interpretations";
import { SIGN_INTERPRETATIONS_ES } from "@/lib/data/interpretations/astrology-interpretations";
import { SIGN_FACTS, ZODIAC_SYMBOLS } from "@/lib/data/facts/astrology-facts";
import { ANIMAL_INTERPRETATIONS_ES } from "@/lib/data/interpretations/chinese-zodiac-interpretations";
import { ANIMAL_EMOJIS } from "@/lib/data/facts/chinese-zodiac-facts";

export class ProfileInterpreter {
  /**
   * Enriches raw UserProfileData with localized interpretations.
   */
  static interpret(data: UserProfileData, language: "es" | "en" | "pt-BR" = "es"): InterpretedUserProfile {
    const lifePath = data.lifePath;
    const archetypeData = NUMEROLOGY_ARCHETYPES_ES[lifePath] || NUMEROLOGY_ARCHETYPES_ES[1];
    const signFact = SIGN_FACTS[data.sunSign] || SIGN_FACTS.Aries;
    const signInterpretation = SIGN_INTERPRETATIONS_ES[data.sunSign] || SIGN_INTERPRETATIONS_ES.Aries;
    const animalInterpretation = ANIMAL_INTERPRETATIONS_ES[data.chineseZodiac] || ANIMAL_INTERPRETATIONS_ES.Rata;
    const animalEmoji = ANIMAL_EMOJIS[data.chineseZodiac] || "✨";

    const baseStrength =
      archetypeData.strengths?.length > 0
        ? archetypeData.strengths.slice(0, 4)
        : ["Aprendizaje", "Flexibilidad", "Conexión"];

    const baseChallenge =
      archetypeData.challenges?.length > 0
        ? archetypeData.challenges.slice(0, 3)
        : ["Indecisión", "Dispersión", "Inconstancia"];

    const practices = [
      "Registrá 3 logros pequeños por semana.",
      "Dedicá 10 minutos a respirar o escribir sin filtro.",
      "Elegí una palabra foco para el mes y revisala cada domingo.",
    ];

    return {
      ...data,
      element: signFact.element,
      modality: signFact.modality,
      archetype: archetypeData.name,
      archetypeInfo: {
        name: archetypeData.name,
        keywords: archetypeData.keywords,
        strengths: archetypeData.strengths,
        challenges: archetypeData.challenges,
        essence: archetypeData.essence,
      },
      sunSignInfo: {
        sign: data.sunSign,
        element: signFact.element,
        modality: signFact.modality,
        symbol: ZODIAC_SYMBOLS[data.sunSign] || signFact.symbol,
      },
      chineseZodiacInfo: {
        animal: data.chineseZodiac,
        element: data.chineseElement,
        emoji: animalEmoji,
      },
      recommendations: {
        strengths: baseStrength,
        challenges: baseChallenge,
        practices,
      },
    };
  }

  /**
   * Translates an InterpretedUserProfile into standard backward-compatible UserProfile.
   */
  static toUserProfile(data: UserProfileData, language: "es" | "en" | "pt-BR" = "es"): UserProfile {
    const interpreted = this.interpret(data, language);

    return {
      id: interpreted.id,
      name: interpreted.name || "",
      birthDate: interpreted.birthDate,
      birthPlace: interpreted.birthPlace || "",
      birthTime: interpreted.birthTime,
      goal: interpreted.goal || "life",
      interests: interpreted.interests || [],
      onboardingStep: interpreted.onboardingStep || 1,
      completedSections: interpreted.completedSections || ["identity"],
      theme: interpreted.theme || "light",
      language: interpreted.language || "es",
      notifications: interpreted.notifications ?? true,
      lifePath: interpreted.lifePath,
      birthDay: interpreted.birthDay,
      expressionNumber: interpreted.expressionNumber,
      personalityNumber: interpreted.personalityNumber,
      luckyNumber: interpreted.luckyNumber,
      sunSign: interpreted.sunSign,
      sunSignInfo: interpreted.sunSignInfo,
      chineseZodiac: interpreted.chineseZodiac,
      chineseZodiacInfo: interpreted.chineseZodiacInfo,
      element: interpreted.element,
      modality: interpreted.modality,
      archetype: interpreted.archetype,
      archetypeInfo: interpreted.archetypeInfo,
      cycles: interpreted.cycles,
      recommendations: interpreted.recommendations,
    };
  }
}
