import { test, expect } from "@playwright/test";

// El header tiene tres zonas fijas: logo | destinos | acción del estado.
// Sin mapa los destinos son Atlas/Hoy y la acción es "Crear mi mapa"; con
// mapa son Mi Mapa/Afinidades/Tiempo/Journal y las acciones son
// Lectura/Guardados. "Explorar" ya no vive en el header desktop — se movió
// al footer, y solo queda en el menú móvil (única navegación de mobile).

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
  test("desktop (1440px): destinos Atlas/Hoy + acción Crear mi mapa, sin Explorar", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    await expect(nav.getByRole("link", { name: "Atlas" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Hoy", exact: true })).toBeVisible();
    // La acción vive fuera del <nav> de destinos, en la zona derecha.
    await expect(page.getByRole("link", { name: "Crear mi mapa" })).toBeVisible();
    await expect(nav.getByRole("button", { name: /explorar/i })).toHaveCount(0);
    await expect(nav.getByRole("link", { name: "Calendario" })).toHaveCount(0);
    const bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(1441);
  });

  test("Crear mi mapa lleva al onboarding", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.getByRole("link", { name: "Crear mi mapa" }).click();
    await page.waitForURL("**/onboarding");
  });

  test("tablet (834px): hamburguesa visible, nav desktop oculto, sin overflow", async ({ page }) => {
    await page.setViewportSize({ width: 834, height: 1112 });
    await page.goto("/");
    await expect(page.getByRole("button", { name: /abrir menú/i })).toBeVisible();
    const bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(835);
  });

  test("mobile (390px): CREAR MI MAPA primero, después destinos y Explorar", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: /abrir menú/i }).click();
    const mobileMenu = page.locator("#mobile-menu");
    await expect(mobileMenu.getByRole("link", { name: /crear mi mapa/i })).toBeVisible();
    await expect(mobileMenu.getByRole("link", { name: "Atlas", exact: true })).toBeVisible();
    await expect(mobileMenu.getByRole("link", { name: "Hoy", exact: true })).toBeVisible();
    await expect(mobileMenu.getByText("Explorar")).toBeVisible();
    const bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(391);
  });

  test("navegación por teclado: Tab llega al primer destino con foco visible", async ({ page, isMobile }) => {
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
  test("desktop (1440px): destinos sin prefijo Mi/Mis + acciones Lectura/Guardar", async ({ page }) => {
    await seedProfile(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    await expect(nav.getByRole("link", { name: "Mi Mapa" })).toBeVisible();
    await expect(nav.getByRole("button", { name: "Afinidades" })).toBeVisible();
    await expect(nav.getByRole("button", { name: "Tiempo" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Journal" })).toBeVisible();
    await expect(nav.getByRole("button", { name: /explorar/i })).toHaveCount(0);
    // Zona derecha, fuera del <nav>: la bóveda vacía dice "Guardar".
    await expect(page.getByRole("button", { name: /^guardar$/i })).toBeVisible();
    const bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(1441);
  });

  test("Afinidades muestra las categorías reales y navega", async ({ page }) => {
    await seedProfile(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    // El nav arranca en el estado "sin perfil" (SSR determinista) y se
    // corrige a "con perfil" en cuanto monta — esperamos ese asentamiento
    // antes de interactuar, para no clickear en pleno reflow.
    await expect(nav.getByRole("link", { name: "Mi Mapa" })).toBeVisible();
    await nav.getByRole("button", { name: "Afinidades" }).click();
    const menu = page.locator("#affinities-menu");
    for (const label of ["Países", "Ciudades", "Marcas", "Universidades", "Famosos", "Películas", "Equipos"]) {
      await expect(menu.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    await menu.getByRole("link", { name: "Marcas", exact: true }).click();
    await page.waitForURL("**/affinity/brand");
  });

  test("Tiempo muestra Hoy/Semana/Mes/Año y navega", async ({ page }) => {
    await seedProfile(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    await expect(nav.getByRole("link", { name: "Mi Mapa" })).toBeVisible();
    await nav.getByRole("button", { name: "Tiempo" }).click();
    const menu = page.locator("#time-menu");
    for (const label of ["Hoy", "Semana", "Mes", "Año"]) {
      await expect(menu.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    await menu.getByRole("link", { name: "Semana", exact: true }).click();
    await page.waitForURL("**/semana");
  });

  test("la acción de la bóveda abre el drawer de perfiles guardados", async ({ page }) => {
    await seedProfile(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    await expect(nav.getByRole("link", { name: "Mi Mapa" })).toBeVisible();
    await page.getByRole("button", { name: /^guardar$/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("mobile (390px): destinos, después acciones, después Explorar", async ({ page }) => {
    await seedProfile(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: /abrir menú/i }).click();
    const mobileMenu = page.locator("#mobile-menu");
    await expect(mobileMenu.getByRole("link", { name: "Mi Mapa", exact: true })).toBeVisible();
    await expect(mobileMenu.getByText("Afinidades")).toBeVisible();
    await expect(mobileMenu.getByText("Tiempo")).toBeVisible();
    await expect(mobileMenu.getByRole("link", { name: "Journal", exact: true })).toBeVisible();
    await expect(mobileMenu.getByRole("button", { name: /^guardar$/i })).toBeVisible();
    await expect(mobileMenu.getByText("Explorar")).toBeVisible();
    const bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(391);
  });

  test("el menú móvil sigue teniendo Explorar aunque el header desktop no", async ({ page }) => {
    await seedProfile(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: /abrir menú/i }).click();
    const mobileMenu = page.locator("#mobile-menu");
    for (const label of ["Academia", "Atlas", "Biblioteca", "Blog", "Modo Socios", "Modo Parejas"]) {
      await expect(mobileMenu.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
  });

  test("crear un mapa nuevo desde el header vuelve al estado sin perfil", async ({ page }) => {
    await seedProfile(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
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
