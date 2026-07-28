"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getDailyNumber, getDailyReflection } from "@/lib/numerology/daily";

const ESTADISTICAS = [
  { valor: "50K+", label: "Análisis realizados" },
  { valor: "4.9★", label: "Valoración media" },
  { valor: "100%", label: "Gratuito y privado" },
];

export default function HeroNew() {
  const router = useRouter();
  const today = new Date();
  const number = getDailyNumber(today);
  const reflection = getDailyReflection(number, today);
  const dateStr = today
    .toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })
    .replace(/\//g, ".");

  return (
    <section className="min-h-[85vh] flex items-center bg-white px-6 md:px-12">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-accent" aria-hidden="true">
                <path d="M12 2v20" />
                <path d="M12 6c-4 0-6 2-6 6 4 0 6-2 6-6z" />
                <path d="M12 6c4 0 6 2 6 6-4 0-6-2-6-6z" />
                <path d="M12 18c-4 0-6-2-6-6 4 0 6 2 6 6z" />
                <path d="M12 18c4 0 6-2 6-6-4 0-6 2-6 6z" />
              </svg>
              <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="font-mono text-sm text-accent tracking-widest"
            >
              NÚMERO DEL DÍA
            </motion.span>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="font-bold text-[10rem] md:text-[14rem] lg:text-[18rem] leading-[0.9] tracking-tight text-foreground"
            >
              {number}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-xl text-muted max-w-md mt-4"
            >
              {reflection.title}
            </motion.p>
          </div>

          <div className="pt-8 lg:pt-16">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
              className="text-base md:text-lg text-foreground/80 leading-relaxed max-w-md"
            >
              {reflection.text}
            </motion.p>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
              className="w-12 h-0.5 bg-accent mt-6 origin-left"
            />
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
              type="button"
              onClick={() => router.push("/onboarding")}
              className="mt-8 inline-flex items-center gap-2 px-8 py-3 bg-accent text-white font-medium rounded-none hover:bg-accent/90 transition-colors"
            >
              Descubrir mi mapa →
            </motion.button>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="text-xs text-muted mt-4 font-mono tracking-wider"
            >
              {dateStr} · Numerología
            </motion.p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
          className="grid grid-cols-3 gap-8 max-w-2xl mt-16 pt-8 border-t border-neutral-200"
        >
          {ESTADISTICAS.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-accent">{stat.valor}</p>
              <p className="text-sm text-muted font-mono">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
