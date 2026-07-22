import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

export default function Card({ children, className = "", hover = true, padding = "md" }: CardProps) {
  const paddingClasses = {
    sm: "p-5",
    md: "p-6",
    lg: "p-8",
  };

  const hoverClass = hover ? "hover:shadow-lg hover:-translate-y-0.5" : "";

  return (
    <div className={`card ${paddingClasses[padding]} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
}
