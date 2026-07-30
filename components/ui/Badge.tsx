import React from "react";

type BadgeVariant = "accent" | "outline" | "muted" | "success" | "error";

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
};

/**
 * Etiqueta corta en mayusculas. Sin border-radius, como el resto del sistema.
 */
export default function Badge({ children, variant = "accent", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 font-heading text-[0.7rem] font-semibold uppercase tracking-[0.15em] rounded-sm ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
