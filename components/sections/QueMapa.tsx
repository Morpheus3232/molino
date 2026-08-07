"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";

export default function QueMapa() {
  return (
    <section className="bg-background border-t border-ink/10 py-16 sm:py-20">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <motion.p {...fadeUp} className="eyebrow-brutalist mb-10 text-center">
          MIRA TU MAPA
        </motion.p>

        <div className="space-y-16 lg:space-y-24">
          {/* Desktop Mockup */}
          <motion.div {...fadeUp} className="space-y-6">
            <p className="label-micro text-center">Vista desktop — mapa completo</p>
            <div className="relative mx-auto max-w-4xl">
              <div className="aspect-video bg-card border border-ink/10 rounded-lg overflow-hidden relative shadow-lg">
                <div className="absolute top-0 left-0 right-0 h-8 bg-ink/5 border-b border-ink/10 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="p-6 h-full flex flex-col gap-4">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { title: "IDENTIDAD", color: "#6B4C7A", items: ["Número de vida: 7", "Esencia: introspección y análisis", "Expresión: 4", "Año personal: 3"] },
                      { title: "MUNDO", color: "#2E5C8A", items: ["Elemento dominante: Tierra", "Tu lugar: estable, raíces profundas", "Afinidad país: Japón", "Afinidad marca: Muji"] },
                      { title: "CÍRCULO", color: "#C49A2A", items: ["Conexiones clave: 3 entidades", "Resonancia fuerte: 1 entidad", "Compatibilidad amor: 87%", "Compatibilidad trabajo: 72%"] },
                    ].map((col, i) => (
                      <div key={col.title} className="bg-ink/3 border border-ink/10 p-4 flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="w-1 h-6 rounded-full" style={{ backgroundColor: col.color }} />
                          <p className="font-mono text-xs tracking-[0.15em] uppercase text-muted/60">{col.title}</p>
                        </div>
                        <ul className="space-y-2 text-sm text-foreground/80">
                          {col.items.map((item, j) => (
                            <li key={j} className="border-l-2 pl-3" style={{ borderColor: col.color }}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-4 pt-4 border-t border-ink/10">
                    <span className="font-mono text-xs tracking-[0.15em] uppercase text-muted/60">Scroll para ver lectura completa →</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mobile Mockup */}
          <motion.div {...fadeUp} className="space-y-6">
            <p className="label-micro text-center">Vista mobile — misma profundidad, adaptada</p>
            <div className="relative mx-auto max-w-xs">
              <div className="aspect-[9/19.5] bg-card border border-ink/10 rounded-[32px] overflow-hidden relative shadow-2xl p-4 bg-black">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-1 bg-ink/20 rounded-full" />
                <div className="h-full flex flex-col gap-4 pt-2">
                  <div className="flex items-center gap-2 px-2">
                    <span className="w-1 h-6 rounded-full bg-[#6B4C7A]" />
                    <p className="font-mono text-xs tracking-[0.15em] uppercase text-muted/60">IDENTIDAD</p>
                  </div>
                  <div className="space-y-2 text-sm text-foreground/80 px-2">
                    <div className="border-l-2 pl-3 border-[#6B4C7A]">Número de vida: 7</div>
                    <div className="border-l-2 pl-3 border-[#6B4C7A]">Esencia: introspección</div>
                  </div>
                  <div className="flex items-center gap-2 px-2 border-t border-ink/10 pt-2">
                    <span className="w-1 h-6 rounded-full bg-[#2E5C8A]" />
                    <p className="font-mono text-xs tracking-[0.15em] uppercase text-muted/60">MUNDO</p>
                  </div>
                  <div className="space-y-2 text-sm text-foreground/80 px-2">
                    <div className="border-l-2 pl-3 border-[#2E5C8A]">Elemento: Tierra</div>
                    <div className="border-l-2 pl-3 border-[#2E5C8A]">País: Japón</div>
                  </div>
                  <div className="flex items-center gap-2 px-2 border-t border-ink/10 pt-2">
                    <span className="w-1 h-6 rounded-full bg-[#C49A2A]" />
                    <p className="font-mono text-xs tracking-[0.15em] uppercase text-muted/60">CÍRCULO</p>
                  </div>
                  <div className="space-y-2 text-sm text-foreground/80 px-2">
                    <div className="border-l-2 pl-3 border-[#C49A2A]">Conexiones: 3</div>
                    <div className="border-l-2 pl-3 border-[#C49A2A]">Resonancia: 87%</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Daily Energy Mockup */}
          <motion.div {...fadeUp} className="space-y-6">
            <p className="label-micro text-center">Energía diaria — utilidad real cada día</p>
            <div className="relative mx-auto max-w-lg">
              <div className="aspect-[4/3] bg-card border border-ink/10 rounded-lg overflow-hidden relative shadow-lg">
                <div className="p-6 h-full flex flex-col justify-center items-center text-center">
                  <p className="label-micro mb-4">Tu energía de hoy</p>
                  <p className="font-display text-5xl sm:text-6xl font-bold tracking-tight text-[#AEB8FF] mb-2">
                    EXCELENTE
                  </p>
                  <p className="text-sm text-muted/70 mb-6 max-w-xs">
                    Iniciación — Un día para comenzar algo nuevo. Tu energía está orientada hacia la acción y la iniciativa.
                  </p>
                  <div className="grid grid-cols-4 gap-4 w-full max-w-xs">
                    {[
                      { label: "TRABAJO", score: 88 },
                      { label: "RELACIONES", score: 72 },
                      { label: "CREATIVIDAD", score: 91 },
                      { label: "DECISIONES", score: 79 },
                    ].map((area) => (
                      <div key={area.label} className="text-center">
                        <div className="font-mono text-[0.55rem] tracking-[0.15em] uppercase text-muted/50 mb-1">
                          {area.label}
                        </div>
                        <div className="font-display text-xl font-bold text-foreground">
                          {area.score}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}