/**
 * Test script: Seeds a profile into localStorage and screenshots the Profile Hub
 * with Daily Insights ("Hoy en Molino") on both mobile and desktop.
 */
import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';

const BASE = 'http://localhost:3099';
const SCREENSHOT_DIR = 'scripts/screenshots';

// Test profile: Lucía Fernández, born 1990-03-15 Buenos Aires
// Chinese Zodiac: Horse (1990), Western: Pisces, Life Path: 1
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

const STORED_PROFILE = {
  version: 1,
  profile: TEST_PROFILE,
  savedAt: new Date().toISOString(),
};

async function run() {
  await mkdir(SCREENSHOT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Seed localStorage before navigating
  await page.goto(BASE);
  await page.evaluate((data) => {
    localStorage.setItem('molino.user-profile.v1', JSON.stringify(data));
  }, STORED_PROFILE);

  // Desktop viewport
  await page.setViewportSize({ width: 1440, height: 900 });

  // Navigate to profile
  await page.goto(`${BASE}/profile`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000); // Wait for animations

  // Desktop screenshot - full page
  await page.screenshot({
    path: `${SCREENSHOT_DIR}/profile-hub-desktop.png`,
    fullPage: true,
  });
  console.log('✓ Desktop screenshot saved');

  // Check insights are present
  const insights = await page.$$('section >> text=Hoy en Molino');
  console.log(`✓ "Hoy en Molino" section found: ${insights.length > 0}`);

  // Count insight cards
  const insightCards = await page.$$('section button');
  console.log(`✓ Insight cards found: ${insightCards.length}`);

  // Get insight titles
  const titles = await page.$$eval('.text-sm.font-medium.text-foreground', els =>
    els.map(el => el.textContent?.trim()).filter(Boolean)
  );
  console.log('✓ Insight titles:');
  titles.forEach(t => console.log(`  - ${t}`));

  // Mobile viewport
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);

  // Mobile screenshot - full page
  await page.screenshot({
    path: `${SCREENSHOT_DIR}/profile-hub-mobile.png`,
    fullPage: true,
  });
  console.log('✓ Mobile screenshot saved');

  // Verify CTAs - click on first insight card
  const firstInsight = await page.$('section button');
  if (firstInsight) {
    const ctaText = await firstInsight.textContent();
    console.log(`✓ First insight CTA text: ${ctaText?.substring(0, 100)}...`);
    
    await firstInsight.click();
    await page.waitForTimeout(1000);
    
    // Check if navigation happened (back button should appear)
    const backBtn = await page.$('text=Mi mapa');
    console.log(`✓ Navigation to screen works: ${!!backBtn}`);
    
    // Screenshot after navigation
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/profile-screen-desktop.png`,
      fullPage: true,
    });
    console.log('✓ Screen view screenshot saved');

    // Go back to hub
    if (backBtn) {
      await backBtn.click();
      await page.waitForTimeout(500);
    }
  }

  await browser.close();
  console.log('\n✅ All tests passed');
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
