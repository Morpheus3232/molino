const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

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
    summary: "Tu mapa no es una suma de sistemas: es una conversación entre ellos. Cada número, signo y ciclo que ya viste en las pantallas anteriores se vuelve significativo recién cuando se cruza con los otros.",
    alignment: "Que tu Camino de Vida 7 busque profundidad y tu expresión 11 demande acción pública no es una contradicción: es el motor de tu vida. Los períodos de retiro no te sacan del mundo, te preparan para volver a él con algo que decir.",
    timing: "Tu año personal 8 favorece el cierre de ciclos, pero tu mes 5 te pide ligereza. La recomendación es: decidí lo estructural, ejecutalo en dosis cortas y dejá espacio para improvisar.",
    strengths: ["Tu capacidad de síntesis convierte ruido en criterio.", "La tensión entre tu 7 y tu 11 te da una ventaja rara.", "Tu elemento metal te da límites claros."],
    tensions: ["Tu soledad natural (Camino 7) choca con tu necesidad de reconocimiento (Expresión 11)."],
    whatToConsider: ["Los meses de retiro no son pérdida de tiempo.", "Las decisiones tomadas desde la ansiedad tienden a desalinearse."],
    suggestedNextStep: "Antes de tu próxima decisión grande, escribí en una sola página qué querés y qué te asusta. Ese contraste es tu brújula actual.",
    confidence: "Alta",
    limitations: ["Interpretación generada con IA."],
    opening: "Tu lectura empieza donde tus sistemas dejan de hablar por separado. Lo que sigue no es un resumen de lo que ya viste: es lo que aparece cuando se miran juntos.",
    corePattern: { source: "Life Path 7 · Expresión 11", whyItMatters: "El 7 te da la distancia y el 11 la necesidad de impacto. Esa combinación explica por qué tu mejor trabajo suele nacer del silencio y terminar en voz alta." },
    howYouOperate: "Entrás en profundidad de a ráfagas, necesitás silencio para procesar y volvés con una síntesis que otros no ven. Cuando no respetás ese ciclo, la dispersión gana.",
    relationalNote: "Tu caballo de metal busca compañeros de aventura, pero tu Tierra fija necesita estabilidad. La afinidad real la encontrás con quienes combinan ambas cosas.",
    closingSynthesis: "No sos un sistema a descifrar: sos una conversación entre siete voces, y recién ahora empiezan a escucharse.",
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
  await page.route("**/api/paypal/capture-order", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ verified: true }) }));
  await page.route("**/api/mp/verify", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ verified: true }) }));
  await page.route("**/api/intelligence/interpret", async (r) => {
    await new Promise((res) => setTimeout(res, 2500));
    await r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(AI_READING) });
  });

  await page.goto("http://localhost:3000/profile?tab=intelligence&payment_status=approved&payment_method=paypal&token=PAYIDTEST123", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForSelector("#panel-intelligence", { timeout: 20000 });

  // Jump to the premium reading section area (chapter 07) WITHOUT triggering building capture
  await page.evaluate(async () => {
    const h2 = Array.from(document.querySelectorAll("#panel-intelligence h2")).find((n) => n.textContent.includes("Síntesis profunda"));
    if (h2) h2.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(1500);

  // Capture BuildingMolino state (fetch still pending 2.5s)
  const building = await page.evaluate(() => {
    const status = document.querySelector("[role='status']");
    const root = status ? status.closest("div") : null;
    const texts = [];
    document.querySelectorAll("h2, h3").forEach((el) => {
      const t = (el.textContent || "").trim();
      if (t && t.length > 3 && t.length < 80) texts.push(t);
    });
    return { status: status ? status.textContent.trim().slice(0, 120) : null, headings: texts.slice(0, 8) };
  });
  fs.writeFileSync(path.join(__dirname, "audit-metrics", "building-real.json"), JSON.stringify(building, null, 2));

  // Wait for reading to render fully
  await page.waitForTimeout(6000);
  const reading = await page.evaluate(() => {
    const panel = document.getElementById("panel-intelligence");
    const texts = [];
    panel.querySelectorAll("p, h3, h4").forEach((el) => {
      const t = (el.textContent || "").trim();
      if (!t || t.length < 4) return;
      const s = getComputedStyle(el);
      texts.push({
        t: t.slice(0, 70),
        font: s.fontFamily.split(",")[0],
        fs: s.fontSize,
        fw: s.fontWeight,
        color: s.color,
      });
    });
    return texts;
  });
  fs.writeFileSync(path.join(__dirname, "audit-metrics", "reading-real.json"), JSON.stringify(reading, null, 2));
  console.log("BUILDING:", JSON.stringify(building, null, 2));
  console.log("READING (first 14):");
  console.log(JSON.stringify(reading.slice(0, 14), null, 2));
  await browser.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
