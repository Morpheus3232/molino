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

  it("includes all 144 programmatic sinastria routes in sitemap", () => {
    const entries = sitemap();
    const sinastriaEntries = entries.filter((e) => e.url.includes("/sinastria/"));
    expect(sinastriaEntries.length).toBe(144);
  });

  it("formats titles consistently with formatTitle", () => {
    expect(formatTitle("")).toBe("Molino — Mapa Personal de Autoconocimiento");
    expect(formatTitle("Filosofía")).toBe("Filosofía | Molino");
    expect(formatTitle("Contacto | Molino")).toBe("Contacto | Molino");
    expect(formatTitle("Tu Mapa — Molino")).toBe("Tu Mapa — Molino");
  });

  it("generates complete and valid route metadata via createRouteMetadata", () => {
    const meta = createRouteMetadata({
      title: "Filosofía",
      description: "Nuestra visión del autoconocimiento.",
      path: "/filosofia",
    });

    expect(meta.title).toBe("Filosofía | Molino");
    expect(meta.description).toBe("Nuestra visión del autoconocimiento.");
    expect(meta.alternates?.canonical).toBe(`${SITE_URL}/filosofia`);
    expect(meta.robots).toEqual({ index: true, follow: true });
    expect(meta.openGraph?.title).toBe("Filosofía | Molino");
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
