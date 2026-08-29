"use client";

import React, { useEffect, useRef, useState } from "react";

interface MarqueeSegment {
  text: string;
  isAccent?: boolean;
}

const MARQUEE_SEGMENTS: MarqueeSegment[] = [
  { text: "TE AYUDAMOS A ENTENDER DE DONDE VIENE EL VIENTO", isAccent: true },
  { text: "·" },
  { text: "MOLINO.APP", isAccent: false },
  { text: "·" },
  { text: "CHEQUEEMOS DE DÓNDE VIENE EL VIENTO", isAccent: false },
  { text: "·" },
  { text: "TE AYUDAMOS A ENTENDER DE DONDE VIENE EL VIENTO", isAccent: true },
  { text: "·" },
  { text: "MOLINO.APP", isAccent: false },
  { text: "·" },
  { text: "CHEQUEEMOS DE DÓNDE VIENE EL VIENTO", isAccent: false },
  { text: "·" },
];

export default function ArchetypeMarquee() {
  const containerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: "120px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-paper border-y border-border py-4 sm:py-5 overflow-hidden select-none"
    >
      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          will-change: transform;
        }
        .marquee-running {
          animation: marquee-scroll 45s linear infinite;
        }
        .marquee-paused {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-running {
            animation: none;
            transform: none;
          }
        }
      `}</style>

      {/* Screen Reader solo para accesibilidad */}
      <span className="sr-only">
        Patrones del mapa simbólico: El Constructor, El Camaleón, Camino de Vida 4, Ciclo de Cimiento, Sol en Leo, Año Personal 4, Zodíaco Chino Tigre.
      </span>

      {/* Gradientes laterales de desvanecimiento suave */}
      <div
        className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-paper to-transparent z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-paper to-transparent z-10"
        aria-hidden="true"
      />

      <div
        className={`marquee-track ${isVisible ? "marquee-running" : "marquee-paused"}`}
        aria-hidden="true"
      >
        {/* Renderizado 2x para rotación continua perfecta */}
        {[0, 1].map((copyIndex) => (
          <div key={copyIndex} className="flex items-center gap-6 sm:gap-8 px-3 sm:px-4">
            {MARQUEE_SEGMENTS.map((segment, idx) => (
              <span
                key={`${copyIndex}-${idx}`}
                className={`font-mono text-xs sm:text-sm uppercase tracking-[0.22em] whitespace-nowrap transition-colors ${
                  segment.text === "·"
                    ? "text-border font-bold text-base px-1"
                    : segment.isAccent
                    ? "text-accent font-bold"
                    : "text-foreground font-medium"
                }`}
              >
                {segment.text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
