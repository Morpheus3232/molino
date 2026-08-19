import { NextRequest, NextResponse } from "next/server";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import {
  buildPersonalCode,
  buildPatterns,
  buildDimensions,
  buildDateDimensions,
  buildMomentState,
  type PersonalCode,
  type PatternInsight,
  type DimensionInsight,
  type MomentState,
} from "@/lib/engines/synthesisEngine";
import { calculateDailyEnergy, type DailyEnergyResult } from "@/lib/engines/dailyEnergyEngine";
import { isValidDate } from "@/lib/validation";

interface RequestBody {
  dob: string;
  name?: string;
  includeEnergy?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dob, name, includeEnergy = false } = body as RequestBody;

    if (!dob || !isValidDate(dob)) {
      return NextResponse.json({ error: "Invalid or missing birth date" }, { status: 400 });
    }

    const profile = calculateUserProfile(name || "", dob);

    const result: Record<string, unknown> = {
      personalCode: sanitizePersonalCode(buildPersonalCode(profile)),
      patterns: sanitizePatterns(buildPatterns(profile)),
      dimensions: sanitizeDimensionInsight(buildDimensions(profile)),
      dateDimensions: sanitizeDimensionInsight(buildDateDimensions(profile)),
    };

    if (includeEnergy) {
      const energy = calculateDailyEnergy(profile);
      result.dailyEnergy = sanitizeEnergy(energy);
      const momentState = buildMomentState(profile, energy.overallScore, energy.theme);
      result.momentState = sanitizeMomentState(momentState);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[/api/synthesis/calculate] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

function sanitizePersonalCode(pc: PersonalCode) {
  return {
    lifePath: { number: pc.lifePath.number, name: pc.lifePath.name, meaning: pc.lifePath.meaning },
    expression: pc.expression ? { number: pc.expression.number, name: pc.expression.name, meaning: pc.expression.meaning } : undefined,
    soul: pc.soul ? { number: pc.soul.number, name: pc.soul.name, meaning: pc.soul.meaning } : undefined,
    personality: pc.personality ? { number: pc.personality.number, name: pc.personality.name, meaning: pc.personality.meaning } : undefined,
  };
}

function sanitizePatterns(patterns: PatternInsight[]) {
  return patterns.map((p) => ({
    label: p.label,
    keyword: p.keyword,
    description: p.description,
    sources: p.sources,
  }));
}

function sanitizeDimensionInsight(dims: DimensionInsight[]) {
  return dims.map((d) => ({
    dimension: d.dimension,
    value: d.value,
    influences: d.influences,
    explanation: d.explanation,
  }));
}

function sanitizeMomentState(state: MomentState) {
  return {
    energyScore: state.energyScore,
    energyTheme: state.energyTheme,
    cycleName: state.cycleName,
    cycleDescription: state.cycleDescription,
    personalDay: state.personalDay,
    personalMonth: state.personalMonth,
    personalYear: state.personalYear,
    narrative: state.narrative,
    focus: state.focus,
  };
}

function sanitizeEnergy(energy: DailyEnergyResult) {
  return {
    overallScore: energy.overallScore,
    theme: energy.theme,
    description: energy.description,
    strengths: energy.strengths,
    cautions: energy.cautions,
    areas: energy.areas,
    moonPhase: energy.moonPhase,
  };
}
