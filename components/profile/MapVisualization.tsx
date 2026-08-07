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
  const center = 96;
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
    <div className={`relative w-64 h-64 mx-auto ${className}`} role="img" aria-label="Visualización de tu mapa personal con tres sistemas">
      <svg viewBox="0 0 192 192" className="w-full h-full">
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6B4C7A" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#2E5C8A" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <g stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" fill="none">
          {gridPaths.map((path, i) => (
            <path key={i} d={path + " Z"} />
          ))}
        </g>

        {/* Axis lines */}
        <g stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" fill="none">
          {gridPoints.map((p) => (
            <line key={p.x} x1={center} y1={center} x2={p.x} y2={p.y} />
          ))}
        </g>

        {/* Score area */}
        <path
          d={scorePath + " Z"}
          fill="url(#scoreGradient)"
          stroke="#6B4C7A"
          strokeOpacity="0.5"
          strokeWidth="1.5"
        />

        {/* Score outline */}
        <path
          d={scorePath + " Z"}
          fill="none"
          stroke="#6B4C7A"
          strokeWidth="2"
          strokeOpacity="0.8"
        />

        {/* Axis labels */}
        <g fontSize="8" fontFamily="monospace" fill="currentColor" opacity="0.6" textAnchor="middle" dominantBaseline="middle">
          {SYSTEM_LABELS.map((system, i) => {
            const angle = -Math.PI / 2 + (i * 2 * Math.PI) / sides;
            const labelRadius = maxRadius + 18;
            const x = center + labelRadius * Math.cos(angle);
            const y = center + labelRadius * Math.sin(angle);
            return (
              <text key={system.key} x={x} y={y} fill={system.color} fontWeight="600">
                {system.label}
              </text>
            );
          })}
        </g>
      </svg>

      {/* Center content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <p className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {profile.archetype}
        </p>
        <div className="flex items-center justify-center gap-3 mt-2 text-sm text-muted">
          <span className="flex items-center gap-1">
            <span style={{ color: "#6B4C7A" }}>{profile.lifePath}</span>
            <span>·</span>
          </span>
          <span className="flex items-center gap-1">
            {symbol}
            <span>{profile.sunSign}</span>
          </span>
          <span className="flex items-center gap-1">
            <span role="img" aria-label={display.name}>{display.emoji}</span>
            <span>{display.name}</span>
          </span>
        </div>
      </div>
    </div>
  );
}