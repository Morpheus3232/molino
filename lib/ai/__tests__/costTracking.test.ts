import { describe, it, expect } from "vitest";
import { estimateCostUsd } from "../costTracking";

describe("estimateCostUsd", () => {
  it("computes cost from input/output tokens at the model's per-million rate", () => {
    // gpt-4o-mini: $0.15/1M input, $0.60/1M output
    const cost = estimateCostUsd("gpt-4o-mini", { inputTokens: 1_000_000, outputTokens: 1_000_000 });
    expect(cost).toBeCloseTo(0.75, 5);
  });

  it("scales linearly with token count", () => {
    const half = estimateCostUsd("gpt-4o-mini", { inputTokens: 500_000, outputTokens: 0 });
    const full = estimateCostUsd("gpt-4o-mini", { inputTokens: 1_000_000, outputTokens: 0 });
    expect(full).toBeCloseTo((half as number) * 2, 5);
  });

  it("returns null for an unpriced model instead of a silently wrong estimate", () => {
    expect(estimateCostUsd("some-future-model-not-in-the-table", { inputTokens: 100, outputTokens: 100 })).toBeNull();
  });

  it("returns null when no usage is available", () => {
    expect(estimateCostUsd("gpt-4o-mini", undefined)).toBeNull();
  });

  it("a single personal_profile-sized generation (~1.5k in, ~600 out) lands well inside the $0.50-1.50/user target", () => {
    const cost = estimateCostUsd("gpt-4o-mini", { inputTokens: 1500, outputTokens: 600 }) as number;
    expect(cost).toBeGreaterThan(0);
    expect(cost).toBeLessThan(0.01);
  });
});
