import { NextRequest, NextResponse } from "next/server";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import { buildConvergence, type Convergence, type ConvergentLayer } from "@/lib/engines/convergentEngine";
import { isValidDate } from "@/lib/validation";
import { buildMomentState, type MomentState } from "@/lib/engines/synthesisEngine";
import { calculateDailyEnergy, type DailyEnergyResult } from "@/lib/engines/dailyEnergyEngine";

interface RequestBody {
  dob: string;
  name?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dob, name } = body as RequestBody;

    if (!dob || !isValidDate(dob)) {
      return NextResponse.json({ error: "Invalid or missing birth date" }, { status: 400 });
    }

    const profile = calculateUserProfile(name || "", dob);

    const convergence = buildConvergence(profile);
    const energy = calculateDailyEnergy(profile);
    const momentState = buildMomentState(profile, energy.overallScore, energy.theme);

    return NextResponse.json({
      convergence: sanitizeConvergence(convergence),
      momentState: sanitizeMomentState(momentState),
      dailyEnergy: sanitizeEnergy(energy),
    });
  } catch (error) {
    console.error("[/api/convergence/calculate] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

function sanitizeConvergence(c: Convergence) {
  return {
    layers: c.layers.map((l: ConvergentLayer) => ({
      id: l.id,
      name: l.name,
      value: l.value,
      emoji: l.emoji,
      description: l.description,
    })),
    convergentCount: c.convergentCount,
    totalLayers: c.totalLayers,
    convergenceLevel: c.convergenceLevel,
    message: c.message,
    insight: c.insight,
  };
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
    personalDay: energy.personalDay,
    personalYear: energy.personalYear,
    personalMonth: energy.personalMonth,
    elementInfluence: energy.elementInfluence,
    explanation: energy.explanation,
  };
}
