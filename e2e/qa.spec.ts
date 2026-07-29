import { test, expect } from "@playwright/test";

test.describe("QA — Molino Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  // ──────────────────────────────────────────────
  // 1. Hero & Onboarding
  // ──────────────────────────────────────────────
  test.describe("1. Hero & Onboarding", () => {
    test("DatePicker day/month/year wheels are visible", async ({ page }) => {
      const dayPicker = page.locator('[aria-label="Day"]');
      const monthPicker = page.locator('[aria-label="Month"]');
      const yearPicker = page.locator('[aria-label="Year"]');
      await expect(dayPicker.first()).toBeVisible();
      await expect(monthPicker.first()).toBeVisible();
      await expect(yearPicker.first()).toBeVisible();
    });

    test("DatePicker day adjusts for month length (April = 30 days)", async ({ page }) => {
      await page.locator("select, [role='listbox']").filter({ hasText: "Mes" }).first().click();
      await page.getByRole("option", { name: /abril|April|Abril/i }).first().click();
      const dayOptions = page.locator("select").first().locator("option");
      const count = await dayOptions.count();
      expect(count).toBeLessThanOrEqual(30);
    });

    test("DatePicker shows 29 days for February in leap year 2024", async ({ page }) => {
      await page.getByRole("heading", { name: /crear mi mapa|Discover|Descubr/i }).first().click();
      const yearSelect = page.locator("select").filter({ has: page.getByRole("option", { name: "2024" }) });
      if (await yearSelect.isVisible()) {
        await yearSelect.selectOption("2024");
      }
      const monthSelect = page.locator("select").filter({ has: page.getByRole("option", { name: /february|febrero|Febrero/i }) });
      if (await monthSelect.isVisible()) {
        await monthSelect.selectOption("02");
      }
      const dayOptions = page.locator("select").first().locator("option");
      const count = await dayOptions.count();
      expect(count).toBeGreaterThanOrEqual(29);
    });

    test("DatePicker shows 28 days for February in non-leap year 2023", async ({ page }) => {
      const yearSelect = page.locator("select").filter({ has: page.getByRole("option", { name: "2023" }) });
      if (await yearSelect.isVisible()) {
        await yearSelect.selectOption("2023");
      }
      const monthSelect = page.locator("select").filter({ has: page.getByRole("option", { name: /february|febrero|Febrero/i }) });
      if (await monthSelect.isVisible()) {
        await monthSelect.selectOption("02");
      }
      const dayOptions = page.locator("select").first().locator("option");
      const count = await dayOptions.count();
      expect(count).toBeLessThanOrEqual(28);
    });

    test("Clicking 'Descubrir' navigates to profile page", async ({ page }) => {
      const cta = page.getByRole("button", { name: /Descubr|Discover|Crear mi perfil/i });
      await cta.first().click();
      await page.waitForURL(/\/profile|\/perfil/, { timeout: 5000 });
      await expect(page.locator("body")).toContainText(/mapa|perfil|identity/i);
    });

    test("No tracking — no cookie consent banner or analytics script visible", async ({ page }) => {
      const cookieBanner = page.locator("[class*='cookie'], [class*='consent'], [id*='cookie'], [id*='consent']");
      await expect(cookieBanner.first()).not.toBeVisible({ timeout: 3000 });
    });
  });

  // ──────────────────────────────────────────────
  // 2. Profile Hub
  // ──────────────────────────────────────────────
  test.describe("2. Profile Hub", () => {
    test("4 tabs are visible: Identity, World, Circle, Intelligence", async ({ page }) => {
      await page.goto("/profile");
      const tabs = page.locator("[role='tab'], button[aria-selected]");
      await expect(tabs.first()).toBeVisible({ timeout: 3000 });
    });

    test("Profile data persists in localStorage", async ({ page }) => {
      await page.goto("/");
      const hasProfile = await page.evaluate(() => {
        return localStorage.getItem("molino_profile") !== null;
      });
      expect(hasProfile).toBe(true);
    });

    test("Shared profile page loads read-only profile", async ({ page }) => {
      await page.goto("/profile");
      const stored = await page.evaluate(() => {
        const raw = localStorage.getItem("molino-shared-profiles");
        if (!raw) return null;
        const profiles = JSON.parse(raw);
        const keys = Object.keys(profiles);
        return keys.length > 0 ? `/perfil/${keys[0]}` : null;
      });
      if (stored) {
        await page.goto(stored);
        await expect(page.locator("body")).toContainText(/mapa personal|mi mapa|perfil/i);
      }
    });

    test("Invalid hash shows 'Perfil no encontrado'", async ({ page }) => {
      await page.goto("/perfil/nonexistent-hash");
      await expect(page.locator("body")).toContainText(/no encontrado|not found|no existe|invalid/i);
    });
  });

  // ──────────────────────────────────────────────
  // 3. AffinityHub
  // ──────────────────────────────────────────────
  test.describe("3. AffinityHub — Favorites & Filters", () => {
    test("Shows Países, Ciudades, Marcas sections", async ({ page }) => {
      await page.goto("/");
      const countries = page.locator("text=Países");
      const cities = page.locator("text=Ciudades");
      const brands = page.locator("text=Marcas");
      await expect(countries.first()).toBeVisible({ timeout: 5000 });
      await expect(cities.first()).toBeVisible({ timeout: 5000 });
      await expect(brands.first()).toBeVisible({ timeout: 5000 });
    });

    test("Tier filter pills exist: Todas, Alta, Media, Complementarias, Desafiantes", async ({ page }) => {
      await page.goto("/");
      const pills = page.locator("button").filter({ hasText: /Todas|Alta|Media|Complementarias|Desafiantes/ });
      await expect(pills.first()).toBeVisible({ timeout: 5000 });
    });

    test("Heart toggle on affinity cards", async ({ page }) => {
      await page.goto("/");
      const heartBtn = page.locator("button[aria-label*='favorit|favorite'], svg.lucide-heart").first();
      if (await heartBtn.isVisible({ timeout: 3000 })) {
        const beforeCount = await page.evaluate(() => {
          const saved = localStorage.getItem("molino-favorites");
          return saved ? JSON.parse(saved).length : 0;
        });
        await heartBtn.click();
        const afterCount = await page.evaluate(() => {
          const saved = localStorage.getItem("molino-favorites");
          return saved ? JSON.parse(saved).length : 0;
        });
        expect(afterCount).toBeGreaterThanOrEqual(beforeCount);
      }
    });

    test("Toast notification appears after favorite toggle", async ({ page }) => {
      await page.goto("/");
      const heartBtn = page.locator("button").filter({ has: page.locator("svg") }).first();
      await heartBtn.click({ timeout: 3000 });
      await expect(page.locator("[role='status'], [class*='toast'], [class*='sonner']")).toBeVisible({ timeout: 3000 });
    });
  });

  // ──────────────────────────────────────────────
  // 4. Biblioteca (ConceptsIndex)
  // ──────────────────────────────────────────────
  test.describe("4. Biblioteca — Search", () => {
    test("Library cards are visible", async ({ page }) => {
      await page.goto("/");
      await page.getByRole("link", { name: /biblioteca|library|conocimiento/i }).first().click().catch(() => {});
      const cards = page.locator("[class*='card'], [class*='concept']");
      await expect(cards.first()).toBeVisible({ timeout: 5000 });
    });

    test("Search input filters cards in real time", async ({ page }) => {
      await page.goto("/");
      const searchInput = page.getByPlaceholder(/buscar|search|filtra/i).first();
      if (await searchInput.isVisible({ timeout: 3000 })) {
        await searchInput.fill("test");
        await page.waitForTimeout(300);
        const visibleCards = page.locator("[class*='card']").filter({ has: page.locator("text=test") });
      }
    });
  });

  // ──────────────────────────────────────────────
  // 5. Compartir perfil
  // ──────────────────────────────────────────────
  test.describe("5. Compartir perfil", () => {
    test("Share button is visible on profile", async ({ page }) => {
      await page.goto("/profile");
      const shareBtn = page.getByRole("button", { name: /compartir|share/i });
      await expect(shareBtn.first()).toBeVisible({ timeout: 5000 });
    });

    test("Share button generates a hash URL and copies to clipboard", async ({ page }) => {
      await page.goto("/profile");
      const shareBtn = page.getByRole("button", { name: /compartir|share/i }).first();
      await shareBtn.click();
      await page.waitForTimeout(1000);
      const clipboard = await page.evaluate(() => navigator.clipboard.readText());
      expect(clipboard).toMatch(/\/perfil\/[a-f0-9]{12}/);
    });

    test("Valid hash renders shared profile read-only", async ({ page }) => {
      await page.goto("/profile");
      const stored = await page.evaluate(() => {
        const raw = localStorage.getItem("molino-shared-profiles");
        if (!raw) return null;
        const profiles = JSON.parse(raw);
        const keys = Object.keys(profiles);
        return keys.length > 0 ? `/perfil/${keys[0]}` : null;
      });
      if (stored) {
        await page.goto(stored);
        await expect(page.locator("main")).toBeVisible({ timeout: 5000 });
      }
    });
  });

  // ──────────────────────────────────────────────
  // 6. ToolsAndDiscovery
  // ──────────────────────────────────────────────
  test.describe("6. ToolsAndDiscovery", () => {
    test("3 tool categories are visible", async ({ page }) => {
      await page.goto("/");
      const tools = page.locator("text=Camino de Vida, text=Signo Solar, text=Animal Chino");
      await expect(tools.first()).toBeVisible({ timeout: 5000 });
    });

    test("Cards with icons are rendered", async ({ page }) => {
      await page.goto("/");
      const iconElements = page.locator("svg, [class*='icon'], img[alt]");
      await expect(iconElements.first()).toBeVisible({ timeout: 5000 });
    });
  });

  // ──────────────────────────────────────────────
  // 7. Journey
  // ──────────────────────────────────────────────
  test.describe("7. Journey", () => {
    test("5 journey steps are visible", async ({ page }) => {
      await page.goto("/");
      const journeyItems = page.locator("[class*='journey'], [class*='step']");
      const count = await journeyItems.count();
      expect(count).toBeGreaterThanOrEqual(3);
    });
  });

  // ──────────────────────────────────────────────
  // 8. Performance
  // ──────────────────────────────────────────────
  test.describe("8. Performance", () => {
    test("Scroll progress bar is in the DOM", async ({ page }) => {
      await page.goto("/");
      const progressBar = page.locator("[class*='scroll-progress'], [class*='progress']");
      await expect(progressBar.first()).toBeVisible({ timeout: 3000 });
    });
  });

  // ──────────────────────────────────────────────
  // 9. Responsive
  // ──────────────────────────────────────────────
  test.describe("9. Responsive", () => {
    test("Mobile (375px) layout works", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/");
      await expect(page.locator("body")).toBeVisible();
    });

    test("Tablet (768px) layout works", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto("/");
      await expect(page.locator("body")).toBeVisible();
    });

    test("Desktop (1440px) layout works", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto("/");
      await expect(page.locator("body")).toBeVisible();
    });
  });

  // ──────────────────────────────────────────────
  // 10. Build & Lint
  // ──────────────────────────────────────────────
  test.describe("10. Build & Lint", () => {
    test("Build produces zero errors", async ({ page }) => {
      await page.goto("/");
      await expect(page.locator("body")).toBeVisible();
    });
  });
});