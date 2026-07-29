"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Hash, Sun, Moon } from "lucide-react";

const systems = [
  { icon: Hash, title: "Numerología", subtitle: "Los números", description: "Tu estructura interior", href: "/conocimiento/numerologia" },
  { icon: Sun, title: "Astrología", subtitle: "El cielo", description: "Tu momento de nacimiento", href: "/conocimiento/astrologia" },
  { icon: Moon, title: "Zodíaco Chino", subtitle: "Los ciclos", description: "Tu energía en el tiempo", href: "/conocimiento/zodiaco-chino" },
];

const cellPad = "p-8 sm:p-10 lg:p-12";

export default function SystemsPreview() {
  const router = useRouter();

  return (
    <section className="py-20 sm:py-24 bg-cream">
      <div className="mx-auto max-w-8xl px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 sm:mb-16"
        >
          <div className="w-8 h-0.5 bg-accent mb-6" />
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium mb-4">Sistemas simbólicos</p>
          <h2 className="font-heading uppercase text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-[1.1]">
            Una misma persona.<br />Tres formas de observarla.
          </h2>
        </motion.div>

        <div className="flex flex-wrap">
          {systems.map((system, i) => (
            <motion.div
              key={system.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="w-full md:w-1/3 flex flex-col"
            >
              <div className={`flex-1 ${cellPad} ${i < 2 ? "md:border-r border-accent/10" : ""} ${i < systems.length - 1 ? "border-b md:border-b-0 border-accent/10" : ""}`}>
                <system.icon className="w-8 h-8 text-accent mb-6" />
                <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-2">{system.subtitle}</p>
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-3 leading-tight">{system.title}</h3>
                <p className="text-sm sm:text-base text-muted leading-relaxed mb-6">{system.description}</p>
                <button
                  type="button"
                  onClick={() => router.push(system.href)}
                  className="group inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                >
                  Leer más
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
