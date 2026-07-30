/**
 * Textura halftone generada con codigo — sin assets externos ni licencias.
 *
 * Dibuja una grilla de puntos cuyo radio sigue una funcion de densidad, igual
 * que una trama de impresion. Es un SVG determinista (mismo output en server y
 * cliente) para que no haya mismatch de hidratacion.
 */

type HalftoneVariant = "circle" | "spiral" | "wave" | "grid";

interface HalftoneProps {
  variant?: HalftoneVariant;
  /** Puntos por lado. Mas alto = trama mas fina y mas nodos. */
  resolution?: number;
  className?: string;
  /** Color de los puntos. Por defecto hereda currentColor. */
  color?: string;
}

const SIZE = 100;

/**
 * Densidad de tinta en (x, y), normalizados a 0..1. Devuelve 0..1.
 */
function density(variant: HalftoneVariant, x: number, y: number): number {
  const cx = x - 0.5;
  const cy = y - 0.5;
  const dist = Math.sqrt(cx * cx + cy * cy) / 0.7071; // 0 al centro, 1 en la esquina

  switch (variant) {
    // Esfera: denso al centro, se abre hacia afuera.
    case "circle":
      return Math.max(0, 1 - dist * 1.15);

    // Espiral: brazos que giran desde el centro — evoca ciclos.
    case "spiral": {
      const angle = Math.atan2(cy, cx);
      const arms = Math.sin(angle * 3 + dist * 9);
      return Math.max(0, (arms * 0.5 + 0.5) * (1 - dist * 0.85));
    }

    // Onda: bandas horizontales que se atenuan — evoca ritmo temporal.
    case "wave": {
      const band = Math.sin(y * Math.PI * 3.5 + Math.cos(x * Math.PI * 2) * 0.9);
      return Math.max(0, (band * 0.5 + 0.5) * (1 - Math.abs(cy) * 1.1));
    }

    // Grilla: degradado diagonal parejo — textura de fondo neutra.
    case "grid":
    default:
      return Math.max(0, 1 - (x * 0.55 + y * 0.55));
  }
}

export default function Halftone({
  variant = "circle",
  resolution = 26,
  className = "",
  color = "currentColor",
}: HalftoneProps) {
  const step = SIZE / resolution;
  const maxRadius = step * 0.52;
  const dots: { cx: number; cy: number; r: number }[] = [];

  for (let row = 0; row < resolution; row++) {
    for (let col = 0; col < resolution; col++) {
      // Filas impares desplazadas: rompe la grilla cuadrada y se lee mas organico.
      const offset = row % 2 === 0 ? 0 : step / 2;
      const cx = col * step + step / 2 + offset;
      const cy = row * step + step / 2;
      if (cx > SIZE) continue;

      const d = density(variant, cx / SIZE, cy / SIZE);
      if (d <= 0.02) continue;

      dots.push({
        cx: Number(cx.toFixed(2)),
        cy: Number(cy.toFixed(2)),
        // sqrt: el area del punto crece lineal con la densidad, que es como
        // funciona una trama real.
        r: Number((Math.sqrt(d) * maxRadius).toFixed(2)),
      });
    }
  }

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className={className}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid slice"
    >
      {dots.map((dot, i) => (
        <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill={color} />
      ))}
    </svg>
  );
}
