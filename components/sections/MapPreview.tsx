"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface MapPillar {
  label: string;
  value: string;
  desc: string;
}

const demoMap: Record<string, MapPillar[]> = {
  identity: [
    { label: "Camino de Vida", value: "4", desc: "El Constructor — estructura y disciplina" },
    { label: "Signo Solar", value: "Géminis", desc: "Curiosidad, agilidad verbal" },
    { label: "Animal Chino", value: "Caballo", desc: "Ímpetu noble, autonomía" },
  ],
  reading: [
    { label: "Convergencia", value: "Aire + Metal", desc: "Mentalidad en acción firme" },
    { label: "Tensión", value: "Mutable + Yang", desc: "Adaptabilidad proactiva" },
    { label: "Recurso", value: "Cuarto Arcano", desc: "El Emperador: autoridad interior" },
  ],
  ai: [
    { label: "Pregunta tipo", value: "¿Cuándo?", desc: "Timing óptimo para decidir" },
    { label: "Respuesta IA", value: "Jul–Sep 2026", desc: "Ventana de pico de claridad" },
    { label: "Confianza", value: "Alta", desc: "Convergencia entre sistemas" },
  ],
};

const tabs = [
  { id: "identity", label: "Identidad" },
  { id: "reading", label: "Lectura" },
  { id: "ai", label: "IA" },
];

export default function MapPreview() {
  const [activeTab, setActiveTab] = useState("identity");

  const data = demoMap[activeTab];

  return (
    <section className="relative py-20 sm:py-32 px-4 sm:px-8 bg-background border-b border-border">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted mb-5">
            Ver antes de entrar
          </p>
          <h2 className="font-display font-normal normal-case tracking-tight text-foreground leading-[1.05] text-[clamp(2.25rem,5vw,3.5rem)]">
            Así se ve tu mapa.
            <em className="text-gradient-warm"> Sin fecha todavía.</em>
          </h2>
          <p className="text-lg sm:text-xl text-muted leading-relaxed mt-6">
            Un mapa real, con datos de ejemplo. Tu versión personal aparece
            cuando ingresás tu fecha de nacimiento.
          </p>
        </div>

        {/* Tab navigator — pill style */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-card p-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative rounded-lg px-5 sm:px-6 py-2.5 font-heading font-medium text-sm tracking-wide transition-all duration-200 ${
                    isActive
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Map preview cards */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.2, 0, 0.1, 1] }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6"
          >
            {data.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-border bg-card p-6 sm:p-7 space-y-3 hover:border-accent/40 transition-colors duration-200"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  {item.label}
                </span>
                <div className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                  {item.value}
                </div>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm text-muted leading-relaxed max-w-xl">
            Los tres pilares se cruzan entre sí: la identidad da el patrón,
            la lectura lo interpreta, y la IA lo pone a tu servicio.
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/ejemplo"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-heading font-semibold text-foreground hover:border-accent hover:text-accent transition-colors"
            >
              Ver ejemplo completo
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="#mapa-form"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-paper text-sm font-heading font-bold uppercase tracking-[0.08em] hover:bg-accent-hover active:scale-[0.98] transition-colors"
            >
              Crear mi mapa
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}