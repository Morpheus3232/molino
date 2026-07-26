import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';

const BASE = 'http://localhost:3099';
const DIR = 'scripts/screenshots/audit';

const TEST_PROFILE = {
  name: "Lucía Fernández",
  birthDate: "1990-03-15",
  birthPlace: "Buenos Aires, Argentina",
  birthTime: "14:30",
  goal: "growth", interests: ["astrología", "meditación", "arte"],
  onboardingStep: 4, completedSections: ["identity", "preferences", "goals"],
  theme: "light", language: "es", notifications: true,
  lifePath: 1, sunSign: "Piscis",
  sunSignInfo: { sign: "Piscis", element: "Agua", modality: "Mutable", symbol: "♓" },
  chineseZodiac: "Caballo",
  chineseZodiacInfo: { animal: "Caballo", element: "Fuego", emoji: "🐴" },
  element: "Agua", modality: "Mutable",
  archetype: "El Visionario",
  archetypeInfo: { name: "El Visionario", color: "#4A6FA5", description: "Innovador", quote: "Creatividad es inteligencia divirtiéndose.", keywords: [], strengths: [], challenges: [] },
  cycles: { personalYear: 3, personalMonth: 7, personalDay: 5 },
  recommendations: { strengths: [], challenges: [], practices: [] },
};

async function scrollToBottom(page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= height; y += 400) {
    await page.evaluate((pos) => window.scrollTo(0, pos), y);
    await page.waitForTimeout(150);
  }
}

async function run() {
  await mkdir(DIR, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const stored = { version: 1, profile: TEST_PROFILE, savedAt: new Date().toISOString() };

  await page.goto(BASE);
  await page.evaluate((d) => localStorage.setItem('molino.user-profile.v1', JSON.stringify(d)), stored);

  // Desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE}/profile`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Click Identity
  const btn = await page.$('button:has-text("Tu Identidad")');
  if (btn) { await btn.click(); await page.waitForTimeout(1000); }

  // Scroll full page to trigger animations
  await scrollToBottom(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);

  // Desktop full page
  await page.screenshot({ path: `${DIR}/identity-padding-desktop.png`, fullPage: true });
  console.log('✓ Desktop full page');

  // Desktop mid — convergence + enhanced moment section
  await page.evaluate(() => {
    const el = document.querySelector('[id="panel-identity"]');
    if (el) el.scrollIntoView({ block: 'end' });
    window.scrollBy(0, -600);
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${DIR}/identity-padding-desktop-mid.png`, fullPage: false });
  console.log('✓ Desktop mid (convergence area)');

  // Mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await scrollToBottom(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);

  await page.screenshot({ path: `${DIR}/identity-padding-mobile.png`, fullPage: true });
  console.log('✓ Mobile full page');

  await browser.close();
  console.log('\n✅ Done');
}

run().catch(e => { console.error(e); process.exit(1); });
