import { test, expect } from "@playwright/test";

// Portada actual (2026-10): el almanaque del día arriba y el formulario de
// fecha abajo. Smoke tests de lo que la persona ve y puede tocar.

test.describe("Homepage — narrativa actual", () => {
  test("hero: qué es Molino y CTAs visibles", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.getByText(/Tu fecha no es un dato/)).toBeVisible();
    await expect(page.getByRole("button", { name: /Ver tu mapa/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Ver ejemplo interactivo/i })).toBeVisible();
  });

  test("almanaque del día: número del día, la cuenta y el calendario", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/Almanaque de Molino/)).toBeVisible();
    await expect(page.getByRole("heading", { name: "El número del día" })).toBeVisible();
    await expect(page.getByText(/La cuenta:/)).toBeVisible();
    await expect(page.getByRole("link", { name: "Ver el calendario del mes" })).toHaveAttribute("href", "/calendario");
    await expect(page.getByRole("heading", { name: "Los próximos días" })).toBeVisible();
  });

  test("tres sistemas, una fecha: el formulario habilita el mapa", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Tres sistemas, una fecha")).toBeVisible();
    const cta = page.getByRole("button", { name: /Ver tu mapa/i });
    await expect(cta).toBeDisabled();
    await page.getByRole("textbox", { name: "Día" }).fill("14");
    await page.getByRole("textbox", { name: "Mes" }).fill("06");
    await page.getByRole("textbox", { name: "Año" }).fill("1990");
    await expect(cta).toBeEnabled();
  });

  test("transparencia y accesos secundarios", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/Cálculo 100% local/)).toBeVisible();
    await expect(page.getByRole("link", { name: /Ver ejemplo interactivo/i })).toHaveAttribute("href", "/ejemplo");
    await expect(page.getByRole("link", { name: "Canjealo acá" })).toHaveAttribute("href", "/canjear");
  });

  test("diario: el consejo del día viaja como disparador", async ({ page }) => {
    await page.goto("/");
    const link = page.getByRole("link", { name: "Escribilo en tu diario" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", /^\/journal\?prompt=/);
  });

  test("mobile: hero y CTA visibles sin overflow horizontal", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page.locator("h1").first()).toBeVisible();
    const bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(391);
  });
});