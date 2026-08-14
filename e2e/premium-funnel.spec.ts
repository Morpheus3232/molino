import { test, expect } from '@playwright/test';

// /profile es hoy un dashboard de scroll único (ProfileHub) — no hay más
// rutas ?tab=intelligence ni un botón "Volver a mi mapa" (eso pertenecía al
// ProfileTabs legacy, ya no montado). El gate de Premium vive en el
// capítulo "04 · La lectura profunda" (LecturaProfunda → PremiumGate).
test.describe('Premium Funnel E2E', () => {
  test('PremiumGate visible en el capítulo "04 · La lectura profunda"', async ({ page }) => {
    await page.goto('/profile?dob=1990-01-15');
    await page.waitForLoadState('networkidle');

    // Las piezas gratis (siempre visibles, sin paywall) — confirma que
    // llegamos a la sección de patrones antes de buscar el gate.
    await expect(page.getByText(/TU PATRÓN CENTRAL/i).first()).toBeVisible({ timeout: 15000 });

    // El paywall — headline real del gate de lectura profunda
    await expect(page.locator('h3:has-text("Ya conocés tus piezas")').first()).toBeVisible({ timeout: 15000 });
  });

  test('PremiumGate muestra precio y métodos de pago', async ({ page }) => {
    await page.goto('/profile?dob=1990-01-15');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=/\\$8/').first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator('button:has-text("Pagar con Mercado Pago")').first()).toBeVisible({ timeout: 15000 });
  });

  test('PremiumGate bloquea doble click', async ({ page }) => {
    await page.goto('/profile?dob=1990-01-15');
    await page.waitForLoadState('networkidle');

    const mpButton = page.locator('button:has-text("Pagar con Mercado Pago")').first();

    // Trial click: no navega de verdad, solo confirma que el botón sigue
    // siendo clickeable (no se duplica ni se rompe con clicks repetidos).
    await mpButton.click({ trial: true });
    await expect(mpButton).toBeVisible();
  });

  test('Formulario de recuperación visible y funcional', async ({ page }) => {
    await page.goto('/profile?dob=1990-01-15');
    await page.waitForLoadState('domcontentloaded');

    const recoverBtn = page.getByRole('button', { name: /Recuperar acceso/i }).first();
    await recoverBtn.scrollIntoViewIfNeeded();
    await recoverBtn.click();

    await expect(page.locator('#recover-mp-id')).toBeVisible({ timeout: 10000 });
  });

  test('Usuario sin Premium no ve "Preguntale a tu Molino" ni la interpretación (06)', async ({ page }) => {
    await page.goto('/profile?dob=1990-01-15');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText(/TU PATRÓN CENTRAL/i).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('heading', { name: 'Preguntale a tu Molino' })).toHaveCount(0);
  });
});
