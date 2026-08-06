const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

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
    alignment: "Que tu Camino de Vida 7 busque profundidad y tu expresión 11 demande acción pública no es una contradicción.",
    timing: "Tu año personal 8 favorece el cierre de ciclos, pero tu mes 5 te pide ligereza.",
    strengths: ["Tu capacidad de síntesis convierte ruido en criterio.", "La tensión entre tu 7 y tu 11 te da una ventaja rara.", "Tu elemento metal te da límites claros."],
    tensions: ["Tu soledad natural (Camino 7) choca con tu necesidad de reconocimiento (Expresión 11)."],
    whatToConsider: ["Los meses de retiro no son pérdida de tiempo.", "Las decisiones tomadas desde la ansiedad tienden a desalinearse."],
    suggestedNextStep: "Antes de tu próxima decisión grande, escribí en una sola página qué querés y qué te asusta.",
    confidence: "Alta",
    limitations: ["Interpretación generada con IA."],
    opening: "Tu lectura empieza donde tus sistemas dejan de hablar por separado.",
    corePattern: { source: "Life Path 7 · Expresión 11", whyItMatters: "El 7 te da la distancia y el 11 la necesidad de impacto." },
    howYouOperate: "Entrás en profundidad de a ráfagas.",
    relationalNote: "Tu caballo de metal busca compañeros de aventura.",
    closingSynthesis: "No sos un sistema a descifrar.",
  },
};

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
  await page.route("**/api/intelligence/interpret", async (r) => { await new Promise((res) => setTimeout(res, 300)); await r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(AI_READING) }); });

  await page.goto("http://localhost:3000/profile?tab=intelligence", { waitUntil: "networkidle", timeout: 60000 });
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 100)); }
  });
  await page.waitForTimeout(2000);

  const out = await page.evaluate(() => {
    const panel = document.getElementById("panel-intelligence");
    const res = { patternTitles: [], tensionTitles: [], ruleTexts: [], chapterTitles: [] };
    panel.querySelectorAll("h3").forEach((h) => {
      const s = getComputedStyle(h);
      res.patternTitles.push(`${h.textContent.trim().slice(0, 40)} | ${s.fontFamily.split(",")[0]} ${s.fontSize} ${s.textTransform}`);
    });
    panel.querySelectorAll("h2").forEach((h) => {
      const s = getComputedStyle(h);
      res.chapterTitles.push(`${h.textContent.trim().slice(0, 40)} | ${s.fontFamily.split(",")[0]} ${s.fontSize} ${s.textTransform}`);
    });
    // premium reading blocks
    const reading = panel.querySelectorAll("[class*='leading-[1.75]']");
    const sizes = {};
    reading.forEach((el) => { const s = getComputedStyle(el); sizes[s.fontSize] = (sizes[s.fontSize] || 0) + 1; });
    res.readingBodySizes = sizes;
    return res;
  });
  fs.writeFileSync(path.join(__dirname, "audit-metrics", "headings.json"), JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out, null, 2));
  await browser.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
