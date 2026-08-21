"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, BookOpen, Users, Target, Globe, Download } from "lucide-react";
import Link from "next/link";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

const features: Feature[] = [
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Energía del Día",
    description: "Tu vibración personal, actualizada cada 24 horas. Ciclos numerológicos y astrales.",
    href: "/hoy",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Journal",
    description: "Registra patrones. Identifica tendencias. Conecta decisiones con ciclos.",
    href: "/journal",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Compatibilidad",
    description: "Comprende relaciones via datos. Perfiles duales, sinergia arcetípica.",
    href: "/pareja",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Timing",
    description: "Ventanas óptimas para decisiones. Calendario de ciclos anuales.",
    href: "/calendario",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Atlas",
    description: "Afinidades simbólicas. Marcas, ciudades, equipos, países. Tú + mundo.",
    href: "/atlas",
  },
  {
    icon: <Download className="w-6 h-6" />,
    title: "Export",
    description: "Tu mapa como PNG. Compartible, auditable. 100% tuyo.",
    href: "/profile",
  },
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
              ¿Qué incluye?
            </p>
          </motion.div>

          <motion.h2 variants={itemVariants} className="font-display text-5xl sm:text-6xl font-bold tracking-tight text-paper mb-6 leading-tight">
            Seis herramientas para tu autoconocimiento.
          </motion.h2>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <Link href={feature.href}>
                <div className="group relative h-full p-8 rounded-2xl bg-gradient-to-br from-paper/10 to-paper/5 border border-accent/10 hover:border-accent/25 transition-all duration-300 cursor-pointer space-y-5 hover:bg-gradient-to-br hover:from-paper/15 hover:to-paper/10">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 text-accent group-hover:bg-accent/15 transition-colors">
                    {feature.icon}
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-xl font-bold text-paper group-hover:text-accent transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-paper/70 leading-relaxed font-light text-sm">
                    {feature.description}
                  </p>

                  {/* Arrow indicator */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent text-lg group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
