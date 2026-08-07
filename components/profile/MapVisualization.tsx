"use client";

import { useMemo } from "react";
import type { UserProfile } from "@/types/user";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { ZODIAC_SYMBOLS } from "@/lib/data/constants";

interface MapVisualizationProps {
  profile: UserProfile;
  className?: string;
}

const SYSTEM_LABELS = [
  { key: "numerology", label: "NUMEROLOGÍA", color: "#6B4C7A" },
  { key: "astrology", label: "ASTROLOGÍA", color: "#2E5C8A" },
  { key: "zodiac", label: "ZODÍACO CHINO", color: "#C49A2A" },
];

function getSystemScores(profile: UserProfile) {
  const numerologyScore = Math.min(100, 50 + (profile.lifePath - 1) * 5 + (profile.expressionNumber || 0) * 2);
  const astrologyScore = 60;
  const zodiacScore = 70;
  return { numerology: numerologyScore, astrology: astrologyScore, zodiac: zodiacScore };
}

function getPolygonPoints(centerX: number, centerY: number, radius: number, sides: number, rotation = -Math.PI / 2) {
  return Array.from({ length: sides }, (_, i) => {
    const angle = rotation + (i * 2 * Math.PI) / sides;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });
}

function getScorePoints(centerX: number, centerY: number, maxRadius: number, scores: Record<string, number>, sides: number) {
  return SYSTEM_LABELS.map((system, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / sides;
    const radius = (scores[system.key] / 100) * maxRadius;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });
}

export default function MapVisualization({ profile, className = "" }: MapVisualizationProps) {
  const scores = useMemo(() => getSystemScores(profile), [profile]);
  const display = getZodiacDisplay(profile.chineseZodiac);
  const symbol = ZODIAC_SYMBOLS[profile.sunSign] || "";

  // Expanded viewBox: 260x260 gives 35px padding on each side of the 190-pixel chart area
  const vbSize = 260;
  const center = vbSize / 2; // 130
  const maxRadius = 70;
  const sides = 3;

  const gridPoints = getPolygonPoints(center, center, maxRadius, sides);
  const scorePoints = getScorePoints(center, center, maxRadius, scores, sides);
  const scorePointsClosed = [...scorePoints, scorePoints[0]];
  const gridPointsClosed = [...gridPoints, gridPoints[0]];

  const scorePath = scorePointsClosed.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const gridPaths = [0.33, 0.66, 1].map((ratio) => {
    const points = gridPointsClosed.map((p) => ({
      x: center + (p.x - center) * ratio,
      y: center + (p.y - center) * ratio,
    }));
    return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  });

  return (
    <div
      className={`relative mx-auto ${className}`}
      role="img"
      aria-label="Visualización de tu mapa personal con tres sistemas"
      style={{ aspectRatio: "1 / 1" }}
    >
      <svg viewBox={`0 0 ${vbSize} ${vbSize}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6B4C7A" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#2E5C8A" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <g stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" fill="none">
          {gridPaths.map((path, i) => (
            <path key={i} d={path + " Z"} />
          ))}
        </g>

        {/* Axis lines */}
        <g stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" fill="none">
          {gridPoints.map((p, i) => (
            <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} />
          ))}
        </g>

        {/* Score area */}
        <path
          d={scorePath + " Z"}
          fill="url(#scoreGradient)"
          stroke="#6B4C7A"
          strokeOpacity="0.4"
          strokeWidth="1.5"
        />

        {/* Score outline */}
        <path
          d={scorePath + " Z"}
          fill="none"
          stroke="#6B4C7A"
          strokeWidth="2"
          strokeOpacity="0.7"
        />

        {/* Score dots */}
        {scorePoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3"
            fill={SYSTEM_LABELS[i].color}
            opacity="0.9"
          />
        ))}

        {/* Axis labels — positioned well outside the grid */}
        <g fontSize="8" fontFamily="'JetBrains Mono', monospace" textAnchor="middle" dominantBaseline="middle">
          {SYSTEM_LABELS.map((system, i) => {
            const angle = -Math.PI / 2 + (i * 2 * Math.PI) / sides;
            const labelRadius = maxRadius + 22;
            const x = center + labelRadius * Math.cos(angle);
            const y = center + labelRadius * Math.sin(angle);
            return (
              <text key={system.key} x={x} y={y} fill={system.color} fontWeight="600" opacity="0.8">
                {system.label}
              </text>
            );
          })}
        </g>
      </svg>

      {/* Center content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none w-[70%]">
        <p className="font-display text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-foreground leading-tight">
          {profile.archetype}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-2 text-xs sm:text-sm text-muted">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "#6B4C7A" }} />
            <span>{profile.lifePath}</span>
          </span>
          <span className="text-ink/20">·</span>
          <span className="flex items-center gap-1">
            {symbol}
            <span>{profile.sunSign}</span>
          </span>
          <span className="text-ink/20">·</span>
          <span className="flex items-center gap-1">
            <span role="img" aria-label={display.name}>{display.emoji}</span>
            <span>{display.name}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
