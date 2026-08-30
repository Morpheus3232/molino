import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import { SITE_URL, siteUrl, formatTitle, createRouteMetadata } from "@/lib/seo";

describe("Technical SEO & Canonical URLs", () => {
  it("generates a sitemap where all URLs have valid canonical format", () => {
    const entries = sitemap();
    expect(entries.length).toBeGreaterThan(50);

    for (const entry of entries) {
      // Must be full absolute URL starting with SITE_URL
      expect(entry.url.startsWith(SITE_URL)).toBe(true);
      // Must not contain double slashes in path
      const urlObj = new URL(entry.url);
      expect(urlObj.pathname).not.toMatch(/\/{2,}/);
      // Must not point to non-existent /en or /pt paths
      expect(urlObj.pathname.startsWith("/en")).toBe(false);
      expect(urlObj.pathname.startsWith("/pt")).toBe(false);
      // Priority must be within 0.0 - 1.0
      if (entry.priority !== undefined) {
        expect(entry.priority).toBeGreaterThanOrEqual(0);
        expect(entry.priority).toBeLessThanOrEqual(1);
      }
    }
  });

  it("incluye las 144 rutas signo×signo en /compatibilidad (canónica) y NINGUNA en /sinastria", () => {
    // Fase 3 — `/sinastria/a/b` y `/compatibilidad/a-b` cubrían el mismo
    // intent. `/compatibilidad/[pair]` queda canónica; `/sinastria/*` salió
    // del sitemap (canonical + noindex apuntando a compatibilidad).
    const entries = sitemap();
    expect(entries.filter((e) => e.url.includes("/sinastria/")).length).toBe(0);
    expect(entries.filter((e) => /\/compatibilidad\/[a-z]+-[a-z]+$/.test(e.url)).length).toBe(144);
  });

  it("no anuncia la familia consolidada /compatibility/* (301 → /affinity/*)", () => {
    const entries = sitemap();
    expect(entries.filter((e) => e.url.includes("/compatibility/")).length).toBe(0);
  });

  it("formats titles consistently with formatTitle", () => {
    // La marca no aparece en la superficie visible de los títulos
    // (decisión de producto): formatTitle devuelve el título tal cual.
    expect(formatTitle("")).toBe("Mapa Personal de Autoconocimiento");
    expect(formatTitle("Filosofía")).toBe("Filosofía");
  });

  it("generates complete and valid route metadata via createRouteMetadata", () => {
    const meta = createRouteMetadata({
      title: "Filosofía",
      description: "Nuestra visión del autoconocimiento.",
      path: "/filosofia",
    });

    // { absolute } — no un string plano — para que el title.template de un
    // layout ancestro no envuelva el título y duplique sufijos de marca.
    expect(meta.title).toEqual({ absolute: "Filosofía" });
    expect(meta.description).toBe("Nuestra visión del autoconocimiento.");
    expect(meta.alternates?.canonical).toBe(`${SITE_URL}/filosofia`);
    expect(meta.robots).toEqual({ index: true, follow: true });
    expect(meta.openGraph?.title).toBe("Filosofía");
    expect(meta.openGraph?.url).toBe(`${SITE_URL}/filosofia`);
    expect(meta.openGraph?.locale).toBe("es_419");
  });

  it("handles noindex routes correctly in createRouteMetadata", () => {
    const meta = createRouteMetadata({
      title: "Perfil Privado",
      path: "/profile?dob=1990-01-01",
      noIndex: true,
    });

    expect(meta.robots).toEqual({ index: false, follow: true });
    expect(meta.alternates?.canonical).toBeUndefined();
  });
});
