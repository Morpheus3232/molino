import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAsyncCalculation } from "@/lib/hooks/useAsyncCalculation";

describe("useAsyncCalculation Hook & Worker Engine", () => {
  it("calculates a user profile asynchronously without blocking", async () => {
    const { result } = renderHook(() => useAsyncCalculation());

    let profile: any;
    await act(async () => {
      profile = await result.current.calculateProfileAsync("Ana", "1990-03-15");
    });

    expect(profile).toBeDefined();
    expect(profile.lifePath).toBe(1);
    expect(profile.sunSign).toBe("Piscis");
    expect(profile.chineseZodiac).toBe("Caballo");
    expect(result.current.isCalculating).toBe(false);
  });

  it("calculates couple compatibility asynchronously", async () => {
    const { result } = renderHook(() => useAsyncCalculation());

    let profileA: any;
    let profileB: any;
    let compatibility: any;

    await act(async () => {
      profileA = await result.current.calculateProfileAsync("Ana", "1990-03-15");
      profileB = await result.current.calculateProfileAsync("Lucas", "1988-07-22");
      compatibility = await result.current.calculateCoupleAsync(profileA, profileB);
    });

    expect(compatibility).toBeDefined();
    expect(compatibility.score).toBeGreaterThanOrEqual(0);
    expect(compatibility.connections).toBeDefined();
    expect(compatibility.challenges).toBeDefined();
  });

  it("calculates daily energy asynchronously", async () => {
    const { result } = renderHook(() => useAsyncCalculation());

    let profile: any;
    let daily: any;

    await act(async () => {
      profile = await result.current.calculateProfileAsync("Ana", "1990-03-15");
      daily = await result.current.calculateDailyAsync(profile, new Date("2026-08-14T12:00:00Z"));
    });

    expect(daily).toBeDefined();
    expect(daily.personalDay).toBeGreaterThanOrEqual(1);
    expect(daily.theme).toBeDefined();
    expect(daily.description).toBeDefined();
    expect(daily.moonPhase).toBeDefined();
    expect(daily.areas).toBeDefined();
  });
});
