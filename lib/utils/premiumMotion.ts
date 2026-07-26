/**
 * Premium Motion Utilities
 *
 * Inspired by Apple Health + Spotify Wrapped.
 * Smooth, intentional, premium-feeling animations.
 */

// ════════════════════════════════════════════════════
// APPLE HEALTH STYLE — Smooth reveals
// ════════════════════════════════════════════════════

/** Smooth reveal from below — Apple Health style */
export const smoothReveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

/** Staggered card reveal — Apple Health style */
export const cardReveal = {
  initial: { opacity: 0, y: 24, scale: 0.97 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

/** Scale reveal — for hero elements */
export const heroReveal = {
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

/** Slide in from left */
export const slideInLeft = {
  initial: { opacity: 0, x: -24 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

/** Slide in from right */
export const slideInRight = {
  initial: { opacity: 0, x: 24 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

// ════════════════════════════════════════════════════
// SPOTIFY WRAPPED STYLE — Energetic reveals
// ════════════════════════════════════════════════════

/** Pop in — Spotify Wrapped style */
export const popIn = {
  initial: { opacity: 0, scale: 0.8, y: 12 },
  whileInView: { opacity: 1, scale: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as const },
};

/** Number count-up reveal */
export const numberReveal = {
  initial: { opacity: 0, scale: 0.5, y: 8 },
  whileInView: { opacity: 1, scale: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] as const },
};

/** Emoji bounce — for animal emojis */
export const emojiBounce = {
  initial: { opacity: 0, scale: 0, rotate: -12 },
  whileInView: { opacity: 1, scale: 1, rotate: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] as const },
};

/** Badge pop */
export const badgePop = {
  initial: { opacity: 0, scale: 0.8, y: 4 },
  whileInView: { opacity: 1, scale: 1, y: 0 },
  viewport: { once: true, margin: "-20px" },
  transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] as const },
};

// ════════════════════════════════════════════════════
// STAGGER PATTERNS
// ════════════════════════════════════════════════════

/** Stagger container — Apple Health */
export const staggerApple = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true, margin: "-40px" },
};

/** Stagger container — Spotify Wrapped (faster) */
export const staggerSpotify = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.06 } },
  viewport: { once: true, margin: "-40px" },
};

/** Stagger item */
export const staggerItemSmooth = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

/** Stagger item — pop */
export const staggerItemPop = {
  initial: { opacity: 0, scale: 0.9, y: 12 },
  whileInView: { opacity: 1, scale: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as const },
};

// ════════════════════════════════════════════════════
// HOVER EFFECTS
// ════════════════════════════════════════════════════

/** Card hover — subtle lift + shadow */
export const hoverCard = {
  whileHover: { y: -3, boxShadow: "0 8px 25px -5px rgba(0,0,0,0.1)" },
  transition: { duration: 0.2, ease: "easeOut" as const },
};

/** Button hover — subtle press */
export const hoverButton = {
  whileHover: { scale: 1.01 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.15 },
};

/** Emoji hover — playful bounce */
export const hoverEmoji = {
  whileHover: { scale: 1.15, rotate: 5 },
  transition: { duration: 0.2, ease: "easeOut" as const },
};

// ════════════════════════════════════════════════════
// TRANSITION HELPERS
// ════════════════════════════════════════════════════

/** Create stagger delay for index */
export function staggerDelay(index: number, base = 0.08): number {
  return index * base;
}

/** Create stagger delay for nested items */
export function nestedStaggerDelay(
  outerIndex: number,
  innerIndex: number,
  outerBase = 0.1,
  innerBase = 0.05,
): number {
  return outerIndex * outerBase + innerIndex * innerBase;
}
