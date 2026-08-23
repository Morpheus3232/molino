// Centralized framer-motion animation variants
// Use these instead of defining animations inline

// NOTE: useReducedMotion/prefersReducedMotion live in motion-hooks.ts
// (client-only). This module stays free of React hooks so it can be
// imported by Server Components.

// Fade in from below (most common)
export const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0, margin: "50px" },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

// Fade in from below with custom delay
export const fadeUpDelayed = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0, margin: "50px" },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

// Simple fade in
export const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, amount: 0, margin: "50px" },
  transition: { duration: 0.4, ease: "easeOut" as const },
};

// Scale up from center
export const scaleUp = {
  initial: { opacity: 0, scale: 0.95 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, amount: 0, margin: "50px" },
  transition: { duration: 0.4, ease: "easeOut" as const },
};

// Stagger container (use with staggerChildren)
export const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.08 } },
  viewport: { once: true, amount: 0, margin: "50px" },
};

// Stagger item (use inside staggerContainer) — needs its own viewport:{once:true}
// or it reverts to invisible whenever it scrolls out of view again (e.g. after
// the app's own scrollTo(0,0) on navigation), leaving content stuck hidden.
export const staggerItem = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0, margin: "50px" },
  transition: { duration: 0.4, ease: "easeOut" as const },
};

// Page enter (for route transitions)
export const pageEnter = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: "easeOut" as const },
};

// Fade in from below, triggered on MOUNT (not viewport) — para contenido
// above-the-fold, donde whileInView depende de que IntersectionObserver
// dispare en el instante exacto del primer render. Si eso falla (hiccup de
// hidratación), el contenido queda en opacity:0 hasta que el usuario
// scrollee o refresque (ver staggerItemSmooth en premiumMotion.ts, mismo
// failure mode ya documentado ahí). Usar acá para lo que ya es visible al
// cargar; below-the-fold puede seguir usando fadeUp/whileInView sin riesgo.
export const fadeUpMount = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

// Same as fadeUpMount but with a delay — para elementos above-the-fold que
// heredan el entrance escalonado sin depender de IntersectionObserver.
export const fadeUpMountDelayed = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

// Scale-up triggered on MOUNT — equivalente above-the-fold de scaleUp.
export const scaleUpMount = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4, ease: "easeOut" as const },
};

// Stagger section reveal (use on section wrapper)
export const staggerSection = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  viewport: { once: true, amount: 0, margin: "50px" },
};

// Stagger item for cards inside a section
export const staggerCard = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0, margin: "50px" },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

// Number badge reveal (scale + fade)
export const numberReveal = {
  initial: { opacity: 0, scale: 0.8 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, amount: 0, margin: "50px" },
  transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as const },
};

// Hover lift (for cards)
export const hoverLift = {
  whileHover: { y: -4 },
  transition: { duration: 0.2, ease: "easeOut" as const },
};

// Hover scale (for buttons)
export const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.15, ease: "easeOut" as const },
};
