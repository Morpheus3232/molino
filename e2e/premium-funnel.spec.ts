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

async function setupCouponActivationMocks(page: import("@playwright/test").Page) {
  let activated = false;
  await page.route("**/api/mp/check", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(activated ? { premium: true, premiumToken: "test-premium-token" } : { premium: false }),
    });
  });
  await page.route("**/api/features/flags", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ premiumEnabled: true, mercadoPagoEnabled: true, premiumPriceUsd: 8 }),
    });
  });
  await page.route("**/api/mp/coupon", async (route) => {
    activated = true;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ valid: true, premiumToken: "test-premium-token" }),
    });
  });
  await page.route("**/api/intelligence/interpret", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        fallback: {
          corePattern: { what: "patrón", source: "test" },
          howYouOperate: "test",
          closingSynthesis: "test",
          tensions: [],
          summary: "Lectura de prueba",
          suggestedNextStep: "Continúa explorando",
        },
      }),
    });
  });
}

test.describe("Premium Funnel E2E", () => {
  test("El Mapa gratuito es útil", async ({ page }) => {
    await seedProfile(page);
    await setupPremiumMocks(page);
    await page.goto("/profile");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(/MAPA PERSONAL SIMBÓLICO/)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Camino de Vida 4/)).toBeVisible();
    await expect(page.getByText("Sol en Géminis").first()).toBeVisible();
  });

  test("La síntesis determinista es gratuita y el paywall de Lectura es visible", async ({ page }) => {
    await seedProfile(page);
    await setupPremiumMocks(page);
    await page.goto("/lectura");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(/TU PATRÓN CENTRAL/i)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Lectura Pro', { exact: true })).toBeVisible();
    await expect(page.getByText(/Pago único · de por vida/)).toBeVisible();
  });

  test("La IA está detrás del muro Premium para usuarios sin acceso", async ({ page }) => {
    await seedProfile(page);
    await setupPremiumMocks(page);
    await page.goto("/ai");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("Preguntale")).toBeVisible();
    await expect(page.getByText("a tu Molino")).toBeVisible();
    await expect(page.getByText(/Incluye 50 preguntas/)).toBeVisible();
    await expect(page.getByRole("link", { name: /Ver la Lectura Pro/ })).toBeVisible();
  });

  test("Premium: lectura escrita + conversación IA · USD 8 · pago único · 50 consultas", async ({ page }) => {
    await page.goto("/premium");
    await page.waitForLoadState("networkidle");
    const checkoutBox = page.locator("#checkout-box");
    await expect(checkoutBox.getByText('$8', { exact: true })).toBeVisible({ timeout: 15000 });
    await expect(checkoutBox.getByText("Pago Único")).toBeVisible();
    await expect(checkoutBox.getByText(/por vida/i)).toBeVisible();
    await expect(page.getByText(/50 consultas/).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Pagar con Mercado Pago/ })).toBeVisible();
    await expect(page.getByText(/\$50/)).toHaveCount(0);
    await expect(page.getByText(/\$120/)).toHaveCount(0);
  });

  test("Sin anclaje de precio: la página Premium no compara con tarifas externas", async ({ page }) => {
    await page.goto("/premium");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(/El mapa y la síntesis calculada son gratis/)).toBeVisible();
    await expect(page.getByText(/conversación con tu mapa/)).toBeVisible();
    await expect(page.getByText(/\$50/)).toHaveCount(0);
    await expect(page.getByText(/\$120/)).toHaveCount(0);
    await expect(page.getByText("suscripción mensual")).toHaveCount(0);
  });

  // ─── Global Feedback for Coupon Activation ────────────────────

  test("VALEN: feedback global visible cuando el usuario está cerca del top de /lectura", async ({ page }) => {
    await seedProfile(page);
    await setupCouponActivationMocks(page);
    await page.goto("/lectura");
    await page.waitForLoadState("networkidle");
    await page.getByText("Tengo un cupón").click({ force: true });
    await page.waitForSelector("#coupon-code", { timeout: 10000 });
    const couponInput = page.locator("#coupon-code");
    await couponInput.fill("VALEN");
    await couponInput.press("Enter");
    await expect(page.getByText("Código aceptado")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Tu acceso Pro está activo.")).toBeVisible();
  });

  test("VALEN: feedback global visible cuando el usuario está scrolled profundo en /lectura", async ({ page }) => {
    await seedProfile(page);
    await setupCouponActivationMocks(page);
    await page.goto("/lectura");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await page.getByText("Tengo un cupón").click({ force: true });
    await page.waitForSelector("#coupon-code", { timeout: 10000 });
    const couponInput = page.locator("#coupon-code");
    await couponInput.fill("VALEN");
    await couponInput.press("Enter");
    await expect(page.getByRole("status").filter({ hasText: "Código aceptado" })).toBeVisible({ timeout: 15000 });
  });

  test("VALEN: el botón 'Ver mi lectura' aparece cuando la lectura está lista", async ({ page }) => {
    await seedProfile(page);
    await setupCouponActivationMocks(page);
    await page.goto("/lectura");
    await page.waitForLoadState("networkidle");
    await page.getByText("Tengo un cupón").click({ force: true });
    await page.waitForSelector("#coupon-code", { timeout: 10000 });
    const couponInput = page.locator("#coupon-code");
    await couponInput.fill("VALEN");
    await couponInput.press("Enter");
    await expect(page.getByText("Código aceptado")).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole("button", { name: /Ver mi lectura/ })).toBeVisible({ timeout: 30000 });
  });

  test("VALEN: el feedback persiste en el almacenamiento local", async ({ page }) => {
    await seedProfile(page);
    await setupCouponActivationMocks(page);
    await page.goto("/lectura");
    await page.waitForLoadState("networkidle");
    await page.getByText("Tengo un cupón").click({ force: true });
    await page.waitForSelector("#coupon-code", { timeout: 10000 });
    const couponInput = page.locator("#coupon-code");
    await couponInput.fill("VALEN");
    await couponInput.press("Enter");
    await expect(page.getByText("Código aceptado")).toBeVisible({ timeout: 15000 });
    const storedStep = await page.evaluate(() => {
      const raw = localStorage.getItem("molino.activation-step.v1");
      return raw ? JSON.parse(raw).step : null;
    });
    expect(["success", "preparing", "ready"]).toContain(storedStep);
  });

  test("VALEN: accesibilidad con teclado y lector de pantalla", async ({ page }) => {
    await seedProfile(page);
    await setupCouponActivationMocks(page);
    await page.goto("/lectura");
    await page.waitForLoadState("networkidle");
    await page.getByText("Tengo un cupón").click({ force: true });
    await page.waitForSelector("#coupon-code", { timeout: 10000 });
    const couponInput = page.locator("#coupon-code");
    await couponInput.fill("VALEN");
    await couponInput.press("Enter");
    const status = page.getByRole("status").filter({ hasText: "Código aceptado" });
    await expect(status).toBeVisible({ timeout: 15000 });
    await expect(status).toHaveAttribute("aria-live", "polite");
    await expect(status).toHaveAttribute("aria-atomic", "true");
  });

  test("VALEN: comportamiento móvil — feedback compacto sin obstrucción", async ({ page }) => {
    await seedProfile(page);
    await setupCouponActivationMocks(page);
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/lectura");
    await page.waitForLoadState("networkidle");
    await page.getByText("Tengo un cupón").click({ force: true });
    await page.waitForSelector("#coupon-code", { timeout: 10000 });
    const couponInput = page.locator("#coupon-code");
    await couponInput.fill("VALEN");
    await couponInput.press("Enter");
    await expect(page.getByRole("status").filter({ hasText: "Código aceptado" })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Código aceptado")).toBeVisible();
    const feedback = page.getByRole("status").filter({ hasText: "Código aceptado" }).first();
    const feedbackBox = await feedback.boundingBox();
    expect(feedbackBox).toBeTruthy();
    if (feedbackBox) {
      expect(feedbackBox.y + feedbackBox.height).toBeLessThanOrEqual(667);
      expect(feedbackBox.x + feedbackBox.width).toBeLessThanOrEqual(375);
    }
  });
});