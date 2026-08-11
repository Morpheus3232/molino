"use client";

import React from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type"> {
  value: string;
  onValueChange: (value: string) => void;
  /** Obligatorio: el icono no alcanza como etiqueta accesible. */
  label: string;
  className?: string;
}

/**
 * Buscador unificado del sitio. Reemplaza las 6 variantes inline que habia.
 */
export default function SearchInput({
  value,
  onValueChange,
  label,
  placeholder,
  className = "",
  ...props
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <Search
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="w-full min-h-[44px] pl-11 pr-11 py-3 rounded-md border border-border bg-card text-base text-foreground placeholder:text-muted shadow-sm transition-all duration-200 focus:outline-none focus:border-accent focus:shadow-md [&::-webkit-search-cancel-button]:hidden"
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => onValueChange("")}
          aria-label={`Limpiar ${label.toLowerCase()}`}
          className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-7 h-7 rounded-sm text-muted transition-colors hover:text-foreground hover:bg-ink/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
