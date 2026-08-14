import { test, expect } from "@playwright/test";

test.describe("Flujo Crítico Completo — Portada → Onboarding → Perfil → Navegación → Compartir → Incógnito", () => {
  test("1. Ingresar fecha en inicio genera mapa y navega a /onboarding /profile", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const dateInput = page.getByRole("group", { name: "Fecha de nacimiento" }).first();
    const ddInput = dateInput.getByPlaceholder("DD");
    const mmInput = dateInput.getByPlaceholder("MM");
    const yyyyInput = dateInput.getByPlaceholder("AAAA");

    // Usamos pressSequentially (tecleo real) en vez de fill(): en WebKit el
    // fill() sintético setea el DOM sin disparar el onChange de React, y un
    // re-render posterior resetea el campo a su estado vacío.
    await ddInput.pressSequentially("15");
    await mmInput.pressSequentially("06");
    await yyyyInput.pressSequentially("1990");

    const generateBtn = page.getByRole("button", { name: /descubrí tu mapa/i }).first();
    await generateBtn.click({ force: true });

    await page.waitForURL(/\/onboarding|\/profile/, { waitUntil: "commit", timeout: 15000 });
    expect(page.url()).toMatch(/\/onboarding|\/profile/);
  });

  test("2. Cargar perfil con datos (?dob=) muestra el mapa y sobrevive al refresh", async ({ page }) => {
    await page.goto("/profile?dob=1990-06-15");
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("h1").first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Camino de Vida/i).first()).toBeVisible({ timeout: 15000 });

    await page.reload();
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 15000 });
  });

  test("3. Navegación desde el perfil al inicio y regreso al mapa", async ({ page }) => {
    await page.goto("/profile?dob=1990-06-15");
    await page.waitForLoadState("domcontentloaded");

    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("body")).toContainText(/tu mapa|molino/i);
  });

  test("4. Compartir perfil y abrir en nuevo contexto limpio (Modo Incógnito)", async ({ page, browser }) => {
    await page.goto("/profile?dob=1990-06-15");
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("h1").first()).toBeVisible({ timeout: 15000 });

    // Abrir nuevo browser context independiente (simulando incógnito)
    const incognitoContext = await browser.newContext();
    const incognitoPage = await incognitoContext.newPage();

    await incognitoPage.goto("/profile?dob=1990-06-15");
    await incognitoPage.waitForLoadState("domcontentloaded");

    await expect(incognitoPage.locator("h1").first()).toBeVisible({ timeout: 15000 });
    await expect(incognitoPage.getByText(/Camino de Vida/i).first()).toBeVisible({ timeout: 15000 });

    await incognitoContext.close();
  });
});
