/**
 * Viaje por tu signo — motor puro, sin I/O.
 *
 * Regla: los destinos son SOLO países de tu mismo signo (signo contra signo,
 * por la fecha exacta de independencia o constitución del registro). El
 * clima no entra en la afinidad: decide CUÁNDO ir, no ADÓNDE. Así no se
 * mezcla otra capa dentro del puntaje de afinidad (ver CLAUDE.md).
 *
 * Clima: promedio mensual 2001–2025 de la capital (NASA POWER, MERRA-2):
 * temperatura media a 2 m y lluvia del mes. Cada mes se clasifica con
 * umbrales fijos y a la vista — `classifyMonth` — para que el lector pueda
 * comprobar por qué un mes es "ideal" o "mejor evitar".
 *
 * Años: el año chino de cada tramo sale de la tabla de Año Nuevo
 * (`getLunarYear`) y su relación con tu signo usa las mismas tres casillas
 * del sitio: tu propio signo, tus dos amigos (San He) y tu enemigo (Liu
 * Chong). Todo lo demás es "resto del ciclo".
 */

import { ANIMALS, type Animal } from "@/lib/data/animalRelations";
import { relacionCon, type MapRelation } from "@/lib/engines/personalMapEngine";
import { getLunarYear, CHINESE_NEW_YEAR_DATES } from "@/lib/data/chinese-new-year";

// ════════════════════════════════════════════════════
// TIPOS
// ════════════════════════════════════════════════════

export type MonthClass = "ideal" | "bueno" | "evitar";
export type MonthReason = "frio" | "calor" | "lluvia" | null;
/** Las cuatro casillas del sitio (misma regla que Mi Mapa). */
export type SignRelation = MapRelation;

/** Promedio mensual de la capital: temperatura media (°C) y lluvia (mm/mes), enero = 0. */
export interface ClimateNormals {
  t: number[];
  p: number[];
}

export interface Capital {
  es: string;
  en: string;
  lat: number;
  lon: number;
}

export interface TravelDestination {
  iso: string;
  /** Nombre del país (en castellano, como en el Atlas). */
  name: string;
  /** Slug de la ficha en /affinity/country/[slug]. */
  entityId: string;
  animal: string;
  /** Fecha exacta del evento primario (YYYY-MM-DD). Sin ella el país no entra. */
  originDate: string;
  originLabel?: string;
  originNote?: string;
  flag?: string;
  capital: Capital;
  climate: ClimateNormals;
  /** Llegadas de turistas internacionales (ONU Turismo, 2019 o último año previo). Sin dato, va al final. */
  arrivals?: number;
  arrivalsYear?: number;
}

export interface MonthVerdict {
  cls: MonthClass;
  reason: MonthReason;
  t: number;
  p: number;
}

// ════════════════════════════════════════════════════
// CLIMA
// ════════════════════════════════════════════════════

/**
 * Umbrales — iguales para todos los destinos y explicados en la página.
 * Ideal: media entre 16 y 26 °C y hasta 100 mm de lluvia en el mes.
 * Bueno: media entre 10 y 29 °C y hasta 180 mm.
 * El resto, mejor evitar: frío (<10 °C), calor (>29 °C) o lluvias (>180 mm).
 */
export const CLIMATE_THRESHOLDS = {
  ideal: { tMin: 16, tMax: 26, pMax: 100 },
  bueno: { tMin: 10, tMax: 29, pMax: 180 },
} as const;

export function classifyMonth(c: ClimateNormals, month0: number): MonthVerdict {
  const t = c.t[month0];
  const p = c.p[month0];
  const I = CLIMATE_THRESHOLDS.ideal;
  const B = CLIMATE_THRESHOLDS.bueno;
  if (t >= I.tMin && t <= I.tMax && p <= I.pMax) return { cls: "ideal", reason: null, t, p };
  if (t >= B.tMin && t <= B.tMax && p <= B.pMax) {
    // Bueno: se dice qué le falta para ser ideal.
    const reason: MonthReason = p > I.pMax ? "lluvia" : t < I.tMin ? "frio" : "calor";
    return { cls: "bueno", reason, t, p };
  }
  const reason: MonthReason = t < B.tMin ? "frio" : t > B.tMax ? "calor" : "lluvia";
  return { cls: "evitar", reason, t, p };
}

const CLASS_POINTS: Record<MonthClass, number> = { ideal: 2, bueno: 1, evitar: -2 };

/** Meses ideales primero, después los buenos; dentro de cada grupo, en orden de calendario. */
export function bestMonths(c: ClimateNormals): { ideal: number[]; bueno: number[] } {
  const ideal: number[] = [];
  const bueno: number[] = [];
  for (let m = 0; m < 12; m++) {
    const v = classifyMonth(c, m).cls;
    if (v === "ideal") ideal.push(m);
    else if (v === "bueno") bueno.push(m);
  }
  return { ideal, bueno };
}

// ════════════════════════════════════════════════════
// SIGNOS Y AÑOS
// ════════════════════════════════════════════════════

export function animalOfLunarYear(lunarYear: number): Animal {
  return ANIMALS[(((lunarYear - 1900) % 12) + 12) % 12];
}

export function relationToSign(user: string, other: string): SignRelation {
  return relacionCon(user, other);
}

/** Primer y último día del año chino que empieza en `lunarYear`. */
export function lunarYearSpan(lunarYear: number): { start: string; end: string } | null {
  const start = CHINESE_NEW_YEAR_DATES[lunarYear];
  const next = CHINESE_NEW_YEAR_DATES[lunarYear + 1];
  if (!start || !next) return null;
  return { start, end: addDays(next, -1) };
}

export interface ChineseYearInfo {
  lunarYear: number;
  animal: Animal;
  relation: SignRelation;
  span: { start: string; end: string } | null;
}

export function chineseYearOf(date: string, userAnimal: string): ChineseYearInfo {
  const lunarYear = getLunarYear(date);
  const animal = animalOfLunarYear(lunarYear);
  return { lunarYear, animal, relation: relationToSign(userAnimal, animal), span: lunarYearSpan(lunarYear) };
}

// ════════════════════════════════════════════════════
// FECHAS (UTC, sin zona: todo es YYYY-MM-DD)
// ════════════════════════════════════════════════════

function toUTC(d: string): number {
  const [y, m, dd] = d.split("-").map(Number);
  return Date.UTC(y, m - 1, dd);
}
function fromUTC(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}
export function addDays(d: string, n: number): string {
  return fromUTC(toUTC(d) + n * 86400000);
}
export function daysBetween(a: string, b: string): number {
  return Math.round((toUTC(b) - toUTC(a)) / 86400000);
}

// ════════════════════════════════════════════════════
// DESTINOS
// ════════════════════════════════════════════════════

/** Solo países del mismo signo, con fecha exacta, capital y clima cargados. */
/** Más visitados primero; sin dato de llegadas, al final y por nombre. */
export function byPopularity(a: TravelDestination, b: TravelDestination): number {
  return (b.arrivals ?? -1) - (a.arrivals ?? -1) || a.name.localeCompare(b.name, "es");
}

/**
 * Peso de un destino por lo visitado: escala logarítmica desde 100.000
 * llegadas al año (0) — 1 millón vale 1, 10 millones 2, 100 millones 3.
 */
export function popularityPoints(d: TravelDestination): number {
  return d.arrivals ? Math.max(0, Math.log10(d.arrivals / 1e5)) : 0;
}

export function sameSignDestinations(userAnimal: string, all: TravelDestination[]): TravelDestination[] {
  return all
    .filter((d) => d.animal === userAnimal && !!d.originDate && !!d.climate && !!d.capital)
    .sort(byPopularity);
}

// ════════════════════════════════════════════════════
// VENTANAS: ESTE AÑO CHINO Y EL PRÓXIMO
// ════════════════════════════════════════════════════

export interface MonthSlot {
  /** YYYY-MM */
  ym: string;
  month0: number;
  lunarYear: number;
}

/**
 * Meses que quedan del año chino en curso y todos los del siguiente, cada uno
 * asignado al año chino de su día 15 (el Año Nuevo cae entre el 21 de enero y
 * el 21 de febrero, así que el mes de febrero puede quedar de un lado o del otro).
 */
export function upcomingMonths(today: string): { current: number; next: number; months: MonthSlot[] } {
  const current = getLunarYear(today);
  const next = current + 1;
  const months: MonthSlot[] = [];
  let y = Number(today.slice(0, 4));
  let m = Number(today.slice(5, 7)) - 1;
  for (let i = 0; i < 30; i++) {
    const ym = `${y}-${String(m + 1).padStart(2, "0")}`;
    const ly = getLunarYear(`${ym}-15`);
    if (ly > next) break;
    if (ly >= current) months.push({ ym, month0: m, lunarYear: ly });
    m++;
    if (m === 12) { m = 0; y++; }
  }
  return { current, next, months };
}

export interface DestinationWindows {
  dest: TravelDestination;
  /** Por año chino: meses ideales y buenos (YYYY-MM) dentro de ese año. */
  byYear: Record<number, { ideal: string[]; bueno: string[] }>;
}

export function destinationWindows(dest: TravelDestination, slots: MonthSlot[]): DestinationWindows {
  const byYear: DestinationWindows["byYear"] = {};
  for (const s of slots) {
    const v = classifyMonth(dest.climate, s.month0).cls;
    const bucket = (byYear[s.lunarYear] ??= { ideal: [], bueno: [] });
    if (v === "ideal") bucket.ideal.push(s.ym);
    else if (v === "bueno") bucket.bueno.push(s.ym);
  }
  return { dest, byYear };
}

// ════════════════════════════════════════════════════
// RUTA
// ════════════════════════════════════════════════════

/** Distancia de círculo máximo, en km. */
export function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.min(1, Math.sqrt(h))));
}

/** Cuántos días de la estadía caen en cada mes del calendario. */
export function nightsByMonth(arrive: string, nights: number): Map<number, number> {
  const out = new Map<number, number>();
  for (let i = 0; i < nights; i++) {
    const m = Number(addDays(arrive, i).slice(5, 7)) - 1;
    out.set(m, (out.get(m) ?? 0) + 1);
  }
  return out;
}

/** Puntaje climático promedio de una estadía: +2 ideal, +1 bueno, −2 evitar. */
export function stayClimateScore(c: ClimateNormals, arrive: string, nights: number): number {
  if (nights <= 0) return 0;
  let s = 0;
  for (const [m, n] of nightsByMonth(arrive, nights)) s += CLASS_POINTS[classifyMonth(c, m).cls] * n;
  return s / nights;
}

export interface TripOrigin {
  iso: string;
  name: string;
  lat: number;
  lon: number;
  city?: string;
}

export interface TripStop {
  dest: TravelDestination;
  arrive: string;
  depart: string;
  nights: number;
  /** Veredicto de cada mes que toca la estadía. */
  months: { month0: number; nights: number; verdict: MonthVerdict }[];
  climateScore: number;
  chineseYear: ChineseYearInfo;
  /** Si la estadía cruza el Año Nuevo chino, el año del día de salida. */
  chineseYearOnDepart?: ChineseYearInfo;
}

export interface LegEnd {
  /** País del extremo (para mostrar la capital en el idioma de la página). */
  iso: string;
  name: string;
  lat: number;
  lon: number;
}

export interface TripLeg {
  from: LegEnd;
  to: LegEnd;
  date: string;
  km: number;
}

export interface SkippedDestination {
  dest: TravelDestination;
  score: number;
  /** Peor mes de la ventana, para explicar por qué quedó afuera. */
  worst: MonthVerdict;
  /** "noches": estaba entre los más visitados pero no entró en las noches; "menos-visitado": hubo otros más visitados. */
  reason: "noches" | "menos-visitado";
}

export interface TripPlan {
  start: string;
  end: string;
  nights: number;
  stops: TripStop[];
  legs: TripLeg[];
  totalKm: number;
  skipped: SkippedDestination[];
  /** Ninguna parada elegida tiene buen clima en sus fechas. */
  noGoodClimate: boolean;
  /** El origen es del mismo signo: no se cuenta como destino (es casa). */
  originIsSameSign: boolean;
}

export const MAX_STOPS = 6;
export const MIN_NIGHTS_PER_STOP = 4;
/**
 * Al elegir la ruta pesan, en este orden: lo visitado del destino, la
 * distancia y, último, el clima. Los candidatos son los 8 más visitados del
 * signo; entre ellos, un punto de popularidad (×10 llegadas) vale 6000 km y
 * un punto de clima por noche, 600 km por parada. El clima no descarta a
 * nadie: se muestra mes por mes para que la persona decida.
 */
const KM_PER_POPULARITY_POINT = 6000;
const KM_PER_CLIMATE_POINT = 600;
const POOL = 8;

function combinations<T>(arr: T[], k: number): T[][] {
  const out: T[][] = [];
  const rec = (start: number, acc: T[]) => {
    if (acc.length === k) { out.push(acc.slice()); return; }
    for (let i = start; i < arr.length; i++) { acc.push(arr[i]); rec(i + 1, acc); acc.pop(); }
  };
  rec(0, []);
  return out;
}

function permutations<T>(arr: T[]): T[][] {
  if (arr.length <= 1) return [arr.slice()];
  const out: T[][] = [];
  arr.forEach((x, i) => {
    for (const p of permutations([...arr.slice(0, i), ...arr.slice(i + 1)])) out.push([x, ...p]);
  });
  return out;
}

function splitNights(total: number, n: number): number[] {
  const base = Math.floor(total / n);
  const extra = total % n;
  return Array.from({ length: n }, (_, i) => base + (i < extra ? 1 : 0));
}

/**
 * Arma el viaje: elige destinos del mismo signo, los más visitados primero
 * (el clima solo desempata y se informa mes por mes),
 * reparte las noches y ordena los vuelos desde el país de origen, con vuelta
 * a casa. Búsqueda exhaustiva sobre los 8 más visitados
 * (como mucho 56 combinaciones × 720 órdenes): determinista y rápida.
 */
export function planTrip(opts: {
  userAnimal: string;
  destinations: TravelDestination[];
  origin: TripOrigin;
  start: string;
  end: string;
  maxStops?: number;
}): TripPlan {
  const { userAnimal, origin, start, end } = opts;
  const nights = Math.max(1, daysBetween(start, end));
  const all = sameSignDestinations(userAnimal, opts.destinations);
  const originIsSameSign = all.some((d) => d.iso === origin.iso);
  const candidates = all.filter((d) => d.iso !== origin.iso);

  const empty: TripPlan = { start, end, nights, stops: [], legs: [], totalKm: 0, skipped: [], noGoodClimate: false, originIsSameSign };
  if (candidates.length === 0) return empty;

  // Puntaje del clima sobre toda la ventana del viaje (sin importar el orden).
  const windowScore = (d: TravelDestination) => stayClimateScore(d.climate, start, nights);
  // Más visitados primero (sameSignDestinations ya viene en ese orden).
  const scored = candidates.map((d) => ({ d, s: windowScore(d), km: haversineKm(origin, d.capital) }));

  const pool = scored.slice(0, POOL);
  const inPool = new Set(pool.map((x) => x.d.iso));

  const maxStops = Math.min(opts.maxStops ?? MAX_STOPS, MAX_STOPS);
  const k = Math.max(1, Math.min(pool.length, maxStops, Math.floor(nights / MIN_NIGHTS_PER_STOP) || 1));
  const nightsSplit = splitNights(nights, k);

  // Precálculo: puntos de clima acumulados por noche del viaje para cada
  // candidato, y distancias entre todos. Así cada orden se evalúa con sumas,
  // sin recorrer fechas: un viaje de 120 noches pasa de ~1 s a milisegundos.
  const poolD = pool.map((x) => x.d);
  const monthOfNight = Array.from({ length: nights }, (_, i) => Number(addDays(start, i).slice(5, 7)) - 1);
  const prefix = poolD.map((d) => {
    const acc = new Float64Array(nights + 1);
    for (let i = 0; i < nights; i++) acc[i + 1] = acc[i] + CLASS_POINTS[classifyMonth(d.climate, monthOfNight[i]).cls];
    return acc;
  });
  const pop = poolD.map(popularityPoints);
  const fromOrigin = poolD.map((d) => haversineKm(origin, d.capital));
  const between = poolD.map((a) => poolD.map((b) => haversineKm(a.capital, b.capital)));
  const offsets = nightsSplit.reduce<number[]>((acc, n, i) => (acc.push(i === 0 ? 0 : acc[i - 1] + nightsSplit[i - 1]), acc), []);

  let best: { order: number[]; value: number } | null = null;
  for (const combo of combinations(poolD.map((_, i) => i), k)) {
    for (const order of permutations(combo)) {
      let km = fromOrigin[order[0]] + fromOrigin[order[order.length - 1]];
      let climate = 0;
      let popularity = 0;
      for (let i = 0; i < order.length; i++) {
        const o = offsets[i];
        climate += prefix[order[i]][o + nightsSplit[i]] - prefix[order[i]][o];
        popularity += pop[order[i]];
        if (i > 0) km += between[order[i - 1]][order[i]];
      }
      const value = popularity * KM_PER_POPULARITY_POINT + (climate / nights) * KM_PER_CLIMATE_POINT * k - km;
      if (!best || value > best.value + 1e-9) best = { order, value };
    }
  }
  const bestOrder = best!.order.map((i) => poolD[i]);

  const stops: TripStop[] = [];
  const legs: TripLeg[] = [];
  let date = start;
  let prev: LegEnd = { iso: origin.iso, name: origin.city ?? origin.name, lat: origin.lat, lon: origin.lon };
  bestOrder.forEach((d, i) => {
    const n = nightsSplit[i];
    const depart = addDays(date, n);
    const to: LegEnd = { iso: d.iso, name: d.capital.es, lat: d.capital.lat, lon: d.capital.lon };
    legs.push({ from: prev, to, date, km: haversineKm(prev, to) });
    const months = [...nightsByMonth(date, n)].map(([month0, nn]) => ({ month0, nights: nn, verdict: classifyMonth(d.climate, month0) }));
    const cyA = chineseYearOf(date, userAnimal);
    const cyB = chineseYearOf(depart, userAnimal);
    stops.push({
      dest: d,
      arrive: date,
      depart,
      nights: n,
      months,
      climateScore: stayClimateScore(d.climate, date, n),
      chineseYear: cyA,
      chineseYearOnDepart: cyB.lunarYear !== cyA.lunarYear ? cyB : undefined,
    });
    date = depart;
    prev = to;
  });
  const home: LegEnd = { iso: origin.iso, name: origin.city ?? origin.name, lat: origin.lat, lon: origin.lon };
  legs.push({ from: prev, to: home, date, km: haversineKm(prev, home) });

  const chosen = new Set(stops.map((s) => s.dest.iso));
  const skipped: SkippedDestination[] = scored
    .filter((x) => !chosen.has(x.d.iso))
    .map((x) => {
      let worst: MonthVerdict | null = null;
      for (const [m] of nightsByMonth(start, nights)) {
        const v = classifyMonth(x.d.climate, m);
        if (!worst || CLASS_POINTS[v.cls] < CLASS_POINTS[worst.cls]) worst = v;
      }
      return { dest: x.d, score: x.s, worst: worst!, reason: inPool.has(x.d.iso) ? ("noches" as const) : ("menos-visitado" as const) };
    });

  const noGoodClimate = stops.every((x) => x.climateScore < 1);

  return {
    start,
    end,
    nights,
    stops,
    legs,
    totalKm: legs.reduce((s, l) => s + l.km, 0),
    skipped,
    noGoodClimate,
    originIsSameSign,
  };
}
