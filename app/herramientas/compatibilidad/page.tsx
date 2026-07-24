"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import { calculateLifePath } from "@/lib/engines/numerologyEngine";
import { getSunSign } from "@/lib/engines/astrologyEngine";
import { getChineseZodiac } from "@/lib/engines/chineseZodiacEngine";
import { getCompatibilityScore, getCompatibilityDescription } from "@/lib/data";

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

const ZODIAC_COMPAT_TABLE: Record<number, { label: string; score: number }> = {
  0: { label: "Mismo signo", score: 80 },
  1: { label: "Adyacentes", score: 70 },
  2: { label: "Amigos", score: 65 },
  3: { label: "Tensi\u00f3n productiva", score: 45 },
  4: { label: "Neutrales", score: 55 },
  5: { label: "Desaf\u00edo", score: 35 },
  6: { label: "Opuestos", score: 90 },
  7: { label: "Desaf\u00edo intenso", score: 30 },
  8: { label: "Coexistencia", score: 55 },
  9: { label: "Aprender del otro", score: 40 },
  10: { label: "Respeto mutuo", score: 60 },
  11: { label: "Complementarios", score: 70 },
};

export default function CompatibilidadCalcPage() {
  const router = useRouter();
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
    const animals = ["Rata", "Buey", "Tigre", "Conejo", "Drag\u00f3n", "Serpiente", "Caballo", "Cabra", "Mono", "Gallo", "Perro", "Cerdo"];
    const i1 = animals.indexOf(person1.animal);
    const i2 = animals.indexOf(person2.animal);
    const diff = Math.abs(i1 - i2) % 12;
    const zodiacData = ZODIAC_COMPAT_TABLE[diff] || { label: "Neutral", score: 50 };
    const numerologyScore = getCompatibilityScore(person1.animal, person2.animal);
    const finalScore = Math.round(zodiacData.score * 0.7 + numerologyScore * 0.3);

    return {
      score: finalScore,
      zodiacScore: zodiacData.score,
      numerologyScore,
      label: zodiacData.label,
      description: getCompatibilityDescription(finalScore, person2.animal),
    };
  }, [person1, person2]);

  const days1Valid = p1.month && p1.year ? getDaysInMonth(p1.month, p1.year) : 31;
  const days2Valid = p2.month && p2.year ? getDaysInMonth(p2.month, p2.year) : 31;

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />
      <main className="mx-auto max-w-[900px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">

        <nav className="text-xs text-muted mb-8">
          <span className="hover:text-accent cursor-pointer" onClick={() => router.push("/")}>Inicio</span>
          <span className="mx-2">&rsaquo;</span>
          <span className="hover:text-accent cursor-pointer" onClick={() => router.push("/herramientas")}>Herramientas</span>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-foreground font-medium">Compatibilidad</span>
        </nav>

        <motion.section {...fadeUp}>
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-4">Compatibilidad</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.1]">
            Compatibilidad simb&oacute;lica
          </h1>
          <p className="text-base text-muted mt-4 max-w-xl leading-relaxed">
            Ingres&aacute; las fechas de nacimiento de dos personas para ver c&oacute;mo se conectan seg&uacute;n el zodiaco chino y la numerolog&iacute;a. No se guardan datos.
          </p>
        </motion.section>

        {/* Formulario */}
        <motion.section {...fadeUp} className="mt-12 sm:mt-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Persona 1 */}
            <div className="p-6 rounded-xl border border-border bg-card">
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-4">Persona 1</p>
              <div className="space-y-3">
                <select value={p1.day} onChange={(e) => setP1({ ...p1, day: e.target.value })} className="input" aria-label="D&iacute;a persona 1">
                  <option value="">D&iacute;a</option>
                  {Array.from({ length: days1Valid }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, "0")}>{i + 1}</option>
                  ))}
                </select>
                <select value={p1.month} onChange={(e) => setP1({ ...p1, month: e.target.value })} className="input" aria-label="Mes persona 1">
                  <option value="">Mes</option>
                  {MONTHS.map((m) => (<option key={m.value} value={m.value}>{m.label}</option>))}
                </select>
                <select value={p1.year} onChange={(e) => setP1({ ...p1, year: e.target.value })} className="input" aria-label="A&ntilde;o persona 1">
                  <option value="">A&ntilde;o</option>
                  {Array.from({ length: 100 }, (_, i) => 2010 - i).map((y) => (
                    <option key={y} value={String(y)}>{y}</option>
                  ))}
                </select>
              </div>
              {person1 && (
                <div className="mt-4 p-3 rounded-lg bg-background text-sm text-muted">
                  {person1.animal} · {person1.sunSign} · Camino de Vida {person1.lifePath}
                </div>
              )}
            </div>

            {/* Persona 2 */}
            <div className="p-6 rounded-xl border border-border bg-card">
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-4">Persona 2</p>
              <div className="space-y-3">
                <select value={p2.day} onChange={(e) => setP2({ ...p2, day: e.target.value })} className="input" aria-label="D&iacute;a persona 2">
                  <option value="">D&iacute;a</option>
                  {Array.from({ length: days2Valid }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, "0")}>{i + 1}</option>
                  ))}
                </select>
                <select value={p2.month} onChange={(e) => setP2({ ...p2, month: e.target.value })} className="input" aria-label="Mes persona 2">
                  <option value="">Mes</option>
                  {MONTHS.map((m) => (<option key={m.value} value={m.value}>{m.label}</option>))}
                </select>
                <select value={p2.year} onChange={(e) => setP2({ ...p2, year: e.target.value })} className="input" aria-label="A&ntilde;o persona 2">
                  <option value="">A&ntilde;o</option>
                  {Array.from({ length: 100 }, (_, i) => 2010 - i).map((y) => (
                    <option key={y} value={String(y)}>{y}</option>
                  ))}
                </select>
              </div>
              {person2 && (
                <div className="mt-4 p-3 rounded-lg bg-background text-sm text-muted">
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
              className="mt-12 sm:mt-16"
            >
              <div className="p-8 sm:p-10 rounded-2xl border border-accent/20 bg-accent/[0.03]">
                <div className="text-center mb-8">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-medium mb-3">Compatibilidad</p>
                  <p className="number-display text-[5rem] sm:text-[7rem] leading-none" style={{
                    color: compatibility.score >= 75 ? "var(--score-excellent)" : compatibility.score >= 55 ? "var(--score-good)" : "var(--score-neutral)"
                  }}>
                    {compatibility.score}%
                  </p>
                  <p className="font-serif text-xl font-semibold text-foreground mt-4">{compatibility.label}</p>
                </div>

                {/* Desglose */}
                <div className="max-w-lg mx-auto grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-card border border-border text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-1">Zodiaco Chino</p>
                    <p className="text-2xl font-serif font-bold" style={{ color: compatibility.zodiacScore >= 70 ? "var(--score-excellent)" : "var(--score-good)" }}>{compatibility.zodiacScore}%</p>
                  </div>
                  <div className="p-4 rounded-xl bg-card border border-border text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-1">Numerolog&iacute;a</p>
                    <p className="text-2xl font-serif font-bold" style={{ color: compatibility.numerologyScore >= 70 ? "var(--score-excellent)" : "var(--score-good)" }}>{compatibility.numerologyScore}%</p>
                  </div>
                </div>

                {/* Explicaci&oacute;n */}
                <div className="max-w-lg mx-auto text-center">
                  <p className="text-sm text-muted leading-relaxed">{compatibility.description}</p>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-6 p-4 rounded-xl border border-border bg-card">
                <p className="text-xs text-muted leading-relaxed">
                  <strong>F&oacute;rmula:</strong> 70% Zodiaco Chino + 30% Numerolog&iacute;a. Esta es una interpretaci&oacute;n simb&oacute;lica. No constituye evidencia cient&iacute;fica ni predice el resultado de una relaci&oacute;n.
                </p>
              </div>

              {/* CTA */}
              <div className="mt-8 text-center">
                <p className="text-sm text-muted mb-4">Quer&eacute;s una experiencia m&aacute;s completa con tu perfil personal?</p>
                <button
                  type="button"
                  onClick={() => router.push("/onboarding")}
                  className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all px-6 py-3 text-sm bg-primary text-primary-foreground shadow-sm hover:bg-accent hover:text-accent-foreground min-h-[44px]"
                >
                  Crear tu mapa completo
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

      </main>
      <UniversityFooter />
    </div>
  );
}
