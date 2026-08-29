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
 * Glifos del zodíaco occidental — los símbolos astronómicos reales, dibujados
 * con la misma gramática que ZodiacAnimalIcon: trazo único en `currentColor`,
 * extremos redondeados, relleno tenue solo donde el glifo tiene un cuerpo
 * (el disco de Tauro, las pinzas de Cáncer).
 *
 * viewBox 0 0 100 100.
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
          <>
            <path d="M50 44 C50 28 41 20 32 24 C19 30 16 54 25 68 C30 76 40 76 42 68" />
            <path d="M50 44 C50 28 59 20 68 24 C81 30 84 54 75 68 C70 76 60 76 58 68" />
          </>
        );

      case "Tauro":
        return (
          <>
            <circle cx="50" cy="62" r="17" fill="currentColor" fillOpacity="0.07" />
            <path d="M27 45 C27 24 73 24 73 45" />
          </>
        );

      case "Géminis":
        return (
          <>
            <path d="M33 31 L33 69 M67 31 L67 69" />
            <path d="M23 31 C36 22 64 22 77 31" />
            <path d="M23 69 C36 78 64 78 77 69" />
          </>
        );

      case "Cáncer":
        return (
          <>
            <path d="M19 43 C27 31 45 27 63 33" />
            <circle cx="28" cy="51" r="8" fill="currentColor" fillOpacity="0.12" />
            <path d="M81 63 C73 75 55 79 37 73" />
            <circle cx="72" cy="55" r="8" fill="currentColor" fillOpacity="0.12" />
          </>
        );

      case "Leo":
        return (
          <>
            <path d="M79 63 C81 70 78 76 71 78 C61 81 51 74 51 62 C51 49 39 43 29 50 C19 57 22 73 34 73 C42 73 47 67 44 60" />
          </>
        );

      case "Virgo":
        return (
          <>
            <path d="M24 72 L24 34 C24 25 34 25 34 34 L34 72" />
            <path d="M34 34 C34 25 44 25 44 34 L44 72" />
            <path d="M44 34 C44 25 57 25 57 36 L57 57 C57 68 48 72 41 67" />
            <path d="M57 45 C62 62 70 70 81 72" />
          </>
        );

      case "Libra":
        return (
          <>
            <path d="M18 71 L82 71" />
            <path d="M18 54 L35 54 C35 37 65 37 65 54 L82 54" />
          </>
        );

      case "Escorpio":
        return (
          <>
            <path d="M22 72 L22 34 C22 25 32 25 32 34 L32 72" />
            <path d="M32 34 C32 25 42 25 42 34 L42 72" />
            <path d="M42 34 C42 25 54 25 54 34 L54 64 L76 42" />
            <path d="M76 42 L63 42 M76 42 L76 55" />
          </>
        );

      case "Sagitario":
        return (
          <>
            <path d="M25 75 L75 25" />
            <path d="M54 25 L75 25 L75 46" />
            <path d="M34 50 L52 68" />
          </>
        );

      case "Capricornio":
        return (
          <>
            <path d="M21 27 L34 64 C36 71 43 71 45 62 L50 41 C52 34 58 32 64 36 C72 42 75 57 68 65 C63 71 54 70 52 62" />
          </>
        );

      case "Acuario":
        return (
          <>
            <path d="M19 45 L32 36 L45 45 L58 36 L71 45 L84 36" />
            <path d="M19 62 L32 53 L45 62 L58 53 L71 62 L84 53" />
          </>
        );

      case "Piscis":
        return (
          <>
            <path d="M34 22 C21 37 21 63 34 78" />
            <path d="M66 22 C79 37 79 63 66 78" />
            <path d="M24 50 L76 50" />
          </>
        );

      default:
        return (
          <>
            <circle cx="50" cy="50" r="26" strokeWidth="2.4" opacity="0.35" />
            <circle cx="50" cy="50" r="8" fill="currentColor" fillOpacity="0.12" stroke="none" />
          </>
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
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {renderPath()}
      </g>
    </svg>
  );
}
