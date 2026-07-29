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

        {/* Desktop: horizontal 5-column grid */}
        <div className="hidden lg:flex flex-wrap border-t border-ink/10">
          {steps.map((step, i) => (
            <motion.button
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              onClick={() => router.push(step.href)}
              className={`group flex-1 flex flex-col ${cellPad} ${i < steps.length - 1 ? "border-r border-ink/10" : ""} border-b border-ink/10 text-left hover:bg-accent/5 transition-colors`}
            >
              <p className="font-display text-6xl text-accent mb-4 leading-none">{step.number}</p>
              <h3 className="font-display text-2xl text-foreground mb-3 leading-tight">{step.title}</h3>
              <p className="text-sm text-muted leading-relaxed flex-1">{step.description}</p>
              <span className="inline-flex items-center gap-1 text-xs font-mono tracking-wider text-accent mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                {step.title === "DESCUBRÍ" ? "EMPEZÁ AHORA" : "VER MÁS"} →
              </span>
            </motion.button>
          ))}
        </div>

        {/* Tablet: 3+2 row grid */}
        <div className="hidden md:flex lg:hidden flex-wrap border-t border-ink/10">
          {steps.map((step, i) => (
            <motion.button
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              onClick={() => router.push(step.href)}
              className={`group w-1/2 ${i === 4 ? "w-full" : ""} flex flex-col ${cellPad} ${i % 2 === 0 && i < 4 ? "border-r border-ink/10" : ""} border-b border-ink/10 text-left hover:bg-accent/5 transition-colors`}
            >
              <p className="font-display text-5xl text-accent mb-3 leading-none">{step.number}</p>
              <h3 className="font-display text-xl text-foreground mb-2 leading-tight">{step.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{step.description}</p>
            </motion.button>
          ))}
        </div>

        {/* Mobile: vertical list */}
        <div className="md:hidden border-t border-ink/10">
          {steps.map((step, i) => (
            <motion.button
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              onClick={() => router.push(step.href)}
              className="group w-full text-left flex items-start gap-5 py-7 px-0 border-b border-ink/10 hover:bg-accent/5 transition-colors"
            >
              <p className="font-display text-4xl text-accent leading-none shrink-0 w-14">{step.number}</p>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg text-foreground mb-1">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{step.description}</p>
              </div>
              <span className="text-accent text-sm mt-1 shrink-0">→</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}