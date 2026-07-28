"use client";

import { motion } from "framer-motion";
import Section from "@/components/ui/Section";

const systems = [
  {
    icon: "🔢",
    title: "Numerología",
    subtitle: "Los números",
    description: "Tu estructura interior",
  },
  {
    icon: "🌌",
    title: "Astrología",
    subtitle: "El cielo",
    description: "Tu momento de nacimiento",
  },
  {
    icon: "🐉",
    title: "Zodíaco Chino",
    subtitle: "Los ciclos",
    description: "Tu energía en el tiempo",
  },
];

export default function SystemsPreview() {
  return (
    <Section className="bg-white">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Una misma persona.<br />Tres formas de observarla.
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {systems.map((system, i) => (
          <motion.div
            key={system.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="text-center"
          >
            <div className="text-4xl mb-4">{system.icon}</div>
            <h3 className="text-2xl font-bold">{system.title}</h3>
            <p className="text-accent font-medium">{system.subtitle}</p>
            <p className="text-muted mt-2">{system.description}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
