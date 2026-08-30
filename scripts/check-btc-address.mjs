#!/usr/bin/env node
/**
 * Valida una dirección Bitcoin y sale con código != 0 si no lo es, para poder
 * encadenarlo con && antes de cargarla en ningún lado.
 *
 *   node scripts/check-btc-address.mjs "bc1..."
 *   pbpaste | node scripts/check-btc-address.mjs
 *
 * Existe porque cargar BTC_ADDRESS a mano falló varias veces seguidas: el
 * portapapeles tenía otra cosa (otra dirección, o directamente un texto que
 * no era una dirección) y se cargaba igual sin que nadie lo notara hasta
 * mirar el endpoint. Un `echo` no alcanza: hay que ABORTAR.
 *
 * Usa la MISMA validación que la app (lib/bitcoin.ts) — se bundlea con
 * esbuild igual que hace fetch-wiki-images.mjs, así no hay dos
 * implementaciones del checksum que puedan divergir.
 */

import { mkdirSync, rmSync, readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { build } from "esbuild";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TMP = join(ROOT, ".artifacts", ".btc-check");

const entrada =
  (process.argv[2] ?? "").trim() ||
  (() => {
    try {
      return readFileSync(0, "utf8").trim();
    } catch {
      return "";
    }
  })();

const limpia = entrada.replace(/\s+/g, "");

if (!limpia) {
  console.error("✗ No recibí nada. ¿El portapapeles está vacío?");
  process.exit(2);
}

mkdirSync(TMP, { recursive: true });
const out = join(TMP, "bitcoin.mjs");
await build({
  entryPoints: [join(ROOT, "lib/bitcoin.ts")],
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: out,
  alias: { "@": ROOT },
  logLevel: "silent",
});
const { looksLikeBtcAddress } = await import(`file://${out}?t=${Date.now()}`);
rmSync(TMP, { recursive: true, force: true });

const preview =
  limpia.length > 60 ? `${limpia.slice(0, 40)}…${limpia.slice(-12)}` : limpia;

if (!looksLikeBtcAddress(limpia)) {
  console.error(`✗ NO es una dirección Bitcoin válida:\n    ${preview}`);
  console.error(`    (${limpia.length} caracteres)`);
  if (/^bc1/i.test(limpia)) {
    const unos = (limpia.slice(3).match(/1/g) ?? []).length;
    if (unos > 0) {
      console.error(
        `    Tiene ${unos} carácter(es) "1" después de "bc1". Bech32 excluye el`,
      );
      console.error(`    "1" de sus datos: casi seguro es una "l" minúscula.`);
    } else {
      console.error(`    El checksum no cierra: falta o sobra algún carácter.`);
    }
  } else {
    console.error(`    Ni siquiera empieza con "bc1" — esto no es una dirección.`);
  }
  process.exit(1);
}

console.log(`✓ Dirección válida (checksum verificado):\n    ${limpia}`);
