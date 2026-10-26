"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Marca un elemento como "visto" la primera vez que entra en pantalla, para
 * animar su aparición desde CSS.
 *
 * A propósito no oculta nada antes de montar ni si el observador falla: el
 * estado oculto se aplica solo con `armed` (montado en el cliente y todavía
 * sin ver), y además de IntersectionObserver se mira la posición al hacer
 * scroll, por si el observador no dispara. Es la lección del blog en blanco
 * del 2026-08-17: una animación de entrada nunca puede dejar contenido
 * invisible.
 */
export function useReveal<T extends Element>(rootMargin = "0px 0px -12% 0px") {
  const ref = useRef<T>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    // Lo que ya está a la vista al cargar no se anima: se ve y listo.
    const box = el.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) return;
    setArmed(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  useEffect(() => {
    if (!armed || shown) return;
    let frame = 0;
    const check = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = ref.current?.getBoundingClientRect();
        if (box && box.top < window.innerHeight && box.bottom > 0) setShown(true);
      });
    };
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [armed, shown]);

  return { ref, hidden: armed && !shown, shown: !armed || shown };
}
