import { incrementDailyCost } from "@/lib/kv";

export interface AIUsage {
  inputTokens: number;
  outputTokens: number;
}

/**
 * USD per 1M tokens, as of the models this codebase actually calls
 * (aiEngine.ts's OPENAI_MODEL/ANTHROPIC_MODEL defaults + the ones an env
 * override is likely to point at). Deliberately NOT exhaustive — an unknown
 * model returns null cost (see estimateCostUsd) instead of a silently wrong
 * number, so a future model swap fails loud in the logs rather than quietly
 * under-reporting spend.
 */
const PRICING_USD_PER_MILLION_TOKENS: Record<string, { input: number; output: number }> = {
  "gpt-4o-mini": { input: 0.15, output: 0.6 },
  "gpt-4o": { input: 2.5, output: 10 },
  "gpt-4.1-mini": { input: 0.4, output: 1.6 },
  "claude-3-5-sonnet-20241022": { input: 3, output: 15 },
  "claude-3-5-haiku-20241022": { input: 0.8, output: 4 },
};

export function estimateCostUsd(model: string, usage: AIUsage | undefined): number | null {
  if (!usage) return null;
  const pricing = PRICING_USD_PER_MILLION_TOKENS[model];
  if (!pricing) return null;
  return (usage.inputTokens / 1_000_000) * pricing.input + (usage.outputTokens / 1_000_000) * pricing.output;
}

export type GenerationStatus = "ai" | "fallback" | "error";

export interface GenerationRecord {
  type: string;
  provider: "openai" | "claude" | "openrouter";
  model: string;
  usage?: AIUsage;
  durationMs: number;
  status: GenerationStatus;
  errorReason?: string;
}

/**
 * Structured, per-generation cost record. Two sinks, both best-effort and
 * non-blocking for the caller:
 * 1. A structured log line (console.log, grep/aggregate-able from the
 *    hosting provider's log viewer today — see the [premium_interpretation_served]
 *    comment this pairs with in route.ts).
 * 2. A running daily total in KV (incrementDailyCost) for a rough "how much
 *    are we actually spending" number without needing a dashboard first.
 * Never throws — a lost cost data point must never fail the AI request it's
 * describing.
 */
export async function recordGeneration(record: GenerationRecord): Promise<void> {
  const estimatedCostUsd = estimateCostUsd(record.model, record.usage);

  console.log("[ai_generation]", JSON.stringify({ ...record, estimatedCostUsd }));

  if (estimatedCostUsd != null) {
    try {
      await incrementDailyCost(estimatedCostUsd);
    } catch (error) {
      console.error("[ai_generation] incrementDailyCost failed:", error);
    }
  }
}
