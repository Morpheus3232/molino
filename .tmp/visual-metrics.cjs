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
  fallback: { summary: "Lectura local", alignment: "", timing: "", strengths: [], tensions: [], whatToConsider: [], suggestedNextStep: "", confidence: "Media", limitations: [], opening: "", closingSynthesis: "" },
  ai: {
    summary: "Tu mapa no es una suma de sistemas: es una conversación entre ellos. Cada número, signo y ciclo que ya viste en las pantallas anteriores se vuelve significativo recién cuando se cruza con los otros.",
    alignment: "Que tu Camino de Vida 7 busque profundidad y tu expresión 11 demande acción pública no es una contradicción: es el motor de tu vida.",
    timing: "Tu año personal 8 favorece el cierre de ciclos, pero tu mes 5 te pide ligereza. Decidí lo estructural y ejecutalo en dosis cortas.",
    strengths: ["Tu capacidad de síntesis convierte ruido en criterio.", "La tensión entre tu 7 y tu 11 te da una ventaja rara.", "Tu elemento metal te da límites claros."],
    tensions: ["Tu soledad natural (Camino 7) choca con tu necesidad de reconocimiento (Expresión 11)."],
    whatToConsider: ["Los meses de retiro no son pérdida de tiempo.", "Las decisiones tomadas desde la ansiedad tienden a desalinearse."],
    suggestedNextStep: "Antes de tu próxima decisión grande, escribí en una sola página qué querés y qué te asusta.",
    confidence: "Alta",
    limitations: ["Interpretación generada con IA."],
    opening: "Tu lectura empieza donde tus sistemas dejan de hablar por separado. Lo que sigue no es un resumen de lo que ya viste: es lo que aparece cuando se miran juntos.",
    corePattern: { source: "Life Path 7 · Expresión 11", whyItMatters: "El 7 te da la distancia y el 11 la necesidad de impacto." },
    howYouOperate: "Entrás en profundidad de a ráfagas, necesitás silencio para procesar y volvés con una síntesis que otros no ven.",
    relationalNote: "Tu caballo de metal busca compañeros de aventura, pero tu Tierra fija necesita estabilidad.",
    closingSynthesis: "No sos un sistema a descifrar: sos una conversación entre siete voces.",
  },
};

async function seed(page) {
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await page.evaluate(({ p, c }) => {
    window.localStorage.setItem("molino.user-profile.v1", p);
    window.localStorage.setItem("molino.context.v1", c);
    window.localStorage.setItem("molino.discovery.v1", JSON.stringify({ version: 1, hasCompletedOnboarding: true, hasSeenIdentity: true, hasSeenWorld: true, hasSeenCircle: true, hasSeenIntelligence: true, lastVisitDate: "2026-08-02", visitCount: 3 }));
  }, { p: PROFILE, c: CONTEXT });
}

async function mock(page, delay) {
  await page.route("**/api/mp/check", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ premium: true }) }));
  await page.route("**/api/intelligence/interpret", async (r) => { await new Promise((res) => setTimeout(res, delay)); await r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(AI_READING) }); });
}

const M = {
  px: (v) => (v.endsWith("px") ? parseFloat(v) : null),
};

async function collectIntelligence(page, label) {
  const data = await page.evaluate(() => {
    const panel = document.getElementById("panel-intelligence");
    if (!panel) return { missing: true };
    const cs = (el) => getComputedStyle(el);
    const px = (v) => (v.endsWith("px") ? parseFloat(v) : null);
    const out = { sections: [], headings: [], hairlines: 0, borders: 0, infiniteMotion: 0, viewportW: innerWidth, bodyScrollH: document.body.scrollHeight };

    panel.querySelectorAll("section").forEach((sec) => {
      const s = cs(sec);
      const h = sec.querySelector("h1, h2, h3");
      out.sections.push({
        pt: px(s.paddingTop), pb: px(s.paddingBottom),
        borderTop: s.borderTopStyle !== "none" ? s.borderTopWidth : null,
        heading: h ? h.textContent.trim().slice(0, 60) : null,
        headingSize: h ? cs(h).fontSize : null,
        headingFamily: h ? cs(h).fontFamily.split(",")[0] : null,
        headingTransform: h ? cs(h).textTransform : null,
      });
    });

    const hSizes = {};
    panel.querySelectorAll("h1, h2, h3, p, span, li, button, a").forEach((el) => {
      const s = cs(el);
      const key = `${s.fontFamily.split(",")[0]}|${s.fontSize}|${s.fontWeight}|${s.textTransform}|${s.letterSpacing}`;
      hSizes[key] = (hSizes[key] || 0) + 1;
    });
    out.typeStyles = Object.entries(hSizes)
      .map(([k, n]) => ({ k, n }))
      .sort((a, b) => b.n - a.n)
      .slice(0, 40);

    out.borders = panel.querySelectorAll('[class*="border-t"], [class*="border-b"], [class*="border-l"], [class*="h-px"], [class*="w-px"], hr').length;

    const animated = [];
    panel.querySelectorAll("[data-animate], [style*='transform'], [style*='opacity']").forEach((el) => {
      const st = el.getAttribute("style") || "";
      if (st.includes("infinite") || st.includes("repeat")) {
        animated.push(el.tagName + ":" + (el.textContent || "").trim().slice(0, 30));
        out.infiniteMotion++;
      }
    });

    // stray horizontal overflow within panel
    out.overflowEls = [];
    panel.querySelectorAll("body *").forEach(() => {});
    panel.querySelectorAll("*").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.right > innerWidth + 2 && r.width > 20) {
        out.overflowEls.push(`${el.tagName}.${(el.className && typeof el.className === "string" ? el.className : "").toString().slice(0, 50)} right=${Math.round(r.right)}`);
      }
    });
    out.overflowEls = out.overflowEls.slice(0, 8);

    return out;
  });
  fs.writeFileSync(path.join(OUT, `${label}.json`), JSON.stringify(data, null, 2));
  return data;
}

async function auditReturning(browser) {
  for (const vp of [
    { name: "desktop", width: 1440, height: 900 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await seed(page);
    await mock(page, 400);
    await page.goto("http://localhost:3000/profile?tab=intelligence", { waitUntil: "networkidle", timeout: 60000 });
    await page.evaluate(async () => {
      const h = document.body.scrollHeight;
      for (let y = 0; y < h; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 100)); }
    });
    await page.waitForTimeout(1500);
    await collectIntelligence(page, `intelligence-${vp.name}`);
    await page.close();
  }
}

async function auditBuilding(browser) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await seed(page);
  await mock(page, 8000);
  await page.goto("http://localhost:3000/profile?tab=intelligence&payment_status=approved&payment_method=paypal&token=PAYIDTEST123", { waitUntil: "networkidle", timeout: 60000 });
  await page.evaluate(() => {
    const panel = document.getElementById("panel-intelligence");
    const target = panel ? panel.getBoundingClientRect().top + window.scrollY + panel.getBoundingClientRect().height * 0.78 : document.body.scrollHeight;
    window.scrollTo(0, target);
  });
  await page.waitForTimeout(3000);
  const data = await page.evaluate(() => {
    const roles = Array.from(document.querySelectorAll("[role='status']")).map((el) => {
      const h = el.parentElement && el.parentElement.querySelector("h3");
      return { text: el.parentElement ? el.parentElement.textContent.replace(/\s+/g, " ").trim().slice(0, 120) : "" };
    });
    const building = document.querySelector("[role='status']");
    const btns = document.querySelectorAll("button").length;
    return { roles, buildingText: building && building.parentElement ? building.parentElement.textContent.replace(/\s+/g, " ").trim().slice(0, 200) : null, buttons: btns };
  });
  fs.writeFileSync(path.join(OUT, "building.json"), JSON.stringify(data, null, 2));
  await page.close();
}

async function auditChat(browser) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await seed(page);
  await mock(page, 1200);
  await page.goto("http://localhost:3000/profile?tab=intelligence", { waitUntil: "networkidle", timeout: 60000 });
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll("h2")).find((n) => n.textContent.includes("Preguntale"));
    if (el) el.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(1500);
  const data = await page.evaluate(() => {
    const wrap = Array.from(document.querySelectorAll("h2")).find((n) => n.textContent.includes("Preguntale"));
    const root = wrap ? wrap.closest("section") : null;
    if (!root) return { missing: true };
    const out = { headings: [], inputs: [], buttons: [], paras: [] };
    root.querySelectorAll("h2, h3, p, span, button, input").forEach((el) => {
      const s = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      out[el.tagName === "H2" || el.tagName === "H3" ? "headings" : el.tagName === "BUTTON" ? "buttons" : el.tagName === "INPUT" ? "inputs" : "paras"].push({
        text: (el.textContent || el.placeholder || "").trim().slice(0, 80),
        fs: s.fontSize, ff: s.fontFamily.split(",")[0], fw: s.fontWeight, tt: s.textTransform, ls: s.letterSpacing,
        mt: s.marginTop, mb: s.marginBottom, py: s.paddingTop, border: s.borderBottomStyle !== "none" ? "b" : s.borderTopStyle !== "none" ? "t" : "",
      });
    });
    return out;
  });
  fs.writeFileSync(path.join(OUT, "chat.json"), JSON.stringify(data, null, 2));
  await page.close();
}

async function main() {
  const browser = await chromium.launch();
  await auditReturning(browser);
  await auditBuilding(browser);
  await auditChat(browser);
  await browser.close();
  console.log("DONE →", OUT);
}
main().catch((e) => { console.error("FATAL:", e); process.exit(1); });
