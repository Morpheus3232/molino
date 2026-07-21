"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (stored === "dark" || (!stored && prefersDark)) {
        document.documentElement.classList.add("dark");
        setIsDark(true);
      }
    } catch {
      setIsDark(false);
    }
  }, []);

  const toggle = () => {
    if (!mounted) return;
    const next = !isDark;
    setIsDark(next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
      document.documentElement.classList.toggle("dark", next);
    } catch {
      // Ignore storage errors
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
