"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Lightbulb, ShieldCheck, X } from "lucide-react";
import Link from "next/link";

const PHILOSOPHY = [
  {
    icon: Lightbulb,
    title: "Epistemología",
    body: "Molino no es un oráculo. Es una calculadora simbólica: toma tu fecha, aplica reglas verificables y devuelve un patrón. Lo que no puede afirmar, lo dice.",
  },
  {
    icon: ShieldCheck,
    title: "Honestidad radical",
    body: "Si un dato no tiene fuente documentada, no lo cargamos. Si un cruce no produce señal, lo decimos. La transparencia no es feature: es el diseño.",
  },
  {
    icon: ArrowRight,
    title: "Incertidumbre declarada",
    body: "El mapa señala patrones, no destinos. El usuario decide qué hacer con esa información. El sistema no sabe lo que vos querés saber — vos pedís la pregunta.",
  },
];

export default function PhilosophySection() {
  const [active, setActive] = useState(0);

  return (
    <section className="relative py-20 sm:py-32 px-4 sm:px-8 bg-ink/[0.02] border-b border-border">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted mb-5">
            Posición epistémica
          </p>
          <h2 className="font-display font-normal normal-case tracking-tight text-foreground leading-[1.05] text-[clamp(2.25rem,5vw,3.5rem)]">
            Lo que sabemos{" "}
            <em className="text-gradient-warm">y lo que no.</em>
          </h2>
        </div>

        <div className="space-y-4">
          {PHILOSOPHY.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={() => setActive(active === i ? -1 : i)}
                className="group w-full text-left rounded-lg border border-border bg-card p-6 sm:p-8 hover:border-accent/40 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <div className="flex items-start gap-5">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent" aria-hidden="true" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display italic text-xl text-foreground">
                        {item.title}
                      </h3>
                      <span className="font-mono text-xs text-accent">
                        {active === i ? "Cerrar" : "Abrir"}
                      </span>
                    </div>
                    <AnimatePresence initial={false}>
                      {active === i && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="text-sm text-muted leading-relaxed overflow-hidden"
                        >
                          {item.body}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-10 rounded-lg border border-accent/20 bg-accent/[0.03] p-7 sm:p-9">
          <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-3">
            El principio que rige todo
          </h3>
          <p className="text-sm text-foreground leading-relaxed">
            Una sola regla de afinidad: signo contra signo. El año de origen de la entidad
            da su animal; la fecha de nacimiento da el del usuario. No mezclamos numerología,
            Wu Xing, signo solar ni ninguna otra capa dentro del puntaje de afinidad. Esas
            capas viven en sus propias secciones y no se cruzan con el Mapa.
          </p>
          <Link
            href="/afinidad"
            className="group mt-5 inline-flex items-center gap-1.5 text-accent font-medium underline-offset-4 hover:underline"
          >
            Explorar afinidades
            <ArrowRight
              className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}