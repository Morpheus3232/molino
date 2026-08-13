import React from "react";

interface ConstellationPatternProps {
  /** Número de puntos en la constelación (1-7) */
  pointCount?: number;
  /** Si conectar puntos con líneas sutiles */
  connected?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  aria?: string;
}

/**
 * Patrón de constelación SVG sutil.
 * Elemento visual que refuerza la identidad mística de Molino.
 * Muy poco opaco para no competir con el contenido.
 */
export default function ConstellationPattern({
  pointCount = 4,
  connected = true,
  size = "md",
  className = "",
  aria = "Patrón decorativo de constelación",
}: ConstellationPatternProps) {
  const sizeMap = { sm: 40, md: 60, lg: 100 };
  const viewBoxSize = sizeMap[size];

  // Generar puntos pseudo-aleatorios pero consistentes
  const generatePoints = (count: number) => {
    const points: [number, number][] = [];
    for (let i = 0; i < count; i++) {
      // Usar índice para generar posiciones pseudo-aleatorias consistentes
      const angle = (i / count) * Math.PI * 2;
      const radius = 15 + (i % 3) * 5;
      const x = 30 + radius * Math.cos(angle);
      const y = 30 + radius * Math.sin(angle);
      points.push([x, y]);
    }
    return points;
  };

  const points = generatePoints(Math.max(1, Math.min(pointCount, 7)));

  return (
    <svg
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      width={viewBoxSize}
      height={viewBoxSize}
      className={`opacity-20 ${className}`}
      aria-label={aria}
      role="img"
    >
      {/* Líneas conectando puntos */}
      {connected &&
        points.map((point, i) => {
          const nextPoint = points[(i + 1) % points.length];
          return (
            <line
              key={`line-${i}`}
              x1={point[0]}
              y1={point[1]}
              x2={nextPoint[0]}
              y2={nextPoint[1]}
              stroke="currentColor"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}

      {/* Puntos */}
      {points.map((point, i) => (
        <circle
          key={`dot-${i}`}
          cx={point[0]}
          cy={point[1]}
          r="1.5"
          fill="currentColor"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
