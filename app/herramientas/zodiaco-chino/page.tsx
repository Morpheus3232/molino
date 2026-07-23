"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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

        <nav className="text-xs text-muted mb-8">
          <span className="hover:text-accent cursor-pointer" onClick={() => router.push("/")}>Inicio</span>
          <span className="mx-2">&rsaquo;</span>
          <span className="hover:text-accent cursor-pointer" onClick={() => router.push("/herramientas")}>Herramientas</span>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-foreground font-medium">Zodiaco Chino</span>
        </nav>

        <motion.section {...fadeUp}>
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-4">Zodiaco Chino</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.1]">
            Tu animal del zodiaco chino
          </h1>
          <p className="text-base text-muted mt-4 max-w-xl leading-relaxed">
            El zodiaco chino es un sistema de m&aacute;s de 2000 a&ntilde;os que asigna un animal y un elemento a cada a&ntilde;o en un ciclo de 60 combinaciones. Ingres&aacute; tu fecha de nacimiento para descubrir tu lugar en este ciclo.
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
              className="mt-12 sm:mt-16"
            >
              {/* Hero del resultado */}
              <div className="p-8 sm:p-12 rounded-2xl border border-accent/20 bg-accent/[0.03]">
                <div className="text-center mb-10">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-medium mb-4">Tu Animal del Zodiaco Chino</p>
                  <p className="text-7xl sm:text-8xl mb-4">
                    {getAnimalData(result.animal)?.emoji || "\ud83d\udc09"}
                  </p>
                  <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground">
                    {result.animal}
                  </h2>
                  <div className="flex items-center justify-center gap-3 mt-4">
                    <span className="px-4 py-1.5 rounded-full text-sm font-medium border border-border" style={{ borderColor: ELEMENT_COLORS[result.element] || "var(--element-fire)", color: ELEMENT_COLORS[result.element] || "var(--element-fire)" }}>
                      {result.element}
                    </span>
                  </div>
                </div>

                {/* Informaci&oacute;n del animal */}
                {(() => {
                  const animalData = getAnimalData(result.animal);
                  return animalData ? (
                    <div className="max-w-2xl mx-auto space-y-8">
                      {/* Significado */}
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Significado</p>
                        <p className="text-sm text-foreground leading-relaxed">{animalData.meaning}</p>
                      </div>

                      {/* Historia */}
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Historia y simbolismo</p>
                        <p className="text-sm text-muted leading-relaxed">{animalData.history}</p>
                      </div>

                      {/* Caracter&iacute;sticas */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl border border-border bg-card">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-2">Caracter&iacute;sticas</p>
                          <p className="text-sm text-foreground">{animalData.traits.join(", ")}</p>
                        </div>
                        <div className="p-4 rounded-xl border border-border bg-card">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-2">Fortalezas</p>
                          <p className="text-sm text-foreground">{animalData.strengths.slice(0, 3).join(", ")}</p>
                        </div>
                        <div className="p-4 rounded-xl border border-border bg-card">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Desaf&iacute;os</p>
                          <p className="text-sm text-foreground">{animalData.challenges.slice(0, 3).join(", ")}</p>
                        </div>
                      </div>

                      {/* Compatibilidades */}
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Compatibilidades tradicionales</p>
                        <div className="flex flex-wrap gap-2">
                          {animalData.compatibility.friendly.map(f => (
                            <span key={f} className="text-sm px-3 py-1 rounded-full border border-border text-foreground">{f}</span>
                          ))}
                        </div>
                      </div>

                      {/* A&ntilde;os */}
                      {animalIndex >= 0 && (
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">A&ntilde;os correspondientes</p>
                          <p className="text-sm text-foreground">{getYearRange(animalIndex)}</p>
                        </div>
                      )}

                      {/* Los 5 elementos */}
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Los 5 elementos</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {animalData.elements.map((el) => (
                            <div key={el.element} className="p-3 rounded-xl border border-border bg-card">
                              <p className="text-sm font-medium text-foreground">{result.animal} de {el.element}</p>
                              <p className="text-xs text-muted mt-1">{el.modifier}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Nota sobre el calendario */}
                      <div className="p-4 rounded-xl border border-border bg-card">
                        <p className="text-xs text-muted leading-relaxed">
                          <strong>Nota:</strong> El zodiaco chino sigue el calendario lunar. Para fechas cercanas al A&ntilde;o Nuevo chino (enero-febrero), el animal puede diferir. Molino utiliza el a&ntilde;o gregoriano como convenci&oacute;n.
                        </p>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>

              {/* Disclaimer */}
              <div className="mt-6 p-4 rounded-xl border border-border bg-card">
                <p className="text-xs text-muted leading-relaxed">
                  <strong>Nota:</strong> El zodiaco chino es un sistema de creencias milenario. Molino lo utiliza como herramienta de reflexi&oacute;n y autoconocimiento. Las interpretaciones no constituyen evidencia cient&iacute;fica.
                </p>
              </div>

              {/* CTA */}
              <div className="mt-8 text-center">
                <p className="text-sm text-muted mb-4">Quer&eacute;s ver c&oacute;mo tu animal se conecta con numerolog&iacute;a y astrolog&iacute;a?</p>
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
