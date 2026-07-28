"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import { getChineseZodiac, getChineseZodiacInfo, getChineseElement } from "@/lib/engines/chineseZodiacEngine";
import { CHINESE_ANIMALS } from "@/lib/data/zodiaco-chino-content";

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

const ELEMENT_COLORS: Record<string, string> = {
  "Madera": "var(--element-wood)",
  "Fuego": "var(--element-fire)",
  "Tierra": "#8B7355",
  "Metal": "var(--element-metal)",
  "Agua": "var(--element-water)",
};

export default function ZodiacoChinoCalcPage() {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [result, setResult] = useState<{ animal: string; element: string; info: ReturnType<typeof getChineseZodiacInfo> } | null>(null);

  const daysInMonth = month && year ? getDaysInMonth(month, year) : 31;

  const handleCalculate = () => {
    if (!day || !month || !year) return;
    const dateStr = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    const animal = getChineseZodiac(dateStr);
    const info = getChineseZodiacInfo(dateStr);
    setResult({ animal, element: info.element, info });
  };

  const isValid = day && month && year && parseInt(day) <= daysInMonth;

  const getAnimalData = (animalName: string) => CHINESE_ANIMALS.find(a => a.name === animalName);

  const getYearRange = (animalIndex: number): string => {
    const baseYears: number[] = [];
    for (let y = 2024; y >= 1924; y -= 12) {
      baseYears.push(y - animalIndex);
    }
    return baseYears.filter(y => y > 0).slice(0, 5).join(", ");
  };

  const animalIndex = result ? CHINESE_ANIMALS.findIndex(a => a.name === result.animal) : -1;

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />
      <main className="mx-auto max-w-[900px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">

        <nav className="text-xs text-muted mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-accent transition-colors">Inicio</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <Link href="/herramientas" className="hover:text-accent transition-colors">Herramientas</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <span className="text-foreground font-medium" aria-current="page">Zodiaco Chino</span>
        </nav>

        <motion.section {...fadeUp}>
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-4">Zodiaco Chino</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.1]">
            Tu animal del zodiaco chino
          </h1>
          <p className="text-base text-muted mt-4 max-w-xl leading-relaxed">
            El zodiaco chino es un sistema de más de 2000 años que asigna un animal y un elemento a cada año en un ciclo de 60 combinaciones. Ingresá tu fecha de nacimiento para descubrir tu lugar en este ciclo.
          </p>
        </motion.section>

        {/* Formulario */}
        <motion.section {...fadeUp} className="mt-12 sm:mt-16">
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Fecha de nacimiento</label>
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
            <button
              type="button"
              onClick={handleCalculate}
              disabled={!isValid}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-6 py-3 text-sm bg-primary text-primary-foreground shadow-md hover:bg-accent hover:text-accent-foreground min-h-[48px] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Calcular mi animal
            </button>
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
              {/* Hero del resultado */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="p-8 sm:p-12 rounded-2xl border border-accent/20 bg-accent/[0.03] hover:border-accent/40 transition-colors duration-300"
              >
                <div className="text-center mb-10">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="text-[10px] uppercase tracking-[0.25em] text-accent font-medium mb-4"
                  >
                    Tu Animal del Zodiaco Chino
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-7xl sm:text-8xl mb-4"
                  >
                    {getAnimalData(result.animal)?.emoji || "\ud83d\udc09"}
                  </motion.p>
                  <motion.h2
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="font-serif text-4xl sm:text-5xl font-semibold text-foreground"
                  >
                    {result.animal}
                  </motion.h2>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.35 }}
                    className="flex items-center justify-center gap-3 mt-4"
                  >
                    <span className="px-4 py-1.5 rounded-full text-sm font-medium border border-border transition-colors hover:border-accent/40" style={{ borderColor: ELEMENT_COLORS[result.element] || "var(--element-fire)", color: ELEMENT_COLORS[result.element] || "var(--element-fire)" }}>
                      {result.element}
                    </span>
                  </motion.div>
                </div>

                {/* Información del animal */}
                {(() => {
                  const animalData = getAnimalData(result.animal);
                  return animalData ? (
                    <div className="max-w-2xl mx-auto space-y-8">
                      {/* Significado */}
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55, duration: 0.4 }}
                      >
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Significado</p>
                        <p className="text-sm text-foreground leading-relaxed">{animalData.meaning}</p>
                      </motion.div>

                      {/* Historia */}
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                      >
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Historia y simbolismo</p>
                        <p className="text-sm text-muted leading-relaxed">{animalData.history}</p>
                      </motion.div>

                      {/* Características */}
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65, duration: 0.4 }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                      >
                        <div className="p-4 rounded-xl border border-border bg-card transition-colors hover:border-accent/30">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-2">Características</p>
                          <p className="text-sm text-foreground">{animalData.traits.join(", ")}</p>
                        </div>
                        <div className="p-4 rounded-xl border border-border bg-card transition-colors hover:border-accent/30">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-2">Fortalezas</p>
                          <p className="text-sm text-foreground">{animalData.strengths.slice(0, 3).join(", ")}</p>
                        </div>
                        <div className="p-4 rounded-xl border border-border bg-card transition-colors hover:border-accent/30">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Desafíos</p>
                          <p className="text-sm text-foreground">{animalData.challenges.slice(0, 3).join(", ")}</p>
                        </div>
                      </motion.div>

                      {/* Compatibilidades */}
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.4 }}
                      >
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Compatibilidades tradicionales</p>
                        <div className="flex flex-wrap gap-2">
                          {animalData.compatibility.friendly.map(f => (
                            <span key={f} className="text-sm px-3 py-1 rounded-full border border-border text-foreground transition-colors hover:border-accent/40">{f}</span>
                          ))}
                        </div>
                      </motion.div>

                      {/* Años */}
                      {animalIndex >= 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.75, duration: 0.4 }}
                        >
                          <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Años correspondientes</p>
                          <p className="text-sm text-foreground">{getYearRange(animalIndex)}</p>
                        </motion.div>
                      )}

                      {/* Los 5 elementos */}
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.4 }}
                      >
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Los 5 elementos</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {animalData.elements.map((el) => (
                            <div key={el.element} className="p-3 rounded-xl border border-border bg-card transition-colors hover:border-accent/30">
                              <p className="text-sm font-medium text-foreground">{result.animal} de {el.element}</p>
                              <p className="text-xs text-muted mt-1">{el.modifier}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>

                      {/* Nota sobre el calendario */}
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.85, duration: 0.4 }}
                        className="p-4 rounded-xl border border-border bg-card"
                      >
                        <p className="text-xs text-muted leading-relaxed">
                          <strong>Nota:</strong> El zodiaco chino sigue el calendario lunar. Para fechas cercanas al Año Nuevo chino (enero-febrero), el animal puede diferir. Molino utiliza el año gregoriano como convención.
                        </p>
                      </motion.div>
                    </div>
                  ) : null;
                })()}
              </motion.div>

              {/* Disclaimer */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.35 }}
                className="mt-6 p-4 rounded-xl border border-border bg-card"
              >
                <p className="text-xs text-muted leading-relaxed">
                  <strong>Nota:</strong> El zodiaco chino es un sistema de creencias milenario. Molino lo utiliza como herramienta de reflexión y autoconocimiento. Las interpretaciones no constituyen evidencia científica.
                </p>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.95, duration: 0.35 }}
                className="mt-8 text-center space-y-4"
              >
                <button
                  type="button"
                  onClick={() => {
                    const text = `Soy ${result.animal} de elemento ${result.element}. Descubrí tu animal del zodiaco chino en Molino.`;
                    if (navigator.share) {
                      navigator.share({ title: `Mi Zodiaco Chino — ${result.animal} — Molino`, text }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(text).then(() => {});
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all px-5 py-2.5 text-sm bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 hover:border-accent/30 min-h-[40px]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Compartir resultado
                </button>
                <div>
                  <p className="text-sm text-muted mb-3">Querés ver cómo tu animal se conecta con numerología y astrología?</p>
                  <Link
                    href="/onboarding"
                    className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-6 py-3 text-sm bg-primary text-primary-foreground shadow-md hover:bg-accent hover:text-accent-foreground hover:shadow-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2"
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
