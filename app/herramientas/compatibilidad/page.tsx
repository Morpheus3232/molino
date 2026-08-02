"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import UniversityFooter from "@/components/layout/UniversityFooter";
import { calculateLifePath } from "@/lib/engines/numerologyEngine";
import { getSunSign } from "@/lib/engines/astrologyEngine";
import { getChineseZodiac } from "@/lib/engines/chineseZodiacEngine";
import { getCompatibilityDescription } from "@/lib/data";
import { getRelation, type Animal } from "@/lib/data/animalRelations";

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

interface PersonData {
  day: string; month: string; year: string;
  animal: string; element: string; lifePath: number; sunSign: string;
}

function calculatePerson(day: string, month: string, year: string): PersonData | null {
  if (!day || !month || !year) return null;
  const dateStr = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  return {
    day, month, year,
    animal: getChineseZodiac(dateStr),
    element: "", // Will be derived
    lifePath: calculateLifePath(dateStr),
    sunSign: getSunSign(dateStr),
  };
}

// Score via canonical animalRelations (getRelation) — 100% animal↔animal
function getZodiacScore(animal1: string, animal2: string): number {
  if (!animal1 || !animal2) return 50;
  return getRelation(animal1 as Animal, animal2 as Animal).score;
}

function getZodiacLabel(animal1: string, animal2: string): string {
  if (!animal1 || !animal2) return "Sin datos";
  return getRelation(animal1 as Animal, animal2 as Animal).label;
}

export default function CompatibilidadCalcPage() {
  const [p1, setP1] = useState({ day: "", month: "", year: "" });
  const [p2, setP2] = useState({ day: "", month: "", year: "" });

  const person1 = useMemo(() => calculatePerson(p1.day, p1.month, p1.year), [p1]);
  const person2 = useMemo(() => calculatePerson(p2.day, p2.month, p2.year), [p2]);

  const days1 = p1.month && p1.year ? getDaysInMonth(p1.month, p1.year) : 31;
  const days2 = p2.month && p2.year ? getDaysInMonth(p2.month, p2.year) : 31;

  const isValidP1 = p1.day && p1.month && p1.year && parseInt(p1.day) <= days1;
  const isValidP2 = p2.day && p2.month && p2.year && parseInt(p2.day) <= days2;
  const canCalculate = isValidP1 && isValidP2 && person1 && person2;

  const compatibility = useMemo(() => {
    if (!person1 || !person2) return null;
    const zodiacScore = getZodiacScore(person1.animal, person2.animal);
    const label = getZodiacLabel(person1.animal, person2.animal);
    const finalScore = zodiacScore;

    return {
      score: finalScore,
      zodiacScore,
      label,
      description: getCompatibilityDescription(finalScore, person2.animal),
    };
  }, [person1, person2]);

  const days1Valid = p1.month && p1.year ? getDaysInMonth(p1.month, p1.year) : 31;
  const days2Valid = p2.month && p2.year ? getDaysInMonth(p2.month, p2.year) : 31;

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[900px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">

        <nav className="text-xs text-muted mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-accent transition-colors">Inicio</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <Link href="/herramientas" className="hover:text-accent transition-colors">Herramientas</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <span className="text-foreground font-medium" aria-current="page">Compatibilidad</span>
        </nav>

        <motion.section {...fadeUp}>
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium mb-4">Compatibilidad</p>
          <h1 className="font-heading text-4xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.1]">
            Compatibilidad simbólica
          </h1>
          <p className="text-base text-muted mt-4 max-w-xl leading-relaxed">
            Ingresá las fechas de nacimiento de dos personas para ver cómo se conectan según el zodiaco chino. No se guardan datos.
          </p>
        </motion.section>

        {/* Formulario */}
        <motion.section {...fadeUp} className="mt-12 sm:mt-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Persona 1 */}
            <div className="p-6 rounded-md border border-border bg-card shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-4">Persona 1</p>
              <div className="space-y-3">
                <select value={p1.day} onChange={(e) => setP1({ ...p1, day: e.target.value })} className="input" aria-label="Día persona 1">
                  <option value="">Día</option>
                  {Array.from({ length: days1Valid }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, "0")}>{i + 1}</option>
                  ))}
                </select>
                <select value={p1.month} onChange={(e) => setP1({ ...p1, month: e.target.value })} className="input" aria-label="Mes persona 1">
                  <option value="">Mes</option>
                  {MONTHS.map((m) => (<option key={m.value} value={m.value}>{m.label}</option>))}
                </select>
                <select value={p1.year} onChange={(e) => setP1({ ...p1, year: e.target.value })} className="input" aria-label="Año persona 1">
                  <option value="">Año</option>
                  {Array.from({ length: 100 }, (_, i) => 2010 - i).map((y) => (
                    <option key={y} value={String(y)}>{y}</option>
                  ))}
                </select>
              </div>
              {person1 && (
                <div className="mt-4 p-3 rounded-md bg-background text-sm text-muted">
                  {person1.animal} · {person1.sunSign} · Camino de Vida {person1.lifePath}
                </div>
              )}
            </div>

            {/* Persona 2 */}
            <div className="p-6 rounded-md border border-border bg-card shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-4">Persona 2</p>
              <div className="space-y-3">
                <select value={p2.day} onChange={(e) => setP2({ ...p2, day: e.target.value })} className="input" aria-label="Día persona 2">
                  <option value="">Día</option>
                  {Array.from({ length: days2Valid }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, "0")}>{i + 1}</option>
                  ))}
                </select>
                <select value={p2.month} onChange={(e) => setP2({ ...p2, month: e.target.value })} className="input" aria-label="Mes persona 2">
                  <option value="">Mes</option>
                  {MONTHS.map((m) => (<option key={m.value} value={m.value}>{m.label}</option>))}
                </select>
                <select value={p2.year} onChange={(e) => setP2({ ...p2, year: e.target.value })} className="input" aria-label="Año persona 2">
                  <option value="">Año</option>
                  {Array.from({ length: 100 }, (_, i) => 2010 - i).map((y) => (
                    <option key={y} value={String(y)}>{y}</option>
                  ))}
                </select>
              </div>
              {person2 && (
                <div className="mt-4 p-3 rounded-md bg-background text-sm text-muted">
                  {person2.animal} · {person2.sunSign} · Camino de Vida {person2.lifePath}
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* Resultado */}
        <AnimatePresence>
          {compatibility && (
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
                    className="text-xs uppercase tracking-[0.25em] text-accent font-medium mb-3"
                  >
                    Compatibilidad
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="number-display text-[5rem] sm:text-[7rem] leading-none"
                    style={{
                      color: compatibility.score >= 75 ? "var(--score-excellent)" : compatibility.score >= 55 ? "var(--score-good)" : "var(--score-neutral)"
                    }}
                  >
                    {compatibility.score}%
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="font-heading text-xl font-semibold text-foreground mt-4"
                  >
                    {compatibility.label}
                  </motion.p>
                </div>

                {/* Desglose */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="max-w-lg mx-auto mb-6"
                >
                  <div className="p-4 rounded-md bg-card border border-border text-center transition-colors hover:border-accent/30">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-1">Zodiaco Chino</p>
                    <p className="text-2xl font-heading font-bold" style={{ color: compatibility.zodiacScore >= 70 ? "var(--score-excellent)" : "var(--score-good)" }}>{compatibility.zodiacScore}%</p>
                  </div>
                </motion.div>

                {/* Explicación */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="max-w-lg mx-auto text-center"
                >
                  <p className="text-sm text-muted leading-relaxed">{compatibility.description}</p>
                </motion.div>
              </motion.div>

              {/* Disclaimer */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.35 }}
                className="mt-6 p-4 rounded-md border border-border bg-card shadow-sm"
              >
                <p className="text-xs text-muted leading-relaxed">
                  <strong>Fórmula:</strong> 100% relación zodiacal (animal del usuario vs animal de la otra persona). Esta es una interpretación simbólica. No constituye evidencia científica ni predice el resultado de una relación.
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
                    const text = `Compatibilidad zodiacal: ${compatibility.score}% — ${compatibility.label}. Calculá la tuya en Molino.`;
                    if (navigator.share) {
                      navigator.share({ title: "Compatibilidad — Molino", text }).catch(() => {});
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
                  <p className="text-sm text-muted mb-3">Querés una experiencia más completa con tu perfil personal?</p>
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
