"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import { calculateLifePath } from "@/lib/engines/numerologyEngine";
import { ARCHETYPES } from "@/lib/data";
import { getCompatibilityDescription } from "@/lib/data";

const MONTHS = [
  { value: "01", label: "Enero" }, { value: "02", label: "Febrero" },
  { value: "03", label: "Marzo" }, { value: "04", label: "Abril" },
  { value: "05", label: "Mayo" }, { value: "06", label: "Junio" },
  { value: "07", label: "Julio" }, { value: "08", label: "Agosto" },
  { value: "09", label: "Septiembre" }, { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" }, { value: "12", label: "Diciembre" },
];

function getDaysInMonth(month: string, year: string): number {
  return new Date(parseInt(year), parseInt(month), 0).getDate();
}

const LIFE_PATH_MEANINGS: Record<number, { meaning: string; archetype: string; description: string }> = {
  1: { meaning: "Liderazgo e iniciativa", archetype: "El Líder", description: "Tu energía principal es la del liderazgo independiente. Tenés iniciativa, originalidad y la capacidad de empezar cosas nuevas." },
  2: { meaning: "Cooperación y sensibilidad", archetype: "El Puente", description: "Tu energía está orientada hacia la conexión con otros. La diplomacia, la paciencia y la cooperación son tus herramientas principales." },
  3: { meaning: "Expresión creativa", archetype: "El Creador", description: "Tu energía es la expresión. La comunicación, el arte y la creatividad son los canales por donde fluye tu vitalidad." },
  4: { meaning: "Estabilidad y disciplina", archetype: "El Constructor", description: "Tu energía está orientada a construir. La organización, la persistencia y el trabajo metódico son tu fuerte." },
  5: { meaning: "Libertad y versatilidad", archetype: "El Nómada", description: "Tu energía es el cambio. La curiosidad, la aventura y la experiencia directa alimentan tu crecimiento." },
  6: { meaning: "Responsabilidad y cuidado", archetype: "El Nutridor", description: "Tu energía está orientada hacia el hogar y los demás. El amor práctico y la responsabilidad son tu camino." },
  7: { meaning: "Introspección y búsqueda de verdad", archetype: "El Investigador", description: "Tu energía es la búsqueda. El análisis, la reflexión y la sabiduría interior guían tu camino." },
  8: { meaning: "Poder y manifestación material", archetype: "El Poderoso", description: "Tu energía está orientada hacia los logros concretos. La estrategia y la visión te permiten materializar proyectos." },
  9: { meaning: "Sabiduría y compasión", archetype: "El Filósofo", description: "Tu energía es la del servicio y la visión global. La compasión y la sabiduría acumulada son tu legado." },
  11: { meaning: "Intuición elevada e inspiración", archetype: "El Vidente", description: "Tu energía conecta con lo trascendente. La intuición y la inspiración son tus herramientas más poderosas." },
  22: { meaning: "Construcción a gran escala", archetype: "El Maestro Constructor", description: "Tu energía combina visión con capacidad de manifestación. Podés construir cosas que perduren." },
  33: { meaning: "Compasión universal y sanación", archetype: "El Maestro Sanador", description: "Tu energía está dedicada al servicio y la sanación. Es el número más elevado de servicio." },
};

export default function CaminoDeVidaPage() {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [result, setResult] = useState<{ lifePath: number; meaning: typeof LIFE_PATH_MEANINGS[1] } | null>(null);

  const daysInMonth = month && year ? getDaysInMonth(month, year) : 31;

  const handleCalculate = () => {
    if (!day || !month || !year) return;
    const dateStr = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    const lifePath = calculateLifePath(dateStr);
    const meaning = LIFE_PATH_MEANINGS[lifePath] || LIFE_PATH_MEANINGS[1];
    setResult({ lifePath, meaning });
  };

  const isValid = day && month && year && parseInt(day) <= daysInMonth;

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[900px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">

        <nav className="text-xs text-muted mb-8" aria-label="Breadcrumb">
          <Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">Inicio</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <Link href="/herramientas" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">Herramientas</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <span className="text-foreground font-medium" aria-current="page">Camino de Vida</span>
        </nav>

        <motion.section {...fadeUp}>
          <h1 className="font-heading text-4xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.1]">
            Camino de Vida
          </h1>
          <p className="text-base text-muted mt-4 max-w-xl leading-relaxed">
            Calculá tu número de Camino de Vida a partir de tu fecha de nacimiento. Según la tradición numerológica, este número describe tu energía central.
          </p>
        </motion.section>

        {/* Formulario */}
        <motion.section {...fadeUp} className="mt-12 sm:mt-16">
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-muted font-medium mb-2">Fecha de nacimiento</label>
              <div className="flex gap-3">
                <select value={day} onChange={(e) => setDay(e.target.value)} className="input flex-1" aria-label="Día">
                  <option value="">Día</option>
                  {Array.from({ length: daysInMonth }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, "0")}>{i + 1}</option>
                  ))}
                </select>
                <select value={month} onChange={(e) => setMonth(e.target.value)} className="input flex-1" aria-label="Mes">
                  <option value="">Mes</option>
                  {MONTHS.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
                <select value={year} onChange={(e) => setYear(e.target.value)} className="input flex-1" aria-label="Año">
                  <option value="">Año</option>
                  {Array.from({ length: 100 }, (_, i) => 2010 - i).map((y) => (
                    <option key={y} value={String(y)}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
            <Button variant="primary" fullWidth onClick={handleCalculate} disabled={!isValid}>Calcular Camino de Vida</Button>
          </div>
        </motion.section>

        {/* Resultado */}
        <AnimatePresence>
          {result && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mt-12 sm:mt-16"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="p-8 sm:p-10 rounded-md border border-accent/20 bg-accent/[0.03] hover:border-accent/40 transition-colors duration-300"
              >
                <div className="text-center mb-8">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-3"
                  >
                    Tu Camino de Vida
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="number-display text-[6rem] sm:text-[8rem] leading-none"
                    style={{ color: "var(--element-fire)" }}
                  >
                    {result.lifePath}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="font-heading text-2xl font-semibold text-foreground mt-4"
                  >
                    {result.meaning.archetype}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="text-sm text-muted mt-2"
                  >
                    {result.meaning.meaning}
                  </motion.p>
                </div>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.4 }}
                  className="text-sm text-muted leading-relaxed max-w-lg mx-auto text-center"
                >
                  {result.meaning.description}
                </motion.p>
              </motion.div>

              {/* Disclaimer */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.35 }}
                className="mt-6 p-4 rounded-md border border-border bg-card shadow-sm"
              >
                <p className="text-xs text-muted leading-relaxed">
                  <strong>Nota:</strong> El Camino de Vida es una interpretación simbólica de la tradición numerológica. No constituye evidencia científica ni predice el futuro. Molino lo utiliza como herramienta de reflexión.
                </p>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.35 }}
                className="mt-8 text-center space-y-4"
              >
                <button
                  type="button"
                  onClick={() => {
                    const text = `Mi Camino de Vida es ${result.lifePath} — ${result.meaning.archetype}. Leé el tuyo en Molino.`;
                    if (navigator.share) {
                      navigator.share({ title: "Mi Camino de Vida — Molino", text }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(text).then(() => {});
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all px-6 py-2.5 text-sm bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 hover:border-accent/30 min-h-[40px]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Compartir resultado
                </button>
                <div>
                  <p className="text-sm text-muted mb-3">Querés ver cómo esto se conecta con astrología y zodiaco chino?</p>
                  <Link
                    href="/onboarding"
                    className="inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all px-6 py-3 text-sm bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground min-h-[44px] focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2"
                  >
                    Crear tu mapa completo
                  </Link>
                </div>
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>

      </main>
      <UniversityFooter />
    </div>
  );
}
