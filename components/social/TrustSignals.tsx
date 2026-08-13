"use client";

import type { ComponentType } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Cookie,
  Ban,
  Lock,
  MonitorSmartphone,
  CalendarDays,
  Fingerprint,
  ChevronRight,
} from "lucide-react";
import { fadeUp, fadeUpDelayed } from "@/lib/utils/motion";
import CountUp from "@/components/ui/CountUp";
import Card from "@/components/ui/Card";
import TestimonialCard, { type TestimonialProps } from "@/components/social/TestimonialCard";

type BadgeIcon = ComponentType<{ className?: string }>;

const BADGES: { icon: BadgeIcon; title: string; detail: string }[] = [
  {
    icon: Shield,
    title: "Sin registro obligatorio",
    detail: "No pedimos cuenta, email ni contraseña para empezar.",
  },
  {
    icon: SlashedCookie,
    title: "Sin cookies de tracking",
    detail: "No te seguimos por la web. Nada de rastreadores.",
  },
  {
    icon: MonitorSmartphone,
    title: "Cálculo 100% local",
    detail: "Todo se procesa en tu dispositivo, no en un servidor.",
  },
  {
    icon: Lock,
    title: "Sin guardar datos personales",
    detail: "Nada queda guardado. Al cerrar, no queda rastro.",
  },
];

const TESTIMONIALS: TestimonialProps[] = [
  {
    name: "Carlos",
    location: "Madrid, España",
    quote:
      "Me ayudó a entender por qué siempre elijo el mismo tipo de trabajo. Por primera vez vi el patrón con claridad.",
  },
  {
    name: "Ana",
    location: "Buenos Aires, Argentina",
    quote:
      "Lo que más me tranquilizó es que no guarda nada. Ingresás tu fecha, leés, y listo. Sin mails, sin cuentas.",
  },
  {
    name: "Lucía",
    location: "Ciudad de México, México",
    quote:
      "Te muestran la estructura detrás del mapa, no te la dan mágicamente. Te explican el porqué de cada número.",
  },
];

const PRIVACY_STEPS: { icon: BadgeIcon; title: string; detail: string }[] = [
  {
    icon: CalendarDays,
    title: "Ingresás tu fecha",
    detail: "Solo tu fecha de nacimiento. Nada más.",
  },
  {
    icon: MonitorSmartphone,
    title: "Se calcula en tu navegador",
    detail: "El cálculo corre local, sin salir de tu dispositivo.",
  },
  {
    icon: Fingerprint,
    title: "Vos decidís qué hacer",
    detail: "Nada se guarda ni se envía. La decisión es tuya.",
  },
];

function SlashedCookie({ className }: { className?: string }) {
  return (
    <span className="relative inline-flex items-center justify-center" aria-hidden="true">
      <Cookie className={className} />
      <Ban className={`${className} absolute -top-1 -right-1 text-error`} strokeWidth={2.5} />
    </span>
  );
}

function BadgeCard({ icon: Icon, title, detail }: { icon: BadgeIcon; title: string; detail: string }) {
  return (
    <motion.div
      {...fadeUp}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group h-full"
    >
      <Card hover={false} padding="lg" className="h-full transition-colors duration-200 group-hover:border-accent/40">
        <div className="w-10 h-10 rounded-full bg-ink/5 text-accent flex items-center justify-center mb-5">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-heading text-base font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted/80 leading-relaxed">{detail}</p>
      </Card>
    </motion.div>
  );
}

export default function TrustSignals() {
  return (
    <section className="bg-background border-t border-ink/10">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 py-16 sm:py-20">
        {/* 1 — Badges de privacidad */}
        <motion.h2
          {...fadeUp}
          className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-muted/70 text-center mb-4"
        >
          Tu privacidad, por diseño
        </motion.h2>
        <motion.p
          {...fadeUpDelayed(0.05)}
          className="font-display text-[clamp(1.75rem,4vw,2.75rem)] tracking-tight text-foreground text-center max-w-3xl mx-auto mb-12"
        >
          Nada de tu mapa sale de tu dispositivo.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-20">
          {BADGES.map((badge) => (
            <BadgeCard key={badge.title} {...badge} />
          ))}
        </div>

        {/* 2 — Social proof */}
        <motion.div {...fadeUp} className="text-center mb-12">
          <div className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-none">
            <CountUp
              target={35000}
              suffix="+"
              format={(n) => n.toLocaleString("es-AR")}
            />
          </div>
          <p className="label-micro mt-3 text-muted/70">mapas generados este mes</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={i} {...t} delay={i * 0.08} />
          ))}
        </div>

        {/* 3 — Cómo funciona la privacidad */}
        <motion.h2
          {...fadeUp}
          className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-muted/70 text-center mb-4"
        >
          Cómo funciona la privacidad
        </motion.h2>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mt-12">
          <div className="hidden md:block absolute top-6 left-[calc(16.66%+1.5rem)] right-[calc(16.66%+1.5rem)] h-px bg-ink/10" aria-hidden="true" />

          {PRIVACY_STEPS.map((step, i) => {
            const Icon = step.icon;
            const isLast = i === PRIVACY_STEPS.length - 1;
            return (
              <motion.div
                key={step.title}
                {...fadeUp}
                style={{ transitionDelay: `${i * 0.08}s` }}
                className="relative text-center"
              >
                <div className="relative z-10 inline-flex items-center justify-center w-12 h-12 rounded-full bg-background border border-ink/15 text-accent mb-6">
                  <Icon className="w-5 h-5" />
                </div>
                {!isLast && (
                  <ChevronRight
                    className="hidden md:block absolute top-1/2 -right-5 -translate-y-1/2 w-5 h-5 text-ink/30"
                    aria-hidden="true"
                  />
                )}
                <h3 className="font-heading text-xl sm:text-2xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-muted/70 leading-relaxed max-w-xs mx-auto">
                  {step.detail}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
