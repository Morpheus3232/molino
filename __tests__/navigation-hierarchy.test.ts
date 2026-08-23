import { describe, test, expect } from "vitest";
import fs from "fs";
import path from "path";

function read(relPath: string): string {
  return fs.readFileSync(path.resolve(__dirname, "..", relPath), "utf8");
}

// Fase 5 (2026-08-23): el header pasa de una jerarquía fija (CORE + Explorar
// para todos) a una jerarquía CONTEXTUAL — sin perfil el sitio ofrece
// exploración general (Atlas/Hoy/Calendario/Journal/Explorar/Guardar mi
// mapa); con perfil, el nav habla en primera persona sobre el contenido del
// usuario (Mi Mapa/Mis Afinidades/Mi Tiempo/Mi Journal/Mis Mapas/Explorar).
// Mismas rutas reales de siempre.

describe("Header — navegación sin perfil", () => {
  const header = () => read("components/layout/UniversityHeader.tsx");

  test("las 4 rutas CORE sin perfil están presentes", () => {
    const src = header();
    for (const href of ["/atlas", "/hoy", "/calendario", "/journal"]) {
      expect(src).toContain(`href: "${href}"`);
    }
  });

  test("Guardar mi mapa reemplaza a Bóveda como label del trigger", () => {
    expect(header()).toContain('"Guardar mi mapa"');
  });

  test("Explorar (sin perfil) agrupa Modos y Aprender con las rutas reales", () => {
    const src = header();
    expect(src).toContain("EXPLORE_GROUPS_NO_PROFILE");
    for (const href of ["/socios", "/pareja", "/academy", "/biblioteca", "/blog"]) {
      expect(src).toContain(`href: "${href}"`);
    }
  });
});

describe("Header — navegación con perfil", () => {
  const header = () => read("components/layout/UniversityHeader.tsx");

  test("los 5 ítems personales están presentes", () => {
    const src = header();
    expect(src).toContain("Mi Mapa");
    expect(src).toContain("Mis Afinidades");
    expect(src).toContain("Mi Tiempo");
    expect(src).toContain("Mi Journal");
    expect(src).toContain('"Mis Mapas"');
  });

  test("Mis Afinidades usa las 7 categorías reales de /affinity/[type]", () => {
    const src = header();
    for (const href of [
      "/affinity/country",
      "/affinity/city",
      "/affinity/brand",
      "/affinity/university",
      "/affinity/artist",
      "/affinity/movie",
      "/affinity/team",
    ]) {
      expect(src).toContain(`href: "${href}"`);
    }
  });

  test("Mi Tiempo usa Hoy/Semana/Mes/Año sobre rutas reales existentes", () => {
    const src = header();
    expect(src).toContain("TIME_GROUPS");
    expect(src).toMatch(/href:\s*"\/hoy",\s*label:\s*"Hoy"/);
    expect(src).toMatch(/href:\s*"\/semana",\s*label:\s*"Semana"/);
    expect(src).toMatch(/href:\s*"\/calendario",\s*label:\s*"Mes"/);
    expect(src).toMatch(/href:\s*"\/evolution",\s*label:\s*"Año"/);
  });

  test("Explorar (con perfil) agrupa Aprender (incluye Atlas) y Modos", () => {
    const src = header();
    expect(src).toContain("EXPLORE_GROUPS_WITH_PROFILE");
    expect(src).toContain("LEARN_LINKS_WITH_PROFILE");
  });

  test("no aparece 'Afinidades'/'Bóveda' como primer nivel plano fuera de sus dropdowns", () => {
    const src = header();
    expect(src).not.toMatch(/href:\s*"\/mundo"/);
    expect(src).not.toContain("Bóveda");
  });
});

describe("Header — accesibilidad y estado de perfil", () => {
  const header = () => read("components/layout/UniversityHeader.tsx");

  test("los dropdowns son accesibles (aria-expanded, aria-haspopup)", () => {
    const src = header();
    expect(src).toContain("aria-expanded={isOpen}");
    expect(src).toContain('aria-haspopup="true"');
  });

  test("Escape y click-afuera cierran cualquier dropdown abierto", () => {
    const src = header();
    expect(src).toMatch(/handleEscape[\s\S]*setOpenMenu\(null\)/);
    expect(src).toMatch(/handleClickOutside[\s\S]*setOpenMenu\(null\)/);
  });

  test("el estado de perfil se resuelve con hasStoredProfile(), sin suppressHydrationWarning", () => {
    const src = header();
    expect(src).toContain("hasStoredProfile()");
    expect(src).not.toContain("suppressHydrationWarning");
  });

  test("reacciona a crear, cargar y eliminar perfil vía los eventos existentes", () => {
    const src = header();
    expect(src).toContain("molino-profile-created");
    expect(src).toContain("molino-profile-cleared");
  });
});

describe("lib/session/localStorage.ts — único choke point de escritura del perfil", () => {
  const store = () => read("lib/session/localStorage.ts");

  test("saveProfileToStorage dispara molino-profile-created (crear/cargar/cambiar de perfil)", () => {
    expect(store()).toMatch(/setItem\(STORAGE_KEY[\s\S]*molino-profile-created/);
  });

  test("clearStoredProfile dispara molino-profile-cleared", () => {
    expect(store()).toMatch(/removeItem\(STORAGE_KEY\)[\s\S]*molino-profile-cleared/);
  });
});

describe("Footer — fuera de scope de esta fase, se deja intacto", () => {
  test("Afinidades sigue apuntando a /mundo (footer no forma parte del header)", () => {
    const src = read("components/layout/UniversityFooter.tsx");
    expect(src).toMatch(/href:\s*"\/mundo",\s*label:\s*"Afinidades"/);
  });
});

describe("lib/data/navigation.ts — limpieza de código huérfano", () => {
  test("fue eliminado (0 imports en todo el repo, footer real vive en UniversityFooter.tsx)", () => {
    expect(
      fs.existsSync(path.resolve(__dirname, "..", "lib", "data", "navigation.ts"))
    ).toBe(false);
  });
});
