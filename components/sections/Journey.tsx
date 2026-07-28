"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserPlus, Compass, Sparkles, Globe, BookOpen } from "lucide-react";
import Section from "@/components/ui/Section";

const steps = [
  { number: "01", title: "Descubrí", description: "Creá tu perfil con tu fecha de nacimiento.", cta: "Empezá ahora", href: "/onboarding", icon: UserPlus },
  { number: "02", title: "Entendé", description: "Conocé tu mapa de numerología, zodíaco y astrología.", cta: "Conocé tu perfil", href: "/profile", icon: Compass },
  { number: "03", title: "Explorá", description: "Descubrí patrones, ciclos y sincronías ocultas.", cta: "Empezá la exploración", href: "/explore", icon: Sparkles },
  { number: "04", title: "Conectá", description: "Compará tu perfil con países, ciudades y marcas.", cta: "Encontrá conexiones", href: "/affinity", icon: Globe },
  { number: "05", title: "Reflexioná", description: "Tomá perspectiva con tu lectura completa.", cta: "Descubrí más", href: "/biblioteca", icon: BookOpen },
];

export default function Journey() {
  const router = useRouter();

  return (
    <Section>
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Un recorrido en cinco pasos
      </h2>
      <p className="text-muted text-center max-w-xl mx-auto mb-12">
        De tu fecha de nacimiento a una lectura completa de identidad, patrones y conexiones.
      </p>

      <div className="hidden md:flex items-stretch gap-0 relative">
        {steps.map((step, i) => (
          <motion.button
            key={step.number}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            onClick={() => router.push(step.href)}
            className="group flex-1 flex flex-col p-6 border-l border-t border-b border-transparent hover:border-accent/30 first:border-l-0 transition-all duration-300 hover:-translate-y-1 relative"
          >
            {i < steps.length - 1 && (
              <div className="absolute top-1/3 -right-3 w-6 border-t border-dashed border-accent/20 z-10" />
            )}
            <step.icon className="w-8 h-8 text-accent mb-5" />
            <p className="font-mono text-4xl text-accent font-bold mb-2 group-hover:text-accent transition-colors">
              {step.number}
            </p>
            <h3 className="font-heading uppercase text-xl font-semibold text-foreground mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-muted leading-relaxed mb-4 flex-1">
              {step.description}
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-mono tracking-wider text-accent opacity-0 group-hover:opacity-100 transition-all duration-200">
              {step.cta} →
            </span>
          </motion.button>
        ))}
      </div>

      <div className="md:hidden space-y-0">
        {steps.map((step, i) => (
          <motion.button
            key={step.number}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            onClick={() => router.push(step.href)}
            className="group w-full text-left py-7 pl-10 border-l-2 border-dashed border-accent/20 hover:border-accent transition-colors relative"
          >
            <span className="absolute -left-4 w-8 h-8 bg-white flex items-center justify-center">
              <step.icon className="w-5 h-5 text-accent" />
            </span>
            <p className="font-mono text-3xl text-accent font-bold mb-1">
              {step.number}
            </p>
            <h3 className="font-heading uppercase text-lg font-semibold text-foreground mb-1">
              {step.title}
            </h3>
            <p className="text-sm text-muted mb-2">
              {step.description}
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-mono tracking-wider text-accent opacity-0 group-hover:opacity-100 transition-all duration-200">
              {step.cta} →
            </span>
          </motion.button>
        ))}
      </div>
    </Section>
  );
}
