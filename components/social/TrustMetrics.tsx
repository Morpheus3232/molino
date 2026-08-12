"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const METRICS = [
  { value: "3", label: "Sistemas cruzados" },
  { value: "1", label: "Mapa personal" },
  { value: "0", label: "Registro obligatorio" },
];

export default function TrustMetrics() {
  return (
    <section className="bg-background border-t border-ink/10 py-12 sm:py-16">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 text-center">
          {METRICS.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                {metric.value}
              </div>
              <div className="label-micro mt-2 text-muted/70 max-w-[8rem]">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24, duration: 0.4 }}
          className="mt-12 max-w-lg mx-auto text-center border-t border-ink/10 pt-10"
        >
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-ink/5 text-accent mb-4">
            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
            Tu privacidad, primero
          </h3>
          <p className="text-sm text-muted/80 leading-relaxed mb-4">
            El mapa básico se calcula localmente en tu navegador. Las funciones Premium que requieren procesamiento remoto solo envían los datos necesarios para prestar ese servicio.
          </p>

          <details className="group text-left inline-block w-full">
            <summary className="cursor-pointer list-none inline-flex items-center gap-1.5 mx-auto w-fit font-mono text-xs font-semibold tracking-[0.15em] uppercase text-accent hover:text-accent/80 transition-colors">
              Cómo funciona
              <span className="transition-transform duration-200 group-open:rotate-180" aria-hidden="true">⌄</span>
            </summary>
            <p className="text-sm text-muted/70 leading-relaxed mt-3 text-center">
              El mapa básico se calcula en tu navegador, sin registro. Las funciones Premium que requieren procesamiento remoto solo envían lo necesario para prestar ese servicio.
            </p>
          </details>

          <p className="mt-5">
            <Link
              href="/privacidad"
              className="font-mono text-xs font-semibold tracking-[0.15em] uppercase text-muted/70 hover:text-foreground underline decoration-muted/30 underline-offset-4 transition-colors"
            >
              Ver política de privacidad
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}