import { test, expect } from "@playwright/test";

// Fase 6A (2026-08-22): /hoy reordenado (badge → Consejo del Momento →
// momento/ciclo → próxima acción) y Consejo del Momento ahora deriva de
// buildOrientation() con evidencia trazable, en vez de una plantilla ad-hoc.

test.describe("/hoy — jerarquía Fase 6A", () => {
  test("desktop: Consejo del Momento aparece antes que Favorece hoy, sin overflow", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/hoy");
    await expect(page.getByText("Consejo del Momento")).toBeVisible();
    await expect(page.getByText("Favorece hoy")).toBeVisible();

    const consejoY = await page.getByText("Consejo del Momento").boundingBox();
    const favoreceY = await page.getByText("Favorece hoy").boundingBox();
    expect(consejoY!.y).toBeLessThan(favoreceY!.y);

    const bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(1441);
  });

  test("mobile: contenido visible, sin overflow horizontal", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/hoy");
    await expect(page.getByText("Consejo del Momento")).toBeVisible();
    const bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(391);
  });

  test("link a /timing presente y funcional", async ({ page }) => {
    await page.goto("/hoy");
    const link = page.getByRole("link", { name: /Días favorables según tu ciclo/i });
    await expect(link).toHaveAttribute("href", "/timing");
  });

  test("evidencia trazable (Luna/Año personal) visible junto al Consejo", async ({ page }) => {
    await page.goto("/hoy");
    await expect(page.getByText(/^Luna:/)).toBeVisible();
  });
});
