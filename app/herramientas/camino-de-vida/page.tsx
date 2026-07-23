"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
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
  const router = useRouter();
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
      <UniversityHeader />
      <main className="mx-auto max-w-[900px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">

        <nav className="text-xs text-muted mb-8">
          <span className="hover:text-accent cursor-pointer" onClick={() => router.push("/")}>Inicio</span>
          <span className="mx-2">&rsaquo;</span>
          <span className="hover:text-accent cursor-pointer" onClick={() => router.push("/herramientas")}>Herramientas</span>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-foreground font-medium">Camino de Vida</span>
        </nav>

        <motion.section {...fadeUp}>
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-4">Numerolog&iacute;a</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.1]">
            Camino de Vida
          </h1>
          <p className="text-base text-muted mt-4 max-w-xl leading-relaxed">
            Calcul&aacute; tu n&uacute;mero de Camino de Vida a partir de tu fecha de nacimiento. Seg&uacute;n la tradici&oacute;n numerol&oacute;gica, este n&uacute;mero revela tu energ&iacute;a central.
          </p>
        </motion.section>

        {/* Formulario */}
        <motion.section {...fadeUp} className="mt-12 sm:mt-16">
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Fecha de nacimiento</label>
              <div className="flex gap-3">
                <select value={day} onChange={(e) => setDay(e.target.value)} className="input flex-1" aria-label="D&iacute;a">
                  <option value="">D&iacute;a</option>
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
                <select value={year} onChange={(e) => setYear(e.target.value)} className="input flex-1" aria-label="A&ntilde;o">
                  <option value="">A&ntilde;o</option>
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
              Calcular Camino de Vida
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
              className="mt-12 sm:mt-16"
            >
              <div className="p-8 sm:p-10 rounded-2xl border border-accent/20 bg-accent/[0.03]">
                <div className="text-center mb-8">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-medium mb-3">Tu Camino de Vida</p>
                  <p className="number-display text-[6rem] sm:text-[8rem] leading-none" style={{ color: "var(--element-fire)" }}>
                    {result.lifePath}
                  </p>
                  <p className="font-serif text-2xl font-semibold text-foreground mt-4">{result.meaning.archetype}</p>
                  <p className="text-sm text-muted mt-2">{result.meaning.meaning}</p>
                </div>
                <p className="text-sm text-muted leading-relaxed max-w-lg mx-auto text-center">
                  {result.meaning.description}
                </p>
              </div>

              {/* Disclaimer */}
              <div className="mt-6 p-4 rounded-xl border border-border bg-card">
                <p className="text-xs text-muted leading-relaxed">
                  <strong>Nota:</strong> El Camino de Vida es una interpretaci&oacute;n simb&oacute;lica de la tradici&oacute;n numerol&oacute;gica. No constituye evidencia cient&iacute;fica ni predice el futuro. Molino lo utiliza como herramienta de reflexi&oacute;n.
                </p>
              </div>

              {/* CTA */}
              <div className="mt-8 text-center">
                <p className="text-sm text-muted mb-4">Quer&eacute;s ver c&oacute;mo esto se conecta con astrolog&iacute;a y zodiaco chino?</p>
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
