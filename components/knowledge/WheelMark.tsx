import { useL } from "@/lib/i18n/useL";
/**
 * Marcas de leyenda para las ruedas: una rueda en miniatura con solo la parte
 * que se explica encendida (el sector del signo, el del animal, el triángulo,
 * la línea al opuesto o el centro). Así cada fila de la leyenda señala dónde
 * mirar en la rueda grande, en vez de repetir el mismo cuadrado negro.
 */

export type WheelMarkPart = "outer" | "inner" | "trine" | "opposite" | "core";

const C = 16;
function polar(r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) };
}
function sector(rIn: number, rOut: number, a0: number, a1: number) {
  const p0 = polar(rOut, a0), p1 = polar(rOut, a1), p2 = polar(rIn, a1), p3 = polar(rIn, a0);
  return `M${p0.x},${p0.y} A${rOut},${rOut} 0 0 1 ${p1.x},${p1.y} L${p2.x},${p2.y} A${rIn},${rIn} 0 0 0 ${p3.x},${p3.y} Z`;
}

/**
 * `rings`: 2 para la rueda de Mi Mapa (signos afuera, animales en el medio),
 * 1 para las ruedas de Conocimiento (un solo anillo de doce).
 */
export default function WheelMark({ part, rings = 1, className = "" }: { part: WheelMarkPart; rings?: 1 | 2; className?: string }) {
  const L = useL();
  const rOut = 15;
  const rMid = rings === 2 ? 10.5 : 8.5;
  const rIn = rings === 2 ? 6 : 8.5;
  const rCore = rings === 2 ? 2.8 : 4;
  const rTri = rings === 2 ? rMid - 0.5 : rIn - 0.5;
  const tri = [0, 120, 240].map((d) => polar(rTri, d));
  const top = polar(rOut, 0);
  const bottom = polar(rOut, 180);
  const ringSector = part === "outer" ? sector(rMid, rOut, -32, 32) : part === "inner" ? sector(rIn, rMid, -32, 32) : null;

  return (
    <svg viewBox="0 0 32 32" className={`w-8 h-8 text-foreground ${className}`} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeOpacity={0.45} strokeWidth={1}>
        <circle cx={C} cy={C} r={rOut} />
        <circle cx={C} cy={C} r={rMid} />
        {rings === 2 && <circle cx={C} cy={C} r={rIn} />}
      </g>
      {ringSector && <path d={ringSector} fill="currentColor" />}
      {part === "trine" && (
        <polygon points={tri.map((p) => `${p.x},${p.y}`).map(L.t).join(" ")} fill="none" stroke="currentColor" strokeWidth={1.6} className="text-vermilion" strokeLinejoin="round" />
      )}
      {part === "opposite" && (
        <line x1={top.x} y1={top.y} x2={bottom.x} y2={bottom.y} stroke="currentColor" strokeWidth={2} strokeDasharray="3 2" />
      )}
      <circle
        cx={C}
        cy={C}
        r={rCore}
        fill={part === "core" ? "currentColor" : "var(--color-paper, #fff)"}
        stroke="currentColor"
        strokeOpacity={part === "core" ? 1 : 0.3}
        className={part === "core" ? "" : "fill-paper"}
      />
    </svg>
  );
}
