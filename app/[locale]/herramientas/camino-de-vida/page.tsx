"use client";
import { useL, type Pick2 } from "@/lib/i18n/useL";

import { useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import Button from "@/components/ui/Button";
import { calculateLifePath } from "@/lib/engines/numerologyEngine";
import { ARCHETYPES } from "@/lib/data";
import { getCompatibilityDescription } from "@/lib/data";
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

const LIFE_PATH_MEANINGS = (L: Pick2): Record<number, { meaning: string; archetype: string; description: string }> => ({
  1: { meaning: L("Liderazgo e iniciativa", "Leadership and initiative"), archetype: L("El Líder", "The Leader"), description: L("Tu energía principal es la del liderazgo independiente. Tenés iniciativa, originalidad y la capacidad de empezar cosas nuevas.", "Your main energy is independent leadership. You have initiative, originality and the ability to start new things.") },
  2: { meaning: L("Cooperación y sensibilidad", "Cooperation and sensitivity"), archetype: L("El Puente", "The Bridge"), description: L("Tu energía está orientada hacia la conexión con otros. La diplomacia, la paciencia y la cooperación son tus herramientas principales.", "Your energy is oriented toward connecting with others. Diplomacy, patience and cooperation are your main tools.") },
  3: { meaning: L("Expresión creativa", "Creative expression"), archetype: L("El Creador", "The Creator"), description: L("Tu energía es la expresión. La comunicación, el arte y la creatividad son los canales por donde fluye tu vitalidad.", "Your energy is expression. Communication, art and creativity are the channels through which your vitality flows.") },
  4: { meaning: L("Estabilidad y disciplina", "Stability and discipline"), archetype: L("El Constructor", "The Builder"), description: L("Tu energía está orientada a construir. La organización, la persistencia y el trabajo metódico son tu fuerte.", "Your energy is oriented toward building. Organization, persistence and methodical work are your strength.") },
  5: { meaning: L("Libertad y versatilidad", "Freedom and versatility"), archetype: L("El Nómada", "The Nomad"), description: L("Tu energía es el cambio. La curiosidad, la aventura y la experiencia directa alimentan tu crecimiento.", "Your energy is change. Curiosity, adventure and direct experience feed your growth.") },
  6: { meaning: L("Responsabilidad y cuidado", "Responsibility and care"), archetype: L("El Nutridor", "The Nurturer"), description: L("Tu energía está orientada hacia el hogar y los demás. El amor práctico y la responsabilidad son tu camino.", "Your energy is oriented toward home and other people. Practical love and responsibility are your path.") },
  7: { meaning: L("Introspección y búsqueda de verdad", "Introspection and the search for truth"), archetype: L("El Investigador", "The Investigator"), description: L("Tu energía es la búsqueda. El análisis, la reflexión y la sabiduría interior guían tu camino.", "Your energy is the search. Analysis, reflection and inner wisdom guide your path.") },
  8: { meaning: L("Poder y manifestación material", "Power and material manifestation"), archetype: L("El Poderoso", "The Powerful One"), description: L("Tu energía está orientada hacia los logros concretos. La estrategia y la visión te permiten materializar proyectos.", "Your energy is oriented toward concrete achievements. Strategy and vision let you bring projects to life.") },
  9: { meaning: L("Sabiduría y compasión", "Wisdom and compassion"), archetype: L("El Filósofo", "The Philosopher"), description: L("Tu energía es la del servicio y la visión global. La compasión y la sabiduría acumulada son tu legado.", "Your energy is that of service and global vision. Compassion and accumulated wisdom are your legacy.") },
  11: { meaning: L("Intuición elevada e inspiración", "Heightened intuition and inspiration"), archetype: L("El Vidente", "The Seer"), description: L("Tu energía conecta con lo trascendente. La intuición y la inspiración son tus herramientas más poderosas.", "Your energy connects with the transcendent. Intuition and inspiration are your most powerful tools.") },
  22: { meaning: L("Construcción a gran escala", "Building on a large scale"), archetype: L("El Maestro Constructor", "The Master Builder"), description: L("Tu energía combina visión con capacidad de manifestación. Podés construir cosas que perduren.", "Your energy combines vision with the ability to manifest. You can build things that last.") },
  33: { meaning: L("Compasión universal y sanación", "Universal compassion and healing"), archetype: L("El Maestro Sanador", "The Master Healer"), description: L("Tu energía está dedicada al servicio y la sanación. Es el número más elevado de servicio.", "Your energy is devoted to service and healing. It's the highest number of service.") },
});

export default function CaminoDeVidaPage() {
  const L = useL();
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [result, setResult] = useState<{ lifePath: number; meaning: ReturnType<typeof LIFE_PATH_MEANINGS>[1] } | null>(null);

  const daysInMonth = month && year ? getDaysInMonth(month, year) : 31;

  const handleCalculate = () => {
    if (!day || !month || !year) return;
    const dateStr = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    const lifePath = calculateLifePath(dateStr);
    const meaning = LIFE_PATH_MEANINGS(L)[lifePath] || LIFE_PATH_MEANINGS(L)[1];
    setResult({ lifePath, meaning });
  };

  const isValid = day && month && year && parseInt(day) <= daysInMonth;

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[900px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24" id="main-content">

        <nav className="text-xs text-muted mb-8" aria-label="Breadcrumb">{L(<>
          <Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">Inicio</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <Link href="/herramientas" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">Herramientas</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <span className="text-foreground font-medium" aria-current="page">Camino de Vida</span>
        </>, <><Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">Home</Link><span className="mx-2" aria-hidden="true">&rsaquo;</span><Link href="/herramientas" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">Tools</Link><span className="mx-2" aria-hidden="true">&rsaquo;</span><span className="text-foreground font-medium" aria-current="page">Life Path</span></>)}</nav>

        <motion.section {...fadeUp}>
          <h1 className="page-title text-foreground">{L("Camino de Vida", "Life Path")}</h1>
          <p className="text-base text-muted mt-4 max-w-xl leading-relaxed">{L("Calculá tu número de Camino de Vida a partir de tu fecha de nacimiento. Según la tradición numerológica, este número describe tu energía central.", "Calculate your Life Path number from your date of birth. According to the numerological tradition, this number describes your core energy.")}</p>
          <SectionCover imageKey="herramientas/camino-de-vida" priority className="mt-8 max-w-3xl" />
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
            <Button variant="primary" fullWidth onClick={handleCalculate} disabled={!isValid}>{L("Calcular Camino de Vida", "Calculate Life Path")}</Button>
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
                    className="text-sm text-accent font-medium mb-3 label-caps"
                  >{L("Tu Camino de Vida", "Your Life Path")}</motion.p>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="number-display text-[6rem] sm:text-[8rem] leading-none"
                    style={{ color: "var(--element-fire)" }}
                  >
                    {L.t(result.lifePath)}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="font-heading text-2xl font-semibold text-foreground mt-4"
                  >
                    {L.t(result.meaning.archetype)}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="text-sm text-muted mt-2"
                  >
                    {L.t(result.meaning.meaning)}
                  </motion.p>
                </div>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.4 }}
                  className="text-sm text-muted leading-relaxed max-w-lg mx-auto text-center"
                >
                  {L.t(result.meaning.description)}
                </motion.p>
              </motion.div>

              {/* Disclaimer */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.35 }}
                className="mt-6 p-4 rounded-md border border-border bg-card shadow-sm"
              >
                <p className="text-xs text-muted leading-relaxed">{L(<>
                  <strong>Nota:</strong> El Camino de Vida es una interpretación simbólica de la tradición numerológica. No constituye evidencia científica ni predice el futuro. Molino lo utiliza como herramienta de reflexión.
                </>, <><strong>Note:</strong> The Life Path is a symbolic interpretation from the numerological tradition. It doesn't constitute scientific evidence or predict the future. Molino uses it as a tool for reflection.</>)}</p>
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
                    const text = L(`Mi Camino de Vida es ${result.lifePath} — ${result.meaning.archetype}. Leé el tuyo en Molino.`, `My Life Path is ${L.t(result.lifePath)} — ${L.t(result.meaning.archetype)}. Read yours on Molino.`);
                    if (navigator.share) {
                      navigator.share({ title: L("Mi Camino de Vida", "My Life Path"), text }).catch(() => {});
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
                  <p className="text-sm text-muted mb-3">{L("¿Querés ver cómo esto se conecta con astrología y zodiaco chino?", "Want to see how this connects with astrology and the Chinese zodiac?")}</p>
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
