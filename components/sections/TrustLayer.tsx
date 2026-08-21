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

          <motion.h2 variants={itemVariants} className="font-display text-5xl sm:text-6xl font-bold tracking-tight text-paper mb-6 leading-tight">
            Privacidad por diseño.
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
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
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
              <h3 className="font-heading text-xl font-bold text-paper">
                {point.title}
              </h3>

              {/* Description */}
              <p className="text-paper/70 leading-relaxed font-light">
                {point.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Details Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-paper/5 to-paper/2 border border-accent/15 space-y-8"
        >
          <div className="space-y-4">
            <h3 className="font-heading text-2xl font-bold text-paper">Cómo funciona</h3>
            <p className="text-paper/70 leading-relaxed font-light">
              Molino es una aplicación web que corre 100% en tu navegador. Los motores de cálculo (numerología, astrología, zodíaco chino) se ejecutan localmente usando Web Workers. Tu fecha de nacimiento se procesa en tu CPU y nunca se transmite a ningún servidor.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-y border-accent/10">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent/60 mb-2">Ingresás</p>
              <p className="font-light text-paper/80">Tu fecha de nacimiento</p>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-accent font-bold">→</span>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent/60 mb-2">Se procesa</p>
              <p className="font-light text-paper/80">En tu navegador (Web Workers)</p>
            </div>
            <div className="col-span-full sm:col-span-1">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent/60 mb-2">Resultado</p>
              <p className="font-light text-paper/80">Tu mapa, guardado localmente (localStorage)</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent/60">Premium e IA (opcional)</p>
            <p className="text-paper/70 leading-relaxed font-light text-sm">
              Si activás Premium ($8) o IA integrada, se envía un hash criptográfico de tu perfil a MercadoPago (para validar pago) u OpenRouter/DeepSeek (para procesar con IA). Tu fecha de nacimiento en claro nunca se transmite.
            </p>
          </div>
        </motion.div>

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
