import { test, expect } from "@playwright/test";

// Fase 3 (2026-08-22): rediseño de narrativa de la homepage — smoke tests
// de los puntos de contacto críticos: CTA principal, CTA "ver ejemplo",
// /ejemplo, FAQ y la línea de Premium en FeaturesSection.

test.describe("Homepage — narrativa Fase 3", () => {
  test("hero: H1, CTA principal y CTA 'ver ejemplo' visibles", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.getByRole("button", { name: /ver tu mapa/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /ver ejemplo interactivo/i })).toBeVisible();
  });

  test("tres niveles: La Lectura linkea a /ejemplo", async ({ page }) => {
    await page.goto("/");
    const link = page.getByRole("link", { name: "Ver un ejemplo" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/ejemplo");
  });

  test("Preguntale linkea a /ai", async ({ page }) => {
    await page.goto("/");
    const link = page.getByRole("link", { name: /cómo funciona/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/ai");
  });

  test("/ejemplo reusa ProfileHub — badge Perfil de ejemplo y botón Generá tu propio mapa", async ({ page }) => {
    await page.goto("/ejemplo");
    await expect(page.getByText("Perfil de ejemplo")).toBeVisible();
    await expect(page.getByRole("link", { name: /generá tu propio mapa/i })).toBeVisible();
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("FeaturesSection: línea Premium y CTA a /premium", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/tu mapa y tu lectura son gratis/i)).toBeVisible();
    const link = page.getByRole("link", { name: /ver qué incluye/i });
    await expect(link).toBeVisible();
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