"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { geoNaturalEarth1, geoPath, geoGraticule10, geoDistance } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, Geometry } from "geojson";
import { Maximize2, Minimize2 } from "lucide-react";
import { useL } from "@/lib/i18n/useL";
import { useRouter } from "@/lib/i18n/navigation";

const W = 1000;
const H = 520;

export interface MapPoint {
  iso: string;
  name: string;
  lat: number;
  lon: number;
  /** Para la tarjeta al pasar el mouse (solo los países del signo). */
  capital?: string;
  flag?: string;
  /** Línea secundaria de la tarjeta, ya formateada ("97 M de turistas al año"). */
  detail?: string;
  /** Ficha del país. */
  href?: string;
}

interface Props {
  /** Países del signo: se pintan en tinta. */
  highlight: MapPoint[];
  /** Paradas del viaje en orden (numeradas). */
  stops?: MapPoint[];
  origin?: MapPoint | null;
  /** Tramos de vuelo: [lon, lat] → [lon, lat]. */
  legs?: { from: [number, number]; to: [number, number] }[];
  caption?: string;
}

let topoCache: Promise<Topology> | null = null;
function loadWorld(): Promise<Topology> {
  topoCache ??= fetch("/geo/world-110m.json").then((r) => r.json());
  return topoCache;
}

type Box = [number, number, number, number]; // x, y, w, h
const FULL: Box = [0, 0, W, H];

/** Caja que encierra los puntos con margen, con la proporción del mapa. */
function fitBox(points: [number, number][], pad = 70): Box {
  if (points.length === 0) return FULL;
  let [x0, y0, x1, y1] = [Infinity, Infinity, -Infinity, -Infinity];
  for (const [x, y] of points) {
    x0 = Math.min(x0, x);
    y0 = Math.min(y0, y);
    x1 = Math.max(x1, x);
    y1 = Math.max(y1, y);
  }
  let w = Math.max(x1 - x0 + pad * 2, 320);
  let h = Math.max(y1 - y0 + pad * 2, 320 * (H / W));
  if (w / h > W / H) h = w * (H / W);
  else w = h * (W / H);
  if (w >= W || h >= H) return FULL;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const x = Math.min(Math.max(cx - w / 2, 0), W - w);
  const y = Math.min(Math.max(cy - h / 2, 0), H - h);
  return [x, y, w, h];
}

function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const m = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!m) return;
    setReduce(m.matches);
    const on = () => setReduce(m.matches);
    m.addEventListener?.("change", on);
    return () => m.removeEventListener?.("change", on);
  }, []);
  return reduce;
}

/**
 * Mapamundi del viaje por tu signo (Natural Earth 1:110m), como lámina de
 * libro: mar gris claro, tierra en gris, los países del signo en tinta. Al
 * pasar el mouse por uno de esos países aparece su tarjeta (capital y cuánto
 * se lo visita) y con un clic se abre su ficha. Cuando hay viaje, la cámara
 * se acerca a la ruta, los vuelos se dibujan uno detrás de otro por círculo
 * máximo y un avioncito los recorre en vuelta. Con "reducir movimiento"
 * todo queda quieto.
 */
export default function WorldRouteMap({ highlight, stops = [], origin = null, legs = [], caption }: Props) {
  const L = useL();
  const router = useRouter();
  const reduce = useReducedMotion();
  const [countries, setCountries] = useState<Feature<Geometry, object>[] | null>(null);
  const [hover, setHover] = useState<{ p: MapPoint; x: number; y: number } | null>(null);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    loadWorld()
      .then((topo) => {
        if (!alive) return;
        const obj = topo.objects.c as GeometryCollection;
        const fc = feature(topo, obj) as unknown as { features: Feature<Geometry, object>[] };
        setCountries(fc.features);
      })
      .catch(() => setCountries([]));
    return () => {
      alive = false;
    };
  }, []);

  const { path, project } = useMemo(() => {
    const projection = geoNaturalEarth1().fitExtent(
      [
        [4, 4],
        [W - 4, H - 4],
      ],
      { type: "Sphere" },
    );
    return { path: geoPath(projection), project: (lon: number, lat: number) => projection([lon, lat]) as [number, number] | null };
  }, []);

  const byIso = useMemo(() => new Map(highlight.map((h) => [h.iso, h])), [highlight]);
  const drawn = useMemo(() => new Set((countries ?? []).map((f) => String(f.id))), [countries]);
  const sphere = path({ type: "Sphere" }) ?? "";
  const graticule = path(geoGraticule10()) ?? "";

  // Ruta completa (origen → paradas → origen) para el avioncito, y largo de
  // cada tramo para que el dibujo dure lo que mide.
  const routeKey = legs.map((l) => `${l.from.join(",")}>${l.to.join(",")}`).join("|");
  const route = useMemo(() => {
    if (legs.length === 0) return null;
    const coords: [number, number][] = [legs[0].from, ...legs.map((l) => l.to)];
    const d = path({ type: "LineString", coordinates: coords }) ?? "";
    const arcs = legs.map((l) => geoDistance(l.from, l.to));
    const total = arcs.reduce((a, b) => a + b, 0) || 1;
    return { d, arcs, total };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey, path]);

  // Cámara: con viaje, se acerca a la ruta; sin viaje, el mundo entero.
  const target = useMemo<Box>(() => {
    if (legs.length === 0) return FULL;
    const pts = [origin, ...stops].filter(Boolean).map((p) => project(p!.lon, p!.lat)).filter(Boolean) as [number, number][];
    return fitBox(pts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey]);
  const [zoomed, setZoomed] = useState(true);
  const goal = zoomed ? target : FULL;
  const [box, setBox] = useState<Box>(FULL);
  const boxRef = useRef<Box>(FULL);
  useEffect(() => {
    const from = boxRef.current;
    if (reduce) {
      boxRef.current = goal;
      setBox(goal);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const dur = 1100;
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      const k = ease(t);
      const b = from.map((v, i) => v + (goal[i] - v) * k) as Box;
      boxRef.current = b;
      setBox(b);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goal[0], goal[1], goal[2], goal[3], reduce]);

  // Lo que mide un píxel de pantalla en unidades del mapa: los trazos y los
  // números no engordan al acercarse.
  // Se mide el ancho real del mapa: en un celular los números y los nombres
  // quedan un poco más chicos que en la computadora, pero nunca diminutos.
  const [px, setPx] = useState(W);
  useEffect(() => {
    const el = wrap.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([e]) => setPx(e.contentRect.width || W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const k = (box[2] / px) * Math.min(1.15, Math.max(0.72, px / 760));
  const canZoom = legs.length > 0 && target !== FULL;

  // Paradas que caen casi encima (Berlín y Varsovia vistas desde lejos): se
  // separan en pantalla con un hilo hasta el lugar real, y cada nombre busca
  // un lado libre; si no hay ninguno, queda solo en la tarjeta del número.
  const layout = useMemo(() => {
    const R = 13; // radio del círculo en píxeles, con su borde
    const items = stops
      .map((s, i) => {
        const pt = project(s.lon, s.lat);
        return pt ? { s, i, pt, px: [pt[0] / k, pt[1] / k] as [number, number] } : null;
      })
      .filter(Boolean) as { s: MapPoint; i: number; pt: [number, number]; px: [number, number] }[];
    const pos = items.map((it) => [...it.px] as [number, number]);
    for (let iter = 0; iter < 60; iter++) {
      let moved = false;
      for (let a = 0; a < pos.length; a++)
        for (let b = a + 1; b < pos.length; b++) {
          let dx = pos[b][0] - pos[a][0];
          let dy = pos[b][1] - pos[a][1];
          let d = Math.hypot(dx, dy);
          if (d >= R * 2 + 2) continue;
          if (d < 0.01) {
            dx = 1;
            dy = 0.4;
            d = Math.hypot(dx, dy);
          }
          const push = (R * 2 + 2 - d) / 2;
          pos[a][0] -= (dx / d) * push;
          pos[a][1] -= (dy / d) * push;
          pos[b][0] += (dx / d) * push;
          pos[b][1] += (dy / d) * push;
          moved = true;
        }
      if (!moved) break;
    }
    type Rect = [number, number, number, number];
    const taken: Rect[] = pos.map(([x, y]) => [x - R, y - R, x + R, y + R]);
    const hit = (r: Rect) => taken.some((t) => r[0] < t[2] && r[2] > t[0] && r[1] < t[3] && r[3] > t[1]);
    return items.map((it, n) => {
      const [x, y] = pos[n];
      const w = (it.s.capital?.length ?? 0) * 6.1 + 4;
      const h = 16;
      const options: { x: number; y: number; anchor: "start" | "end" | "middle"; rect: Rect }[] = [
        { x: 16, y: 0, anchor: "start", rect: [x + 14, y - h / 2, x + 16 + w, y + h / 2] },
        { x: -16, y: 0, anchor: "end", rect: [x - 16 - w, y - h / 2, x - 14, y + h / 2] },
        { x: 0, y: -22, anchor: "middle", rect: [x - w / 2, y - 22 - h / 2, x + w / 2, y - 22 + h / 2] },
        { x: 0, y: 22, anchor: "middle", rect: [x - w / 2, y + 22 - h / 2, x + w / 2, y + 22 + h / 2] },
      ];
      const pick = options.find((o) => !hit(o.rect));
      if (pick) taken.push(pick.rect);
      return { s: it.s, i: it.i, pt: it.pt, at: [x * k, y * k] as [number, number], label: pick ?? null };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey, stops, k]);

  function showTip(p: MapPoint, e: React.MouseEvent | React.FocusEvent) {
    const r = wrap.current?.getBoundingClientRect();
    if (!r) return;
    if ("clientX" in e) setHover({ p, x: e.clientX - r.left, y: e.clientY - r.top });
    else {
      const el = (e.target as Element).getBoundingClientRect();
      setHover({ p, x: el.left + el.width / 2 - r.left, y: el.top - r.top });
    }
  }

  const legDur = 0.9; // segundos por tramo promedio
  const totalDur = Math.max(1.6, legDur * legs.length);

  return (
    <figure className="w-full">
      <div ref={wrap} className="relative overflow-hidden border border-ink/15 bg-card" onMouseLeave={() => setHover(null)}>
        <svg
          viewBox={box.join(" ")}
          role="img"
          aria-label={caption ?? L("Mapamundi con los países de tu signo", "World map with the countries of your sign")}
          className="block w-full h-auto select-none"
          style={{ aspectRatio: `${W} / ${H}` }}
        >
          <defs>
            <radialGradient id="mapa-mar" cx="50%" cy="42%" r="75%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#EDEDED" />
            </radialGradient>
            <filter id="mapa-sombra" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy={1.2 * k} stdDeviation={1.4 * k} floodColor="#0A0A0A" floodOpacity="0.25" />
            </filter>
            <style>{`
              @keyframes mapa-trazo { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
              @keyframes mapa-pulso { 0% { transform: scale(1); opacity: .55; } 100% { transform: scale(2.6); opacity: 0; } }
              @keyframes mapa-entra { from { opacity: 0; transform: scale(.4); } to { opacity: 1; transform: scale(1); } }
              .mapa-pais { transition: fill .25s ease, opacity .25s ease; }
              .mapa-pais-signo { cursor: pointer; }
              .mapa-pais-signo:hover, .mapa-pais-signo:focus-visible { fill: var(--color-vermilion); outline: none; }
              @media (prefers-reduced-motion: reduce) {
                .mapa-anim, .mapa-pulso, .mapa-parada { animation: none !important; stroke-dashoffset: 0 !important; opacity: 1 !important; }
              }
            `}</style>
          </defs>

          {/* Mar y retícula */}
          <path d={sphere} fill="url(#mapa-mar)" stroke="#BDBDBD" strokeWidth={1 * k} />
          <path d={graticule} fill="none" stroke="#0A0A0A" strokeOpacity={0.07} strokeWidth={0.6 * k} />

          {/* Países */}
          {countries?.map((f) => {
            const id = String(f.id);
            const p = byIso.get(id);
            const d = path(f) ?? "";
            if (!p) return <path key={id} d={d} className="mapa-pais" fill="#DADADA" stroke="#FFFFFF" strokeWidth={0.5 * k} />;
            return (
              <path
                key={id}
                d={d}
                className="mapa-pais mapa-pais-signo"
                fill="var(--color-foreground)"
                stroke="#FFFFFF"
                strokeWidth={0.6 * k}
                tabIndex={0}
                role="link"
                aria-label={`${L.t(p.name)}${p.capital ? ` · ${p.capital}` : ""}`}
                onMouseMove={(e) => showTip(p, e)}
                onMouseLeave={() => setHover(null)}
                onFocus={(e) => showTip(p, e)}
                onBlur={() => setHover(null)}
                onClick={() => p.href && router.push(p.href)}
                onKeyDown={(e) => e.key === "Enter" && p.href && router.push(p.href)}
              />
            );
          })}

          {/* Países del signo demasiado chicos para la escala: un punto en la capital. */}
          {countries &&
            highlight
              .filter((h) => !drawn.has(h.iso))
              .map((h) => {
                const pt = project(h.lon, h.lat);
                if (!pt) return null;
                return (
                  <circle
                    key={`dot-${h.iso}`}
                    cx={pt[0]}
                    cy={pt[1]}
                    r={3.4 * k}
                    className="mapa-pais mapa-pais-signo"
                    fill="var(--color-foreground)"
                    stroke="#FFFFFF"
                    strokeWidth={1 * k}
                    tabIndex={0}
                    role="link"
                    aria-label={L.t(h.name)}
                    onMouseMove={(e) => showTip(h, e)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={(e) => showTip(h, e)}
                    onBlur={() => setHover(null)}
                    onClick={() => h.href && router.push(h.href)}
                  />
                );
              })}

          {/* Vuelos: debajo, un halo blanco; arriba, el trazo bermellón que se dibuja tramo a tramo. */}
          {route &&
            legs.map((leg, i) => {
              const d = path({ type: "LineString", coordinates: [leg.from, leg.to] }) ?? "";
              const before = route.arcs.slice(0, i).reduce((a, b) => a + b, 0) / route.total;
              const share = route.arcs[i] / route.total;
              return (
                <g key={`leg-${routeKey}-${i}`}>
                  <path d={d} fill="none" stroke="#FFFFFF" strokeWidth={5 * k} strokeLinecap="round" strokeOpacity={0.9} />
                  <path
                    d={d}
                    pathLength={1}
                    fill="none"
                    stroke="var(--color-vermilion)"
                    strokeWidth={2.2 * k}
                    strokeLinecap="round"
                    strokeDasharray="1"
                    className="mapa-anim"
                    style={{
                      strokeDashoffset: 1,
                      animation: `mapa-trazo ${(share * totalDur).toFixed(2)}s cubic-bezier(.45,0,.2,1) ${(0.5 + before * totalDur).toFixed(2)}s forwards`,
                    }}
                  />
                </g>
              );
            })}

          {/* El avioncito recorre la ruta en vuelta, cuando ya está dibujada. */}
          {route && !reduce && route.d && (
            <g key={`plane-${routeKey}`} style={{ opacity: 0, animation: `mapa-entra .4s ease ${(0.5 + totalDur).toFixed(2)}s forwards` }}>
              <g>
                <path
                  d="M0,-1.2 L4.2,-1.2 L7.6,-5.6 L9.2,-5.6 L7.4,-1.2 L10.4,-1.2 L11.8,-3 L12.8,-3 L12,0 L12.8,3 L11.8,3 L10.4,1.2 L7.4,1.2 L9.2,5.6 L7.6,5.6 L4.2,1.2 L0,1.2 Q-1.4,0 0,-1.2 Z"
                  transform={`scale(${1.25 * k}) translate(-6 0) rotate(180 6 0)`}
                  fill="var(--color-foreground)"
                  stroke="#FFFFFF"
                  strokeWidth={0.6}
                  filter="url(#mapa-sombra)"
                />
                <animateMotion dur={`${Math.max(6, legs.length * 2.4)}s`} begin={`${(0.5 + totalDur).toFixed(2)}s`} repeatCount="indefinite" rotate="auto" path={route.d} />
              </g>
            </g>
          )}

          {/* Casa: un cuadrado. */}
          {origin &&
            (() => {
              const pt = project(origin.lon, origin.lat);
              if (!pt) return null;
              return (
                <g transform={`translate(${pt[0]} ${pt[1]}) scale(${k})`}>
                  <rect x={-7} y={-7} width={14} height={14} fill="#FFFFFF" stroke="var(--color-foreground)" strokeWidth={2.2} filter="url(#mapa-sombra)" />
                  <rect x={-2.5} y={-2.5} width={5} height={5} fill="var(--color-foreground)" />
                  <title>{L.t(origin.name)}</title>
                </g>
              );
            })()}

          {/* Paradas numeradas, con su nombre y un pulso suave. */}
          {layout.map(({ s, i, pt, at, label }) => {
            const before = route ? route.arcs.slice(0, i + 1).reduce((a, b) => a + b, 0) / route.total : 0;
            const delay = (0.5 + before * totalDur).toFixed(2);
            return (
              <g key={`stop-${routeKey}-${s.iso}`}>
                {(Math.abs(at[0] - pt[0]) > 2 * k || Math.abs(at[1] - pt[1]) > 2 * k) && (
                  <g className="mapa-parada" style={{ opacity: 0, animation: `mapa-entra .45s ease ${delay}s forwards` }}>
                    <line x1={pt[0]} y1={pt[1]} x2={at[0]} y2={at[1]} stroke="var(--color-foreground)" strokeWidth={0.9 * k} />
                    <circle cx={pt[0]} cy={pt[1]} r={2.2 * k} fill="var(--color-foreground)" stroke="#FFFFFF" strokeWidth={0.8 * k} />
                  </g>
                )}
                <g transform={`translate(${at[0]} ${at[1]}) scale(${k})`}>
                <g className="mapa-parada" style={{ opacity: 0, transformOrigin: "0 0", animation: `mapa-entra .45s cubic-bezier(.3,1.4,.5,1) ${delay}s forwards` }}>
                  <circle r={11} fill="var(--color-vermilion)" className="mapa-pulso" style={{ transformOrigin: "0 0", animation: `mapa-pulso 2.4s ease-out ${delay}s infinite` }} />
                  <circle r={11.5} fill="var(--color-vermilion)" stroke="#FFFFFF" strokeWidth={2.2} filter="url(#mapa-sombra)" />
                  <text textAnchor="middle" dy="0.36em" fontSize={12.5} fill="#FFFFFF" style={{ fontVariantNumeric: "lining-nums", fontWeight: 600 }}>
                    {i + 1}
                  </text>
                  {s.capital && label && (
                    <text
                      x={label.x}
                      y={label.y}
                      textAnchor={label.anchor}
                      dy="0.35em"
                      fontSize={13}
                      fill="var(--color-foreground)"
                      stroke="#FFFFFF"
                      strokeWidth={3.5}
                      paintOrder="stroke"
                      style={{ fontStyle: "italic" }}
                    >
                      {s.capital}
                    </text>
                  )}
                  <title>{L.t(s.name)}</title>
                </g>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Tarjeta del país bajo el mouse */}
        {hover && (
          <div
            className="pointer-events-none absolute z-10 min-w-[11rem] max-w-[16rem] border border-ink bg-paper px-3.5 py-2.5 shadow-lg"
            style={{
              left: Math.min(Math.max(hover.x, 90), (wrap.current?.clientWidth ?? 600) - 90),
              top: hover.y,
              transform: hover.y > 120 ? "translate(-50%, calc(-100% - 14px))" : "translate(-50%, 18px)",
            }}
          >
            <p className="font-display text-lg leading-tight text-foreground">
              {hover.p.flag && <span className="flag-emoji mr-1.5">{hover.p.flag}</span>}
              {L.t(hover.p.name)}
            </p>
            {hover.p.capital && <p className="text-sm italic text-muted">{hover.p.capital}</p>}
            {hover.p.detail && <p className="mt-1 text-sm text-foreground/80">{hover.p.detail}</p>}
            {hover.p.href && <p className="mt-1.5 label-caps text-xs text-vermilion">{L("Clic para ver la ficha", "Click to open its page")}</p>}
          </div>
        )}

        {canZoom && (
          <button
            type="button"
            onClick={() => {
              setHover(null);
              setZoomed((z) => !z);
            }}
            className="absolute bottom-2 right-2 sm:bottom-auto sm:right-3 sm:top-3 inline-flex items-center gap-1.5 border border-ink/20 bg-paper/90 px-2 py-1 sm:px-2.5 sm:py-1.5 text-xs sm:text-sm text-foreground backdrop-blur hover:border-ink"
          >
            {zoomed ? <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" /> : <Minimize2 className="h-3.5 w-3.5" aria-hidden="true" />}
            {zoomed ? L("Ver el mundo", "See the world") : L("Acercar a la ruta", "Zoom to route")}
          </button>
        )}
      </div>
      {caption && <figcaption className="mt-2 text-sm text-muted">{caption}</figcaption>}
    </figure>
  );
}
