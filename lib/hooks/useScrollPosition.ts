"use client";

import { useState, useEffect } from "react";

export interface ScrollPosition {
  /** Current vertical scroll offset in px. */
  scrollY: number;
  /** True when the user has scrolled past the given reference offset. */
  isPastThreshold: boolean;
  /** True when the user is scrolling upward in the viewport (toward the top). */
  isScrollingUp: boolean;
}

/**
 * Tracks the window scroll position and reports whether the viewport has
 * scrolled past `threshold`, plus scroll direction. Passively listens so it
 * never interferes with scroll performance.
 */
export function useScrollPosition(threshold = 0): ScrollPosition {
  const [scrollY, setScrollY] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setIsScrollingUp(y < lastY);
      lastY = y;
      setScrollY(y);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return {
    scrollY,
    isPastThreshold: scrollY >= Math.max(0, threshold),
    isScrollingUp,
  };
}
