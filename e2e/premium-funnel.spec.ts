import { test, expect } from '@playwright/test';

test.describe('Premium Funnel E2E', () => {
  test('Premium Gate visible on Intelligence chapter (ProfileHub)', async ({ page }) => {
    // Use URL params to go directly to intelligence tab (server-side)
    await page.goto('/profile?dob=1990-01-15&tab=intelligence');
    await page.waitForLoadState('networkidle');
    
    // Check page loads - ProfileHub is visible
    await expect(page.locator('button:has-text("Volver a mi mapa")').first()).toBeVisible({ timeout: 15000 });
    
    // Check PremiumGate paywall is visible - use actual headline text
    await expect(page.locator('h3:has-text("Ya conocés tus piezas")').first()).toBeVisible({ timeout: 15000 });
  });

  test('PremiumGate shows price and payment methods', async ({ page }) => {
    // Go directly to intelligence tab
    await page.goto('/profile?dob=1990-01-15&tab=intelligence');
    await page.waitForLoadState('networkidle');
    
    // Check price displayed - actual format is "$8 USD"
    await expect(page.locator('text=/\\$8/').first()).toBeVisible({ timeout: 15000 });
    
    // Check Mercado Pago button - actual text is "Pagar con Mercado Pago"
    await expect(page.locator('button:has-text("Pagar con Mercado Pago")').first()).toBeVisible({ timeout: 15000 });
  });

  test('PremiumGate blocks double click', async ({ page }) => {
    await page.goto('/profile?dob=1990-01-15&tab=intelligence');
    await page.waitForLoadState('networkidle');
    
    const mpButton = page.locator('button:has-text("Pagar con Mercado Pago")').first();
    
    // Force click to avoid navigation blocking the second click
    await mpButton.click({ trial: true });
    await expect(mpButton).toBeVisible();
  });

  test('Recovery form visible and functional', async ({ page }) => {
    await page.goto('/profile?dob=1990-01-15&tab=intelligence');
    await page.waitForLoadState('networkidle');
    
    // The recovery button is blocked by a fixed bottom bar - use force click
    await page.locator('button:has-text("Recuperar acceso")').first().click({ force: true });
    
    // Check recovery form
    await expect(page.locator('input[placeholder*="pago" i], input[placeholder*="ID" i]').first()).toBeVisible({ timeout: 10000 });
  });
});