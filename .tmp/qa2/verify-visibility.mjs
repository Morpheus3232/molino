import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const OUT = '.tmp/qa2';

async function setup(page) {
  await page.goto(BASE + '/onboarding', { waitUntil: 'networkidle' });
  await page.getByLabel('Día').fill('15');
  await page.getByLabel('Mes').fill('06');
  await page.getByLabel('Año').fill('1990');
  await page.getByRole('button', { name: /continuar/i }).click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: /ver mi mapa/i }).click();
  await page.waitForURL('**/profile**', { timeout: 15000 });
  await page.waitForTimeout(1500);
}

// The exact adversarial pattern that exposed the bug: scroll all the way down
// FAST (no generous waits), then jump straight back to top (like the app's own
// scrollTo(0,0) on tab change), then screenshot without re-scrolling down again.
async function stressScrollUpDown(page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  let y = 0;
  while (y < height) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(80); // fast, adversarial
    y += 900;
  }
  await page.evaluate(() => window.scrollTo(0, 0)); // jump straight back to top
  await page.waitForTimeout(200);
}

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + String(e)));

await setup(page);

for (const tab of ['world', 'circle', 'intelligence']) {
  await page.goto(`${BASE}/profile?tab=${tab}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await stressScrollUpDown(page);

  // Now scroll back down fully (simulating a returning user) and take the
  // screenshot WITHOUT jumping back to top, to check final settled state.
  const height = await page.evaluate(() => document.body.scrollHeight);
  await page.evaluate((h) => window.scrollTo(0, h), height);
  await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);

  await page.screenshot({ path: `${OUT}/${tab}-after-stress.png`, fullPage: true });

  // Check for any element stuck at opacity: 0 within motion-controlled content
  const stuck = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('[style*="opacity: 0"]'));
    return all
      .filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 20 && rect.height > 10; // ignore decorative 0-size els
      })
      .map(el => ({
        tag: el.tagName,
        text: (el.textContent || '').trim().slice(0, 80),
        class: el.className?.toString().slice(0, 60),
      }));
  });
  console.log(`--- ${tab} ---`);
  console.log('stuck-opacity-0 elements with real size:', JSON.stringify(stuck, null, 2));
}

if (errors.length) console.log('ERRORS:\n' + errors.join('\n'));
else console.log('NO PAGE ERRORS');

await browser.close();
