"use client";

import { motion } from "framer-motion";
import Section from "@/components/ui/Section";

const steps = [
  { number: "01", title: "Descubrí", description: "Creá tu perfil" },
  { number: "02", title: "Entendé", description: "Conocé tu mapa" },
  { number: "03", title: "Explorá", description: "Descubrí tus patrones" },
  { number: "04", title: "Conectá", description: "Compará con el mundo" },
  { number: "05", title: "Reflexioná", description: "Tomá perspectiva" },
];

export default function Journey() {
  return (
    <Section>
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Un recorrido en cinco pasos
      </h2>
      <p className="text-muted text-center max-w-xl mx-auto mb-12">
        De tu fecha de nacimiento a una lectura completa de identidad, patrones y conexiones.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {steps.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="text-center"
          >
            <div className="text-4xl font-mono text-accent font-bold">{step.number}</div>
            <h3 className="text-xl font-bold mt-2">{step.title}</h3>
            <p className="text-muted text-sm">{step.description}</p>
            {i < steps.length - 1 && (
              <div className="hidden md:block h-0.5 w-full bg-accent/20 mt-6" />
            )}
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
