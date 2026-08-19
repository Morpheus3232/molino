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
  dimensions: Array<{
    dimension: string;
    value: number;
    influences: string[];
    explanation: string;
  }>;
  dateDimensions: Array<{
    dimension: string;
    value: number;
    influences: string[];
    explanation: string;
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

export interface CompatibilityAPIResult {
  user: Record<string, unknown>;
  target: Record<string, unknown> | null;
  scores: {
    numerology: number;
    westernAstrology: number;
    chineseAstrology: number;
    archetype: number;
    element: number;
    overall: number;
  };
  strengths: string[];
  challenges: string[];
  narrative: string;
  insight: string;
}

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

const CACHE = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL = 60000;

export async function fetchSynthesis(dob: string, name?: string, includeEnergy = false): Promise<SynthesisResult> {
  const key = `synthesis:${dob}:${name || ""}:${includeEnergy}`;
  const cached = CACHE.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.data as SynthesisResult;
  }

  const response = await fetch("/api/synthesis/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dob, name, includeEnergy }),
  });

  if (!response.ok) {
    throw new Error(`Synthesis API error: ${response.status}`);
  }

  const data = await response.json();
  CACHE.set(key, { data, ts: Date.now() });
  return data as SynthesisResult;
}

export async function fetchConvergence(dob: string, name?: string): Promise<{ convergence: ConvergenceResult; momentState: SynthesisResult["momentState"]; dailyEnergy: SynthesisResult["dailyEnergy"] }> {
  const key = `convergence:${dob}:${name || ""}`;
  const cached = CACHE.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.data as { convergence: ConvergenceResult; momentState: SynthesisResult["momentState"]; dailyEnergy: SynthesisResult["dailyEnergy"] };
  }

  const response = await fetch("/api/convergence/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dob, name }),
  });

  if (!response.ok) {
    throw new Error(`Convergence API error: ${response.status}`);
  }

  const data = await response.json();
  CACHE.set(key, { data, ts: Date.now() });
  return data;
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
): Promise<CompatibilityAPIResult> {
  const key = `compatibility:${dob}:${JSON.stringify(target)}`;
  const cached = CACHE.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.data as CompatibilityAPIResult;
  }

  const response = await fetch("/api/compatibility/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dob, target }),
  });

  if (!response.ok) {
    throw new Error(`Compatibility API error: ${response.status}`);
  }

  const data = await response.json();
  CACHE.set(key, { data, ts: Date.now() });
  return data as CompatibilityAPIResult;
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
    body: JSON.stringify({ type, dob, name, ...params }),
  });

  if (!response.ok) {
    throw new Error(`Interpretation API error: ${response.status}`);
  }

  return response.json() as Promise<InterpretationResponse>;
}
