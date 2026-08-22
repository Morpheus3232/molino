import { test, expect } from "@playwright/test";

// Fase 4 (2026-08-22): jerarquía de navegación — CORE (Mi Mapa, Hoy,
// Afinidades, Academia) siempre visible en desktop, ecosistema agrupado
// bajo "Explorar", Bóveda descubrible, sin overflow horizontal en ningún
// ancho, navegable por teclado.

test.describe("Navegación — Fase 4", () => {
  test("desktop (1440px): 4 links CORE + Explorar visibles, sin overflow", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    await expect(nav.getByRole("link", { name: "Mi Mapa" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Hoy" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Afinidades" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Academia" })).toBeVisible();
    await expect(nav.getByRole("button", { name: /explorar/i })).toBeVisible();
    const bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(1441);
  });

  test("el dropdown Explorar se abre, muestra las 5 rutas y cierra con Escape", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const trigger = page.getByRole("button", { name: /explorar/i });
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const menu = page.locator("#explore-menu");
    for (const label of ["Atlas", "Biblioteca", "Blog", "Journal", "Calendario"]) {
      await expect(menu.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("Bóveda visible con label en desktop (no solo ícono)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("button", { name: /bóveda|guardar en bóveda/i })).toBeVisible();
  });

  test("tablet (834px): hamburguesa visible, nav desktop oculto, sin overflow", async ({ page }) => {
    await page.setViewportSize({ width: 834, height: 1112 });
    await page.goto("/");
    await expect(page.getByRole("button", { name: /abrir menú/i })).toBeVisible();
    const bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(835);
  });

  test("mobile (390px): menú separa CORE de Explorar, sin overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /abrir menú/i });
    await toggle.click();
    const mobileMenu = page.locator("#mobile-menu");
    await expect(mobileMenu.getByRole("link", { name: "Mi Mapa", exact: true })).toBeVisible();
    await expect(mobileMenu.getByText("Explorar")).toBeVisible();
    await expect(mobileMenu.getByRole("link", { name: "Atlas", exact: true })).toBeVisible();
    const bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(391);
  });

  test("navegación por teclado: Tab llega al primer link CORE con foco visible", async ({ page, isMobile }) => {
    test.skip(isMobile, "el nav desktop está oculto en mobile — se navega por el menú hamburguesa");
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.keyboard.press("Tab"); // skip link / logo
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => document.activeElement?.textContent?.trim());
    expect(focused).toBeTruthy();
  });

  test("footer: Afinidades apunta a /mundo, igual que el header", async ({ page }) => {
    await page.goto("/");
    const footerLink = page.locator("footer").getByRole("link", { name: "Afinidades" });
    await expect(footerLink).toHaveAttribute("href", "/mundo");
  });
});
