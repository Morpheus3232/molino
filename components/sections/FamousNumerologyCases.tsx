"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Apple, Briefcase, Rocket, Award, Calculator, TrendingUp } from "lucide-react";
import { fadeUp, fadeUpDelayed, staggerContainer, staggerItem } from "@/lib/utils/motion";

const CASES = [
  {
    icon: Apple,
    color: "text-neutral-400",
    bgGradient: "from-neutral-500/10 to-neutral-600/5",
    borderColor: "border-neutral-500/20",
    name: "Steve Jobs",
    subtitle: "El patrón del 28",
    highlight: "28 = Dinero & Poder",
    points: [
      "Nació el 24 de febrero de 1955 → 2+4+2+1+9+5+5 = 28 (el número del dinero).",
      "Fundó Apple el 1 de abril de 1976 → 1+4+1+9+7+6 = 28.",
      "Apple se incorporó legalmente el 3 de enero de 1977 → 3+1+1+9+7+7 = 28.",
      "El iPhone salió el 29 de junio de 2007 → 2+9+6+2+9+2+0+0+7 se reduce a 8.",
    ],
  },
  {
    icon: Briefcase,
    color: "text-emerald-400",
    bgGradient: "from-emerald-500/10 to-emerald-600/5",
    borderColor: "border-emerald-500/20",
    name: "Bill Gates",
    subtitle: "El constructor del 28",
    highlight: "4 = Estructura & Bases",
    points: [
      "Nació el 28 de octubre de 1955 → nació un día 28.",
      "Su fecha completa → 1+0+2+8+1+9+5+5 = 31 → 3+1 = 4 (el constructor).",
      "El 28 reduce a 1 (el líder); el 4 es la estructura. La lectura: edificar bases sólidas.",
    ],
  },
  {
    icon: Rocket,
    color: "text-amber-400",
    bgGradient: "from-amber-500/10 to-amber-600/5",
    borderColor: "border-amber-500/20",
    name: "Elon Musk",
    subtitle: "El visionario del 8",
    highlight: "8 = Dinero & Transformación",
    points: [
      "Nació el 28 de junio de 1971 → 2+8+6+1+9+7+1 = 34 → 3+4 = 7 (el visionario).",
      "Compró Twitter por USD 44.000 millones → 4+4 = 8, el número del dinero.",
      "La oferta fue el 25 de abril de 2022 → 2+5+4+2+0+2+2 = 17 → 1+7 = 8.",
      "El check azul costó USD 8 al mes — el 8 directo.",
    ],
  },
  {
    icon: Award,
    color: "text-sky-400",
    bgGradient: "from-sky-500/10 to-sky-600/5",
    borderColor: "border-sky-500/20",
    name: "Nikola Tesla",
    subtitle: "El genio del 28",
    highlight: "28 = Innovación & Genio",
    points: [
      "Nació el 10 de julio de 1856 → 7+1+0+1+8+5+6 = 28.",
      "Tesla Motors, fundada en su honor, comparte esa impronta en su fundador.",
      "Un ejemplo de cómo el 28 aparece en figuras de genio y construcción.",
    ],
  },
];

const NOTE = [
  {
    icon: Calculator,
    color: "text-accent",
    bg: "bg-accent/10",
    borderColor: "border-accent/30",
    title: "¿Coincidencia o patrón?",
    desc: "Ninguno de estos cálculos prueba que el número cause el éxito. Pero sí muestran algo que la numerología siempre señaló: las personas que construyen a gran escala tienden a vivir rodeadas de las cifras que simbolizan poder y dinero.",
    link: { href: "/blog/numeros-del-poder-28-y-8", label: "Leer el análisis completo" },
  },
];

export default function FamousNumerologyCases() {
  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-8 bg-gradient-to-b from-background via-ink/2 to-background border-t border-b border-ink/10">
      <div className="mx-auto max-w-7xl">
        {/* Header mejorado */}
        <motion.div {...fadeUp} className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent font-bold">
              Casos reales en números
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground font-bold tracking-tight mb-4">
            Los números que transformaron el mundo
          </h2>
          <p className="text-sm sm:text-base text-muted max-w-3xl mx-auto leading-relaxed">
            Los mismos planteos que ves en tu mapa —como el 28 del dinero y el 8 del poder— aparecen en las fechas 
            y decisiones de figuras que construyeron imperios. No es magia: es un patrón que la numerología lee hace siglos.
          </p>
        </motion.div>

        {/* Grid de casos con mejor jerarquía */}
        <motion.div {...staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-12">
          {CASES.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.name}
                {...staggerItem}
                className={`group p-6 rounded-xl bg-gradient-to-br ${c.bgGradient} border ${c.borderColor} hover:border-accent/40 transition-all duration-300 flex flex-col hover:shadow-lg hover:shadow-accent/10`}
              >
                {/* Icon + Highlight */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg bg-background/50 flex items-center justify-center group-hover:bg-accent/10 transition-colors`}>
                    <Icon className={`w-5 h-5 ${c.color}`} />
                  </div>
                  <span className={`text-xs font-heading font-bold ${c.color} tracking-wider px-2 py-1 rounded bg-background/50`}>
                    {c.highlight}
                  </span>
                </div>

                {/* Name + Subtitle */}
                <h3 className="font-heading text-lg font-bold text-foreground mb-1 group-hover:text-accent transition-colors">
                  {c.name}
                </h3>
                <p className="text-xs text-accent font-semibold mb-4">{c.subtitle}</p>

                {/* Points */}
                <div className="space-y-2 flex-1 mb-4">
                  {c.points.map((point, idx) => (
                    <p key={idx} className="text-xs text-muted leading-relaxed">
                      • {point}
                    </p>
                  ))}
                </div>

                {/* CTA subtle */}
                <Link
                  href="/blog/numeros-del-poder-28-y-8"
                  className="text-xs font-semibold text-accent hover:text-accent/80 transition-colors inline-flex items-center gap-1 group/link"
                >
                  <span>Ver análisis</span>
                  <span className="group-hover/link:translate-x-0.5 transition-transform">→</span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Note contextual con mejor diseño */}
        <motion.div {...fadeUpDelayed(0.2)} className="max-w-3xl mx-auto">
          {NOTE.map((note, idx) => {
            const NoteIcon = note.icon;
            return (
              <div
                key={idx}
                className={`p-6 sm:p-8 rounded-xl border ${note.borderColor} bg-gradient-to-br ${note.bg} hover:border-accent/50 transition-all`}
              >
                <div className="flex gap-4">
                  <NoteIcon className={`w-6 h-6 ${note.color} shrink-0 mt-1`} />
                  <div className="flex-1">
                    <h4 className={`font-heading text-lg font-bold ${note.color} mb-2`}>
                      {note.title}
                    </h4>
                    <p className="text-sm text-muted leading-relaxed mb-4">
                      {note.desc}
                    </p>
                    <Link
                      href={note.link.href}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent/80 transition-colors group"
                    >
                      <span>{note.link.label}</span>
                      <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
