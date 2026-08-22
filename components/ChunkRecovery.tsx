"use client";

import { useEffect } from "react";

// Recuperación automática de ChunkLoadError post-deploy.
//
// Síntoma que este componente elimina: usuario con una pestaña abierta de la
// build N navega internamente después de un deploy (build N+1). El router de
// Next pide un chunk con hash viejo que ya no existe en el deployment → la
// navegación falla en silencio y la página queda en blanco o tibia hasta que
// la persona hace F5 (el HTML fresco referencia los chunks nuevos).
//
// Estrategia estándar: detectar el error de carga de módulo y hacer UN solo
// location.reload(). El guard de sessionStorage + cooldown evita bucles si
// el redeploy está genuinamente roto.
const RELOAD_KEY = "molino.chunk-reload-at";
const COOLDOWN_MS = 10_000;

const CHUNK_ERROR_PATTERNS = [
  /ChunkLoadError/i,
  /Loading chunk \d+ failed/i,
  /Failed to fetch dynamically imported module/i,
  /error loading dynamically imported module/i,
  /Importing a module script failed/i,
];

function isChunkError(raw: string): boolean {
  return CHUNK_ERROR_PATTERNS.some((re) => re.test(raw));
}

export default function ChunkRecovery() {
  useEffect(() => {
    let reloading = false;

    const recover = (raw: string) => {
      if (reloading || !isChunkError(raw)) return;
      let last = 0;
      try {
        last = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
      } catch {
        // sessionStorage bloqueado (privacy mode extremo) — igual recargar
      }
      if (Date.now() - last < COOLDOWN_MS) return;
      reloading = true;
      try {
        sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
      } catch {}
      window.location.reload();
    };

    const onError = (e: ErrorEvent) => recover(e.message || e.error?.message || "");
    const onRejection = (e: PromiseRejectionEvent) =>
      recover(String(e.reason?.message || e.reason || ""));

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
