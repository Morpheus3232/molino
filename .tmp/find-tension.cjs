const { chromium } = require("playwright");
const dates = ["1991-05-15","1983-02-10","1978-08-20","1992-12-01","1986-06-15","1975-04-05","1994-10-10","1981-03-17","1997-01-25","1979-09-09","1987-07-07","1993-11-11","1984-05-05","1976-02-29","1998-08-08","1982-10-10"];
async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  for (const d of dates) {
    const PROFILE = JSON.stringify({ version: 1, profile: { name: "Test", birthDate: d, birthPlace: "", goal: "life", interests: ["filosofia"], onboardingStep: 4, completedSections: ["identity","world","circle","intelligence"], theme: "light", language: "es", notifications: true, lifePath: 0, expressionNumber: 0, soulNumber: 0, personalityNumber: 0, sunSign: "", sunSignInfo: {}, chineseZodiac: "", chineseZodiacInfo: {}, element: "", modality: "", archetype: "", archetypeInfo: {} }, savedAt: new Date().toISOString() });
    await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
    await page.evaluate((p) => {
      window.localStorage.setItem("molino.user-profile.v1", p);
      window.localStorage.setItem("molino.context.v1", JSON.stringify({ language: "es", currency: "USD", timezone: "America/Buenos_Aires", locationSource: "onboarding", country: "Argentina", region: "Buenos Aires" }));
      window.localStorage.setItem("molino.discovery.v1", JSON.stringify({ version: 1, hasCompletedOnboarding: true, hasSeenIdentity: true, hasSeenWorld: true, hasSeenCircle: true, hasSeenIntelligence: true, lastVisitDate: "2026-08-02", visitCount: 3 }));
    }, PROFILE);
    await page.route("**/api/mp/check", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ premium: true }) }));
    await page.goto("http://localhost:3000/profile?tab=intelligence", { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(3000);
    const h2s = await page.evaluate(() => Array.from(document.querySelectorAll("#panel-intelligence h2")).map((h) => h.textContent.trim().slice(0, 50)));
    const has03 = h2s.some((h) => h.includes("03"));
    const has02 = h2s.some((h) => h.includes("02"));
    console.log(d, "03-tension=" + has03, "02-convergence=" + has02, h2s.slice(0, 4).join(" | "));
    if (has03) break;
  }
  await browser.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
