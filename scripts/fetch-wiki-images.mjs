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

import { writeFileSync, readFileSync, mkdirSync, rmSync } from "fs";
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

// Escribe el mapa { id → imageUrl } directo a lib/data/entity-images.ts.
// Se fusiona con lo que ya había: un miss transitorio (429, timeout) en esta
// corrida no debe borrar una imagen ya resuelta. Lo nuevo pisa lo viejo.
// WIKI_FRESH=1 escribe SOLO lo que resolvió esta corrida. Necesario cuando
// se endurecen los filtros: si no, una entrada vieja y equivocada sobrevive
// al merge justamente porque la corrida nueva la rechazó.
const tsPath = join(ROOT, "lib/data/entity-images.ts");
const personPath = join(ROOT, "lib/data/person-images.ts");

function readExisting(path) {
  const out = {};
  try {
    if (process.env.WIKI_FRESH) return out;
    const raw = readFileSync(path, "utf8");
    const re = /"([^"]+)":\s*"([^"]+)"/g;
    let m;
    while ((m = re.exec(raw))) out[m[1]] = m[2];
  } catch {
    /* primera corrida o archivo ausente */
  }
  return out;
}

const prev = readExisting(tsPath);
const merged = { ...prev, ...output.images };
// Wikimedia sirve el mismo path desde upload. y thumb.; next.config solo
// confía en upload.wikimedia.org, así que normalizamos el host.
for (const k of Object.keys(merged)) {
  merged[k] = merged[k].replace("://thumb.wikimedia.org/", "://upload.wikimedia.org/");
}
const entries = Object.entries(merged).sort(([a], [b]) => a.localeCompare(b));
const body = entries.map(([id, url]) => `  ${JSON.stringify(id)}: ${JSON.stringify(url)},`).join("\n");
const tsSource = `/**
 * Imágenes reales para entidades team/university/artist/football_player/brand/movie.
 *
 * Generado automáticamente por scripts/fetch-wiki-images.mjs desde
 * Wikipedia (thumbnail del resumen REST + pageimages fallback). Cada URL
 * apunta a upload.wikimedia.org y es verificable via Special:FilePath.
 *
 * Para entidades sin imagen en Wikipedia (página sin lead-image), se
 * mantiene el ícono genérico del dominio.
 *
 * Last updated: ${output.generatedAt}
 */

export const ENTITY_IMAGE_URLS: Record<string, string> = {
${body}
};
`;
writeFileSync(tsPath, tsSource);

// Retratos de las figuras históricas, en su propio archivo. FamousMatch es un
// Client Component: si leyera ENTITY_IMAGE_URLS se llevaría las ~600 URLs del
// Atlas al bundle para usar 108. Este mapa va solo con las personas.
const personPrev = readExisting(personPath);
const personNew = Object.fromEntries(
  output.resolved.filter((r) => r.type === "person").map((r) => [r.id, r.imageUrl])
);
const personMerged = { ...personPrev, ...personNew };
for (const k of Object.keys(personMerged)) {
  personMerged[k] = personMerged[k].replace("://thumb.wikimedia.org/", "://upload.wikimedia.org/");
}
const personEntries = Object.entries(personMerged).sort(([a], [b]) => a.localeCompare(b));
writeFileSync(
  personPath,
  `/**
 * Retratos de las figuras de Sincronicidad Histórica (RAW_FAMOUS_PEOPLE).
 *
 * Generado por scripts/fetch-wiki-images.mjs desde Wikipedia. Indexado por el
 * mismo id que arma FAMOUS_PEOPLE (slugify del nombre). Aparte de
 * entity-images.ts a propósito: lo consume un Client Component y no debe
 * arrastrar el mapa entero del Atlas al bundle.
 *
 * Quien no resuelva queda sin entrada y la tarjeta muestra la silueta.
 *
 * Last updated: ${output.generatedAt}
 */

export const PERSON_IMAGE_URLS: Record<string, string> = {
${personEntries.map(([id, url]) => `  ${JSON.stringify(id)}: ${JSON.stringify(url)},`).join("\n")}
};
`
);

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