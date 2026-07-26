/**
 * Profile Deep Linking — URL params + shareable data tests.
 */

import { describe, test, expect } from "vitest";
import { encodeProfileData, decodeProfileData, buildShareableUrl, profileFromShareData } from "@/lib/utils/profileShare";
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

const UNICODE_PROFILE: UserProfile = {
  ...TEST_PROFILE,
  name: "María José García-López",
  birthDate: "1985-12-25",
  lifePath: 7,
  sunSign: "Capricornio",
  chineseZodiac: "Buey",
  chineseZodiacInfo: { animal: "Buey", element: "Madera", emoji: "🐂" },
  element: "Tierra",
  archetype: "El Sabio",
};

describe("Encode/Decode roundtrip", () => {
  const encoded = encodeProfileData(TEST_PROFILE);

  test("returns string", () => expect(typeof encoded).toBe("string"));
  test("not empty", () => expect(encoded.length).toBeGreaterThan(0));
  test("no + characters (URL-safe)", () => expect(encoded).not.toContain("+"));
  test("no / characters (URL-safe)", () => expect(encoded).not.toContain("/"));
  test("no = characters (URL-safe)", () => expect(encoded).not.toContain("="));

  const decoded = decodeProfileData(encoded);

  test("decodeProfileData returns non-null", () => expect(decoded).not.toBeNull());
  test("name matches", () => expect(decoded!.n).toBe(TEST_PROFILE.name));
  test("birthDate matches", () => expect(decoded!.b).toBe(TEST_PROFILE.birthDate));
  test("lifePath matches", () => expect(decoded!.l).toBe(TEST_PROFILE.lifePath));
  test("sunSign matches", () => expect(decoded!.s).toBe(TEST_PROFILE.sunSign));
  test("element matches", () => expect(decoded!.e).toBe(TEST_PROFILE.element));
  test("chineseZodiac matches", () => expect(decoded!.c).toBe(TEST_PROFILE.chineseZodiac));
  test("archetype matches", () => expect(decoded!.a).toBe(TEST_PROFILE.archetype));
  test("expressionNumber matches", () => expect(decoded!.en).toBe(TEST_PROFILE.expressionNumber));
  test("soulNumber matches", () => expect(decoded!.sn).toBe(TEST_PROFILE.soulNumber));
  test("personalityNumber matches", () => expect(decoded!.pn).toBe(TEST_PROFILE.personalityNumber));
});

describe("Unicode handling", () => {
  test("encode/decode returns non-null", () => {
    const encoded = encodeProfileData(UNICODE_PROFILE);
    const decoded = decodeProfileData(encoded);
    expect(decoded).not.toBeNull();
  });
  test("name matches", () => {
    const encoded = encodeProfileData(UNICODE_PROFILE);
    const decoded = decodeProfileData(encoded)!;
    expect(decoded.n).toBe(UNICODE_PROFILE.name);
  });
});

describe("Invalid data handling", () => {
  test("empty string returns null", () => expect(decodeProfileData("")).toBeNull());
  test("invalid base64 returns null", () => expect(decodeProfileData("invalid!!")).toBeNull());
  test("valid base64 but invalid JSON returns null", () => expect(decodeProfileData("dGVzdA==")).toBeNull());
});

describe("Shareable URL format", () => {
  test("contains tab and data params", () => {
    const url = buildShareableUrl(TEST_PROFILE, "identity");
    expect(url).toContain("/profile?tab=identity&data=");
  });
  test("has tab=identity", () => {
    const url = buildShareableUrl(TEST_PROFILE, "identity");
    expect(url).toContain("tab=identity");
  });
  test("can have tab=world", () => {
    const url = buildShareableUrl(TEST_PROFILE, "world");
    expect(url).toContain("tab=world");
  });
});

describe("profileFromShareData", () => {
  test("shared profile name matches", () => {
    const encoded = encodeProfileData(TEST_PROFILE);
    const decoded = decodeProfileData(encoded)!;
    const shared = profileFromShareData(decoded);
    expect(shared.name).toBe(TEST_PROFILE.name);
  });
  test("shared profile birthDate matches", () => {
    const encoded = encodeProfileData(TEST_PROFILE);
    const decoded = decodeProfileData(encoded)!;
    const shared = profileFromShareData(decoded);
    expect(shared.birthDate).toBe(TEST_PROFILE.birthDate);
  });
  test("shared profile lifePath matches", () => {
    const encoded = encodeProfileData(TEST_PROFILE);
    const decoded = decodeProfileData(encoded)!;
    const shared = profileFromShareData(decoded);
    expect(shared.lifePath).toBe(TEST_PROFILE.lifePath);
  });
});

describe("URL completeness", () => {
  test("has exactly one data= param", () => {
    const url = buildShareableUrl(TEST_PROFILE, "identity");
    const parts = url.split("data=");
    expect(parts.length).toBe(2);
  });
  test("data from URL decodes correctly", () => {
    const url = buildShareableUrl(TEST_PROFILE, "identity");
    const urlData = decodeProfileData(url.split("data=")[1]);
    expect(urlData).not.toBeNull();
  });
  test("name preserved in URL", () => {
    const url = buildShareableUrl(TEST_PROFILE, "identity");
    const urlData = decodeProfileData(url.split("data=")[1])!;
    expect(urlData.n).toBe(TEST_PROFILE.name);
  });
});

describe("Different profiles", () => {
  test("produce different URLs", () => {
    const url1 = buildShareableUrl(TEST_PROFILE);
    const url2 = buildShareableUrl(UNICODE_PROFILE);
    expect(url1).not.toBe(url2);
  });
});
