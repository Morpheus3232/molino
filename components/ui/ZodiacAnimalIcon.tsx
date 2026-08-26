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
 * High-precision, editorial minimalist vector iconography for the 12 Chinese Zodiac animals.
 * Designed to scale crisply from 16px to 96px using `currentColor`.
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
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {/* Body and snout */}
            <path d="M4 17c1-3 3-5 6-5.5 3-.5 6 1 8 3.5.8 1 1 2.5.5 3.5-.8 1.5-3 1.5-6.5 1.5-3.5 0-7-.5-8-3z" fill="currentColor" fillOpacity="0.12" />
            <path d="M4 17c-1.5-.5-2.5-1.5-2.5-2.5 0-1.5 2-2.5 4.5-2.5 2 0 3.5.8 4.5 2" />
            {/* Ear */}
            <ellipse cx="10" cy="8.5" rx="3" ry="3.5" fill="currentColor" fillOpacity="0.2" />
            {/* Eye */}
            <circle cx="5" cy="14" r="0.8" fill="currentColor" />
            {/* Whiskers */}
            <path d="M2 15l-1.5.5M2 16l-1.5 1.5M4 16.5l-1 2" strokeWidth="1.2" />
            {/* Tail */}
            <path d="M18 17.5c2.5-.5 4.5-2 4.5-4.5 0-3-2.5-4-2.5-6.5" strokeWidth="1.4" />
          </g>
        );

      case "Buey":
        return (
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {/* Horns */}
            <path d="M3 7c1.5 3 4 4.5 6 4.5M21 7c-1.5 3-4 4.5-6 4.5" strokeWidth="1.8" />
            {/* Head silhouette */}
            <path d="M7 10h10l1 5-2.5 5h-7L7 15l-1-5z" fill="currentColor" fillOpacity="0.12" />
            {/* Snout and septum ring */}
            <ellipse cx="12" cy="17" rx="3.5" ry="2.2" fill="currentColor" fillOpacity="0.2" />
            <circle cx="10.5" cy="17" r="0.6" fill="currentColor" />
            <circle cx="13.5" cy="17" r="0.6" fill="currentColor" />
            {/* Eyes */}
            <circle cx="9" cy="12.5" r="0.8" fill="currentColor" />
            <circle cx="15" cy="12.5" r="0.8" fill="currentColor" />
            {/* Ears */}
            <path d="M6.5 11.5L4 13M17.5 11.5L20 13" />
          </g>
        );

      case "Tigre":
        return (
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {/* Head outline */}
            <path d="M5 10c0-3.5 3-6 7-6s7 2.5 7 6c0 5-3 9-7 9s-7-4-7-9z" fill="currentColor" fillOpacity="0.12" />
            {/* Ears */}
            <path d="M5 8c-1.5 0-2.5-1.5-2-3 1.5-.5 3 .5 3.5 2M19 8c1.5 0 2.5-1.5 2-3-1.5-.5-3 .5-3.5 2" />
            {/* Traditional 'King' mark on forehead */}
            <path d="M10 6.5h4M10.5 8h3M12 5v4.5M10 9.5h4" strokeWidth="1.2" />
            {/* Eyes */}
            <path d="M8 12l2-.5M16 12l-2-.5" strokeWidth="1.5" />
            {/* Nose and whiskers */}
            <path d="M11 14.5h2l-1 1.5z" fill="currentColor" />
            <path d="M6 14.5l-3-.5M6 16l-3 1M18 14.5l3-.5M18 16l3 1" strokeWidth="1.2" />
          </g>
        );

      case "Gato":
        return (
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {/* Head and ears */}
            <path d="M4 11L5 5l5 3c1-.3 3-.3 4 0l5-3 1 6c1 3 .5 7-3 9-2 1-6 1-8 0-3.5-2-4-6-3-9z" fill="currentColor" fillOpacity="0.12" />
            {/* Inner ear lines */}
            <path d="M7 7.5L6 9M17 7.5L18 9" strokeWidth="1.2" />
            {/* Eyes */}
            <circle cx="8.5" cy="12.5" r="0.9" fill="currentColor" />
            <circle cx="15.5" cy="12.5" r="0.9" fill="currentColor" />
            {/* Nose and mouth */}
            <path d="M11.5 15h1l-.5.8z" fill="currentColor" />
            <path d="M12 15.8v1.2c-.8.8-1.8.8-2.2.3M12 17c.8.8 1.8.8 2.2.3" strokeWidth="1.2" />
            {/* Whiskers */}
            <path d="M6 14.5l-3.5-.5M6 16l-3.5 1M18 14.5l3.5-.5M18 16l3.5 1" strokeWidth="1.2" />
          </g>
        );

      case "Dragón":
        return (
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {/* Horns / Antlers */}
            <path d="M13 3c0 3 2 4.5 4 5M16 4.5c1 1 2.5 1.5 4 1.5" strokeWidth="1.5" />
            <path d="M10 4c-.5 2-1.5 3-3 3.5" strokeWidth="1.3" />
            {/* Dragon head and snout */}
            <path d="M6 14c-1.5-.5-3-1-3-2.5 0-2 2-3 4.5-3 3.5 0 6 2 8.5 2 2.5 0 4-1 5-2.5v4c-1 2-3 3-5 3.5-3 .8-6 .5-8 1.5-1.5.8-2 2-2 3" fill="currentColor" fillOpacity="0.12" />
            {/* Flowing beard / whiskers */}
            <path d="M4.5 13.5c-1.5 1.5-2 3.5-1 5.5M7 16c0 2.5 1.5 4.5 3 5.5" strokeWidth="1.3" />
            {/* Eye and brow */}
            <circle cx="10" cy="10" r="1" fill="currentColor" />
            <path d="M8.5 8.5c1.5-.5 3 0 4 1" strokeWidth="1.4" />
            {/* Scales / mane teeth */}
            <path d="M15 13.5l1.5-1.5 1.5 1.5 1.5-1.5" strokeWidth="1.2" />
          </g>
        );

      case "Serpiente":
        return (
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {/* Coiled S-curve body */}
            <path d="M15 6c2.5 0 4 1.5 4 3.5s-2 3-5 3.5-5 1.5-5 3.5 1.8 3.5 4.5 3.5c3 0 5-1.5 6-3.5" strokeWidth="1.8" />
            {/* Snake head */}
            <path d="M15 6c-1.5 0-3.5-.8-5-1.5-2-1-3.5-.5-4.5 1-.8 1.2-.5 2.8 1 3.5 1.8.8 4.5.5 6.5-.5" fill="currentColor" fillOpacity="0.15" />
            {/* Eye */}
            <circle cx="7.5" cy="6.2" r="0.8" fill="currentColor" />
            {/* Forked tongue */}
            <path d="M4 6.5L2 6M2 6l-.8-.8M2 6l-.8.8" strokeWidth="1.2" />
          </g>
        );

      case "Caballo":
        return (
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {/* Ears */}
            <path d="M11 4l1.5 3.5M13.5 4l1 3.5" />
            {/* Horse head profile */}
            <path d="M12 7.5c2 0 4.5 1.5 5 4 .5 2.5-1.5 5-3.5 5.5-1.5.4-3 .2-4-.5l-3 1.5c-1.5.8-3 .2-3.5-1-.6-1.4.2-3 1.5-3.5l3-1c.5-1.5 1.5-4 4.5-5z" fill="currentColor" fillOpacity="0.12" />
            {/* Flowing mane */}
            <path d="M14.5 7.5c3 1 5 3.5 5.5 6.5M16 11c2.5 1.5 3.5 4 3.5 6.5M17.5 15c1.5 1.5 2 3.5 2 5.5" strokeWidth="1.4" />
            {/* Nostril and eye */}
            <circle cx="5" cy="14" r="0.7" fill="currentColor" />
            <circle cx="11" cy="10" r="0.9" fill="currentColor" />
            {/* Neck line */}
            <path d="M9 17c1.5 2.5 2.5 4.5 3 6" />
          </g>
        );

      case "Cabra":
        return (
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {/* Sweeping horns */}
            <path d="M10 7C8 3 5 3 3 5M14 7c2-4 5-4 7-2" strokeWidth="1.8" />
            {/* Head outline */}
            <path d="M8 8h8l1 6-5 6-5-6 1-6z" fill="currentColor" fillOpacity="0.12" />
            {/* Ears */}
            <path d="M7 10L3.5 12M17 10l3.5 2" />
            {/* Eyes */}
            <circle cx="9" cy="12" r="0.8" fill="currentColor" />
            <circle cx="15" cy="12" r="0.8" fill="currentColor" />
            {/* Snout and chin beard */}
            <ellipse cx="12" cy="17.5" rx="2" ry="1.2" fill="currentColor" fillOpacity="0.2" />
            <path d="M11 20l1 3 1-3" strokeWidth="1.4" />
          </g>
        );

      case "Mono":
        return (
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {/* Large rounded ears */}
            <circle cx="4.5" cy="12" r="2.8" fill="currentColor" fillOpacity="0.15" />
            <circle cx="19.5" cy="12" r="2.8" fill="currentColor" fillOpacity="0.15" />
            {/* Head outline */}
            <circle cx="12" cy="12" r="6.5" fill="currentColor" fillOpacity="0.1" />
            {/* Heart-shaped brow & muzzle */}
            <path d="M8 11c0-2 1.5-3 3-2 1 .7 1.5.7 2 0 1.5-1 3 0 3 2 0 3-2 5-4 5s-4-2-4-5z" strokeWidth="1.3" />
            {/* Eyes */}
            <circle cx="9.5" cy="11.5" r="0.8" fill="currentColor" />
            <circle cx="14.5" cy="11.5" r="0.8" fill="currentColor" />
            {/* Nose and smile */}
            <circle cx="11.3" cy="13.8" r="0.5" fill="currentColor" />
            <circle cx="12.7" cy="13.8" r="0.5" fill="currentColor" />
            <path d="M10.5 15.2c.8.6 2.2.6 3 0" strokeWidth="1.2" />
          </g>
        );

      case "Gallo":
        return (
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {/* Comb on top */}
            <path d="M8 6c0-2.5 1.5-3 2.5-1.5 1-1.5 2.5-1.5 3 0 .8-1.5 2-1 2.5 1" fill="currentColor" fillOpacity="0.25" strokeWidth="1.4" />
            {/* Head and neck */}
            <path d="M8 9c1.5-1 4.5-1 6 0 1.5 1 2 3.5 2 6 0 3-1.5 5-3.5 7h-5c-1.5-2-2-4-2-7 0-3 1-5 2.5-6z" fill="currentColor" fillOpacity="0.1" />
            {/* Beak */}
            <path d="M7 11.5L3 13l4 1.5" fill="currentColor" fillOpacity="0.2" />
            {/* Wattle */}
            <path d="M7.5 15c-.5 2 1 3.5 2 2.5" fill="currentColor" fillOpacity="0.3" />
            {/* Eye */}
            <circle cx="11" cy="11.5" r="0.8" fill="currentColor" />
            {/* Feather texture */}
            <path d="M11 17c1.5 1 2.5 2.5 3 4" strokeWidth="1.2" />
          </g>
        );

      case "Perro":
        return (
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {/* Floppy / alert ear */}
            <path d="M6 7c-2 0-3.5 2.5-3 5.5.3 1.8 1.5 3 2.5 2.5 1-.5 1-2 1-4.5" fill="currentColor" fillOpacity="0.2" />
            {/* Head and snout */}
            <path d="M8 8c2-1 5-1 7 1 1.5 1.5 2 4 2 7 0 2-1 4-2.5 5H9.5C7.5 20 6.5 17 6.5 14c0-2.5.5-4.5 1.5-6z" fill="currentColor" fillOpacity="0.1" />
            <path d="M15 12h4c1.2 0 2 1 2 2.2 0 1.5-1.2 2.3-2.5 2.3h-3.5" fill="currentColor" fillOpacity="0.15" />
            {/* Nose & eye */}
            <ellipse cx="20.5" cy="13.2" rx="1.2" ry="0.9" fill="currentColor" />
            <circle cx="13" cy="10.5" r="0.9" fill="currentColor" />
            {/* Collar indicator */}
            <path d="M8 18.5h7" strokeWidth="1.4" />
          </g>
        );

      case "Cerdo":
        return (
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {/* Triangular floppy ears */}
            <path d="M5 8L3 4l4.5 2M19 8l2-4-4.5 2" strokeWidth="1.5" />
            {/* Head circle */}
            <circle cx="12" cy="12.5" r="7" fill="currentColor" fillOpacity="0.1" />
            {/* Distinct snout */}
            <ellipse cx="12" cy="14" rx="3.5" ry="2.4" fill="currentColor" fillOpacity="0.2" strokeWidth="1.4" />
            <circle cx="10.7" cy="14" r="0.6" fill="currentColor" />
            <circle cx="13.3" cy="14" r="0.6" fill="currentColor" />
            {/* Eyes */}
            <circle cx="8.5" cy="10.5" r="0.8" fill="currentColor" />
            <circle cx="15.5" cy="10.5" r="0.8" fill="currentColor" />
            {/* Cheeks */}
            <path d="M7 14c-.5.5-.8 1.2-.5 1.8M17 14c.5.5.8 1.2.5 1.8" strokeWidth="1.1" />
          </g>
        );

      default:
        // Elegant fallback: 8-point celestial star
        return (
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" strokeWidth="1.2" opacity="0.4" />
            <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
          </g>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 24 24"
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
