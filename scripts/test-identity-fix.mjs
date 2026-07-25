/**
 * Test: IdentityScreen — scrolls through entire page to trigger whileInView animations,
 * then captures screenshots at key sections.
 */
import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';

const BASE = 'http://localhost:3099';
const DIR = 'scripts/screenshots';

const TEST_PROFILE = {
  name: "Lucía Fernández",
  birthDate: "1990-03-15",
  birthPlace: "Buenos Aires, Argentina",
  birthTime: "14:30",
  goal: "growth",
  interests: ["astrología", "meditación", "arte"],
  onboardingStep: 4,
  completedSections: ["identity", "preferences", "goals"],
  theme: "light",
  language: "es",
  notifications: true,
  lifePath: 1,
  sunSign: "Piscis",
  sunSignInfo: { sign: "Piscis", element: "Agua", modality: "Mutable", symbol: "♓" },
  chineseZodiac: "Caballo",
  chineseZodiacInfo: { animal: "Caballo", element: "Fuego", emoji: "🐴" },
  element: "Agua",
  modality: "Mutable",
  archetype: "El Visionario",
  archetypeInfo: {
    name: "El Visionario",
    color: "#4A6FA5",
    description: "Un espíritu innovador que busca nuevas posibilidades y caminos.",
    quote: "La creatividad es la inteligencia divirtiéndose.",
    keywords: ["innovación", "visión", "intuición"],
    strengths: ["Creatividad", "Intuición", "Adaptabilidad", "Visionario"],
    challenges: ["Impaciencia", "Idealismo extremo", "Inconstancia"],
  },
  cycles: { personalYear: 3, personalMonth: 7, personalDay: 5 },
  recommendations: {
    strengths: ["Creatividad", "Intuición", "Adaptabilidad", "Visionario"],
    challenges: ["Impaciencia", "Idealismo extremo", "Inconstancia"],
    practices: [
      "Registrá 3 logros pequeños por semana.",
      "Dedicá 10 minutos a respirar o escribir sin filtro.",
      "Elegí una palabra foco para el mes y revisala cada domingo.",
    ],
  },
};

const STORED = { version: 1, profile: TEST_PROFILE, savedAt: new Date().toISOString() };

/** Scroll incrementally to trigger all whileInView animations */
async function scrollToBottom(page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  const step = 400;
  for (let y = 0; y <= height; y += step) {
    await page.evaluate((pos) => window.scrollTo(0, pos), y);
    await page.waitForTimeout(200);
  }
  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
}

async function run() {
  await mkdir(DIR, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  // Seed localStorage
  await page.goto(BASE);
  await page.evaluate((d) => localStorage.setItem('molino.user-profile.v1', JSON.stringify(d)), STORED);

  // Desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE}/profile`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Click into Identity
  const identityBtn = await page.$('button:has-text("Tu Identidad")');
  if (identityBtn) {
    await identityBtn.click();
    await page.waitForTimeout(1000);
  }

  // Scroll through entire page to trigger all whileInView animations
  await scrollToBottom(page);

  // Screenshot top of Identity (hero + cards)
  await page.screenshot({ path: `${DIR}/identity-top-desktop.png`, fullPage: false });
  console.log('✓ Identity top desktop');

  // Scroll to "Tu código personal" section
  await page.evaluate(() => {
    const sections = document.querySelectorAll('section');
    for (const s of sections) {
      if (s.textContent?.includes('código personal')) {
        s.scrollIntoView({ block: 'start' });
        break;
      }
    }
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${DIR}/identity-code-desktop.png`, fullPage: false });
  console.log('✓ Identity code section desktop');

  // Full page screenshot (all animations triggered)
  await page.screenshot({ path: `${DIR}/identity-full-desktop.png`, fullPage: true });
  console.log('✓ Identity full desktop');

  // Mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await scrollToBottom(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);

  await page.screenshot({ path: `${DIR}/identity-top-mobile.png`, fullPage: false });
  console.log('✓ Identity top mobile');

  // Full page mobile
  await page.screenshot({ path: `${DIR}/identity-full-mobile.png`, fullPage: true });
  console.log('✓ Identity full mobile');

  await browser.close();
  console.log('\n✅ Done');
}

run().catch(e => { console.error(e); process.exit(1); });
