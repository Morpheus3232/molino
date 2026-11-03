"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import { useL, type Pick2 } from "@/lib/i18n/useL";
import { useUserContext } from "@/lib/hooks/useUserContext";
import { getCountryISO } from "@/lib/data/country-iso";
import {
  planTrip,
  sameSignDestinations,
  upcomingMonths,
  destinationWindows,
  classifyMonth,
  lunarYearSpan,
  animalOfLunarYear,
  relationToSign,
  daysBetween,
  addDays,
  CLIMATE_THRESHOLDS,
  byPopularity,
  type TravelDestination,
  type TripPlan,
  type MonthVerdict,
  type SignRelation,
} from "@/lib/engines/travelEngine";
import WorldRouteMap from "./WorldRouteMap";
import { ArrowUpRight } from "lucide-react";
import { countFunnel } from "@/lib/analytics/funnel";
import { bookingSearchUrl, flightsSearchUrl, hasBookingAffiliate } from "@/lib/travel/links";

const MONTHS_ES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG_ES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const MONTHS_LONG_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function fmtDate(L: Pick2, d: string, withYear = true): string {
  const [y, m, dd] = d.split("-").map(Number);
  return L.locale === "en"
    ? `${MONTHS_EN[m - 1]} ${dd}${withYear ? `, ${y}` : ""}`
    : `${dd} ${MONTHS_ES[m - 1]}${withYear ? ` ${y}` : ""}`;
}

function fmtYM(L: Pick2, ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return L.locale === "en" ? `${MONTHS_EN[m - 1]} ${y}` : `${MONTHS_ES[m - 1]} ${y}`;
}

/** "126 M", "1,7 M", "850 mil". */
function fmtArrivals(L: Pick2, n: number): string {
  const es = L.locale !== "en";
  if (n >= 10e6) return `${Math.round(n / 1e6)} M`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1).replace(".", es ? "," : ".")} M`;
  return es ? `${Math.round(n / 1e3)} mil` : `${Math.round(n / 1e3)}k`;
}

function fmtKm(L: Pick2, km: number): string {
  return km.toLocaleString(L.locale === "en" ? "en-US" : "es-AR");
}

const RELATION_TEXT = (L: Pick2): Record<SignRelation, string> => ({
  mismo: L("tu propio signo", "your own sign"),
  amigo: L("uno de tus dos amigos (三合)", "one of your two friends (三合)"),
  enemigo: L("tu enemigo (六冲): lo que conviene evitar", "your enemy (六冲): what's best avoided"),
  otro: L("el resto del ciclo: no dice nada especial", "the rest of the cycle: nothing special"),
});

const FEMENINOS = new Set(["Rata", "Cabra", "Serpiente"]);
/** "Año del Caballo", "Año de la Cabra". */
function yearOf(L: Pick2, animal: string): string {
  return L.locale === "en" ? `Year of the ${L.t(animal)}` : `Año ${FEMENINOS.has(animal) ? "de la" : "del"} ${animal}`;
}

/** Orden de preferencia de un año chino para viajar: tu signo, tus amigos, el resto, tu enemigo. */
const RELATION_RANK: Record<SignRelation, number> = { mismo: 0, amigo: 1, otro: 2, enemigo: 3 };

function verdictText(L: Pick2, v: MonthVerdict): string {
  const cls = v.cls === "ideal" ? L("ideal", "ideal") : v.cls === "bueno" ? L("bueno", "good") : L("mejor evitar", "best avoided");
  const why =
    v.reason === "lluvia" ? L("lluvias", "rain") : v.reason === "frio" ? L("frío", "cold") : v.reason === "calor" ? L("calor", "heat") : null;
  return `${cls}${why ? ` (${why})` : ""} · ${Math.round(v.t)} °C · ${v.p} mm`;
}

function Mark({ cls }: { cls: "ideal" | "bueno" | "evitar" }) {
  if (cls === "ideal") return <span className="inline-block w-2.5 h-2.5 rounded-full bg-vermilion align-middle" aria-hidden="true" />;
  if (cls === "bueno") return <span className="inline-block w-2.5 h-2.5 rounded-full border-2 border-vermilion align-middle" aria-hidden="true" />;
  return <span className="inline-block w-1 h-1 rounded-full bg-ink/30 align-middle" aria-hidden="true" />;
}

interface Props {
  /** Todos los países con fecha exacta, capital y clima (se filtran por signo acá). */
  destinations: TravelDestination[];
  /** Signo activo de la página. */
  animal: string;
  /** Signo del perfil, si hay. */
  profileAnimal?: string | null;
}

export default function TravelPlanner({ destinations, animal, profileAnimal }: Props) {
  const L = useL();
  const { country } = useUserContext();
  const [today, setToday] = useState<string | null>(null);
  const [originISO, setOriginISO] = useState<string>("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [thinking, setThinking] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => setToday(todayISO()), []);
  useEffect(() => {
    if (originISO) return;
    const iso = country ? getCountryISO(country) : undefined;
    const fallback = L.locale === "en" ? "US" : "AR";
    setOriginISO(iso && destinations.some((d) => d.iso === iso) ? iso : fallback);
  }, [country, destinations, originISO, L.locale]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  // Cambiar de signo invalida el viaje armado (salvo el que viene en la dirección).
  const restored = useRef(false);
  useEffect(() => {
    if (restored.current) setPlan(null);
  }, [animal]);
  // Un viaje compartido (?desde=AR&ida=…&vuelta=…) se arma solo al abrir la página.
  useEffect(() => {
    if (restored.current || !today || !originISO) return;
    restored.current = true;
    const q = new URLSearchParams(window.location.search);
    const ida = q.get("ida");
    const vuelta = q.get("vuelta");
    const desde = q.get("desde");
    const iso = /^\d{4}-\d{2}-\d{2}$/;
    if (ida && vuelta && iso.test(ida) && iso.test(vuelta)) {
      if (desde && destinations.some((d) => d.iso === desde)) setOriginISO(desde);
      setStart(ida);
      setEnd(vuelta);
      arm({ start: ida, end: vuelta, originISO: desde ?? undefined, instant: true });
    }
    if (window.location.hash === "#viaje") {
      requestAnimationFrame(() => document.getElementById("viaje")?.scrollIntoView({ block: "start" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today, originISO]);

  const mine = useMemo(() => sameSignDestinations(animal, destinations), [animal, destinations]);
  const byName = useMemo(
    () => [...destinations].sort((a, b) => L.t(a.name).localeCompare(L.t(b.name), L.locale === "en" ? "en" : "es")),
    [destinations, L],
  );
  const origin = destinations.find((d) => d.iso === originISO) ?? null;

  const upcoming = useMemo(() => (today ? upcomingMonths(today) : null), [today]);
  const windows = useMemo(
    () => (upcoming ? mine.map((d) => destinationWindows(d, upcoming.months)) : []),
    [mine, upcoming],
  );

  const capName = (d: TravelDestination) => (L.locale === "en" ? d.capital.en : d.capital.es);

  // Los mejores meses para el signo: los que tienen más países ideales (sin
  // contar el de origen). Un clic arma un viaje de dos semanas ese mes.
  const bestMonthsForSign = useMemo(() => {
    if (!upcoming || !today) return [];
    return upcoming.months
      .map((m) => ({
        m,
        ideal: mine.filter((d) => d.iso !== originISO && classifyMonth(d.climate, m.month0).cls === "ideal").length,
      }))
      .filter((x) => x.ideal > 0)
      .sort((a, b) => b.ideal - a.ideal || a.m.ym.localeCompare(b.m.ym))
      .slice(0, 3)
      .sort((a, b) => a.m.ym.localeCompare(b.m.ym));
  }, [upcoming, today, mine, originISO]);

  function quickPick(ym: string) {
    const first = `${ym}-01`;
    const s0 = today && today > first ? addDays(today, 1) : first;
    const e0 = addDays(s0, 14);
    setStart(s0);
    setEnd(e0);
    arm({ start: s0, end: e0 });
  }

  function arm(over?: { start: string; end: string; originISO?: string; instant?: boolean }) {
    setError(null);
    const o = over?.originISO ? destinations.find((d) => d.iso === over.originISO) ?? origin : origin;
    const s0 = over?.start ?? start;
    const e0 = over?.end ?? end;
    if (!o) return setError(L("Elegí desde dónde salís.", "Choose where you leave from."));
    if (!s0 || !e0) return setError(L("Poné la fecha de ida y la de vuelta.", "Enter your departure and return dates."));
    const n = daysBetween(s0, e0);
    if (n < 2) return setError(L("La vuelta tiene que ser al menos dos días después de la ida.", "The return must be at least two days after departure."));
    if (n > 120) return setError(L("Hasta 120 días por viaje.", "Up to 120 days per trip."));
    timers.current.forEach(clearTimeout);
    const result = planTrip({
      userAnimal: animal,
      destinations,
      origin: { iso: o.iso, name: o.name, city: capName(o), lat: o.capital.lat, lon: o.capital.lon },
      start: s0,
      end: e0,
    });
    if (!over?.instant) countFunnel("travel_plan_built");
    // El viaje queda en la dirección: se puede guardar o compartir tal cual.
    try {
      const u = new URL(window.location.href);
      u.searchParams.set("animal", animal);
      u.searchParams.set("desde", o.iso);
      u.searchParams.set("ida", s0);
      u.searchParams.set("vuelta", e0);
      u.hash = "viaje";
      window.history.replaceState(null, "", u.toString());
    } catch {
      /* sin URL no pasa nada: el viaje igual se muestra */
    }
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || over?.instant) {
      setPlan(result);
      return;
    }
    setPlan(null);
    setThinking(0);
    timers.current = [
      setTimeout(() => setThinking(1), 700),
      setTimeout(() => setThinking(2), 1400),
      setTimeout(() => setThinking(3), 2100),
      setTimeout(() => {
        setThinking(null);
        setPlan(result);
      }, 2800),
    ];
  }

  const thinkingLines = [
    L(`Buscando países ${L.t(animal)} con fecha exacta… ${mine.length}`, `Looking for ${L.t(animal)} countries with an exact date… ${mine.length}`),
    L("Poniendo primero los más visitados…", "Putting the most visited first…"),
    L(`Ordenando los vuelos desde ${origin ? capName(origin) : ""}…`, `Ordering the flights from ${origin ? capName(origin) : ""}…`),
    L("Repartiendo las noches…", "Splitting the nights…"),
  ];

  const highlight = mine.map((d) => ({ iso: d.iso, name: d.name, lat: d.capital.lat, lon: d.capital.lon }));
  const mapStops = plan?.stops.map((s) => ({ iso: s.dest.iso, name: s.dest.name, lat: s.dest.capital.lat, lon: s.dest.capital.lon })) ?? [];
  const mapLegs = plan?.legs.map((l) => ({ from: [l.from.lon, l.from.lat] as [number, number], to: [l.to.lon, l.to.lat] as [number, number] })) ?? [];
  const mapOrigin = plan && origin ? { iso: origin.iso, name: origin.name, lat: origin.capital.lat, lon: origin.capital.lon } : null;

  const isMine = profileAnimal === animal;

  return (
    <section id="viaje" aria-labelledby="viaje-titulo" className="border-t-2 border-ink py-10 sm:py-14 scroll-mt-20">
      <p className="label-caps text-sm text-vermilion mb-3">{L("Viaje por tu signo", "Travel by your sign")}</p>
      <h2 id="viaje-titulo" className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.02] text-foreground max-w-3xl">
        {L(<>Adónde viajar, solo entre países <em>{L.t(animal)}</em></>, <>Where to travel, only among <em>{L.t(animal)}</em> countries</>)}
      </h2>
      <div className="mt-5 max-w-2xl space-y-3 text-lg text-foreground/85 leading-snug">
        <p>
          {L(
            `Cada país tiene un signo por la fecha exacta de su independencia o su constitución. Acá solo entran los ${mine.length} países ${L.t(animal)}${isMine ? ", tu signo" : ""}: ni amigos ni enemigo, el mismo signo.`,
            `Each country has a sign from the exact date of its independence or constitution. Only the ${mine.length} ${L.t(animal)} countries${isMine ? " — your sign —" : ""} are included here: not friends, not enemy, the same sign.`,
          )}
        </p>
        <p className="text-base text-muted">
          {L(
            "El viaje propone primero los países más visitados del signo (llegadas de turistas internacionales, ONU Turismo, 2019) y después mira la distancia. ",
            "The trip suggests the sign's most visited countries first (international tourist arrivals, UN Tourism, 2019) and then looks at distance. ",
          )}
          {L(
            `El cuándo sale del clima de cada capital: temperatura media y lluvia de cada mes, promedio 2001–2025 (NASA POWER). Ideal: entre ${CLIMATE_THRESHOLDS.ideal.tMin} y ${CLIMATE_THRESHOLDS.ideal.tMax} °C y hasta ${CLIMATE_THRESHOLDS.ideal.pMax} mm. Bueno: entre ${CLIMATE_THRESHOLDS.bueno.tMin} y ${CLIMATE_THRESHOLDS.bueno.tMax} °C y hasta ${CLIMATE_THRESHOLDS.bueno.pMax} mm. El resto, mejor evitar.`,
            `The when comes from each capital's climate: average temperature and rainfall per month, 2001–2025 average (NASA POWER). Ideal: between ${CLIMATE_THRESHOLDS.ideal.tMin} and ${CLIMATE_THRESHOLDS.ideal.tMax} °C and up to ${CLIMATE_THRESHOLDS.ideal.pMax} mm. Good: between ${CLIMATE_THRESHOLDS.bueno.tMin} and ${CLIMATE_THRESHOLDS.bueno.tMax} °C and up to ${CLIMATE_THRESHOLDS.bueno.pMax} mm. Otherwise, best avoided.`,
          )}
        </p>
      </div>

      {/* FORMULARIO */}
      <form
        className="mt-8 grid grid-cols-1 sm:grid-cols-[1.4fr_1fr_1fr_auto] gap-3 items-end"
        onSubmit={(e) => {
          e.preventDefault();
          arm();
        }}
      >
        <label className="block">
          <span className="label-micro block mb-1.5">{L("Salís desde", "Leaving from")}</span>
          <select
            value={originISO}
            onChange={(e) => {
              setOriginISO(e.target.value);
              setPlan(null);
            }}
            className="w-full h-12 px-3 border border-ink/25 bg-background text-foreground"
          >
            {byName.map((d) => (
              <option key={d.iso} value={d.iso}>
                {L.t(d.name)}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="label-micro block mb-1.5">{L("Ida", "Departure")}</span>
          <input
            type="date"
            value={start}
            min={today ?? undefined}
            onChange={(e) => {
              setStart(e.target.value);
              if (e.target.value && (!end || end <= e.target.value)) setEnd(addDays(e.target.value, 14));
            }}
            className="w-full h-12 px-3 border border-ink/25 bg-background text-foreground"
          />
        </label>
        <label className="block">
          <span className="label-micro block mb-1.5">{L("Vuelta", "Return")}</span>
          <input
            type="date"
            value={end}
            min={start || today || undefined}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full h-12 px-3 border border-ink/25 bg-background text-foreground"
          />
        </label>
        <button
          type="submit"
          disabled={thinking !== null}
          className="h-12 px-6 bg-vermilion text-white text-base hover:bg-vermilion-hover disabled:opacity-60 transition-colors"
        >
          {L("Armar el viaje", "Plan the trip")}
        </button>
      </form>
      {error && (
        <p role="alert" className="mt-3 text-base text-vermilion">
          {error}
        </p>
      )}

      {bestMonthsForSign.length > 0 && (
        <div className="mt-5">
          <p className="text-sm text-muted">
            {L(`O elegí uno de los meses con más países ${L.t(animal)} ideales:`, `Or pick one of the months with the most ideal ${L.t(animal)} countries:`)}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {bestMonthsForSign.map(({ m, ideal }) => (
              <button
                key={m.ym}
                type="button"
                onClick={() => quickPick(m.ym)}
                disabled={thinking !== null}
                className="px-4 py-2.5 border border-ink/25 text-base text-foreground hover:border-ink hover:bg-card transition-colors"
              >
                <span className="capitalize">{fmtYM(L, m.ym)}</span>
                <span className="text-muted">
                  {" · "}
                  {L(`${ideal} ${ideal === 1 ? "país ideal" : "países ideales"}`, `${ideal} ideal ${ideal === 1 ? "country" : "countries"}`)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PENSANDO */}
      <div aria-live="polite">
        {thinking !== null && (
          <ol className="mt-8 space-y-1.5 text-lg">
            {thinkingLines.slice(0, thinking + 1).map((line, i) => (
              <li key={i} className={i === thinking ? "text-foreground" : "text-muted"}>
                <span className="font-display italic mr-2">{["I", "II", "III", "IV"][i]}.</span>
                {line}
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* MAPA */}
      <div className="mt-10 border border-ink/15 p-2 sm:p-4">
        <WorldRouteMap
          highlight={highlight}
          stops={mapStops}
          origin={mapOrigin}
          legs={mapLegs}
          caption={
            plan
              ? L(
                  `En tinta, los países ${L.t(animal)}. En bermellón, tu ruta: ${plan.stops.length} ${plan.stops.length === 1 ? "país" : "países"}, ${fmtKm(L, plan.totalKm)} km de vuelo en línea recta, ida y vuelta.`,
                  `In ink, the ${L.t(animal)} countries. In vermilion, your route: ${plan.stops.length} ${plan.stops.length === 1 ? "country" : "countries"}, ${fmtKm(L, plan.totalKm)} km of straight-line flights, round trip.`,
                )
              : L(`En tinta, los ${mine.length} países ${L.t(animal)}.`, `In ink, the ${mine.length} ${L.t(animal)} countries.`)
          }
        />
      </div>

      {/* VIAJE ARMADO */}
      {plan && (
        <PlanView
          plan={plan}
          animal={animal}
          originName={origin ? capName(origin) : ""}
          capName={capName}
          cityOf={(iso, fallback) => {
            const d = destinations.find((x) => x.iso === iso);
            return d ? capName(d) : fallback;
          }}
          cityEn={(iso, fallback) => destinations.find((x) => x.iso === iso)?.capital.en ?? fallback}
        />
      )}

      {/* ESTE AÑO CHINO Y EL PRÓXIMO */}
      {upcoming && (
        <YearsView animal={animal} upcoming={upcoming} windows={windows} />
      )}

      <p className="mt-10 text-sm text-muted max-w-2xl leading-relaxed">
        {L(
          "Una lectura simbólica, no una agencia de viajes: no hay precios ni horarios de vuelos, las distancias son en línea recta entre capitales y el clima es un promedio, no un pronóstico. Antes de viajar, revisá las recomendaciones oficiales de tu cancillería sobre cada destino.",
          "A symbolic reading, not a travel agency: there are no prices or flight times, distances are straight lines between capitals and the climate is an average, not a forecast. Before traveling, check your government's official advice for each destination.",
        )}
      </p>
    </section>
  );
}

/** Calendario .ics con un evento de día completo por destino (RFC 5545). */
function buildIcs(L: Pick2, plan: TripPlan, capName: (d: TravelDestination) => string): string {
  const esc = (t: string) => t.replace(/\\/g, "\\\\").replace(/[,;]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");
  const d8 = (d: string) => d.replace(/-/g, "");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//molino.app//Viaje por tu signo//ES", "CALSCALE:GREGORIAN"];
  plan.stops.forEach((s, i) => {
    const climate = s.months.map((m) => verdictText(L, m.verdict)).join(" / ");
    lines.push(
      "BEGIN:VEVENT",
      `UID:${d8(s.arrive)}-${s.dest.iso}-${i}@molino.app`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${d8(s.arrive)}`,
      `DTEND;VALUE=DATE:${d8(s.depart)}`,
      `SUMMARY:${esc(`${L.t(s.dest.name)} · ${capName(s.dest)}`)}`,
      `DESCRIPTION:${esc(`${climate}. ${s.dest.originLabel ? L.t(s.dest.originLabel) + " · " : ""}${fmtDate(L, s.dest.originDate)}. molino.app`)}`,
      "END:VEVENT",
    );
  });
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function PlanActions({ plan, capName }: { plan: TripPlan; capName: (d: TravelDestination) => string }) {
  const L = useL();
  const [copied, setCopied] = useState(false);
  function download() {
    const blob = new Blob([buildIcs(L, plan, capName)], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `viaje-${plan.start}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* el enlace sigue en la barra de direcciones */
    }
  }
  return (
    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-base">
      <button type="button" onClick={copy} className="underline underline-offset-4 hover:no-underline">
        {copied ? L("Enlace copiado", "Link copied") : L("Copiar el enlace de este viaje", "Copy this trip's link")}
      </button>
      <button type="button" onClick={download} className="underline underline-offset-4 hover:no-underline">
        {L("Agregar a mi calendario (.ics)", "Add to my calendar (.ics)")}
      </button>
    </div>
  );
}

function FlightLink({ from, to, date }: { from: string; to: string; date: string }) {
  const L = useL();
  return (
    <a
      href={flightsSearchUrl({ fromCity: from, toCity: to, date, locale: L.locale === "en" ? "en" : "es" })}
      target="_blank"
      rel="noopener"
      onClick={() => countFunnel("travel_click_flights")}
      className="underline underline-offset-2 hover:text-vermilion"
    >
      {L("buscar vuelo", "find flights")}
      <ArrowUpRight className="inline w-3.5 h-3.5 ml-0.5 -mt-0.5" aria-hidden="true" />
    </a>
  );
}

function PlanView({
  plan,
  animal,
  originName,
  capName,
  cityOf,
  cityEn,
}: {
  plan: TripPlan;
  animal: string;
  originName: string;
  capName: (d: TravelDestination) => string;
  cityOf: (iso: string, fallback: string) => string;
  cityEn: (iso: string, fallback: string) => string;
}) {
  const L = useL();
  const MONTHS_LONG = L.locale === "en" ? MONTHS_LONG_EN : MONTHS_LONG_ES;
  const rel = RELATION_TEXT(L);

  if (plan.stops.length === 0) {
    return (
      <p className="mt-8 text-lg">
        {L(
          `No hay otro país ${L.t(animal)} fuera del tuyo: con este signo, el viaje es en casa.`,
          `There's no other ${L.t(animal)} country besides yours: with this sign, the trip is at home.`,
        )}
      </p>
    );
  }

  return (
    <div className="mt-10">
      <h3 className="font-display text-2xl text-foreground">
        {L(
          `${plan.nights} noches · ${plan.stops.length} ${plan.stops.length === 1 ? "país" : "países"} · ${fmtKm(L, plan.totalKm)} km`,
          `${plan.nights} nights · ${plan.stops.length} ${plan.stops.length === 1 ? "country" : "countries"} · ${fmtKm(L, plan.totalKm)} km`,
        )}
      </h3>
      <p className="text-base text-muted mt-1">
        {L(
          `Del ${fmtDate(L, plan.start)} al ${fmtDate(L, plan.end)}, saliendo y volviendo a ${originName}.`,
          `From ${fmtDate(L, plan.start)} to ${fmtDate(L, plan.end)}, leaving from and returning to ${originName}.`,
        )}
        {plan.originIsSameSign &&
          L(" Tu país también es de este signo: no cuenta como destino porque es casa.", " Your country is also of this sign: it doesn't count as a destination because it's home.")}
      </p>
      <PlanActions plan={plan} capName={capName} />
      {plan.noGoodClimate && (
        <p className="mt-3 text-base text-vermilion">
          {L(
            "En esas fechas el clima no acompaña en ninguna parada. Si podés mover las fechas, más abajo está, mes por mes, cuándo conviene ir a cada una.",
            "On those dates the weather isn't great at any stop. If you can move the dates, below you'll find, month by month, when each one is best.",
          )}
        </p>
      )}

      <ol className="mt-6 border-t border-ink/15">
        {plan.stops.map((s, i) => {
          const leg = plan.legs[i];
          return (
            <li key={s.dest.iso} className="border-b border-ink/15 py-5">
              <p className="text-sm text-muted">
                ✈ {cityOf(leg.from.iso, leg.from.name)} → {cityOf(leg.to.iso, leg.to.name)} · {fmtKm(L, leg.km)} km · {fmtDate(L, leg.date, false)}
                {" · "}
                <FlightLink from={cityEn(leg.from.iso, leg.from.name)} to={cityEn(leg.to.iso, leg.to.name)} date={leg.date} />
              </p>
              <div className="mt-2 flex items-start gap-4">
                <span className="shrink-0 w-9 h-9 rounded-full bg-vermilion text-white flex items-center justify-center text-lg" aria-hidden="true">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xl text-foreground">
                    <Link href={`/affinity/country/${s.dest.entityId}`} className="hover:text-vermilion">
                      {s.dest.flag && <span className="flag-emoji mr-1.5">{s.dest.flag}</span>}
                      {L.t(s.dest.name)}
                    </Link>
                    <span className="text-muted text-base"> · {capName(s.dest)}</span>
                  </h4>
                  <p className="text-base text-foreground/85">
                    {L(
                      `${fmtDate(L, s.arrive, false)} → ${fmtDate(L, s.depart, false)} · ${s.nights} noches`,
                      `${fmtDate(L, s.arrive, false)} → ${fmtDate(L, s.depart, false)} · ${s.nights} nights`,
                    )}
                    {s.dest.arrivals != null && (
                      <span className="text-muted">
                        {L(
                          ` · ${fmtArrivals(L, s.dest.arrivals)} de turistas al año`,
                          ` · ${fmtArrivals(L, s.dest.arrivals)} tourists a year`,
                        )}
                      </span>
                    )}
                  </p>
                  <ul className="mt-1.5 space-y-0.5 text-base">
                    {s.months.map((m) => (
                      <li key={m.month0} className="flex items-center gap-2">
                        <Mark cls={m.verdict.cls} />
                        <span>
                          <span className="capitalize">{MONTHS_LONG[m.month0]}</span>: {verdictText(L, m.verdict)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-sm text-muted">
                    {s.dest.originLabel && <span>{L.t(s.dest.originLabel)} · </span>}
                    {fmtDate(L, s.dest.originDate)}
                    {s.dest.originNote && <> — {L.t(s.dest.originNote)}</>}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {L(
                      `Año chino de la estadía: ${L.t(s.chineseYear.animal)}, ${rel[s.chineseYear.relation]}.`,
                      `Chinese year of the stay: ${L.t(s.chineseYear.animal)}, ${rel[s.chineseYear.relation]}.`,
                    )}
                    {s.chineseYearOnDepart &&
                      L(
                        ` Cruzás el Año Nuevo chino: al irte ya es ${L.t(s.chineseYearOnDepart.animal)}, ${rel[s.chineseYearOnDepart.relation]}.`,
                        ` You cross the Chinese New Year: when you leave it's already ${L.t(s.chineseYearOnDepart.animal)}, ${rel[s.chineseYearOnDepart.relation]}.`,
                      )}
                  </p>
                  <a
                    href={bookingSearchUrl({
                      city: capName(s.dest),
                      country: L.locale === "en" ? L.t(s.dest.name) : s.dest.name,
                      checkin: s.arrive,
                      checkout: s.depart,
                      locale: L.locale === "en" ? "en" : "es",
                    })}
                    target="_blank"
                    rel={hasBookingAffiliate() ? "sponsored noopener" : "noopener"}
                    onClick={() => countFunnel("travel_click_hotel")}
                    className="mt-2 inline-flex items-center gap-1.5 text-base text-foreground underline underline-offset-4 hover:text-vermilion"
                  >
                    {L(`Buscar alojamiento en ${capName(s.dest)}`, `Find a place to stay in ${capName(s.dest)}`)}
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </li>
          );
        })}
        {(() => {
          const last = plan.legs[plan.legs.length - 1];
          return (
            <li className="py-4 text-sm text-muted">
              ✈ {cityOf(last.from.iso, last.from.name)} → {cityOf(last.to.iso, last.to.name)} · {fmtKm(L, last.km)} km · {fmtDate(L, last.date, false)} · {L("vuelta a casa", "back home")}
              {" · "}
              <FlightLink from={cityEn(last.from.iso, last.from.name)} to={cityEn(last.to.iso, last.to.name)} date={last.date} />
            </li>
          );
        })()}
      </ol>
      <p className="mt-3 text-sm text-muted max-w-2xl">
        {hasBookingAffiliate()
          ? L(
              "Alojamiento: enlace de afiliado de Booking.com. Si reservás desde acá, molino cobra una comisión; a vos no te cuesta más. Vuelos: búsqueda en Google Flights, sin comisión. Los enlaces solo llevan ciudad y fechas.",
              "Stays: Booking.com affiliate link. If you book from here, molino earns a commission at no extra cost to you. Flights: a Google Flights search, no commission. The links only carry city and dates.",
            )
          : L(
              "Alojamiento en Booking.com y vuelos en Google Flights. Los enlaces solo llevan ciudad y fechas.",
              "Stays on Booking.com and flights on Google Flights. The links only carry city and dates.",
            )}
      </p>

      {plan.skipped.length > 0 && (
        <div className="mt-6">
          <h4 className="label-micro mb-2">{L("Quedaron afuera en esas fechas", "Left out on those dates")}</h4>
          <ul className="text-base text-foreground/85 space-y-1">
            {plan.skipped.map((x) => (
              <li key={x.dest.iso}>
                {L.t(x.dest.name)}
                <span className="text-muted">
                  {" — "}
                  {x.reason === "noches"
                    ? L("entre los más visitados, pero no entró en la cantidad de noches o queda lejos de la ruta", "among the most visited, but it didn't fit the nights or is far from the route")
                    : L("hay otros más visitados", "others are more visited")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function YearsView({
  animal,
  upcoming,
  windows,
}: {
  animal: string;
  upcoming: ReturnType<typeof upcomingMonths>;
  windows: ReturnType<typeof destinationWindows>[];
}) {
  const L = useL();
  const MONTHS = L.locale === "en" ? MONTHS_EN : MONTHS_ES;
  const rel = RELATION_TEXT(L);
  const years = [upcoming.current, upcoming.next].map((ly) => {
    const a = animalOfLunarYear(ly);
    return {
      ly,
      animal: a,
      relation: relationToSign(animal, a),
      span: lunarYearSpan(ly),
      months: upcoming.months.filter((m) => m.lunarYear === ly),
    };
  });
  const bestRank = Math.min(...years.map((y) => RELATION_RANK[y.relation]));
  const tie = years.every((y) => RELATION_RANK[y.relation] === bestRank);
  const isBest = (ly: number) => !tie && RELATION_RANK[years.find((y) => y.ly === ly)!.relation] === bestRank;

  // Una fila por destino, los más visitados primero (el mismo orden del viaje).
  const rows = windows
    .map((w) => {
      const verdicts = upcoming.months.map((m) => classifyMonth(w.dest.climate, m.month0));
      return {
        d: w.dest,
        verdicts,
        ideal: verdicts.filter((v) => v.cls === "ideal").length,
        bueno: verdicts.filter((v) => v.cls === "bueno").length,
      };
    })
    .sort((a, b) => byPopularity(a.d, b.d));

  const firstOfNext = upcoming.months.findIndex((m) => m.lunarYear === upcoming.next);

  return (
    <section className="mt-16" aria-labelledby="viaje-anios">
      <p className="label-caps text-sm text-muted">{L("Cuándo ir", "When to go")}</p>
      <h3 id="viaje-anios" className="mt-1 font-display text-3xl text-foreground">
        {L("Este año chino y el próximo", "This Chinese year and the next")}
      </h3>
      <p className="mt-2 text-base text-foreground/80 max-w-2xl">
        {L(
          `Cada año chino tiene su signo, y se cruza con el tuyo con la misma regla del sitio. Abajo, los países ${animal} de más a menos visitado, con el clima de cada mes en los dos años.`,
          `Each Chinese year has its sign, and it meets yours under the site's same rule. Below, the ${L.t(animal)} countries from most to least visited, with each month's weather across both years.`,
        )}
      </p>

      {/* Los dos años, uno al lado del otro */}
      <div className="mt-6 grid sm:grid-cols-2 border-t-2 border-ink">
        {years.map((y, i) => {
          const best = isBest(y.ly);
          return (
            <div key={y.ly} className={`py-5 ${i === 1 ? "sm:border-l sm:pl-6 border-t sm:border-t-0 border-ink/15" : "sm:pr-6"}`}>
              <p className="text-sm text-muted">
                {y.span ? `${fmtDate(L, y.span.start)} – ${fmtDate(L, y.span.end)}` : y.ly}
                {y.ly === upcoming.current && <span className="label-caps ml-2 text-foreground">{L("en curso", "current")}</span>}
              </p>
              <h4 className="mt-1 font-display text-2xl text-foreground">
                {yearOf(L, y.animal)}
                {best && <span className="label-caps ml-3 align-middle text-sm text-vermilion">{L("el más afín", "the closest")}</span>}
              </h4>
              <p className="mt-1 text-base text-foreground/80">
                {L(`Para tu signo: ${rel[y.relation]}.`, `For your sign: ${rel[y.relation]}.`)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Calendario: países × meses */}
      <div className="mt-2 overflow-x-auto border-t border-ink/15 -mx-4 px-4 sm:mx-0 sm:px-0">
        <table className="w-full border-collapse text-sm" aria-describedby="viaje-anios-leyenda">
          <thead>
            <tr>
              <th scope="col" className="sticky left-0 z-10 bg-background" />
              {years.map((y) => (
                <th
                  key={y.ly}
                  scope="colgroup"
                  colSpan={y.months.length}
                  className={`pt-4 pb-1 text-left font-normal label-caps text-xs ${y.ly === upcoming.next ? "pl-2 border-l-2 border-ink" : ""} ${isBest(y.ly) ? "text-vermilion" : "text-muted"}`}
                >
                  {L.t(y.animal)}
                </th>
              ))}
              <th scope="col" className="pt-4 pb-1 pl-3 text-right font-normal label-caps text-xs text-muted">
                {L("Turistas al año", "Tourists a year")}
              </th>
            </tr>
            <tr className="border-b border-ink">
              <th scope="col" className="sticky left-0 z-10 bg-background pb-2 pr-3 text-left font-normal text-muted">
                {L("País", "Country")}
              </th>
              {upcoming.months.map((m, i) => (
                <th
                  key={m.ym}
                  scope="col"
                  title={fmtYM(L, m.ym)}
                  className={`pb-2 px-0.5 text-center font-normal text-muted ${i === firstOfNext ? "border-l-2 border-ink" : ""}`}
                >
                  <span className="block leading-tight">{MONTHS[m.month0]}</span>
                  <span className={`block text-[10px] leading-tight ${m.month0 === 0 || i === 0 ? "text-foreground" : "invisible"}`}>
                    {m.ym.slice(0, 4)}
                  </span>
                </th>
              ))}
              <th scope="col" className="sr-only">
                {L("Llegadas de turistas internacionales", "International tourist arrivals")}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.d.iso} className="border-b border-ink/10">
                <th scope="row" className="sticky left-0 z-10 bg-background py-1.5 pr-3 text-left font-normal whitespace-nowrap">
                  <Link href={`/affinity/country/${r.d.entityId}`} className="text-base hover:text-vermilion">
                    {r.d.flag && <span className="flag-emoji mr-1.5">{r.d.flag}</span>}
                    {L.t(r.d.name)}
                  </Link>
                </th>
                {r.verdicts.map((v, i) => {
                  const m = upcoming.months[i];
                  const label = `${fmtYM(L, m.ym)}: ${verdictText(L, v)}`;
                  return (
                    <td key={m.ym} className={`px-0.5 py-1.5 ${i === firstOfNext ? "border-l-2 border-ink" : ""}`} title={label}>
                      <span
                        role="img"
                        aria-label={label}
                        className={`block mx-auto h-5 w-full min-w-[1.4rem] ${
                          v.cls === "ideal" ? "bg-ink" : v.cls === "bueno" ? "bg-ink/25" : "bg-ink/[0.04]"
                        }`}
                      />
                    </td>
                  );
                })}
                <td className="py-1.5 pl-3 text-right tabular-nums text-base whitespace-nowrap">
                  {r.d.arrivals != null ? fmtArrivals(L, r.d.arrivals) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div id="viaje-anios-leyenda" className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3.5 w-5 bg-ink" aria-hidden="true" />
          {L(
            `ideal (${CLIMATE_THRESHOLDS.ideal.tMin}–${CLIMATE_THRESHOLDS.ideal.tMax} °C, hasta ${CLIMATE_THRESHOLDS.ideal.pMax} mm)`,
            `ideal (${CLIMATE_THRESHOLDS.ideal.tMin}–${CLIMATE_THRESHOLDS.ideal.tMax} °C, up to ${CLIMATE_THRESHOLDS.ideal.pMax} mm)`,
          )}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3.5 w-5 bg-ink/25" aria-hidden="true" />
          {L(
            `bueno (${CLIMATE_THRESHOLDS.bueno.tMin}–${CLIMATE_THRESHOLDS.bueno.tMax} °C, hasta ${CLIMATE_THRESHOLDS.bueno.pMax} mm)`,
            `good (${CLIMATE_THRESHOLDS.bueno.tMin}–${CLIMATE_THRESHOLDS.bueno.tMax} °C, up to ${CLIMATE_THRESHOLDS.bueno.pMax} mm)`,
          )}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3.5 w-5 bg-ink/[0.04] border border-ink/10" aria-hidden="true" />
          {L("mejor evitar", "best avoided")}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted max-w-2xl">
        {L(
          "Países ordenados de más a menos visitado (llegadas de turistas internacionales, ONU Turismo vía Banco Mundial, 2019 o último año previo; sin dato, al final). Clima medio de la capital, 2001–2025. La raya separa los dos años chinos; cada mes cuenta para el año de su día 15. En la computadora, pasá el cursor por un mes para ver temperatura y lluvia; la ficha de cada país las muestra todas.",
          "Countries ordered from most to least visited (international tourist arrivals, UN Tourism via the World Bank, 2019 or latest earlier year; no data, last). Average weather in the capital, 2001–2025. The rule separates the two Chinese years; each month counts toward the year of its 15th day. On a computer, hover over a month to see temperature and rainfall; each country page shows them all.",
        )}
      </p>
    </section>
  );
}
