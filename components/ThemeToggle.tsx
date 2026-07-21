"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggle = () => {
    if (!mounted) return;
    const next = !isDark;
    setIsDark(next);
    try {
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      document.documentElement.classList.toggle("dark", next);
    }
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className="rounded-full p-2 text-muted hover:text-foreground transition-colors"
        aria-label="Toggle theme"
      >
        🌙
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-full p-2 text-muted hover:text-foreground transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
