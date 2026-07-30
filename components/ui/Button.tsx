import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "secondary" | "ghost" | "inverse";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  asChild?: boolean;
  loading?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  asChild = false,
  loading = false,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-md font-heading uppercase tracking-wider font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none group";
  const isDisabled = disabled || loading;

  const variants = {
    primary: "bg-primary text-primary-foreground shadow-sm hover:bg-accent hover:text-accent-foreground hover:shadow-md hover:-translate-y-px active:translate-y-0",
    accent: "bg-accent text-accent-foreground shadow-sm hover:opacity-95 hover:shadow-glow-accent hover:-translate-y-px active:translate-y-0",
    secondary: "bg-transparent text-secondary border border-border hover:border-accent hover:text-accent hover:shadow-sm",
    ghost: "bg-transparent text-muted hover:text-foreground",
    inverse: "bg-white text-accent shadow-sm hover:bg-white/95 hover:shadow-md hover:-translate-y-px active:translate-y-0",
  };

  const sizes = {
    sm: "px-3 py-2.5 text-sm min-h-[44px]",
    md: "px-6 py-3 text-sm min-h-[44px]",
    lg: "px-8 py-4 text-base min-h-[52px]",
  };

  const widthClass = fullWidth ? "w-full" : "";

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      className: `${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className} ${(children as any).props.className || ""}`,
      ...props,
    });
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}
