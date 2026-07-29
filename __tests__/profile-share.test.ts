import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { generateProfileHash, storeSharedProfile, decodeProfileHash } from "@/lib/profile/hash";
import type { UserProfile } from "@/types/user";

const TEST_PROFILE: UserProfile = {
  id: "test-1",
  name: "Lucía Fernández",
  birthDate: "1990-03-15",
  birthPlace: "Buenos Aires",
  birthTime: "14:30",
  goal: "growth",
  interests: ["astrology", "numerology"],
  onboardingStep: 4,
  completedSections: ["identity", "world"],
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

let mockStore: Record<string, string> = {};

beforeEach(() => {
  mockStore = {};
  globalThis.localStorage = {
    getItem: (key: string) => mockStore[key] ?? null,
    setItem: (key: string, value: string) => { mockStore[key] = value; },
    removeItem: (key: string) => { delete mockStore[key]; },
    clear: () => { mockStore = {}; },
  } as Storage;
});

afterEach(() => {
  (globalThis as any).localStorage = undefined;
});

describe("generateProfileHash", () => {
  test("returns a 12-character hex string", async () => {
    const hash = await generateProfileHash(TEST_PROFILE);
    expect(typeof hash).toBe("string");
    expect(hash.length).toBe(12);
  });

  test("returns only hex characters", async () => {
    const hash = await generateProfileHash(TEST_PROFILE);
    expect(/^[0-9a-f]{12}$/.test(hash)).toBe(true);
  });

  test("same profile produces same hash", async () => {
    const hash1 = await generateProfileHash(TEST_PROFILE);
    const hash2 = await generateProfileHash(TEST_PROFILE);
    expect(hash1).toBe(hash2);
  });

  test("different profiles produce different hashes", async () => {
    const otherProfile = { ...TEST_PROFILE, name: "Carlos Ruiz" };
    const hash1 = await generateProfileHash(TEST_PROFILE);
    const hash2 = await generateProfileHash(otherProfile);
    expect(hash1).not.toBe(hash2);
  });

  test("hash changes when birthDate changes", async () => {
    const profile1 = { ...TEST_PROFILE, birthDate: "1990-03-15" };
    const profile2 = { ...TEST_PROFILE, birthDate: "1990-03-16" };
    const hash1 = await generateProfileHash(profile1);
    const hash2 = await generateProfileHash(profile2);
    expect(hash1).not.toBe(hash2);
  });

  test("hash changes when chineseZodiac changes", async () => {
    const profile1 = { ...TEST_PROFILE, chineseZodiac: "Caballo" };
    const profile2 = { ...TEST_PROFILE, chineseZodiac: "Buey" };
    const hash1 = await generateProfileHash(profile1);
    const hash2 = await generateProfileHash(profile2);
    expect(hash1).not.toBe(hash2);
  });
});

describe("storeSharedProfile and decodeProfileHash", () => {
  test("stores and retrieves profile by hash", async () => {
    const hash = await generateProfileHash(TEST_PROFILE);
    storeSharedProfile(TEST_PROFILE, hash);
    const retrieved = decodeProfileHash(hash);
    expect(retrieved).not.toBeNull();
    expect(retrieved!.name).toBe(TEST_PROFILE.name);
    expect(retrieved!.birthDate).toBe(TEST_PROFILE.birthDate);
    expect(retrieved!.chineseZodiac).toBe(TEST_PROFILE.chineseZodiac);
  });

  test("returns null for unknown hash", () => {
    const result = decodeProfileHash("nonexistent");
    expect(result).toBeNull();
  });

  test("returns null when no profiles stored", () => {
    const result = decodeProfileHash("somehash");
    expect(result).toBeNull();
  });

  test("stores multiple profiles without collision", async () => {
    const profile1 = { ...TEST_PROFILE, name: "Lucía" };
    const profile2 = { ...TEST_PROFILE, name: "Carlos" };
    const hash1 = await generateProfileHash(profile1);
    const hash2 = await generateProfileHash(profile2);

    storeSharedProfile(profile1, hash1);
    storeSharedProfile(profile2, hash2);

    expect(decodeProfileHash(hash1)?.name).toBe("Lucía");
    expect(decodeProfileHash(hash2)?.name).toBe("Carlos");
  });

  test("returns null for empty hash string", () => {
    const result = decodeProfileHash("");
    expect(result).toBeNull();
  });
});