"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { IconLock } from "@/components/ui/Icons";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { fadeUp } from "@/lib/utils/motion";

type AffinityTier = "all" | "resonancia-alta" | "afinidad-media" | "complementarios" | "desafiante";

const TIER_LABELS: Record<AffinityTier, string> = {
  all: "Todas",
  "resonancia-alta": "Alta",
  "afinidad-media": "Media",
  complementarios: "Complementarias",
  desafiante: "Desafiantes",
};

export default function AffinityHub() {
  const { toggleFavorite } = useFavorites();
  const router = useRouter();
  const [filter, setFilter] = useState<AffinityTier>("all");
  const spokes = [
    { label: "Países", href: "/affinity/country", desc: "Descubrí con qué países resuena tu energía", tier: "all" as AffinityTier },
    { label: "Ciudades", href: "/affinity/city", desc: "Destinos alineados con tu perfil", tier: "all" as AffinityTier },
    { label: "Marcas", href: "/affinity/brand", desc: "Marcas que vibran en tu misma frecuencia", tier: "all" as AffinityTier },
  ];
  const filteredSpokes = useMemo(
    () => (filter === "all" ? spokes : spokes.filter(s => s.tier === filter)),
    [spokes, filter]
  );

  return (
    <section className="py-20 sm:py-24 lg:py-28 bg-[#EFEBE1]">
      <div className="mx-auto max-w-8xl px-5 sm:px-8 lg:px-12">
        <motion.div {...fadeUp} className="mb-10 sm:mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium mb-5">Conexiones</p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.0]">
            ¿Con qué resonás?
          </h2>
        </motion.div>

        <div className="flex gap-2 flex-wrap mb-6">
          {(Object.keys(TIER_LABELS) as AffinityTier[]).map(tier => (
            <button
              key={tier}
              type="button"
              onClick={() => setFilter(tier)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                filter === tier
                  ? "bg-accent text-accent-foreground"
                  : "bg-white/50 text-foreground/70 hover:bg-white/80"
              }`}
            >
              {TIER_LABELS[tier]}
            </button>
          ))}
        </div>

        <div className="relative">
          <svg
            className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none select-none"
            viewBox="0 0 1000 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: "var(--color-border)" }}
            opacity="0.25"
          >
            <line x1="260" y1="200" x2="520" y2="72" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
            <line x1="260" y1="200" x2="520" y2="200" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
            <line x1="260" y1="200" x2="520" y2="328" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
          </svg>

          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-6 relative z-10">
            <div className="shrink-0">
              <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full bg-foreground flex flex-col items-center justify-center shadow-xl gap-1">
                <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-background tracking-tight leading-none">Tu</span>
                <span className="font-serif text-base sm:text-lg font-normal text-background/50 tracking-widest uppercase">centro</span>
              </div>
            </div>

            <div className="flex-1 w-full max-w-2xl mx-auto lg:mx-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {filteredSpokes.map((spoke) => (
                  <button
                    key={spoke.label}
                    type="button"
                    onClick={() => router.push(spoke.href)}
                    className="group text-left rounded-2xl border border-border bg-card/60 p-7 sm:p-8 transition-all duration-300 hover:border-accent/30 hover:shadow-lg h-full"
                  >
                    <p className="font-serif text-xl sm:text-2xl font-semibold text-background group-hover:text-accent transition-colors mb-3">{spoke.label}</p>
                    <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">{spoke.desc}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-background/40 group-hover:text-background/70 transition-colors">
                        <IconLock className="w-3 h-3" />
                        Requiere perfil
                      </span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(spoke.label); }}
                        className="text-background/30 hover:text-accent transition-colors duration-200"
                        aria-label={`Guardar ${spoke.label} en favoritos`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                    </div>
                  </button>
                ))}
              </div>
              <p className="mt-8 text-sm text-muted/50 text-center lg:text-left">Creá tu perfil para descubrir tus conexiones personales.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}