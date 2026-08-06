const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "audit-shots");
fs.mkdirSync(OUT, { recursive: true });

const PROFILE = JSON.stringify({
  version: 1,
  profile: {
    name: "Valentina",
    birthDate: "1990-05-15",
    birthPlace: "",
    goal: "life",
    interests: ["filosofia", "arte"],
    onboardingStep: 4,
    completedSections: ["identity", "world", "circle", "intelligence"],
    theme: "light",
    language: "es",
    notifications: true,
    lifePath: 7,
    expressionNumber: 11,
    soulNumber: 5,
    personalityNumber: 2,
    sunSign: "Tauro",
    sunSignInfo: { sign: "Tauro", element: "Tierra", modality: "Fijo", symbol: "♉" },
    chineseZodiac: "caballo",
    chineseZodiacInfo: { animal: "caballo", element: "metal", emoji: "🐴" },
    element: "metal",
    modality: "Fijo",
    archetype: "El Sabio",
    archetypeInfo: { name: "El Sabio", color: "#F5C77E", description: "El conocimiento como camino", quote: "El que sabe, observa.", keywords: ["analisis", "verdad"], strengths: ["perspicacia"], challenges: ["soledad"] },
  },
  savedAt: new Date().toISOString(),
});

const CONTEXT = JSON.stringify({
  language: "es", currency: "USD", timezone: "America/Buenos_Aires", locationSource: "onboarding", country: "Argentina", region: "Buenos Aires",
});

const AI_READING = {
  fallback: {
    summary: "Lectura local", alignment: "", timing: "", strengths: [], tensions: [],
    whatToConsider: [], suggestedNextStep: "", confidence: "Media",
    limitations: ["Interpretación generada con IA."],
    opening: "",
    closingSynthesis: "",
  },
  ai: {
    summary: "Tu mapa no es una suma de sistemas: es una conversación entre ellos. Cada número, signo y ciclo que ya viste en las pantallas anteriores se vuelve significativo recién cuando se cruza con los otros.",
    alignment: "Que tu Camino de Vida 7 busque profundidad y tu expresión 11 demande acción pública no es una contradicción: es el motor de tu vida. Los períodos de retiro no te sacan del mundo, te preparan para volver a él con algo que decir.",
    timing: "Tu año personal 8 favorece el cierre de ciclos y las decisiones estructurales, pero tu mes 5 te pide ligereza. La recomendación es: decidí lo estructural, ejecutalo en dosis cortas y dejá espacio para improvisar.",
    strengths: [
      "Tu capacidad de síntesis convierte ruido en criterio.",
      "La tensión entre tu 7 y tu 11 te da una ventaja rara: podés entrar en profundidad y salir a comunicarlo.",
      "Tu elemento metal te da límites claros, algo que tu dispersión interna necesita para canalizarse.",
    ],
    tensions: [
      "Tu soledad natural (Camino 7) choca con tu necesidad de reconocimiento (Expresión 11).",
      "Tu deseo de certezas (metal) convive con un alma que pide movimiento (Alma 5).",
    ],
    whatToConsider: [
      "Los meses de retiro no son pérdida de tiempo: son tu mejor inversión.",
      "Las decisiones tomadas desde la ansiedad de aprobación tienden a desalinearse con tu camino.",
    ],
    suggestedNextStep: "Antes de tu próxima decisión grande, escribí en una sola página qué querés y qué te asusta. Ese contraste es tu brújula actual.",
    confidence: "Alta",
    limitations: ["Interpretación generada con IA."],
    opening: "Tu lectura empieza donde tus sistemas dejan de hablar por separado. Lo que sigue no es un resumen de lo que ya viste: es lo que aparece cuando se miran juntos.",
    corePattern: {
      source: "Life Path 7 · Expresión 11",
      whyItMatters: "El 7 te da la distancia y el 11 la necesidad de impacto. Esa combinación explica por qué tu mejor trabajo suele nacer del silencio y terminar en voz alta.",
    },
    howYouOperate: "Entrás en profundidad de a ráfagas, necesitás silencio para procesar y volvés con una síntesis que otros no ven. Cuando no respetás ese ciclo, la dispersión gana.",
    relationalNote: "Tu caballo de metal busca compañeros de aventura, pero tu Tierra fija necesita estabilidad. La afinidad real la encontrás con quienes combinan ambas cosas.",
    closingSynthesis: "No sos un sistema a descifrar: sos una conversación entre siete voces, y recién ahora empiezan a escucharse.",
  },
};

async function seed(page) {
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ p, c }) => {
      window.localStorage.setItem("molino.user-profile.v1", p);
      window.localStorage.setItem("molino.context.v1", c);
      window.localStorage.setItem(
        "molino.discovery.v1",
        JSON.stringify({ version: 1, hasCompletedOnboarding: true, hasSeenIdentity: true, hasSeenWorld: true, hasSeenCircle: true, hasSeenIntelligence: true, lastVisitDate: "2026-08-02", visitCount: 3 })
      );
    },
    { p: PROFILE, c: CONTEXT }
  );
}

async function mockPremium(page, opts = {}) {
  const { interpretDelayMs = 2500 } = opts;
  await page.route("**/api/mp/check", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ premium: true }) })
  );
  await page.route("**/api/mp/verify", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ verified: true }) })
  );
  await page.route("**/api/paypal/capture-order", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ verified: true }) })
  );
  await page.route("**/api/intelligence/interpret", async (route) => {
    await new Promise((r) => setTimeout(r, interpretDelayMs));
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(AI_READING) });
  });
}

async function errorsOf(page) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error") errors.push(`console: ${m.text().slice(0, 160)}`); });
  return errors;
}

async function shot(page, name, full = true) {
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: full });
}

async function auditFlowA(browser) {
  // Returning premium user: gate unlocks silently, chat + reading visible.
  for (const vp of [
    { name: "desktop", width: 1440, height: 900 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    const errors = errorsOf(page);
    await seed(page);
    await mockPremium(page, { interpretDelayMs: 400 });
    await page.goto("http://localhost:3000/profile?tab=intelligence", { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(3500);
    await shot(page, `A-returning-${vp.name}-intelligence`);
    // scroll through the whole screen to force whileInView reveals
    await page.evaluate(async () => {
      const h = document.body.scrollHeight;
      for (let y = 0; y < h; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(1200);
    await shot(page, `A-returning-${vp.name}-bottom`);
    console.log(`[A] ${vp.name} errors: ${errors.length ? errors.join(" ;; ") : "none"}`);
    await page.close();
  }
}

async function auditFlowB(browser) {
  // Just unlocked: BuildingMolino -> MolinoReveal portada -> reading.
  const vp = { name: "desktop", width: 1440, height: 900 };
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  const errors = errorsOf(page);
  await seed(page);
  await mockPremium(page, { interpretDelayMs: 6000 });
  await page.goto("http://localhost:3000/profile?tab=intelligence&payment_status=approved&payment_method=paypal&token=PAYIDTEST123", { waitUntil: "networkidle", timeout: 60000 });
  // scroll down to the premium gate section (07) so the reveal is in view
  await page.evaluate(() => {
    const el = document.querySelector("[id=panel-intelligence]");
    const target = el ? el.getBoundingClientRect().top + window.scrollY + el.getBoundingClientRect().height * 0.78 : document.body.scrollHeight;
    window.scrollTo(0, target);
  });
  await page.waitForTimeout(2500);
  await shot(page, "B-building");
  await page.waitForTimeout(7000);
  await shot(page, "B-reveal-portada");
  await page.waitForTimeout(3500);
  await shot(page, "B-reading", false);
  console.log(`[B] errors: ${errors.length ? errors.join(" ;; ") : "none"}`);
  await page.close();
}

async function auditFlowC(browser) {
  // Chat interaction: ask a question, capture loading + answer.
  const vp = { name: "desktop", width: 1440, height: 900 };
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  const errors = errorsOf(page);
  await seed(page);
  await mockPremium(page, { interpretDelayMs: 1800 });
  await page.goto("http://localhost:3000/profile?tab=intelligence", { waitUntil: "networkidle", timeout: 60000 });
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += 900) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); }
    const el = Array.from(document.querySelectorAll("h2")).find((n) => n.textContent.includes("Preguntale"));
    if (el) { el.scrollIntoView({ block: "start" }); }
  });
  await page.waitForTimeout(1200);
  await shot(page, "C-chat-entry", false);
  // click a suggested door
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button")).filter((b) => b.textContent.includes("¿Qué significa mi tensión"));
    if (btns[0]) btns[0].click();
  });
  await page.waitForTimeout(600);
  await shot(page, "C-chat-loading", false);
  await page.waitForTimeout(3000);
  await shot(page, "C-chat-answer", false);
  console.log(`[C] errors: ${errors.length ? errors.join(" ;; ") : "none"}`);
  await page.close();
}

async function main() {
  const browser = await chromium.launch();
  await auditFlowA(browser);
  await auditFlowB(browser);
  await auditFlowC(browser);
  await browser.close();
  console.log("DONE →", OUT);
}

main().catch((e) => { console.error("FATAL:", e); process.exit(1); });
