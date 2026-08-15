/**
 * Atlas affinity ranking selection tests.
 * Covers selectAtlasRecommendations from affinity-light.ts.
 */
import { describe, test, expect } from 'vitest';
import {
  sortLightEntities,
  selectAtlasRecommendations,
  type LightAffinityResult,
} from '@/lib/affinity-light';
import type { LightweightEntity } from '@/types/atlas';

function makeEntity(overrides: Partial<LightweightEntity> = {}): LightweightEntity {
  return {
    id: overrides.id ?? "test-entity",
    name: overrides.name ?? "Test Entity",
    animal: overrides.animal ?? "Rata",
    isApproximate: overrides.isApproximate ?? false,
    visualType: overrides.visualType ?? "logo",
    emoji: overrides.emoji ?? "🧪",
    country: overrides.country ?? "Argentina",
    countryISO: overrides.countryISO ?? "AR",
    type: overrides.type ?? "brand",
  };
}

function makeResult(entity: LightweightEntity, score: number, tier?: string, relationship?: string): LightAffinityResult {
  return {
    id: entity.id,
    name: entity.name,
    animal: entity.animal,
    emoji: entity.emoji,
    visualType: entity.visualType,
    imageUrl: entity.imageUrl,
    country: entity.country,
    countryISO: entity.countryISO,
    type: entity.type,
    score,
    tier: (tier as LightAffinityResult["tier"]) || "resonancia-alta",
    relationship: relationship || "mismo animal",
    isApproximate: entity.isApproximate,
  };
}

describe('sortLightEntities', () => {
  test('ranks same-animal entities highest', () => {
    const entities: LightweightEntity[] = [
      makeEntity({ id: "a", animal: "Caballo", name: "A" }),
      makeEntity({ id: "b", animal: "Rata", name: "B" }),
      makeEntity({ id: "c", animal: "Caballo", name: "C" }),
    ];
    const ranked = sortLightEntities("Caballo", entities);
    expect(ranked[0].id).toBe("a");
    expect(ranked[1].id).toBe("c");
    // Rata vs Caballo = clash = 30
    expect(ranked[2].id).toBe("b");
    expect(ranked[2].score).toBe(30);
  });

  test('sorts descending by score', () => {
    const entities: LightweightEntity[] = [
      makeEntity({ id: "a", animal: "Caballo" }),
      makeEntity({ id: "b", animal: "Dragón" }),
      makeEntity({ id: "c", animal: "Tigre" }),
    ];
    const ranked = sortLightEntities("Rata", entities);
    // Rata-Rata(same=95) > Rata-Dragon(triad=85) > Rata-Tigre(neutral=50)
    // But none are Rata here, so: Dragon(triad=85) > Tigre(neutral=50) > Caballo(clash=30)
    expect(ranked[0].score).toBeGreaterThanOrEqual(ranked[1].score);
    expect(ranked[1].score).toBeGreaterThanOrEqual(ranked[2].score);
  });
});

describe('selectAtlasRecommendations', () => {
  test('selects 5 HIGH + 3 MEDIUM + 2 ENEMY when enough entities exist', () => {
    const ranked: LightAffinityResult[] = [
      // 6 HIGH (>=75)
      ...Array.from({ length: 6 }, (_, i) =>
        makeResult(makeEntity({ id: `high-${i}`, animal: "Rata" }), 95)
      ),
      // 5 MEDIUM (45-74)
      ...Array.from({ length: 5 }, (_, i) =>
        makeResult(makeEntity({ id: `med-${i}`, animal: "Tigre" }), 50, "complementarios", "energías independientes")
      ),
      // 3 ENEMY (<45)
      ...Array.from({ length: 3 }, (_, i) =>
        makeResult(makeEntity({ id: `enemy-${i}`, animal: "Caballo" }), 30, "desafiante", "energías opuestas")
      ),
    ];
    const result = selectAtlasRecommendations(ranked);
    expect(result.high).toHaveLength(5);
    expect(result.medium).toHaveLength(3);
    expect(result.enemy).toHaveLength(2);
  });

  test('handles fewer entities gracefully', () => {
    const ranked: LightAffinityResult[] = [
      makeResult(makeEntity({ id: "a", animal: "Rata" }), 95),
      makeResult(makeEntity({ id: "b", animal: "Tigre" }), 50, "complementarios", "energías independientes"),
    ];
    const result = selectAtlasRecommendations(ranked);
    expect(result.high).toHaveLength(1);
    expect(result.medium).toHaveLength(1);
    expect(result.enemy).toHaveLength(0);
  });

  test('no duplicates across buckets', () => {
    const ranked: LightAffinityResult[] = [
      makeResult(makeEntity({ id: "a", animal: "Rata" }), 95),
      makeResult(makeEntity({ id: "b", animal: "Rata" }), 95),
      makeResult(makeEntity({ id: "c", animal: "Dragón" }), 85),
      makeResult(makeEntity({ id: "d", animal: "Dragón" }), 85),
      makeResult(makeEntity({ id: "e", animal: "Mono" }), 85),
      makeResult(makeEntity({ id: "f", animal: "Mono" }), 85),
      makeResult(makeEntity({ id: "m1", animal: "Tigre" }), 50, "complementarios", "energías independientes"),
      makeResult(makeEntity({ id: "m2", animal: "Tigre" }), 50, "complementarios", "energías independientes"),
      makeResult(makeEntity({ id: "m3", animal: "Tigre" }), 50, "complementarios", "energías independientes"),
      makeResult(makeEntity({ id: "x1", animal: "Caballo" }), 30, "desafiante", "energías opuestas"),
      makeResult(makeEntity({ id: "x2", animal: "Caballo" }), 30, "desafiante", "energías opuestas"),
    ];
    const result = selectAtlasRecommendations(ranked);
    const allIds = [...result.high, ...result.medium, ...result.enemy].map(r => r.id);
    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);
  });

  test('country priority within same tier', () => {
    const ranked: LightAffinityResult[] = [
      makeResult(makeEntity({ id: "ar1", animal: "Rata", countryISO: "AR", country: "Argentina" }), 95),
      makeResult(makeEntity({ id: "mx1", animal: "Rata", countryISO: "MX", country: "México" }), 95),
      makeResult(makeEntity({ id: "ar2", animal: "Rata", countryISO: "AR", country: "Argentina" }), 95),
      makeResult(makeEntity({ id: "us1", animal: "Rata", countryISO: "US", country: "USA" }), 95),
      makeResult(makeEntity({ id: "ar3", animal: "Rata", countryISO: "AR", country: "Argentina" }), 95),
      makeResult(makeEntity({ id: "br1", animal: "Rata", countryISO: "BR", country: "Brasil" }), 95),
      // medium
      makeResult(makeEntity({ id: "m-ar", animal: "Tigre", countryISO: "AR", country: "Argentina" }), 50, "complementarios", "energías independientes"),
      makeResult(makeEntity({ id: "m-mx", animal: "Tigre", countryISO: "MX", country: "México" }), 50, "complementarios", "energías independientes"),
      makeResult(makeEntity({ id: "m-br", animal: "Tigre", countryISO: "BR", country: "Brasil" }), 50, "complementarios", "energías independientes"),
      // enemy
      makeResult(makeEntity({ id: "e-ar", animal: "Caballo", countryISO: "AR", country: "Argentina" }), 30, "desafiante", "energías opuestas"),
      makeResult(makeEntity({ id: "e-us", animal: "Caballo", countryISO: "US", country: "USA" }), 30, "desafiante", "energías opuestas"),
    ];
    const result = selectAtlasRecommendations(ranked, "AR");
    // AR entities should appear first within each bucket
    expect(result.high.slice(0, 3).every(r => r.countryISO === "AR")).toBe(true);
    // medium[0] should be AR
    expect(result.medium[0].countryISO).toBe("AR");
    // enemy[0] should be AR
    expect(result.enemy[0].countryISO).toBe("AR");
  });

  test('no userCountryISO: ranking still works', () => {
    const ranked: LightAffinityResult[] = [
      makeResult(makeEntity({ id: "a", animal: "Rata", countryISO: "AR" }), 95),
      makeResult(makeEntity({ id: "b", animal: "Rata", countryISO: "MX" }), 95),
      makeResult(makeEntity({ id: "c", animal: "Dragón", countryISO: "US" }), 85),
      makeResult(makeEntity({ id: "d", animal: "Dragón", countryISO: "BR" }), 85),
      makeResult(makeEntity({ id: "e", animal: "Mono", countryISO: "CL" }), 85),
      makeResult(makeEntity({ id: "m1", animal: "Tigre", countryISO: "AR" }), 50, "complementarios", "energías independientes"),
      makeResult(makeEntity({ id: "m2", animal: "Tigre", countryISO: "MX" }), 50, "complementarios", "energías independientes"),
      makeResult(makeEntity({ id: "m3", animal: "Tigre", countryISO: "US" }), 50, "complementarios", "energías independientes"),
      makeResult(makeEntity({ id: "x1", animal: "Caballo", countryISO: "AR" }), 30, "desafiante", "energías opuestas"),
      makeResult(makeEntity({ id: "x2", animal: "Caballo", countryISO: "MX" }), 30, "desafiante", "energías opuestas"),
    ];
    const result = selectAtlasRecommendations(ranked, null);
    expect(result.high).toHaveLength(5);
    expect(result.medium).toHaveLength(3);
    expect(result.enemy).toHaveLength(2);
  });

  test('deterministic: same input yields same output', () => {
    const ranked: LightAffinityResult[] = [
      makeResult(makeEntity({ id: "a", animal: "Rata" }), 95),
      makeResult(makeEntity({ id: "b", animal: "Rata" }), 95),
      makeResult(makeEntity({ id: "c", animal: "Dragón" }), 85),
      makeResult(makeEntity({ id: "d", animal: "Dragón" }), 85),
      makeResult(makeEntity({ id: "e", animal: "Mono" }), 85),
      makeResult(makeEntity({ id: "m1", animal: "Tigre" }), 50, "complementarios", "energías independientes"),
      makeResult(makeEntity({ id: "m2", animal: "Tigre" }), 50, "complementarios", "energías independientes"),
      makeResult(makeEntity({ id: "m3", animal: "Tigre" }), 50, "complementarios", "energías independientes"),
      makeResult(makeEntity({ id: "x1", animal: "Caballo" }), 30, "desafiante", "energías opuestas"),
      makeResult(makeEntity({ id: "x2", animal: "Caballo" }), 30, "desafiante", "energías opuestas"),
    ];
    const r1 = selectAtlasRecommendations(ranked);
    const r2 = selectAtlasRecommendations(ranked);
    expect(r1.high.map(e => e.id)).toEqual(r2.high.map(e => e.id));
    expect(r1.medium.map(e => e.id)).toEqual(r2.medium.map(e => e.id));
    expect(r1.enemy.map(e => e.id)).toEqual(r2.enemy.map(e => e.id));
  });

  test('empty ranked list returns empty buckets', () => {
    const result = selectAtlasRecommendations([]);
    expect(result.high).toHaveLength(0);
    expect(result.medium).toHaveLength(0);
    expect(result.enemy).toHaveLength(0);
  });
});
