import { test, expect } from "@playwright/test";

// Smoke tests de la Fase 2 (SEO técnico + seguridad, 2026-08-22):
// - /hoy debía tener H1 y contenido real sin depender de hydration.
// - /api/deepseek-test era un endpoint de debug sin auth, proxy libre a un
//   LLM pago — se eliminó por completo.
// - /herramientas/* y /explore debían tener canonical propio (ya lo tenían
//   vía layout.tsx — este test lo deja protegido contra regresión).

test.describe("SEO técnico — Fase 2", () => {
  test("/hoy tiene H1 visible sin esperar hydration", async ({ page }) => {
    await page.goto("/hoy");
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("h1").first()).toHaveText("Tu energía de hoy");
  });

  test("homepage carga sin errores de consola", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    await expect(page.locator("h1").first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("/herramientas/camino-de-vida tiene canonical propio (no la home)", async ({ page }) => {
    await page.goto("/herramientas/camino-de-vida");
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toBe("https://www.molino.app/herramientas/camino-de-vida");
  });

  test("/explore tiene canonical propio (no la home)", async ({ page }) => {
    await page.goto("/explore");
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toBe("https://www.molino.app/explore");
  });

  test("/api/deepseek-test ya no existe (404)", async ({ page }) => {
    const response = await page.goto("/api/deepseek-test");
    expect(response?.status()).toBe(404);
  });
});
