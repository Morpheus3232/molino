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

import { createHash } from "crypto";
import { SYMBOLIC_ENTITIES } from "@/lib/data/symbolic-entities";
import { COUNTRY_ISO } from "@/lib/data/country-iso";
import { FAMOUS_PEOPLE } from "@/lib/data/famousPeopleToEntities";
import { getPrimaryEvent } from "@/lib/data/entity-events";

const WIKI_ACTION = "https://es.wikipedia.org/w/api.php";
const WIKI_REST = "https://es.wikipedia.org/api/rest_v1/page/summary";
const TARGET_TYPES = new Set([
  "team",
  "university",
  "artist",
  "football_player",
  "brand",
  "movie",
]);

const UA = "molino.app (mapa personal; contacto: dev@molino.app) node";

interface WikiEntry {
  id: string;
  name: string;
  type: string;
  year?: number;
  country?: string;
  title?: string;
  imageUrl?: string;
  reason?: string;
}

const BAD_TITLE =
  /clasico|clásico|derbi|derby|superclasico|superclásico|desambiguaci|lista de|anexo:|frente |frente a|partido|torneo|escuadra|como persona|ver más|reconocimien/iu;

function normalizeForCompare(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Nombres que Wikipedia titula distinto. Mapa explícito y chico a propósito:
 * aflojar isReasonableMatch para que "Charlie" matchee "Charles" reabriría
 * la puerta a los falsos positivos que ese filtro existe para cerrar.
 */
const TITLE_ALIASES: Record<string, string> = {
  "Charlie Chaplin": "Charles Chaplin",
  "Sergio Agüero": "Kun Agüero",
};

function searchQuery(name: string): string {
  const aliased = TITLE_ALIASES[name] ?? name;
  return aliased.replace(/\s*\([^)]*\)\s*$/i, "").trim();
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url: string): Promise<number | unknown> {
  let attempts = 0;
  while (attempts < 5) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA } });
      if (res.status === 429) {
        attempts += 1;
        await sleep(3000 * attempts);
        continue;
      }
      if (!res.ok) return res.status;
      return await res.json();
    } catch {
      // Error de red transitorio (socket caído, DNS, TLS): reintento con
      // backoff en vez de tumbar toda la corrida.
      attempts += 1;
      await sleep(2000 * attempts);
    }
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

/**
 * Palabras del nombre que no distinguen nada ("club", "universidad"): casi
 * todo título del rubro las trae, así que exigirlas no aporta señal.
 */
const GENERIC_WORDS = new Set([
  "club", "atletico", "asociacion", "deportivo", "deportiva", "sociedad",
  "fc", "cf", "sc", "ac", "cd", "ca", "futbol", "football",
  "universidad", "university", "instituto", "institute", "nacional",
  "national", "facultad", "escuela", "de", "del", "la", "el", "los", "las",
  "y", "e", "of", "the", "and", "empresa", "compania", "grupo", "group",
  "studios", "studio", "inc", "sa", "ltd", "co",
]);

/**
 * ¿El título de Wikipedia es esta entidad?
 *
 * Regla: TODA palabra distintiva del nombre tiene que aparecer en el título.
 * La versión anterior aceptaba que el título fuera substring del nombre, y
 * eso hacía pasar "Acne Studios" → el artículo "Acné" (una foto clínica de
 * acné terminaba de logo de la marca). Preferimos rechazar y mostrar el
 * ícono genérico antes que mostrar la imagen de otra cosa.
 */
function isReasonableMatch(rawName: string, title?: string): boolean {
  if (!title) return false;
  const name = TITLE_ALIASES[rawName] ?? rawName;
  const basePart = (name.match(/(.*?)\s*\(/) ?? [null, name])[1] ?? name;
  const base = normalizeForCompare(basePart);
  const t = normalizeForCompare(title);
  if (base === t) return true;

  // Sin espacios: "Mercado Libre" es "MercadoLibre" en Wikipedia. Exigir el
  // nombre COMPLETO dentro del título sigue siendo señal fuerte ("Acne
  // Studios" no entra en "Acné").
  const baseFlat = base.replace(/ /g, "");
  const tFlat = t.replace(/ /g, "");
  if (baseFlat && tFlat.includes(baseFlat)) return true;

  const baseWords = base.split(" ").filter(Boolean);
  const titleWords = t.split(" ").filter(Boolean);
  if (!baseWords.length) return false;

  // Palabras que sí distinguen. Si el nombre es puro genérico, se cae a
  // exigirlas todas igual.
  const distinctive = baseWords.filter((w) => w.length > 2 && !GENERIC_WORDS.has(w));
  const required = distinctive.length ? distinctive : baseWords;
  if (required.every((w) => titleWords.includes(w))) return true;

  // Siglas: "FC Barcelona" → "Futbol Club Barcelona", "Sporting CP" →
  // "Sporting Clube de Portugal". Subsecuencia en orden, con la inicial
  // cubriendo las siglas de dos letras.
  if (!baseWords.some((w) => w.length > 2)) return false;
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
 * La `description` del resumen REST tiene que ser del rubro de la entidad.
 * Sin esto "Danubio" agarra el río, "Quilmes" la ciudad y "Millonarios" el
 * artículo sobre gente rica. Mismo criterio que ya usa el proyecto para
 * cotejar años contra Wikidata (ver CLAUDE.md: MG matcheaba con MGM).
 *
 * Sin descripción no se puede verificar el rubro: se acepta solo si el
 * título ya pasó el filtro estricto de arriba.
 */
const DOMAIN_RE: Record<string, RegExp | null> = {
  team: /f[uú]tbol|futebol|soccer|club|deportiv|equipo|balompi[eé]|sport/i,
  university: /universi|instituc|instituto|educa|ense[nñ]anza|college|school|acad[eé]mi|facultad|casa de estudios|centro de estudios|escuela/i,
  brand: /empresa|marca|compa[nñ][ií]a|fabricante|firma|cadena|multinacional|corporaci|automotriz|automovil|autom[oó]vil|banco|aerol[ií]nea|tienda|minorista|productor|fundici|manufactur|conglomerado|casa de moda|dise[nñ]ador|bebida|cervec|restaurante|comida r[aá]pida|tecnolog|software|videojuego|indumentaria|ropa|calzado|joyer|relojer|lujo/i,
  movie: /pel[ií]cula|film|cinematogr[aá]f|largometraje/i,
  artist: /cantante|m[uú]sic|banda|grupo|actor|actriz|artista|compositor|cantautor|rapero|dj|productor|escritor|poeta|pintor|bailar/i,
  football_player: /futbolista|jugador|deportista|entrenador|arquero|portero|delantero|defensa|centrocampista/i,
  // Figuras históricas: filtro NEGATIVO. Enumerar profesiones en español es
  // una carrera perdida (naturalista, polímata, velocista, baloncestista,
  // poetisa, astronauta...) y cada hueco deja a alguien sin cara. Lo que sí
  // es enumerable es lo que NO es una persona: si la descripción habla de un
  // lugar, una obra o una especie, rechazamos. El nombre completo ya tuvo que
  // matchear el título exacto, así que el riesgo de homónimo es bajo.
  person: null,
};

/** Descripciones que delatan que el artículo NO es de una persona. */
const NOT_A_PERSON =
  /\b(ciudad|localidad|municipio|provincia|departamento|regi[oó]n|pa[ií]s|capital|r[ií]o|lago|monta[nñ]a|isla|barrio|comuna|pel[ií]cula|filme|[aá]lbum|canci[oó]n|novela|libro|revista|peri[oó]dico|especie|g[eé]nero|planta|animal|empresa|marca|club|equipo|universidad|videojuego|serie|banda sonora|cr[aá]ter|asteroide)\b/i;

function matchesDomain(type: string, description?: string | null): boolean {
  if (!description) return true; // sin dato: decide el filtro de título
  if (type === "person") return !NOT_A_PERSON.test(description);
  const re = DOMAIN_RE[type];
  if (!re) return true;
  return re.test(description);
}

/** Vocabulario de países, para leer de qué país habla una descripción. */
const COUNTRY_NAMES = Object.keys(COUNTRY_ISO).map((n) => ({
  norm: normalizeForCompare(n),
  iso: COUNTRY_ISO[n],
}));

/**
 * ¿La descripción habla de OTRO país?
 *
 * El filtro de rubro no alcanza cuando los dos candidatos son del mismo
 * rubro: "Huracán" traía el club uruguayo de Paso de la Arena en vez del de
 * Parque Patricios, porque ambos son "club de fútbol". La descripción de
 * Wikipedia casi siempre nombra el país ("club de fútbol de Argentina"), así
 * que alcanza con cotejarlo.
 *
 * Si la descripción no nombra ningún país conocido, no decide nada (true):
 * el filtro de título ya corrió.
 */
function countryIsCompatible(entityCountry: string | undefined, description?: string | null): boolean {
  if (!entityCountry || !description) return true;
  const expected = COUNTRY_ISO[entityCountry];
  if (!expected) return true;
  const desc = normalizeForCompare(description);
  const mentioned = COUNTRY_NAMES.filter((c) => c.norm && desc.includes(c.norm));
  if (!mentioned.length) return true;
  return mentioned.some((c) => c.iso === expected);
}

/**
 * Títulos que NO representan a la entidad principal (equipos femeninos,
 * filiales, reservas, selecciones) — solo se filtran en el path de búsqueda.
 */
const VARIANT_TITLE =
  /\(femenino\)|\(femenina\)|femenil|femenino$|\(reserva\)|\(filial\)|\(seleccion|\(desambiguaci|\(equipo (b|juvenil|sub|deportivo)\)| \(c\)$|"c"$| ii$| iii$/iu;

/** REST summary: {title, thumb, description} del destino final (sigue redirects). */
async function restSummary(
  title: string
): Promise<{ title: string; thumb: string; description?: string } | null> {
  const url = `${WIKI_REST}/${encodeURIComponent(title)}`;
  const data = await fetchWithRetry(url);
  if (typeof data !== "number") {
    const thumb = (data as any)?.thumbnail?.source;
    const resolved = (data as any)?.title;
    const description = (data as any)?.description;
    if (thumb && resolved) {
      return {
        title: resolved,
        thumb: String(thumb).replace(/\?.*$/, ""),
        description: typeof description === "string" ? description : undefined,
      };
    }
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

/** Commons filename → thumbnail URL en upload.wikimedia.org (path por md5). */
function commonsFileToThumb(filename: string, width = 330): string {
  const f = filename.replace(/ /g, "_");
  const md5 = createHash("md5").update(f).digest("hex");
  const enc = encodeURIComponent(f);
  const base = `https://upload.wikimedia.org/wikipedia/commons`;
  const needsPngSuffix = /\.(svg|pdf|tif|tiff)$/i.test(f);
  const rendered = needsPngSuffix ? `${enc}.png` : enc;
  return `${base}/thumb/${md5[0]}/${md5[0]}${md5[1]}/${enc}/${width}px-${rendered}`;
}

/** Qid de Wikidata para un título de es.wikipedia, o null. */
async function wikidataQid(title: string): Promise<string | null> {
  const url = `${WIKI_ACTION}?action=query&format=json&prop=pageprops&ppprop=wikibase_item&titles=${encodeURIComponent(
    title
  )}`;
  const data = await fetchWithRetry(url);
  if (typeof data === "number") return null;
  const pages = (data as any)?.query?.pages ?? {};
  const page = Object.values(pages as Record<string, any>)[0] as any;
  return page?.pageprops?.wikibase_item ?? null;
}

/** Primer archivo de Commons de una propiedad de imagen de Wikidata (P154 logo, P18 imagen). */
async function wikidataClaimFile(qid: string, property: string): Promise<string | null> {
  const url = `https://www.wikidata.org/w/api.php?action=wbgetclaims&format=json&property=${property}&entity=${qid}`;
  const data = await fetchWithRetry(url);
  if (typeof data === "number") return null;
  const claims = (data as any)?.claims?.[property];
  const file = claims?.[0]?.mainsnak?.datavalue?.value;
  return typeof file === "string" ? file : null;
}

/** Tipos donde lo que queremos es el logo/escudo, no una foto del edificio. */
const LOGO_TYPES = new Set(["brand", "team", "university"]);

async function resolveImage(entry: WikiEntry): Promise<void> {
  const name = searchQuery(entry.name);

  // Términos de búsqueda tipados para desambiguar homónimos ("Apple" la
  // fruta, "Danubio" el río, "Titanic" el barco).
  // El país va PRIMERO en la búsqueda: "Huracán club fútbol" devuelve el
  // club uruguayo de Paso de la Arena antes que el de Parque Patricios.
  const c = entry.country ? ` ${entry.country}` : "";
  const terms =
    entry.type === "team"
      ? [`${name} club fútbol${c}`, `${name} club fútbol`, `${name} club`, name]
      : entry.type === "brand"
        ? [`${name} empresa`, `${name} marca`, name]
        : entry.type === "university"
          ? [`${name} universidad${c}`, `${name} universidad`, name]
          : entry.type === "movie"
            ? [
                entry.year ? `${name} película ${entry.year}` : "",
                `${name} (película)`,
                name,
              ].filter(Boolean)
            : [name];

  // 0. Logo estructurado de Wikidata (P154). Para marcas, clubes y
  // universidades la lead-image de Wikipedia suele ser la sede, el campus o
  // un producto; P154 dice explícitamente "este es el logo de esta entidad",
  // así que es dato, no heurística. Se exige además que la descripción sea
  // del rubro, para no traer el logo de un homónimo.
  if (LOGO_TYPES.has(entry.type)) {
    for (const term of terms) {
      const title = await searchTopTitle(term);
      if (!title || BAD_TITLE.test(title) || VARIANT_TITLE.test(title)) continue;
      if (!isReasonableMatch(entry.name, title)) continue;
      const summary = await restSummary(title);
      if (!matchesDomain(entry.type, summary?.description)) continue;
      if (!countryIsCompatible(entry.country, summary?.description)) continue;
      const qid = await wikidataQid(title);
      if (!qid) continue;
      const file = await wikidataClaimFile(qid, "P154");
      if (file) {
        entry.title = title;
        entry.imageUrl = commonsFileToThumb(file);
        return;
      }
    }
  }

  // 1. Título exacto: REST summary maneja redirects, es el camino más fiable.
  const exact = await restSummary(name);
  if (
    exact?.thumb &&
    isReasonableMatch(entry.name, exact.title) &&
    matchesDomain(entry.type, exact.description) &&
    countryIsCompatible(entry.country, exact.description)
  ) {
    entry.title = exact.title;
    entry.imageUrl = exact.thumb;
    return;
  }

  // 2. Búsqueda con término tipado. El fallback de pageimages va dentro del
  // mismo loop: antes vivía en un paso 3 aparte que NO revalidaba el título
  // ni el rubro, y por ahí se colaban los homónimos.
  for (const term of terms) {
    const title = await searchTopTitle(term);
    if (!title) continue;
    if (VARIANT_TITLE.test(title) || BAD_TITLE.test(title)) continue;
    if (!isReasonableMatch(entry.name, title)) continue;

    const summary = await restSummary(title);
    if (!matchesDomain(entry.type, summary?.description)) continue;
    if (!countryIsCompatible(entry.country, summary?.description)) continue;

    if (summary?.thumb && isReasonableMatch(entry.name, summary.title)) {
      entry.title = summary.title;
      entry.imageUrl = summary.thumb;
      return;
    }

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
  // Las figuras de Sincronicidad Histórica viven en su propio dataset
  // (RAW_FAMOUS_PEOPLE), no en el Atlas, y su tarjeta es justamente sobre la
  // persona: sin retrato la sección entera muestra siluetas. Se resuelven con
  // el mismo pipeline, indexadas por el id que genera FAMOUS_PEOPLE.
  const people: Array<{ id: string; name: string; type: string; year?: number; country?: string }> =
    FAMOUS_PEOPLE.map((p) => ({
      id: p.id,
      name: p.name,
      type: "person",
      year: Number(p.birthDate.slice(0, 4)) || undefined,
      country: p.country,
    }));

  const entities = [
    ...SYMBOLIC_ENTITIES.filter((e) => TARGET_TYPES.has(e.type)).map((e) => ({
      id: e.id,
      name: e.name,
      type: e.type as string,
      year: getPrimaryEvent(e)?.year,
      country: e.country,
    })),
    ...people,
  ];
  // WIKI_TYPES=team,person acota la corrida a esos tipos, para re-resolver
  // solo lo que un filtro nuevo puede cambiar en vez de las 700 entidades.
  const types = process.env.WIKI_TYPES
    ? new Set(process.env.WIKI_TYPES.split(",").map((t) => t.trim()))
    : null;
  const scoped = types ? entities.filter((e) => types.has(e.type)) : entities;
  const sample = process.env.WIKI_SAMPLE ? Number(process.env.WIKI_SAMPLE) : 0;
  const only = process.env.WIKI_ONLY
    ? process.env.WIKI_ONLY.split(",").map((s) => s.trim())
    : [];
  const filtered = only.length
    ? scoped.filter((e) => only.some((n) => normalizeForCompare(e.name).includes(normalizeForCompare(n))))
    : sample
      ? scoped.slice(0, sample)
      : scoped;
  const results: WikiEntry[] = filtered.map((e) => ({
    id: e.id,
    name: e.name,
    type: e.type,
    year: e.year,
    country: e.country,
  }));

  for (let idx = 0; idx < results.length; idx++) {
    const entry = results[idx];
    process.stdout.write(`  [${idx + 1}/${results.length}] ${entry.name} `);
    try {
      await resolveImage(entry);
    } catch (err) {
      entry.reason = `error: ${(err as Error)?.message ?? err}`;
    }
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