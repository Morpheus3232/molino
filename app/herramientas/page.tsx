"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp, fadeUpDelayed } from "@/lib/utils/motion";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";

const TOOLS = [
  {
    title: "Camino de Vida",
    subtitle: "Numerolog\u00eda",
    description: "Calcul\u00e1 tu n\u00famero de Camino de Vida a partir de tu fecha de nacimiento. Descubr\u00ed qu\u00e9 energ\u00eda central ten\u00e9s seg\u00fan la tradici\u00f3n numerol\u00f3gica.",
    href: "/herramientas/camino-de-vida",
    icon: "\ud83d\udd22",
    color: "var(--element-fire)",
  },
  {
    title: "Signo Solar",
    subtitle: "Astrolog\u00eda",
    description: "Descubr\u00ed tu signo zodiacal solar, su elemento y modalidad a partir de tu fecha de nacimiento.",
    href: "/herramientas/signo-solar",
    icon: "\u2b50",
    color: "var(--layer-astrology)",
  },
  {
    title: "Zodiaco Chino",
    subtitle: "Calendario chino",
    description: "Tu animal, elemento y posici\u00f3n en el ciclo sexagenario. Un sistema de m\u00e1s de 2000 a\u00f1os.",
    href: "/herramientas/zodiaco-chino",
    icon: "\ud83d\udc09",
    color: "var(--layer-moment)",
  },
  {
    title: "Compatibilidad",
    subtitle: "Simbolog\u00eda cruzada",
    description: "Calcul\u00e1 la compatibilidad simb\u00f3lica entre dos perfiles usando el zodiaco chino y la numerolog\u00eda.",
    href: "/herramientas/compatibilidad",
    icon: "\u2726",
    color: "var(--score-good)",
  },
];

export default function HerramientasPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />
      <main className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">

        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-4">Herramientas</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1]">
            Calcul\u00e1 tu identidad
          </h1>
          <p className="text-base sm:text-lg text-muted mt-6 max-w-xl leading-relaxed">
            Sin registro. Sin guardar datos. Resultado inmediato.
          </p>
        </motion.section>

        <div className="space-y-4">
          {TOOLS.map((tool, i) => (
            <motion.button
              key={tool.href}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              onClick={() => router.push(tool.href)}
              className="w-full text-left p-6 sm:p-8 rounded-xl border border-border bg-card hover:border-accent hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-5">
                <span className="text-3xl shrink-0">{tool.icon}</span>
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-medium mb-1" style={{ color: tool.color }}>
                    {tool.subtitle}
                  </p>
                  <h2 className="font-serif text-xl sm:text-2xl font-semibold text-foreground group-hover:text-accent transition-colors">
                    {tool.title}
                  </h2>
                  <p className="text-sm text-muted mt-2 leading-relaxed max-w-lg">
                    {tool.description}
                  </p>
                </div>
                <span className="text-sm text-muted group-hover:text-accent transition-colors mt-2 shrink-0 hidden sm:block">
                  Calcular &rarr;
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.section {...fadeUpDelayed(0.15)} className="mt-16 sm:mt-20 text-center">
          <div className="w-8 h-px bg-border mx-auto mb-6" />
          <p className="text-sm text-muted max-w-md mx-auto">
            Estas herramientas son gratuitas y no guardan tus datos. Si quer\u00e9s una experiencia completa y personalizada, cre\u00e1 tu perfil en Molino.
          </p>
          <button
            type="button"
            onClick={() => router.push("/onboarding")}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all px-6 py-3 text-sm bg-primary text-primary-foreground shadow-sm hover:bg-accent hover:text-accent-foreground min-h-[44px]"
          >
            Crear mi perfil
          </button>
        </motion.section>

      </main>
      <UniversityFooter />
    </div>
  );
}
