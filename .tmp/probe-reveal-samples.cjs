const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "audit-metrics");
fs.mkdirSync(OUT, { recursive: true });

const PROFILE = JSON.stringify({
  version: 1,
  profile: {
    name: "Valentina", birthDate: "1990-05-15", birthPlace: "", goal: "life",
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

const AI_READING = {
  fallback: { summary: "x", alignment: "", timing: "", strengths: [], tensions: [], whatToConsider: [], suggestedNextStep: "", confidence: "Media", limitations: [], opening: "", closingSynthesis: "" },
  ai: {
    summary: "Tu mapa no es una suma de sistemas: es una conversación entre ellos.",
    alignment: "x", timing: "x", strengths: ["x"], tensions: ["x"], whatToConsider: ["x"],
    suggestedNextStep: "x", confidence: "Alta", limitations: ["x"],
    opening: "Tu lectura empieza donde tus sistemas dejan de hablar por separado.",
    corePattern: { source: "x", whyItMatters: "x" },
    howYouOperate: "x", relationalNote: "x", closingSynthesis: "x",
  },
};

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message.slice(0, 120)));
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await page.evaluate(({ p, c }) => {
    window.localStorage.setItem("molino.user-profile.v1", p);
    window.localStorage.setItem("molino.context.v1", c);
    window.localStorage.setItem("molino.discovery.v1", JSON.stringify({ version: 1, hasCompletedOnboarding: true, hasSeenIdentity: true, hasSeenWorld: true, hasSeenCircle: true, hasSeenIntelligence: true, lastVisitDate: "2026-08-02", visitCount: 3 }));
  }, { p: PROFILE, c: CONTEXT });
  await page.route("**/api/mp/check", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ premium: true }) }));
  await page.route("**/api/paypal/capture-order", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ verified: true }) }));
  await page.route("**/api/mp/verify", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ verified: true }) }));
  await page.route("**/api/intelligence/interpret", async (r) => {
    await new Promise((res) => setTimeout(res, 4500));
    await r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(AI_READING) });
  });

  await page.goto("http://localhost:3000/profile?tab=intelligence&payment_status=approved&payment_method=paypal&token=PAYIDTEST123", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForSelector("#panel-intelligence", { timeout: 20000 });
  await page.evaluate(() => {
    const h2 = Array.from(document.querySelectorAll("#panel-intelligence h2")).find((n) => n.textContent.includes("Síntesis profunda"));
    if (h2) h2.scrollIntoView({ block: "start" });
  });

  const samples = [];
  for (let i = 0; i < 30; i++) {
    await page.waitForTimeout(500);
    const s = await page.evaluate(() => {
      const t = document.body.innerText;
      const titleMatch = t.match(/El mapa de [^\n]*/);
      return {
        building: t.includes("En proceso") || t.includes("Tu síntesis está lista"),
        portada: t.includes("Lectura completa") || !!titleMatch,
        reading: t.includes("Tu lectura empieza donde"),
        title: titleMatch ? titleMatch[0] : "",
      };
    });
    const marks = [];
    if (s.building) marks.push("BUILDING");
    if (s.portada) marks.push("PORTADA");
    if (s.reading) marks.push("READING");
    if (marks.length) samples.push(`${(i * 0.5).toFixed(1)}s → ${marks.join(" + ")}${s.title ? ` [${s.title}]` : ""}`);
  }
  console.log(samples.join("\n"));
  console.log("ERRORS:", errors.length ? errors.join(" ;; ") : "none");
  fs.writeFileSync(path.join(OUT, "reveal-samples.json"), JSON.stringify({ samples, errors }, null, 2));
  await browser.close();
}
main().catch((e) => { console.error("FATAL:", e); process.exit(1); });
