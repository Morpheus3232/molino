"use client";

import { useId } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

interface ProfileRadarProps {
  data: { subject: string; value: number }[];
  color: string;
}

/**
 * Radar de dimensiones con profundidad — mismo recharts, mismo dato, sin
 * WebGL ni librerías nuevas. El "realismo" viene de SVG puro: gradiente
 * radial en el relleno (en vez de un color plano) + una sombra suave
 * (feDropShadow) para que el polígono lea como un objeto con volumen, más
 * un halo de fondo en CSS (radial-gradient + blur) para la sensación de
 * pieza flotando. Todo estático, sin animación continua.
 */
export default function ProfileRadar({ data, color }: ProfileRadarProps) {
  const uid = useId().replace(/:/g, "");
  const gradientId = `radar-fill-${uid}`;
  const glowId = `radar-glow-${uid}`;

  return (
    <div
      className="relative w-full h-80"
      role="region"
      aria-label="Gráfico de radar con las dimensiones del perfil"
    >
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-[0.14] pointer-events-none"
        style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }}
        aria-hidden="true"
      />
      <ResponsiveContainer width="100%" height="100%">
        {/* accessibilityLayer=false: el keyboard/focus layer de Recharts v3
            lee estado de foco antes de que el store del chart exista cuando
            el contenedor monta con tamaño 0 (tab animado con AnimatePresence),
            lo que rompía la pantalla con "Cannot read properties of undefined
            (reading 'focus')". */}
        <RadarChart data={data} accessibilityLayer={false} margin={{ top: 40, right: 60, bottom: 32, left: 60 }}>
          <defs>
            <radialGradient id={gradientId} cx="50%" cy="50%" r="75%">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color} stopOpacity={0.08} />
            </radialGradient>
            <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor={color} floodOpacity="0.25" />
            </filter>
          </defs>
          <PolarGrid stroke="currentColor" strokeOpacity={0.5} className="text-border" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: "currentColor", fontSize: 12 }} className="text-muted" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Perfil"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#${gradientId})`}
            filter={`url(#${glowId})`}
            isAnimationActive={false}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Accesibilidad (a11y): Tabla semántica oculta visualmente para lectores de pantalla */}
      <table className="sr-only">
        <caption>Puntajes y dimensiones del perfil de autoconocimiento</caption>
        <thead>
          <tr>
            <th scope="col">Dimensión</th>
            <th scope="col">Intensidad (0 a 100)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.subject}</td>
              <td>{d.value} de 100</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
