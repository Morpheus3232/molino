"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Failsafe global anti-página-en-blanco.
 *
 * framer-motion renderiza SSR con opacity:0 inline y revela via
 * whileInView (IntersectionObserver). Si el observer no dispara —hiccup de
 * hidratación, timing de navegación client-side— el contenido visible en
 * viewport queda invisible hasta refrescar.
 *
 * Este componente barre el DOM buscando la firma exacta de un elemento
 * trabado (opacity: 0 + transform, AMBOS inline — lo que solo escribe
 * framer-motion; las clases Tailwind tipo opacity-0 no matchean) y que esté
 * dentro del viewport, y lo fuerza a visible. El contenido below-the-fold
 * no se toca: sigue revelando por scroll como siempre.
 *
 * Corre una ventana corta de barridos tras cada navegación (el layout no se
 * remonta entre rutas, por eso key es pathname). No interfiere con UI
 * oculta intencional: modales/dropdowns acá usan AnimatePresence o render
 * condicional (desmontados cuando cerrados), y se ignoran elementos dentro
 * de aria-hidden.
 */

const SWEEP_DELAYS_MS = [1500, 3000, 5000, 8000];

function sweepStuckEntrances() {
  const vh = window.innerHeight;
  // Pre-filtro por el motor de selectores del navegador (más barato que
  // iterar TODO [style] en JS): reduce el candidate set a elementos cuyo
  // style inline menciona opacity, antes de aplicar la firma exacta abajo.
  const candidates = document.querySelectorAll<HTMLElement>('[style*="opacity"]');

  candidates.forEach((el) => {
    const style = el.getAttribute("style") || "";

    // Firma de entrada trabada: opacity exactamente 0 + transform, ambos
    // escritos inline por framer-motion. opacity:0.05 decorativo u
    // opacity:0 sin transform (fade puro ya animado) no matchean.
    if (!/(^|;)\s*opacity:\s*0\s*(;|!|$)/.test(style)) return;
    if (!/transform\s*:/.test(style)) return;
    if (/transform:\s*none/.test(style)) return;
    if (el.closest('[aria-hidden="true"]')) return;

    const rect = el.getBoundingClientRect();

    // Con la pestaña en segundo plano el navegador no hace layout: vh es 0 y
    // todos los rect son 0x0. Con los filtros de abajo aplicados tal cual, el
    // barrido descartaba TODO justo en el escenario que más lo necesita —
    // abrir un link compartido en una pestaña nueva, volver 15s después y
    // encontrar la sección en blanco porque requestAnimationFrame estuvo
    // pausado y la animación de entrada nunca completó. Si no hay layout
    // todavía, no hay forma de saber qué está en viewport: se revela todo lo
    // que matcheó la firma. Un reveal de más es mucho más barato que una
    // sección invisible de forma permanente.
    const sinLayout = vh === 0 || (rect.width === 0 && rect.height === 0);
    if (!sinLayout) {
      if (rect.width === 0 || rect.height === 0) return;
      // Solo lo visible ahora mismo: si está below-the-fold, whileInView
      // todavía puede revelarlo por scroll — forzarlo acá mataría el efecto.
      if (rect.top >= vh || rect.bottom <= 0) return;
    }

    el.style.opacity = "1";
    el.style.transform = "none";
  });
}

export default function MotionFailsafe() {
  const pathname = usePathname();

  useEffect(() => {
    const timers = SWEEP_DELAYS_MS.map((ms) =>
      window.setTimeout(sweepStuckEntrances, ms)
    );

    // Los cuatro barridos se agotan a los 8s. Si la pestaña estuvo oculta
    // todo ese tiempo (link abierto en segundo plano), corrieron sin layout y
    // cuando el usuario finalmente mira no queda ninguno. Un barrido más al
    // recuperar visibilidad, ya con layout real, cubre justo ese caso.
    function onVisible() {
      if (!document.hidden) sweepStuckEntrances();
    }
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [pathname]);

  return null;
}
