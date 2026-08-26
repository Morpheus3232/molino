"use client";

import React from "react";

export type WesternSignName =
  | "Aries"
  | "Tauro"
  | "Géminis"
  | "Cáncer"
  | "Leo"
  | "Virgo"
  | "Libra"
  | "Escorpio"
  | "Sagitario"
  | "Capricornio"
  | "Acuario"
  | "Piscis"
  | string;

interface AstrologySignIconProps {
  sign: WesternSignName;
  size?: number;
  className?: string;
  title?: string;
}

/** Normalize sign name to canonical key. */
export function normalizeWesternSign(name?: string): string {
  if (!name) return "";
  const c = name.trim().toLowerCase();

  if (c.includes("aries") || c === "♈") return "Aries";
  if (c.includes("tauro") || c === "♉") return "Tauro";
  if (c.includes("géminis") || c.includes("geminis") || c === "♊") return "Géminis";
  if (c.includes("cáncer") || c.includes("cancer") || c === "♋") return "Cáncer";
  if (c.includes("leo") || c === "♌") return "Leo";
  if (c.includes("virgo") || c === "♍") return "Virgo";
  if (c.includes("libra") || c === "♎") return "Libra";
  if (c.includes("escorpio") || c.includes("escorpión") || c.includes("scorpio") || c === "♏") return "Escorpio";
  if (c.includes("sagitario") || c === "♐") return "Sagitario";
  if (c.includes("capricornio") || c.includes("capricorn") || c === "♑") return "Capricornio";
  if (c.includes("acuario") || c.includes("aquarius") || c === "♒") return "Acuario";
  if (c.includes("piscis") || c.includes("pisces") || c === "♓") return "Piscis";

  return name;
}

/**
 * Western Astrology sign icons — clean, minimalist SVG line-art.
 * Matches the editorial style of ZodiacAnimalIcon.
 * viewBox 0 0 100 100, stroke-based, currentColor.
 */
export default function AstrologySignIcon({
  sign,
  size = 24,
  className = "",
  title,
}: AstrologySignIconProps) {
  const canonical = normalizeWesternSign(sign);
  const label = title || canonical || sign;

  const renderPath = () => {
    switch (canonical) {
      case "Aries":
        return (
          <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M25 70 Q25 40 40 30 Q50 24 50 20" />
            <path d="M50 20 Q50 24 60 30 Q75 40 75 70" />
            <path d="M40 55 L35 48 M60 55 L65 48" />
          </g>
        );

      case "Tauro":
        return (
          <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <circle cx="50" cy="58" r="18" />
            <path d="M25 35 Q25 25 35 25 Q42 25 42 32" />
            <path d="M75 35 Q75 25 65 25 Q58 25 58 32" />
            <circle cx="43" cy="55" r="2.5" fill="currentColor" />
            <circle cx="57" cy="55" r="2.5" fill="currentColor" />
          </g>
        );

      case "Géminis":
        return (
          <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M30 25 L30 75" />
            <path d="M70 25 L70 75" />
            <path d="M25 30 Q50 42 75 30" />
            <path d="M25 70 Q50 58 75 70" />
          </g>
        );

      case "Cáncer":
        return (
          <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M25 40 Q25 25 40 25 Q50 25 50 35 Q50 45 40 45 Q30 45 30 55 Q30 65 40 65" />
            <path d="M75 60 Q75 75 60 75 Q50 75 50 65 Q50 55 60 55 Q70 55 70 45 Q70 35 60 35" />
          </g>
        );

      case "Leo":
        return (
          <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M25 55 Q25 30 45 30 Q60 30 60 42 Q60 55 45 55 Q30 55 30 70 Q30 80 50 80 Q70 80 75 70" />
            <circle cx="25" cy="55" r="3" fill="currentColor" />
          </g>
        );

      case "Virgo":
        return (
          <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M20 25 L20 65 Q20 75 30 75 Q38 75 38 65 L38 35 Q38 25 48 25 Q58 25 58 35 L58 65 Q58 75 68 75 Q78 75 78 65 L78 25" />
            <path d="M78 25 L85 40" />
          </g>
        );

      case "Libra":
        return (
          <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M15 50 Q15 35 30 35 Q42 35 50 45 Q58 35 70 35 Q85 35 85 50" />
            <path d="M50 45 L50 70" />
            <path d="M35 70 L65 70" />
          </g>
        );

      case "Escorpio":
        return (
          <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M20 25 L20 65 Q20 75 30 75 Q38 75 38 65 L38 35 Q38 25 48 25 Q58 25 58 35 L58 65 Q58 75 68 75 Q78 75 78 65 L78 25" />
            <path d="M78 25 L85 18 M78 25 L82 20 M78 25 L85 30" />
          </g>
        );

      case "Sagitario":
        return (
          <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M25 75 L75 25" />
            <path d="M55 25 L75 25 L75 45" />
            <path d="M30 60 L38 52" />
          </g>
        );

      case "Capricornio":
        return (
          <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M25 30 L40 65 Q45 75 55 65 L65 40 Q70 30 78 30" />
            <path d="M25 30 L30 22 M78 30 L85 45 Q88 55 80 60" />
          </g>
        );

      case "Acuario":
        return (
          <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M20 40 Q30 30 40 40 Q50 50 60 40 Q70 30 80 40" />
            <path d="M20 55 Q30 45 40 55 Q50 65 60 55 Q70 45 80 55" />
          </g>
        );

      case "Piscis":
        return (
          <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <ellipse cx="35" cy="45" rx="15" ry="20" transform="rotate(-15 35 45)" />
            <ellipse cx="65" cy="55" rx="15" ry="20" transform="rotate(-15 65 55)" />
            <path d="M42 35 L58 65" />
          </g>
        );

      default:
        return (
          <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <circle cx="50" cy="50" r="25" />
            <circle cx="50" cy="50" r="5" fill="currentColor" fillOpacity="0.2" />
          </g>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`inline-block shrink-0 align-middle ${className}`}
      role="img"
      aria-label={label}
    >
      {renderPath()}
    </svg>
  );
}
