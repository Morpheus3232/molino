/**
 * Animal Relations — Symmetry & score tests.
 *
 * Verifies that getRelation() returns consistent, symmetric results
 * for key pairs, especially Rata ↔ Caballo (clash).
 */

import { describe, test, expect } from "vitest";
import { getRelation, getAnimalProfile, getFriends, getChallenging, ANIMALS, type Animal } from "@/lib/data/animalRelations";

function testPair(a: Animal, b: Animal, expectedType: string, expectedScore: number) {
  const forward = getRelation(a, b);
  const reverse = getRelation(b, a);

  test(`${a} → ${b}: type = "${expectedType}"`, () => {
    expect(forward.type).toBe(expectedType);
  });
  test(`${a} → ${b}: score = ${expectedScore}`, () => {
    expect(forward.score).toBe(expectedScore);
  });
  test(`${b} → ${a}: type = "${expectedType}"`, () => {
    expect(reverse.type).toBe(expectedType);
  });
  test(`${b} → ${a}: score = ${expectedScore}`, () => {
    expect(reverse.score).toBe(expectedScore);
  });
  test(`Symmetry: ${a} ↔ ${b} type`, () => {
    expect(forward.type).toBe(reverse.type);
  });
  test(`Symmetry: ${a} ↔ ${b} score`, () => {
    expect(forward.score).toBe(reverse.score);
  });
}

describe("Rata ↔ Caballo (critical clash pair)", () => {
  testPair("Rata", "Caballo", "clash", 30);
});

describe("Other clash pairs", () => {
  testPair("Buey", "Cabra", "clash", 30);
  testPair("Tigre", "Mono", "clash", 30);
  testPair("Gato", "Gallo", "clash", 30);
  testPair("Dragón", "Perro", "clash", 30);
  testPair("Serpiente", "Cerdo", "clash", 30);
});

describe("Harmonious pairs (Liu He)", () => {
  testPair("Rata", "Buey", "harmonious", 80);
  testPair("Tigre", "Gato", "harmonious", 80);
  testPair("Dragón", "Serpiente", "harmonious", 80);
  testPair("Caballo", "Cabra", "harmonious", 80);
  testPair("Mono", "Gallo", "harmonious", 80);
  testPair("Perro", "Cerdo", "harmonious", 80);
});

describe("Triad pairs (San He)", () => {
  testPair("Rata", "Dragón", "triad", 85);
  testPair("Rata", "Mono", "triad", 85);
  testPair("Dragón", "Mono", "triad", 85);
  testPair("Tigre", "Caballo", "triad", 85);
  testPair("Tigre", "Perro", "triad", 85);
  testPair("Caballo", "Perro", "triad", 85);
});

describe("Same animal", () => {
  testPair("Rata", "Rata", "same", 95);
  testPair("Caballo", "Caballo", "same", 95);
});

describe("Product rule: 2 amigos (triad) + 1 enemigo (clash) por animal", () => {
  for (const animal of ANIMALS) {
    test(`${animal} has exactly 2 triad harmonyPartners`, () => {
      const profile = getAnimalProfile(animal);
      expect(profile.harmonyPartners).toHaveLength(2);
    });

    test(`${animal} has exactly 1 liuHe partner`, () => {
      const profile = getAnimalProfile(animal);
      expect(profile.liuHePartner).toBeTruthy();
      expect(profile.liuHePartner).not.toBe(animal);
    });

    test(`${animal} has exactly 1 challenging enemy`, () => {
      const profile = getAnimalProfile(animal);
      expect(profile.challengingRelations).toHaveLength(1);
    });

    test(`${animal} getFriends returns 2 (triad only)`, () => {
      const friends = getFriends(animal as Animal);
      expect(friends).toHaveLength(2);
      expect(friends.every(f => f.type === "triad")).toBe(true);
    });

    test(`${animal} getChallenging returns 1`, () => {
      const challenging = getChallenging(animal as Animal);
      expect(challenging).toHaveLength(1);
    });
  }
});

describe("Gato is the canonical fourth animal (not Conejo)", () => {
  test("ANIMALS array includes Gato at index 3", () => {
    expect(ANIMALS[3]).toBe("Gato");
  });

  test("ANIMALS array does not include Conejo", () => {
    expect(ANIMALS).not.toContain("Conejo");
  });

  test("Gato has correct triad partners (Cabra, Cerdo)", () => {
    const profile = getAnimalProfile("Gato");
    expect(profile.harmonyPartners).toEqual(["Cabra", "Cerdo"]);
  });

  test("Gato has correct liuHe partner (Tigre)", () => {
    const profile = getAnimalProfile("Gato");
    expect(profile.liuHePartner).toBe("Tigre");
  });

  test("Gato has correct challenging enemy (Gallo)", () => {
    const profile = getAnimalProfile("Gato");
    expect(profile.challengingRelations).toEqual(["Gallo"]);
  });
});

describe("Same-animal relation has highest score", () => {
  test("same animal score (95) > triad (85)", () => {
    expect(getRelation("Rata", "Rata").score).toBeGreaterThan(getRelation("Rata", "Dragón").score);
  });

  test("same animal score (95) > harmonious (80)", () => {
    expect(getRelation("Rata", "Rata").score).toBeGreaterThan(getRelation("Rata", "Buey").score);
  });

  test("same animal score (95) > neutral (50)", () => {
    expect(getRelation("Rata", "Rata").score).toBeGreaterThan(getRelation("Rata", "Tigre").score);
  });
});
