"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Utensils, PawPrint, Clock, Palette, Handshake } from "lucide-react";
import { fadeUp, fadeUpMount } from "@/lib/utils/motion";

const FEATURES = [
  {
    icon: Utensils,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    title: "Alimentos a moderar",
    desc: "Según tu signo del zodíaco chino, qué alimentos vibran en tensión con tu energía y cuáles no tienen restricción.",
  },
  {
    icon: PawPrint,
    color: "text-amber-700",
    bg: "bg-amber-500/10",
    title: "Mascotas y afinidad",
    desc: "Qué mascota energéticamente choca con tu signo, cuáles son afines, y el nivel de conflicto con cualquier animal.",
  },
  {
    icon: Clock,
    color: "text-accent",
    bg: "bg-accent/10",
    title: "Timing anual",
    desc: "Si el año en curso es tu año, el de tu signo en posición opuesta, o uno neutral — y cuándo es tu próximo año propio.",
  },
  {
    icon: Palette,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    title: "Color de tu elemento",
    desc: "El color tradicional asociado a tu elemento chino (madera, fuego, tierra, metal o agua) según los cinco elementos.",
  },
];

export default function NewInsightsTeaser() {
  return (
    <section className="border-t border-ink/10 py-14 sm:py-20">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <motion.div {...fadeUpMount} className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
            Analizamos distintas áreas que influyen en tu día a día
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-foreground font-bold tracking-tight mt-2">
            Todo esto se calcula junto con tu fecha
          </h2>
          <p className="text-sm sm:text-base text-muted leading-relaxed mt-3">
            Además de tu Camino de Vida, signo solar y animal chino, tu mapa ahora cruza estas cuatro
            lecturas adicionales — gratis, sin ningún paso extra.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="p-5 rounded-2xl bg-card border border-ink/10 hover:border-accent/30 transition-colors"
            >
              <div className={`w-9 h-9 rounded-xl ${f.bg} ${f.color} flex items-center justify-center mb-3`}>
                <f.icon className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-heading text-sm sm:text-base font-bold text-foreground mb-1.5">
                {f.title}
              </h3>
              <p className="text-xs text-muted leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Socios mode mention */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-6 sm:mt-8 p-5 sm:p-6 rounded-2xl bg-ink/[0.02] border border-ink/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <Handshake className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-heading text-sm sm:text-base font-bold text-foreground">
                También sumamos Modo Socios
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                La misma comparativa de Modo Pareja, pensada para sociedades, equipos y vínculos
                empleador/empleado — sin asumir pareja romántica.
              </p>
            </div>
          </div>
          <Link
            href="/socios"
            className="shrink-0 inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-ink/5 hover:bg-ink/10 border border-ink/10 text-foreground font-heading text-xs uppercase tracking-wider font-semibold transition-colors"
          >
            Probar Modo Socios
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
