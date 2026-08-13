import React from "react";

type BadgeVariant = "accent" | "outline" | "muted" | "success" | "error" | "numerology" | "astrology" | "zodiac" | "gold";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  accent: "bg-accent text-accent-foreground",
  outline: "bg-transparent text-foreground border border-ink/20",
  muted: "bg-ink/[0.06] text-muted",
  success: "bg-success/10 text-success",
  error: "bg-error/10 text-error",
  numerology: "bg-element-air/10 text-element-air border border-element-air/30",
  astrology: "bg-layer-astrology/10 text-layer-astrology border border-layer-astrology/30",
  zodiac: "bg-layer-identity/10 text-layer-identity border border-layer-identity/30",
  gold: "bg-gold/15 text-gold border border-gold/40",
};

/**
 * Etiqueta corta en mayusculas con variantes de sistema místico.
 */
export default function Badge({ children, variant = "accent", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 font-heading text-xs font-semibold uppercase tracking-[0.2em] rounded-md transition-all duration-200 ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
