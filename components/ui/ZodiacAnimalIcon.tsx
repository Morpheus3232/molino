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
 * Chinese Zodiac animal icons — detailed SVG illustrations with subtle fills
 * for body parts. Strokes inherit `currentColor`, fills use a fixed neutral
 * palette (#f8f9fa / #e9ecef / #dee2e6) that works in both light and dark mode.
 * viewBox 0 0 100 100, stroke-width 2.5, rounded caps and joins.
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
          <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <ellipse cx="50" cy="60" rx="25" ry="18" fill="#f8f9fa" />
            <circle cx="35" cy="50" r="12" fill="#e9ecef" />
            <circle cx="28" cy="42" r="5" fill="#dee2e6" />
            <circle cx="42" cy="42" r="5" fill="#dee2e6" />
            <ellipse cx="28" cy="52" rx="6" ry="4" fill="#ced4da" />
            <circle cx="32" cy="48" r="2" fill="#2c3e50" />
            <circle cx="38" cy="48" r="2" fill="#2c3e50" />
            <path d="M22 50 L15 48 M22 52 L15 52 M22 54 L15 56" />
            <path d="M75 62 Q85 60 88 65 Q90 68 85 70" strokeWidth="2" />
            <ellipse cx="40" cy="76" rx="4" ry="3" fill="#dee2e6" />
            <ellipse cx="60" cy="76" rx="4" ry="3" fill="#dee2e6" />
          </g>
        );

      case "Buey":
        return (
          <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <rect x="30" y="45" width="45" height="30" rx="8" fill="#f8f9fa" />
            <rect x="20" y="35" width="20" height="18" rx="5" fill="#e9ecef" />
            <path d="M22 35 Q18 28 20 22" strokeWidth="3" />
            <path d="M38 35 Q42 28 40 22" strokeWidth="3" />
            <path d="M20 38 L15 35 L16 42" fill="#dee2e6" />
            <path d="M40 38 L45 35 L44 42" fill="#dee2e6" />
            <circle cx="28" cy="42" r="2" fill="#2c3e50" />
            <ellipse cx="30" cy="48" rx="5" ry="3" fill="#ced4da" />
            <circle cx="28" cy="48" r="1" fill="#2c3e50" />
            <circle cx="32" cy="48" r="1" fill="#2c3e50" />
            <rect x="33" y="75" width="6" height="12" rx="2" fill="#dee2e6" />
            <rect x="43" y="75" width="6" height="12" rx="2" fill="#dee2e6" />
            <rect x="53" y="75" width="6" height="12" rx="2" fill="#dee2e6" />
            <rect x="63" y="75" width="6" height="12" rx="2" fill="#dee2e6" />
            <path d="M75 55 Q80 58 78 65" strokeWidth="2" />
          </g>
        );

      case "Tigre":
        return (
          <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <ellipse cx="50" cy="60" rx="28" ry="20" fill="#f8f9fa" />
            <circle cx="35" cy="45" r="15" fill="#e9ecef" />
            <path d="M23 38 L18 28 L28 32 Z" fill="#dee2e6" />
            <path d="M47 38 L52 28 L42 32 Z" fill="#dee2e6" />
            <path d="M35 32 L35 38 M30 34 L32 38 M40 34 L38 38" strokeWidth="2" />
            <circle cx="30" cy="43" r="2.5" fill="#2c3e50" />
            <circle cx="40" cy="43" r="2.5" fill="#2c3e50" />
            <path d="M33 48 L37 48 L35 50 Z" fill="#2c3e50" />
            <path d="M25 46 L20 44 M25 48 L20 48 M25 50 L20 52" />
            <path d="M45 46 L50 44 M45 48 L50 48 M45 50 L50 52" />
            <path d="M45 52 L48 60 M52 50 L55 62 M58 52 L60 58" strokeWidth="2" />
            <path d="M78 60 Q88 55 90 60 Q91 63 88 65" strokeWidth="3" />
            <ellipse cx="40" cy="78" rx="5" ry="3" fill="#dee2e6" />
            <ellipse cx="60" cy="78" rx="5" ry="3" fill="#dee2e6" />
          </g>
        );

      case "Gato":
        return (
          <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <ellipse cx="50" cy="65" rx="22" ry="18" fill="#f8f9fa" />
            <circle cx="50" cy="42" r="16" fill="#e9ecef" />
            <ellipse cx="42" cy="28" rx="5" ry="10" fill="#dee2e6" />
            <ellipse cx="58" cy="28" rx="5" ry="10" fill="#dee2e6" />
            <ellipse cx="42" cy="28" rx="3" ry="7" fill="#f8f9fa" />
            <ellipse cx="58" cy="28" rx="3" ry="7" fill="#f8f9fa" />
            <circle cx="45" cy="40" r="3" fill="#2c3e50" />
            <circle cx="55" cy="40" r="3" fill="#2c3e50" />
            <circle cx="46" cy="39" r="1" fill="white" />
            <circle cx="56" cy="39" r="1" fill="white" />
            <path d="M48 46 L52 46 L50 48 Z" fill="#e74c3c" />
            <path d="M38 46 L30 44 M38 48 L30 48 M38 50 L30 52" />
            <path d="M62 46 L70 44 M62 48 L70 48 M62 50 L70 52" />
            <ellipse cx="42" cy="80" rx="4" ry="3" fill="#dee2e6" />
            <ellipse cx="58" cy="80" rx="4" ry="3" fill="#dee2e6" />
          </g>
        );

      case "Dragón":
        return (
          <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M20 60 Q30 50 40 55 Q50 60 60 55 Q70 50 80 55" fill="#f8f9fa" strokeWidth="8" />
            <ellipse cx="25" cy="55" rx="12" ry="10" fill="#e9ecef" />
            <path d="M20 48 Q15 38 18 32" strokeWidth="3" />
            <path d="M30 48 Q35 38 32 32" strokeWidth="3" />
            <path d="M15 58 Q8 55 5 50" strokeWidth="2" />
            <path d="M35 58 Q42 55 45 50" strokeWidth="2" />
            <circle cx="22" cy="52" r="2.5" fill="#2c3e50" />
            <circle cx="28" cy="52" r="2.5" fill="#2c3e50" />
            <path d="M20 60 Q25 63 30 60" strokeWidth="2" />
            <path d="M18 45 L15 40 L20 42 L22 38 L25 42 L28 38 L30 42 L32 40 L35 45" fill="#dee2e6" />
            <path d="M80 55 Q88 52 90 58 Q91 62 88 65" strokeWidth="4" />
          </g>
        );

      case "Serpiente":
        return (
          <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M30 70 Q25 60 30 50 Q35 40 45 45 Q55 50 55 60 Q55 70 65 65 Q75 60 75 50" fill="#f8f9fa" strokeWidth="7" />
            <path d="M35 55 Q38 58 35 61" strokeWidth="1.5" />
            <path d="M45 50 Q48 53 45 56" strokeWidth="1.5" />
            <path d="M55 55 Q58 58 55 61" strokeWidth="1.5" />
            <path d="M65 60 Q68 63 65 66" strokeWidth="1.5" />
            <ellipse cx="30" cy="72" rx="8" ry="6" fill="#e9ecef" />
            <circle cx="28" cy="70" r="1.5" fill="#2c3e50" />
            <circle cx="32" cy="70" r="1.5" fill="#2c3e50" />
            <path d="M22 74 L18 72 M22 74 L18 76" strokeWidth="1.5" />
          </g>
        );

      case "Caballo":
        return (
          <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <ellipse cx="55" cy="55" rx="25" ry="18" fill="#f8f9fa" />
            <path d="M35 50 Q30 40 32 35" strokeWidth="10" />
            <ellipse cx="32" cy="32" rx="10" ry="7" fill="#e9ecef" />
            <ellipse cx="24" cy="34" rx="5" ry="4" fill="#dee2e6" />
            <circle cx="28" cy="30" r="2" fill="#2c3e50" />
            <path d="M35 28 L38 22 L40 28" fill="#dee2e6" />
            <path d="M30 28 L27 22 L29 28" fill="#dee2e6" />
            <path d="M35 35 L38 32 L36 38 L40 35 L37 40" strokeWidth="2" />
            <rect x="42" y="72" width="5" height="15" rx="2" fill="#dee2e6" />
            <rect x="52" y="72" width="5" height="15" rx="2" fill="#dee2e6" />
            <rect x="62" y="72" width="5" height="15" rx="2" fill="#dee2e6" />
            <rect x="72" y="72" width="5" height="15" rx="2" fill="#dee2e6" />
            <path d="M80 55 Q85 58 83 65 Q82 70 85 72" strokeWidth="3" />
            <circle cx="20" cy="34" r="1.5" fill="#2c3e50" />
          </g>
        );

      case "Cabra":
        return (
          <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <ellipse cx="50" cy="60" rx="25" ry="18" fill="#f8f9fa" />
            <ellipse cx="35" cy="45" rx="12" ry="10" fill="#e9ecef" />
            <path d="M28 40 Q22 35 24 30 Q26 26 30 28" strokeWidth="2.5" />
            <path d="M42 40 Q48 35 46 30 Q44 26 40 28" strokeWidth="2.5" />
            <path d="M25 42 L20 38 L22 45" fill="#dee2e6" />
            <path d="M45 42 L50 38 L48 45" fill="#dee2e6" />
            <circle cx="32" cy="43" r="2" fill="#2c3e50" />
            <circle cx="38" cy="43" r="2" fill="#2c3e50" />
            <path d="M35 52 L33 58 L35 62 L37 58 Z" fill="#dee2e6" />
            <rect x="38" y="76" width="5" height="12" rx="2" fill="#dee2e6" />
            <rect x="48" y="76" width="5" height="12" rx="2" fill="#dee2e6" />
            <rect x="58" y="76" width="5" height="12" rx="2" fill="#dee2e6" />
            <rect x="68" y="76" width="5" height="12" rx="2" fill="#dee2e6" />
            <path d="M75 58 Q78 55 77 52" strokeWidth="2" />
          </g>
        );

      case "Mono":
        return (
          <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <ellipse cx="50" cy="65" rx="20" ry="16" fill="#f8f9fa" />
            <circle cx="50" cy="42" r="15" fill="#e9ecef" />
            <circle cx="36" cy="40" r="4" fill="#dee2e6" />
            <circle cx="64" cy="40" r="4" fill="#dee2e6" />
            <ellipse cx="50" cy="45" rx="10" ry="8" fill="#f8f9fa" />
            <circle cx="46" cy="42" r="2.5" fill="#2c3e50" />
            <circle cx="54" cy="42" r="2.5" fill="#2c3e50" />
            <path d="M48 46 L52 46 L50 48 Z" fill="#2c3e50" />
            <path d="M46 50 Q50 53 54 50" strokeWidth="1.5" />
            <path d="M35 60 Q28 65 30 70" strokeWidth="4" />
            <path d="M65 60 Q72 65 70 70" strokeWidth="4" />
            <ellipse cx="42" cy="80" rx="5" ry="3" fill="#dee2e6" />
            <ellipse cx="58" cy="80" rx="5" ry="3" fill="#dee2e6" />
            <path d="M50 80 Q50 88 55 90 Q58 91 60 88" strokeWidth="3" />
          </g>
        );

      case "Gallo":
        return (
          <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <ellipse cx="55" cy="60" rx="20" ry="16" fill="#f8f9fa" />
            <circle cx="38" cy="45" r="12" fill="#e9ecef" />
            <path d="M30 40 L28 32 L33 36 L35 28 L38 35 L40 28 L43 35 L45 32 L48 38" fill="#e74c3c" stroke="none" />
            <path d="M32 50 L28 55 L30 60 L35 58 Z" fill="#e74c3c" stroke="none" />
            <path d="M28 46 L20 48 L28 50 Z" fill="#f39c12" />
            <circle cx="35" cy="43" r="2.5" fill="#2c3e50" />
            <circle cx="36" cy="42" r="1" fill="white" />
            <path d="M50 55 Q58 58 60 65 Q58 70 50 68 Z" fill="#dee2e6" />
            <path d="M75 55 Q82 48 85 52 Q87 55 83 60" strokeWidth="4" />
            <path d="M75 58 Q83 53 86 58 Q88 62 84 66" strokeWidth="4" />
            <path d="M48 75 L48 82 M45 82 L51 82" strokeWidth="2" />
            <path d="M62 75 L62 82 M59 82 L65 82" strokeWidth="2" />
          </g>
        );

      case "Perro":
        return (
          <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <ellipse cx="55" cy="60" rx="25" ry="18" fill="#f8f9fa" />
            <ellipse cx="32" cy="48" rx="14" ry="12" fill="#e9ecef" />
            <path d="M22 42 L18 52 L24 55 L25 45" fill="#dee2e6" />
            <path d="M42 42 L46 52 L40 55 L39 45" fill="#dee2e6" />
            <circle cx="28" cy="46" r="2.5" fill="#2c3e50" />
            <circle cx="36" cy="46" r="2.5" fill="#2c3e50" />
            <circle cx="32" cy="52" r="2" fill="#2c3e50" />
            <path d="M30 55 Q32 57 34 55" strokeWidth="1.5" />
            <path d="M32 57 L32 60" strokeWidth="2" />
            <rect x="40" y="76" width="6" height="12" rx="2" fill="#dee2e6" />
            <rect x="52" y="76" width="6" height="12" rx="2" fill="#dee2e6" />
            <rect x="64" y="76" width="6" height="12" rx="2" fill="#dee2e6" />
            <rect x="76" y="76" width="6" height="12" rx="2" fill="#dee2e6" />
            <path d="M80 55 Q88 50 90 58 Q91 62 88 65" strokeWidth="3" />
          </g>
        );

      case "Cerdo":
        return (
          <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <ellipse cx="50" cy="60" rx="28" ry="22" fill="#f8f9fa" />
            <ellipse cx="35" cy="50" rx="15" ry="12" fill="#e9ecef" />
            <path d="M25 42 L22 35 L30 38 Z" fill="#dee2e6" />
            <path d="M45 42 L48 35 L40 38 Z" fill="#dee2e6" />
            <ellipse cx="25" cy="52" rx="8" ry="6" fill="#f8b4b4" />
            <circle cx="23" cy="52" r="1.5" fill="#2c3e50" />
            <circle cx="27" cy="52" r="1.5" fill="#2c3e50" />
            <circle cx="32" cy="46" r="2.5" fill="#2c3e50" />
            <circle cx="38" cy="46" r="2.5" fill="#2c3e50" />
            <ellipse cx="38" cy="80" rx="5" ry="4" fill="#dee2e6" />
            <ellipse cx="50" cy="82" rx="5" ry="4" fill="#dee2e6" />
            <ellipse cx="62" cy="80" rx="5" ry="4" fill="#dee2e6" />
            <path d="M78 58 Q85 55 87 60 Q88 65 83 63 Q80 62 82 66" strokeWidth="3" />
          </g>
        );

      default:
        return (
          <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
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
