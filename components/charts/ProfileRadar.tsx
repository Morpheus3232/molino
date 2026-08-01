"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

interface ProfileRadarProps {
  data: { subject: string; value: number }[];
  color: string;
}

export default function ProfileRadar({ data, color }: ProfileRadarProps) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        {/* accessibilityLayer=false: el keyboard/focus layer de Recharts v3
            lee estado de foco antes de que el store del chart exista cuando
            el contenedor monta con tamaño 0 (tab animado con AnimatePresence),
            lo que rompía la pantalla con "Cannot read properties of undefined
            (reading 'focus')". */}
        <RadarChart data={data} accessibilityLayer={false}>
          <PolarGrid stroke="currentColor" className="text-border" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: "currentColor", fontSize: 12 }} className="text-muted" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "currentColor", fontSize: 12 }} className="text-muted" />
          <Radar name="Perfil" dataKey="value" stroke={color} fill={color} fillOpacity={0.25} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
