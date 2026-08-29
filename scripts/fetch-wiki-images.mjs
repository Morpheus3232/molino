#!/usr/bin/env node
/**
 * Resuelve imágenes reales (Wikipedia) para equipos, universidades, artistas
 * y jugadores del Atlas, y escribe el mapeo { name → imageUrl } en
 * `.artifacts/wiki-images.json`.
 *
 * Regla: NO inventa imágenes. Cada URL proviene del thumbnail que Wikipedia
 * asoció a la página real de la entidad. Entidades sin match o con match
 * dudoso aparecen en `manual`/`missing` para revisión.
 *
 * Uso:  node scripts/fetch-wiki-images.mjs
 */

import { writeFileSync, mkdirSync, rmSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { build } from "esbuild";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ARTIFACTS = join(ROOT, ".artifacts");
const TMP_DIR = join(ARTIFACTS, ".wiki-images-gen");

mkdirSync(ARTIFACTS, { recursive: true });
mkdirSync(TMP_DIR, { recursive: true });

const entry = join(ROOT, "scripts/wiki-image-runner.ts");
const outFile = join(TMP_DIR, "runner.mjs");

await build({
  entryPoints: [entry],
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: outFile,
  alias: { "@": ROOT },
  conditions: ["react-server"], // resolve server-only → empty marker
  logLevel: "silent",
});

const mod = await import(`file://${outFile}?t=${Date.now()}`);
const output = await mod.resolveWikiImages();

const outPath = join(ARTIFACTS, "wiki-images.json");
writeFileSync(outPath, JSON.stringify(output, null, 2));

rmSync(TMP_DIR, { recursive: true, force: true });

console.log(
  `\n[wiki-images] ${output.withImage}/${output.total} resueltas → ${outPath}`
);
if (output.manual.length) {
  console.log(`  manual (${output.manual.length}): ${output.manual.map((m) => m.name).join(", ")}`);
}
if (output.missing.length) {
  console.log(`  sin imagen (${output.missing.length}): ${output.missing.map((m) => m.name).join(", ")}`);
}