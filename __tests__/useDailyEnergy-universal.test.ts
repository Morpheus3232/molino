import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useDailyEnergy } from "@/lib/hooks/useDailyEnergy";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";

describe("useDailyEnergy — energía universal sin perfil", () => {
  const targetDate = new Date(2026, 7, 17);

  it("sin perfil (null), devuelve energía universal con isPersonalized:false", () => {
    const { result } = renderHook(() => useDailyEnergy(null, targetDate));
    expect(result.current).not.toBeNull();
    expect(result.current!.isPersonalized).toBe(false);
    expect(result.current!.personalYear).toBe(0);
    expect(typeof result.current!.theme).toBe("string");
    expect(result.current!.theme.length).toBeGreaterThan(0);
    expect(result.current!.nextDaysForecast.length).toBe(3);
  });

  it("con perfil, devuelve energía personalizada con isPersonalized:true", () => {
    const profile = calculateUserProfile("Franco", "1990-05-15");
    const { result } = renderHook(() => useDailyEnergy(profile, targetDate));
    expect(result.current).not.toBeNull();
    expect(result.current!.isPersonalized).toBe(true);
    expect(result.current!.personalYear).toBeGreaterThan(0);
  });

  it("dos visitantes sin perfil el mismo día ven exactamente el mismo tema y score", () => {
    const { result: a } = renderHook(() => useDailyEnergy(null, targetDate));
    const { result: b } = renderHook(() => useDailyEnergy(null, targetDate));
    expect(a.current!.theme).toBe(b.current!.theme);
    expect(a.current!.overallScore).toBe(b.current!.overallScore);
  });
});
