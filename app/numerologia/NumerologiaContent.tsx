"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import { KNOWLEDGE_BASE } from "@/lib/data/knowledge";
import UniversityFooter from "@/components/layout/UniversityFooter";

export default function NumerologiaContent() {
  const router = useRouter();
  const num = KNOWLEDGE_BASE.numerology;

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">

        {/* Hero */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1]">
            El lenguaje de los números
          </h1>
          <p className="text-base text-muted mt-6 max-w-xl leading-relaxed">{num.history}</p>
        </motion.section>

        {/* Metodología */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Metodología</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-md border border-border bg-card shadow-sm">
              <p className="text-sm font-medium text-foreground">Pitagórico</p>
              <p className="text-sm text-muted mt-2 leading-relaxed">{num.methods.pythagorean}</p>
            </div>
            <div className="p-6 rounded-md border border-border bg-card shadow-sm">
              <p className="text-sm font-medium text-foreground">Caldeo</p>
              <p className="text-sm text-muted mt-2 leading-relaxed">{num.methods.chaldean}</p>
            </div>
          </div>
        </motion.section>

        {/* Números maestros */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Números maestros</h2>
          </div>
          <p className="text-sm text-muted mb-6">Vibraciones de alta frecuencia que no se reducen a un solo dígito.</p>
          <div className="flex flex-wrap gap-4">
            {num.masterNumbers.map((n) => (
              <div key={n} className="rounded-md border border-border bg-card shadow-sm px-6 py-4 text-center">
                <p className="text-2xl font-heading font-semibold text-foreground">{n}</p>
                <p className="text-xs text-muted mt-1">
                  {n === 11 ? "Intuición elevada" : n === 22 ? "Construcción maestra" : "Amor universal"}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Cálculos fundamentales */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Cálculos fundamentales</h2>
          </div>
          <div className="space-y-3">
            {(num.topics || []).map((topic: any) => (
              <div key={topic.title} className="flex gap-4 rounded-md border border-border bg-card shadow-sm p-6">
                <span className="text-accent mt-0.5" aria-hidden="true">•</span>
                <div>
                  <p className="text-sm font-medium text-foreground">{topic.title}</p>
                  <p className="text-sm text-muted mt-1">{topic.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section {...fadeUp} className="text-center">
          <button type="button" onClick={() => router.push("/profile")} className="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all px-8 py-3 text-sm bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground min-h-[48px]">
            Volver a mi perfil
          </button>
        </motion.section>

      </main>
      <UniversityFooter />
    </div>
  );
}
