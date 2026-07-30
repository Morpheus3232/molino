"use client";

import React from "react";

interface ChipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  children: React.ReactNode;
  selected?: boolean;
}

/**
 * Filtro seleccionable. Usa aria-pressed para que el estado sea legible
 * por lectores de pantalla, no solo por color.
 */
export default function Chip({ children, selected = false, className = "", ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`inline-flex items-center gap-2 px-4 py-2 min-h-[40px] font-heading text-xs font-semibold uppercase tracking-wider rounded-none border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        selected
          ? "bg-accent text-accent-foreground border-accent"
          : "bg-transparent text-muted border-ink/20 hover:border-accent hover:text-foreground"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
