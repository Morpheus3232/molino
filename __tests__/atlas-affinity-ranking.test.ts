/**
 * Atlas affinity section builder tests.
 * Covers buildAtlasSections and getEnemyAnimal from affinity-light.ts.
 */
import { describe, test, expect } from 'vitest';
import {
  sortLightEntities,
  buildAtlasSections,
  getEnemyAnimal,
  countAffinityMatches,
  type LightAffinityResult,
} from '@/lib/affinity-light';
import type { LightweightEntity } from '@/types/atlas';
import { getEntitiesByType, toLightweightEntity, type EntityType } from '@/lib/data/symbolic-entities';

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
    expect(ranked[0].score).toBeGreaterThanOrEqual(ranked[1].score);
    expect(ranked[1].score).toBeGreaterThanOrEqual(ranked[2].score);
  });
});

describe('getEnemyAnimal', () => {
  test('Caballo enemy is Rata', () => expect(getEnemyAnimal("Caballo")).toBe("Rata"));
  test('Rata enemy is Caballo', () => expect(getEnemyAnimal("Rata")).toBe("Caballo"));
  test('Buey enemy is Cabra', () => expect(getEnemyAnimal("Buey")).toBe("Cabra"));
  test('Tigre enemy is Mono', () => expect(getEnemyAnimal("Tigre")).toBe("Mono"));
  test('Gato enemy is Gallo', () => expect(getEnemyAnimal("Gato")).toBe("Gallo"));
  test('Dragón enemy is Perro', () => expect(getEnemyAnimal("Dragón")).toBe("Perro"));
  test('Serpiente enemy is Cerdo', () => expect(getEnemyAnimal("Serpiente")).toBe("Cerdo"));
  test('Cabra enemy is Buey', () => expect(getEnemyAnimal("Cabra")).toBe("Buey"));
  test('Mono enemy is Tigre', () => expect(getEnemyAnimal("Mono")).toBe("Tigre"));
  test('Gallo enemy is Gato', () => expect(getEnemyAnimal("Gallo")).toBe("Gato"));
  test('Perro enemy is Dragón', () => expect(getEnemyAnimal("Perro")).toBe("Dragón"));
  test('Cerdo enemy is Serpiente', () => expect(getEnemyAnimal("Cerdo")).toBe("Serpiente"));
  test('invalid returns null', () => expect(getEnemyAnimal("Unicornio")).toBeNull());
  test('empty returns null', () => expect(getEnemyAnimal("")).toBeNull());
});

describe('buildAtlasSections', () => {
  test('Caballo → Caballo in sameAnimal, Caballo → Rata in enemyAnimal', () => {
    const entities: LightweightEntity[] = [
      makeEntity({ id: "la-plata", animal: "Caballo", type: "city", name: "La Plata" }),
      makeEntity({ id: "salta", animal: "Caballo", type: "city", name: "Salta" }),
      makeEntity({ id: "rata-x", animal: "Rata", type: "city", name: "Ciudad Rata" }),
      makeEntity({ id: "buey-x", animal: "Buey", type: "city", name: "Ciudad Buey" }),
      makeEntity({ id: "tigre-x", animal: "Tigre", type: "city", name: "Ciudad Tigre" }),
    ];
    const result = buildAtlasSections("Caballo", entities);

    expect(result.userAnimal).toBe("Caballo");
    expect(result.enemyAnimalName).toBe("Rata");

    // sameAnimal should only contain Caballo entities
    const sameAll = result.sameAnimal.flatMap(s => s.entities);
    expect(sameAll.every(e => e.animal === "Caballo")).toBe(true);
    const sameIds = sameAll.map(e => e.id);
    expect(sameIds).toContain("la-plata");
    expect(sameIds).toContain("salta");
    expect(sameIds).not.toContain("rata-x");
    expect(sameIds).not.toContain("buey-x");
    expect(sameIds).not.toContain("tigre-x");

    // enemyAnimal should only contain Rata entities
    const enemyAll = result.enemyAnimal.flatMap(s => s.entities);
    expect(enemyAll.every(e => e.animal === "Rata")).toBe(true);
    const enemyIds = enemyAll.map(e => e.id);
    expect(enemyIds).toContain("rata-x");
    expect(enemyIds).not.toContain("la-plata");
    expect(enemyIds).not.toContain("buey-x");
    expect(enemyIds).not.toContain("tigre-x");
  });

  test('entities grouped by category', () => {
    const entities: LightweightEntity[] = [
      makeEntity({ id: "city1", animal: "Caballo", type: "city", name: "City 1" }),
      makeEntity({ id: "city2", animal: "Caballo", type: "city", name: "City 2" }),
      makeEntity({ id: "brand1", animal: "Caballo", type: "brand", name: "Brand 1" }),
      makeEntity({ id: "brand2", animal: "Caballo", type: "brand", name: "Brand 2" }),
    ];
    const result = buildAtlasSections("Caballo", entities);

    const citySection = result.sameAnimal.find(s => s.type === "city");
    const brandSection = result.sameAnimal.find(s => s.type === "brand");

    expect(citySection).toBeDefined();
    expect(citySection!.entities).toHaveLength(2);
    expect(brandSection).toBeDefined();
    expect(brandSection!.entities).toHaveLength(2);
  });

  test('categories with no entities are excluded', () => {
    const entities: LightweightEntity[] = [
      makeEntity({ id: "city1", animal: "Caballo", type: "city", name: "City 1" }),
    ];
    const result = buildAtlasSections("Caballo", entities);

    const types = result.sameAnimal.map(s => s.type);
    expect(types).toContain("city");
    expect(types).not.toContain("brand");
    expect(types).not.toContain("team");
  });

  test('all 12 animals: sameAnimal only contains userAnimal', () => {
    const expectedEnemies: Record<string, string> = {
      Rata: "Caballo", Buey: "Cabra", Tigre: "Mono",
      Gato: "Gallo", Dragón: "Perro", Serpiente: "Cerdo",
      Caballo: "Rata", Cabra: "Buey", Mono: "Tigre",
      Gallo: "Gato", Perro: "Dragón", Cerdo: "Serpiente",
    };

    const allAnimals = Object.keys(expectedEnemies);

    for (const animal of allAnimals) {
      const entities: LightweightEntity[] = [
        makeEntity({ id: `same-${animal}`, animal, type: "city", name: `Same ${animal}` }),
        makeEntity({ id: `enemy-${expectedEnemies[animal]}`, animal: expectedEnemies[animal], type: "city", name: `Enemy` }),
        makeEntity({ id: "neutral", animal: allAnimals.find(a => a !== animal && a !== expectedEnemies[animal])!, type: "city", name: "Neutral" }),
      ];
      const result = buildAtlasSections(animal, entities);

      const sameAll = result.sameAnimal.flatMap(s => s.entities);
      expect(sameAll.every(e => e.animal === animal),
        `${animal}: sameAnimal should only contain ${animal}`).toBe(true);

      const enemyAll = result.enemyAnimal.flatMap(s => s.entities);
      expect(enemyAll.every(e => e.animal === expectedEnemies[animal]),
        `${animal}: enemyAnimal should only contain ${expectedEnemies[animal]}`).toBe(true);

      const allIds = [...sameAll, ...enemyAll].map(e => e.id);
      expect(allIds).not.toContain("neutral");
    }
  });

  test('no duplicates across sections', () => {
    const entities: LightweightEntity[] = [
      makeEntity({ id: "a", animal: "Caballo", type: "city" }),
      makeEntity({ id: "b", animal: "Caballo", type: "city" }),
      makeEntity({ id: "x1", animal: "Rata", type: "city" }),
      makeEntity({ id: "x2", animal: "Rata", type: "city" }),
    ];
    const result = buildAtlasSections("Caballo", entities);
    const allIds = [...result.sameAnimal, ...result.enemyAnimal].flatMap(s => s.entities).map(e => e.id);
    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);
  });

  test('country priority within same category', () => {
    const entities: LightweightEntity[] = [
      makeEntity({ id: "ar1", animal: "Caballo", type: "city", countryISO: "AR", country: "Argentina" }),
      makeEntity({ id: "mx1", animal: "Caballo", type: "city", countryISO: "MX", country: "México" }),
      makeEntity({ id: "ar2", animal: "Caballo", type: "city", countryISO: "AR", country: "Argentina" }),
      makeEntity({ id: "us1", animal: "Caballo", type: "city", countryISO: "US", country: "USA" }),
    ];
    const result = buildAtlasSections("Caballo", entities, "AR");

    const citySection = result.sameAnimal.find(s => s.type === "city");
    expect(citySection).toBeDefined();
    // AR entities should come first
    expect(citySection!.entities.slice(0, 2).every(e => e.countryISO === "AR")).toBe(true);
  });

  test('no userCountryISO still works', () => {
    const entities: LightweightEntity[] = [
      makeEntity({ id: "a", animal: "Rata", type: "city", countryISO: "AR" }),
      makeEntity({ id: "b", animal: "Rata", type: "city", countryISO: "MX" }),
      makeEntity({ id: "x", animal: "Caballo", type: "city", countryISO: "AR" }),
    ];
    const result = buildAtlasSections("Rata", entities, null);
    const sameAll = result.sameAnimal.flatMap(s => s.entities);
    expect(sameAll).toHaveLength(2);
    const enemyAll = result.enemyAnimal.flatMap(s => s.entities);
    expect(enemyAll).toHaveLength(1);
  });

  test('deterministic output', () => {
    const entities: LightweightEntity[] = [
      makeEntity({ id: "a", animal: "Caballo", type: "city" }),
      makeEntity({ id: "b", animal: "Caballo", type: "city" }),
    ];
    const r1 = buildAtlasSections("Caballo", entities);
    const r2 = buildAtlasSections("Caballo", entities);
    expect(r1.sameAnimal[0].entities.map(e => e.id)).toEqual(r2.sameAnimal[0].entities.map(e => e.id));
  });

  test('null userAnimal returns empty sections', () => {
    const entities: LightweightEntity[] = [
      makeEntity({ id: "a", animal: "Caballo", type: "city" }),
    ];
    const result = buildAtlasSections(null, entities);
    expect(result.sameAnimal).toHaveLength(0);
    expect(result.enemyAnimal).toHaveLength(0);
    expect(result.userAnimal).toBeNull();
    expect(result.enemyAnimalName).toBeNull();
  });
});

describe('countAffinityMatches', () => {
  test('a neutral relation (score exactly 50) is NOT counted as a match', () => {
    // Caballo/Gato is a neutralRelations pair → score 50 ("complementarios" tier).
    const entities = [{ animal: "Gato" }];
    const { total, matched } = countAffinityMatches("Caballo", entities);
    expect(total).toBe(1);
    expect(matched).toBe(0);
  });

  test('same-animal (score 95) and triad/harmonious (>=60) count as matches', () => {
    const entities = [
      { animal: "Caballo" }, // same, 95
      { animal: "Perro" },   // Caballo triad partner
    ];
    const { matched } = countAffinityMatches("Caballo", entities);
    expect(matched).toBe(2);
  });

  test('clash/harm (score < 60) are not counted', () => {
    // Caballo enemy is Rata (clash, score 30).
    const entities = [{ animal: "Rata" }];
    const { matched } = countAffinityMatches("Caballo", entities);
    expect(matched).toBe(0);
  });

  test('country boost can push a neutral relation over the affinity threshold', () => {
    // Neutral (50) + 15 country boost = 65 >= 60 → counts.
    const entities = [{ animal: "Gato", country: "Argentina" }];
    const { matched } = countAffinityMatches("Caballo", entities, "Argentina");
    expect(matched).toBe(1);
    // Without the boost, same pair does not count.
    const { matched: unboosted } = countAffinityMatches("Caballo", entities);
    expect(unboosted).toBe(0);
  });

  test('real catalog counts for Camino de Vida 5 · Caballo profile (per category)', () => {
    const CATEGORY_TYPES: EntityType[] = ['brand', 'country', 'city', 'team', 'university', 'movie', 'artist'];
    const results: Record<string, { total: number; matched: number }> = {};
    for (const type of CATEGORY_TYPES) {
      const entities = getEntitiesByType(type).map((e) => toLightweightEntity(e));
      results[type] = countAffinityMatches("Caballo", entities);
    }
    console.log('\n=== countAffinityMatches — Caballo (afinidad-media+ only, neutral excluded) ===');
    for (const type of CATEGORY_TYPES) {
      console.log(`  ${type.padEnd(12)} matched: ${results[type].matched} / ${results[type].total}`);
    }
    // Sanity: matched can never exceed total, and every category has data.
    for (const type of CATEGORY_TYPES) {
      expect(results[type].matched).toBeLessThanOrEqual(results[type].total);
      expect(results[type].total).toBeGreaterThan(0);
    }
  });
});
