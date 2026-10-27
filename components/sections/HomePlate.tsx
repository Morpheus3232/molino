"use client";
import { useL } from "@/lib/i18n/useL";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { getSectionImage } from "@/lib/data/section-images";
import { SectionCredit } from "@/components/ui/SectionCover";
import { useReveal } from "@/lib/hooks/useReveal";

/**
 * Lámina de un capítulo de la portada (el número del día, la Luna). Igual
 * que SectionCover, pero en escritorio se sale de la columna de texto y pasa
 * a formato cinemascope (2,35:1), con la misma altura que tendría la 16:9
 * dentro de la columna — así no cambia la altura reservada del capítulo en
 * app/page.tsx. Entra abriéndose como un telón de cine y la foto se desplaza
 * un poco más lento que la página.
 */
export default function HomePlate({
  imageKey,
  className = "",
}: {
  imageKey: string;
  className?: string;
}) {
  const L = useL();
  const img = getSectionImage(imageKey);
  const frame = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { ref, hidden } = useReveal<HTMLElement>("0px 0px -8% 0px");
  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  if (!img) return null;

  return (
    <figure ref={ref} className={`md:-mx-[clamp(0rem,calc((100vw-38rem)/2-2rem),6rem)] ${className}`}>
      <div
        ref={frame}
        className="relative aspect-[16/9] md:aspect-[2.35/1] overflow-hidden border border-ink bg-ink transition-[clip-path] duration-[1300ms] ease-[cubic-bezier(0.7,0,0.2,1)] motion-reduce:transition-none"
        style={{ clipPath: hidden ? "inset(50% 0 50% 0)" : "inset(0 0 0 0)" }}
      >
        <motion.div className="absolute inset-x-0 -inset-y-[9%]" style={{ y: reduce ? 0 : y }}>
          <Image
            src={img.src}
            alt={L.t(img.alt)}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover grayscale contrast-[1.12]"
          />
        </motion.div>
      </div>
      <SectionCredit img={img} />
    </figure>
  );
}
