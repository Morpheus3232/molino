import { describe, test, expect } from "vitest";
import fs from "fs";
import path from "path";

function read(relPath: string): string {
  return fs.readFileSync(path.resolve(__dirname, "..", relPath), "utf8");
}

// El header tiene tres zonas fijas: logo | destinos | acción del estado.
// Sin mapa los destinos son Atlas/Hoy y la acción es "Crear mi mapa"; con
// mapa son Mi Mapa/Afinidades/Tiempo/Journal y las acciones son
// Lectura/Guardar. "Explorar" salió del header desktop (vive en el footer)
// y solo queda en el menú móvil. Mismas rutas reales de siempre.

describe("Header — navegación sin perfil", () => {
  const header = () => read("components/layout/UniversityHeader.tsx");

  test("los destinos sin perfil son solo Atlas y Hoy", () => {
    const src = header();
    expect(src).toMatch(/NO_PROFILE_LINKS[\s\S]*?\];/);
    const block = src.match(/NO_PROFILE_LINKS[\s\S]*?\];/)![0];
    expect(block).toContain('href: "/atlas"');
    expect(block).toContain('href: "/hoy"');
    // Calendario y Journal se movieron al footer para no ofrecerle a un
    // usuario nuevo herramientas que necesitan un mapa que todavía no tiene.
    expect(block).not.toContain('href: "/calendario"');
    expect(block).not.toContain('href: "/journal"');
  });

  test("la acción sin perfil es crear el mapa, no abrir una bóveda vacía", () => {
    const src = header();
    expect(src).toContain("Crear mi mapa");
    expect(src).toMatch(/!hasProfile \? \([\s\S]{0,400}href="\/onboarding"/);
  });

  test("el label de la bóveda no compite con 'Mi Mapa'", () => {
    const src = header();
    expect(src).toMatch(/vaultLabel\s*=\s*vaultCount > 0 \? "Guardados" : "Guardar"/);
    expect(src).not.toContain('"Mis Mapas"');
  });

  test("Explorar sigue existiendo para el menú móvil, con las rutas reales", () => {
    const src = header();
    expect(src).toContain("EXPLORE_GROUPS_NO_PROFILE");
    for (const href of ["/socios", "/pareja", "/academy", "/biblioteca", "/blog"]) {
      expect(src).toContain(`href: "${href}"`);
    }
  });
});

describe("Header — navegación con perfil", () => {
  const header = () => read("components/layout/UniversityHeader.tsx");

  test("solo el ancla conserva el prefijo 'Mi' — el resto escanea por su propia palabra", () => {
    const src = header();
    expect(src).toContain('label: "Mi Mapa"');
    expect(src).toContain('label="Afinidades"');
    expect(src).toContain('label="Tiempo"');
    expect(src).toContain('label: "Journal"');
    expect(src).not.toContain('label="Mis Afinidades"');
    expect(src).not.toContain('label="Mi Tiempo"');
    expect(src).not.toContain('label: "Mi Journal"');
  });

  test("Afinidades usa las 7 categorías reales de /affinity/[type]", () => {
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

  test("Tiempo usa Hoy/Semana/Mes/Año sobre rutas reales existentes", () => {
    const src = header();
    expect(src).toContain("TIME_GROUPS");
    expect(src).toMatch(/href:\s*"\/hoy",\s*label:\s*"Hoy"/);
    expect(src).toMatch(/href:\s*"\/semana",\s*label:\s*"Semana"/);
    expect(src).toMatch(/href:\s*"\/calendario",\s*label:\s*"Mes"/);
    expect(src).toMatch(/href:\s*"\/evolution",\s*label:\s*"Año"/);
  });

  test("Explorar (con perfil, solo móvil) agrupa Aprender (incluye Atlas) y Modos", () => {
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

describe("Footer — único hogar en desktop de lo que salió del header", () => {
  const footer = () => read("components/layout/UniversityFooter.tsx");

  test("Afinidades sigue apuntando a /mundo", () => {
    expect(footer()).toMatch(/href:\s*"\/mundo",\s*label:\s*"Afinidades"/);
  });

  test("cubre todo el ex-dropdown Explorar, incluida Academia", () => {
    const src = footer();
    for (const href of ["/atlas", "/academy", "/biblioteca", "/blog", "/journal", "/calendario"]) {
      expect(src).toContain(`href: "${href}"`);
    }
  });
});

describe("lib/data/navigation.ts — limpieza de código huérfano", () => {
  test("fue eliminado (0 imports en todo el repo, footer real vive en UniversityFooter.tsx)", () => {
    expect(
      fs.existsSync(path.resolve(__dirname, "..", "lib", "data", "navigation.ts"))
    ).toBe(false);
  });
});
