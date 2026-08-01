"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getDailyNumber, getDailyReflection } from "@/lib/numerology/daily";
import Button from "@/components/ui/Button";

const ESTADISTICAS = [
  { valor: "3", label: "SISTEMAS SIMBÓLICOS" },
  { valor: "13", label: "FUENTES BIBLIOGRÁFICAS" },
  { valor: "0", label: "DATOS ALMACENADOS" },
];

export default function HeroNew() {
  const router = useRouter();
  const today = new Date();
  const number = getDailyNumber(today);
  const reflection = getDailyReflection(number, today);

  const cellPad = "p-8 lg:p-12";

  return (
    <section className="relative flex flex-col justify-center bg-background pt-16 overflow-hidden">
      <div className="relative mx-auto max-w-8xl w-full px-4 sm:px-8 lg:px-12">
        <div className="border-t border-ink/10">
          {/* Eyebrow */}
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

          {/* Headline block — el titular es el foco, no el número */}
          <div className={`${cellPad} border-b border-ink/10`}>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="font-display text-[clamp(2.75rem,8vw,7rem)] leading-[0.88] tracking-tight text-foreground max-w-5xl"
            >
              CONOCETE.
              <br />
              ENTENDETE.
              <br />
              <span className="text-accent">ORIENTATE.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-base md:text-lg text-muted leading-relaxed max-w-lg mt-8"
            >
              Numerología, astrología y zodiaco chino cruzados en un solo mapa personal. Sin registro, sin datos guardados.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="mt-8"
            >
              <Button
                variant="accent"
                size="lg"
                onClick={() => router.push("/onboarding")}
                aria-label="Descubrir mi mapa personal: ir al onboarding"
                className="w-full sm:w-auto"
              >
                DESCUBRIR MI MAPA
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </motion.div>
          </div>

          {/* Número del día — soporte, no protagonista: más chico que el
              titular y que la pregunta de entrada de abajo (DecisionEntryPrompt),
              para no competirles la atención. */}
          <Link
            href="/hoy"
            className="group flex flex-wrap border-b border-ink/10 transition-colors hover:bg-ink/[0.02]"
          >
            <div className={`w-full sm:w-auto sm:min-w-[10rem] ${cellPad} py-4 sm:border-r border-ink/10 flex sm:flex-col items-center sm:items-start gap-4 sm:gap-1`}>
              <span className="label-micro">NÚMERO DEL DÍA</span>
              <span className="font-display text-2xl leading-none text-foreground">{number}</span>
            </div>
            <div className={`flex-1 ${cellPad} py-4 flex items-center justify-between gap-4 sm:min-w-[16rem]`}>
              <div>
                <p className="text-sm md:text-base font-semibold text-foreground leading-tight">{reflection.title}</p>
                <p className="text-sm text-muted mt-1 line-clamp-1 max-w-md">{reflection.text}</p>
              </div>
              <span className="label-micro shrink-0 text-accent group-hover:translate-x-1 transition-transform hidden sm:inline-flex items-center gap-1">
                VER HOY <ArrowRight className="w-3 h-3" aria-hidden="true" />
              </span>
            </div>
          </Link>

          {/* Stats bar */}
          <div className="flex flex-wrap">
            {ESTADISTICAS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                className={`flex-1 ${cellPad} ${i < ESTADISTICAS.length - 1 ? "border-r border-ink/10" : ""} border-b sm:border-b-0 border-ink/10`}
              >
                <p className="font-display text-3xl md:text-4xl text-accent leading-none mb-1">{stat.valor}</p>
                <p className="label-micro">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
