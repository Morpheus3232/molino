import { describe, it, expect } from "vitest";
import { calculatePartnershipCompatibility } from "../partnershipEngine";
import { calculateCoupleCompatibility } from "../coupleEngine";
import { calculateUserProfile } from "../profileBuilder";

describe("Partnership Compatibility Engine", () => {
  const profileA = calculateUserProfile("Ana", "1990-03-15");
  const profileB = calculateUserProfile("Lucas", "1988-07-22");

  it("returns the same underlying score as calculateCoupleCompatibility", () => {
    const partnership = calculatePartnershipCompatibility(profileA, profileB);
    const couple = calculateCoupleCompatibility(profileA, profileB);
    expect(partnership.score).toBe(couple.score);
    expect(partnership.level).toBe(couple.level);
  });

  it("produces business-neutral copy, not romantic-specific", () => {
    const result = calculatePartnershipCompatibility(profileA, profileB);
    expect(result.summary.toLowerCase()).not.toContain("pareja");
    expect(result.workingAdvice.toLowerCase()).not.toContain("pareja");
    for (const c of result.connections) {
      expect(c.description.toLowerCase()).not.toContain("atracción natural");
    }
  });

  it("always returns at least one challenge with a recommendation", () => {
    const result = calculatePartnershipCompatibility(profileA, profileB);
    expect(result.challenges.length).toBeGreaterThan(0);
    for (const ch of result.challenges) {
      expect(ch.recommendation.length).toBeGreaterThan(0);
    }
  });
});
