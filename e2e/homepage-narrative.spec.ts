import { test, expect } from "@playwright/test";

// Fase 3 (2026-08-22): rediseño de narrativa de la homepage — smoke tests
// de los puntos de contacto críticos: CTA principal, CTA "ver ejemplo",
// /ejemplo, FAQ y el nuevo teaser de Premium.

test.describe("Homepage — narrativa Fase 3", () => {
  test("hero: H1, CTA principal y CTA 'ver ejemplo' visibles", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.getByRole("button", { name: /ver tu mapa/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /ver ejemplo interactivo/i })).toBeVisible();
  });

  test("sección de diferencial (ProofSection) linkea a /ejemplo", async ({ page }) => {
    await page.goto("/");
    const link = page.getByRole("link", { name: /ver el mapa completo/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/ejemplo");
  });

  test("/ejemplo carga con contenido real de María, sin depender del hero", async ({ page }) => {
    await page.goto("/ejemplo");
    await expect(page.locator("h1")).toHaveText("María");
    await expect(page.getByRole("link", { name: /generá tu mapa/i })).toBeVisible();
  });

  test("PremiumTeaser: transformación Gratis/Premium y CTA a /premium", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Ver tu mapa es gratis.")).toBeVisible();
    await expect(page.getByText("Entenderlo es Premium.")).toBeVisible();
    const link = page.getByRole("link", { name: /ver detalle premium/i });
    await expect(link).toHaveAttribute("href", "/premium");
  });

  test("FAQ se expande", async ({ page }) => {
    await page.goto("/");
    await page.locator("#faq").scrollIntoViewIfNeeded();
    const firstQuestion = page.getByRole("button", { name: /100% gratuito/i });
    await expect(firstQuestion).toBeVisible();
    const initiallyExpanded = await firstQuestion.getAttribute("aria-expanded");
    await firstQuestion.click();
    await expect(firstQuestion).not.toHaveAttribute("aria-expanded", initiallyExpanded ?? "");
  });

  test("mobile: hero y CTA visibles sin overflow horizontal", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page.locator("h1").first()).toBeVisible();
    const bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(391);
  });
});
