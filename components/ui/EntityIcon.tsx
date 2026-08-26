"use client";

import React from "react";

export type EntityIconKind =
  | "sneaker"
  | "apparel"
  | "football"
  | "car"
  | "university"
  | "city"
  | "flag"
  | "person"
  | "movie"
  | "music"
  | "brand";

interface EntityIconProps {
  kind: EntityIconKind;
  size?: number;
  className?: string;
  title?: string;
}

interface EntityDataLike {
  name?: string;
  type?: string;
  category?: string;
  emoji?: string;
  visualType?: string;
  keyThemes?: string[];
}

const SNEAKER_BRANDS = new Set([
  "vans",
  "converse",
  "nike",
  "adidas",
  "puma",
  "reebok",
  "jordan",
  "topper",
  "new balance",
  "asics",
  "filas",
  "skechers",
  "havaianas",
]);

const AUTO_BRANDS = new Set([
  "toyota",
  "ford",
  "renault",
  "fiat",
  "ferrari",
  "bugatti",
  "tesla",
  "bmw",
  "volvo",
  "honda",
  "jeep",
  "harley-davidson",
  "chevrolet",
  "volkswagen",
  "peugeot",
  "audi",
  "porsche",
  "mercedes",
  "mercedes-benz",
  "alfa romeo",
  "citroën",
  "citroen",
  "hyundai",
  "kia",
  "nissan",
  "mitsubishi",
  "subaru",
  "maserati",
  "lamborghini",
  "aston martin",
]);

/**
 * Deterministically resolves the most appropriate generic icon for any entity.
 */
export function resolveEntityIconKind(entity: EntityDataLike): EntityIconKind {
  const name = (entity.name || "").trim().toLowerCase();
  const type = (entity.type || "").trim().toLowerCase();
  const cat = (entity.category || "").trim().toLowerCase();
  const emoji = entity.emoji || "";
  const themes = (entity.keyThemes || []).map((t) => t.toLowerCase());

  // 1. FOOTBALL / SOCCER (teams, players, soccer items)
  if (
    type === "team" ||
    type === "football_player" ||
    emoji === "⚽" ||
    emoji === "🏟️" ||
    themes.some((t) => t.includes("fútbol") || t.includes("futbol") || t.includes("selección") || t.includes("delantero") || t.includes("arquero") || t.includes("defensor") || t.includes("mediocampista") || t.includes("afa") || t.includes("fifa"))
  ) {
    return "football";
  }

  // 2. SNEAKERS / FOOTWEAR
  if (
    emoji === "👟" ||
    cat === "zapatillas" ||
    cat === "calzado" ||
    SNEAKER_BRANDS.has(name) ||
    themes.some((t) => t.includes("sneaker") || t.includes("calzado") || t.includes("zapatilla") || t.includes("skate"))
  ) {
    return "sneaker";
  }

  // 3. APPAREL / ROPA / VESTIMENTA
  if (
    cat === "ropa" ||
    cat === "vestimenta" ||
    cat === "moda" ||
    emoji === "👕" ||
    emoji === "👖" ||
    emoji === "👗" ||
    emoji === "🧥" ||
    emoji === "🧢" ||
    themes.some((t) => t.includes("moda") || t.includes("textil") || t.includes("denim") || t.includes("ropa") || t.includes("indumentaria"))
  ) {
    return "apparel";
  }

  // 4. AUTOS / AUTOMOTRIZ
  if (
    cat === "autos" ||
    cat === "automotriz" ||
    emoji === "🚗" ||
    emoji === "🏎️" ||
    emoji === "🚘" ||
    emoji === "🚙" ||
    AUTO_BRANDS.has(name) ||
    themes.some((t) => t.includes("automotriz") || t.includes("auto") || t.includes("f1") || t.includes("coche") || t.includes("vehículo") || t.includes("motor"))
  ) {
    return "car";
  }

  // 5. UNIVERSITIES / AULA / ACADEMIA
  if (
    type === "university" ||
    emoji === "🎓" ||
    themes.some((t) => t.includes("universidad") || t.includes("educación") || t.includes("facultad") || t.includes("académic") || t.includes("rector"))
  ) {
    return "university";
  }

  // 6. CITIES / TERRITORIO / ARQUITECTURA
  if (
    type === "city" ||
    emoji === "🏛️" ||
    emoji === "🏙️" ||
    emoji === "🏰" ||
    themes.some((t) => t.includes("ciudad") || t.includes("capital") || t.includes("urban") || t.includes("puerto"))
  ) {
    return "city";
  }

  // 7. COUNTRIES / BANDERAS
  if (type === "country" || entity.visualType === "flag") {
    return "flag";
  }

  // 8. MOVIES / PANTALLA / CINE
  if (
    type === "movie" ||
    emoji === "🎬" ||
    emoji === "🎥" ||
    emoji === "🎞️" ||
    themes.some((t) => t.includes("película") || t.includes("cine") || t.includes("dirección") || t.includes("guion") || t.includes("oscar"))
  ) {
    return "movie";
  }

  // 9. PEOPLE / ARTISTS / FAMOSOS
  if (
    type === "artist" ||
    entity.visualType === "portrait" ||
    themes.some((t) => t.includes("música") || t.includes("cantante") || t.includes("actor") || t.includes("poeta") || t.includes("escritor") || t.includes("pintor"))
  ) {
    if (themes.some((t) => t.includes("música") || t.includes("cantante") || t.includes("rock") || t.includes("tango"))) {
      return "music";
    }
    return "person";
  }

  // Default: generic editorial brand / commerce seal
  return "brand";
}

/**
 * Editorial minimalist vector iconography for entities, categories and generic brand visual representations.
 */
export default function EntityIcon({
  kind,
  size = 24,
  className = "",
  title,
}: EntityIconProps) {
  const label = title || kind;

  const renderPath = () => {
    switch (kind) {
      case "sneaker":
        return (
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {/* Outsole and midsole */}
            <path d="M2.5 18.5h18c.8 0 1.5-.4 1.8-1.1l.7-2.1c.3-1-.4-1.8-1.5-1.8h-4.5l-3-4c-.6-.8-1.6-1.5-2.6-1.5H8.5c-.8 0-1.5.5-1.8 1.2L5 13.5H3c-1 0-1.8.8-1.8 1.8v1.7c0 .8.6 1.5 1.3 1.5z" fill="currentColor" fillOpacity="0.12" />
            {/* Sole tread line */}
            <path d="M2 18.5h19.5" strokeWidth="2" />
            <path d="M4 16h16.5" strokeWidth="1.1" strokeOpacity="0.5" />
            {/* Collar & tongue */}
            <path d="M8.5 8h2.5l2.5 3.5" />
            <path d="M7 12l2-3.5" strokeWidth="1.2" />
            {/* Laces */}
            <path d="M10.5 10.5l2 .5M11.5 12.5l2 .5M12.5 14.5l2 .5" strokeWidth="1.3" />
            {/* Heel pull tab */}
            <path d="M5.5 13.5v-2.5c0-.6-.4-1-1-1" strokeWidth="1.2" />
          </g>
        );

      case "football":
        return (
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {/* Outer circle */}
            <circle cx="12" cy="12" r="9.5" fill="currentColor" fillOpacity="0.08" />
            {/* Center pentagon */}
            <path d="M12 8.5l3.2 2.3-1.2 3.8h-4l-1.2-3.8z" fill="currentColor" fillOpacity="0.3" strokeWidth="1.4" />
            {/* Pentagon seam lines radiating outward */}
            <path d="M12 8.5V2.5" />
            <path d="M15.2 10.8l5.8-2" />
            <path d="M14 14.6l3.5 4.8" />
            <path d="M10 14.6l-3.5 4.8" />
            <path d="M8.8 10.8L3 8.8" />
            {/* Outer panel curves */}
            <path d="M5.5 4.5l3.3 4.3M18.5 4.5l-3.3 4.3M20.5 15l-6.5-.4M3.5 15l6.5-.4M8.5 21l3.5-6.4M15.5 21l-3.5-6.4" strokeWidth="1" strokeOpacity="0.35" />
          </g>
        );

      case "apparel":
        return (
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {/* T-shirt silhouette */}
            <path d="M9 3.5h6l1.5 2.5 5 2-2 4.5-2.5-1v9.5c0 .6-.5 1-1 1H8c-.6 0-1-.4-1-1V11.5L4.5 12.5l-2-4.5 5-2L9 3.5z" fill="currentColor" fillOpacity="0.12" />
            {/* Collar neckline */}
            <path d="M9 3.5c.5 1.8 1.8 2.5 3 2.5s2.5-.7 3-2.5" strokeWidth="1.4" />
            {/* Sleeve hems */}
            <path d="M5 8.5l2 1M19 8.5l-2 1" strokeWidth="1.2" />
            {/* Hem stitch */}
            <path d="M8 20h8" strokeWidth="1.1" strokeOpacity="0.6" />
          </g>
        );

      case "car":
        return (
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {/* Car body profile */}
            <path d="M3 15h18l1-2.5c.3-.8-.1-1.6-.9-1.8l-3.5-.7-2.8-4.2c-.4-.6-1-.9-1.8-.9H8.5c-.8 0-1.5.4-1.9 1.1L4.2 10.2l-2.4.9c-.8.3-1.1 1-1 1.8L1.5 15h1.5z" fill="currentColor" fillOpacity="0.12" />
            {/* Windows */}
            <path d="M7.8 10h8.4c.4 0 .7.2.9.5l2 3.5H6.2l1.6-4z" fill="currentColor" fillOpacity="0.2" strokeWidth="1.2" />
            <path d="M12.5 10v4" strokeWidth="1.1" />
            {/* Front and rear wheels */}
            <circle cx="6.5" cy="16.5" r="2.8" fill="var(--color-paper, #F7F4EE)" strokeWidth="1.6" />
            <circle cx="6.5" cy="16.5" r="1.1" fill="currentColor" />
            <circle cx="17.5" cy="16.5" r="2.8" fill="var(--color-paper, #F7F4EE)" strokeWidth="1.6" />
            <circle cx="17.5" cy="16.5" r="1.1" fill="currentColor" />
            {/* Headlight & bumper accent */}
            <path d="M21.5 13.5h1M1.5 13.5h1" strokeWidth="1.3" />
          </g>
        );

      case "university":
        return (
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {/* Mortarboard cap (diamond top) */}
            <path d="M12 3L2 8l10 5 10-5-10-5z" fill="currentColor" fillOpacity="0.18" />
            {/* Skullcap underneath */}
            <path d="M6 10.5v5.2c0 2.2 2.7 4.3 6 4.3s6-2.1 6-4.3v-5.2" fill="currentColor" fillOpacity="0.1" />
            {/* Cap button & hanging tassel */}
            <circle cx="12" cy="8" r="0.8" fill="currentColor" />
            <path d="M12 8l8.5 3.5v5.5c0 .8-.5 1.5-1 1.5s-1-.7-1-1.5V12" strokeWidth="1.3" />
          </g>
        );

      case "city":
        return (
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {/* Skyline & architectural colonnade */}
            <path d="M2 21h20M4 21V9l4-3 4 3v12M12 21V6l5-3 5 3v15" fill="currentColor" fillOpacity="0.12" />
            {/* Windows / pillars */}
            <path d="M6 12h1M6 15h1M6 18h1M14 9h1M14 12h1M14 15h1M14 18h1M18 9h1M18 12h1M18 15h1M18 18h1" strokeWidth="1.4" />
            {/* Spire */}
            <path d="M17 3v-1" strokeWidth="1.4" />
          </g>
        );

      case "flag":
        return (
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {/* Flagpole */}
            <path d="M5 21V3" strokeWidth="1.8" />
            {/* Waving flag banner */}
            <path d="M5 4c3.5-1.5 6.5 1.5 10 0 2-1 3.5-.5 4.5.5v9c-1-1-2.5-1.5-4.5-.5-3.5 1.5-6.5-1.5-10 0" fill="currentColor" fillOpacity="0.18" />
            <circle cx="5" cy="3" r="0.8" fill="currentColor" />
          </g>
        );

      case "person":
        return (
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {/* Head circle */}
            <circle cx="12" cy="7.5" r="4.2" fill="currentColor" fillOpacity="0.15" />
            {/* Shoulders / bust silhouette */}
            <path d="M4 20.5c0-4.2 3.6-7.5 8-7.5s8 3.3 8 7.5" fill="currentColor" fillOpacity="0.12" />
            {/* Collar detail */}
            <path d="M10 13.5l2 3 2-3" strokeWidth="1.2" />
          </g>
        );

      case "movie":
        return (
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {/* Slate base */}
            <rect x="3" y="9" width="18" height="12" rx="1.5" fill="currentColor" fillOpacity="0.1" />
            {/* Angled clapper top bar */}
            <path d="M3 9l17.5-3.5c.6-.1 1.2.3 1.3.9l.2 1.2c.1.6-.3 1.2-.9 1.3L3.6 12.4c-.6.1-1.2-.3-1.3-.9L2.1 10.3c-.1-.6.3-1.2.9-1.3z" fill="currentColor" fillOpacity="0.25" strokeWidth="1.4" />
            {/* Clapper diagonal stripes */}
            <path d="M7 8l-1.5 3M11 7.2l-1.5 3M15 6.4l-1.5 3M19 5.6l-1.5 3" strokeWidth="1.3" />
            {/* Film slate layout lines */}
            <path d="M6 13h12M6 16h6M6 18.5h4" strokeWidth="1.2" strokeOpacity="0.5" />
          </g>
        );

      case "music":
        return (
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {/* Beamed eighth notes */}
            <circle cx="6.5" cy="17.5" r="2.8" fill="currentColor" />
            <circle cx="17.5" cy="14.5" r="2.8" fill="currentColor" />
            <path d="M9.3 17.5V6.5l11-3V14.5" strokeWidth="1.8" />
            <path d="M9.3 9.5l11-3" strokeWidth="2.2" />
          </g>
        );

      case "brand":
      default:
        return (
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {/* Editorial geometric diamond crest */}
            <path d="M12 2.5L20.5 12 12 21.5 3.5 12z" fill="currentColor" fillOpacity="0.1" />
            <path d="M12 6.5L17.5 12 12 17.5 6.5 12z" fill="currentColor" fillOpacity="0.2" strokeWidth="1.3" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
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
