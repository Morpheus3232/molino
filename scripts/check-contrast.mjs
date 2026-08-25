// scripts/check-contrast.mjs
// Usage: node scripts/check-contrast.mjs "#RRGGBB" "#RRGGBB" ...
// Prints WCAG contrast ratio of each color against the shipped paper
// background (read live from app/globals.css, never hardcoded — the palette
// has changed under this script before) and flags anything under the 4.5:1
// AA threshold for text.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const globalsCss = fs.readFileSync(path.resolve(__dirname, "..", "app/globals.css"), "utf8");
const paperMatch = globalsCss.match(/--color-paper:\s*(#[0-9a-fA-F]{6})/);
if (!paperMatch) {
  console.error("No se pudo leer --color-paper de app/globals.css");
  process.exit(1);
}
const PAPER = paperMatch[1];

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(clean.slice(i, i + 2), 16));
}

function relativeLuminance([r, g, b]) {
  const lin = (c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const [rl, gl, bl] = [lin(r), lin(g), lin(b)];
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

function contrastRatio(hexA, hexB) {
  const lA = relativeLuminance(hexToRgb(hexA));
  const lB = relativeLuminance(hexToRgb(hexB));
  const [lighter, darker] = lA > lB ? [lA, lB] : [lB, lA];
  return (lighter + 0.05) / (darker + 0.05);
}

const colors = process.argv.slice(2);
if (colors.length === 0) {
  console.error('Usage: node scripts/check-contrast.mjs "#RRGGBB" ...');
  process.exit(1);
}

let anyFailed = false;
for (const hex of colors) {
  const ratio = contrastRatio(hex, PAPER);
  const pass = ratio >= 4.5;
  if (!pass) anyFailed = true;
  console.log(`${hex}  vs ${PAPER}  →  ${ratio.toFixed(2)}:1  ${pass ? "PASS" : "FAIL (needs darkening)"}`);
}
process.exit(anyFailed ? 1 : 0);
