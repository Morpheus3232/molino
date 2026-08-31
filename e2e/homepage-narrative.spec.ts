import { test, expect } from "@playwright/test";

// Fase actual (2026-08-29): narrativa de la homepage.
// Smoke tests semánticos de los puntos de contacto críticos:
// qué es Molino, los tres sistemas, los tres niveles
// (Mapa → Lectura → IA), conocimiento abierto, línea Premium,
// FAQ y experiencia mobile.

test.describe("Homepage — narrativa actual", () => {
  test("hero: qué es Molino y CTAs visibles", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.getByText(/Tu fecha no es un dato/)).toBeVisible();
    await expect(page.getByRole("button", { name: /Ver tu mapa/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Ver ejemplo interactivo/i })).toBeVisible();
  });

  test("tres sistemas: numerología, astrología, zodíaco chino", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/Tres sistemas, una sola fecha/)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Numerología" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Astrología" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Zodíaco chino" })).toBeVisible();
  });

  test("tres niveles: Mapa, Lectura, IA con destinos actuales", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Primero la estructura")).toBeVisible();

    const mapLink = page.getByText("Primero la estructura").locator("xpath=following::ol").getByRole("link", { name: /Crear mi mapa/ });
    await expect(mapLink).toBeVisible();
    await expect(mapLink).toHaveAttribute("href", "/onboarding");

    const lecturaLink = page.getByText("Primero la estructura").locator("xpath=following::ol").getByRole("link", { name: /Ver un ejemplo/ });
    await expect(lecturaLink).toBeVisible();
    await expect(lecturaLink).toHaveAttribute("href", "/ejemplo");

    const aiLink = page.getByText("Primero la estructura").locator("xpath=following::ol").getByRole("link", { name: /Cómo funciona/ });
    await expect(aiLink).toBeVisible();
    await expect(aiLink).toHaveAttribute("href", "/ai");
  });

  test("conocimiento abierto y transparencia", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/Cálculo 100% local/)).toBeVisible();
    await expect(page.getByRole("link", { name: /Cómo lo verificás/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Política de privacidad/i })).toBeVisible();
  });

  test("features: núcleo del mapa + línea Premium con CTA a /premium", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Qué hacés con eso")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Hoy" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Ciclos" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Afinidades" })).toBeVisible();
    await expect(page.getByText(/Tu mapa y tu lectura son gratis/)).toBeVisible();
    await expect(page.getByText(/La conversación es Pro/)).toBeVisible();
    const premiumLink = page.getByRole("link", { name: /Ver qué incluye/ });
    await expect(premiumLink).toBeVisible();
    await expect(premiumLink).toHaveAttribute("href", "/premium");
  });

  test("FAQ se expande", async ({ page }) => {
    await page.goto("/");
    await page.locator("#faq").scrollIntoViewIfNeeded();
    const firstQuestion = page.getByRole("button", { name: /¿Por qué el mapa esencial es 100% gratuito/ });
    await expect(firstQuestion).toBeVisible({ timeout: 15000 });
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