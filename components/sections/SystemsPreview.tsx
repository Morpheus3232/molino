"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const systems = [
  {
    micro: "LOS NÚMEROS",
    title: "NUMEROLOGÍA",
    description: "Tu estructura interior revelada a través de los números de tu fecha de nacimiento.",
    href: "/conocimiento/numerologia",
  },
  {
    micro: "EL CIELO",
    title: "ASTROLOGÍA",
    description: "Tu momento de nacimiento en el mapa celeste y la posición de los astros.",
    href: "/conocimiento/astrologia",
  },
  {
    micro: "LOS CICLOS",
    title: "ZODÍACO CHINO",
    description: "Tu energía en el tiempo, según la sabiduría ancestral de los ciclos animales.",
    href: "/conocimiento/zodiaco-chino",
  },
];

const cellPad = "p-8 sm:p-10 lg:p-14";

export default function SystemsPreview() {
  const router = useRouter();

  return (
    <section className="section-paper-alt">
      <div className="mx-auto max-w-8xl px-5 sm:px-8 lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`${cellPad} px-0`}
        >
          <p className="eyebrow-brutalist mb-4">SISTEMAS SIMBÓLICOS</p>
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[0.9] tracking-tight">
            UNA MISMA PERSONA.
            <br />
            TRES FORMAS DE OBSERVARLA.
          </h2>
        </motion.div>

        {/* Three-column grid with border dividers */}
        <div className="flex flex-wrap border-t border-ink/10">
          {systems.map((system, i) => (
            <motion.div
              key={system.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`w-full md:w-1/3 flex flex-col ${i < 2 ? "md:border-r border-ink/10" : ""} ${i < systems.length - 1 ? "border-b md:border-b-0 border-ink/10" : ""}`}
            >
              <div className={`flex-1 ${cellPad}`}>
                <p className="font-mono text-xs text-accent font-semibold tracking-[0.25em] mb-6">
                  {system.micro}
                </p>
                <h3 className="font-display text-4xl sm:text-5xl text-foreground leading-[0.9] mb-5">
                  {system.title}
                </h3>
                <p className="text-sm sm:text-base text-muted leading-relaxed mb-8">
                  {system.description}
                </p>
                <button
                  type="button"
                  onClick={() => router.push(system.href)}
                  className="group inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-[0.15em] uppercase text-accent hover:text-accent/80 transition-colors"
                >
                  LEER MÁS
                  <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">→</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}