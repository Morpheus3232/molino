const { chromium } = require("playwright");

const PROFILE = JSON.stringify({
  version: 1,
  profile: {
    name: "Valentina", birthDate: "1985-01-01", birthPlace: "", goal: "life",
    interests: ["filosofia", "arte"], onboardingStep: 4,
    completedSections: ["identity", "world", "circle", "intelligence"],
    theme: "light", language: "es", notifications: true,
    lifePath: 7, expressionNumber: 11, soulNumber: 5, personalityNumber: 2,
    sunSign: "Tauro",
    sunSignInfo: { sign: "Tauro", element: "Tierra", modality: "Fijo", symbol: "♉" },
    chineseZodiac: "caballo",
    chineseZodiacInfo: { animal: "caballo", element: "metal", emoji: "🐴" },
    element: "metal", modality: "Fijo", archetype: "El Sabio",
    archetypeInfo: { name: "El Sabio", color: "#F5C77E", description: "El conocimiento como camino", quote: "El que sabe, observa.", keywords: ["analisis", "verdad"], strengths: ["perspicacia"], challenges: ["soledad"] },
  },
  savedAt: new Date().toISOString(),
});
const CONTEXT = JSON.stringify({ language: "es", currency: "USD", timezone: "America/Buenos_Aires", locationSource: "onboarding", country: "Argentina", region: "Buenos Aires" });

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on("console", (m) => { if (m.type() === "error") console.log("CONSOLE ERR:", m.text().slice(0, 200)); });
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await page.evaluate(({ p, c }) => {
    window.localStorage.setItem("molino.user-profile.v1", p);
    window.localStorage.setItem("molino.context.v1", c);
    window.localStorage.setItem("molino.discovery.v1", JSON.stringify({ version: 1, hasCompletedOnboarding: true, hasSeenIdentity: true, hasSeenWorld: true, hasSeenCircle: true, hasSeenIntelligence: true, lastVisitDate: "2026-08-02", visitCount: 3 }));
  }, { p: PROFILE, c: CONTEXT });
  await page.route("**/api/mp/check", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ premium: true }) }));

  await page.goto("http://localhost:3000/profile?tab=intelligence", { waitUntil: "load", timeout: 60000 });
  // wait until panel exists
  await page.waitForSelector("#panel-intelligence", { timeout: 20000 }).catch(() => console.log("PANEL NOT FOUND"));
  const url = page.url();
  console.log("URL:", url);
  const title = await page.title();
  console.log("TITLE:", title);
  // Check what section contains the mystery heading if panel exists
  const info = await page.evaluate(() => {
    const panel = document.getElementById("panel-intelligence");
    if (!panel) {
      return { panel: null, bodyText: document.body.innerText.slice(0, 400) };
    }
    const h2s = Array.from(panel.querySelectorAll("h2")).map((h) => h.textContent.trim().slice(0, 60));
    const h3s = Array.from(panel.querySelectorAll("h3")).map((h) => {
      const sec = h.closest("section");
      return { text: h.textContent.trim().slice(0, 80), inSectionH2: sec?.querySelector("h2")?.textContent.trim().slice(0, 50) ?? null };
    });
    return { panel: true, h2s, h3s };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
