import { describe, it, expect, vi, beforeEach } from "vitest";

const store = new Map<string, unknown>();
vi.mock("@/lib/kv", () => ({
  getKvClient: async () => ({
    get: async (k: string) => store.get(k) ?? null,
    set: async (k: string, v: unknown) => void store.set(k, v),
    del: async (k: string) => void store.delete(k),
  }),
}));

import { incrementFunnel, readFunnel, isFunnelEvent } from "../funnel";

describe("embudo anónimo", () => {
  beforeEach(() => store.clear());
  it("cuenta por evento y por mes, sin nada más en la clave", async () => {
    const nov = new Date("2026-11-02T12:00:00Z");
    await incrementFunnel("paywall_viewed", nov);
    await incrementFunnel("paywall_viewed", nov);
    await incrementFunnel("premium_unlocked", new Date("2026-10-30T12:00:00Z"));
    expect([...store.keys()].sort()).toEqual(["funnel:paywall_viewed:2026-11", "funnel:premium_unlocked:2026-10"]);
    const [m0, m1] = await readFunnel(2, nov);
    expect(m0).toMatchObject({ month: "2026-11" });
    expect(m0.counts.paywall_viewed).toBe(2);
    expect(m0.counts.premium_unlocked).toBe(0);
    expect(m1.month).toBe("2026-10");
    expect(m1.counts.premium_unlocked).toBe(1);
  });
  it("lista blanca", () => {
    expect(isFunnelEvent("paywall_viewed")).toBe(true);
    expect(isFunnelEvent("cualquier_cosa")).toBe(false);
    expect(isFunnelEvent(42)).toBe(false);
  });
});
