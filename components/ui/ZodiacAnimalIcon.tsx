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
 * Premium editorial vector iconography for the 12 Chinese Zodiac animals.
 * Refined illustration style: confident strokes, purposeful fills, clean
 * anatomy. Scales crisply from 24px to 96px using `currentColor`.
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
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            {/* Rounded body with pointed snout */}
            <path d="M5 16.5c.8-2.5 2.5-4 5.5-4.5 3.5-.5 6.5 1.2 8 3.5.7 1 .8 2.2.3 3.2-.7 1.2-2.8 1.3-6 1.3-3.5 0-6.5-.4-7.8-3.5z" strokeWidth="1.8" fill="currentColor" fillOpacity="0.08" />
            {/* Head profile with snout */}
            <path d="M5 16.5c-1.2-.4-2-1.2-2-2.2 0-1.4 1.8-2.2 4-2.2 1.8 0 3.2.7 4 1.8" strokeWidth="1.6" />
            {/* Large ear */}
            <ellipse cx="9.5" cy="8" rx="2.8" ry="3.2" strokeWidth="1.6" fill="currentColor" fillOpacity="0.1" />
            {/* Inner ear detail */}
            <ellipse cx="9.5" cy="8.5" rx="1.4" ry="1.8" strokeWidth="1" fill="currentColor" fillOpacity="0.06" />
            {/* Eye */}
            <circle cx="5.2" cy="13.5" r="0.9" fill="currentColor" strokeWidth="0" />
            {/* Whiskers — clean, three per side */}
            <path d="M3 14l-2 .3M3 15l-2 1M3 16l-1.5 1.8" strokeWidth="1.2" />
            {/* Long curling tail */}
            <path d="M18.5 17c2.2-.6 4-2 4-4.2 0-2.8-2.2-3.8-2.2-6" strokeWidth="1.5" />
          </g>
        );

      case "Buey":
        return (
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            {/* Wide horns — sweeping upward */}
            <path d="M3.5 7.5c1.5 2.5 4 4 6.5 4M20.5 7.5c-1.5 2.5-4 4-6.5 4" strokeWidth="2" />
            {/* Strong jawed head */}
            <path d="M7 10.5h10l.8 4.5-2.2 4.5h-7.2l-2.2-4.5.8-4.5z" strokeWidth="1.6" fill="currentColor" fillOpacity="0.08" />
            {/* Broad snout */}
            <ellipse cx="12" cy="16.5" rx="3.2" ry="2" strokeWidth="1.5" fill="currentColor" fillOpacity="0.12" />
            {/* Nostrils */}
            <circle cx="10.8" cy="16.5" r="0.6" fill="currentColor" strokeWidth="0" />
            <circle cx="13.2" cy="16.5" r="0.6" fill="currentColor" strokeWidth="0" />
            {/* Eyes — calm, wide-set */}
            <circle cx="9.2" cy="12.5" r="0.9" fill="currentColor" strokeWidth="0" />
            <circle cx="14.8" cy="12.5" r="0.9" fill="currentColor" strokeWidth="0" />
            {/* Ear flaps */}
            <path d="M6.8 11L4.5 12.5M17.2 11l2.3 1.5" strokeWidth="1.4" />
          </g>
        );

      case "Tigre":
        return (
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            {/* Broad head shape */}
            <path d="M5.5 10c0-3.2 2.8-5.8 6.5-5.8s6.5 2.6 6.5 5.8c0 4.5-2.8 8.2-6.5 8.2s-6.5-3.7-6.5-8.2z" strokeWidth="1.8" fill="currentColor" fillOpacity="0.08" />
            {/* Rounded ears */}
            <path d="M5.5 7.8c-1.2-.3-2-1.4-1.5-2.8 1.2-.3 2.5.3 3 1.5M18.5 7.8c1.2-.3 2-1.4 1.5-2.8-1.2-.3-2.5.3-3 1.5" strokeWidth="1.5" />
            {/* Wang (王) mark on forehead — bold, authoritative */}
            <path d="M9.5 6h5M10 7.5h4M12 5v4M9.5 9h5" strokeWidth="1.4" />
            {/* Eyes — sharp, almond-shaped */}
            <path d="M8.5 12.5l1.5-.4M15.5 12.5l-1.5-.4" strokeWidth="1.8" />
            {/* Nose */}
            <path d="M11 14.5h2l-1 1.3z" fill="currentColor" strokeWidth="0" />
            {/* Whiskers */}
            <path d="M7 14.5l-3-.3M7 16l-2.8.8M17 14.5l3-.3M17 16l2.8.8" strokeWidth="1.1" />
          </g>
        );

      case "Gato":
        return (
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            {/* Head with pointed ears */}
            <path d="M4.5 11L5.5 5.5l4.5 2.5c1-.4 3-.4 4 0l4.5-2.5 1 5.5c.8 2.5.3 6-2.5 8-1.8 1.3-5 1.3-6.8 0-2.8-2-3.3-5.5-2.5-8z" strokeWidth="1.8" fill="currentColor" fillOpacity="0.08" />
            {/* Inner ears — triangular fill */}
            <path d="M7.5 7.5L6.5 9.5M16.5 7.5l1 2" strokeWidth="1.2" />
            <path d="M8 6.5l-1 3h2.5zM16 6.5l1 3h-2.5z" fill="currentColor" fillOpacity="0.06" strokeWidth="0" />
            {/* Eyes — round, alert */}
            <circle cx="8.8" cy="12.5" r="1" fill="currentColor" strokeWidth="0" />
            <circle cx="15.2" cy="12.5" r="1" fill="currentColor" strokeWidth="0" />
            {/* Nose — small triangle */}
            <path d="M11.5 14.8h1l-.5.7z" fill="currentColor" strokeWidth="0" />
            {/* Mouth */}
            <path d="M12 15.5v1c-.7.6-1.6.6-2 .2M12 16.5c.7.6 1.6.6 2 .2" strokeWidth="1.1" />
            {/* Whiskers — clean, symmetrical */}
            <path d="M6 14l-3.5-.2M6 15.5l-3.5.8M6 17l-3 1.5M18 14l3.5-.2M18 15.5l3.5.8M18 17l3 1.5" strokeWidth="1" />
          </g>
        );

      case "Dragón":
        return (
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            {/* Antlers — organic, branching */}
            <path d="M13 3c0 2.5 1.8 4 3.5 4.5M15.5 4c.8.8 2.2 1.2 3.5 1.2" strokeWidth="1.6" />
            <path d="M10 3.5c-.4 1.8-1.2 2.8-2.8 3.2" strokeWidth="1.4" />
            {/* Sinuous head and jaw */}
            <path d="M6.5 13.5c-1.2-.4-2.5-.8-2.5-2.2 0-1.8 1.8-2.8 4-2.8 3 0 5.2 1.8 7.5 1.8 2.2 0 3.5-.8 4.5-2.2v3.5c-.8 1.8-2.5 2.8-4.5 3.2-2.5.7-5.2.4-7 1.2-1.2.7-1.6 1.8-1.6 2.5" strokeWidth="1.8" fill="currentColor" fillOpacity="0.08" />
            {/* Flowing beard tendrils */}
            <path d="M5 13c-1.2 1.5-1.6 3.2-.8 5M7.2 15.5c0 2.2 1.2 4 2.5 5" strokeWidth="1.3" />
            {/* Fierce eye with brow */}
            <circle cx="10" cy="10" r="1" fill="currentColor" strokeWidth="0" />
            <path d="M8.2 8.2c1.5-.4 3.2 0 4.2 1" strokeWidth="1.5" />
            {/* Scales along jawline */}
            <path d="M14.5 13l1.2-1.2 1.2 1.2 1.2-1.2" strokeWidth="1.2" />
          </g>
        );

      case "Serpiente":
        return (
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            {/* Coiled body — flowing S-curve */}
            <path d="M15.5 6.5c2.2 0 3.5 1.2 3.5 3s-1.8 2.8-4.5 3.2-4.5 1.4-4.5 3 1.6 3.2 4 3.2c2.8 0 4.8-1.2 5.8-3" strokeWidth="2" />
            {/* Head — angular, alert */}
            <path d="M15.5 6.5c-1.2 0-3-.6-4.5-1.2-1.8-.8-3.2-.4-4.2.8-.7 1-.4 2.5.8 3.2 1.5.6 4 .4 6-.4" strokeWidth="1.8" fill="currentColor" fillOpacity="0.1" />
            {/* Eye — sharp slit */}
            <circle cx="8" cy="6.2" r="0.8" fill="currentColor" strokeWidth="0" />
            <path d="M7.2 6.2h1.6" strokeWidth="0.8" />
            {/* Forked tongue */}
            <path d="M4.2 6.5L2.2 6M2.2 6l-.6-.7M2.2 6l-.6.7" strokeWidth="1.2" />
          </g>
        );

      case "Caballo":
        return (
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            {/* Ears — alert, upright */}
            <path d="M10.5 4l1.2 3M13.5 4l1 3" strokeWidth="1.6" />
            {/* Noble head profile */}
            <path d="M12 7.5c1.8 0 4 1.2 4.5 3.5.4 2.2-1.2 4.5-3 5-1.2.3-2.5.2-3.5-.4l-2.8 1.2c-1.2.7-2.5.2-3-.8-.5-1.2.2-2.5 1.2-3l2.8-.8c.4-1.2 1.2-3.5 4-4.5z" strokeWidth="1.8" fill="currentColor" fillOpacity="0.08" />
            {/* Flowing mane — elegant strokes */}
            <path d="M14 7.5c2.8.8 4.5 3 5 6M15.5 10.5c2.2 1.2 3.2 3.5 3.2 6M17 14c1.2 1.2 1.8 3 1.8 5" strokeWidth="1.5" />
            {/* Eye — warm, intelligent */}
            <circle cx="10.8" cy="10" r="0.9" fill="currentColor" strokeWidth="0" />
            {/* Nostril */}
            <circle cx="5.5" cy="14" r="0.6" fill="currentColor" strokeWidth="0" />
            {/* Neck curve */}
            <path d="M9.5 17c1.2 2 2 4 2.5 5.5" strokeWidth="1.4" />
          </g>
        );

      case "Cabra":
        return (
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            {/* Sweeping curved horns */}
            <path d="M10 7c-2-3.5-5-3.5-7-1.5M14 7c2-3.5 5-3.5 7 1.5" strokeWidth="1.8" />
            {/* Angular head */}
            <path d="M8.5 8h7l.8 5.5-4.3 5.5-4.3-5.5.8-5.5z" strokeWidth="1.6" fill="currentColor" fillOpacity="0.08" />
            {/* Ears — drooping */}
            <path d="M7.5 9.5L4 11.5M16.5 9.5l3.5 2" strokeWidth="1.4" />
            {/* Eyes — rectangular pupils (distinctive) */}
            <circle cx="9.5" cy="11.8" r="0.8" fill="currentColor" strokeWidth="0" />
            <circle cx="14.5" cy="11.8" r="0.8" fill="currentColor" strokeWidth="0" />
            <path d="M9 11.8h1M14 11.8h1" strokeWidth="0.7" />
            {/* Muzzle */}
            <ellipse cx="12" cy="17" rx="1.8" ry="1" strokeWidth="1.3" fill="currentColor" fillOpacity="0.1" />
            {/* Chin tuft */}
            <path d="M11.2 19.5l.8 2.5.8-2.5" strokeWidth="1.4" />
          </g>
        );

      case "Mono":
        return (
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            {/* Large round ears */}
            <circle cx="4.8" cy="11.5" r="2.8" strokeWidth="1.6" fill="currentColor" fillOpacity="0.08" />
            <circle cx="19.2" cy="11.5" r="2.8" strokeWidth="1.6" fill="currentColor" fillOpacity="0.08" />
            {/* Inner ears */}
            <circle cx="4.8" cy="11.5" r="1.5" strokeWidth="1" fill="currentColor" fillOpacity="0.05" />
            <circle cx="19.2" cy="11.5" r="1.5" strokeWidth="1" fill="currentColor" fillOpacity="0.05" />
            {/* Head — round, expressive */}
            <circle cx="12" cy="11.5" r="6" strokeWidth="1.8" fill="currentColor" fillOpacity="0.06" />
            {/* Heart-shaped face mask */}
            <path d="M8.5 10.5c0-1.8 1.5-2.8 3.5-1.8 2-1 3.5 0 3.5 1.8 0 2.5-1.8 4.2-3.5 4.2s-3.5-1.7-3.5-4.2z" strokeWidth="1.4" fill="currentColor" fillOpacity="0.04" />
            {/* Eyes — intelligent, round */}
            <circle cx="9.8" cy="11" r="0.9" fill="currentColor" strokeWidth="0" />
            <circle cx="14.2" cy="11" r="0.9" fill="currentColor" strokeWidth="0" />
            {/* Nose — two small dots */}
            <circle cx="11.2" cy="13.5" r="0.45" fill="currentColor" strokeWidth="0" />
            <circle cx="12.8" cy="13.5" r="0.45" fill="currentColor" strokeWidth="0" />
            {/* Warm smile */}
            <path d="M10.5 15c.8.5 2.2.5 3 0" strokeWidth="1.2" />
          </g>
        );

      case "Gallo":
        return (
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            {/* Serrated comb — bold, three peaks */}
            <path d="M8.5 5.5c0-2 1.2-2.5 2-1.2.8-1.3 2-1.3 2.5 0 .5-1.3 1.8-1 2.2.8" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
            {/* Strong head and neck */}
            <path d="M8.5 8.5c1.2-.8 4-.8 5.5 0 1.2.8 1.8 3 1.8 5.5 0 2.8-1.2 4.8-3 6.5h-4.5c-1.2-1.8-1.8-3.5-1.8-6.5 0-2.5.8-4.5 2-5.5z" strokeWidth="1.8" fill="currentColor" fillOpacity="0.08" />
            {/* Sharp beak */}
            <path d="M7.5 11l-3.5 1.2 3.5 1" strokeWidth="1.6" fill="currentColor" fillOpacity="0.1" />
            {/* Wattle — hanging, fleshy */}
            <path d="M7.8 14.5c-.4 1.8.8 3 1.8 2.2" strokeWidth="1.4" fill="currentColor" fillOpacity="0.12" />
            {/* Eye — fierce, alert */}
            <circle cx="11" cy="11" r="0.8" fill="currentColor" strokeWidth="0" />
            {/* Breast feathers — subtle texture */}
            <path d="M10.5 17c1.2.8 2 2 2.5 3.2" strokeWidth="1.2" />
          </g>
        );

      case "Perro":
        return (
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            {/* Floppy ear */}
            <path d="M6.5 7c-1.8-.3-3.2 1.8-2.8 4.5.2 1.5 1.2 2.5 2.2 2 .8-.4.8-1.5.8-4" strokeWidth="1.6" fill="currentColor" fillOpacity="0.1" />
            {/* Strong head and snout */}
            <path d="M8.5 8c1.8-.8 4.5-.8 6.2.8 1.2 1.2 1.8 3.5 1.8 6 0 1.8-.8 3.5-2.2 4.5H10c-1.8-1-2.8-3.5-2.8-6.5 0-2.2.5-4 1.3-4.8z" strokeWidth="1.8" fill="currentColor" fillOpacity="0.06" />
            {/* Open mouth / tongue */}
            <path d="M15 12h3.5c1 0 1.8.8 1.8 1.8 0 1.2-1 2-2.2 2h-3.1" strokeWidth="1.4" fill="currentColor" fillOpacity="0.08" />
            {/* Nose — large, wet */}
            <ellipse cx="20" cy="12.8" rx="1.2" ry="0.9" fill="currentColor" strokeWidth="0" />
            {/* Eye — warm, loyal */}
            <circle cx="13" cy="10.2" r="0.9" fill="currentColor" strokeWidth="0" />
            {/* Collar line */}
            <path d="M8.5 18.5h6.5" strokeWidth="1.5" />
          </g>
        );

      case "Cerdo":
        return (
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            {/* Floppy triangular ears */}
            <path d="M5.5 8L3.5 4l4 1.8M18.5 8l2-4-4 1.8" strokeWidth="1.5" />
            {/* Round head */}
            <circle cx="12" cy="12" r="6.5" strokeWidth="1.8" fill="currentColor" fillOpacity="0.06" />
            {/* Prominent snout — round, characteristic */}
            <ellipse cx="12" cy="13.5" rx="3.2" ry="2.2" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
            {/* Nostrils — two dots */}
            <circle cx="10.8" cy="13.5" r="0.55" fill="currentColor" strokeWidth="0" />
            <circle cx="13.2" cy="13.5" r="0.55" fill="currentColor" strokeWidth="0" />
            {/* Eyes — cheerful */}
            <circle cx="9" cy="10.2" r="0.85" fill="currentColor" strokeWidth="0" />
            <circle cx="15" cy="10.2" r="0.85" fill="currentColor" strokeWidth="0" />
            {/* Rosy cheeks */}
            <circle cx="7.2" cy="13" r="1" fill="currentColor" fillOpacity="0.05" strokeWidth="0" />
            <circle cx="16.8" cy="13" r="1" fill="currentColor" fillOpacity="0.05" strokeWidth="0" />
          </g>
        );

      default:
        return (
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" strokeWidth="1.2" opacity="0.35" />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" fillOpacity="0.15" />
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
