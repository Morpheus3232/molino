"use client";

import React from "react";

/**
 * LifePathGlyph — el número del Camino de Vida como ilustración SVG
 * en el mismo lenguaje line-art que AstrologySignIcon y ZodiacAnimalIcon.
 *
 * viewBox 0 0 100 100, trazo redondeado, `currentColor` (el acento lo da la
 * clase CSS). Los dígitos son un set geométrico propio, trazado sobre una
 * grilla fija —altura de caja y=22..78, ancho x=34..66— para que los diez
 * tengan el mismo peso óptico y ninguno parezca dibujado a pulso. Los números
 * maestros (11/22/33) se componen como dos dígitos pareados a menor escala.
 */

const DIGIT_PATHS: Record<string, string> = {
  "0": "M50 22 C61 22 66 34 66 50 C66 66 61 78 50 78 C39 78 34 66 34 50 C34 34 39 22 50 22 Z",
  "1": "M36 33 L50 22 L50 78 M38 78 L62 78",
  "2": "M34 34 C34 24 44 20 53 23 C63 26 67 37 59 46 L34 78 L67 78",
  "3": "M35 30 C40 21 61 21 63 32 C65 42 55 48 46 48 C57 48 67 53 67 64 C67 77 44 82 35 71",
  "4": "M58 78 L58 22 L34 61 L66 61",
  "5": "M64 22 L40 22 L36 47 C47 40 65 45 65 60 C65 75 48 82 36 74",
  "6": "M61 26 C48 18 34 29 34 51 C34 68 42 78 50 78 C60 78 66 70 66 61 C66 51 58 45 48 47 C41 49 35 55 34 61",
  "7": "M34 22 L67 22 L44 78",
  "8": "M50 22 C41 22 35 27 35 34 C35 43 44 47 50 50 C56 53 66 57 66 65 C66 74 58 78 50 78 C42 78 34 74 34 65 C34 57 44 53 50 50 C56 47 65 43 65 34 C65 27 59 22 50 22 Z",
  "9": "M39 74 C52 82 66 71 66 49 C66 32 58 22 50 22 C40 22 34 30 34 39 C34 49 42 55 52 53 C59 51 65 45 66 39",
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
