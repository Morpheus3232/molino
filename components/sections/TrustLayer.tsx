"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lock, Code2, DollarSign, Github } from "lucide-react";
import Link from "next/link";

interface TrustPoint {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const trustPoints: TrustPoint[] = [
  {
    icon: <Lock className="w-6 h-6" />,
    title: "100% Local",
    description: "Cada cálculo ocurre en tu navegador. Tu fecha de nacimiento nunca sale de tu CPU.",
  },
  {
    icon: <Code2 className="w-6 h-6" />,
    title: "Open Source",
    description: "Código MIT disponible en GitHub. Auditá, verificá, usa donde quieras.",
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "Justo",
    description: "$8 único, para siempre. Premium incluido. Sin suscripciones ocultas.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

export default function TrustLayer() {
  return (
    <section className="relative py-20 sm:py-32 px-4 sm:px-8 bg-gradient-to-b from-ink to-ink/95 overflow-hidden border-t border-accent/10">
      <div className="max-w-5xl mx-auto">
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
              Arquitectura
            </p>
          </motion.div>

          <motion.h2 variants={itemVariants} className="font-display font-normal normal-case tracking-tight text-paper mb-6 leading-[1.05] text-[clamp(2.5rem,5vw,4rem)]">
            Privacidad <em className="text-gradient-warm-dark">por diseño.</em>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-paper/70 leading-relaxed max-w-3xl mx-auto font-light"
          >
            No es una promesa. Es cómo está construido.
          </motion.p>
        </motion.div>

        {/* Trust Points Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
        >
          {trustPoints.map((point, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="group p-8 rounded-2xl bg-gradient-to-br from-accent/5 to-accent/2 border border-accent/10 group-hover:border-accent/25 transition-all duration-300 space-y-5"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 text-accent group-hover:bg-accent/15 transition-colors">
                {point.icon}
              </div>

              {/* Title */}
              <h3 className="font-display italic font-normal normal-case text-2xl text-paper">
                {point.title}
              </h3>

              {/* Description */}
              <p className="text-paper/70 leading-relaxed text-sm">
                {point.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="text-center text-xs text-paper/50 max-w-2xl mx-auto mb-16"
        >
          * El cálculo del mapa es 100% local. Premium y las interpretaciones con IA guardan un hash irreversible de tu perfil —nunca tu fecha en claro— según nuestra{" "}
          <Link href="/privacidad" className="underline hover:text-paper/80">
            política de privacidad
          </Link>
          .
        </motion.p>

        {/* CTA to GitHub */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-16 text-center"
        >
          <Link
            href="https://github.com/Morpheus3232/molino"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-accent text-ink font-heading font-bold uppercase tracking-[0.1em] text-sm transition-all duration-200 hover:bg-accent/90 hover:shadow-[0_0_20px_rgba(154,74,24,0.3)] group"
          >
            <Github className="w-5 h-5" />
            Ver código en GitHub
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
