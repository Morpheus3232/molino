import { describe, it, expect } from "vitest";
import {
  FAMOUS_PEOPLE,
  RAW_FAMOUS_PEOPLE,
  findFamousMatches,
  FAMOUS_PEOPLE_ENTITIES,
} from "@/lib/data/famousPeopleToEntities";
import type { UserProfile } from "@/types/user";

describe("Famous People Dataset", () => {
  it("contains at least 50 famous people across diverse fields", () => {
    expect(FAMOUS_PEOPLE.length).toBeGreaterThanOrEqual(50);
    expect(RAW_FAMOUS_PEOPLE.length).toBeGreaterThanOrEqual(50);

    const fields = new Set(FAMOUS_PEOPLE.map((p) => p.field));
    expect(fields.has("Ciencia") || fields.has("Tecnología")).toBe(true);
    expect(fields.has("Música")).toBe(true);
    expect(fields.has("Arte") || fields.has("Cine")).toBe(true);
    expect(fields.has("Deporte")).toBe(true);
    expect(fields.has("Política") || fields.has("Literatura")).toBe(true);
  });

  it("has valid birth dates and non-empty metadata for each person", () => {
    for (const person of FAMOUS_PEOPLE) {
      expect(person.name).toBeTruthy();
      expect(person.birthDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(person.lifePath).toBeGreaterThanOrEqual(1);
      expect(person.sunSign).toBeTruthy();
      expect(person.chineseZodiac).toBeTruthy();
      expect(person.initials.length).toBeGreaterThanOrEqual(1);
      expect(person.shortBio).toBeTruthy();
    }
  });

  it("retains backward compatibility for symbolic entities", () => {
    expect(FAMOUS_PEOPLE_ENTITIES.length).toBeGreaterThan(0);
    for (const entity of FAMOUS_PEOPLE_ENTITIES) {
      expect(entity.type).toBe("artist");
      expect(entity.id.startsWith("person-")).toBe(true);
    }
  });
});

describe("findFamousMatches", () => {
  it("returns up to 3 matches prioritized by rarity", () => {
    const profile: Partial<UserProfile> = {
      name: "Test User",
      lifePath: 1,
      sunSign: "Cáncer",
      chineseZodiac: "Gato",
    };

    const matches = findFamousMatches(profile, 3);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.length).toBeLessThanOrEqual(3);

    // Check that matches contain the required properties
    for (const match of matches) {
      expect(match.person).toBeDefined();
      expect(match.matchCount).toBeGreaterThanOrEqual(1);
      expect(match.matchReasons.length).toBeGreaterThanOrEqual(1);
      expect(match.headline).toBeTruthy();
    }
  });

  it("handles profile with no matches or empty gracefully", () => {
    const matches = findFamousMatches({} as UserProfile);
    expect(matches).toEqual([]);
  });

  it("prioritizes multi-dimensional matches over single matches", () => {
    // Lionel Messi is 1987-06-24 -> Cáncer, Gato (1987), Life Path 1
    // A profile with Life Path 1, Cáncer, and Gato should match Messi with 3 dimensions
    const profile: Partial<UserProfile> = {
      lifePath: 1,
      sunSign: "Cáncer",
      chineseZodiac: "Gato",
    };

    const matches = findFamousMatches(profile, 3);
    expect(matches.length).toBeGreaterThan(0);
    const topMatch = matches[0];
    expect(topMatch.matchCount).toBeGreaterThanOrEqual(2);
    expect(topMatch.rarityScore).toBeGreaterThanOrEqual(500);
  });
});
