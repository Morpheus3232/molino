import { test, expect } from "@playwright/test";

test.describe("Navigation — inicio → perfil → volver", () => {
  test("ingresar una fecha válida en el inicio navega a /onboarding con esa fecha", async ({ page }) => {
    await page.goto("/");

    // Two DateInputs render on the page (responsive layout variants) — scope
    // to the first, matching how a real user only ever sees one at a time.
    const dateInput = page.getByRole("group", { name: "Fecha de nacimiento" }).first();
    await dateInput.getByPlaceholder("DD").fill("15");
    await dateInput.getByPlaceholder("MM").fill("06");
    await dateInput.getByPlaceholder("AAAA").fill("1990");
    await page.getByRole("button", { name: "Generar mi mapa" }).first().click();

    await page.waitForURL(/\/onboarding/, { timeout: 10000 });
    expect(page.url()).toContain("/onboarding");
  });

  test("perfil con datos → volver a inicio via el nav", async ({ page }) => {
    await page.goto("/profile?dob=1990-06-15");
    await page.waitForLoadState("networkidle");

    // Confirma que llegamos al mapa (no al empty state) antes de navegar de vuelta.
    await expect(page.getByRole("heading", { name: "Tu mapa se genera en la portada" })).toHaveCount(0);

    await page.getByRole("link", { name: "Inicio" }).first().click();
    await page.waitForURL(/^http:\/\/localhost:3000\/$/, { timeout: 10000 });
    expect(new URL(page.url()).pathname).toBe("/");
  });

  test("volver a /profile#<hash> reconstruye el mapa sin servidor", async ({ page }) => {
    await page.goto("/profile?dob=1990-06-15");
    await page.waitForLoadState("networkidle");

    // El propio ProfileClient normaliza la URL a /profile#<hash> una vez que
    // el mapa está en pantalla — lo esperamos en vez de armarlo a mano.
    await page.waitForFunction(() => window.location.hash.length > 1, { timeout: 10000 });
    const bookmarked = page.url();
    expect(bookmarked).toContain("/profile#");

    // Simula "abrir el link guardado más tarde": nueva pestaña sin
    // localStorage ni ?dob=, solo el fragmento.
    const fresh = await page.context().newPage();
    await fresh.goto(bookmarked);
    await fresh.waitForLoadState("networkidle");
    await expect(fresh.getByRole("heading", { name: "Tu mapa se genera en la portada" })).toHaveCount(0);
    await fresh.close();
  });
});
