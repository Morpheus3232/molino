"use client";
import { useL, type Pick2 } from "@/lib/i18n/useL";

import { useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import Button from "@/components/ui/Button";
import { getChineseZodiac, getChineseZodiacInfo, getChineseElement } from "@/lib/engines/chineseZodiacEngine";
import { CHINESE_ANIMALS } from "@/lib/data/zodiaco-chino-content";
import ZodiacAnimalIcon from "@/components/ui/ZodiacAnimalIcon";
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

const ELEMENT_COLORS: Record<string, string> = {
  "Madera": "var(--element-wood)",
  "Fuego": "var(--element-fire)",
  "Tierra": "#777777",
  "Metal": "var(--element-metal)",
  "Agua": "var(--element-water)",
};

export default function ZodiacoChinoCalcPage() {
  const L = useL();
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
      <main className="mx-auto max-w-[900px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24" id="main-content">

        <nav className="text-xs text-muted mb-8" aria-label="Breadcrumb">{L(<>
          <Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">Inicio</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <Link href="/herramientas" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">Herramientas</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <span className="text-foreground font-medium" aria-current="page">Zodiaco Chino</span>
        </>, <><Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">Home</Link><span className="mx-2" aria-hidden="true">&rsaquo;</span><Link href="/herramientas" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">Tools</Link><span className="mx-2" aria-hidden="true">&rsaquo;</span><span className="text-foreground font-medium" aria-current="page">Chinese Zodiac</span></>)}</nav>

        <motion.section {...fadeUp}>
          <h1 className="page-title text-foreground">{L("Tu animal del zodiaco chino", "Your Chinese zodiac animal")}</h1>
          <p className="text-base text-muted mt-4 max-w-xl leading-relaxed">{L("El zodiaco chino es un sistema de más de 2000 años que asigna un animal y un elemento a cada año en un ciclo de 60 combinaciones. Ingresá tu fecha de nacimiento para descubrir tu lugar en este ciclo.", "The Chinese zodiac is a system more than 2,000 years old that assigns an animal and an element to each year in a cycle of 60 combinations. Enter your date of birth to discover your place in this cycle.")}</p>
          <SectionCover imageKey="herramientas/zodiaco-chino" priority className="mt-8 max-w-3xl" />
        </motion.section>

        {/* Formulario */}
        <motion.section {...fadeUp} className="mt-12 sm:mt-16">
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-sm text-muted font-medium mb-2 label-caps">{L("Fecha de nacimiento", "Date of birth")}</label>
              <div className="flex gap-3">
                <select value={day} onChange={(e) => setDay(e.target.value)} className="input flex-1" aria-label={L("Día", "Day")}>
                  <option value="">{L("Día", "Day")}</option>
                  {Array.from({ length: daysInMonth }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, "0")}>{i + 1}</option>
                  ))}
                </select>
                <select value={month} onChange={(e) => setMonth(e.target.value)} className="input flex-1" aria-label={L("Mes", "Month")}>
                  <option value="">{L("Mes", "Month")}</option>
                  {MONTHS(L).map((m) => (
                    <option key={m.value} value={m.value}>{L.t(m.label)}</option>
                  ))}
                </select>
                <select value={year} onChange={(e) => setYear(e.target.value)} className="input flex-1" aria-label={L("Año", "Year")}>
                  <option value="">{L("Año", "Year")}</option>
                  {Array.from({ length: 100 }, (_, i) => 2010 - i).map((y) => (
                    <option key={y} value={String(y)}>{L.t(y)}</option>
                  ))}
                </select>
              </div>
            </div>
            <Button variant="primary" fullWidth onClick={handleCalculate} disabled={!isValid}>{L("Calcular mi animal", "Calculate my animal")}</Button>
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
                className="p-8 sm:p-12 rounded-md border border-accent/20 bg-accent/[0.03] hover:border-accent/40 transition-colors duration-300"
              >
                <div className="text-center mb-10">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="text-sm text-accent font-medium mb-4 label-caps"
                  >{L("Tu Animal del Zodiaco Chino", "Your Chinese Zodiac Animal")}</motion.p>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="flex justify-center text-accent mb-4"
                  >
                    <ZodiacAnimalIcon animal={result.animal} size={88} />
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="font-heading text-4xl sm:text-5xl font-semibold text-foreground"
                  >
                    {L.t(result.animal)}
                  </motion.h2>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.35 }}
                    className="flex items-center justify-center gap-3 mt-4"
                  >
                    <span className="px-4 py-1.5 rounded-sm text-sm font-medium border border-border transition-colors hover:border-accent/40" style={{ borderColor: ELEMENT_COLORS[result.element] || "var(--element-fire)", color: ELEMENT_COLORS[result.element] || "var(--element-fire)" }}>
                      {L.t(result.element)}
                    </span>
                  </motion.div>
                </div>

                {/* Información del animal */}
                {L.t((() => {
                  const animalData = getAnimalData(result.animal);
                  return animalData ? (
                    <div className="max-w-2xl mx-auto space-y-8">
                      {/* Significado */}
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55, duration: 0.4 }}
                      >
                        <h3 className="font-heading text-lg font-semibold text-muted mb-3">{L("Significado", "Meaning")}</h3>
                        <p className="text-sm text-foreground leading-relaxed">{L.t(animalData.meaning)}</p>
                      </motion.div>

                      {/* Historia */}
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                      >
                        <h3 className="font-heading text-lg font-semibold text-muted mb-3">{L("Historia y simbolismo", "History and symbolism")}</h3>
                        <p className="text-sm text-muted leading-relaxed">{L.t(animalData.history)}</p>
                      </motion.div>

                      {/* Características */}
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65, duration: 0.4 }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                      >
                        <div className="p-4 rounded-md border border-border bg-card shadow-sm transition-colors hover:border-accent/30">
                          <h3 className="font-heading text-lg font-semibold text-accent mb-2">{L("Características", "Characteristics")}</h3>
                          <p className="text-sm text-foreground">{L.t(animalData.traits.map(L.t).join(", "))}</p>
                        </div>
                        <div className="p-4 rounded-md border border-border bg-card shadow-sm transition-colors hover:border-accent/30">
                          <h3 className="font-heading text-lg font-semibold text-accent mb-2">{L("Fortalezas", "Strengths")}</h3>
                          <p className="text-sm text-foreground">{L.t(animalData.strengths.slice(0, 3).map(L.t).join(", "))}</p>
                        </div>
                        <div className="p-4 rounded-md border border-border bg-card shadow-sm transition-colors hover:border-accent/30">
                          <h3 className="font-heading text-lg font-semibold text-muted mb-2">{L("Desafíos", "Challenges")}</h3>
                          <p className="text-sm text-foreground">{L.t(animalData.challenges.slice(0, 3).map(L.t).join(", "))}</p>
                        </div>
                      </motion.div>

                      {/* Compatibilidades */}
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.4 }}
                      >
                        <h3 className="font-heading text-lg font-semibold text-muted mb-3">{L("Tus dos amigos (三合)", "Your two friends (三合)")}</h3>
                        <div className="flex flex-wrap gap-2">
                          {animalData.compatibility.friendly.map(f => (
                            <span key={f} className="text-sm px-3 py-1 rounded-md border border-border text-foreground transition-colors hover:border-accent/40">{L.t(f)}</span>
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
                          <h3 className="font-heading text-lg font-semibold text-muted mb-3">{L("Años correspondientes", "Corresponding years")}</h3>
                          <p className="text-sm text-foreground">{L.t(getYearRange(animalIndex))}</p>
                        </motion.div>
                      )}

                      {/* Los 5 elementos */}
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.4 }}
                      >
                        <h3 className="font-heading text-lg font-semibold text-muted mb-3">{L("Los 5 elementos", "The 5 elements")}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {animalData.elements.map((el) => (
                            <div key={el.element} className="p-4 rounded-md border border-border bg-card shadow-sm transition-colors hover:border-accent/30">
                              <p className="text-sm font-medium text-foreground">{L(<>{L.t(result.animal)} de {L.t(el.element)}</>, <>{L.t(el.element)} {L.t(result.animal)}</>)}</p>
                              <p className="text-xs text-muted mt-1">{L.t(el.modifier)}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>

                      {/* Nota sobre el calendario */}
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.85, duration: 0.4 }}
                        className="p-4 rounded-md border border-border bg-card shadow-sm"
                      >
                        <p className="text-xs text-muted leading-relaxed">{L(<>
                          <strong>Nota:</strong> El zodiaco chino sigue el calendario lunar. Para fechas cercanas al Año Nuevo chino (enero-febrero), el animal puede diferir. Molino utiliza el año gregoriano como convención.
                        </>, <><strong>Note:</strong> The Chinese zodiac follows the lunar calendar. For dates close to Chinese New Year (January–February), the animal may differ. Molino uses the Gregorian year as a convention.</>)}</p>
                      </motion.div>
                    </div>
                  ) : null;
                })())}
              </motion.div>

              {/* Disclaimer */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.35 }}
                className="mt-6 p-4 rounded-md border border-border bg-card shadow-sm"
              >
                <p className="text-xs text-muted leading-relaxed">{L(<>
                  <strong>Nota:</strong> El zodiaco chino es un sistema de creencias milenario. Molino lo utiliza como herramienta de reflexión y autoconocimiento. Las interpretaciones no constituyen evidencia científica.
                </>, <><strong>Note:</strong> The Chinese zodiac is an age-old belief system. Molino uses it as a tool for reflection and self-knowledge. The interpretations do not constitute scientific evidence.</>)}</p>
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
                    const text = L(`Soy ${result.animal} de elemento ${result.element}. Leé tu animal del zodiaco chino en Molino.`, `I'm a ${L.t(result.element)} ${L.t(result.animal)}. Read your Chinese zodiac animal on Molino.`);
                    if (navigator.share) {
                      navigator.share({ title: L(`Mi Zodiaco Chino — ${result.animal}`, `My Chinese Zodiac — ${L.t(result.animal)}`), text }).catch(() => {});
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
                  <p className="text-sm text-muted mb-3">{L("¿Querés ver cómo tu animal se conecta con numerología y astrología?", "Want to see how your animal connects with numerology and astrology?")}</p>
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
