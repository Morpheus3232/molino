"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { smoothReveal, staggerApple, staggerItemSmooth } from "@/lib/utils/premiumMotion";

interface LifePathExplorerProps {
  lifePath: number;
}

const LIFE_PATH_DATA: Record<number, {
  title: string;
  origin: string;
  tradition: string;
  meaning: string;
  strengths: string[];
  challenges: string[];
  historicalNote: string;
}> = {
  1: {
    title: "Líder nato",
    origin: "Numerología pitagórica",
    tradition: "El 1 representa el inicio, la individualidad y la capacidad de liderazgo.",
    meaning: "Energía de iniciación, independencia y determinación.",
    strengths: ["Liderazgo", "Originalidad", "Determinación"],
    challenges: ["Impaciencia", "Dificultad para delegar", "Tendencia al ego"],
    historicalNote: "Pitágoras consideraba al 1 como el origen de todos los números, el Monad.",
  },
  2: {
    title: "Diplomático",
    origin: "Numerología pitagórica",
    tradition: "El 2 representa la dualidad, la cooperación y la sensibilidad.",
    meaning: "Energía de armonía, intuición y trabajo en equipo.",
    strengths: ["Diplomacia", "Sensibilidad", "Cooperación"],
    challenges: ["Indecisión", "Dependencia", "Evitación del conflicto"],
    historicalNote: "En la tradición pitagórica, el 2 representa la primera pareja: luz y sombra.",
  },
  3: {
    title: "Comunicador",
    origin: "Numerología pitagórica",
    tradition: "El 3 representa la expresión, la creatividad y la alegría.",
    meaning: "Energía de comunicación, imaginación y expansión social.",
    strengths: ["Creatividad", "Comunicación", "Optimismo"],
    challenges: ["Dispersión", "Superficialidad", "Exceso de verbalización"],
    historicalNote: "El 3 era sagrado en muchas culturas: Trimurti hindú, Santísima Trinidad.",
  },
  4: {
    title: "Constructor",
    origin: "Numerología pitagórica",
    tradition: "El 4 representa la estabilidad, la estructura y el trabajo duro.",
    meaning: "Energía de disciplina, practicalidad y confiabilidad.",
    strengths: ["Organización", "Confiabilidad", "Persistencia"],
    challenges: ["Rigidez", "Exceso de trabajo", "Dificultad para la espontaneidad"],
    historicalNote: "Los 4 elementos (tierra, agua, fuego, aire) son fundamentales en la filosofía occidental.",
  },
  5: {
    title: "Explorador",
    origin: "Numerología pitagórica",
    tradition: "El 5 representa la libertad, el movimiento y la experiencia.",
    meaning: "Energía de aventura, curiosidad y transformación.",
    strengths: ["Versatilidad", "Curiosidad", "Adaptabilidad"],
    challenges: ["Impulsividad", "Inestabilidad", "Dificultad para el compromiso"],
    historicalNote: "El 5 conecta con los 5 sentidos y los 5 elementos en tradiciones orientales.",
  },
  6: {
    title: "Cuidador",
    origin: "Numerología pitagórica",
    tradition: "El 6 representa la responsabilidad, el amor y el equilibrio.",
    meaning: "Energía de cuidado, armonía doméstica y servicio.",
    strengths: ["Responsabilidad", "Amor", "Equilibrio"],
    challenges: ["Exceso de carga", "Autosacrificio", "Perfeccionismo"],
    historicalNote: "El 6 es considerado el número más armonioso en numerología pitagórica.",
  },
  7: {
    title: "Buscador",
    origin: "Numerología pitagórica",
    tradition: "El 7 representa la introspección, la sabiduría y el misterio.",
    meaning: "Energía de análisis, espiritualidad y búsqueda interior.",
    strengths: ["Análisis", "Intuición", "Profundidad"],
    challenges: ["Aislamiento", "Escepticismo excesivo", "Dificultad para la acción"],
    historicalNote: "El 7 era sagrado en Egipto, Grecia y la tradición cristiana.",
  },
  8: {
    title: "Logrador",
    origin: "Numerología pitagórica",
    tradition: "El 8 representa el poder material, la abundancia y la autoridad.",
    meaning: "Energía de logro, ambición y equilibrio kármico.",
    strengths: ["Ambición", "Disciplina", "Visión de negocios"],
    challenges: ["Materialismo", "Obsesión por el éxito", "Dificultad para la vulnerabilidad"],
    historicalNote: "En la tradición china, el 8 es el número de la fortuna por su sonido similar a 'prosperar'.",
  },
  9: {
    title: "Humanitario",
    origin: "Numerología pitagórica",
    tradition: "El 9 representa la humanidad, la compasión y la culminación.",
    meaning: "Energía de servicio, sabiduría global y finalización de ciclos.",
    strengths: ["Compasión", "Visión global", "Generosidad"],
    challenges: ["Idealismo excesivo", "Dificultad para soltar", "Resentimiento"],
    historicalNote: "El 9 es el último dígito simple, representando la completitud del ciclo.",
  },
  11: {
    title: "Maestro intuitivo",
    origin: "Numerología de números maestros",
    tradition: "El 11 es un número maestro de intuición y espiritualidad.",
    meaning: "Elevación, inspiración y conexión con lo trascendente.",
    strengths: ["Intuición", "Inspiración", "Visión espiritual"],
    challenges: ["Ansiedad", "Hipersensibilidad", "Dificultad para la practicalidad"],
    historicalNote: "Los números maestros (11, 22, 33) fueron formalizados en el siglo XX.",
  },
  22: {
    title: "Maestro constructor",
    origin: "Numerología de números maestros",
    tradition: "El 22 es el número maestro de la construcción a gran escala.",
    meaning: "Visión + acción = logros monumentales.",
    strengths: ["Visión grandiosa", "Disciplina", "Capacidad de ejecución"],
    challenges: ["Presión interna", "Perfeccionismo extremo", "Temor al fracaso"],
    historicalNote: "El 22 combina la intuición del 11 con la practicalidad del 4.",
  },
};

export default function LifePathExplorer({ lifePath }: LifePathExplorerProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const data = LIFE_PATH_DATA[lifePath] ?? LIFE_PATH_DATA[5];

  return (
    <motion.div {...smoothReveal} className="p-5 rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted font-medium mb-1">Tu Life Path</p>
          <p className="font-serif text-2xl font-bold text-foreground">{lifePath}</p>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-accent hover:underline"
        >
          {isExpanded ? "Ocultar" : "Conocer el origen"} →
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-border space-y-4">
              {/* Origin */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted font-medium mb-1">Origen</p>
                <p className="text-xs text-foreground">{data.origin}</p>
              </div>

              {/* Tradition */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted font-medium mb-1">Tradición</p>
                <p className="text-xs text-foreground leading-relaxed">{data.tradition}</p>
              </div>

              {/* Meaning */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted font-medium mb-1">Significado</p>
                <p className="text-xs text-foreground">{data.meaning}</p>
              </div>

              {/* Strengths */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted font-medium mb-1">Fortalezas</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.strengths.map((s) => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-[#2D5A3D]/10 text-[#2D5A3D]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Historical note */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted font-medium mb-1">Nota histórica</p>
                <p className="text-xs text-muted/70 italic">{data.historicalNote}</p>
              </div>

              {/* CTA */}
              <button
                type="button"
                onClick={() => router.push("/academy")}
                className="text-[10px] text-accent hover:underline font-medium"
              >
                Explorar la historia completa en La Academia →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
