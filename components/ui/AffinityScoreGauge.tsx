"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/utils/motion";

/**
 * SVG arc gauge for Affinity score — ~270° arc.
 * Animates arc fill + number count when in viewport.
 * Respects prefers-reduced-motion: shows final state immediately.
 */

const ARC_START_DEG = 135; // bottom-left
const ARC_TOTAL_DEG = 270; // sweep
const ARC_END_DEG = ARC_START_DEG + ARC_TOTAL_DEG; // 405° = 45°

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = degToRad(angleDeg);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const start = polarToCartesian(cx, cy, r, startDeg);
  const end = polarToCartesian(cx, cy, r, endDeg);
  const sweep = endDeg - startDeg;
  const largeArc = sweep > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

interface AffinityScoreGaugeProps {
  score: number;
  color: string;
  size?: number;
}

export default function AffinityScoreGauge({ score, color, size = 200 }: AffinityScoreGaugeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [displayScore, setDisplayScore] = useState(reducedMotion ? score : 0);
  const [arcProgress, setArcProgress] = useState(reducedMotion ? 1 : 0);

  useEffect(() => {
    if (reducedMotion) {
      setDisplayScore(score);
      setArcProgress(1);
      return;
    }
    if (!isInView) return;

    const duration = 1200; // ms
    let startTime: number | null = null;
    let raf: number;

    const animate = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);

      setDisplayScore(Math.round(eased * score));
      setArcProgress(eased);

      if (t < 1) raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isInView, score, reducedMotion]);

  const cx = 100;
  const cy = 100;
  const r = 80;
  const strokeWidth = 10;
  const bgWidth = 200;
  const bgHeight = 200;

  // Background track (full 270°)
  const trackPath = describeArc(cx, cy, r, ARC_START_DEG, ARC_END_DEG);

  // Foreground arc (score-proportional)
  const scoreDeg = ARC_START_DEG + (score / 100) * ARC_TOTAL_DEG * arcProgress;
  const fillPath = arcProgress > 0.005
    ? describeArc(cx, cy, r, ARC_START_DEG, Math.max(ARC_START_DEG + 0.5, scoreDeg))
    : "";

  // Tier tick marks at 30, 45, 60, 75
  const ticks = [30, 45, 60, 75];

  return (
    <motion.div
      ref={ref}
      initial={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: reducedMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center"
      role="img"
      aria-label={`Afinidad: ${score} de 100`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${bgWidth} ${bgHeight}`}
        className="block"
        aria-hidden="true"
      >
        {/* Background track */}
        <path
          d={trackPath}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Tier tick marks */}
        {ticks.map((tick) => {
          const tickDeg = ARC_START_DEG + (tick / 100) * ARC_TOTAL_DEG;
          const inner = polarToCartesian(cx, cy, r - strokeWidth / 2 - 4, tickDeg);
          const outer = polarToCartesian(cx, cy, r - strokeWidth / 2 - 1, tickDeg);
          return (
            <line
              key={tick}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="var(--muted)"
              strokeWidth={1}
              opacity={0.4}
            />
          );
        })}

        {/* Score arc fill */}
        {fillPath && (
          <path
            d={fillPath}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
          />
        )}

        {/* Center score number */}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          dominantBaseline="central"
          className="font-serif"
          style={{
            fontSize: "42px",
            fontWeight: 700,
            fill: "var(--foreground)",
          }}
        >
          {displayScore}
        </text>

        {/* "/ 100" below score */}
        <text
          x={cx}
          y={cy + 24}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: "11px",
            fill: "var(--muted)",
          }}
        >
          / 100
        </text>

        {/* "ZODÍACO CHINO" below /100 */}
        <text
          x={cx}
          y={cy + 40}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: "8px",
            fill: "var(--muted)",
            opacity: 0.6,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          ZODÍACO CHINO
        </text>
      </svg>
    </motion.div>
  );
}
