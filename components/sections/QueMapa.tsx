"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";

export default function QueMapa() {
  return (
    <section className="bg-background border-t border-ink/10 py-16 sm:py-20">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <motion.h2
          {...fadeUp}
          className="font-display text-[clamp(1.75rem,4vw,2.75rem)] tracking-tight text-foreground mb-10 text-center"
        >
          MIRA TU MAPA
        </motion.h2>

        <div className="space-y-16 lg:space-y-24">
          {/* Desktop Mockup */}
          <motion.div {...fadeUp} className="space-y-6">
            <p className="label-micro text-center">Vista desktop — mapa completo</p>
            <div className="relative mx-auto max-w-4xl">
              <div className="aspect-video border border-ink/10 rounded-lg overflow-hidden relative">
                <div className="p-6 h-full flex flex-col gap-4">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { title: "IDENTIDAD", items: ["Número de vida: 7", "Esencia: introspección y análisis", "Expresión: 4", "Año personal: 3"] },
                      { title: "MUNDO", items: ["Elemento dominante: Tierra", "Tu lugar: estable, raíces profundas", "Afinidad país: Japón", "Afinidad marca: Muji"] },
                      { title: "CÍRCULO", items: ["Conexiones clave: 3 entidades", "Resonancia fuerte: 1 entidad", "Compatibilidad amor: 87%", "Compatibilidad trabajo: 72%"] },
                    ].map((col) => (
                      <div key={col.title} className="border border-ink/10 p-4 flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="w-1 h-6 rounded-full bg-muted" />
                          <p className="font-mono text-xs tracking-[0.2em] uppercase text-muted/70">{col.title}</p>
                        </div>
                        <ul className="space-y-2 text-sm text-foreground/80">
                          {col.items.map((item, j) => (
                            <li key={j} className="flex items-start gap-2">
                              <span className="w-1 h-1 rounded-full mt-1.5 shrink-0 bg-muted" aria-hidden="true" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-4 pt-4 border-t border-ink/10">
                    <span className="font-mono text-xs tracking-[0.2em] uppercase text-muted/70">Scroll para ver lectura completa →</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mobile Mockup */}
          <motion.div {...fadeUp} className="space-y-6">
            <p className="label-micro text-center">Vista mobile — misma profundidad, adaptada</p>
            <div className="relative mx-auto max-w-xs">
              <div className="aspect-[9/19.5] border border-ink/10 rounded-[32px] overflow-hidden relative p-4">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-1 bg-ink/20 rounded-full" />
                <div className="h-full flex flex-col gap-4 pt-2">
                  {[
                    { title: "IDENTIDAD", items: ["Número de vida: 7", "Esencia: introspección"] },
                    { title: "MUNDO", items: ["Elemento: Tierra", "País: Japón"] },
                    { title: "CÍRCULO", items: ["Conexiones: 3", "Resonancia: 87%"] },
                  ].map((col) => (
                    <div key={col.title}>
                      <div className="flex items-center gap-2 px-2 border-t border-ink/10 pt-2 first:border-t-0 first:pt-0">
                        <span className="w-1 h-6 rounded-full bg-muted" />
                        <p className="font-mono text-xs tracking-[0.2em] uppercase text-muted/70">{col.title}</p>
                      </div>
                      <div className="space-y-2 text-sm text-foreground/80 px-2 mt-2">
                        {col.items.map((item) => (
                          <div key={item} className="flex items-start gap-2">
                            <span className="w-1 h-1 rounded-full mt-1.5 shrink-0 bg-muted" aria-hidden="true" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Calendario Numerológico Mockup */}
          <motion.div {...fadeUp} className="space-y-6">
            <p className="label-micro text-center">Calendario numerológico — utilidad real cada día</p>
            <div className="relative mx-auto max-w-lg">
              <div className="aspect-[4/3] border border-ink/10 rounded-lg overflow-hidden relative">
                <div className="p-6 h-full flex flex-col justify-center items-center text-center">
                  <p className="label-micro mb-4">Hoy es día</p>
                  <p className="font-display text-5xl sm:text-6xl font-bold tracking-tight text-accent mb-2">
                    5
                  </p>
                  <p className="text-sm text-muted/70 mb-6 max-w-xs">
                    El Explorador — Viajar, explorar, adaptarse, libertad. Cada día del mes tiene su propio número y propósito.
                  </p>
                  <div className="grid grid-cols-7 gap-2 w-full max-w-xs">
                    {[3, 4, 5, 6, 7, 8, 22].map((n) => (
                      <div
                        key={n}
                        className={`aspect-square rounded-full border flex items-center justify-center font-mono text-xs font-bold ${
                          [5, 22].includes(n) ? "border-accent text-accent bg-accent/10" : "border-ink/10 text-foreground"
                        }`}
                      >
                        {n}
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