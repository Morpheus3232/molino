import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** Tipo de tarjeta — afecta bordes y hover */
  variant?: "default" | "mystical" | "accent";
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const variantClasses = {
  default: "card",
  mystical: "card-mystical",
  accent: "card-accent",
};

export default function Card({
  children,
  className = "",
  variant = "default",
  hover = true,
  padding = "md",
}: CardProps) {
  const base = hover ? variantClasses[variant] : "card-static";

  return (
    <div className={`${base} ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
}
