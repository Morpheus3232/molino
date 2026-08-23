"use client";

import { motion } from "framer-motion";
import { useRevealFallback } from "@/lib/hooks/useRevealFallback";

type RevealTag = "div" | "section" | "article" | "li" | "button";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
  tag?: RevealTag;
  onClick?: () => void;
  "aria-label"?: string;
  "aria-current"?: boolean | "page";
  role?: string;
}

const MOTION_TAGS: Record<RevealTag, any> = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  li: motion.li,
  button: motion.button,
};

/**
 * Client island that wraps server-rendered content with the exact
 * scroll-triggered fade-up animation used across editorial pages.
 * The children are passed as server-rendered React elements, so only
 * the animation wrapper ships as JS.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  id,
  tag = "div",
  onClick,
  ...rest
}: RevealProps) {
  const Tag = MOTION_TAGS[tag];
  // Failsafe: si IntersectionObserver no dispara (hiccup de hidratación) Y el
  // elemento ya está cerca del viewport, tras 1.5s se fuerza el estado
  // visible via animate — ver useRevealFallback. Below-the-fold sigue
  // dependiendo de whileInView como siempre.
  const { ref, forceVisible } = useRevealFallback();
  return (
    <Tag
      ref={ref}
      id={id}
      className={className}
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      {...(forceVisible
        ? { animate: { opacity: 1, y: 0 } }
        : {
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 0, margin: "50px" },
          })}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
