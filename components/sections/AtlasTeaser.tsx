"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Compass, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { fadeUp } from "@/lib/utils/motion";

export default function AtlasTeaser() {
  return (
    <section className="bg-ink/[0.02] border-t border-ink/10 py-16 sm:py-24">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left copy */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent">
              <Compass className="w-3.5 h-3.5" />
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] font-bold">
                Atlas de Afinidades
              </span>
            </div>

            <motion.h2
              {...fadeUp}
              className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground font-bold tracking-tight leading-[1.08]"
            >
              Tu energía en el mundo
            </motion.h2>

            <motion.p {...fadeUp} className="text-sm sm:text-base text-muted leading-relaxed">
              Explorá tu mapa en el mundo: marcas, ciudades, equipos, universidades, famosos y películas que comparten tu animal del zodíaco chino.
            </motion.p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/atlas"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold text-gold-foreground font-heading text-xs uppercase tracking-wider font-bold hover:bg-gold-hover transition-colors shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                Explorar el Atlas
              </Link>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted font-mono pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% gratuito · Sin registro</span>
            </div>
          </div>

          {/* Right Preview Card */}
          <div className="lg:col-span-6">
            <div className="relative p-6 sm:p-8 rounded-3xl bg-card border border-ink/10 shadow-xl overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-ink/10">
                <span className="font-mono text-xs text-accent font-bold uppercase tracking-wider">
                  Ejemplo: Dragón
                </span>
                <span className="text-2xl" aria-hidden="true">
                  🐉
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 my-6">
                <div className="p-3 rounded-2xl bg-accent/5 border border-accent/20 text-center space-y-1">
                  <span className="text-[10px] font-mono text-accent uppercase tracking-widest block font-bold">
                    Marca
                  </span>
                  <div className="font-display text-sm text-foreground font-bold">Nike</div>
                </div>

                <div className="p-3 rounded-2xl bg-accent/5 border border-accent/20 text-center space-y-1">
                  <span className="text-[10px] font-mono text-accent uppercase tracking-widest block font-bold">
                    Ciudad
                  </span>
                  <div className="font-display text-sm text-foreground font-bold">Osaka</div>
                </div>

                <div className="p-3 rounded-2xl bg-accent/5 border border-accent/20 text-center space-y-1">
                  <span className="text-[10px] font-mono text-accent uppercase tracking-widest block font-bold">
                    Equipo
                  </span>
                  <div className="font-display text-sm text-foreground font-bold">Independiente</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-background border border-ink/5 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-accent font-semibold">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Afinidad por año de origen</span>
                </div>
                <p className="text-muted leading-relaxed">
                  Cada entidad tiene un animal asignado según su fecha de fundación o creación, igual que el tuyo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
