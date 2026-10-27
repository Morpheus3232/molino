"use client";
import { useL, type Pick2 } from "@/lib/i18n/useL";

import { useState, useMemo } from "react";
import { Link } from "@/lib/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import { calculateLifePath } from "@/lib/engines/numerologyEngine";
import { getSunSign } from "@/lib/engines/astrologyEngine";
import { getChineseZodiac } from "@/lib/engines/chineseZodiacEngine";
import { getCompatibilityDescription } from "@/lib/data";
import { getRelation, type Animal } from "@/lib/data/animalRelations";
import SectionCover from "@/components/ui/SectionCover";

const MONTHS = (L: Pick2) => ([
  { value: "01", label: L("Enero", "January") }, { value: "02", label: L("Febrero", "February") },
  { value: "03", label: L("Marzo", "March") }, { value: "04", label: L("Abril", "April") },
  { value: "05", label: L("Mayo", "May") }, { value: "06", label: L("Junio", "June") },
  { value: "07", label: L("Julio", "July") }, { value: "08", label: L("Agosto", "August") },
  { value: "09", label: L("Septiembre", "September") }, { value: "10", label: L("Octubre", "October") },
  { value: "11", label: L("Noviembre", "November") }, { value: "12", label: L("Diciembre", "December") },
]);

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
  const L = useL();
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
      <main className="mx-auto max-w-[900px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24" id="main-content">

        <nav className="text-xs text-muted mb-8" aria-label="Breadcrumb">{L(<>
          <Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">Inicio</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <Link href="/herramientas" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">Herramientas</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <span className="text-foreground font-medium" aria-current="page">Compatibilidad</span>
        </>, <><Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">Home</Link><span className="mx-2" aria-hidden="true">&rsaquo;</span><Link href="/herramientas" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">Tools</Link><span className="mx-2" aria-hidden="true">&rsaquo;</span><span className="text-foreground font-medium" aria-current="page">Compatibility</span></>)}</nav>

        <motion.section {...fadeUp}>
          <h1 className="page-title text-foreground">{L("Compatibilidad simbólica", "Symbolic compatibility")}</h1>
          <p className="text-base text-muted mt-4 max-w-xl leading-relaxed">{L("Ingresá las fechas de nacimiento de dos personas para ver cómo se conectan según el zodiaco chino. No se guardan datos.", "Enter the dates of birth of two people to see how they connect according to the Chinese zodiac. No data is saved.")}</p>
          <SectionCover imageKey="herramientas/compatibilidad" priority className="mt-8 max-w-3xl" />
        </motion.section>

        {/* Formulario */}
        <motion.section {...fadeUp} className="mt-12 sm:mt-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Persona 1 */}
            <div className="p-6 rounded-md border border-border bg-card shadow-sm">
              <h3 className="font-heading text-lg font-semibold text-accent mb-4">{L("Persona 1", "Person 1")}</h3>
              <div className="space-y-3">
                <select value={p1.day} onChange={(e) => setP1({ ...p1, day: e.target.value })} className="input" aria-label={L("Día persona 1", "Person 1 day")}>
                  <option value="">{L("Día", "Day")}</option>
                  {Array.from({ length: days1Valid }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, "0")}>{i + 1}</option>
                  ))}
                </select>
                <select value={p1.month} onChange={(e) => setP1({ ...p1, month: e.target.value })} className="input" aria-label={L("Mes persona 1", "Person 1 month")}>
                  <option value="">{L("Mes", "Month")}</option>
                  {MONTHS(L).map((m) => (<option key={m.value} value={m.value}>{L.t(m.label)}</option>))}
                </select>
                <select value={p1.year} onChange={(e) => setP1({ ...p1, year: e.target.value })} className="input" aria-label={L("Año persona 1", "Person 1 year")}>
                  <option value="">{L("Año", "Year")}</option>
                  {Array.from({ length: 100 }, (_, i) => 2010 - i).map((y) => (
                    <option key={y} value={String(y)}>{L.t(y)}</option>
                  ))}
                </select>
              </div>
              {person1 && (
                <div className="mt-4 p-3 rounded-md bg-background text-sm text-muted">{L(<>
                  {L.t(person1.animal)} · {L.t(person1.sunSign)} · Camino de Vida {L.t(person1.lifePath)}
                </>, <>{L.t(person1.animal)} · {L.t(person1.sunSign)} · Life Path {L.t(person1.lifePath)}</>)}</div>
              )}
            </div>

            {/* Persona 2 */}
            <div className="p-6 rounded-md border border-border bg-card shadow-sm">
              <h3 className="font-heading text-lg font-semibold text-accent mb-4">{L("Persona 2", "Person 2")}</h3>
              <div className="space-y-3">
                <select value={p2.day} onChange={(e) => setP2({ ...p2, day: e.target.value })} className="input" aria-label={L("Día persona 2", "Person 2 day")}>
                  <option value="">{L("Día", "Day")}</option>
                  {Array.from({ length: days2Valid }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, "0")}>{i + 1}</option>
                  ))}
                </select>
                <select value={p2.month} onChange={(e) => setP2({ ...p2, month: e.target.value })} className="input" aria-label={L("Mes persona 2", "Person 2 month")}>
                  <option value="">{L("Mes", "Month")}</option>
                  {MONTHS(L).map((m) => (<option key={m.value} value={m.value}>{L.t(m.label)}</option>))}
                </select>
                <select value={p2.year} onChange={(e) => setP2({ ...p2, year: e.target.value })} className="input" aria-label={L("Año persona 2", "Person 2 year")}>
                  <option value="">{L("Año", "Year")}</option>
                  {Array.from({ length: 100 }, (_, i) => 2010 - i).map((y) => (
                    <option key={y} value={String(y)}>{L.t(y)}</option>
                  ))}
                </select>
              </div>
              {person2 && (
                <div className="mt-4 p-3 rounded-md bg-background text-sm text-muted">{L(<>
                  {L.t(person2.animal)} · {L.t(person2.sunSign)} · Camino de Vida {L.t(person2.lifePath)}
                </>, <>{L.t(person2.animal)} · {L.t(person2.sunSign)} · Life Path {L.t(person2.lifePath)}</>)}</div>
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
                    className="text-sm text-accent font-medium mb-3 label-caps"
                  >{L("Compatibilidad", "Compatibility")}</motion.p>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="font-heading text-3xl sm:text-4xl font-semibold leading-tight first-letter:uppercase"
                    style={{
                      color: compatibility.score >= 75 ? "var(--score-excellent)" : compatibility.score >= 55 ? "var(--score-good)" : "var(--score-neutral)"
                    }}
                  >
                    {L.t(compatibility.label)}
                  </motion.p>
                </div>

                {/* Explicación */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="max-w-lg mx-auto text-center"
                >
                  <p className="text-sm text-muted leading-relaxed">{L.t(compatibility.description)}</p>
                </motion.div>
              </motion.div>

              {/* Disclaimer */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.35 }}
                className="mt-6 p-4 rounded-md border border-border bg-card shadow-sm"
              >
                <p className="text-xs text-muted leading-relaxed">{L(<>
                  <strong>Fórmula:</strong> relación zodiacal entre el animal del usuario y el de la otra persona. Esta es una interpretación simbólica. No constituye evidencia científica ni predice el resultado de una relación.
                </>, <><strong>Formula:</strong> the zodiac relationship between the user's animal and the other person's. This is a symbolic interpretation. It doesn't constitute scientific evidence or predict how a relationship will turn out.</>)}</p>
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
                    const text = L(`Compatibilidad zodiacal: ${compatibility.label}. Calculá la tuya en Molino.`, `Zodiac compatibility: ${L.t(compatibility.label)}. Calculate yours on Molino.`);
                    if (navigator.share) {
                      navigator.share({ title: L("Compatibilidad", "Compatibility"), text }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(text).then(() => {});
                    }
                  }}
                  className="page-eyebrow justify-center font-medium transition-all text-sm hover:bg-accent/20 hover:border-accent/30 min-h-[40px]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {L("Compartir resultado", "Share result")}
                </button>
                <div>
                  <p className="text-sm text-muted mb-3">{L("¿Querés una experiencia más completa con tu perfil personal?", "Want a fuller experience with your personal profile?")}</p>
                  <Link
                    href="/onboarding"
                    className="inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all px-6 py-3 text-sm bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground min-h-[44px] focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2"
                  >{L("Crear tu mapa completo", "Create your complete map")}</Link>
                </div>
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
