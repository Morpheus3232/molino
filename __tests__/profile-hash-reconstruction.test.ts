/**
 * /profile#<hash> round trip — create (encodeProfileData), parse
 * (decodeProfileData), reconstruct (profileFromEncoded). Query-string
 * encode/decode already has coverage in profile-deep-linking.test.ts; this
 * file is specifically about profileFromEncoded, the piece ProfileClient
 * uses to rebuild a full UserProfile from a bare URL fragment with no
 * server round trip.
 */
import { describe, test, expect } from "vitest";
import { encodeProfileData, profileFromEncoded } from "@/lib/utils/profileShare";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import type { UserProfile } from "@/types/user";

const SOURCE_PROFILE: UserProfile = {
  ...calculateUserProfile("Lucía Fernández", "1990-03-15"),
  birthPlace: "Buenos Aires",
  goal: "growth",
  interests: [],
  onboardingStep: 4,
  completedSections: ["identity"],
  theme: "light",
  language: "es",
  notifications: true,
};

describe("profileFromEncoded — create, parse, reconstruct", () => {
  test("reconstructs a profile whose birthDate matches the source", () => {
    const hash = encodeProfileData(SOURCE_PROFILE);
    const rebuilt = profileFromEncoded(hash);
    expect(rebuilt?.birthDate).toBe(SOURCE_PROFILE.birthDate);
  });

  test("reconstructs the same lifePath as a fresh calculation for that birthDate", () => {
    const hash = encodeProfileData(SOURCE_PROFILE);
    const rebuilt = profileFromEncoded(hash);
    const fresh = calculateUserProfile(SOURCE_PROFILE.name || "", SOURCE_PROFILE.birthDate);
    expect(rebuilt?.lifePath).toBe(fresh.lifePath);
  });

  test("reconstructs the same sunSign, chineseZodiac and archetype", () => {
    const hash = encodeProfileData(SOURCE_PROFILE);
    const rebuilt = profileFromEncoded(hash);
    expect(rebuilt?.sunSign).toBe(SOURCE_PROFILE.sunSign);
    expect(rebuilt?.chineseZodiac).toBe(SOURCE_PROFILE.chineseZodiac);
    expect(rebuilt?.archetype).toBe(SOURCE_PROFILE.archetype);
  });

  test("fills in the onboarding-complete defaults ProfileClient/ProfilePage expect", () => {
    const hash = encodeProfileData(SOURCE_PROFILE);
    const rebuilt = profileFromEncoded(hash);
    expect(rebuilt?.onboardingStep).toBe(4);
    expect(rebuilt?.completedSections).toEqual(["identity"]);
  });

  test("garbage input returns null instead of throwing", () => {
    expect(() => profileFromEncoded("not-a-real-hash")).not.toThrow();
    expect(profileFromEncoded("not-a-real-hash")).toBeNull();
  });

  test("empty string returns null", () => {
    expect(profileFromEncoded("")).toBeNull();
  });

  test("well-formed but incomplete payload (missing birthDate) returns null", () => {
    const incomplete = btoa(encodeURIComponent(JSON.stringify({ n: "x", l: 1, s: "Piscis", e: "Agua", c: "Caballo", a: "El Comunicador" })));
    expect(profileFromEncoded(incomplete)).toBeNull();
  });
});
