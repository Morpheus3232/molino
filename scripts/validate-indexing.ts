/**
 * Valida el sitemap real del sitio: lee sitemap.xml (el output servido de
 * app/sitemap.ts, no el módulo TS — ese importa código server-only de Next
 * que no corre fuera del runtime de Next) y hace HEAD a cada URL.
 *
 * Nota de alcance: "verificar metadatos válidos" con un HEAD es, en rigor,
 * solo verificar que la URL responde 200 — un HEAD no trae <head> ni body,
 * así que no valida title/description real. Para eso hace falta un GET +
 * parseo de HTML (fuera del alcance pedido acá).
 *
 * Uso:
 *   node scripts/validate-indexing.ts [baseUrl]
 *   node scripts/validate-indexing.ts http://localhost:3000
 *   BASE_URL=http://localhost:3000 node scripts/validate-indexing.ts
 *
 * Default: https://www.molino.app
 */

import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

const BASE_URL = process.argv[2] || process.env.BASE_URL || "https://www.molino.app";
const CONCURRENCY = 10;
const TIMEOUT_MS = 10_000;

interface UrlResult {
  url: string;
  status: number | null;
  ok: boolean;
  error?: string;
  durationMs: number;
}

async function fetchSitemapUrls(sitemapUrl: string): Promise<string[]> {
  const res = await fetch(sitemapUrl);
  if (!res.ok) {
    throw new Error(`No se pudo leer ${sitemapUrl}: HTTP ${res.status}`);
  }
  const xml = await res.text();

  // Sitemap index (Next divide automáticamente sitemaps de más de 50k URLs
  // en varios archivos) — si aparece, seguimos cada <sitemap><loc> recursivamente.
  const nestedSitemaps = [...xml.matchAll(/<sitemap>\s*<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  if (nestedSitemaps.length > 0) {
    const all: string[] = [];
    for (const nested of nestedSitemaps) {
      all.push(...(await fetchSitemapUrls(nested)));
    }
    return all;
  }

  return [...xml.matchAll(/<url>\s*<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
}

async function checkUrl(url: string): Promise<UrlResult> {
  const start = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { method: "HEAD", signal: controller.signal, redirect: "follow" });
    return { url, status: res.status, ok: res.status === 200, durationMs: Date.now() - start };
  } catch (err) {
    return {
      url,
      status: null,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      durationMs: Date.now() - start,
    };
  } finally {
    clearTimeout(timeout);
  }
}

/** Pool de concurrencia simple — evita 1000+ requests simultáneos contra el sitio. */
async function checkAll(urls: string[], concurrency: number): Promise<UrlResult[]> {
  const results: UrlResult[] = new Array(urls.length);
  let next = 0;
  async function worker() {
    while (next < urls.length) {
      const i = next++;
      results[i] = await checkUrl(urls[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, urls.length) }, worker));
  return results;
}

async function main() {
  const sitemapUrl = `${BASE_URL.replace(/\/$/, "")}/sitemap.xml`;
  console.log(`Leyendo sitemap: ${sitemapUrl}`);

  const urls = await fetchSitemapUrls(sitemapUrl);
  console.log(`${urls.length} URLs encontradas. Validando con HEAD (concurrencia: ${CONCURRENCY})...`);

  const results = await checkAll(urls, CONCURRENCY);

  const ok = results.filter((r) => r.ok);
  const errors = results.filter((r) => !r.ok);

  const dateStr = new Date().toISOString().slice(0, 10);
  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    sitemapUrl,
    totalUrls: results.length,
    okCount: ok.length,
    errorCount: errors.length,
    results,
  };

  const reportsDir = join(process.cwd(), "reports");
  await mkdir(reportsDir, { recursive: true });
  const reportPath = join(reportsDir, `indexacion-validada-${dateStr}.json`);
  await writeFile(reportPath, JSON.stringify(report, null, 2));

  console.log("\n=== Resumen ===");
  console.log(`Total de URLs:     ${results.length}`);
  console.log(`Status 200:        ${ok.length}`);
  console.log(`Con errores:       ${errors.length}`);
  if (errors.length > 0) {
    console.log("\nURLs con error:");
    for (const e of errors.slice(0, 30)) {
      console.log(`  [${e.status ?? "ERR"}] ${e.url}${e.error ? ` — ${e.error}` : ""}`);
    }
    if (errors.length > 30) console.log(`  ...y ${errors.length - 30} más (ver el reporte completo).`);
  }
  console.log(`\nReporte guardado en: ${reportPath}`);

  if (errors.length > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error("Error fatal:", err);
  process.exitCode = 1;
});
