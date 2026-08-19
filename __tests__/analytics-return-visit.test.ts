/**
 * return_visit — Analítica local client-side.
 *
 * Verifica la lógica de `molino-analytics/trackReturnVisit`: un "retorno" es
 * una visita del MISMO nodo (mismo user-id implícito) después de 24 h sin
 * venir. Solo debe dispararse una vez por sesión de pestaña y nunca en el
 * primer contacto. Cero servidor: todo vive en localStorage/sessionStorage.
 */
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { analytics } from "@/lib/analytics/analytics";

const LAST_VISIT = "molino-analytics-last-visit";
const RETURN_COUNTED = "molino-analytics-return-counted";
const HOUR = 60 * 60 * 1000;

beforeEach(() => {
  analytics.clearEvents();
  window.localStorage.clear();
  window.sessionStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
  window.localStorage.clear();
  window.sessionStorage.clear();
});

function lastVisitCount(): number {
  return analytics.getStats().returnVisits;
}

describe("trackReturnVisit (analytics local)", () => {
  test("primer contacto (sin última visita) NO es un retorno", () => {
    expect(analytics.trackReturnVisit()).toBe(false);
    expect(lastVisitCount()).toBe(0);
  });

  test("visita dentro de 24 h NO es un retorno", () => {
    const now = Date.now();
    window.localStorage.setItem(LAST_VISIT, String(now - 2 * HOUR));
    expect(analytics.trackReturnVisit()).toBe(false);
    expect(lastVisitCount()).toBe(0);
  });

  test("visita tras 24 h SÍ es un retorno", () => {
    const now = Date.now();
    window.localStorage.setItem(LAST_VISIT, String(now - 25 * HOUR));
    expect(analytics.trackReturnVisit()).toBe(true);
    expect(lastVisitCount()).toBe(1);
  });

  test("solo se cuenta UNA vez por sesión de pestaña (sessionStorage)", () => {
    const now = Date.now();
    window.localStorage.setItem(LAST_VISIT, String(now - 25 * HOUR));
    expect(analytics.trackReturnVisit()).toBe(true);
    // segunda llamada en la misma pestaña → no vuelve a contar
    expect(analytics.trackReturnVisit()).toBe(false);
    expect(lastVisitCount()).toBe(1);
  });

  test("la ventana es configurable (periodMs)", () => {
    const now = Date.now();
    window.localStorage.setItem(LAST_VISIT, String(now - 5 * HOUR));
    // 5 h de ausencia con [ADDRESS] ventana de 10 h → todavía no cuenta como retorno
    expect(analytics.trackReturnVisit(10 * HOUR)).toBe(false);
    // misma ausencia con ventana de 2 h → ya superó el umbral → retorno
    expect(analytics.trackReturnVisit(2 * HOUR)).toBe(true);
  });

  test("updateLastVisit marca la hora actual para comparaciones futuras", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-11T12:00:00Z"));
    analytics.updateLastVisit();
    const saved = Number(window.localStorage.getItem(LAST_VISIT));
    expect(saved).toBe(new Date("2026-08-11T12:00:00Z").getTime());
  });
});
