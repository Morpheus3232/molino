"use client";

import {
  Radar,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface RadarChartProps {
  data: { subject: string; value: number; fullMark?: number }[];
  title?: string;
}

export default function RadarChart({ data, title }: RadarChartProps) {
  return (
    <div className="bg-card rounded-2xl border border-card-border p-6">
      {title && (
        <h3 className="text-lg font-serif text-foreground mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <RechartsRadar data={data} outerRadius={90}>
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "var(--muted)", fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: "var(--muted)", fontSize: 10 }}
          />
          <Radar
            name="Tu perfil"
            dataKey="value"
            stroke="var(--primary)"
            fill="var(--primary)"
            fillOpacity={0.4}
          />
          <Legend />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  );
}
