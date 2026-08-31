import { test, expect } from "@playwright/test";

const PROFILE_PAYLOAD = JSON.stringify({
  version: 1,
  profile: {
    name: "Test",
    birthDate: "1990-01-15",
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

async function setupPremiumMocks(page: import("@playwright/test").Page) {
  await page.route("**/api/mp/check", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ premium: false }),
    });
  });
  await page.route("**/api/features/flags", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ premiumEnabled: true, mercadoPagoEnabled: true, premiumPriceUsd: 8 }),
    });
  });
  await page.route("**/api/intelligence/interpret", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ fallback: { corePattern: { what: "patrón", source: "test" }, howYouOperate: "test", closingSynthesis: "test", tensions: [] } }),
    });
  });
}

async function seedProfile(page: import("@playwright/test").Page) {
  await page.addInitScript((arg) => {
    localStorage.setItem("molino.user-profile.v1", arg);
    sessionStorage.setItem("molino.matrix-seen", "1");
  }, PROFILE_PAYLOAD);
}

// /profile es hoy un dashboard de scroll único (ProfileHub).
// El gate de Premium vive en /lectura (LecturaProfunda → PremiumGate)
// y en /premium (PremiumClient → PremiumCheckout).
// No hay /profile?tab=intelligence ni botón "Volver a mi mapa"
// del antiguo ProfileTabs legacy.
test.describe("Premium Funnel E2E", () => {
  test("El Mapa gratuito es útil", async ({ page }) => {
    await seedProfile(page);
    await setupPremiumMocks(page);
    await page.goto("/profile");
    await page.waitForLoadState("networkidle");

    // El perfil sembrado se renderiza en ProfileHub
    await expect(page.getByText(/MAPA PERSONAL SIMBÓLICO/)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Camino de Vida 4/)).toBeVisible();
    await expect(page.getByText("Sol en Géminis").first()).toBeVisible();
  });

  test("La síntesis determinista es gratuita y el paywall de Lectura es visible", async ({ page }) => {
    await seedProfile(page);
    await setupPremiumMocks(page);
    await page.goto("/lectura");
    await page.waitForLoadState("networkidle");

    // Piezas gratuitas — calcularon sin IA
    await expect(page.getByText(/TU PATRÓN CENTRAL/i)).toBeVisible({ timeout: 15000 });

    // El paywall de la Lectura Pro está activo (usuario no premium)
    await expect(page.getByText('Lectura Pro', { exact: true })).toBeVisible();
    await expect(page.getByText(/Pago único · de por vida/)).toBeVisible();
  });

  test("La IA está detrás del muro Premium para usuarios sin acceso", async ({ page }) => {
    await seedProfile(page);
    await setupPremiumMocks(page);
    await page.goto("/ai");
    await page.waitForLoadState("networkidle");

    // Sin Premium, el chat no aparece: se muestra la invitación
    await expect(page.getByText("Preguntale")).toBeVisible();
    await expect(page.getByText("a tu Molino")).toBeVisible();
    await expect(page.getByText(/Incluye 50 preguntas/)).toBeVisible();
    await expect(page.getByRole("link", { name: /Ver la Lectura Pro/ })).toBeVisible();
  });

  test("Premium: lectura escrita + conversación IA · USD 8 · pago único · 50 consultas", async ({ page }) => {
    await page.goto("/premium");
    await page.waitForLoadState("networkidle");

    // Precio y modelo de cobro — scoped al checkout box para evitar modo estricto
    const checkoutBox = page.locator("#checkout-box");
    await expect(checkoutBox.getByText('$8', { exact: true })).toBeVisible({ timeout: 15000 });
    await expect(checkoutBox.getByText("Pago Único")).toBeVisible();
    await expect(checkoutBox.getByText(/por vida/i)).toBeVisible();

    // Beneficios del plan Pro — FeatureComparison incluye "50 consultas"
    await expect(page.getByText(/50 consultas/).first()).toBeVisible();

    // Método de pago
    await expect(page.getByRole("button", { name: /Pagar con Mercado Pago/ })).toBeVisible();

    // Sin anclaje de precio: no aparecen precios de terceros
    await expect(page.getByText(/\$50/)).toHaveCount(0);
    await expect(page.getByText(/\$120/)).toHaveCount(0);
  });

  test("Sin anclaje de precio: la página Premium no compara con tarifas externas", async ({ page }) => {
    await page.goto("/premium");
    await page.waitForLoadState("networkidle");

    // El texto de la página habla de lo que incluye, no de cuánto ahorra
    await expect(page.getByText(/El mapa y la síntesis calculada son gratis/)).toBeVisible();
    await expect(page.getByText(/conversación con tu mapa/)).toBeVisible();

    // No hay comparativas con precios de terceros en la página (solo texto visible)
    await expect(page.getByText(/\$50/)).toHaveCount(0);
    await expect(page.getByText(/\$120/)).toHaveCount(0);
    await expect(page.getByText("suscripción mensual")).toHaveCount(0);
  });
});