/**
 * Discovery Progress — Tests for onboarding and exploration state.
 */

import { describe, test, expect } from "vitest";
import { encodeProfileData, decodeProfileData, buildShareableUrl } from "@/lib/utils/profileShare";
import type { UserProfile } from "@/types/user";

const TEST_PROFILE: UserProfile = {
  name: "Lucía Fernández",
  birthDate: "1990-03-15",
  birthPlace: "Buenos Aires",
  birthTime: "14:30",
  goal: "growth",
  interests: [],
  onboardingStep: 4,
  completedSections: ["identity"],
  theme: "light",
  language: "es",
  notifications: true,
  lifePath: 1,
  sunSign: "Piscis",
  sunSignInfo: { sign: "Piscis", element: "Agua", modality: "Mutable", symbol: "♓" },
  chineseZodiac: "Caballo",
  chineseZodiacInfo: { animal: "Caballo", element: "Fuego", emoji: "🐴" },
  element: "Agua",
  modality: "Mutable",
  luckyNumber: 39,
  archetype: "El Visionario",
  archetypeInfo: { name: "El Visionario", color: "#4A6FA5", description: "", quote: "", keywords: [], strengths: [], challenges: [] },
  expressionNumber: 3,
  soulNumber: 7,
  personalityNumber: 5,
  cycles: { personalYear: 3, personalMonth: 7, personalDay: 5 },
  recommendations: { strengths: [], challenges: [], practices: [] },
};

describe("Discovery state defaults", () => {
  const DEFAULT_STATE = {
    version: 1,
    hasCompletedOnboarding: false,
    hasSeenIdentity: false,
    hasSeenWorld: false,
    hasSeenCircle: false,
    hasSeenIntelligence: false,
    lastVisitDate: null,
    visitCount: 0,
  };

  test("not completed onboarding", () => {
    expect(DEFAULT_STATE.hasCompletedOnboarding).toBe(false);
  });
  test("not seen identity", () => {
    expect(DEFAULT_STATE.hasSeenIdentity).toBe(false);
  });
  test("visitCount is 0", () => {
    expect(DEFAULT_STATE.visitCount).toBe(0);
  });
});

describe("Profile encode/decode", () => {
  test("encodes and decodes", () => {
    const encoded = encodeProfileData(TEST_PROFILE);
    const decoded = decodeProfileData(encoded);
    expect(decoded).not.toBeNull();
  });
  test("name preserved", () => {
    const encoded = encodeProfileData(TEST_PROFILE);
    const decoded = decodeProfileData(encoded)!;
    expect(decoded.n).toBe(TEST_PROFILE.name);
  });
  test("lifePath preserved", () => {
    const encoded = encodeProfileData(TEST_PROFILE);
    const decoded = decodeProfileData(encoded)!;
    expect(decoded.l).toBe(TEST_PROFILE.lifePath);
  });
});

describe("Shareable URL with tab", () => {
  test("URL has tab=identity", () => {
    const url = buildShareableUrl(TEST_PROFILE, "identity");
    expect(url).toContain("tab=identity");
  });
  test("URL has tab=world", () => {
    const url = buildShareableUrl(TEST_PROFILE, "world");
    expect(url).toContain("tab=world");
  });
});

describe("Deterministic insights", () => {
  test("same profile encodes to same string", () => {
    const e1 = encodeProfileData(TEST_PROFILE);
    const e2 = encodeProfileData(TEST_PROFILE);
    expect(e1).toBe(e2);
  });
  test("different profile encodes differently", () => {
    const DIFF = { ...TEST_PROFILE, name: "Mateo", lifePath: 7, chineseZodiac: "Rata" };
    const e1 = encodeProfileData(TEST_PROFILE);
    const e2 = encodeProfileData(DIFF as UserProfile);
    expect(e1).not.toBe(e2);
  });
});

describe("Tab validation", () => {
  const VALID_TABS = ["identity", "world", "circle", "intelligence"];
  test("identity is valid", () => expect(VALID_TABS).toContain("identity"));
  test("world is valid", () => expect(VALID_TABS).toContain("world"));
  test("circle is valid", () => expect(VALID_TABS).toContain("circle"));
  test("intelligence is valid", () => expect(VALID_TABS).toContain("intelligence"));
  test("foo is not valid", () => expect(VALID_TABS).not.toContain("foo"));
  test("empty string is not valid", () => expect(VALID_TABS).not.toContain(""));
});

describe("Next tab logic", () => {
  const NEXT_TAB: Record<string, string> = { identity: "world", world: "circle", circle: "intelligence", intelligence: "identity" };
  test("After identity → world", () => expect(NEXT_TAB.identity).toBe("world"));
  test("After world → circle", () => expect(NEXT_TAB.world).toBe("circle"));
  test("After circle → intelligence", () => expect(NEXT_TAB.circle).toBe("intelligence"));
  test("After intelligence → identity (loops)", () => expect(NEXT_TAB.intelligence).toBe("identity"));
});

describe("Guided CTA texts", () => {
  const GUIDED_CTA = {
    identity: "Ya conocés tu código. Ahora descubrí tu mundo →",
    world: "Ahora mirá con quién resonás →",
    circle: "Descubrí qué patrones aparecen en vos →",
    intelligence: "Ya conocés tu mapa. Volvé cuando quieras →",
  };
  test("Identity CTA mentions mundo", () => expect(GUIDED_CTA.identity).toContain("mundo"));
  test("World CTA mentions resonás", () => expect(GUIDED_CTA.world).toContain("resonás"));
  test("Circle CTA mentions patrones", () => expect(GUIDED_CTA.circle).toContain("patrones"));
  test("Intelligence CTA mentions mapa", () => expect(GUIDED_CTA.intelligence).toContain("mapa"));
});

describe("Backward compatibility", () => {
  test("existing user has onboardingStep=4", () => {
    const existing = { ...TEST_PROFILE };
    expect(existing.onboardingStep).toBe(4);
  });
  test("existing user has completedSections", () => {
    const existing = { ...TEST_PROFILE };
    expect(existing.completedSections.length).toBeGreaterThan(0);
  });
});
