"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Hash, Sun, Moon } from "lucide-react";

const systems = [
  { icon: Hash, title: "Numerología", subtitle: "Los números", description: "Tu estructura interior" },
  { icon: Sun, title: "Astrología", subtitle: "El cielo", description: "Tu momento de nacimiento" },
  { icon: Moon, title: "Zodíaco Chino", subtitle: "Los ciclos", description: "Tu energía en el tiempo" },
];

const colBorder = "border-accent/10";
const cellPad = "p-8 sm:p-10 lg:p-12";

export default function SystemsPreview() {
  const router = useRouter();

  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="mx-auto max-w-8xl px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 sm:mb-16"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium mb-4">Sistemas simbólicos</p>
          <h2 className="font-heading uppercase text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-[1.1]">
            Una misma persona.<br />Tres formas de observarla.
          </h2>
        </motion.div>

        <div className="flex flex-wrap border-t border-accent/10">
          {systems.map((system, i) => (
            <motion.div
              key={system.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`w-full md:w-1/3 ${cellPad} flex flex-col items-start md:border-r ${colBorder} border-b ${colBorder} ${i === systems.length - 1 ? "md:border-r-0" : ""}`}
            >
              <system.icon className="w-8 h-8 text-accent mb-5" />
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-2">{system.subtitle}</p>
              <h3 className="font-heading uppercase text-xl sm:text-2xl font-semibold text-foreground mb-3">{system.title}</h3>
              <p className="text-sm sm:text-base text-muted leading-relaxed flex-1">{system.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-center pt-12"
        >
          <button
            type="button"
            onClick={() => router.push("/explore")}
            className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-white font-medium rounded-none hover:bg-accent/90 transition-colors"
          >
            Explorar sistemas →
          </button>
        </motion.div>
      </div>
    </section>
  );
}
