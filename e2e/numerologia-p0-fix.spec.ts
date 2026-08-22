import { test, expect } from "@playwright/test";

// Fase 6A, P0 (2026-08-22): /conocimiento/numerologia/numero-3 era un 404
// funcional — la ruta real es /conocimiento/numerologia/3. Verifica que la
// ruta correcta funcione, que el hub y la navegación prev/next linkeen al
// formato correcto, y que no quede ningún link roto.

test.describe("P0 — /conocimiento/numerologia/[numero]", () => {
  test("/conocimiento/numerologia/3 carga con contenido real (no 404)", async ({ page }) => {
    const response = await page.goto("/conocimiento/numerologia/3");
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator("h1")).toBeVisible();
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toBe("https://www.molino.app/conocimiento/numerologia/3");
  });

  test("el hub de numerología linkea al formato correcto (sin 'numero-')", async ({ page }) => {
    await page.goto("/conocimiento/numerologia");
    const links = page.locator('a[href*="/conocimiento/numerologia/"]');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute("href");
      expect(href).not.toContain("numero-");
    }
  });

  test("navegación prev/next dentro del detalle no linkea al patrón roto", async ({ page }) => {
    await page.goto("/conocimiento/numerologia/5");
    const links = page.locator('a[href*="/conocimiento/numerologia/"]');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute("href");
      expect(href).not.toContain("numero-");
    }
  });

  test("nuevo interlinking: hub enlaza a /guia/numeros-maestros y al blog de año personal", async ({ page }) => {
    await page.goto("/conocimiento/numerologia");
    await expect(page.getByRole("link", { name: /Cómo calcular tu Año Personal/i })).toHaveAttribute(
      "href",
      "/blog/numerologia-ano-personal"
    );
    await expect(page.getByRole("link", { name: "Números Maestros (11, 22, 33)" })).toHaveAttribute(
      "href",
      "/guia/numeros-maestros"
    );
  });
});
