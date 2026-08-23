"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Failsafe anti-página-en-blanco para animaciones de entrada basadas en
 * whileInView (IntersectionObserver). Si el observer nunca dispara —hiccup
 * de hidratación, navegación client-side con el payload RSC demorado— el
 * contenido queda en opacity:0 hasta que el usuario refresque.
 *
 * Este hook NO reemplaza whileInView globalmente: a los `timeoutMs` del
 * montaje, mide la posición real del elemento (via el ref que devuelve) y
 * solo activa el fallback si está razonablemente cerca del viewport —o ya
 * visible en él. Un bloque muy por debajo del fold, que el usuario todavía
 * no scrolleó, sigue dependiendo de whileInView como siempre: el fallback
 * nunca lo revela antes de tiempo. NEAR_VIEWPORT_MARGIN_PX cubre el caso real
 * (el observer no disparó para algo que ya estaba o casi estaba en vista),
 * no "toda la página".
 */
const NEAR_VIEWPORT_MARGIN_PX = 600;

export function useRevealFallback<T extends HTMLElement = HTMLElement>(timeoutMs = 1500) {
  const ref = useRef<T>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const nearViewport =
        rect.top < window.innerHeight + NEAR_VIEWPORT_MARGIN_PX &&
        rect.bottom > -NEAR_VIEWPORT_MARGIN_PX;
      if (nearViewport) setFallback(true);
    }, timeoutMs);
    return () => window.clearTimeout(timer);
  }, [timeoutMs]);

  return { ref, forceVisible: fallback } as const;
}
