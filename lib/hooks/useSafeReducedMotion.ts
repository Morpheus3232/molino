"use client";

import { useEffect, useState } from "react";

export function useSafeReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // `matchMedia` no existe en todos los entornos donde este código corre
    // (jsdom sin mock, webviews viejos, algunos runtimes de preview). Antes,
    // la ausencia tiraba un TypeError dentro de un efecto — o sea, rompía el
    // árbol entero de React, no solo la animación. La degradación correcta es
    // "sin motion reducido", que es el default del estado.
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    setReduceMotion(media.matches);

    const listener = () => {
      setReduceMotion(media.matches);
    };

    // Safari < 14 solo tiene la API vieja (addListener/removeListener).
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
    media.addListener?.(listener);
    return () => media.removeListener?.(listener);
  }, []);

  return reduceMotion;
}