const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, ".tmp", "qa-visual");
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
    sunSignInfo: { sign: "Tauro", element: "Tierra", modality: "Fijo" },
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

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile-375", width: 375, height: 812 },
  { name: "mobile-390", width: 390, height: 844 },
];

const ROUTES = [
  { name: "home", url: "/" },
  { name: "onboarding", url: "/onboarding" },
  { name: "profile", url: "/profile" },
  { name: "identity", url: "/profile?tab=identity" },
  { name: "world", url: "/profile?tab=world" },
  { name: "circle", url: "/profile?tab=circle" },
  { name: "intelligence", url: "/profile?tab=intelligence" },
  { name: "hoy", url: "/hoy" },
  { name: "daily-energy", url: "/daily-energy" },
  { name: "timing", url: "/timing" },
  { name: "explore", url: "/explore" },
  { name: "biblioteca", url: "/biblioteca" },
  { name: "affinity-types", url: "/affinity/recommendations" },
  { name: "affinity-compare", url: "/affinity/compare/caballo/dragon" },
];

async function seedProfile(page) {
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

async function auditRoute(browser, route, vp) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  const issues = [];
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text().slice(0, 180)}`);
  });

  try {
    await seedProfile(page);
    await page.goto(`http://localhost:3000${route.url}`, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(2500);

    // Horizontal overflow check
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return { scrollW: doc.scrollWidth, clientW: doc.clientWidth };
    });
    if (overflow.scrollW > overflow.clientW + 2) {
      issues.push(`HORIZONTAL OVERFLOW: scrollW=${overflow.scrollW} clientW=${overflow.clientW}`);
    }

    // Elements sticking out beyond viewport right edge
    const sticking = await page.evaluate((vpw) => {
      const out = [];
      document.querySelectorAll("body *").forEach((el) => {
        if (!el.getBoundingClientRect) return;
        const r = el.getBoundingClientRect();
        if (r.right > vpw + 2 && r.width > 20) {
          const cls = (el.className && typeof el.className === "string" ? el.className : "").slice(0, 60);
          out.push(`${el.tagName.toLowerCase()}.${cls} right=${Math.round(r.right)} w=${Math.round(r.width)}`);
        }
      });
      return out.slice(0, 6);
    }, vp.width);
    if (sticking.length) issues.push(`STICKING OUT: ${sticking.join(" | ")}`);

    // Fixed/sticky elements covering content
    const fixed = await page.evaluate(() => {
      return document.querySelectorAll("header, nav, [class*=fixed], [class*=sticky]").length;
    });

    await page.screenshot({ path: path.join(OUT, `${vp.name}-${route.name}.png`), fullPage: true });
    issues.push(`fixedElements=${fixed}`);
    issues.push(errors.length ? `ERRORS: ${errors.slice(0, 3).join(" ;; ")}` : "noErrors");
  } catch (e) {
    issues.push(`NAV FAILED: ${e.message.split("\n")[0]}`);
  }
  await page.close();
  return issues;
}

async function main() {
  const browser = await chromium.launch();
  const report = [];
  for (const vp of VIEWPORTS) {
    for (const route of ROUTES) {
      const issues = await auditRoute(browser, route, vp);
      const clean = issues.filter((i) => !i.startsWith("fixedElements=") && !i.startsWith("noErrors"));
      report.push(`[${vp.name}] ${route.name}: ${clean.length ? "ISSUES → " + clean.join(" ;; ") : "ok"}`);
      console.log(`[${vp.name}] ${route.name}: ${clean.length ? "ISSUES → " + clean.join(" ;; ") : "ok"}`);
    }
  }
  fs.writeFileSync(path.join(OUT, "report.txt"), report.join("\n"));
  await browser.close();
}

main().catch((e) => { console.error("FATAL:", e.message); process.exit(1); });
