"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useReducedMotion } from "@/lib/utils/motion-hooks";
import { subscribeLoading } from "@/lib/utils/loadingSignal";

interface LogoProps {
  className?: string;
  spinning?: boolean;
  wind?: boolean;
}

const HUB = { x: 50, y: 36 };
const BLADE_D = "M0,0 L-4,-4 L-5.5,-11 L-3,-20 L0,-28 L3,-20 L5.5,-11 L4,-4 Z";

function Blade({ angle }: { angle: number }) {
  return (
    <g transform={`rotate(${angle})`}>
      <path
        d={BLADE_D}
        fill="none"
        stroke="var(--color-paper, #F7F4EE)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d={BLADE_D} fill="currentColor" stroke="none" />
      <line x1="-4" y1="-4" x2="4" y2="-4" stroke="var(--color-paper, #F7F4EE)" strokeWidth="0.7" strokeOpacity="0.5" />
      <line x1="-5.5" y1="-11" x2="5.5" y2="-11" stroke="var(--color-paper, #F7F4EE)" strokeWidth="0.7" strokeOpacity="0.5" />
      <line x1="-3" y1="-20" x2="3" y2="-20" stroke="var(--color-paper, #F7F4EE)" strokeWidth="0.7" strokeOpacity="0.5" />
    </g>
  );
}

export default function Logo({ className = "w-6 h-6", spinning, wind }: LogoProps) {
  const [globalLoading, setGlobalLoading] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => subscribeLoading(setGlobalLoading), []);

  const isWind = wind && !reducedMotion;
  const isSpinning = !wind && (spinning ?? globalLoading) && !reducedMotion;

  const rotorStyle: CSSProperties = {
    transformOrigin: `${HUB.x}px ${HUB.y}px`,
    transition: isWind || isSpinning ? undefined : "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    animation: isWind
      ? "molino-rotor-spin 1.8s cubic-bezier(0.16, 0.84, 0.44, 1) infinite"
      : isSpinning
        ? "molino-rotor-spin 1.1s linear infinite"
        : "none",
    transform: isWind || isSpinning ? undefined : "rotate(0deg)",
  };

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <line x1="22" y1="97" x2="82" y2="97" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.2" strokeLinecap="round" />

      <path d="M32,97 L68,97 L57,44 L43,44 Z" fill="currentColor" fillOpacity="0.95" stroke="none" />
      <line x1="37" y1="78" x2="63" y2="78" stroke="var(--color-paper, #F7F4EE)" strokeWidth="0.7" strokeOpacity="0.25" />
      <line x1="39.5" y1="61" x2="60.5" y2="61" stroke="var(--color-paper, #F7F4EE)" strokeWidth="0.7" strokeOpacity="0.25" />
      <rect x="42" y="82" width="16" height="15" rx="2" fill="var(--color-paper, #F7F4EE)" fillOpacity="0.35" />
      <rect x="46" y="85" width="8" height="12" rx="1.5" fill="var(--color-paper, #F7F4EE)" fillOpacity="0.5" />

      <path d={`M43,44 Q${HUB.x},30 57,44 Z`} fill="currentColor" stroke="none" />

      <g style={rotorStyle}>
        <g transform={`translate(${HUB.x} ${HUB.y})`}>
          <Blade angle={45} />
          <Blade angle={135} />
          <Blade angle={225} />
          <Blade angle={315} />
          <circle cx="0" cy="0" r="3" fill="currentColor" stroke="var(--color-paper, #F7F4EE)" strokeWidth="1" />
        </g>
      </g>
    </svg>
  );
}
