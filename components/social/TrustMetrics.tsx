"use client";

import { motion } from "framer-motion";
import { MonitorSmartphone, ServerOff, Github, UserX } from "lucide-react";
import { fadeUp } from "@/lib/utils/motion";
import Card from "@/components/ui/Card";

const METRICS = [
  {
    value: "100%",
    label: "Cálculo local",
    detail: "Todo se calcula en tu navegador, sin enviar tu fecha a ningún servidor.",
    icon: MonitorSmartphone,
  },
  {
    value: "0",
    label: "Datos en el servidor",
    detail: "No guardamos tus datos personales. Lo que escribís sale de tu dispositivo.",
    icon: ServerOff,
  },
  {
    value: "MIT",
    label: "Código abierto",
    detail: "Licencia libre. Cada línea de código es pública y auditable en GitHub.",
    icon: Github,
  },
  {
    value: "Sin registro",
    label: "Sin emails, sin contraseñas",
    detail: "Entrás y usás la herramienta al instante. Sin cuentas, sin muros de datos.",
    icon: UserX,
  },
];

export default function TrustMetrics() {
  return (
    <section className="bg-background border-t border-ink/10 py-16 sm:py-20">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <motion.h2
          {...fadeUp}
          className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-muted/70 text-center mb-12"
        >
          Hechos, no promesas
        </motion.h2>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 list-none">
          {METRICS.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <motion.li
                key={metric.label}
                {...fadeUp}
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <Card padding="lg" className="h-full flex flex-col">
                  <div className="w-10 h-10 rounded-full bg-ink/5 text-accent flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-none">
                    {metric.value}
                  </div>
                  <div className="label-micro mt-2 text-muted/70">{metric.label}</div>
                  <p className="text-sm text-muted/80 leading-relaxed mt-3 flex-1">
                    {metric.detail}
                  </p>
                </Card>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
