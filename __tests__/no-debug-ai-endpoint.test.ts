import { describe, test, expect } from "vitest";
import fs from "fs";
import path from "path";

// Regresión Fase 2 (2026-08-22): app/api/deepseek-test/route.ts era un
// endpoint de debug sin autenticación ni rate limiting que proxeaba
// directamente a OpenRouter/DeepSeek con la API key del servidor —
// cualquiera podía generar costo ilimitado en la cuenta de OpenRouter de
// Molino. Cero callers en el producto (el flujo real de IA pasa por
// lib/engines/{omnirouteRouter,providerRouter,aiEngine}.ts). Se eliminó por
// completo. Este test evita que un debug endpoint sin auth vuelva a colarse
// en app/api/.

const API_DIR = path.resolve(__dirname, "..", "app", "api");

function listRouteFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listRouteFiles(full));
    else if (entry.name === "route.ts") out.push(full);
  }
  return out;
}

describe("Ningún endpoint de debug sin auth queda expuesto en app/api", () => {
  test("app/api/deepseek-test fue eliminado", () => {
    expect(fs.existsSync(path.join(API_DIR, "deepseek-test"))).toBe(false);
  });

  test("lib/openrouter-client.ts (cliente sin uso real, solo del debug endpoint) fue eliminado", () => {
    expect(
      fs.existsSync(path.resolve(__dirname, "..", "lib", "openrouter-client.ts"))
    ).toBe(false);
  });

  test("ninguna ruta de app/api/*/route.ts se llama '*-test' (patrón de debug olvidado)", () => {
    const offenders = listRouteFiles(API_DIR).filter((f) =>
      /-test[\\/]route\.ts$/.test(f)
    );
    expect(offenders).toEqual([]);
  });
});
