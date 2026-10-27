"use client";
import { useL, type Pick2 } from "@/lib/i18n/useL";

import { useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import Button from "@/components/ui/Button";
import { getSunSign, getSunSignInfo, getSunSignSymbol } from "@/lib/engines/astrologyEngine";
import { ZODIAC_SIGNS } from "@/lib/data/knowledge";
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

export default function SignoSolarPage() {
  const L = useL();
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [result, setResult] = useState<ReturnType<typeof getSunSignInfo> & { symbol: string } | null>(null);

  const daysInMonth = month && year ? getDaysInMonth(month, year) : 31;

  const handleCalculate = () => {
    if (!day || !month || !year) return;
    const dateStr = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    const info = getSunSignInfo(dateStr);
    const symbol = getSunSignSymbol(dateStr);
    setResult({ ...info, symbol });
  };

  const isValid = day && month && year && parseInt(day) <= daysInMonth;

  const getSignData = (signName: string) => ZODIAC_SIGNS.find(s => s.name === signName);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[900px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24" id="main-content">

        <nav className="text-xs text-muted mb-8" aria-label="Breadcrumb">{L(<>
          <Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">Inicio</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <Link href="/herramientas" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">Herramientas</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <span className="text-foreground font-medium" aria-current="page">Signo Solar</span>
        </>, <><Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">Home</Link><span className="mx-2" aria-hidden="true">&rsaquo;</span><Link href="/herramientas" className="underline decoration-ink/25 underline-offset-2 hover:text-accent hover:decoration-accent transition-colors">Tools</Link><span className="mx-2" aria-hidden="true">&rsaquo;</span><span className="text-foreground font-medium" aria-current="page">Sun Sign</span></>)}</nav>

        <motion.section {...fadeUp}>
          <h1 className="page-title text-foreground">{L("Signo Solar", "Sun Sign")}</h1>
          <p className="text-base text-muted mt-4 max-w-xl leading-relaxed">{L("Tu signo zodiacal solar está determinado por la posición del sol en el cielo en el momento de tu nacimiento. Cada signo tiene un elemento, una modalidad y cualidades asociadas.", "Your sun sign is determined by the position of the Sun in the sky at the moment you were born. Each sign has an element, a modality and associated qualities.")}</p>
          <SectionCover imageKey="herramientas/signo-solar" priority className="mt-8 max-w-3xl" />
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
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
                <select value={year} onChange={(e) => setYear(e.target.value)} className="input flex-1" aria-label={L("Año", "Year")}>
                  <option value="">{L("Año", "Year")}</option>
                  {Array.from({ length: 100 }, (_, i) => 2010 - i).map((y) => (
                    <option key={y} value={String(y)}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
            <Button variant="primary" fullWidth onClick={handleCalculate} disabled={!isValid}>{L("Calcular Signo Solar", "Calculate Sun Sign")}</Button>
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
                  >{L("Tu Signo Solar", "Your Sun Sign")}</motion.p>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-6xl sm:text-7xl mb-4"
                  >
                    {result.symbol}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="font-heading text-3xl font-semibold text-foreground"
                  >
                    {result.sign}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.35 }}
                    className="flex items-center justify-center gap-3 mt-3 text-sm text-muted"
                  >
                    <span className="px-3 py-1 rounded-md border border-border transition-colors hover:border-accent/40">{result.element}</span>
                    <span className="px-3 py-1 rounded-md border border-border transition-colors hover:border-accent/40">{result.modality}</span>
                  </motion.div>
                </div>

                {/* Sign description */}
                {(() => {
                  const signData = getSignData(result.sign);
                  return signData ? (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55, duration: 0.4 }}
                      className="max-w-lg mx-auto"
                    >
                      <p className="text-sm text-muted leading-relaxed text-center mb-4">{signData.keywords.join(" \u00b7 ")}</p>
                      <div className="p-4 rounded-md bg-card border border-border">
                        <p className="text-sm text-foreground leading-relaxed">{L(<>
                          Según la tradición astrológica, {result.sign} es un signo {result.modality.toLowerCase()} de elemento {result.element.toLowerCase()}. {result.sign === "Aries" ? "Se asocia con el inicio, la iniciativa y la energía pionera." : result.sign === "Tauro" ? "Se asocia con la estabilidad, la sensualidad y la conexión con la tierra." : result.sign === "G\u00e9minis" ? "Se asocia con la dualidad, la comunicación y la curiosidad intelectual." : result.sign === "C\u00e1ncer" ? "Se asocia con las emociones, el hogar y la protecci\u00f3n." : result.sign === "Leo" ? "Se asocia con la creatividad, el liderazgo y la expresi\u00f3n personal." : result.sign === "Virgo" ? "Se asocia con el an\u00e1lisis, la precisi\u00f3n y el servicio." : result.sign === "Libra" ? "Se asocia con el equilibrio, la armon\u00eda y la justicia." : result.sign === "Escorpio" ? "Se asocia con la transformaci\u00f3n, la intensidad y lo oculto." : result.sign === "Sagitario" ? "Se asocia con la expansi\u00f3n, la filosof\u00eda y la aventura." : result.sign === "Capricornio" ? "Se asocia con la ambici\u00f3n, la disciplina y la estructura." : result.sign === "Acuario" ? "Se asocia con la innovaci\u00f3n, la humanidad y la originalidad." : "Se asocia con la intuici\u00f3n, la espiritualidad y la compasi\u00f3n."}
                        </>, <>According to the astrological tradition, {result.sign} is a {result.modality.toLowerCase()} {result.element.toLowerCase()} sign. {result.sign === "Aries" ? "It's associated with beginnings, initiative and pioneering energy." : result.sign === "Tauro" ? "It's associated with stability, sensuality and connection with the earth." : result.sign === "Géminis" ? "It's associated with duality, communication and intellectual curiosity." : result.sign === "Cáncer" ? "It's associated with emotions, home and protection." : result.sign === "Leo" ? "It's associated with creativity, leadership and personal expression." : result.sign === "Virgo" ? "It's associated with analysis, precision and service." : result.sign === "Libra" ? "It's associated with balance, harmony and justice." : result.sign === "Escorpio" ? "It's associated with transformation, intensity and the hidden." : result.sign === "Sagitario" ? "It's associated with expansion, philosophy and adventure." : result.sign === "Capricornio" ? "It's associated with ambition, discipline and structure." : result.sign === "Acuario" ? "It's associated with innovation, humanity and originality." : "It's associated with intuition, spirituality and compassion."}</>)}</p>
                      </div>
                    </motion.div>
                  ) : null;
                })()}
              </motion.div>

              {/* Disclaimer */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.35 }}
                className="mt-6 p-4 rounded-md border border-border bg-card shadow-sm"
              >
                <p className="text-xs text-muted leading-relaxed">{L(<>
                  <strong>Nota:</strong> La astrología es un sistema de creencias con más de 4000 años de historia. Estas interpretaciones pertenecen a la tradición astrológica y no representan evidencia científica.
                </>, <><strong>Note:</strong> Astrology is a belief system with more than 4,000 years of history. These interpretations belong to the astrological tradition and don't represent scientific evidence.</>)}</p>
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
                    const text = L(`Mi signo solar es ${result.sign} (${result.element} · ${result.modality}). Leé el tuyo en Molino.`, `My sun sign is ${result.sign} (${result.element} · ${result.modality}). Read yours on Molino.`);
                    if (navigator.share) {
                      navigator.share({ title: L(`Mi Signo Solar — ${result.sign}`, `My Sun Sign — ${result.sign}`), text }).catch(() => {});
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
                  <p className="text-sm text-muted mb-3">{L("¿Querés ver cómo tu signo se conecta con numerología y zodiaco chino?", "Want to see how your sign connects with numerology and the Chinese zodiac?")}</p>
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
