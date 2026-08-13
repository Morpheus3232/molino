import React from "react";

interface DividerProps {
  variant?: "rule" | "accent" | "star" | "ornament";
  className?: string;
}

/**
 * Editorial dividers con identidad mística de Molino.
 * Cada variante comunica una separación sutil pero intencional.
 */
export default function Divider({ variant = "rule", className = "" }: DividerProps) {
  switch (variant) {
    case "star":
      return (
        <div className={`divider-star ${className}`}>
          <span />
        </div>
      );

    case "ornament":
      return <div className={`divider-ornament ${className}`} />;

    case "accent":
      return <div className={`divider-accent ${className}`} />;

    case "rule":
    default:
      return <div className={`divider-rule ${className}`} />;
  }
}
