/**
 * Animal Relations — Symmetry & score tests.
 *
 * Verifies that getRelation() returns consistent, symmetric results
 * for key pairs, especially Rata ↔ Caballo (clash).
 */

import { describe, test, expect } from "vitest";
import { getRelation, type Animal } from "@/lib/data/animalRelations";

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
  testPair("Conejo", "Gallo", "clash", 30);
  testPair("Dragón", "Perro", "clash", 30);
  testPair("Serpiente", "Cerdo", "clash", 30);
});

describe("Harmonious pairs (Liu He)", () => {
  testPair("Rata", "Buey", "harmonious", 80);
  testPair("Tigre", "Conejo", "harmonious", 80);
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
