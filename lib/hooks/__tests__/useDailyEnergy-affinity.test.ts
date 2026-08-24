import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useDailyEnergy } from "../useDailyEnergy";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";

// P0.1 (2026-08-23): orientationEvidence se enriquece con UNA entidad real de
// Afinidad vía fetch a /api/hoy/afinidad-del-dia — enriquecimiento, no
// dependencia crítica de /hoy. calculateUserProfile("", "1990-06-15") → Caballo.

describe("useDailyEnergy — Afinidad del día (Fase 2)", () => {
  const targetDate = new Date(2026, 7, 23); // 2026-08-23
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("sin perfil: no hace fetch y dailyConnection es undefined/null", async () => {
    const { result } = renderHook(() => useDailyEnergy(null, targetDate));
    await new Promise((r) => setTimeout(r, 0));
    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current?.dailyConnection).toBeFalsy();
  });

  test("con perfil: aparece dailyConnection contextual cuando el endpoint responde", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ entity: { id: "nike-brand", name: "Nike", type: "brand" }, relation: "triad", relationLabel: "buena compatibilidad" }),
    });
    const profile = calculateUserProfile("", "1990-06-15");
    const { result } = renderHook(() => useDailyEnergy(profile, targetDate));

    await waitFor(() => {
      expect(result.current?.dailyConnection).toBeTruthy();
    });

    const conn = result.current?.dailyConnection;
    expect(conn?.name).toBe("Nike");
    expect(conn?.relationLabel).toBe("buena compatibilidad");
    expect(conn?.href).toBe("/affinity/brand/nike-brand");
    expect(conn?.explanation).toContain("animales aliados");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain("/api/hoy/afinidad-del-dia?animal=Caballo&date=2026-08-23");
  });

  test("el Consejo del Momento no se bloquea ni desaparece mientras se espera Afinidad", async () => {
    fetchMock.mockImplementation(() => new Promise(() => {})); // nunca resuelve
    const profile = calculateUserProfile("", "1990-06-15");
    const { result } = renderHook(() => useDailyEnergy(profile, targetDate));

    // dailyAdvice ya está disponible de forma síncrona, sin esperar el fetch
    expect(result.current?.dailyAdvice).toBeTruthy();
    expect(result.current?.orientationEvidence.length).toBeGreaterThan(0);
  });

  test("endpoint caído: /hoy sigue funcionando, sin dailyConnection", async () => {
    fetchMock.mockRejectedValue(new Error("network down"));
    const profile = calculateUserProfile("", "1990-06-15");
    const { result } = renderHook(() => useDailyEnergy(profile, targetDate));

    expect(result.current?.dailyAdvice).toBeTruthy();

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    await new Promise((r) => setTimeout(r, 0));

    expect(result.current?.dailyConnection).toBeFalsy();
    expect(result.current?.dailyAdvice).toBeTruthy();
  });

  test("endpoint responde sin entidad (candidatas vacías): /hoy sigue funcionando", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ entity: null, relation: null }) });
    const profile = calculateUserProfile("", "1990-06-15");
    const { result } = renderHook(() => useDailyEnergy(profile, targetDate));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    await new Promise((r) => setTimeout(r, 0));

    expect(result.current?.dailyConnection).toBeFalsy();
    expect(result.current?.dailyAdvice).toBeTruthy();
  });

  test("reload (remount) el mismo día: misma URL determinística (animal+fecha) y mismo resultado", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ entity: { id: "nike-brand", name: "Nike", type: "brand" }, relation: "triad", relationLabel: "buena compatibilidad" }),
    });
    const profile = calculateUserProfile("", "1990-06-15");

    const { result: r1 } = renderHook(() => useDailyEnergy(profile, targetDate));
    await waitFor(() => expect(r1.current?.dailyConnection).toBeTruthy());

    const { result: r2 } = renderHook(() => useDailyEnergy(profile, targetDate));
    await waitFor(() => expect(r2.current?.dailyConnection).toBeTruthy());

    const v1 = r1.current?.dailyConnection?.name;
    const v2 = r2.current?.dailyConnection?.name;
    expect(v1).toBe(v2);

    const urls = fetchMock.mock.calls.map((c) => c[0]);
    expect(urls[0]).toBe(urls[1]);
  });
});
