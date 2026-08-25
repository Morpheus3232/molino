import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import { buildPersonalCode, buildPatterns, buildMomentState } from "@/lib/engines/synthesisEngine";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import { buildConvergence } from "@/lib/engines/convergentEngine";
import { calculateCompatibility } from "@/lib/engines/compatibilityEngine";
import { getProfileSalt } from "@/lib/profile-salt";

export interface SynthesisResult {
  personalCode: {
    lifePath: { number: number; name: string; meaning: string };
    expression?: { number: number; name: string; meaning: string };
    soul?: { number: number; name: string; meaning: string };
    personality?: { number: number; name: string; meaning: string };
  };
  patterns: Array<{
    label: string;
    keyword: string;
    description: string;
    sources: string[];
  }>;
  dailyEnergy?: {
    overallScore: number;
    theme: string;
    description: string;
    strengths: string[];
    cautions: string[];
    areas: Record<string, { score: number; label: string }>;
    moonPhase: { phase: string; emoji: string; description: string };
    personalDay: number;
    personalYear: number;
    personalMonth: number;
    elementInfluence: string;
    explanation: string;
  };
  momentState?: {
    energyScore: number;
    energyTheme: string;
    cycleName: string;
    cycleDescription: string;
    personalDay: number;
    personalMonth: number;
    personalYear: number;
    narrative: string;
    focus: string;
  };
}

export interface ConvergenceResult {
  layers: Array<{
    id: string;
    name: string;
    value: string | number;
    emoji: string;
    description: string;
  }>;
  convergentCount: number;
  totalLayers: number;
  convergenceLevel: "strong" | "moderate" | "low";
  message: string;
  insight: string;
}

export type { CompatibilityResult as CompatibilityAPIResult } from "@/lib/engines/compatibilityEngine";

export interface MolinoInterpretationResult {
  summary: string;
  alignment: string;
  timing: string;
  strengths: string[];
  tensions: string[];
  whatToConsider: string[];
  suggestedNextStep: string;
  confidence: string;
  limitations: string[];
}

export interface InterpretationResponse {
  fallback: MolinoInterpretationResult;
  ai: MolinoInterpretationResult | null;
  error?: string;
}

/**
 * Synthesis, convergence and compatibility are pure symbolic calculations —
 * they run entirely in the browser so birth data never leaves the client.
 * Only fetchInterpretation talks to the server, because it calls an external
 * LLM with a secret API key.
 */
export async function fetchSynthesis(dob: string, name?: string, includeEnergy = false): Promise<SynthesisResult> {
  const profile = calculateUserProfile(name || "", dob);

  const result: SynthesisResult = {
    personalCode: buildPersonalCode(profile),
    patterns: buildPatterns(profile),
  };

  if (includeEnergy) {
    const energy = calculateDailyEnergy(profile);
    result.dailyEnergy = energy;
    result.momentState = buildMomentState(profile, energy.overallScore, energy.theme);
  }

  return result;
}

export async function fetchConvergence(dob: string, name?: string): Promise<{ convergence: ConvergenceResult; momentState: SynthesisResult["momentState"]; dailyEnergy: SynthesisResult["dailyEnergy"] }> {
  const profile = calculateUserProfile(name || "", dob);

  const convergence = buildConvergence(profile);
  const energy = calculateDailyEnergy(profile);
  const momentState = buildMomentState(profile, energy.overallScore, energy.theme);

  return { convergence, momentState, dailyEnergy: energy };
}

export async function fetchCompatibility(
  dob: string,
  target: {
    lifePath?: number;
    birthDate?: string;
    sunSign?: string;
    chineseZodiac?: string;
    archetype?: string;
    element?: string;
    name?: string;
  }
) {
  const profile = calculateUserProfile("", dob);
  return calculateCompatibility(profile, target);
}

export async function fetchInterpretation(
  type: string,
  dob: string,
  name: string,
  params: {
    dailyEnergy?: unknown;
    timing?: unknown;
    compatibility?: unknown;
    entity?: unknown;
    decision?: unknown;
    question?: string;
    provider?: "openai" | "claude";
  }
): Promise<InterpretationResponse> {
  const response = await fetch("/api/intelligence/interpret", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, dob, name, salt: getProfileSalt(), ...params }),
  });

  if (!response.ok) {
    throw new Error(`Interpretation API error: ${response.status}`);
  }

  return response.json() as Promise<InterpretationResponse>;
}
