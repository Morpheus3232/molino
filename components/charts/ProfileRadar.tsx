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
        <RadarChart data={data}>
          <PolarGrid stroke="currentColor" className="text-border" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: "currentColor", fontSize: 12 }} className="text-muted" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "currentColor", fontSize: 12 }} className="text-muted" />
          <Radar name="Perfil" dataKey="value" stroke={color} fill={color} fillOpacity={0.25} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
