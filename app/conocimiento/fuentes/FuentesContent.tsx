"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp, fadeUpDelayed } from "@/lib/utils/motion";
import UniversityFooter from "@/components/layout/UniversityFooter";
import { SOURCES, MOLINO_DISCLAIMER } from "@/lib/data/sources";

const SYSTEM_LABELS: Record<string, string> = {
  numerologia: "Numerología",
  astrologia: "Astrología",
  "zodiaco-chino": "Zodiaco Chino",
  general: "General",
  compatibilidad: "Compatibilidad",
};

const TYPE_LABELS: Record<string, string> = {
  academic: "Académica",
  museum: "Museo / Institución",
  encyclopedia: "Enciclopedia",
  historical: "Histórica",
  institutional: "Institucional",
};

export default function FuentesContent() {
  const router = useRouter();

  const bySystem = SOURCES.reduce((acc, src) => {
    if (!acc[src.system]) acc[src.system] = [];
    acc[src.system].push(src);
    return acc;
  }, {} as Record<string, typeof SOURCES>);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">

        {/* Breadcrumb */}
        <nav className="text-xs text-muted mb-8" aria-label="Breadcrumb">
          <span className="hover:text-accent cursor-pointer" onClick={() => router.push("/")}>Inicio</span>
          <span className="mx-2">&rsaquo;</span>
          <span className="hover:text-accent cursor-pointer" onClick={() => router.push("/explore")}>Conocimiento</span>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-foreground font-medium">Fuentes y metodología</span>
        </nav>

        {/* Hero */}
        <motion.section {...fadeUp} className="mb-16 sm:mb-20">
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-4">Transparencia</p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1]">
            Fuentes y metodología
          </h1>
          <p className="text-base sm:text-lg text-muted mt-6 max-w-2xl leading-relaxed">
            Molino se compromete con la transparencia. Cada afirmación factual puede rastrearse hasta una fuente confiable. Cada interpretación simbólica está claramente identificada como tal.
          </p>
        </motion.section>

        {/* Disclaimer */}
        <motion.section {...fadeUpDelayed(0.05)} className="mb-12">
          <div className="p-6 rounded-md border border-accent/20 bg-accent/[0.03]">
            <p className="text-sm text-muted leading-relaxed">{MOLINO_DISCLAIMER}</p>
          </div>
        </motion.section>

        {/* Cómo funciona Molino */}
        <motion.section {...fadeUpDelayed(0.1)} className="mb-16 sm:mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Cómo funciona Molino</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "1. Datos de entrada", text: "Nombre y fecha de nacimiento. Estos datos se utilizan para generar todos los cálculos." },
              { title: "2. Cálculos deterministas", text: "Numerología, astrología y zodiaco chino se calculan de forma reproducible con la misma fórmula." },
              { title: "3. Interpretación simbólica", text: "Los resultados se interpretan usando tradiciones culturales. Molino indica claramente cuando algo es interpretación." },
              { title: "4. Síntesis", text: "Los diferentes sistemas se cruzan para generar una lectura integrada. Este cruzamiento es una propuesta propia de Molino." },
              { title: "5. Compatibilidad", text: "Basado en la relación entre animales del zodíaco chino. Las puntuaciones son deterministas y explicables." },
              { title: "6. Sin predicciones", text: "Molino no predice el futuro. Ofrece herramientas de reflexión basadas en sistemas simbólicos." },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-md border border-border bg-card shadow-sm">
                <h3 className="text-sm font-medium text-foreground mb-2">{item.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Cómo se calcula la compatibilidad */}
        <motion.section {...fadeUpDelayed(0.15)} className="mb-16 sm:mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Cómo se calcula la compatibilidad</h2>
          </div>
          <div className="max-w-3xl space-y-4">
            <p className="text-sm text-foreground leading-relaxed">
              La compatibilidad de Molino utiliza <strong>70% zodiaco chino + 30% numerología</strong> como fórmula base. Esto es una propuesta de Molino, no una convención universal.
            </p>
            <div className="p-6 rounded-md border border-border bg-card shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-3">Fórmula</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">70% — Zodiaco Chino</p>
                    <p className="text-xs text-muted">Compatibilidad entre el animal del usuario y el de la entidad.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-muted shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">30% — Numerología</p>
                    <p className="text-xs text-muted">Relación entre el Camino de Vida del usuario y la numerología de la entidad.</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Para países se utiliza el <strong>año de independencia</strong> como fecha de referencia. Para marcas, el <strong>año de fundación</strong>. Cuando existen múltiples fechas posibles, Molino elige la más documentada y lo indica explícitamente.
            </p>
          </div>
        </motion.section>

        {/* Fuentes por sistema */}
        <motion.section {...fadeUpDelayed(0.2)} className="mb-16 sm:mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Fuentes por sistema</h2>
          </div>
          <div className="space-y-8">
            {Object.entries(bySystem).map(([system, sources]) => (
              <div key={system}>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">{SYSTEM_LABELS[system] || system}</h3>
                <div className="space-y-3">
                  {sources.map((src) => (
                    <div key={src.id} className="flex items-start gap-3 py-3 border-b border-border last:border-b-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-border mt-2 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{src.title}</p>
                        <p className="text-xs text-muted">{src.author}{src.institution ? ` — ${src.institution}` : ""}{src.year ? ` (${src.year})` : ""}</p>
                        {src.url && (
                          <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:text-accent/80 mt-1 inline-block">
                            {src.url} &rarr;
                          </a>
                        )}
                        <p className="text-xs text-muted mt-1 italic">{src.relevance}</p>
                      </div>
                      <span className="text-[9px] uppercase tracking-[0.15em] text-muted font-medium px-2 py-0.5 rounded-md border border-border shrink-0">
                        {TYPE_LABELS[src.type] || src.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Disclaimer final */}
        <motion.section {...fadeUpDelayed(0.25)}>
          <div className="p-6 rounded-md border border-border bg-card shadow-sm">
            <p className="text-xs text-muted leading-relaxed">{MOLINO_DISCLAIMER}</p>
          </div>
        </motion.section>

      </main>
      <UniversityFooter />
    </div>
  );
}
