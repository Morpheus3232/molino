import { describe, it, expect } from "vitest";
import { GET as getDaily, OPTIONS as optionsDaily } from "@/app/api/v1/daily/route";
import { GET as getCompatibility, OPTIONS as optionsCompatibility } from "@/app/api/v1/compatibility/route";

describe("Public API v1 — Daily & Compatibility", () => {
  describe("/api/v1/daily", () => {
    it("returns CORS headers on OPTIONS preflight", async () => {
      const res = await optionsDaily();
      expect(res.status).toBe(204);
      expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
    });

    it("returns 400 when birthDate is missing", async () => {
      const req = new Request("http://localhost:3000/api/v1/daily");
      const res = await getDaily(req);
      expect(res.status).toBe(400);
    });

    it("returns daily energy calculation for valid birthDate", async () => {
      const req = new Request("http://localhost:3000/api/v1/daily?birthDate=1990-03-15&targetDate=2026-08-14");
      const res = await getDaily(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.status).toBe("success");
      expect(json.dailyEnergy.personalDay).toBeGreaterThanOrEqual(1);
      expect(json.dailyEnergy.theme).toBeDefined();
      expect(json.dailyEnergy.moonPhase).toBeDefined();
    });
  });

  describe("/api/v1/compatibility", () => {
    it("returns CORS headers on OPTIONS preflight", async () => {
      const res = await optionsCompatibility();
      expect(res.status).toBe(204);
      expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
    });

    it("returns 400 when dates are missing", async () => {
      const req = new Request("http://localhost:3000/api/v1/compatibility");
      const res = await getCompatibility(req);
      expect(res.status).toBe(400);
    });

    it("returns couple compatibility for valid dates", async () => {
      const req = new Request("http://localhost:3000/api/v1/compatibility?dateA=1990-03-15&dateB=1988-07-22&nameA=Ana&nameB=Lucas");
      const res = await getCompatibility(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.status).toBe("success");
      expect(json.compatibility.score).toBeGreaterThanOrEqual(0);
      expect(json.compatibility.connections).toBeDefined();
      expect(json.compatibility.challenges).toBeDefined();
    });
  });
});
