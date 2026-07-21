import React from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: "default" | "muted";
}

export default function Section({ children, className = "", background = "default" }: SectionProps) {
  const bgClass = background === "muted" ? "bg-background/80" : "bg-transparent";

  return (
    <section className={`section ${bgClass} ${className}`}>
      {children}
    </section>
  );
}
