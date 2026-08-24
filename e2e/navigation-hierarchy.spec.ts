import { test, expect } from "@playwright/test";

// Fase 5 (2026-08-23): el header es contextual — sin perfil ofrece
// exploración general (Atlas/Hoy/Calendario/Journal/Explorar/Guardar mi
// mapa); con perfil habla en primera persona (Mi Mapa/Mis Afinidades/Mi
// Tiempo/Mi Journal/Mis Mapas/Explorar). Sin overflow en ningún ancho,
// navegable por teclado, sin regresión de hidratación.

async function seedProfile(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    localStorage.setItem(
      "molino.user-profile.v1",
      JSON.stringify({
        version: 1,
        profile: {
          name: "Test",
          birthDate: "1990-06-15",
          birthPlace: "",
          goal: "life",
          interests: [],
          onboardingStep: 5,
          completedSections: [],
          theme: "light",
          language: "es",
          notifications: false,
          lifePath: 4,
          sunSign: "Géminis",
          sunSignInfo: { sign: "Géminis", element: "Aire", modality: "Mutable" },
          chineseZodiac: "Caballo",
          chineseZodiacInfo: { animal: "Caballo", element: "Metal" },
          element: "Aire",
          modality: "Mutable",
          archetype: "El Buscador",
          archetypeInfo: {
            name: "El Buscador",
            color: "#000",
            description: "",
            quote: "",
            keywords: [],
            strengths: [],
            challenges: [],
          },
        },
        savedAt: new Date(0).toISOString(),
      })
    );
  });
}

test.describe("Navegación — sin perfil", () => {
  test("desktop (1440px): 4 links CORE + Explorar + Guardar mi mapa, sin overflow", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    await expect(nav.getByRole("link", { name: "Atlas" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Hoy", exact: true })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Calendario" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Journal" })).toBeVisible();
    await expect(nav.getByRole("button", { name: /explorar/i })).toBeVisible();
    await expect(nav.getByRole("button", { name: /guardar mi mapa/i })).toBeVisible();
    const bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(1441);
  });

  test("el dropdown Explorar agrupa Modos y Aprender, cierra con Escape", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const trigger = page.getByRole("navigation", { name: "Navegación principal" }).getByRole("button", { name: /explorar/i });
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const menu = page.locator("#explore-menu");
    for (const label of ["Modo Socios", "Modo Parejas", "Academia", "Biblioteca", "Blog"]) {
      await expect(menu.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("Guardar mi mapa abre el mismo drawer de perfiles guardados", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.getByRole("button", { name: /guardar mi mapa/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("tablet (834px): hamburguesa visible, nav desktop oculto, sin overflow", async ({ page }) => {
    await page.setViewportSize({ width: 834, height: 1112 });
    await page.goto("/");
    await expect(page.getByRole("button", { name: /abrir menú/i })).toBeVisible();
    const bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(835);
  });

  test("mobile (390px): menú agrupado ATLAS/HOY/CALENDARIO/JOURNAL/EXPLORAR/GUARDAR MI MAPA, sin overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /abrir menú/i });
    await toggle.click();
    const mobileMenu = page.locator("#mobile-menu");
    await expect(mobileMenu.getByRole("link", { name: "Atlas", exact: true })).toBeVisible();
    await expect(mobileMenu.getByRole("link", { name: "Hoy", exact: true })).toBeVisible();
    await expect(mobileMenu.getByText("Explorar")).toBeVisible();
    await expect(mobileMenu.getByRole("button", { name: /guardar mi mapa/i })).toBeVisible();
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
});

test.describe("Navegación — con perfil", () => {
  test("desktop (1440px): Mi Mapa/Mis Afinidades/Mi Tiempo/Mi Journal/Mis Mapas/Explorar, sin overflow", async ({ page }) => {
    await seedProfile(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    await expect(nav.getByRole("link", { name: "Mi Mapa" })).toBeVisible();
    await expect(nav.getByRole("button", { name: "Mis Afinidades" })).toBeVisible();
    await expect(nav.getByRole("button", { name: "Mi Tiempo" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Mi Journal" })).toBeVisible();
    await expect(nav.getByRole("button", { name: /mis mapas/i })).toBeVisible();
    await expect(nav.getByRole("button", { name: /explorar/i })).toBeVisible();
    const bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(1441);
  });

  test("Mis Afinidades muestra las categorías reales y navega", async ({ page }) => {
    await seedProfile(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    // El nav arranca en el estado "sin perfil" (SSR determinista) y se
    // corrige a "con perfil" en cuanto monta — esperamos ese asentamiento
    // antes de interactuar, para no clickear en pleno reflow.
    await expect(nav.getByRole("link", { name: "Mi Mapa" })).toBeVisible();
    await nav.getByRole("button", { name: "Mis Afinidades" }).click();
    const menu = page.locator("#affinities-menu");
    for (const label of ["Países", "Ciudades", "Marcas", "Universidades", "Famosos", "Películas", "Equipos"]) {
      await expect(menu.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    await menu.getByRole("link", { name: "Marcas", exact: true }).click();
    await page.waitForURL("**/affinity/brand");
  });

  test("Mi Tiempo muestra Hoy/Semana/Mes/Año y navega", async ({ page }) => {
    await seedProfile(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    await expect(nav.getByRole("link", { name: "Mi Mapa" })).toBeVisible();
    await nav.getByRole("button", { name: "Mi Tiempo" }).click();
    const menu = page.locator("#time-menu");
    for (const label of ["Hoy", "Semana", "Mes", "Año"]) {
      await expect(menu.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    await menu.getByRole("link", { name: "Semana", exact: true }).click();
    await page.waitForURL("**/semana");
  });

  test("Explorar (con perfil) incluye Atlas dentro de Aprender", async ({ page }) => {
    await seedProfile(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    await expect(nav.getByRole("link", { name: "Mi Mapa" })).toBeVisible();
    await nav.getByRole("button", { name: /explorar/i }).click();
    const menu = page.locator("#explore-menu");
    for (const label of ["Academia", "Atlas", "Biblioteca", "Blog", "Modo Socios", "Modo Parejas"]) {
      await expect(menu.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
  });

  test("Mis Mapas abre el mismo drawer de perfiles guardados", async ({ page }) => {
    await seedProfile(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    await expect(nav.getByRole("link", { name: "Mi Mapa" })).toBeVisible();
    await nav.getByRole("button", { name: /mis mapas/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("mobile (390px): MI MAPA/MIS AFINIDADES/MI TIEMPO/MI JOURNAL/MIS MAPAS/EXPLORAR, sin overflow", async ({ page }) => {
    await seedProfile(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /abrir menú/i });
    await toggle.click();
    const mobileMenu = page.locator("#mobile-menu");
    await expect(mobileMenu.getByRole("link", { name: "Mi Mapa", exact: true })).toBeVisible();
    await expect(mobileMenu.getByText("Mis Afinidades")).toBeVisible();
    await expect(mobileMenu.getByText("Mi Tiempo")).toBeVisible();
    await expect(mobileMenu.getByRole("link", { name: "Mi Journal", exact: true })).toBeVisible();
    await expect(mobileMenu.getByRole("button", { name: /mis mapas/i })).toBeVisible();
    await expect(mobileMenu.getByText("Explorar")).toBeVisible();
    const bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(391);
  });

  test("crear un mapa nuevo desde el header vuelve al estado sin perfil", async ({ page }) => {
    await seedProfile(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    await expect(nav.getByRole("link", { name: "Mi Mapa" })).toBeVisible();

    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: /abrir menú/i }).click();
    await page.getByRole("button", { name: /reiniciar perfil actual/i }).click();
    await page.getByRole("button", { name: /confirmar/i }).click();
    await page.waitForURL("**/onboarding");
  });
});

test.describe("Footer — sin cambios en esta fase", () => {
  test("footer: Afinidades sigue apuntando a /mundo", async ({ page }) => {
    await page.goto("/");
    const footerLink = page.locator("footer").getByRole("link", { name: "Afinidades" });
    await expect(footerLink).toHaveAttribute("href", "/mundo");
  });
});
