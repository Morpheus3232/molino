"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { VisualType } from "@/types/atlas";
import EntityIcon, { resolveEntityIconKind, type EntityIconKind } from "./EntityIcon";
import ZodiacAnimalIcon, { normalizeZodiacAnimal } from "./ZodiacAnimalIcon";

/**
 * EntityVisual — renders the correct asset for an Atlas entity.
 *
 * Visual hierarchy:
 *  1. Flag: native regional-indicator flag emoji derived from countryISO
 *     (con la bandera del propio registro como respaldo si no hay ISO).
 *  2. ImageUrl: trusted remote image via next/image when present.
 *  3. Chinese Zodiac Animal: genuine bespoke vector SVG illustration.
 *  4. Domain / Category generic icon: genuine vector SVG (sneaker for footwear,
 *     soccer ball for football/teams/players, car for automotive, graduation cap
 *     for universities, architectural landmark for cities, clapperboard for cinema,
 *     refined silhouette for people/artists, geometric seal for brands).
 */

export interface EntityVisualProps {
  visualType?: VisualType;
  emoji?: string;
  imageUrl?: string;
  name: string;
  countryISO?: string;
  type?: string;
  category?: string;
  keyThemes?: string[];
  animal?: string;
  /** Rounded style. Default "rounded" for list rows. */
  shape?: "rounded" | "circle" | "square";
  /** Tile size in px. */
  size?: number;
  className?: string;
}

/** Convert an ISO alpha-2 country code to its regional-indicator flag emoji. */
export function countryCodeToFlagEmoji(iso?: string): string | null {
  if (!iso || iso.length !== 2 || !/^[A-Z]{2}$/.test(iso)) return null;
  const base = 0x1f1e6; // regional indicator A
  const a = iso.charCodeAt(0) - 65;
  const b = iso.charCodeAt(1) - 65;
  return String.fromCodePoint(base + a, base + b);
}

/** True si el string es una bandera: dos indicadores regionales secuenciales. */
function isRegionalFlagEmoji(emoji: string): boolean {
  const cps = [...emoji];
  if (cps.length !== 2) return false;
  return cps.every((c) => {
    const cp = c.codePointAt(0) ?? 0;
    return cp >= 0x1f1e6 && cp <= 0x1f1ff;
  });
}

// Deterministic gradient pairs keyed by visualType — subtle, on-brand.
const GRADIENTS: Record<VisualType, string> = {
  flag: "from-accent/30 via-paper-alt to-background",
  logo: "from-accent/20 via-paper-alt to-background",
  portrait: "from-gold/25 via-paper-alt to-background",
  album: "from-[#A78BFA]/25 via-paper-alt to-background",
  emoji: "from-ink/20 via-paper-alt to-background",
};

const ZODIAC_EMOJIS = new Set(["🐀", "🐂", "🐅", "🐱", "🐰", "🐇", "🐉", "🐲", "🐍", "🐎", "🐴", "🐐", "🐑", "🐒", "🐵", "🐓", "🐔", "🐕", "🐶", "🐖", "🐷"]);

export default function EntityVisual({
  visualType = "emoji",
  emoji,
  imageUrl,
  name,
  countryISO,
  type,
  category,
  keyThemes,
  animal,
  shape = "rounded",
  size = 40,
  className = "",
}: EntityVisualProps) {
  // Si la imagen remota falla (URL 404, host caído), caemos al ícono genérico
  // en vez de dejar un tile vacío.
  const [imageErrored, setImageErrored] = useState(false);

  const flag = useMemo(() => {
    if (visualType !== "flag") return null;
    return countryCodeToFlagEmoji(countryISO) ?? (emoji && isRegionalFlagEmoji(emoji) ? emoji : null);
  }, [visualType, countryISO, emoji]);

  const zodiacAnimal = useMemo(() => {
    if (animal) return normalizeZodiacAnimal(animal);
    if (emoji && ZODIAC_EMOJIS.has(emoji)) return normalizeZodiacAnimal(emoji);
    return null;
  }, [animal, emoji]);

  const iconKind: EntityIconKind = useMemo(() => {
    return resolveEntityIconKind({
      name,
      type,
      category,
      emoji,
      visualType,
      keyThemes,
    });
  }, [name, type, category, emoji, visualType, keyThemes]);

  const shapeClass =
    shape === "circle"
      ? "rounded-full"
      : shape === "square"
        ? "rounded-lg"
        : "rounded-xl";

  const baseStyle = {
    width: size,
    height: size,
  } as React.CSSProperties;

  const iconSize = Math.max(14, Math.round(size * 0.55));

  // 1. Flag — native emoji, no asset, no tracking.
  if (visualType === "flag" && (flag || countryISO)) {
    return (
      <span
        style={baseStyle}
        className={`inline-flex items-center justify-center shrink-0 overflow-hidden bg-ink/[0.04] border border-ink/10 ${shapeClass} ${className}`}
        role="img"
        aria-label={`Bandera de ${name}`}
      >
        <span style={{ fontSize: size * 0.62 }} className="leading-none select-none">
          {flag ?? "🌐"}
        </span>
      </span>
    );
  }

  // 2. Image-backed (logo/portrait/album) — trusted remote image.
  if (imageUrl && !imageErrored && (visualType === "logo" || visualType === "portrait" || visualType === "album")) {
    return (
      <span
        style={baseStyle}
        className={`inline-flex items-center justify-center shrink-0 overflow-hidden bg-paper-alt border border-ink/10 relative ${shapeClass} ${className}`}
      >
        <Image
          src={imageUrl}
          alt={name}
          width={size}
          height={size}
          className="object-cover"
          unoptimized={false}
          onError={() => setImageErrored(true)}
        />
      </span>
    );
  }

  // 3. Zodiac Animal — authentic bespoke vector illustration.
  if (zodiacAnimal) {
    return (
      <span
        style={baseStyle}
        className={`inline-flex items-center justify-center shrink-0 overflow-hidden bg-paper-alt border border-ink/10 text-accent ${shapeClass} ${className}`}
        role="img"
        aria-label={`Signo ${zodiacAnimal}`}
      >
        <ZodiacAnimalIcon animal={zodiacAnimal} size={iconSize} />
      </span>
    );
  }

  // 4. Domain / Brand / Category generic icon tile.
  return (
    <motion.span
      style={baseStyle}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`inline-flex items-center justify-center shrink-0 overflow-hidden bg-gradient-to-br border border-ink/10 ${GRADIENTS[visualType] || "from-ink/10 via-paper-alt to-background"} text-foreground/80 hover:text-accent transition-colors ${shapeClass} ${className}`}
      role="img"
      aria-label={name}
    >
      <EntityIcon kind={iconKind} size={iconSize} title={name} />
    </motion.span>
  );
}
