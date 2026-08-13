import { describe, it, expect } from "vitest";
import { GET, OPTIONS } from "@/app/api/v1/map/route";

describe("Public API v1 — /api/v1/map", () => {
  it("returns CORS headers on OPTIONS preflight", async () => {
    const res = await OPTIONS();
    expect(res.status).toBe(204);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  it("returns 400 when date parameter is missing or invalid", async () => {
    const req = new Request("http://localhost:3000/api/v1/map");
    const res = await GET(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toBeDefined();
  });

  it("returns structured symbolic map data for valid date", async () => {
    const req = new Request("http://localhost:3000/api/v1/map?date=1990-03-15&name=Ana");
    const res = await GET(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.status).toBe("success");
    expect(json.query.date).toBe("1990-03-15");
    expect(json.query.name).toBe("Ana");

    // Numerology
    expect(json.map.numerology.lifePath).toBe(1);

    // Astrology
    expect(json.map.astrology.sunSign).toBe("Piscis");

    // Chinese Zodiac
    expect(json.map.chineseZodiac.animal).toBe("Caballo");

    // Cycles
    expect(json.map.cycles.personalYear).toBeDefined();
    expect(json.map.cycles.personalDay).toBeDefined();
  });
});
