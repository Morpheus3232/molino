import { useL } from "@/lib/i18n/useL";
import type { ReactNode } from "react";

/**
 * Rueda de un sistema de doce: el elegido en tinta, los dos que forman
 * triángulo con él (a cuatro casillas: en astrología el mismo elemento, en el
 * zodíaco chino los amigos 三合) unidos en bermellón, y la línea punteada al
 * opuesto (a seis casillas). Es la misma geometría y animación que la rueda
 * de Mi Mapa (.map-wheel-ring / .map-wheel-trine en globals.css).
 */

const C = 300;
const R_OUT = 292;
const R_IN = 172;
const R_CORE = 74;

function polar(r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) };
}

function sector(rIn: number, rOut: number, a0: number, a1: number) {
  const p0 = polar(rOut, a0);
  const p1 = polar(rOut, a1);
  const p2 = polar(rIn, a1);
  const p3 = polar(rIn, a0);
  return `M${p0.x},${p0.y} A${rOut},${rOut} 0 0 1 ${p1.x},${p1.y} L${p2.x},${p2.y} A${rIn},${rIn} 0 0 0 ${p3.x},${p3.y} Z`;
}

export interface WheelItem {
  key: string;
  label: string;
  /** Icono a 40×40 que pinta con currentColor. */
  icon: ReactNode;
}

export default function RelationWheel({
  items,
  active,
  center,
  ariaLabel,
  className = "",
}: {
  items: WheelItem[];
  active: number;
  center: ReactNode;
  ariaLabel: string;
  className?: string;
}) {
  const L = useL();
  const n = items.length;
  const step = 360 / n;
  const trine = [active, (active + 4) % n, (active + 8) % n];
  const opposite = (active + 6) % n;
  const mid = (i: number) => i * step + step / 2;
  const tri = [...trine].sort((a, b) => a - b).map((i) => polar(R_IN - 4, mid(i)));
  const pA = polar(R_IN - 4, mid(active));
  const pO = polar(R_IN - 4, mid(opposite));

  return (
    <svg viewBox="0 0 600 600" role="img" aria-label={L.t(ariaLabel)} className={`w-full h-auto text-foreground ${className}`}>
      <g className="map-wheel-ring">
        <circle cx={C} cy={C} r={R_OUT} fill="none" stroke="currentColor" strokeOpacity={0.35} />
        {items.map((it, i) => {
          const mine = i === active;
          const friend = trine.includes(i) && !mine;
          const iconPos = polar(R_OUT - 34, mid(i));
          const labelPos = polar(R_IN + 28, mid(i));
          const a = polar(R_IN, i * step);
          const b = polar(R_OUT, i * step);
          return (
            <g key={it.key}>
              {mine && <path d={sector(R_IN, R_OUT, i * step, (i + 1) * step)} fill="currentColor" />}
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="currentColor" strokeOpacity={0.2} />
              <g
                transform={`translate(${iconPos.x - 20},${iconPos.y - 20})`}
                className={mine ? "text-paper" : friend ? "text-vermilion" : "text-muted"}
              >
                {L.t(it.icon)}
              </g>
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className={mine ? "fill-paper" : friend ? "fill-vermilion" : "fill-current"}
                style={{ fontSize: it.label.length > 9 ? 11.5 : 13.5, opacity: mine || friend ? 1 : 0.7 }}
              >
                {L.t(it.label)}
              </text>
            </g>
          );
        })}
        <circle cx={C} cy={C} r={R_IN} fill="none" stroke="currentColor" strokeOpacity={0.35} />
      </g>

      <line x1={pA.x} y1={pA.y} x2={pO.x} y2={pO.y} stroke="currentColor" strokeWidth={1.5} strokeDasharray="4 6" strokeOpacity={0.7} />
      <polygon
        points={tri.map((p) => `${p.x},${p.y}`).map(L.t).join(" ")}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="text-vermilion map-wheel-trine"
        pathLength={1}
      />

      <circle cx={C} cy={C} r={R_CORE} className="fill-paper" stroke="currentColor" strokeOpacity={0.35} />
      <g transform={`translate(${C - 32},${C - 32})`}>{L.t(center)}</g>
    </svg>
  );
}
