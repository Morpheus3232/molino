"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Apple, Briefcase, Rocket, Award, Calculator } from "lucide-react";
import { fadeUp } from "@/lib/utils/motion";

const CASES = [
  {
    icon: Apple,
    color: "text-neutral-200",
    bg: "bg-neutral-500/10",
    name: "Steve Jobs",
    subtitle: "El patrón del 28",
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
    bg: "bg-emerald-500/10",
    name: "Bill Gates",
    subtitle: "El constructor del 28",
    points: [
      "Nació el 28 de octubre de 1955 → nació un día 28.",
      "Su fecha completa → 1+0+2+8+1+9+5+5 = 31 → 3+1 = 4 (el constructor).",
      "El 28 reduce a 1 (el líder); el 4 es la estructura. La lectura: edificar bases sólidas.",
    ],
  },
  {
    icon: Rocket,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    name: "Elon Musk",
    subtitle: "El visionario del 8",
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
    bg: "bg-sky-500/10",
    name: "Nikola Tesla",
    subtitle: "El genio del 28",
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
    title: "¿Coincidencia o patrón?",
    desc: "Ninguno de estos cálculos prueba que el número cause el éxito. Pero sí muestran algo que la numerología siempre señaló: las personas que construyen a gran escala tienden a vivir rodeadas de las cifras que simbolizan poder y dinero.",
    link: { href: "/blog/numeros-del-poder-28-y-8", label: "Leer el análisis completo" },
  },
];

export default function FamousNumerologyCases() {
  return (
    <section className="border-t border-ink/10 py-14 sm:py-20 bg-ink/[0.015]">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
            Casos reconocidos
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-foreground font-bold tracking-tight mt-2">
            Personajes reales, números que se repiten
          </h2>
          <p className="text-sm sm:text-base text-muted leading-relaxed mt-3">
            Los mismos planteos que ves en tu mapa —como el 28 del dinero y el 8 del poder— aparecen en
            las fechas y decisiones de figuras que construyeron imperios. No es magia: es un patrón que la
            numerología lee hace siglos, y que estos ejemplos hacen visible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {CASES.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="p-5 rounded-2xl bg-card border border-ink/10 hover:border-accent/30 transition-colors flex flex-col"
            >
              <div className={`w-9 h-9 rounded-xl ${c.bg} ${c.color} flex items-center justify-center mb-3`}>
                <c.icon className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-heading text-base font-bold text-foreground">{c.name}</h3>
              <p className="text-xs font-mono text-accent mb-3">{c.subtitle}</p>
              <ul className="space-y-2 text-xs text-muted leading-relaxed flex-1">
                {c.points.map((p) => (
                  <li key={p.slice(0, 24)} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 shrink-0 rounded-full bg-accent/50" aria-hidden="true" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
        >
          {NOTE.map((f) => (
            <motion.div
              key={f.title}
              className="p-5 rounded-2xl bg-ink/[0.02] border border-ink/10 flex flex-col sm:flex-row sm:items-center gap-4 sm:col-span-2 justify-between"
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl ${f.bg} ${f.color} flex items-center justify-center shrink-0`}>
                  <f.icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-heading text-sm sm:text-base font-bold text-foreground">{f.title}</h3>
                  <p className="text-xs text-muted leading-relaxed mt-1">{f.desc}</p>
                </div>
              </div>
              <Link
                href={f.link.href}
                className="shrink-0 inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-ink/5 hover:bg-ink/10 border border-ink/10 text-foreground font-heading text-xs uppercase tracking-wider font-semibold transition-colors"
              >
                {f.link.label}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
