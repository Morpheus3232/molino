/**
 * El ciclo de nueve como un cuadrante: los números del 1 al 9 alrededor, el
 * del día en tinta y, si hay mapa, tu Día Personal marcado con un punto
 * bermellón y tu Año Personal con un anillo. Es la misma geometría de las
 * ruedas de Mi Mapa (sectores, filetes, centro en papel).
 */

const C = 300;
const R_OUT = 292;
const R_IN = 182;
const R_CORE = 120;

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

/** 11 → 2, 22 → 4, 28 → 1: la casilla de la rueda donde cae un número. */
export function toDigit(n: number): number {
  let x = Math.abs(Math.trunc(n));
  while (x > 9) x = String(x).split("").reduce((a, d) => a + Number(d), 0);
  return x || 9;
}

const STEP = 360 / 9;
const mid = (d: number) => (d - 1) * STEP + STEP / 2;

export default function NineDial({
  day,
  personalDay,
  personalYear,
  ariaLabel,
  className = "",
}: {
  /** Número del día (puede ser maestro: 11, 22, 33, o 28). */
  day: number;
  personalDay?: number | null;
  personalYear?: number | null;
  ariaLabel: string;
  className?: string;
}) {
  const active = toDigit(day);
  const pd = personalDay ? toDigit(personalDay) : null;
  const py = personalYear ? toDigit(personalYear) : null;
  const pdPos = pd ? polar(R_IN + 13, mid(pd)) : null;
  const pyPos = py ? polar(R_OUT - 15, mid(py)) : null;

  return (
    <svg viewBox="0 0 600 600" role="img" aria-label={ariaLabel} className={`w-full h-auto text-foreground ${className}`}>
      <g className="map-wheel-ring">
        <circle cx={C} cy={C} r={R_OUT} fill="none" stroke="currentColor" strokeOpacity={0.35} />
        {Array.from({ length: 9 }, (_, i) => i + 1).map((d) => {
          const mine = d === active;
          const a = polar(R_IN, (d - 1) * STEP);
          const b = polar(R_OUT, (d - 1) * STEP);
          const label = polar((R_IN + R_OUT) / 2, mid(d));
          return (
            <g key={d}>
              {mine && <path d={sector(R_IN, R_OUT, (d - 1) * STEP, d * STEP)} fill="currentColor" />}
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="currentColor" strokeOpacity={0.2} />
              <text
                x={label.x}
                y={label.y + 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`font-display ${mine ? "fill-paper" : "fill-current"}`}
                style={{ fontSize: 56, opacity: mine ? 1 : 0.45 }}
              >
                {d}
              </text>
            </g>
          );
        })}
        <circle cx={C} cy={C} r={R_IN} fill="none" stroke="currentColor" strokeOpacity={0.35} />
      </g>

      {/* Año Personal: anillo en el borde exterior */}
      {pyPos && (
        <circle cx={pyPos.x} cy={pyPos.y} r={11} fill="none" stroke="currentColor" strokeWidth={2.5} className={py === active ? "text-paper" : "text-foreground"} />
      )}
      {/* Día Personal: punto bermellón en el borde interior */}
      {pdPos && <circle cx={pdPos.x} cy={pdPos.y} r={9} className="fill-vermilion" />}

      <circle cx={C} cy={C} r={R_CORE} className="fill-paper" stroke="currentColor" strokeOpacity={0.35} />
      <text
        x={C}
        y={C + 8}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-current font-display"
        style={{ fontSize: day > 9 ? 120 : 150, letterSpacing: "-0.02em" }}
      >
        {day}
      </text>
    </svg>
  );
}

/** Marcas de la leyenda, en el mismo dibujo que la rueda. */
export const DIAL_MARKS = {
  day: (
    <svg viewBox="0 0 32 32" className="w-8 h-8 text-foreground" aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" strokeOpacity="0.45" />
      <circle cx="16" cy="16" r="9.5" fill="none" stroke="currentColor" strokeOpacity="0.45" />
      <path d="M16,1 A15,15 0 0 1 25.64,4.51 L22.11,8.72 A9.5,9.5 0 0 0 16,6.5 Z" fill="currentColor" />
    </svg>
  ),
  personalDay: (
    <svg viewBox="0 0 32 32" className="w-8 h-8 text-foreground" aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" strokeOpacity="0.45" />
      <circle cx="16" cy="16" r="9.5" fill="none" stroke="currentColor" strokeOpacity="0.45" />
      <circle cx="16" cy="5.2" r="2.6" className="fill-vermilion" />
    </svg>
  ),
  personalYear: (
    <svg viewBox="0 0 32 32" className="w-8 h-8 text-foreground" aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" strokeOpacity="0.45" />
      <circle cx="16" cy="16" r="9.5" fill="none" stroke="currentColor" strokeOpacity="0.45" />
      <circle cx="16" cy="3.4" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
};
