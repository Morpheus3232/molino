"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { fadeUp } from "@/lib/utils/motion";
import Card from "@/components/ui/Card";
import { getOrCreateProfile } from "@/lib/hooks/useProfile";
import type { UserProfile } from "@/types/user";

export default function ParejaTeaser() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProfile(getOrCreateProfile());
  }, []);

  // Con perfil guardado, el ejemplo ficticio (Ana/Lucas) es ruido — el link
  // a /pareja sigue disponible desde el nav, esta sección es solo el teaser.
  if (mounted && profile?.birthDate) return null;

  return (
    <section className="bg-ink/[0.02] border-t border-ink/10 py-16 sm:py-24">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left copy */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Heart className="w-3.5 h-3.5 animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] font-bold">
                Modo Pareja & Vínculos
              </span>
            </div>

            <motion.h2
              {...fadeUp}
              className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground font-bold tracking-tight leading-[1.08]"
            >
              ¿Cómo interactúan dos mapas de nacimiento?
            </motion.h2>

            <motion.p {...fadeUp} className="text-sm sm:text-base text-muted leading-relaxed">
              Cruzá dos fechas para descubrir los puntos de sinergia natural, química elemental entre signos solares, compatibilidades del zodíaco chino y zonas de fricción constructiva.
            </motion.p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/pareja"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold text-gold-foreground font-heading text-xs uppercase tracking-wider font-bold hover:bg-gold-hover transition-colors shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                Comparar dos mapas
              </Link>

              <Link
                href="/pareja?a=1990-03-15&b=1988-07-22&na=Ana&nb=Lucas"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-ink/5 hover:bg-ink/10 border border-ink/10 text-foreground font-heading text-xs uppercase tracking-wider font-semibold transition-colors"
              >
                Ver ejemplo en vivo <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted font-mono pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% privado · Sin registro ni guardado en servidores</span>
            </div>
          </div>

          {/* Right Preview Card */}
          <div className="lg:col-span-6">
            <div className="relative p-6 sm:p-8 rounded-3xl bg-card border border-ink/10 shadow-xl overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-ink/10">
                <span className="font-mono text-xs text-accent font-bold uppercase tracking-wider">
                  Sinergia de Ejemplo
                </span>
                <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  88% Compatibilidad
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 my-6">
                {/* Persona A */}
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-center space-y-1">
                  <span className="text-[10px] font-mono text-amber-700 uppercase tracking-widest block font-bold">
                    Ana (15/03/1990)
                  </span>
                  <div className="font-display text-lg text-foreground font-bold">Camino 1 · Piscis</div>
                  <span className="text-xs text-muted">Caballo de Metal</span>
                </div>

                {/* Persona B */}
                <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 text-center space-y-1">
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block font-bold">
                    Lucas (22/07/1988)
                  </span>
                  <div className="font-display text-lg text-foreground font-bold">Camino 7 · Cáncer</div>
                  <span className="text-xs text-muted">Dragón de Tierra</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-background border border-ink/5 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-accent font-semibold">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Sinergia Elemental: Agua + Agua (Trígono Fluido)</span>
                </div>
                <p className="text-muted leading-relaxed">
                  Alta intuición mutua y resonancia emocional profunda. El foco de crecimiento reside en no asumir pensamientos sin dialogar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
