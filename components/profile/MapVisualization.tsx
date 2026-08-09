"use client";

import { useMemo } from "react";
import type { UserProfile } from "@/types/user";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { ARCHETYPES } from "@/lib/data";
import { safeNumber } from "@/lib/utils/score";

interface MapVisualizationProps {
  profile: UserProfile;
  className?: string;
}

const SYSTEMS = [
  { key: "numerology", label: "NUMEROLOGÍA", color: "#6B4C7A", shortLabel: "Num" },
  { key: "astrology", label: "ASTROLOGÍA", color: "#2E5C8A", shortLabel: "Ast" },
  { key: "zodiac", label: "ZODÍACO", color: "#C49A2A", shortLabel: "Zod" },
];

function getSystemScores(profile: UserProfile) {
  return {
    numerology: Math.min(100, 50 + (profile.lifePath - 1) * 5 + (profile.expressionNumber || 0) * 2),
    astrology: 60 + (profile.sunSignInfo?.element === "Fuego" ? 15 : profile.sunSignInfo?.element === "Aire" ? 10 : 5),
    zodiac: 65 + (profile.chineseZodiacInfo?.element === "Metal" ? 10 : 5),
  };
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export default function MapVisualization({ profile, className = "" }: MapVisualizationProps) {
  const scores = useMemo(() => getSystemScores(profile), [profile]);
  const display = getZodiacDisplay(profile.chineseZodiac);
  const lifePath = safeNumber(profile.lifePath, 1);
  const archetypeData = ARCHETYPES[lifePath];

  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 108;

  // 3 axes at 120° apart, offset off-horizontal so no vertex lands
  // level with the centered archetype label (was -90°, put NUM
  // dead-center-left and colliding with the name every time).
  const axes = SYSTEMS.map((s, i) => ({
    ...s,
    angle: -60 + i * 120,
    score: scores[s.key as keyof typeof scores],
  }));

  // Grid rings at 33%, 66%, 100%
  const rings = [0.33, 0.66, 1];

  // Score polygon points
  const scorePoints = axes.map((a) => polarToCartesian(cx, cy, (a.score / 100) * maxR, a.angle));
  const scorePathD = scorePoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <div
      className={`relative mx-auto ${className}`}
      role="img"
      aria-label={`Tu mapa: ${archetypeData?.name || profile.archetype}, ${display.name} de ${profile.chineseZodiacInfo?.element || ""}, ${profile.sunSign}`}
      style={{ aspectRatio: "1 / 1" }}
    >
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="mapGrad" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.03" />
          </radialGradient>
        </defs>

        {/* Grid rings */}
        {rings.map((ratio) => {
          const pts = axes.map((a) => polarToCartesian(cx, cy, maxR * ratio, a.angle));
          const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
          return <path key={ratio} d={d} fill="none" stroke="currentColor" strokeOpacity={ratio === 1 ? "0.18" : "0.09"} strokeWidth="0.8" />;
        })}

        {/* Axis lines */}
        {axes.map((a) => {
          const end = polarToCartesian(cx, cy, maxR, a.angle);
          return <line key={a.key} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="currentColor" strokeOpacity="0.12" strokeWidth="0.8" />;
        })}

        {/* Score fill — restrained: one accent, not a color per system
            (per DESIGN.md, system colors are an 8px-dot accent only). */}
        <path d={scorePathD} fill="url(#mapGrad)" />
        <path d={scorePathD} fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeOpacity="0.7" strokeLinejoin="round" />

        {/* Score dots + score labels */}
        {axes.map((a, i) => {
          const pt = polarToCartesian(cx, cy, (a.score / 100) * maxR, a.angle);
          const labelPt = polarToCartesian(cx, cy, (a.score / 100) * maxR + 14, a.angle);
          return (
            <g key={a.key}>
              <circle cx={pt.x} cy={pt.y} r="3.5" fill={a.color} />
              <circle cx={pt.x} cy={pt.y} r="3.5" fill="none" stroke={a.color} strokeWidth="6" opacity="0.15" />
              <text
                x={labelPt.x}
                y={labelPt.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                fontFamily="'JetBrains Mono', monospace"
                fontWeight="600"
                fill={a.color}
              >
                {a.score}
              </text>
            </g>
          );
        })}

        {/* Axis labels */}
        {axes.map((a) => {
          const lp = polarToCartesian(cx, cy, maxR + 28, a.angle);
          return (
            <text
              key={a.key}
              x={lp.x}
              y={lp.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="8"
              fontFamily="'JetBrains Mono', monospace"
              letterSpacing="0.12em"
              fill={a.color}
              fontWeight="500"
              opacity="0.7"
            >
              {a.shortLabel.toUpperCase()}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
