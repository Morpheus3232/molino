/**
 * Atlas affinity ranking selection tests.
 * Covers selectAtlasRecommendations and getEnemyAnimal from affinity-light.ts.
 */
import { describe, test, expect } from 'vitest';
import {
  sortLightEntities,
  selectAtlasRecommendations,
  getEnemyAnimal,
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

describe('getEnemyAnimal', () => {
  test('Caballo enemy is Rata (Liu Chong)', () => {
    expect(getEnemyAnimal("Caballo")).toBe("Rata");
  });

  test('Rata enemy is Caballo (Liu Chong)', () => {
    expect(getEnemyAnimal("Rata")).toBe("Caballo");
  });

  test('Buey enemy is Cabra (Liu Chong)', () => {
    expect(getEnemyAnimal("Buey")).toBe("Cabra");
  });

  test('Tigre enemy is Mono (Liu Chong)', () => {
    expect(getEnemyAnimal("Tigre")).toBe("Mono");
  });

  test('Gato enemy is Gallo (Liu Chong)', () => {
    expect(getEnemyAnimal("Gato")).toBe("Gallo");
  });

  test('Dragón enemy is Perro (Liu Chong)', () => {
    expect(getEnemyAnimal("Dragón")).toBe("Perro");
  });

  test('Serpiente enemy is Cerdo (Liu Chong)', () => {
    expect(getEnemyAnimal("Serpiente")).toBe("Cerdo");
  });

  test('Cabra enemy is Buey (Liu Chong)', () => {
    expect(getEnemyAnimal("Cabra")).toBe("Buey");
  });

  test('Mono enemy is Tigre (Liu Chong)', () => {
    expect(getEnemyAnimal("Mono")).toBe("Tigre");
  });

  test('Gallo enemy is Gato (Liu Chong)', () => {
    expect(getEnemyAnimal("Gallo")).toBe("Gato");
  });

  test('Perro enemy is Dragón (Liu Chong)', () => {
    expect(getEnemyAnimal("Perro")).toBe("Dragón");
  });

  test('Cerdo enemy is Serpiente (Liu Chong)', () => {
    expect(getEnemyAnimal("Cerdo")).toBe("Serpiente");
  });

  test('invalid animal returns null', () => {
    expect(getEnemyAnimal("Unicornio")).toBeNull();
  });

  test('empty string returns null', () => {
    expect(getEnemyAnimal("")).toBeNull();
  });
});

describe('selectAtlasRecommendations', () => {
  test('Caballo → Caballo = MOST compatible, Caballo → Rata = LEAST compatible', () => {
    const ranked = sortLightEntities("Caballo", [
      makeEntity({ id: "la-plata", animal: "Caballo", name: "La Plata" }),
      makeEntity({ id: "salta", animal: "Caballo", name: "Salta" }),
      makeEntity({ id: "rata-x", animal: "Rata", name: "Entidad Rata" }),
      makeEntity({ id: "buey-x", animal: "Buey", name: "Entidad Buey" }),
      makeEntity({ id: "tigre-x", animal: "Tigre", name: "Entidad Tigre" }),
      makeEntity({ id: "perro-x", animal: "Perro", name: "Entidad Perro" }),
    ]);
    const result = selectAtlasRecommendations(ranked);

    const mostIds = result.most.map(e => e.id);
    const leastIds = result.least.map(e => e.id);

    expect(mostIds).toContain("la-plata");
    expect(mostIds).toContain("salta");
    expect(leastIds).toContain("rata-x");

    // Buey, Tigre, Perro should NOT appear in either bucket
    expect(mostIds).not.toContain("buey-x");
    expect(mostIds).not.toContain("tigre-x");
    expect(mostIds).not.toContain("perro-x");
    expect(leastIds).not.toContain("buey-x");
    expect(leastIds).not.toContain("tigre-x");
    expect(leastIds).not.toContain("perro-x");
  });

  test('Rata → Rata = MOST, Rata → Caballo = LEAST', () => {
    const ranked = sortLightEntities("Rata", [
      makeEntity({ id: "rata-1", animal: "Rata", name: "Rata 1" }),
      makeEntity({ id: "rata-2", animal: "Rata", name: "Rata 2" }),
      makeEntity({ id: "caballo-x", animal: "Caballo", name: "Caballo X" }),
      makeEntity({ id: "dragon-x", animal: "Dragón", name: "Dragón X" }),
    ]);
    const result = selectAtlasRecommendations(ranked);

    expect(result.most.map(e => e.animal).every(a => a === "Rata")).toBe(true);
    expect(result.least.map(e => e.animal).every(a => a === "Caballo")).toBe(true);

    // Dragón (triad) should NOT appear in either bucket
    const allIds = [...result.most, ...result.least].map(e => e.id);
    expect(allIds).not.toContain("dragon-x");
  });

  test('all 12 animals have correct canonical enemies', () => {
    const expectedEnemies: Record<string, string> = {
      Rata: "Caballo", Buey: "Cabra", Tigre: "Mono",
      Gato: "Gallo", Dragón: "Perro", Serpiente: "Cerdo",
      Caballo: "Rata", Cabra: "Buey", Mono: "Tigre",
      Gallo: "Gato", Perro: "Dragón", Cerdo: "Serpiente",
    };

    const allAnimals = Object.keys(expectedEnemies);

    for (const [animal, expectedEnemy] of Object.entries(expectedEnemies)) {
      // Pick an animal that is neither same nor enemy for this iteration
      const neutralAnimal = allAnimals.find(a => a !== animal && a !== expectedEnemy)!;
      const ranked = sortLightEntities(animal, [
        makeEntity({ id: `same-${animal}`, animal, name: `Same ${animal}` }),
        makeEntity({ id: `enemy-${expectedEnemy}`, animal: expectedEnemy, name: `Enemy ${expectedEnemy}` }),
        makeEntity({ id: `other-neutral`, animal: neutralAnimal, name: "Neutral" }),
      ]);
      const result = selectAtlasRecommendations(ranked);

      expect(result.most.map(e => e.animal).every(a => a === animal),
        `${animal}: most should only contain ${animal}`).toBe(true);
      expect(result.least.map(e => e.animal).every(a => a === expectedEnemy),
        `${animal}: least should only contain ${expectedEnemy}`).toBe(true);

      // Neutral animal should never appear
      const allIds = [...result.most, ...result.least].map(e => e.id);
      expect(allIds).not.toContain("other-neutral");
    }
  });

  test('no duplicates across buckets', () => {
    const ranked = sortLightEntities("Caballo", [
      makeEntity({ id: "a", animal: "Caballo" }),
      makeEntity({ id: "b", animal: "Caballo" }),
      makeEntity({ id: "c", animal: "Caballo" }),
      makeEntity({ id: "x1", animal: "Rata" }),
      makeEntity({ id: "x2", animal: "Rata" }),
    ]);
    const result = selectAtlasRecommendations(ranked);
    const allIds = [...result.most, ...result.least].map(r => r.id);
    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);
  });

  test('country priority within same bucket', () => {
    const ranked = sortLightEntities("Caballo", [
      makeEntity({ id: "ar1", animal: "Caballo", countryISO: "AR", country: "Argentina" }),
      makeEntity({ id: "mx1", animal: "Caballo", countryISO: "MX", country: "México" }),
      makeEntity({ id: "ar2", animal: "Caballo", countryISO: "AR", country: "Argentina" }),
      makeEntity({ id: "us1", animal: "Caballo", countryISO: "US", country: "USA" }),
      makeEntity({ id: "ar3", animal: "Caballo", countryISO: "AR", country: "Argentina" }),
      makeEntity({ id: "br1", animal: "Caballo", countryISO: "BR", country: "Brasil" }),
      makeEntity({ id: "e-ar", animal: "Rata", countryISO: "AR", country: "Argentina" }),
      makeEntity({ id: "e-mx", animal: "Rata", countryISO: "MX", country: "México" }),
      makeEntity({ id: "e-us", animal: "Rata", countryISO: "US", country: "USA" }),
    ]);
    const result = selectAtlasRecommendations(ranked, "AR");
    // AR entities should appear first within each bucket
    expect(result.most.slice(0, 3).every(r => r.countryISO === "AR")).toBe(true);
    expect(result.least[0].countryISO).toBe("AR");
  });

  test('no userCountryISO: ranking still works', () => {
    const ranked = sortLightEntities("Rata", [
      makeEntity({ id: "a", animal: "Rata", countryISO: "AR" }),
      makeEntity({ id: "b", animal: "Rata", countryISO: "MX" }),
      makeEntity({ id: "c", animal: "Rata", countryISO: "US" }),
      makeEntity({ id: "d", animal: "Rata", countryISO: "BR" }),
      makeEntity({ id: "e", animal: "Rata", countryISO: "CL" }),
      makeEntity({ id: "x1", animal: "Caballo", countryISO: "AR" }),
      makeEntity({ id: "x2", animal: "Caballo", countryISO: "MX" }),
    ]);
    const result = selectAtlasRecommendations(ranked, null);
    expect(result.most).toHaveLength(5);
    expect(result.least).toHaveLength(2);
  });

  test('deterministic: same input yields same output', () => {
    const ranked = sortLightEntities("Caballo", [
      makeEntity({ id: "a", animal: "Caballo" }),
      makeEntity({ id: "b", animal: "Caballo" }),
      makeEntity({ id: "x1", animal: "Rata" }),
      makeEntity({ id: "x2", animal: "Rata" }),
    ]);
    const r1 = selectAtlasRecommendations(ranked);
    const r2 = selectAtlasRecommendations(ranked);
    expect(r1.most.map(e => e.id)).toEqual(r2.most.map(e => e.id));
    expect(r1.least.map(e => e.id)).toEqual(r2.least.map(e => e.id));
  });

  test('empty ranked list returns empty buckets', () => {
    const result = selectAtlasRecommendations([]);
    expect(result.most).toHaveLength(0);
    expect(result.least).toHaveLength(0);
  });

  test('ranked list without same-animal entities returns empty buckets', () => {
    const ranked: LightAffinityResult[] = [
      makeResult(makeEntity({ id: "b", animal: "Tigre" }), 50, "complementarios", "energías independientes"),
      makeResult(makeEntity({ id: "c", animal: "Dragón" }), 85, "resonancia-alta", "tríada"),
    ];
    const result = selectAtlasRecommendations(ranked);
    expect(result.most).toHaveLength(0);
    expect(result.least).toHaveLength(0);
  });
});
