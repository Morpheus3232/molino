"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, Users, Target } from "lucide-react";
import Link from "next/link";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

// CORE: lo que sostiene el mapa personal (mismo criterio que Fase 3 de la
// auditoría — mapa / ciclos / afinidades). El resto es ecosistema: útil,
// pero no debería competir en peso visual con el núcleo del producto.
const coreFeatures: Feature[] = [
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Hoy",
    description: "Tu vibración del día, actualizada cada 24 horas. Ciclos numerológicos y astrales.",
    href: "/hoy",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Ciclos",
    description: "Ventanas óptimas para decisiones. Tu calendario de ciclos personales.",
    href: "/calendario",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Afinidades",
    description: "Cómo tu mapa se conecta con otra persona, o con lugares y marcas.",
    href: "/pareja",
  },
];

const ecosystemLinks: { title: string; href: string }[] = [
  { title: "Journal", href: "/journal" },
  { title: "Atlas", href: "/atlas" },
  { title: "Exportar tu mapa", href: "/profile" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function FeaturesSection() {
  return (
    <section className="relative py-20 sm:py-32 px-4 sm:px-8 bg-ink overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mb-20 text-center"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent font-semibold">
              Tu mapa, en movimiento
            </p>
          </motion.div>

          <motion.h2 variants={itemVariants} className="font-display font-normal normal-case tracking-tight text-paper mb-6 leading-[1.05] text-[clamp(2.5rem,5vw,4rem)]">
            El mapa no es estático.{" "}
            <em className="text-gradient-warm-dark">Se actualiza con la fecha y el ciclo.</em>
          </motion.h2>
        </motion.div>

        {/* Core Grid — 3 capacidades de un mismo sistema, no 3 productos */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-paper/10 border-y border-paper/10"
        >
          {coreFeatures.map((feature, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <Link href={feature.href} className="group block h-full p-8 md:p-10 space-y-4 transition-colors duration-300 hover:bg-paper/[0.03]">
                <div className="text-accent">
                  {feature.icon}
                </div>

                <h3 className="font-display italic font-normal normal-case text-2xl text-paper">
                  {feature.title}
                </h3>

                <p className="text-paper/70 leading-relaxed text-sm">
                  {feature.description}
                </p>

                <span className="inline-flex items-center gap-1 font-mono text-xs text-accent-light opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Explorar →
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Ecosistema — accesible, sin competir en peso con el core */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mt-10 pt-8 border-t border-paper/10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/40">
            También en tu mapa:
          </span>
          {ecosystemLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-paper/60 hover:text-accent-light transition-colors underline-offset-4 hover:underline"
            >
              {link.title}
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
