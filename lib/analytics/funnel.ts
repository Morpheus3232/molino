"use client";

import type { FunnelEvent } from "@/lib/funnel";

/**
 * Cuenta un paso del embudo (anónimo, agregado por mes). `oncePerSession`
 * evita inflar las vistas cuando alguien recarga la misma página.
 * Nunca tira ni bloquea: si falla, no pasa nada.
 */
export function countFunnel(event: Exclude<FunnelEvent, "premium_unlocked" | "gift_purchased">, opts?: { oncePerSession?: boolean }) {
  if (typeof window === "undefined") return;
  try {
    if (opts?.oncePerSession) {
      const k = `molino-funnel-${event}`;
      if (sessionStorage.getItem(k)) return;
      sessionStorage.setItem(k, "1");
    }
  } catch {
    /* sin sessionStorage igual se cuenta */
  }
  try {
    const body = JSON.stringify({ event });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/metrics/event", new Blob([body], { type: "application/json" }));
    } else {
      void fetch("/api/metrics/event", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
    }
  } catch {
    /* las métricas nunca rompen la página */
  }
}
