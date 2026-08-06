const { chromium } = require("playwright");
async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  const res = await page.evaluate(() => ({ rm: matchMedia("(prefers-reduced-motion: reduce)").matches }));
  console.log("prefers-reduced-motion:", res.rm);
  await browser.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
