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
  Github,
  Code2,
} from "lucide-react";
import { fadeUp, fadeUpDelayed } from "@/lib/utils/motion";
import Card from "@/components/ui/Card";
import Link from "next/link";

type BadgeIcon = ComponentType<{ className?: string }>;

const BADGES: { icon: BadgeIcon; title: string; detail: string }[] = [
  {
    icon: Shield,
    title: "Sin registro obligatorio",
    detail: "No pedimos cuenta, email ni contraseña para acceder a tu lectura.",
  },
  {
    icon: SlashedCookie,
    title: "Sin cookies de rastreo",
    detail: "Cero cookies de marketing o publicidad. Tu navegación no se rastrea.",
  },
  {
    icon: MonitorSmartphone,
    title: "Cálculo 100% en tu navegador",
    detail: "Los motores matemáticos corren localmente en tu propio dispositivo.",
  },
  {
    icon: Code2,
    title: "Código Abierto & Auditable",
    detail: "Cada fórmula de numerología y astrología es pública en GitHub.",
  },
];

const PRIVACY_STEPS: { icon: BadgeIcon; title: string; detail: string }[] = [
  {
    icon: CalendarDays,
    title: "1. Ingresás tu fecha",
    detail: "Solo tu día, mes y año de nacimiento. Nada de datos personales.",
  },
  {
    icon: MonitorSmartphone,
    title: "2. Se procesa en tu cliente",
    detail: "El cruce de los tres sistemas ocurre en tu CPU, sin tocar servidores.",
  },
  {
    icon: Fingerprint,
    title: "3. Privacidad garantizada",
    detail: "Al cerrar la pestaña, tu fecha desaparece a menos que la guardes en tu bóveda local.",
  },
];

function SlashedCookie({ className }: { className?: string }) {
  return (
    <span className="relative inline-flex items-center justify-center" aria-hidden="true">
      <Cookie className={className} />
      <Ban className={`${className} absolute -top-1 -right-1 text-red-400`} strokeWidth={2.5} />
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
      <Card hover={false} padding="lg" className="h-full transition-colors duration-200 group-hover:border-accent/40 bg-card/60">
        <div className="w-10 h-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-4">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-heading text-sm sm:text-base font-bold text-foreground mb-1.5">{title}</h3>
        <p className="text-xs text-muted leading-relaxed">{detail}</p>
      </Card>
    </motion.div>
  );
}

export default function TrustSignals() {
  return (
    <section className="bg-background border-t border-ink/10 py-16 sm:py-24">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        {/* 1 — Badges de privacidad y transparencia */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.div {...fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent mb-4">
            <Shield className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold">
              Arquitectura Privada por Diseño
            </span>
          </motion.div>
          <motion.h2
            {...fadeUpDelayed(0.05)}
            className="font-display text-2xl sm:text-4xl lg:text-5xl tracking-tight text-foreground"
          >
            Cálculo local por diseño
          </motion.h2>
          <motion.p {...fadeUpDelayed(0.1)} className="text-sm sm:text-base text-muted mt-3 leading-relaxed">
            <strong>Mapa básico:</strong> 100% en tu navegador, sin cuentas, sin datos guardados. <strong>Premium e IA:</strong> si activás estas funciones, tu hash y perfil simbólico se envían a Mercado Pago, PayPal, OpenRouter y DeepSeek bajo acuerdos de confidencialidad (nunca para entrenar modelos). Todo el código es fuente pública y auditable en{" "}
            <Link href="https://github.com/Morpheus3232/molino" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">
              GitHub
            </Link>
            {" "}y el detalle completo está en{" "}
            <Link href="/privacidad" className="underline hover:text-accent">
              nuestra política de privacidad
            </Link>
            .
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-20">
          {BADGES.map((badge) => (
            <BadgeCard key={badge.title} {...badge} />
          ))}
        </div>

        {/* 2 — Cómo funciona el flujo de privacidad */}
        <div className="rounded-3xl border border-ink/10 bg-card/40 p-6 sm:p-10">
          <h3 className="font-heading text-base sm:text-xl font-bold text-foreground text-center mb-8">
            El ciclo de procesamiento local en 3 pasos
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRIVACY_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="text-center space-y-2.5">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-accent/10 text-accent mb-2">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-heading text-sm sm:text-base font-bold text-foreground">
                    {step.title}
                  </h4>
                  <p className="text-xs text-muted leading-relaxed max-w-xs mx-auto">
                    {step.detail}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-ink/10 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-muted">
            <span>Sin telemetría de terceros</span>
            <span>·</span>
            <Link
              href="https://github.com/Morpheus3232/molino"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent inline-flex items-center gap-1 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Ver código fuente en GitHub</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
