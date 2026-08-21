"use client";

import { motion } from "framer-motion";
import { fadeUp, fadeUpDelayed, staggerContainer, staggerItem } from "@/lib/utils/motion";
import Link from "next/link";
import { Heart, Zap, Compass, ArrowRight } from "lucide-react";

interface UseCase {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  example: string;
  color: string;
  href: string;
}

const useCases: UseCase[] = [
  {
    icon: Heart,
    title: "Entender tu Pareja",
    description: "Descubrí por qué chocas en ciertos momentos y cuáles son tus ciclos de armonía.",
    example: '"Sabemos cuándo somos complementarios y cuándo necesitamos espacio."',
    color: "text-rose-400",
    href: "/pareja",
  },
  {
    icon: Zap,
    title: "Decidir Timing",
    description: "Elige cuándo iniciar proyectos, cambios importantes o cerrar etapas.",
    example: '"Lancé mi negocio en mi año — fue perfecto."',
    color: "text-amber-400",
    href: "/calendario",
  },
  {
    icon: Compass,
    title: "Autoconocimiento",
    description: "Entiende tus patrones, tensiones naturales y cómo es tu ciclo personal.",
    example: '"Por fin entiendo por qué repito ciertos patrones."',
    color: "text-cyan-400",
    href: "/profile",
  },
];

export default function UseCasesSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-8 bg-ink/3 border-t border-b border-ink/10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div {...fadeUp} className="text-center mb-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-bold mb-3">
            Cómo lo usan
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Úsalo para lo que importa
          </h2>
          <p className="text-sm text-muted mt-3 max-w-2xl mx-auto">
            Molino te da herramientas para entender patrones reales en tu vida.
          </p>
        </motion.div>

        {/* Use Cases Grid */}
        <motion.div
          {...staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-6"
        >
          {useCases.map((useCase, i) => {
            const Icon = useCase.icon;
            return (
              <motion.div key={i} {...staggerItem}>
                <Link
                  href={useCase.href}
                  className="group p-6 sm:p-7 rounded-lg bg-card border border-ink/10 hover:border-accent/40 transition-all h-full flex flex-col hover:shadow-md"
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-lg bg-background/50 flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors`}>
                    <Icon className={`w-5 h-5 ${useCase.color}`} />
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {useCase.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted leading-relaxed mb-4 flex-1">
                    {useCase.description}
                  </p>

                  {/* Example Quote */}
                  <div className="p-3 rounded-md bg-background/40 border border-ink/5 mb-4">
                    <p className="text-xs text-muted/80 italic leading-relaxed">
                      {useCase.example}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-1 text-xs font-semibold text-accent group-hover:gap-2 transition-all">
                    <span>Explorar</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          {...fadeUpDelayed(0.3)}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted mb-4">
            O descubrí todas las formas de usar tu mapa
          </p>
          <Link
            href="/affinity"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent/10 border border-accent/30 hover:bg-accent/20 transition-all font-semibold text-sm text-accent group"
          >
            <span>Ver Afinidades Completas</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
