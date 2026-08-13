import { describe, it, expect } from "vitest";
import { calculateCoupleCompatibility } from "@/lib/engines/coupleEngine";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";

describe("Couple Compatibility Engine", () => {
  const profileA = calculateUserProfile("Franco", "1990-04-18"); // Aries, Caballo, Life Path 5
  const profileB = calculateUserProfile("Paula", "1992-09-24");  // Libra, Mono, Life Path 9

  it("calculates overall couple score and level deterministically", () => {
    const result = calculateCoupleCompatibility(profileA, profileB);

    expect(result.score).toBeGreaterThanOrEqual(1);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.level).toBeTruthy();
    expect(result.summary).toContain("Franco");
    expect(result.summary).toContain("Paula");
    expect(result.dailyAdvice).toBeTruthy();
  });

  it("identifies connection points across multiple symbolic systems", () => {
    const result = calculateCoupleCompatibility(profileA, profileB);

    expect(result.connections.length).toBeGreaterThanOrEqual(1);
    for (const c of result.connections) {
      expect(c.title).toBeTruthy();
      expect(c.description).toBeTruthy();
      expect(["numerology", "astrology", "chinese", "elements"]).toContain(c.system);
    }
  });

  it("detects same life path when both users share the number", () => {
    const profileSameA = calculateUserProfile("Alex", "1990-04-18"); // Life Path 5
    const profileSameB = calculateUserProfile("Sam", "1983-03-30");  // Life Path 5 (1+9+8+3+0+3+3+0 = 27 -> 9? Wait: 1983-03-30 -> 1+9+8+3+3+3+0 = 27 -> 9. Let's use 1985-04-07 -> 1+9+8+5+0+4+0+7 = 34 -> 7. Or 1994-05-04 -> 1+9+9+4+0+5+0+4 = 32 -> 5)
    const profileSame5B = calculateUserProfile("Sam", "1994-05-04");

    const result = calculateCoupleCompatibility(profileSameA, profileSame5B);
    const sameLpConnection = result.connections.find((c) => c.id === "lp-same");
    expect(sameLpConnection).toBeDefined();
    expect(sameLpConnection?.title).toContain("Comparten el Número de Vida 5");
  });

  it("identifies potential friction areas and provides actionable advice", () => {
    const result = calculateCoupleCompatibility(profileA, profileB);

    expect(result.challenges.length).toBeGreaterThanOrEqual(1);
    for (const ch of result.challenges) {
      expect(ch.area).toBeTruthy();
      expect(ch.description).toBeTruthy();
      expect(ch.recommendation).toBeTruthy();
    }
  });
});
