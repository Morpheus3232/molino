const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') console.error('[ERR]', msg.text());
  });
  page.on('pageerror', err => {
    console.error('[PAGEERR]', err.message);
  });

  const result = { ok: true, errors: [] };

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(4000);
    result.homeTitle = await page.textContent('h1');
    result.hasCreateCta = (await page.locator('text=Crear mi perfil').count()) > 0;

    await page.click('text=Crear mi perfil');
    await page.waitForURL('**/onboarding');
    result.onboardingUrl = page.url();

    await page.fill('input[aria-label="Nombre o alias"]', 'Juan');
    await page.selectOption('select[aria-label="Mes"]', '04');
    await page.selectOption('select[aria-label="Año"]', '1992');
    await page.selectOption('select[aria-label="Día"]', '12');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);

    result.profileUrl = page.url();
    result.profileTitle = await page.textContent('h1');

    await page.goto('http://localhost:3000/profile', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    result.profileDirectTitle = await page.textContent('h1');
  } catch (err) {
    result.ok = false;
    result.errors.push(err.message);
  }

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
  process.exit(result.ok ? 0 : 1);
})();
