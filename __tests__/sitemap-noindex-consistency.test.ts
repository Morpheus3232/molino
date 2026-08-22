import { describe, test, expect } from "vitest";
import fs from "fs";
import path from "path";

// Regresión Fase 2 (2026-08-22): la auditoría SEO reportó que /onboarding,
// /portal, /circulo, /alignment y /decisions estaban en el sitemap con
// prioridad relevante pero sin metadata propia — canonical heredado
// apuntando a la home. Al investigar, las 5 rutas SÍ tienen metadata propia
// (layout.tsx con createRouteMetadata), pero están explícitamente marcadas
// `noIndex: true` porque son páginas privadas/funcionales — el bug real es
// que igual aparecían en el sitemap, mandándole a Google la señal opuesta
// ("indexá esto") a la de su propia metadata ("no indexes esto").

const APP_DIR = path.resolve(__dirname, "..", "app");
// Rutas confirmadas noIndex:true cuyo layout/page se leyó a mano en esta
// fase. No es un descubrimiento automático — evita que sitemap.ts vuelva a
// listarlas, no reemplaza a chequear noIndex en cada ruta nueva.
const KNOWN_NOINDEX_ROUTES = ["onboarding", "portal", "circulo", "alignment", "decisions"];

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
