/**
 * Entity Story Engine — Tests for narrative connections.
 */

import { describe, test, expect } from "vitest";
import { getRelation, type RelationType } from "@/lib/data/animalRelations";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";

describe("Same animal narrative", () => {
  const r = getRelation("Caballo", "Caballo");
  test("type is 'same'", () => expect(r.type).toBe("same"));
  test("score is 95", () => expect(r.score).toBe(95));
  test("label is 'mismo animal'", () => expect(r.label).toBe("mismo animal"));
});

describe("Triad narrative", () => {
  const r = getRelation("Caballo", "Tigre");
  test("type is 'triad'", () => expect(r.type).toBe("triad"));
  test("score is 85", () => expect(r.score).toBe(85));
  test("label is 'tríada compatible'", () => expect(r.label).toBe("tríada compatible"));
});

describe("Harmonious narrative", () => {
  const r = getRelation("Caballo", "Cabra");
  test("type is 'harmonious'", () => expect(r.type).toBe("harmonious"));
  test("score is 80", () => expect(r.score).toBe(80));
  test("label is 'armonía natural'", () => expect(r.label).toBe("armonía natural"));
});

describe("Neutral narrative", () => {
  const r = getRelation("Caballo", "Conejo");
  test("type is 'neutral'", () => expect(r.type).toBe("neutral"));
  test("score is 50", () => expect(r.score).toBe(50));
});

describe("Clash narrative", () => {
  const r = getRelation("Caballo", "Rata");
  test("type is 'clash'", () => expect(r.type).toBe("clash"));
  test("score is 30", () => expect(r.score).toBe(30));
  test("label is 'opuestos en el ciclo'", () => expect(r.label).toBe("opuestos en el ciclo"));
});

describe("Harm narrative", () => {
  const r = getRelation("Caballo", "Buey");
  test("type is 'harm'", () => expect(r.type).toBe("harm"));
  test("score is 25", () => expect(r.score).toBe(25));
  test("label is 'requiere atención'", () => expect(r.label).toBe("requiere atención"));
});

describe("Symmetry", () => {
  test("Rata→Caballo and Caballo→Rata have same type", () => {
    expect(getRelation("Rata", "Caballo").type).toBe(getRelation("Caballo", "Rata").type);
  });
  test("Rata→Caballo and Caballo→Rata have same score", () => {
    expect(getRelation("Rata", "Caballo").score).toBe(getRelation("Caballo", "Rata").score);
  });
});

describe("Relation colors", () => {
  const COLORS: Record<RelationType, string> = {
    same: "#2D5A3D", triad: "#2D5A3D", harmonious: "#4A6FA5",
    neutral: "#6B7280", clash: "#B45309", harm: "#B45309",
  };
  for (const [type, expected] of Object.entries(COLORS)) {
    test(`${type}: color is ${expected}`, () => {
      expect(COLORS[type as RelationType]).toBe(expected);
    });
  }
});

describe("Zodiac display", () => {
  test("Caballo display name is 'Caballo'", () => {
    expect(getZodiacDisplay("Caballo").name).toBe("Caballo");
  });
  test("Caballo emoji is horse", () => {
    expect(getZodiacDisplay("Caballo").emoji).toBe("🐎");
  });
  test("Rata display name is 'Rata'", () => {
    expect(getZodiacDisplay("Rata").name).toBe("Rata");
  });
  test("Rata emoji is rat", () => {
    expect(getZodiacDisplay("Rata").emoji).toBe("🐀");
  });
});

describe("Negative relationships", () => {
  const negativeTypes: RelationType[] = ["clash", "harm"];
  test("Rata↔Caballo is negative (clash)", () => {
    const r = getRelation("Rata", "Caballo");
    expect(negativeTypes).toContain(r.type);
  });
  test("Rata↔Caballo score is low (≤30)", () => {
    expect(getRelation("Rata", "Caballo").score).toBeLessThanOrEqual(30);
  });
});
