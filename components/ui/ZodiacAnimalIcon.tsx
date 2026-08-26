"use client";

import React from "react";

export type ZodiacAnimalName =
  | "Rata"
  | "Buey"
  | "Tigre"
  | "Gato"
  | "Conejo"
  | "Dragón"
  | "Dragon"
  | "Serpiente"
  | "Caballo"
  | "Cabra"
  | "Mono"
  | "Gallo"
  | "Perro"
  | "Cerdo"
  | string;

interface ZodiacAnimalIconProps {
  animal: ZodiacAnimalName;
  size?: number;
  className?: string;
  title?: string;
}

/** Normalize animal name / emoji / alias to canonical key. */
export function normalizeZodiacAnimal(name?: string): string {
  if (!name) return "";
  const cleaned = name.trim().toLowerCase();

  if (cleaned.includes("rat") || cleaned === "🐀") return "Rata";
  if (cleaned.includes("buey") || cleaned.includes("búfalo") || cleaned.includes("bufalo") || cleaned.includes("ox") || cleaned === "🐂" || cleaned === "🐃") return "Buey";
  if (cleaned.includes("tigr") || cleaned === "🐅" || cleaned === "🐯") return "Tigre";
  if (cleaned.includes("gat") || cleaned.includes("conej") || cleaned.includes("cat") || cleaned.includes("rabbit") || cleaned === "🐱" || cleaned === "🐰" || cleaned === "🐇") return "Gato";
  if (cleaned.includes("drag") || cleaned === "🐉" || cleaned === "🐲") return "Dragón";
  if (cleaned.includes("serp") || cleaned.includes("snake") || cleaned === "🐍") return "Serpiente";
  if (cleaned.includes("caball") || cleaned.includes("horse") || cleaned === "🐎" || cleaned === "🐴") return "Caballo";
  if (cleaned.includes("cabr") || cleaned.includes("oveja") || cleaned.includes("goat") || cleaned.includes("sheep") || cleaned === "🐐" || cleaned === "🐑") return "Cabra";
  if (cleaned.includes("mon") || cleaned.includes("monkey") || cleaned === "🐒" || cleaned === "🐵") return "Mono";
  if (cleaned.includes("gall") || cleaned.includes("rooster") || cleaned === "🐓" || cleaned === "🐔") return "Gallo";
  if (cleaned.includes("perr") || cleaned.includes("dog") || cleaned === "🐕" || cleaned === "🐶") return "Perro";
  if (cleaned.includes("cerd") || cleaned.includes("chanch") || cleaned.includes("pig") || cleaned.includes("boar") || cleaned === "🐖" || cleaned === "🐷") return "Cerdo";

  return name;
}

/**
 * Chinese Zodiac animal icons — clean, minimalist SVG line-art.
 * All paths use `currentColor` so the color is inherited from the parent.
 * viewBox 0 0 100 100, stroke-width 2, rounded caps and joins.
 */
export default function ZodiacAnimalIcon({
  animal,
  size = 24,
  className = "",
  title,
}: ZodiacAnimalIconProps) {
  const canonical = normalizeZodiacAnimal(animal);
  const label = title || canonical || animal;

  const renderPath = () => {
    switch (canonical) {
      case "Rata":
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M20,60 Q15,60 15,55 Q15,50 20,50 Q22,50 23,48 Q25,40 35,40 Q45,40 50,45 Q55,50 55,60 L55,65 Q55,70 50,70 L25,70 Q20,70 20,65 Z" />
            <path d="M20,55 Q10,52 8,50" />
            <path d="M22,52 Q20,48 18,46" />
            <circle cx="35" cy="52" r="2" fill="currentColor" />
            <path d="M50,45 Q60,35 65,35" />
          </g>
        );

      case "Buey":
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M25,55 L25,70 Q25,75 30,75 L65,75 Q70,75 70,70 L70,55 Q70,50 65,50 L30,50 Q25,50 25,55" />
            <path d="M30,50 Q30,40 35,35 Q40,30 45,32" />
            <path d="M65,50 Q65,40 60,35 Q55,30 50,32" />
            <path d="M35,35 L38,25" />
            <path d="M60,35 L57,25" />
            <circle cx="40" cy="58" r="1.5" fill="currentColor" />
            <circle cx="60" cy="58" r="1.5" fill="currentColor" />
            <path d="M45,65 Q50,68 55,65" />
          </g>
        );

      case "Tigre":
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M20,55 L20,70 Q20,75 25,75 L70,75 Q75,75 75,70 L75,55 Q75,50 70,50 L25,50 Q20,50 20,55" />
            <path d="M30,50 L30,40 Q30,35 35,35" />
            <path d="M65,50 L65,40 Q65,35 60,35" />
            <path d="M35,35 L33,28" />
            <path d="M60,35 L62,28" />
            <circle cx="35" cy="58" r="1.5" fill="currentColor" />
            <circle cx="60" cy="58" r="1.5" fill="currentColor" />
            <path d="M42,65 Q47,68 52,65" />
            <path d="M35,55 L38,62" />
            <path d="M45,55 L47,62" />
            <path d="M55,55 L53,62" />
            <path d="M65,55 L62,62" />
          </g>
        );

      case "Gato":
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M40,45 L40,30 Q40,25 43,25 Q46,25 46,30 L46,45" />
            <path d="M55,45 L55,28 Q55,23 58,23 Q61,23 61,28 L61,45" />
            <ellipse cx="50" cy="60" rx="18" ry="15" />
            <circle cx="45" cy="58" r="2" fill="currentColor" />
            <circle cx="55" cy="58" r="2" fill="currentColor" />
            <path d="M48,63 Q50,65 52,63" />
            <path d="M40,60 Q35,60 33,62" />
            <path d="M60,60 Q65,60 67,62" />
          </g>
        );

      case "Dragón":
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M25,40 Q20,35 22,30 Q24,25 30,25 Q35,25 38,28" />
            <path d="M38,28 Q45,25 50,28 Q55,31 55,38" />
            <path d="M55,38 Q55,45 50,48 Q45,51 40,50" />
            <path d="M40,50 L38,60 Q37,65 40,68" />
            <path d="M40,50 L30,52 Q25,53 23,58" />
            <circle cx="32" cy="35" r="2" fill="currentColor" />
            <path d="M35,32 L37,28" />
            <path d="M38,31 L40,27" />
          </g>
        );

      case "Serpiente":
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M30,65 Q25,65 25,55 Q25,45 35,45 Q45,45 45,55 Q45,65 55,65 Q65,65 65,55 Q65,45 60,45" />
            <path d="M60,45 Q55,45 55,40 Q55,35 60,35 Q65,35 65,40" />
            <circle cx="60" cy="38" r="1.5" fill="currentColor" />
            <path d="M63,40 Q66,38 68,38" />
          </g>
        );

      case "Caballo":
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M30,45 L35,35 Q38,30 43,30 Q48,30 50,35 L52,40" />
            <path d="M50,40 L55,45 Q60,50 60,60 L60,70 Q60,75 55,75 L35,75 Q30,75 30,70 L30,55" />
            <path d="M35,35 Q33,30 32,28" />
            <path d="M38,33 Q37,29 36,27" />
            <circle cx="45" cy="48" r="1.5" fill="currentColor" />
            <path d="M55,75 L55,82" />
            <path d="M35,75 L35,82" />
          </g>
        );

      case "Cabra":
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M30,50 L30,65 Q30,70 35,70 L60,70 Q65,70 65,65 L65,50 Q65,45 60,45 L35,45 Q30,45 30,50" />
            <path d="M35,45 Q35,38 38,33 Q41,28 45,30" />
            <path d="M60,45 Q60,38 57,33 Q54,28 50,30" />
            <path d="M38,33 L36,26" />
            <path d="M57,33 L59,26" />
            <circle cx="42" cy="53" r="1.5" fill="currentColor" />
            <circle cx="53" cy="53" r="1.5" fill="currentColor" />
            <path d="M45,58 Q47,60 50,58" />
          </g>
        );

      case "Mono":
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <ellipse cx="50" cy="55" rx="20" ry="18" />
            <circle cx="50" cy="48" r="12" />
            <circle cx="45" cy="46" r="2" fill="currentColor" />
            <circle cx="55" cy="46" r="2" fill="currentColor" />
            <path d="M47,52 Q50,54 53,52" />
            <path d="M38,48 Q33,45 30,48" />
            <path d="M62,48 Q67,45 70,48" />
            <path d="M35,65 L32,75" />
            <path d="M65,65 L68,75" />
          </g>
        );

      case "Gallo":
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M35,55 L35,70 Q35,75 40,75 L60,75 Q65,75 65,70 L65,55 Q65,50 60,50 L40,50 Q35,50 35,55" />
            <path d="M40,50 Q38,40 42,35 Q46,30 52,32" />
            <path d="M52,32 Q55,28 55,25" />
            <path d="M48,33 Q47,28 48,25" />
            <circle cx="48" cy="55" r="1.5" fill="currentColor" />
            <path d="M62,55 Q68,53 70,55 Q68,57 62,58" />
            <path d="M50,75 L50,82" />
            <path d="M60,75 L60,82" />
          </g>
        );

      case "Perro":
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M30,50 L30,65 Q30,70 35,70 L65,70 Q70,70 70,65 L70,55 Q70,50 65,50 L35,50 Q30,50 30,55" />
            <path d="M35,50 L35,38 Q35,33 40,33 Q45,33 45,38 L45,50" />
            <path d="M55,50 L55,38 Q55,33 52,33 Q49,33 49,38 L49,50" />
            <circle cx="42" cy="58" r="2" fill="currentColor" />
            <circle cx="58" cy="58" r="2" fill="currentColor" />
            <path d="M47,63 Q50,66 53,63" />
            <path d="M70,60 Q75,58 77,60" />
          </g>
        );

      case "Cerdo":
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <ellipse cx="50" cy="60" rx="22" ry="18" />
            <path d="M35,55 Q30,50 32,45 Q34,40 38,42" />
            <path d="M65,55 Q70,50 68,45 Q66,40 62,42" />
            <circle cx="42" cy="58" r="2" fill="currentColor" />
            <circle cx="58" cy="58" r="2" fill="currentColor" />
            <ellipse cx="50" cy="62" rx="5" ry="3" />
            <circle cx="48" cy="62" r="0.8" fill="currentColor" />
            <circle cx="52" cy="62" r="0.8" fill="currentColor" />
            <path d="M50,78 L50,82" />
            <path d="M40,75 L38,80" />
          </g>
        );

      default:
        return (
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M50,20v60M20,50h60M29.29,29.29l41.42,41.42M29.29,70.71l41.42-41.42" strokeWidth="1.5" opacity="0.35" />
            <circle cx="50" cy="50" r="8" fill="currentColor" fillOpacity="0.12" />
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
