import { NextRequest, NextResponse } from "next/server";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import {
  buildPersonalCode,
  buildPatterns,
  buildDimensions,
  buildDateDimensions,
  buildMomentState,
} from "@/lib/engines/synthesisEngine";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";

interface RequestBody {
  dob: string;
  name?: string;
  includeEnergy?: boolean;
}

function isValidDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const d = new Date(date);
  return !isNaN(d.getTime());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dob, name, includeEnergy = false } = body as RequestBody;

    if (!dob || !isValidDate(dob)) {
      return NextResponse.json({ error: "Invalid or missing birth date" }, { status: 400 });
    }

    const profile = calculateUserProfile(name || "", dob);

    const result: any = {
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

function sanitizePersonalCode(pc: any) {
  return {
    lifePath: { number: pc.lifePath.number, name: pc.lifePath.name, meaning: pc.lifePath.meaning },
    expression: pc.expression ? { number: pc.expression.number, name: pc.expression.name, meaning: pc.expression.meaning } : undefined,
    soul: pc.soul ? { number: pc.soul.number, name: pc.soul.name, meaning: pc.soul.meaning } : undefined,
    personality: pc.personality ? { number: pc.personality.number, name: pc.personality.name, meaning: pc.personality.meaning } : undefined,
  };
}

function sanitizePatterns(patterns: any[]) {
  return patterns.map((p) => ({
    label: p.label,
    keyword: p.keyword,
    description: p.description,
    sources: p.sources,
  }));
}

function sanitizeDimensionInsight(dims: any[]) {
  return dims.map((d) => ({
    dimension: d.dimension,
    value: d.value,
    influences: d.influences,
    explanation: d.explanation,
  }));
}

function sanitizeMomentState(state: any) {
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

function sanitizeEnergy(energy: any) {
  return {
    overallScore: energy.overallScore,
    energy: energy.energy,
    level: energy.level,
    theme: energy.theme,
    description: energy.description,
    recommendation: energy.recommendation,
    color: energy.color,
    strengths: energy.strengths,
    cautions: energy.cautions,
    areas: energy.areas,
    moonPhase: energy.moonPhase,
  };
}
