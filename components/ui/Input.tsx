import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = "", id, ...props }: InputProps) {
  const inputId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-foreground mb-1.5">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`input min-h-[44px] ${error ? "border-error focus:border-error focus:ring-error/30" : ""} ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-error font-medium">{error}</p>}
    </div>
  );
}
