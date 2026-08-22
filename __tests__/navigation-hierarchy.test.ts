import { describe, test, expect } from "vitest";
import fs from "fs";
import path from "path";

function read(relPath: string): string {
  return fs.readFileSync(path.resolve(__dirname, "..", relPath), "utf8");
}

// Regresión Fase 4 (2026-08-22): el header pasó de 8 links planos a 4 CORE
// (Mi Mapa, Hoy, Afinidades, Academia) + un dropdown "Explorar" (Atlas,
// Biblioteca, Blog, Journal, Calendario). "Afinidades" antes no estaba en
// el header en absoluto — es justo la ruta con demanda orgánica real según
// Search Console, así que su ausencia era el hallazgo más importante de la
// auditoría de navegación.

describe("Header — jerarquía CORE vs Exploración", () => {
  const header = () => read("components/layout/UniversityHeader.tsx");

  test("las 4 rutas CORE están presentes", () => {
    const src = header();
    for (const href of ["/profile", "/hoy", "/mundo", "/academy"]) {
      expect(src).toContain(`href: "${href}"`);
    }
  });

  test("Afinidades (/mundo) es CORE, no solo footer", () => {
    expect(header()).toMatch(/href:\s*"\/mundo"/);
  });

  test("las 5 rutas de ecosistema viven en EXPLORE_LINKS, no en el nivel CORE", () => {
    const src = header();
    for (const href of ["/atlas", "/biblioteca", "/blog", "/journal", "/calendario"]) {
      expect(src).toContain(`href: "${href}"`);
    }
    expect(src).toContain("EXPLORE_LINKS");
  });

  test("el dropdown Explorar es accesible (aria-expanded, aria-haspopup)", () => {
    const src = header();
    expect(src).toContain("aria-expanded={exploreOpen}");
    expect(src).toContain("aria-haspopup");
  });

  test("Escape y click-afuera cierran también el dropdown Explorar", () => {
    const src = header();
    expect(src).toMatch(/handleEscape[\s\S]*setExploreOpen\(false\)/);
    expect(src).toMatch(/handleClickOutside[\s\S]*setExploreOpen\(false\)/);
  });
});

describe("Bóveda — descubrible en desktop", () => {
  test("el label ya no está oculto hasta 2xl", () => {
    const src = read("components/profile/SavedProfilesDrawer.tsx");
    expect(src).not.toContain("hidden 2xl:inline");
  });
});

describe("Footer — coherente con el header, sin duplicar la ruta de Afinidades", () => {
  const footer = () => read("components/layout/UniversityFooter.tsx");

  test("Afinidades apunta a /mundo, igual que en el header", () => {
    const src = footer();
    expect(src).toMatch(/href:\s*"\/mundo",\s*label:\s*"Afinidades"/);
  });

  test("/terminos está enlazado (antes era una ruta huérfana)", () => {
    expect(footer()).toContain('href: "/terminos"');
  });
});

describe("lib/data/navigation.ts — limpieza de código huérfano", () => {
  test("fue eliminado (0 imports en todo el repo, footer real vive en UniversityFooter.tsx)", () => {
    expect(
      fs.existsSync(path.resolve(__dirname, "..", "lib", "data", "navigation.ts"))
    ).toBe(false);
  });
});
