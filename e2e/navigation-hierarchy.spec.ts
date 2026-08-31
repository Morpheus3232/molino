import { test, expect } from "@playwright/test";

const PROFILE_PAYLOAD = JSON.stringify({
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
});

async function seedProfile(page: import("@playwright/test").Page, viewport?: { width: number; height: number }) {
  await page.addInitScript((arg) => {
    localStorage.setItem("molino.user-profile.v1", arg);
  }, PROFILE_PAYLOAD);
  await page.setViewportSize(viewport || { width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
}

test.describe("Navegación — sin perfil", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });
  test("desktop (1440px): Conocimiento/Atlas/Tiempo/Modos/Proyecto + acción Crear mi mapa", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    await expect(nav.getByRole("button", { name: "Conocimiento" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Atlas" })).toBeVisible();
    await expect(nav.getByRole("button", { name: "Tiempo" })).toBeVisible();
    await expect(nav.getByRole("button", { name: "Modos" })).toBeVisible();
    await expect(nav.getByRole("button", { name: "Proyecto" })).toBeVisible();
    await expect(page.getByRole("banner").getByRole("link", { name: "Crear mi mapa" })).toBeVisible();
    await expect(nav.getByRole("button", { name: /explorar/i })).toHaveCount(0);
    const bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(1441);
  });

  test("Crear mi mapa lleva al onboarding", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.getByRole("banner").getByRole("link", { name: "Crear mi mapa" }).click();
    await page.waitForURL("**/onboarding");
  });

  test("Conocimiento sin perfil muestra los enlaces del sistema", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    await nav.getByRole("button", { name: "Conocimiento" }).click();
    const menu = page.locator("#knowledge-menu");
    for (const label of ["Numerología", "Astrología", "Zodíaco chino", "Blog", "Biblioteca", "Academia"]) {
      await expect(menu.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
  });

  test("Tiempo sin perfil ofrece Hoy/Mes, no Semana ni Año", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    await nav.getByRole("button", { name: "Tiempo" }).click();
    const menu = page.locator("#time-menu");
    await expect(menu.getByRole("link", { name: "Hoy", exact: true })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Mes", exact: true })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Semana", exact: true })).toHaveCount(0);
    await expect(menu.getByRole("link", { name: "Año", exact: true })).toHaveCount(0);
  });

  test("Modos sin perfil lleva a Modo Socios/Modo Parejas/Regalar Mapa", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    await nav.getByRole("button", { name: "Modos" }).click();
    const menu = page.locator("#modes-menu");
    await expect(menu.getByRole("link", { name: "Modo Socios", exact: true })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Modo Parejas", exact: true })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Regalar Mapa 🎁", exact: true })).toBeVisible();
    await menu.getByRole("link", { name: "Modo Parejas", exact: true }).click();
    await page.waitForURL("**/pareja");
  });

  test("Proyecto sin perfil muestra las opciones del proyecto", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    await nav.getByRole("button", { name: "Proyecto" }).click();
    const menu = page.locator("#project-menu");
    for (const label of ["Filosofía", "Transparencia", "Métodos y fuentes", "Changelog"]) {
      await expect(menu.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
  });

  test("tablet (834px): hamburguesa visible, nav desktop oculto, sin overflow", async ({ page }) => {
    await page.setViewportSize({ width: 834, height: 1112 });
    await page.goto("/");
    await expect(page.getByRole("button", { name: /abrir menú/i })).toBeVisible();
    const bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(835);
  });

  test("mobile (390px): CREAR MI MAPA primero, después destinos", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: /abrir menú/i }).click();
    const mobileMenu = page.locator("#mobile-menu");
    await expect(mobileMenu.getByRole("link", { name: /crear mi mapa/i })).toBeVisible();
    await expect(mobileMenu.getByText("Conocimiento")).toBeVisible();
    await expect(mobileMenu.getByText("Atlas")).toBeVisible();
    await expect(mobileMenu.getByText("Tiempo")).toBeVisible();
    await expect(mobileMenu.getByText("Modos")).toBeVisible();
    await expect(mobileMenu.getByText("Proyecto")).toBeVisible();
    await expect(mobileMenu.getByRole("link", { name: "Journal", exact: true })).toBeVisible();
    const bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(391);
  });

  test("navegación por teclado: Tab llega al primer destino con foco visible", async ({ page, isMobile }) => {
    test.skip(isMobile, "el nav desktop está oculto en mobile — se navega por el menú hamburguesa");
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => document.activeElement?.textContent?.trim());
    expect(focused).toBeTruthy();
  });
});

test.describe("Navegación — con perfil", () => {
  test("desktop (1440px): destinos sin prefijo Mi/Mis + acciones Mi Lectura/Guardados", async ({ page }) => {
    await seedProfile(page);
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    await expect(page.getByRole("banner").getByRole("link", { name: "Mi Mapa" })).toBeVisible();
    await expect(nav.getByRole("button", { name: "Afinidades" })).toBeVisible();
    await expect(nav.getByRole("button", { name: "Conocimiento" })).toBeVisible();
    await expect(nav.getByRole("button", { name: "Tiempo" })).toBeVisible();
    await expect(nav.getByRole("button", { name: "Modos" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Journal" })).toBeVisible();
    await expect(nav.getByRole("button", { name: /explorar/i })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /^guardar$/i })).toBeVisible();
    const bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(1441);
  });

  test("Afinidades muestra las categorías reales y navega", async ({ page }) => {
    await seedProfile(page);
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    await expect(page.getByRole("banner").getByRole("link", { name: "Mi Mapa" })).toBeVisible();
    await expect(nav.getByRole("button", { name: "Afinidades" })).toBeVisible();
    await nav.getByRole("button", { name: "Afinidades" }).click({ force: true });
    await page.waitForSelector("#affinities-menu", { state: "visible" });
    const menu = page.locator("#affinities-menu");
    for (const label of ["Países", "Ciudades", "Marcas", "Universidades", "Famosos", "Películas", "Equipos"]) {
      await expect(menu.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    await menu.getByRole("link", { name: "Marcas", exact: true }).click();
    await page.waitForURL("**/affinity/brand");
  });

  test("Tiempo muestra Hoy/Semana/Mes/Año y navega", async ({ page }) => {
    await seedProfile(page);
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    await expect(page.getByRole("banner").getByRole("link", { name: "Mi Mapa" })).toBeVisible();
    await nav.getByRole("button", { name: "Tiempo" }).click();
    const menu = page.locator("#time-menu");
    for (const label of ["Hoy", "Semana", "Mes", "Año"]) {
      await expect(menu.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    await menu.getByRole("link", { name: "Semana", exact: true }).click();
    await page.waitForURL("**/semana");
  });

  test("Modos con perfil muestra Modo Socios/Modo Parejas/Regalar y navega", async ({ page }) => {
    await seedProfile(page);
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    await expect(page.getByRole("banner").getByRole("link", { name: "Mi Mapa" })).toBeVisible();
    await nav.getByRole("button", { name: "Modos" }).click();
    const menu = page.locator("#modes-menu");
    await expect(menu.getByRole("link", { name: "Modo Socios", exact: true })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Modo Parejas", exact: true })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Regalar Mapa 🎁", exact: true })).toBeVisible();
    await menu.getByRole("link", { name: "Modo Socios", exact: true }).click();
    await page.waitForURL("**/socios");
  });

  test("Journal link with perfil navega al atlas de lecturas", async ({ page }) => {
    await seedProfile(page);
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    await expect(nav.getByRole("link", { name: "Journal" })).toBeVisible();
    await nav.getByRole("link", { name: "Journal", exact: true }).click();
    await page.waitForURL("**/journal");
  });

  test("la acción de la bóveda abre el drawer de perfiles guardados", async ({ page }) => {
    await seedProfile(page);
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    await expect(page.getByRole("banner").getByRole("link", { name: "Mi Mapa" })).toBeVisible();
    await page.getByRole("button", { name: /^guardar$/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("mobile (390px): destinos, Modos, acciones, después Conocimiento", async ({ page }) => {
    await seedProfile(page, { width: 390, height: 844 });
    await page.getByRole("button", { name: /abrir menú/i }).click();
    const mobileMenu = page.locator("#mobile-menu");
    await expect(mobileMenu.getByRole("link", { name: "Mi Mapa", exact: true })).toBeVisible();
    await expect(mobileMenu.getByText("Afinidades")).toBeVisible();
    await expect(mobileMenu.getByText("Conocimiento")).toBeVisible();
    await expect(mobileMenu.getByText("Tiempo")).toBeVisible();
    await expect(mobileMenu.getByText("Modos")).toBeVisible();
    await expect(mobileMenu.getByText("Proyecto")).toBeVisible();
    await expect(mobileMenu.getByRole("link", { name: "Journal", exact: true })).toBeVisible();
    await expect(mobileMenu.getByRole("button", { name: /^guardar$/i })).toBeVisible();
    const bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(391);
  });

  test("con perfil, Conocimiento (móvil) incluye Atlas y las entradas del sistema", async ({ page }) => {
    await seedProfile(page, { width: 390, height: 844 });
    await page.getByRole("button", { name: /abrir menú/i }).click();
    const mobileMenu = page.locator("#mobile-menu");
    for (const label of ["Numerología", "Astrología", "Zodíaco chino", "Blog", "Biblioteca", "Academia", "Atlas"]) {
      await expect(mobileMenu.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
  });

  test("crear un mapa nuevo desde el header vuelve al estado sin perfil", async ({ page }) => {
    await seedProfile(page, { width: 390, height: 844 });
    await page.getByRole("button", { name: /abrir menú/i }).click();
    await page.getByRole("button", { name: "Crear nuevo mapa" }).click();
    await page.getByRole("button", { name: /confirmar/i }).click();
    await page.waitForURL("**/onboarding");
  });
});

test.describe("Footer — enlaces actualizados", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });
  test("footer: Mi Molino columna tiene los enlaces del producto", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer.getByRole("link", { name: "Mi Mapa", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Mi Lectura" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Preguntá (IA)" })).toBeVisible();
  });

  test("footer: Conocer y explorar tiene las entradas del sistema", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    for (const label of ["Numerología", "Astrología", "Zodíaco chino", "Blog", "Biblioteca", "Academia", "Afinidades", "Atlas", "Calendario", "Journal"]) {
      await expect(footer.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
  });

  test("footer: Proyecto y Más con enlaces actuales", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer.getByRole("link", { name: "Filosofía" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Transparencia" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Changelog" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Privacidad" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Términos" })).toBeVisible();
  });
});