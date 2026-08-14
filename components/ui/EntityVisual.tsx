"use client";

import { useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { VisualType } from "@/types/atlas";

/**
 * EntityVisual — renders the correct asset for an Atlas entity.
 *
 * visualType → rendering:
 *  - "flag":   native regional-indicator flag emoji derived from countryISO
 *              (no external asset, no tracking — pure Unicode).
 *  - "logo"/"portrait"/"album": uses `imageUrl` via next/image when present;
 *              otherwise falls back to a graceful gradient + initial.
 *  - "emoji":  renders `emoji` directly, or falls back to the initial tile.
 *
 * The fallback is always a refined gradient tile with the entity initial and
 * a subtle motion — never a broken image.
 *
 * Privacy: any imageUrl must come from a trusted source (e.g. Wikimedia
 * Commons); we never inject tracking pixels. When no trusted URL exists we
 * stay on the gradient/emoji fallback.
 */

interface EntityVisualProps {
  visualType?: VisualType;
  emoji?: string;
  imageUrl?: string;
  name: string;
  countryISO?: string;
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

// Deterministic gradient pairs keyed by visualType — subtle, on-brand.
const GRADIENTS: Record<VisualType, string> = {
  flag: "from-accent/30 via-paper-alt to-background",
  logo: "from-accent/20 via-paper-alt to-background",
  portrait: "from-gold/25 via-paper-alt to-background",
  album: "from-[#A78BFA]/25 via-paper-alt to-background",
  emoji: "from-ink/20 via-paper-alt to-background",
};

export default function EntityVisual({
  visualType = "emoji",
  emoji,
  imageUrl,
  name,
  countryISO,
  shape = "rounded",
  size = 40,
  className = "",
}: EntityVisualProps) {
  const initial = useMemo(() => (name.trim().charAt(0) || "•").toUpperCase(), [name]);
  const flag = useMemo(() => (visualType === "flag" ? countryCodeToFlagEmoji(countryISO) : null), [visualType, countryISO]);

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

  // 1. Flag — native emoji, no asset, no tracking.
  if (visualType === "flag") {
    return (
      <span
        style={baseStyle}
        className={`inline-flex items-center justify-center shrink-0 overflow-hidden bg-ink/[0.04] border border-ink/10 ${shapeClass} ${className}`}
        role="img"
        aria-label={`Bandera de ${name}`}
      >
        <span style={{ fontSize: size * 0.62 }} className="leading-none">
          {flag ?? emoji ?? initial}
        </span>
      </span>
    );
  }

  // 2. Explicit emoji — render it directly in a subtle tile.
  if (visualType === "emoji" && emoji) {
    return (
      <span
        style={baseStyle}
        className={`inline-flex items-center justify-center shrink-0 overflow-hidden bg-ink/[0.04] border border-ink/10 ${shapeClass} ${className}`}
        role="img"
        aria-label={name}
      >
        <span style={{ fontSize: size * 0.6 }} className="leading-none">
          {emoji}
        </span>
      </span>
    );
  }

  // 3. Image-backed (logo/portrait/album) — trusted remote image, or fallback.
  if (imageUrl && (visualType === "logo" || visualType === "portrait" || visualType === "album")) {
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
        />
      </span>
    );
  }

  // 4. Graceful fallback — gradient tile + initial + optional emoji.
  return (
    <motion.span
      style={baseStyle}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`inline-flex items-center justify-center shrink-0 overflow-hidden bg-gradient-to-br border border-ink/10 ${GRADIENTS[visualType]} ${shapeClass} ${className}`}
      role="img"
      aria-label={name}
    >
      {emoji ? (
        <span style={{ fontSize: size * 0.5 }} className="leading-none">{emoji}</span>
      ) : (
        <span
          style={{ fontSize: size * 0.42 }}
          className="font-heading font-semibold text-ink/80 leading-none"
        >
          {initial}
        </span>
      )}
    </motion.span>
  );
}
