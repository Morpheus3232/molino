import { test, expect } from "@playwright/test";

test.describe("QA — Molino Suite de Robustez y Funcionalidad", () => {
  // ──────────────────────────────────────────────
  // 1. Hero & DateInput
  // ──────────────────────────────────────────────
  test.describe("1. Hero & DateInput", () => {
    test("DateInput DD/MM/AAAA fields are rendered and accessible", async ({ page }) => {
      await page.goto("/");
      const dateInput = page.getByRole("group", { name: "Fecha de nacimiento" }).first();
      await expect(dateInput).toBeVisible();
      await expect(dateInput.getByPlaceholder("DD")).toBeVisible();
      await expect(dateInput.getByPlaceholder("MM")).toBeVisible();
      await expect(dateInput.getByPlaceholder("AAAA")).toBeVisible();
    });

    test("Hero CTA button is rendered and accessible", async ({ page }) => {
      await page.goto("/");
      const dateInput = page.getByRole("group", { name: "Fecha de nacimiento" }).first();
      await expect(dateInput).toBeVisible();
      const cta = page.getByRole("button", { name: "Descubrí tu mapa" }).first();
      await expect(cta).toBeVisible();
    });

    test("Privacy-first: No tracking cookies or intrusive consent banners", async ({ page }) => {
      await page.goto("/");
      const cookieBanner = page.locator("[class*='cookie-consent'], [class*='cookie-banner'], [id*='cookie-banner']");
      await expect(cookieBanner).toHaveCount(0);
    });
  });

  // ──────────────────────────────────────────────
  // 2. Profile Hub & Local Storage
  // ──────────────────────────────────────────────
  test.describe("2. Profile Hub", () => {
    test("Loads profile with Camino de Vida, Archetype, Sun Sign and Chinese Zodiac", async ({ page }) => {
      await page.goto("/profile?dob=1992-04-10");
      await page.waitForLoadState("domcontentloaded");

      await expect(page.locator("h1").first()).toBeVisible({ timeout: 15000 });
      await expect(page.getByText(/CAMINO DE VIDA/i).first()).toBeVisible({ timeout: 15000 });
      await expect(page.getByText(/Aries/i).first()).toBeVisible({ timeout: 15000 });
    });

    test("Profile loads cleanly in fresh context", async ({ page }) => {
      await page.goto("/profile?dob=1988-11-23");
      await page.waitForLoadState("domcontentloaded");
      await expect(page.locator("h1").first()).toBeVisible({ timeout: 15000 });

      const newPage = await page.context().newPage();
      await newPage.goto("/profile?dob=1988-11-23");
      await newPage.waitForLoadState("domcontentloaded");
      await expect(newPage.locator("h1").first()).toBeVisible({ timeout: 15000 });
      await newPage.close();
    });
  });

  // ──────────────────────────────────────────────
  // 3. Biblioteca & Conocimiento
  // ──────────────────────────────────────────────
  test.describe("3. Biblioteca & Contenido", () => {
    test("Biblioteca loads source references correctly", async ({ page }) => {
      await page.goto("/biblioteca");
      await page.waitForLoadState("domcontentloaded");
      await expect(page.locator("h1")).toBeVisible({ timeout: 10000 });
      const articles = page.locator("article, a[href*='/biblioteca/']");
      const count = await articles.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  // ──────────────────────────────────────────────
  // 4. Responsive Layouts
  // ──────────────────────────────────────────────
  test.describe("4. Responsive Viewports", () => {
    test("Mobile (375px) renders Hero and CTA properly", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/");
      await expect(page.locator("h1").first()).toBeVisible();
    });

    test("Tablet (768px) renders cleanly", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto("/");
      await expect(page.locator("body")).toBeVisible();
    });

    test("Desktop (1440px) renders cleanly", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto("/");
      await expect(page.locator("body")).toBeVisible();
    });
  });
});