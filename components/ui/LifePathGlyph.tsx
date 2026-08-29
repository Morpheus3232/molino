"use client";

import React from "react";

/**
 * LifePathGlyph — el número del Camino de Vida como ilustración SVG
 * en el mismo lenguaje line-art que AstrologySignIcon y ZodiacAnimalIcon.
 *
 * viewBox 0 0 100 100, trazo redondeado, `currentColor` (el acento lo da la
 * clase CSS). Los dígitos 0-9 se dibujan como glifos geométricos manuales
 * (cartografía simple, sin fuentes externas) y los números maestros
 * (11/22/33) se componen como dos dígitos pareados a menor escala.
 */

const DIGIT_PATHS: Record<string, string> = {
  "0": "M50 24 C33 24 33 78 50 78 C67 78 67 24 50 24 Z",
  "1": "M44 36 L52 26 L52 36 M52 36 L52 78 M40 80 H62",
  "2": "M40 25 Q50 16 60 26 L34 72 L62 72",
  "3": "M38 25 C34 16 64 14 64 28 C64 38 48 42 44 50 C48 58 62 62 62 72 C62 86 40 86 38 74",
  "4": "M62 24 L62 78 M62 24 L35 55 M35 24 L35 55",
  "5": "M64 24 H38 M38 24 L38 50 M38 50 C35 72 62 78 62 62",
  "6": "M50 74 C36 74 36 52 50 52 C64 52 64 74 50 74 M38 26 C34 44 40 52 50 52",
  "7": "M36 24 H64 M64 24 L48 76",
  "8": "M50 26 C38 26 38 40 50 40 C62 40 62 26 50 26 M50 60 C38 60 38 76 50 76 C62 76 62 60 50 60",
  "9": "M50 26 C36 26 36 48 50 48 C64 48 64 26 50 26 M50 48 C46 58 52 74 62 74",
};

interface LifePathGlyphProps {
  value?: number;
  size?: number;
  className?: string;
  title?: string;
}

export default function LifePathGlyph({
  value = 1,
  size = 64,
  className = "",
  title,
}: LifePathGlyphProps) {
  const digits = String(value).split("");
  const single = digits.length === 1;
  const label = title || `Camino de Vida ${value}`;

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
        strokeWidth={single ? 4 : 6.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {digits.map((digit, idx) => {
          const d = DIGIT_PATHS[digit] || DIGIT_PATHS["1"];
          if (single) return <path key={idx} d={d} />;
          const cx = idx === 0 ? 38 : 62;
          return (
            <g
              key={idx}
              transform={`translate(${cx} 50) scale(0.62) translate(-50 -50)`}
            >
              <path d={d} />
            </g>
          );
        })}
      </g>
    </svg>
  );
}