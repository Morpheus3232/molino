import { describe, test, expect } from "vitest";
import fs from "fs";
import path from "path";

function read(relPath: string): string {
  return fs.readFileSync(path.resolve(__dirname, "..", relPath), "utf8");
}

// Regresión Fase 2 (2026-08-22): /hoy tiene priority 0.9 / changeFrequency
// "daily" en el sitemap, pero HoyClient.tsx renderizaba un skeleton sin <h1>
// mientras `mounted` es false — que es siempre el caso en el HTML servido a
// crawlers/SSR. Se movió el H1 + una explicación breve al Server Component
// (app/hoy/page.tsx), fuera del gate de mount/loading, para que el HTML
// inicial tenga contenido real sin tocar la interactividad post-hydration.

describe("/hoy — contenido real en el HTML inicial (SSR)", () => {
  test("app/hoy/page.tsx sigue siendo un Server Component (sin 'use client')", () => {
    const src = read("app/hoy/page.tsx");
    expect(src).not.toContain('"use client"');
  });

  test("app/hoy/page.tsx renderiza un <h1> incondicional", () => {
    const src = read("app/hoy/page.tsx");
    expect(src).toMatch(/<h1[\s>]/);
  });

  test("HoyClient.tsx no duplica el <h1> (evita heading duplicado)", () => {
    const src = read("app/hoy/HoyClient.tsx");
    expect(src).not.toMatch(/<h1[\s>]/);
  });

  test("metadata de /hoy sigue describiendo la página real", () => {
    const src = read("app/hoy/page.tsx");
    expect(src).toContain("createRouteMetadata");
    expect(src).toMatch(/title:\s*"Hoy/);
  });
});
