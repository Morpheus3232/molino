"use client";

import { useEffect, useState } from "react";

export function useSafeReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    setReduceMotion(media.matches);

    const listener = () => {
      setReduceMotion(media.matches);
    };

    media.addEventListener("change", listener);

    return () => {
      media.removeEventListener("change", listener);
    };
  }, []);

  return reduceMotion;
}