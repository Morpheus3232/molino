import {
  calculateLifePath,
  calculateExpressionNumber,
  calculateSoulNumber,
  calculateBirthDayNumber,
  calculateLuckyNumber,
} from "./numerologyEngine";
import { getSunSign, getSunSignInfo, getMoonSign, getElement, getModality } from "./astrologyEngine";
import { getChineseZodiac, getChineseZodiacInfo, getLunarYear } from "./chineseZodiacEngine";
import { getPersonalYear, getPersonalDayForDate } from "@/lib/calculations";
import type { UserProfileData, InterpretedUserProfile } from "@/types/profile";
import type { UserProfile } from "@/types/user";
import { ProfileInterpreter } from "@/lib/interpreter/profileInterpreter";
import type { WesternSign, WesternElement, Modality } from "@/lib/data/facts/astrology-facts";
import type { ChineseAnimal, ChineseElement } from "@/lib/data/facts/chinese-zodiac-facts";

export type { UserProfile } from "@/types/user";
export type { UserProfileData, InterpretedUserProfile } from "@/types/profile";

/**
 * Pure factual computation of user profile data.
 * Produces 100% serializable numbers, signs, animals, and cycles.
 */
export function calculateUserProfileData(
  name: string,
  birthDate: string,
  overrides?: Partial<UserProfileData>
): UserProfileData {
  const lifePath = calculateLifePath(birthDate);
  const sunSign = getSunSign(birthDate) as WesternSign;
  const sunElement = getElement(sunSign) as WesternElement;
  const sunModality = getModality(sunSign) as Modality;

  const moonSign = getMoonSign(birthDate, overrides?.birthTime) as WesternSign;
  const moonElement = getElement(moonSign) as WesternElement;

  const chineseInfo = getChineseZodiacInfo(birthDate);
  const chineseZodiac = chineseInfo.animal as ChineseAnimal;
  const chineseElement = chineseInfo.element as ChineseElement;
  const lunarYear = chineseInfo.lunarYear || getLunarYear(birthDate);

  const now = new Date();
  const birthParts = birthDate.split("-").map((part) => parseInt(part, 10));
  const birthDay = Number.isFinite(birthParts[2]) ? birthParts[2] : now.getDate();
  const birthMonth = Number.isFinite(birthParts[1]) ? birthParts[1] : now.getMonth() + 1;
  const birthYear = Number.isFinite(birthParts[0]) ? birthParts[0] : now.getFullYear();

  const personalYear = getPersonalYear(birthDay, birthMonth, birthYear, now.getFullYear());
  const personalMonth = getPersonalYear(
    birthDay,
    birthMonth,
    birthYear,
    now.getFullYear(),
    undefined,
    now.getMonth() + 1
  );
  const personalDay = getPersonalDayForDate(birthDay, birthMonth, birthYear, now);
  const luckyNumber = calculateLuckyNumber(birthMonth, birthYear);

  return {
    id: overrides?.id,
    name,
    birthDate,
    birthPlace: overrides?.birthPlace || "",
    birthTime: overrides?.birthTime,
    goal: overrides?.goal || "life",
    interests: overrides?.interests || [],
    onboardingStep: overrides?.onboardingStep || 1,
    completedSections: overrides?.completedSections || [],
    theme: overrides?.theme || "light",
    language: overrides?.language || "es",
    notifications: overrides?.notifications ?? true,

    // Numerology Facts
    lifePath,
    expressionNumber: name ? calculateExpressionNumber(name) : undefined,
    soulNumber: name ? calculateSoulNumber(name) : undefined,
    personalityNumber: calculateBirthDayNumber(birthDay),
    luckyNumber,

    // Astrology Facts
    sunSign,
    sunElement,
    sunModality,
    moonSign,
    moonElement,

    // Chinese Zodiac Facts
    chineseZodiac,
    chineseElement,
    lunarYear,

    // Cycles Facts
    cycles: {
      personalYear,
      personalMonth,
      personalDay,
    },
  };
}

/**
 * Orchestration function: calculates facts and enriches with localized interpretations.
 * Fully backward-compatible with all existing components.
 */
export function calculateUserProfile(
  name: string,
  birthDate: string,
  overrides?: Partial<UserProfile>
): UserProfile {
  const data = calculateUserProfileData(name, birthDate, overrides as Partial<UserProfileData>);
  const language = overrides?.language || "es";
  return ProfileInterpreter.toUserProfile(data, language);
}
