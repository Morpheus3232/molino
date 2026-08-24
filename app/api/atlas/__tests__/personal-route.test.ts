import { describe, test, expect } from "vitest";
import { GET } from "../personal/route";

// Contrato HTTP de /api/atlas/personal: getPersonalAtlas() ya está probado
// a nivel de motor en lib/data/__tests__/personal-atlas.test.ts — acá solo
// se cubre el mapeo query-string -> respuesta que vive en el route handler.

function request(query: string): Request {
  return new Request(`http://localhost/api/atlas/personal${query}`);
}

describe("GET /api/atlas/personal", () => {
  test("animal inválido -> 400", async () => {
    const res = await GET(request("?animal=Godzilla"));
    expect(res.status).toBe(400);
  });

  test("animal ausente -> 400", async () => {
    const res = await GET(request(""));
    expect(res.status).toBe(400);
  });

  test("category=movie en la query string no cambia el piloto", async () => {
    const res = await GET(request("?animal=Caballo&countryISO=AR&category=movie"));
    expect(res.status).toBe(200);
    const body = await res.json();
    const categories = body.groups.map((g: { category: string }) => g.category).sort();
    expect(categories).toEqual(["artist", "city", "football_player", "team", "university"]);
  });

  test("category=brand en la query string no cambia el piloto", async () => {
    const res = await GET(request("?animal=Caballo&countryISO=AR&category=brand"));
    expect(res.status).toBe(200);
    const body = await res.json();
    const categories = body.groups.map((g: { category: string }) => g.category).sort();
    expect(categories).toEqual(["artist", "city", "football_player", "team", "university"]);
  });

  test("city aparece como grupo del piloto con un nivel válido", async () => {
    const res = await GET(request("?animal=Caballo&countryISO=AR"));
    expect(res.status).toBe(200);
    const body = await res.json();
    const cityGroup = body.groups.find((g: { category: string }) => g.category === "city");
    expect(cityGroup).toBeDefined();
    expect([
      "country-animal", "country-relation",
      "region-animal", "region-relation",
      "world-animal", "world-relation",
    ]).toContain(cityGroup.level);
  });

  test("un grupo sin resultados no se infla artificialmente: entities.length nunca supera totalAvailable", async () => {
    const res = await GET(request("?animal=Dragón&countryISO=MX"));
    expect(res.status).toBe(200);
    const body = await res.json();
    for (const group of body.groups) {
      expect(group.entities.length).toBeLessThanOrEqual(group.totalAvailable);
    }
  });

  test("sin countryISO, todos los grupos resuelven en world-*", async () => {
    const res = await GET(request("?animal=Caballo"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.usedCountry).toBe(false);
    for (const group of body.groups) {
      expect(["world-animal", "world-relation"]).toContain(group.level);
    }
  });

  test("con countryISO, al menos un grupo puede resolver a nivel país", async () => {
    const res = await GET(request("?animal=Caballo&countryISO=AR"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.usedCountry).toBe(true);
  });
});
