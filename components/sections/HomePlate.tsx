"use client";
import { useL } from "@/lib/i18n/useL";

import Image from "next/image";
import { getSectionImage } from "@/lib/data/section-images";
import { SectionCredit } from "@/components/ui/SectionCover";
import { useReveal } from "@/lib/hooks/useReveal";

/**
 * Lámina de un capítulo de la portada (el número del día, la Luna): una
 * viñeta chica a la derecha del texto, como las ilustraciones intercaladas de
 * un libro (2026-11-03: antes ocupaba todo el ancho). El texto la rodea; entra
 * abriéndose de arriba abajo y queda quieta.
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
  const { ref, hidden } = useReveal<HTMLElement>("0px 0px -8% 0px");

  if (!img) return null;

  return (
    <figure ref={ref} className={`float-right ml-5 mb-2 mt-1.5 w-[8.5rem] sm:ml-7 sm:w-[10.5rem] ${className}`}>
      <div
        className="relative aspect-square overflow-hidden border border-ink bg-ink transition-[clip-path] duration-[1100ms] ease-[cubic-bezier(0.7,0,0.2,1)] motion-reduce:transition-none"
        style={{ clipPath: hidden ? "inset(0 0 100% 0)" : "inset(0 0 0 0)" }}
      >
        <Image
          src={img.src}
          alt={L.t(img.alt)}
          fill
          sizes="(max-width: 640px) 136px, 210px"
          className="object-cover grayscale contrast-[1.12]"
        />
      </div>
      <SectionCredit img={img} className="mt-1.5 leading-snug" />
    </figure>
  );
}
