"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import type { JournalMood } from "@/types/journal";
import { MOOD_CONFIG } from "@/types/journal";

/**
 * Mood-over-time chart. Isolated from JournalTimeline so recharts stays out
 * of the initial client bundle — this component is only ever loaded via
 * `next/dynamic({ ssr: false })` (see JournalTimeline), keeping the heavy
 * charting dependency out of the critical path for the /journal page.
 */

interface MoodChartDatum {
  date: string;
  formattedDate: string;
  mood: JournalMood;
  personalDay?: number;
  theme?: string;
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const moodCfg = MOOD_CONFIG[data.mood as JournalMood];
    return (
      <div className="bg-paper-alt border border-ink/15 rounded-xl p-3 shadow-xl text-xs">
        <div className="font-mono text-muted text-[10px] mb-1">{data.formattedDate}</div>
        <div className="flex items-center gap-1.5 font-bold text-foreground">
          <span>{moodCfg?.emoji}</span>
          <span style={{ color: moodCfg?.color }}>{moodCfg?.label}</span>
          <span className="text-muted font-mono">({data.mood}/5)</span>
        </div>
        {data.theme && (
          <div className="mt-1 font-mono text-[10px] text-accent">
            Día {data.personalDay}: {data.theme}
          </div>
        )}
      </div>
    );
  }
  return null;
}

export default function MoodChart({ chartData }: { chartData: MoodChartDatum[] }) {
  return (
    <div
      className="w-full h-44 sm:h-52"
      role="region"
      aria-label="Gráfico de evolución de energía y estado de ánimo a lo largo del tiempo"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D4A843" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#D4A843" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="formattedDate"
            stroke="#7A7870"
            fontSize={10}
            tickLine={false}
            axisLine={{ stroke: "rgba(243,241,234,0.1)" }}
          />
          <YAxis
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            stroke="#7A7870"
            fontSize={10}
            tickLine={false}
            axisLine={{ stroke: "rgba(243,241,234,0.1)" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="mood"
            stroke="#D4A843"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#moodGradient)"
            dot={{ fill: "#D4A843", r: 3, strokeWidth: 1, stroke: "var(--color-paper)" }}
            activeDot={{ r: 5, fill: "var(--color-ink)" }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Accesibilidad (a11y): Tabla oculta visualmente para lectores de pantalla */}
      <table className="sr-only">
        <caption>Historial cronológico de nivel de energía y estado de ánimo</caption>
        <thead>
          <tr>
            <th scope="col">Fecha</th>
            <th scope="col">Nivel de Energía (1 a 5)</th>
            <th scope="col">Tema Simbólico</th>
          </tr>
        </thead>
        <tbody>
          {chartData.map((d, i) => (
            <tr key={i}>
              <td>{d.formattedDate}</td>
              <td>{d.mood} de 5</td>
              <td>{d.theme ? `Día ${d.personalDay}: ${d.theme}` : "Sin tema"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}