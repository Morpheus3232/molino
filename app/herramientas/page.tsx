"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Hash, Sun, Moon, HeartHandshake, type LucideIcon } from "lucide-react";
import { fadeUpDelayed, fadeUpMount } from "@/lib/utils/motion";

const TOOLS: { title: string; subtitle: string; description: string; href: string; icon: LucideIcon; color: string; labelColor: string }[] = [
  {
    title: "Camino de Vida",
    subtitle: "Numerolog\u00eda",
    description: "Calcul\u00e1 tu n\u00famero de Camino de Vida a partir de tu fecha de nacimiento. Descubr\u00ed qu\u00e9 energ\u00eda central ten\u00e9s seg\u00fan la tradici\u00f3n numerol\u00f3gica.",
    href: "/herramientas/camino-de-vida",
    icon: Hash,
    color: "var(--element-fire)",
    // --element-fire (#1E3AFF) da 2.74:1 sobre fondo oscuro como color de
    // texto \u2014 falla WCAG AA. Mismo tono, aclarado solo para este uso; el
    // \u00edcono sigue usando el token compartido tal cual.
    labelColor: "#6275FF",
  },
  {
    title: "Signo Solar",
    subtitle: "Astrolog\u00eda",
    description: "Descubr\u00ed tu signo zodiacal solar, su elemento y modalidad a partir de tu fecha de nacimiento.",
    href: "/herramientas/signo-solar",
    icon: Sun,
    color: "var(--layer-astrology)",
    labelColor: "#9661F1",
  },
  {
    title: "Zodiaco Chino",
    subtitle: "Calendario chino",
    description: "Tu animal, elemento y posici\u00f3n en el ciclo sexagenario. Un sistema de m\u00e1s de 2000 a\u00f1os.",
    href: "/herramientas/zodiaco-chino",
    icon: Moon,
    color: "var(--layer-moment)",
    labelColor: "#E14747",
  },
  {
    title: "Compatibilidad",
    subtitle: "Simbolog\u00eda cruzada",
    description: "Calcul\u00e1 la compatibilidad simb\u00f3lica entre dos perfiles usando el zodiaco chino y la numerolog\u00eda.",
    href: "/herramientas/compatibilidad",
    icon: HeartHandshake,
    color: "var(--score-good)",
    labelColor: "var(--score-good)",
  },
];

export default function HerramientasPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24" id="main-content">

        <nav className="text-xs text-muted mb-8" aria-label="Breadcrumb">
          <Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">Inicio</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <span className="text-foreground font-medium" aria-current="page">Herramientas</span>
        </nav>

        {/* Hero — animación por montaje (no whileInView, ver fadeUpMount) */}
        <motion.section {...fadeUpMount} className="mb-12 sm:mb-16">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1]">
            Calculá tu identidad
          </h1>
          <p className="text-base sm:text-lg text-muted mt-6 max-w-xl leading-relaxed">
            Sin servidor. Sin cuentas. Resultado inmediato.
          </p>
        </motion.section>

        <div className="space-y-4">
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.href}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <Link
                href={tool.href}
                className="block w-full text-left p-6 sm:p-8 rounded-md border border-border bg-card shadow-sm hover:border-accent/50 hover:-translate-y-[2px] transition-all duration-200 ease-out group focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2"
              >
                <div className="flex items-start gap-6">
                  <tool.icon
                    className="w-7 h-7 shrink-0 mt-1 transition-transform duration-200 group-hover:scale-110"
                    style={{ color: tool.color }}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-[0.2em] font-medium mb-1" style={{ color: tool.labelColor }}>
                      {tool.subtitle}
                    </p>
                    <h2 className="font-heading text-xl sm:text-2xl font-semibold text-foreground group-hover:text-accent transition-colors duration-200">
                      {tool.title}
                    </h2>
                    <p className="text-sm text-muted mt-2 leading-relaxed max-w-lg">
                      {tool.description}
                    </p>
                  </div>
                  <span className="text-sm text-muted group-hover:text-accent transition-all duration-200 mt-2 shrink-0 hidden sm:block group-hover:translate-x-0.5">
                    Calcular &rarr;
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.section {...fadeUpDelayed(0.15)} className="mt-16 sm:mt-20 text-center">
          <div className="w-8 h-px bg-border mx-auto mb-6" />
          <p className="text-sm text-muted max-w-md mx-auto">
            Estas herramientas son gratuitas y no guardan tus datos. Tu perfil explora tus principales patrones sin costo; la síntesis integral que los conecta es una capa Premium opcional.
          </p>
          <Link
            href="/onboarding"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-200 px-6 py-3 text-sm bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground hover:-translate-y-[2px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2"
          >
            Crear mi perfil
          </Link>
        </motion.section>

      </main>
    </div>
  );
}
