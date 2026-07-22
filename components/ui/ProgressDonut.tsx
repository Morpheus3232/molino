"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface ProgressDonutProps {
  value: number;
  max: number;
  label: string;
  color?: string;
}

export default function ProgressDonut({
  value,
  max,
  label,
  color = "#D4A843",
}: ProgressDonutProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const data = [
    { name: "Completado", value: percentage },
    { name: "Restante", value: 100 - percentage },
  ];

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width={120} height={120}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={35}
            outerRadius={50}
            paddingAngle={2}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            <Cell fill={color} />
            <Cell fill="var(--border)" />
          </Pie>
          <Tooltip
            content={({ payload }) => {
              const item = payload && payload.length ? payload[0] : null;
              if (item) {
                return (
                  <div className="bg-card border border-border p-2 rounded-lg text-sm">
                    <p className="text-foreground">{String(item.name)}: {Number(item.value).toFixed(1)}%</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <p className="mt-2 text-sm font-medium text-foreground">{label}</p>
      <p className="text-xs text-muted">{percentage.toFixed(0)}%</p>
    </div>
  );
}
