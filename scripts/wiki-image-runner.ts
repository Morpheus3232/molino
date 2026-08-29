/**
 * Consulta a es.wikipedia por cada entidad team/university/artist/football_player
 * y devuelve `{ images, manual, missing }` para que el orquestador (mjs) escriba.
 *
 * Estrategia anti-ambigüedad:
 *   1. Busca el título con `generator=search` usando un término tipado
 *      (los equipos buscan con " club").
 *   2. Confirma el thumbnail vía la API REST summary (maneja redirects).
 *   3. Valida que el título matcheado sea la entidad (no un clásico/derbi/lista).
 *
 * Respeta la política de Wikipedia: User-Agent descriptivo, ritmo serial y
 * reintento con backoff ante 429. NO inventa imágenes.
 */

import { SYMBOLIC_ENTITIES } from "@/lib/data/symbolic-entities";

const WIKI_ACTION = "https://es.wikipedia.org/w/api.php";
const WIKI_REST = "https://es.wikipedia.org/api/rest_v1/page/summary";
const TARGET_TYPES = new Set(["team", "university", "artist", "football_player"]);

const UA = "molino.app (mapa personal; contacto: dev@molino.app) node";

interface WikiEntry {
  id: string;
  name: string;
  type: string;
  title?: string;
  imageUrl?: string;
  reason?: string;
}

const BAD_TITLE =
  /clasico|clásico|derbi|derby|superclasico|superclásico|desambiguaci|lista de|frente |frente a|partido|torneo|escuadra|como persona|ver más|reconocimien/iu;

function normalizeForCompare(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function searchQuery(name: string): string {
  return name.replace(/\s*\([^)]*\)\s*$/i, "").trim();
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url: string): Promise<number | unknown> {
  let attempts = 0;
  while (attempts < 5) {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (res.status === 429) {
      attempts += 1;
      await sleep(3000 * attempts);
      continue;
    }
    if (!res.ok) return res.status;
    return await res.json();
  }
  return 429;
}

/** Primer título de la búsqueda, o null. */
async function searchTopTitle(term: string): Promise<string | null> {
  const url = `${WIKI_ACTION}?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(
    term
  )}&gsrnamespace=0&gsrlimit=1&prop=pageimages|info&piprop=thumbnail&pithumbsize=512`;
  const data = await fetchWithRetry(url);
  if (typeof data === "number") return null;
  const pages = (data as any)?.query?.pages ?? {};
  const top = Object.values(pages as Record<string, any>)[0] as any;
  return top?.title ?? null;
}

function isReasonableMatch(name: string, title?: string): boolean {
  if (!title) return false;
  const basePart = (name.match(/(.*?)\s*\(/) ?? [null, name])[1] ?? name;
  const base = normalizeForCompare(basePart);
  const t = normalizeForCompare(title);
  if (base === t) return true;
  if (t.includes(base) || base.includes(t)) return true;
  const baseWords = base.split(" ").filter(Boolean);
  const titleWords = t.split(" ").filter(Boolean);
  if (!baseWords.length) return false;
  const overlap = baseWords.filter((w) => titleWords.includes(w)).length;
  if (overlap >= Math.max(2, Math.min(baseWords.length, titleWords.length) - 1)) return true;
  // Siglas: "FC Barcelona" → "Futbol Club Barcelona", "Sporting CP" → "Sporting Clube de Portugal"
  const substantial = baseWords.some((w) => w.length > 2);
  if (!substantial) return false;
  let ti = 0;
  for (const w of baseWords) {
    const hit = titleWords.findIndex((x, i) => {
      if (i < ti) return false;
      if (x === w) return true;
      if (w.length === 2 && x.length > 1 && x[0] === w[0]) return true;
      return false;
    });
    if (hit === -1) return false;
    ti = hit + 1;
  }
  return true;
}

/**
 * Títulos que NO representan a la entidad principal (equipos femeninos,
 * filiales, reservas, selecciones) — solo se filtran en el path de búsqueda.
 */
const VARIANT_TITLE =
  /\(femenino\)|\(femenina\)|\(reserva\)|\(filial\)|\(seleccion|\(desambiguaci|\(equipo (b|juvenil|sub|deportivo)\)| \(c\)$|"c"$| ii$| iii$/iu;

/** REST summary: devuelve {title, thumb} del destino final (sigue redirects). */
async function restSummary(title: string): Promise<{ title: string; thumb: string } | null> {
  const url = `${WIKI_REST}/${encodeURIComponent(title)}`;
  const data = await fetchWithRetry(url);
  if (typeof data !== "number") {
    const thumb = (data as any)?.thumbnail?.source;
    const resolved = (data as any)?.title;
    if (thumb && resolved) return { title: resolved, thumb: String(thumb).replace(/\?.*$/, "") };
  }
  return null;
}

/** Fallback: pageimages original|thumbnail por título exacto. */
async function actionThumb(title: string): Promise<string | null> {
  const url2 = `${WIKI_ACTION}?action=query&format=json&titles=${encodeURIComponent(
    title
  )}&prop=pageimages&piprop=original|thumbnail&pithumbsize=512`;
  const data2 = await fetchWithRetry(url2);
  if (typeof data2 === "number") return null;
  const pages = (data2 as any)?.query?.pages ?? {};
  const page = Object.values(pages as Record<string, any>)[0] as any;
  return page?.thumbnail?.source?.replace(/\?.*$/, "") ?? null;
}

async function resolveImage(entry: WikiEntry): Promise<void> {
  const name = searchQuery(entry.name);
  // 1. Título exacto: REST summary maneja redirects, es el camino más fiable.
  const exact = await restSummary(name);
  if (exact?.thumb && isReasonableMatch(entry.name, exact.title)) {
    entry.title = exact.title;
    entry.imageUrl = exact.thumb;
    return;
  }

  // 2. Búsqueda con término tipado (equipos buscan con "club").
  const terms =
    entry.type === "team"
      ? [`${name} club`, name]
      : [name];

  for (const term of terms) {
    const title = await searchTopTitle(term);
    if (!title) continue;
    if (VARIANT_TITLE.test(title) || BAD_TITLE.test(title)) continue;
    if (!isReasonableMatch(entry.name, title)) continue;

    const thumb = await restSummary(title);
    if (!thumb?.thumb) continue;
    if (!isReasonableMatch(entry.name, thumb.title)) continue;

    entry.title = thumb.title;
    entry.imageUrl = thumb.thumb;
    return;
  }

  // 3. Búsqueda falló: probar REST summary con variantes del nombre sin sufijos.
  for (const term of terms) {
    const title = await searchTopTitle(term);
    if (!title || VARIANT_TITLE.test(title) || BAD_TITLE.test(title)) continue;
    const thumb = await actionThumb(title);
    if (thumb) {
      entry.title = title;
      entry.imageUrl = thumb;
      return;
    }
  }

  entry.reason = exact ? `sin thumbnail (${exact.title})` : "sin match razonable";
}

export async function resolveWikiImages() {
  const entities = SYMBOLIC_ENTITIES.filter((e) => TARGET_TYPES.has(e.type));
  const sample = process.env.WIKI_SAMPLE ? Number(process.env.WIKI_SAMPLE) : 0;
  const only = process.env.WIKI_ONLY
    ? process.env.WIKI_ONLY.split(",").map((s) => s.trim())
    : [];
  const filtered = only.length
    ? entities.filter((e) => only.some((n) => normalizeForCompare(e.name).includes(normalizeForCompare(n))))
    : sample
      ? entities.slice(0, sample)
      : entities;
  const results: WikiEntry[] = filtered.map((e) => ({
    id: e.id,
    name: e.name,
    type: e.type,
  }));

  for (let idx = 0; idx < results.length; idx++) {
    const entry = results[idx];
    process.stdout.write(`  [${idx + 1}/${results.length}] ${entry.name} `);
    await resolveImage(entry);
    process.stdout.write(entry.imageUrl ? "→ ✓\n" : `→ ${entry.reason}\n`);
    await sleep(600);
  }

  return {
    generatedAt: new Date().toISOString(),
    total: results.length,
    withImage: results.filter((e) => e.imageUrl).length,
    resolved: results
      .filter((e) => e.imageUrl)
      .map((e) => ({ id: e.id, name: e.name, type: e.type, title: e.title, imageUrl: e.imageUrl! })),
    images: Object.fromEntries(
      results.filter((e) => e.imageUrl).map((e) => [e.id, e.imageUrl as string])
    ),
    manual: results.filter((e) => e.imageUrl && !e.title),
    missing: results.filter((e) => !e.imageUrl).map((e) => ({
      id: e.id,
      name: e.name,
      type: e.type,
      reason: e.reason,
    })),
  };
}