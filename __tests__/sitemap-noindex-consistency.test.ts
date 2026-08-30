import { describe, test, expect } from "vitest";
import fs from "fs";
import path from "path";

// Regresión Fase 2 (2026-08-22): la auditoría SEO reportó rutas privadas/
// funcionales en el sitemap con prioridad relevante pese a estar marcadas
// `noIndex: true` en su propia metadata — señal contradictoria a Google.
//
// Fase 3 (2026-08-30): /portal, /alignment y /decisions se consolidaron
// (301 en next.config) y sus dirs se borraron — salen de esta lista.
// Quedan /onboarding y /circulo (vistas privadas que siguen existiendo);
// se suma /mundo, hermana de /circulo (vista pública para compartir).

const APP_DIR = path.resolve(__dirname, "..", "app");
// Rutas confirmadas noIndex:true cuyo layout/page se leyó a mano. No es un
// descubrimiento automático — evita que sitemap.ts vuelva a listarlas.
const KNOWN_NOINDEX_ROUTES = ["onboarding", "circulo", "mundo"];

describe("sitemap.ts no contradice las rutas marcadas noIndex", () => {
  test.each(KNOWN_NOINDEX_ROUTES)("%s sigue siendo noIndex en su metadata", (route) => {
    const layoutPath = path.join(APP_DIR, route, "layout.tsx");
    const src = fs.readFileSync(layoutPath, "utf8");
    expect(src).toContain("noIndex: true");
  });

  test.each(KNOWN_NOINDEX_ROUTES)("%s no aparece en sitemap.ts", (route) => {
    const sitemapSrc = fs.readFileSync(path.join(APP_DIR, "sitemap.ts"), "utf8");
    expect(sitemapSrc).not.toMatch(new RegExp("/" + route + "`"));
  });
});

describe("lang del documento coincide con la convención del proyecto (es-AR)", () => {
  test("app/layout.tsx declara lang=\"es-AR\"", () => {
    const src = fs.readFileSync(path.join(APP_DIR, "layout.tsx"), "utf8");
    expect(src).toContain('lang="es-AR"');
    expect(src).not.toContain('lang="es"');
  });
});
