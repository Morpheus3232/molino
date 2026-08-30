import { describe, test, expect } from "vitest";
import fs from "fs";
import path from "path";

function read(relPath: string): string {
  return fs.readFileSync(path.resolve(__dirname, "..", relPath), "utf8");
}

// Fase 3 — el header se reorganizó en 4 puertas conceptuales:
// Conocimiento | Explorar (Atlas/Afinidades) | Tiempo | Proyecto, más Modos,
// y las acciones del estado (Mi Mapa / Mi Lectura / Preguntá / Crear /
// Guardar). Los tres sistemas (`/conocimiento/*`) son la arquitectura
// intelectual dominante y encabezan el dropdown de Conocimiento.

describe("Header — navegación sin perfil", () => {
  const header = () => read("components/layout/UniversityHeader.tsx");

  test("los destinos sin perfil son Conocimiento, Atlas, Tiempo, Modos y Proyecto", () => {
    const src = header();
    expect(src).toContain('atlas: { href: "/atlas"');
    expect(src).toContain('journal: { href: "/journal"');
    expect(src).toContain('label="Conocimiento"');
    expect(src).toContain('label="Tiempo"');
    expect(src).toContain('label="Proyecto"');
  });

  test("Tiempo sin perfil ofrece solo lo que funciona sin mapa", () => {
    const src = header();
    const block = src.match(/TIME_GROUPS_NO_PROFILE[\s\S]*?\n\];/)![0];
    expect(block).toContain('href: "/hoy"');
    expect(block).toContain('href: "/calendario"');
    // /semana y /evolution son muros duros sin perfil ("Creá tu mapa
    // primero", cero contenido) — mandar ahí a alguien sin mapa es el
    // dead-end que este header elimina.
    expect(block).not.toContain('href: "/semana"');
    expect(block).not.toContain('href: "/evolution"');
  });

  test("Conocimiento encabeza con los 3 sistemas y suma Blog/Biblioteca/Academia", () => {
    const src = header();
    expect(src).toContain("KNOWLEDGE_GROUPS_NO_PROFILE");
    for (const href of [
      "/conocimiento/numerologia",
      "/conocimiento/astrologia",
      "/conocimiento/zodiaco-chino",
      "/blog",
      "/biblioteca",
      "/academy",
    ]) {
      expect(src).toContain(`href: "${href}"`);
    }
  });

  test("Proyecto sube la identidad open-source al header (no solo al footer)", () => {
    const src = header();
    expect(src).toContain("PROJECT_GROUPS");
    for (const href of ["/filosofia", "/transparencia", "/metodos-y-fuentes", "/changelog"]) {
      expect(src).toContain(`href: "${href}"`);
    }
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

  test("Modos es un grupo propio del centro, no enterrado en Explorar", () => {
    const src = header();
    expect(src).toContain('label="Modos"');
    expect(src).toContain("MODES_GROUPS");
    for (const href of ["/socios", "/pareja"]) {
      expect(src).toContain(`href: "${href}"`);
    }
  });
});

describe("Header — navegación con perfil", () => {
  const header = () => read("components/layout/UniversityHeader.tsx");

  test("las acciones del estado con perfil son Mi Mapa / Mi Lectura / Preguntá", () => {
    const src = header();
    expect(src).toMatch(/href="\/profile"[\s\S]{0,300}Mi Mapa/);
    expect(src).toMatch(/href=\{lecturaHref\}[\s\S]{0,300}Mi Lectura/);
    expect(src).toMatch(/href="\/ai"[\s\S]{0,300}Preguntá/);
    expect(src).toContain('label="Afinidades"');
    expect(src).toContain('label="Tiempo"');
    expect(src).toContain('label: "Journal"');
  });

  test("Conocimiento NO desaparece del centro cuando hay perfil", () => {
    const src = header();
    expect(src).toContain("KNOWLEDGE_GROUPS_WITH_PROFILE");
    // con perfil, Atlas entra al dropdown de Conocimiento
    const block = src.match(/KNOWLEDGE_LINKS_WITH_PROFILE[\s\S]*?\n\];/)![0];
    expect(block).toContain('href: "/atlas"');
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

  test("Modos también es grupo propio del centro con perfil, no solo sin perfil", () => {
    const src = header();
    expect(src).toContain('label="Modos"');
    expect(src).toContain("MODES_GROUPS");
  });

  test("Modos (Socios/Parejas/Regalar) es su propio grupo, separado de Conocimiento", () => {
    const src = header();
    const block = src.match(/MODES_LINKS[\s\S]*?\n\];/)![0];
    expect(block).toContain('href: "/socios"');
    expect(block).toContain('href: "/pareja"');
    expect(block).toContain('href: "/regalar"');
    expect(block).not.toContain("/conocimiento");
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

describe("Footer — 4 columnas alineadas a las 4 puertas conceptuales (Fase 3)", () => {
  const footer = () => read("components/layout/UniversityFooter.tsx");

  test('"Afinidades" apunta al hub real /affinity, no a la vista de compartir /mundo', () => {
    const src = footer();
    expect(src).toMatch(/href:\s*"\/affinity",\s*label:\s*"Afinidades"/);
    expect(src).not.toMatch(/href:\s*"\/mundo"/);
  });

  test("la columna de conocimiento encabeza con los 3 sistemas y cubre el resto del contenido público", () => {
    const src = footer();
    for (const href of [
      "/conocimiento/numerologia",
      "/conocimiento/astrologia",
      "/conocimiento/zodiaco-chino",
      "/blog",
      "/biblioteca",
      "/academy",
      "/atlas",
      "/calendario",
    ]) {
      expect(src).toContain(`href: "${href}"`);
    }
  });

  test("la columna Proyecto expone la identidad open-source", () => {
    const src = footer();
    for (const href of ["/filosofia", "/transparencia", "/metodos-y-fuentes", "/changelog", "/docs", "/nosotros"]) {
      expect(src).toContain(`href: "${href}"`);
    }
  });

  test("Mi Molino agrupa el producto personal, IA incluida", () => {
    const src = footer();
    for (const href of ["/profile", "/lectura", "/ai", "/pareja", "/premium", "/onboarding"]) {
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
