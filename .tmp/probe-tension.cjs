const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "audit-metrics");
fs.mkdirSync(OUT, { recursive: true });

const PROFILE = JSON.stringify({
  version: 1,
  profile: {
    name: "Valentina", birthDate: "1992-12-01", birthPlace: "", goal: "life",
    interests: ["filosofia", "arte"], onboardingStep: 4,
    completedSections: ["identity", "world", "circle", "intelligence"],
    theme: "light", language: "es", notifications: true,
    lifePath: 7, expressionNumber: 8, soulNumber: 7, personalityNumber: 1,
    sunSign: "Sagitario",
    sunSignInfo: { sign: "Sagitario", element: "Fuego", modality: "Mutable", symbol: "♐" },
    chineseZodiac: "Mono",
    chineseZodiacInfo: { animal: "Mono", element: "Agua", emoji: "🐵" },
    element: "Fuego", modality: "Mutable", archetype: "El Investigador",
    archetypeInfo: { name: "El Investigador", keywords: ["Curioso", "Analítico", "Observador"], strengths: ["Análisis", "Sabiduría", "Observación", "Intuición"], challenges: ["Aislamiento", "Escepticismo", "Perfeccionismo"] },
  },
  savedAt: new Date().toISOString(),
});
const CONTEXT = JSON.stringify({ language: "es", currency: "USD", timezone: "America/Buenos_Aires", locationSource: "onboarding", country: "Argentina", region: "Buenos Aires" });

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await page.evaluate(({ p, c }) => {
    window.localStorage.setItem("molino.user-profile.v1", p);
    window.localStorage.setItem("molino.context.v1", c);
    window.localStorage.setItem("molino.discovery.v1", JSON.stringify({ version: 1, hasCompletedOnboarding: true, hasSeenIdentity: true, hasSeenWorld: true, hasSeenCircle: true, hasSeenIntelligence: true, lastVisitDate: "2026-08-02", visitCount: 3 }));
  }, { p: PROFILE, c: CONTEXT });
  await page.route("**/api/mp/check", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ premium: true }) }));
  await page.goto("http://localhost:3000/profile?tab=intelligence", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForSelector("#panel-intelligence", { timeout: 20000 });
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 100)); }
  });
  await page.waitForTimeout(1500);

  const data = await page.evaluate(() => {
    const panel = document.getElementById("panel-intelligence");
    const res = { sections: [] };
    panel.querySelectorAll("section").forEach((sec) => {
      const h2 = sec.querySelector("h2");
      const h3 = sec.querySelector("h3");
      const s = getComputedStyle(sec);
      const firstH3 = sec.querySelector("h3");
      res.sections.push({
        h2: h2 ? h2.textContent.trim().slice(0, 60) : null,
        pt: parseFloat(s.paddingTop),
        pb: parseFloat(s.paddingBottom),
        h3s: Array.from(sec.querySelectorAll("h3")).map((h) => {
          const hs = getComputedStyle(h);
          return `${h.textContent.trim().slice(0, 40)} | ${hs.fontFamily.split(",")[0]} ${hs.fontSize} ${hs.textTransform}`;
        }),
        bodies: Array.from(sec.querySelectorAll("p")).slice(0, 2).map((p) => {
          const ps = getComputedStyle(p);
          return `${(p.textContent || "").trim().slice(0, 45)} | ${ps.fontFamily.split(",")[0]} ${ps.fontSize}`;
        }),
      });
    });
    return res;
  });
  fs.writeFileSync(path.join(OUT, "tension-profile.json"), JSON.stringify(data, null, 2));
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
