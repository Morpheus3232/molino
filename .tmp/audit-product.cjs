/**
 * Product audit probe: walks the premium flow as a paying user and captures
 * DOM metrics, content text, sequence timing, and structural analysis.
 *
 * Usage: node .tmp/audit-product.cjs
 */
const { chromium } = require('playwright');
const { readFileSync, existsSync, writeFileSync } = require('fs');

function loadEnvLocal() {
  const path = '.env.local';
  if (!existsSync(path)) return {};
  const env = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    env[match[1]] = match[2].replace(/^"(.*)"$/, '$1');
  }
  return env;
}

const env = loadEnvLocal();
const COUPON = env.PREMIUM_COUPON;
const BASE = 'http://localhost:3000';

const TEST_PROFILES = [
  { name: 'Valentina', dob: '1992-12-01', label: 'Tension+Convergence' },
  { name: 'Martín', dob: '1990-03-15', label: 'Standard profile' },
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const results = {};

  for (const profile of TEST_PROFILES) {
    console.log(`\n=== PROFILE: ${profile.name} (${profile.dob}) — ${profile.label} ===`);
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      reducedMotion: 'reduce',
    });
    const page = await ctx.newPage();

    // Step 1: Navigate to intelligence tab (locked state)
    const url = `${BASE}/profile?dob=${profile.dob}&name=${profile.name}&tab=intelligence`;
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Step 2: Scroll to paywall section 07 and capture it
    const paywallSelector = '#panel-intelligence section:has(h2:text("Síntesis profunda"))';
    const paywallEl = page.locator(paywallSelector).first();
    await paywallEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const paywallY = await page.evaluate(() => {
      const el = document.querySelector('#panel-intelligence section:nth-of-type(7)');
      return el ? el.getBoundingClientRect().top + window.scrollY : 0;
    });
    console.log(`\n--- PAYWALL LOCATION ---`);
    console.log(`Section 07 top offset from page top: ${Math.round(paywallY)}px`);

    // Capture paywall content
    const paywallText = await page.evaluate(() => {
      const sections = document.querySelectorAll('#panel-intelligence section');
      const s7 = sections[6]; // 0-indexed, section 07
      if (!s7) return null;
      return {
        eyebrow: s7.querySelector('[class*="text-accent"]')?.textContent?.trim() || '',
        headline: s7.querySelector('h3')?.textContent?.trim() || '',
        headlineLine2: s7.querySelectorAll('h3')[0]?.textContent?.trim() || '',
        body: s7.querySelectorAll('p')[2]?.textContent?.trim() || '',
        whatYouGetLabel: s7.querySelector('[class*="uppercase"][class*="tracking"]')?.textContent?.trim() || '',
        bulletPoints: [...s7.querySelectorAll('li')].map(li => li.textContent?.trim() || ''),
        price: s7.querySelector('[class*="text-6xl"], [class*="text-7xl"]')?.textContent?.trim() || '',
        priceSuffix: s7.querySelectorAll('span')[6]?.textContent?.trim() || '',
        priceNote: '',
        ctaButtons: [...s7.querySelectorAll('button, [role="button"]')].map(b => ({
          text: b.textContent?.trim() || '',
          variant: b.className.includes('accent') ? 'accent' : 'secondary',
        })),
        fullText: s7.textContent?.replace(/\s+/g, ' ').trim().slice(0, 1500) || '',
      };
    });
    console.log('\n--- PAYWALL COPY ---');
    console.log(JSON.stringify(paywallText, null, 2));

    // Step 3: Count free sections vs paid (total sections, heading hierarchy)
    const structure = await page.evaluate(() => {
      const sections = document.querySelectorAll('#panel-intelligence section');
      const headings = [...document.querySelectorAll('#panel-intelligence h1, #panel-intelligence h2, #panel-intelligence h3')].map(h => ({
        tag: h.tagName,
        text: h.textContent?.trim().slice(0, 80),
        y: Math.round(h.getBoundingClientRect().top + window.scrollY),
      }));
      return {
        totalSections: sections.length,
        headings,
        pageHeight: document.documentElement.scrollHeight,
      };
    });
    console.log('\n--- PAGE STRUCTURE ---');
    console.log(`Total sections in intelligence: ${structure.totalSections}`);
    console.log(`Page height: ${structure.pageHeight}px`);
    console.log('Headings (in order):');
    structure.headings.forEach(h => {
      console.log(`  ${h.tag} [y=${h.y}] ${h.text}`);
    });

    // Step 4: Apply coupon via API
    console.log('\n--- UNLOCKING PREMIUM ---');
    const unlockResp = await page.evaluate(async (coupon) => {
      const res = await fetch('/api/mp/coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coupon,
          name: document.querySelector('input[placeholder*="Mercado Pago"], input[placeholder*="cupón"]')?.closest('form')?.querySelector('input[type="text"]')?.value || '',
          birthDate: new URLSearchParams(window.location.search).get('dob') || '',
        }),
      });
      return await res.json();
    }, COUPON);
    console.log('Coupon response:', JSON.stringify(unlockResp));

    // Step 5: Now apply coupon through the UI flow
    await page.evaluate(async (coupon) => {
      const dob = new URLSearchParams(window.location.search).get('dob') || '';
      const res = await fetch('/api/mp/coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coupon, birthDate: dob }),
      });
      return await res.json();
    }, COUPON);

    // Reload to trigger unlock
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    // Scroll to the premium section and capture the unlock state
    await paywallEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Capture what the user sees after unlock
    const postUnlock = await page.evaluate(() => {
      const sections = document.querySelectorAll('#panel-intelligence section');
      const s7 = sections[6];
      return {
        buildingVisible: !!document.querySelector('[role="status"]'),
        buildingText: document.querySelector('[role="status"]')?.textContent?.trim().slice(0, 200) || '',
        coverVisible: s7 ? !!s7.querySelector('h3') : false,
        s7Text: s7?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 2000) || '',
        s7Height: s7 ? s7.scrollHeight : 0,
      };
    });
    console.log('\n--- POST-UNLOCK STATE ---');
    console.log(JSON.stringify(postUnlock, null, 2));

    // Wait for the full reading to load (BuildingMolino → Reveal → Content)
    await page.waitForTimeout(8000);

    // Step 6: Capture the full reading content
    const reading = await page.evaluate(() => {
      const sections = document.querySelectorAll('#panel-intelligence section');
      const s7 = sections[6];
      if (!s7) return null;

      // Find the MolinoInterpretation content
      const blocks = s7.querySelectorAll('[class*="space-y"]');
      const readingBlock = blocks.length > 0 ? blocks[blocks.length - 1] : null;

      // Get all text sections within the reading
      const textSections = [];
      const monoLabels = s7.querySelectorAll('[class*="font-mono"][class*="uppercase"]');
      monoLabels.forEach(el => {
        textSections.push({
          label: el.textContent?.trim() || '',
          content: el.nextElementSibling?.textContent?.trim() || '',
        });
      });

      // Count word count of the full reading
      const readingText = readingBlock?.textContent?.replace(/\s+/g, ' ').trim() || '';
      const wordCount = readingText.split(/\s+/).length;

      // Check if the "Confidence" line exists
      const confidenceText = s7.querySelector('[class*="text-muted/50"]')?.textContent?.trim() || '';

      // Check for CTA/share/shareable elements after the reading
      const shareSection = [...sections].find(s => {
        const h2 = s.querySelector('h2');
        return h2?.textContent?.includes('Compartir');
      });

      // Check the last section
      const lastSection = sections[sections.length - 1];
      const lastSectionTitle = lastSection?.querySelector('h2')?.textContent?.trim() || '';

      // Check for "Desbloqueaste" banner
      const unlockBanner = s7.querySelector('[class*="border-b"]')?.textContent?.trim() || '';

      return {
        textSections,
        wordCount,
        confidenceText,
        shareSectionExists: !!shareSection,
        lastSectionTitle,
        unlockBanner: unlockBanner.slice(0, 200),
        readingHTML: s7.innerHTML.slice(0, 500),
        fullS7Text: s7.textContent?.replace(/\s+/g, ' ').trim() || '',
      };
    });
    console.log('\n--- READING CONTENT ---');
    console.log(JSON.stringify(reading, null, 2));

    // Step 7: Measure section ordering within reading
    const sectionOrder = await page.evaluate(() => {
      const sections = document.querySelectorAll('#panel-intelligence section');
      const s7 = sections[6];
      if (!s7) return [];

      const monoLabels = s7.querySelectorAll('[class*="font-mono"][class*="uppercase"]');
      return [...monoLabels].map(el => el.textContent?.trim()).filter(Boolean);
    });
    console.log('\n--- SECTION ORDER IN READING ---');
    console.log(sectionOrder);

    // Step 8: What comes AFTER the premium reading?
    const afterReading = await page.evaluate(() => {
      const sections = document.querySelectorAll('#panel-intelligence section');
      const sectionTitles = [...sections].map((s, i) => ({
        index: i + 1,
        title: s.querySelector('h1, h2')?.textContent?.trim().slice(0, 60) || 'no title',
        height: s.scrollHeight,
      }));
      return sectionTitles;
    });
    console.log('\n--- ALL SECTIONS (AFTER READING) ---');
    console.log(JSON.stringify(afterReading, null, 2));

    // Step 9: Check the reading DOM hierarchy
    const readingDOM = await page.evaluate(() => {
      const sections = document.querySelectorAll('#panel-intelligence section');
      const s7 = sections[6];
      if (!s7) return null;

      const headings = s7.querySelectorAll('h1, h2, h3, h4');
      const blockquote = s7.querySelector('blockquote');
      const lists = s7.querySelectorAll('ul, ol');
      const links = s7.querySelectorAll('a');
      const buttons = s7.querySelectorAll('button');

      return {
        headingCount: headings.length,
        headingTexts: [...headings].map(h => ({ tag: h.tagName, text: h.textContent?.trim().slice(0, 80) })),
        hasBlockquote: !!blockquote,
        blockquoteText: blockquote?.textContent?.trim().slice(0, 200) || '',
        listCount: lists.length,
        linkCount: links.length,
        linkTexts: [...links].map(l => l.textContent?.trim().slice(0, 50)),
        buttonCount: buttons.length,
        buttonTexts: [...buttons].map(b => b.textContent?.trim().slice(0, 50)),
      };
    });
    console.log('\n--- READING DOM STRUCTURE ---');
    console.log(JSON.stringify(readingDOM, null, 2));

    // Step 10: Check for mobile view
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(1000);
    await paywallEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const mobileView = await page.evaluate(() => {
      const sections = document.querySelectorAll('#panel-intelligence section');
      const s7 = sections[6];
      return {
        s7Width: s7 ? s7.getBoundingClientRect().width : 0,
        s7Visible: s7 ? s7.getBoundingClientRect().top >= 0 : false,
        textOverflows: s7 ? s7.scrollWidth > s7.getBoundingClientRect().width : false,
        pageWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
      };
    });
    console.log('\n--- MOBILE VIEW ---');
    console.log(JSON.stringify(mobileView, null, 2));

    results[profile.name] = {
      paywall: paywallText,
      structure,
      reading,
      sectionOrder,
      afterReading,
      readingDOM,
      mobileView,
    };

    await ctx.close();
  }

  await browser.close();

  writeFileSync('.tmp/audit-product-output.json', JSON.stringify(results, null, 2));
  console.log('\n\nResults written to .tmp/audit-product-output.json');
}

main().catch(err => { console.error(err); process.exit(1); });
