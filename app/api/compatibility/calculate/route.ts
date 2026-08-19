import { NextRequest, NextResponse } from "next/server";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import { calculateCompatibility, type CompatibilityResult } from "@/lib/engines/compatibilityEngine";
import { isValidDate } from "@/lib/validation";
import type { UserProfile } from "@/types/user";

interface RequestBody {
  dob: string;
  name?: string;
  target?: {
    lifePath?: number;
    birthDate?: string;
    sunSign?: string;
    chineseZodiac?: string;
    archetype?: string;
    element?: string;
    name?: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dob, name, target } = body as RequestBody;

    if (!dob || !isValidDate(dob)) {
      return NextResponse.json({ error: "Invalid or missing birth date" }, { status: 400 });
    }

    const profile = calculateUserProfile(name || "", dob);

    if (target) {
      const result = calculateCompatibility(profile, { ...target });
      return NextResponse.json(sanitizeCompatibility(result));
    }

    const profileData = sanitizeProfileForClient(profile);
    return NextResponse.json({ profile: profileData });
  } catch (error) {
    console.error("[/api/compatibility/calculate] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

function sanitizeProfileForClient(profile: UserProfile) {
  return {
    name: profile.name,
    birthDate: profile.birthDate,
    lifePath: profile.lifePath,
    expressionNumber: profile.expressionNumber,
    soulNumber: profile.soulNumber,
    personalityNumber: profile.personalityNumber,
    sunSign: profile.sunSign,
    sunSignInfo: profile.sunSignInfo
      ? { sign: profile.sunSignInfo.sign, element: profile.sunSignInfo.element, modality: profile.sunSignInfo.modality, symbol: profile.sunSignInfo.symbol }
      : undefined,
    chineseZodiac: profile.chineseZodiac,
    chineseZodiacInfo: profile.chineseZodiacInfo,
    element: profile.element,
    modality: profile.modality,
    archetype: profile.archetype,
    archetypeInfo: profile.archetypeInfo,
    luckyNumber: profile.luckyNumber,
    recommendations: profile.recommendations
      ? {
          strengths: profile.recommendations.strengths,
          challenges: profile.recommendations.challenges,
          practices: profile.recommendations.practices,
        }
      : undefined,
    cycles: profile.cycles
      ? {
          personalYear: profile.cycles.personalYear,
          personalDay: profile.cycles.personalDay,
          personalMonth: profile.cycles.personalMonth,
        }
      : undefined,
  };
}

function sanitizeCompatibility(result: CompatibilityResult) {
  return {
    user: sanitizeProfileForClient(result.user),
    target: result.target,
    scores: result.scores,
    strengths: result.strengths,
    challenges: result.challenges,
    narrative: result.narrative,
    insight: result.insight,
  };
}
