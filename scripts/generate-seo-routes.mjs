#!/usr/bin/env node
/**
 * SEO Programático — generador de rutas estáticas masivas.
 *
 * Genera las rutas programáticas (signo x casa, compatibilidad signo-signo)
 * a partir del catálogo en lib/seo/programmatic.ts. Emite un manifest JSON en
 * .artifacts/seo-routes.json con cada ruta, title, meta description y
 * prioridad — fuente única que consume sitemap.ts y las páginas estáticas.
 *
 * Uso:  node scripts/generate-seo-routes.mjs
 *
 * Regla: los datos objetivos vienen de lib/data/facts; la lógica de
 * interpretación de lib/data/interpretations / lib/engines. El script solo
 * agrega rutas y metadata; no inventa contenido.
 *
 * Implementación: transpila el catálogo TS con esbuild (bundle), resuelve el
 * alias "@/" a la raíz del repo y ejecuta la salida con Node.
 */

import { writeFileSync, mkdirSync, rmSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { build } from 'esbuild';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ARTIFACTS = join(ROOT, '.artifacts');
const TMP_DIR = join(ARTIFACTS, '.seo-gen');

mkdirSync(ARTIFACTS, { recursive: true });
mkdirSync(TMP_DIR, { recursive: true });

const entry = join(ROOT, 'lib/seo/programmatic.ts');
const outFile = join(TMP_DIR, 'catalog.mjs');

await build({
  entryPoints: [entry],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: outFile,
  alias: { '@': ROOT },
  logLevel: 'silent',
});

const mod = await import(`file://${outFile}?t=${Date.now()}`);
const routes = mod.allProgrammaticRoutes();

const manifest = {
  generatedAt: new Date().toISOString(),
  count: routes.length,
  routes,
};

const manifestPath = join(ARTIFACTS, 'seo-routes.json');
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

// Cleanup temp build output — keep the repo tidy after generation.
rmSync(TMP_DIR, { recursive: true, force: true });

console.log(`[seo-generator] ${routes.length} rutas programaticas generadas -> ${manifestPath}`);
console.log('[seo-generator] muestras:');
for (const r of routes.slice(0, 3)) console.log(`  - /${r.path}`);
console.log('  ...');
for (const r of routes.slice(-1)) console.log(`  - /${r.path}`);