"use client";

import React from "react";

interface MysticalNumberProps {
  value: number | string;
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  variant?: "primary" | "accent" | "muted";
  label?: string;
  className?: string;
  /** Mostrar como numeral de fondo muy tenue */
  ghost?: boolean;
}

/**
 * Número con identidad visual mística de Molino.
 * Usa tipografía display grandes y posiciona la intención conceptual
 * (es un número que significa algo, no solo un dígito).
 */
export default function MysticalNumber({
  value,
  size = "md",
  variant = "primary",
  label,
  className = "",
  ghost = false,
}: MysticalNumberProps) {
  const sizeClasses = {
    sm: "text-3xl",
    md: "text-5xl",
    lg: "text-7xl",
    xl: "text-8xl",
    hero: "text-9xl md:text-[10rem]",
  };

  const variantClasses = {
    primary: "text-ink",
    accent: "text-accent",
    muted: "text-muted",
  };

  const baseClasses = `font-display font-400 leading-none tracking-tight ${sizeClasses[size]} ${
    !ghost ? variantClasses[variant] : `${variantClasses[variant]}/15`
  }`;

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className={`${baseClasses} tabular-nums`} aria-label={`Número ${value}`}>
        {value}
      </div>
      {label && <p className="text-xs font-heading uppercase tracking-widest text-muted">{label}</p>}
    </div>
  );
}
