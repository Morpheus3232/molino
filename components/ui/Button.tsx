import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  asChild?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  asChild = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary text-primary-foreground shadow-sm hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-transparent text-secondary border border-border hover:border-accent hover:text-accent",
    ghost: "bg-transparent text-muted hover:text-foreground",
  };

  const sizes = {
    sm: "px-3 py-2.5 text-sm min-h-[40px]",
    md: "px-5 py-3 text-sm min-h-[44px]",
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
      {...props}
    >
      {children}
    </button>
  );
}
