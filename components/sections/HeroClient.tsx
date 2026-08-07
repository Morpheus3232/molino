"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import Halftone from "@/components/ui/Halftone";

const PREVIEW_LAYERS = [
  { number: "7", label: "CAMINO DE VIDA", system: "Numerología", color: "#6B4C7A" },
  { symbol: "♎", label: "SIGNO SOLAR", system: "Astrología", color: "#2E5C8A" },
  { emoji: "🐉", label: "DRAGÓN", system: "Zodíaco Chino", color: "#C49A2A" },
];

export default function HeroClient({ hasProfile = false }: { hasProfile?: boolean }) {
  const router = useRouter();

  return (
    <section className="relative bg-background overflow-hidden">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-20 sm:pt-28 lg:pt-36 pb-16 sm:pb-20">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-center">
          {/* Left: Copy + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="eyebrow-brutalist mb-5">
              MAPA PERSONAL DE AUTOCONOCIMIENTO
            </p>

            <h1 className="font-display text-[clamp(2.5rem,8vw,5rem)] leading-[0.92] tracking-tight uppercase">
              CONOCÉ TU
              <br />
              <span className="text-accent">MAPA PERSONAL</span>
            </h1>

            <p className="text-base sm:text-lg text-muted/80 leading-relaxed max-w-xl mt-8">
              Tu fecha de nacimiento revela tres sistemas que se cruzan para mostrarte quién sos, en qué momento estás y qué energías te acompañan.
              <span className="font-semibold text-foreground"> Sin registro. Sin cookies. Sin servidor.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center mt-10">
              <Button
                onClick={() => router.push("/onboarding")}
                className="group w-full sm:w-auto flex-1 sm:flex-none"
                size="lg"
              >
                <span className="flex items-center gap-2">
                  CREAR MI MAPA
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Button>
              <Link
                href="/filosofia"
                className="w-full sm:w-auto flex-1 sm:flex-none inline-flex items-center justify-center gap-2 font-mono text-xs font-semibold tracking-[0.2em] uppercase text-muted hover:text-foreground transition-colors px-8 py-4"
              >
                Cómo funciona
                <ArrowRight className="w-3 h-3" aria-hidden="true" />
              </Link>
            </div>

            <p className="text-xs text-muted/60 mt-5 font-medium">
              Tres sistemas. Un mapa. Tu navegador es el único que guarda tu perfil.
            </p>
          </motion.div>

          {/* Right: Map Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            <div className="relative border border-ink/10 bg-background overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <Halftone variant="spiral" resolution={25} className="w-full h-full text-ink opacity-[0.02]" />
              </div>

              {/* Header strip */}
              <div className="relative px-8 pt-8 pb-6 border-b border-ink/10">
                <div className="flex items-center justify-between">
                  <p className="label-micro">Tu mapa personal</p>
                  <p className="font-mono text-[0.6rem] tracking-[0.15em] text-muted/50 uppercase">Preview</p>
                </div>
                <p className="font-display text-2xl sm:text-3xl font-bold tracking-tight mt-3">
                  Mapa de <span className="text-accent">autodescubrimiento</span>
                </p>
              </div>

              {/* Three systems */}
              <div className="relative grid grid-cols-3 divide-x divide-ink/10">
                {PREVIEW_LAYERS.map((layer, i) => (
                  <div key={layer.label} className="px-6 sm:px-8 py-8 text-center">
                    <p className="text-[0.6rem] font-mono tracking-[0.15em] text-muted/50 uppercase mb-4">{layer.system}</p>
                    {layer.number && (
                      <p className="font-display text-4xl sm:text-5xl font-bold" style={{ color: layer.color }}>{layer.number}</p>
                    )}
                    {layer.symbol && (
                      <p className="text-4xl sm:text-5xl" style={{ color: layer.color }}>{layer.symbol}</p>
                    )}
                    {layer.emoji && (
                      <p className="text-4xl sm:text-5xl">{layer.emoji}</p>
                    )}
                    <p className="text-xs font-semibold tracking-[0.12em] text-foreground mt-3 uppercase">{layer.label}</p>
                  </div>
                ))}
              </div>

              {/* Bottom teaser */}
              <div className="relative px-8 py-6 border-t border-ink/10 bg-ink/[0.015]">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <p className="text-sm text-muted">Tu elemento define tu energía base. Tu camino de vida revela tu propósito.</p>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <p className="text-sm text-muted">Tu signo solar complementa. Tu animal chino cicla cada 12 años.</p>
                </div>
              </div>
            </div>

            {/* Shadow / depth */}
            <div className="absolute -bottom-3 left-4 right-4 h-6 bg-ink/[0.04] -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}