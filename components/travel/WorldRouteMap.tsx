"use client";

import { useEffect, useMemo, useState } from "react";
import { geoNaturalEarth1, geoPath, geoGraticule10 } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, Geometry } from "geojson";
import { useL } from "@/lib/i18n/useL";

const W = 1000;
const H = 520;

export interface MapPoint {
  iso: string;
  name: string;
  lat: number;
  lon: number;
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

/**
 * Mapamundi en blanco y negro (Natural Earth 1:110m). Los países del signo
 * van en tinta; los vuelos, en bermellón, por círculo máximo. Los países
 * demasiado chicos para la escala se marcan con un punto en la capital.
 */
export default function WorldRouteMap({ highlight, stops = [], origin = null, legs = [], caption }: Props) {
  const L = useL();
  const [countries, setCountries] = useState<Feature<Geometry, object>[] | null>(null);

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
    return { path: geoPath(projection), project: (lon: number, lat: number) => projection([lon, lat]) };
  }, []);

  const hl = useMemo(() => new Set(highlight.map((h) => h.iso)), [highlight]);
  const drawn = useMemo(() => new Set((countries ?? []).map((f) => String(f.id))), [countries]);
  const sphere = path({ type: "Sphere" }) ?? "";
  const graticule = path(geoGraticule10()) ?? "";

  return (
    <figure className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={caption ?? L("Mapamundi con los países de tu signo", "World map with the countries of your sign")}
        className="block w-full h-auto"
      >
        <defs>
          <marker id="viaje-flecha" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--color-vermilion)" />
          </marker>
        </defs>
        <path d={sphere} fill="var(--color-background)" stroke="var(--color-foreground)" strokeWidth={1} />
        <path d={graticule} fill="none" stroke="var(--color-border)" strokeWidth={0.5} />
        {countries?.map((f) => {
          const id = String(f.id);
          const on = hl.has(id);
          return (
            <path
              key={id}
              d={path(f) ?? ""}
              fill={on ? "var(--color-foreground)" : "var(--color-border)"}
              stroke="var(--color-background)"
              strokeWidth={0.6}
            >
              <title>{id}</title>
            </path>
          );
        })}
        {/* Países del signo que no llegan a dibujarse a esta escala. */}
        {countries &&
          highlight
            .filter((h) => !drawn.has(h.iso))
            .map((h) => {
              const p = project(h.lon, h.lat);
              if (!p) return null;
              return (
                <circle key={`dot-${h.iso}`} cx={p[0]} cy={p[1]} r={3.2} fill="var(--color-foreground)" stroke="var(--color-background)" strokeWidth={1}>
                  <title>{L.t(h.name)}</title>
                </circle>
              );
            })}
        {legs.map((leg, i) => (
          <path
            key={`leg-${i}`}
            d={path({ type: "LineString", coordinates: [leg.from, leg.to] }) ?? ""}
            fill="none"
            stroke="var(--color-vermilion)"
            strokeWidth={2}
            strokeLinecap="round"
            markerEnd="url(#viaje-flecha)"
          />
        ))}
        {origin &&
          (() => {
            const p = project(origin.lon, origin.lat);
            if (!p) return null;
            return (
              <g transform={`translate(${p[0]} ${p[1]})`}>
                <rect x={-7} y={-7} width={14} height={14} fill="var(--color-background)" stroke="var(--color-foreground)" strokeWidth={2} />
                <title>{L.t(origin.name)}</title>
              </g>
            );
          })()}
        {stops.map((s, i) => {
          const p = project(s.lon, s.lat);
          if (!p) return null;
          return (
            <g key={`stop-${s.iso}`} transform={`translate(${p[0]} ${p[1]})`}>
              <circle r={11} fill="var(--color-vermilion)" stroke="var(--color-background)" strokeWidth={2} />
              <text textAnchor="middle" dy="0.35em" fontSize={12} fill="#fff" style={{ fontVariantNumeric: "lining-nums" }}>
                {i + 1}
              </text>
              <title>{L.t(s.name)}</title>
            </g>
          );
        })}
      </svg>
      {caption && <figcaption className="mt-2 text-sm text-muted">{caption}</figcaption>}
    </figure>
  );
}
