"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const steps = [
  { number: "01", title: "DESCUBRÍ", description: "Creá tu mapa con tu fecha de nacimiento. Sin registro, al instante.", href: "/onboarding" },
  { number: "02", title: "ENTENDÉ", description: "Conocé tu mapa de numerología, zodíaco y astrología en un solo lugar.", href: "/profile" },
  { number: "03", title: "EXPLORÁ", description: "Descubrí patrones, ciclos y sincronías ocultas en tu perfil.", href: "/explore" },
  { number: "04", title: "CONECTÁ", description: "Compará tu perfil con países, ciudades y marcas que resuenan con vos.", href: "/affinity" },
  { number: "05", title: "REFLEXIONÁ", description: "Tomá perspectiva con tu lectura completa de todos los sistemas.", href: "/biblioteca" },
];

const cellPad = "p-8 sm:p-10 lg:p-14";

export default function Journey() {
  const router = useRouter();

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-8xl px-5 sm:px-8 lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`${cellPad} px-0`}
        >
          <p className="eyebrow-brutalist mb-4">RECORRIDO</p>
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[0.9] tracking-tight">
            CINCO PASOS
            <br />
            HACIA ADENTRO.
          </h2>
          <p className="text-sm sm:text-base text-muted mt-4 max-w-xl leading-relaxed">
            De tu fecha de nacimiento a una lectura completa de identidad, patrones y conexiones.
          </p>
        </motion.div>

        {/* Single responsive grid: 1 col mobile, 2 cols tablet, 5 cols desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border-t border-ink/10">
          {steps.map((step, i) => (
            <motion.button
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              onClick={() => router.push(step.href)}
              className={`group flex flex-col ${cellPad} ${
                i < steps.length - 1 ? "border-b sm:border-r border-ink/10" : "border-b border-ink/10"
              } text-left hover:bg-accent/5 transition-colors`}
            >
              <p className="font-display text-4xl sm:text-5xl lg:text-6xl text-accent mb-3 sm:mb-4 leading-none">{step.number}</p>
              <h3 className="font-display text-lg sm:text-xl lg:text-2xl text-foreground mb-2 sm:mb-3 leading-tight">{step.title}</h3>
              <p className="text-sm text-muted leading-relaxed flex-1">{step.description}</p>
              <span
                className="inline-flex items-center gap-1 text-xs font-mono tracking-wider text-accent mt-4 sm:mt-6 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={step.title === "DESCUBRÍ" ? "Empezar ahora: ir al onboarding" : `Ver más sobre ${step.title.toLowerCase()}`}
              >
                {step.title === "DESCUBRÍ" ? "EMPEZÁ AHORA" : "VER MÁS"} →
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}