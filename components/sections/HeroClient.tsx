"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getDailyNumber, getDailyReflection } from "@/lib/numerology/daily";
import Button from "@/components/ui/Button";

const ESTADISTICAS = [
  { valor: "3", label: "SISTEMAS CRUZADOS" },
  { valor: "1", label: "MAPA PERSONAL" },
  { valor: "0", label: "DATOS EN SERVIDORES" },
];

export default function HeroClient({ hasProfile = false }: { hasProfile?: boolean }) {
  const router = useRouter();
  const today = new Date();
  const number = getDailyNumber(today);
  const reflection = getDailyReflection(number, today);

  const cellPad = "p-8 lg:p-12";

  return (
    <section className="relative flex flex-col justify-center bg-background pt-16 overflow-hidden">
      <div className="relative mx-auto max-w-8xl w-full px-4 sm:px-8 lg:px-12">
        <div className="border-t border-ink/10">
          <div className={`${cellPad} pb-6 lg:pb-8 border-b border-ink/10`}>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="eyebrow-brutalist"
            >
              MAPA PERSONAL DE AUTOCONOCIMIENTO
            </motion.div>
          </div>

          <div className={`${cellPad} border-b border-ink/10`}>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="font-display text-[clamp(2.5rem,12vw,6rem)] leading-[0.92] tracking-tight uppercase"
            >
              CONOCÉ TU
              <br />
              <span className="text-accent">MAPA PERSONAL</span>
            </motion.h1>
          </div>

          <div className={`${cellPad} pb-6 lg:pb-8`}>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-base sm:text-lg text-muted/80 leading-relaxed max-w-xl"
            >
              Tu fecha de nacimiento revela una arquitectura única.
              Numerología, astrología y zodíaco chino en un solo mapa.
              <span className="font-semibold text-foreground"> Sin registro. Sin cookies. Sin servidor guardando tu perfil. </span>
            </motion.p>
          </div>

          <div className={`${cellPad} border-b border-ink/10`}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="grid grid-cols-3 gap-4 lg:gap-8"
            >
              {ESTADISTICAS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground">{stat.valor}</p>
                  <p className="label-micro mt-2">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <div className={`${cellPad} pt-8 lg:pt-10`}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center"
            >
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
                className="w-full sm:w-auto flex-1 sm:flex-none inline-flex items-center justify-center gap-2 font-mono text-xs font-semibold tracking-[0.2em] uppercase text-accent hover:text-accent/80 transition-colors px-8 py-4 border border-accent/30 rounded hover:border-accent/60"
              >
                CÓMO FUNCIONA
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 py-12 lg:py-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { title: "ENERGÍA DE HOY", desc: reflection.text, href: "/hoy", icon: <span aria-hidden="true">☀️</span> },
              { title: "TU MAPA", desc: "Identidad, arquetipo, elemento, animal y ciclos en un solo lugar.", href: "/profile", icon: <span aria-hidden="true">🗺️</span> },
              { title: "EXPLORAR SISTEMAS", desc: "Numerología, astrología, zodíaco chino — contenido verificado.", href: "/explore", icon: <span aria-hidden="true">📚</span> },
            ].map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group p-6 lg:p-8 bg-background border border-ink/10 hover:bg-ink/[0.02] transition-colors"
              >
                <div className="text-3xl mb-4">{card.icon}</div>
                <p className="label-micro mb-2">{card.title}</p>
                <p className="text-sm text-muted leading-relaxed mb-6">{card.desc}</p>
                <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.2em] uppercase text-accent group-hover:text-accent/80 transition-colors">
                  Leer
                  <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}