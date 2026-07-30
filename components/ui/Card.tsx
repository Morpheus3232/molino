import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** Resalta el borde en accent al pasar el mouse. */
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  // `.card` aplica padding via --card-padding, hay que anularlo explicitamente
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function Card({ children, className = "", hover = true, padding = "md" }: CardProps) {
  // El sistema no tiene sombras (--shadow-*: none), asi que el hover se
  // expresa con el borde. `.card` de globals.css ya define esa transicion.
  const base = hover ? "card" : "card-static";

  return (
    <div className={`${base} ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
}
