"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import { getSunSign, getSunSignInfo, getSunSignSymbol } from "@/lib/engines/astrologyEngine";
import { ZODIAC_SIGNS } from "@/lib/data/knowledge";

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

export default function SignoSolarPage() {
  const router = useRouter();
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
      <UniversityHeader />
      <main className="mx-auto max-w-[900px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">

        <nav className="text-xs text-muted mb-8">
          <span className="hover:text-accent cursor-pointer" onClick={() => router.push("/")}>Inicio</span>
          <span className="mx-2">&rsaquo;</span>
          <span className="hover:text-accent cursor-pointer" onClick={() => router.push("/herramientas")}>Herramientas</span>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-foreground font-medium">Signo Solar</span>
        </nav>

        <motion.section {...fadeUp}>
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-4">Astrolog&iacute;a</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.1]">
            Signo Solar
          </h1>
          <p className="text-base text-muted mt-4 max-w-xl leading-relaxed">
            Tu signo zodiacal solar est&aacute; determinado por la posici&oacute;n del sol en el cielo en el momento de tu nacimiento. Cada signo tiene un elemento, una modalidad y cualidades asociadas.
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
              Calcular Signo Solar
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
                  <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-medium mb-3">Tu Signo Solar</p>
                  <p className="text-6xl sm:text-7xl mb-4">{result.symbol}</p>
                  <p className="font-serif text-3xl font-semibold text-foreground">{result.sign}</p>
                  <div className="flex items-center justify-center gap-3 mt-3 text-sm text-muted">
                    <span className="px-3 py-1 rounded-full border border-border">{result.element}</span>
                    <span className="px-3 py-1 rounded-full border border-border">{result.modality}</span>
                  </div>
                </div>

                {/* Sign description */}
                {(() => {
                  const signData = getSignData(result.sign);
                  return signData ? (
                    <div className="max-w-lg mx-auto">
                      <p className="text-sm text-muted leading-relaxed text-center mb-4">{signData.keywords.join(" \u00b7 ")}</p>
                      <div className="p-4 rounded-xl bg-card border border-border">
                        <p className="text-sm text-foreground leading-relaxed">
                          Seg&uacute;n la tradici&oacute;n astrol&oacute;gica, {result.sign} es un signo {result.modality.toLowerCase()} de elemento {result.element.toLowerCase()}. {result.sign === "Aries" ? "Se asocia con el inicio, la iniciativa y la energ&iacute;a pionera." : result.sign === "Tauro" ? "Se asocia con la estabilidad, la sensualidad y la connection con la tierra." : result.sign === "G\u00e9minis" ? "Se asocia con la dualidad, la comunicaci&oacute;n y la curiosidad intelectual." : result.sign === "C\u00e1ncer" ? "Se asocia con las emociones, el hogar y la protecci\u00f3n." : result.sign === "Leo" ? "Se asocia con la creatividad, el liderazgo y la expresi\u00f3n personal." : result.sign === "Virgo" ? "Se asocia con el an\u00e1lisis, la precisi\u00f3n y el servicio." : result.sign === "Libra" ? "Se asocia con el equilibrio, la armon\u00eda y la justicia." : result.sign === "Escorpio" ? "Se asocia con la transformaci\u00f3n, la intensidad y lo oculto." : result.sign === "Sagitario" ? "Se asocia con la expansi\u00f3n, la filosof\u00eda y la aventura." : result.sign === "Capricornio" ? "Se asocia con la ambici\u00f3n, la disciplina y la estructura." : result.sign === "Acuario" ? "Se asocia con la innovaci\u00f3n, la humanidad y la originalidad." : "Se asocia con la intuici\u00f3n, la espiritualidad y la compasi\u00f3n."}
                        </p>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>

              {/* Disclaimer */}
              <div className="mt-6 p-4 rounded-xl border border-border bg-card">
                <p className="text-xs text-muted leading-relaxed">
                  <strong>Nota:</strong> La astrolog&iacute;a es un sistema de creencias con m&aacute;s de 4000 a&ntilde;os de historia. Estas interpretaciones pertenecen a la tradici&oacute;n astrol&oacute;gica y no representan evidencia cient&iacute;fica.
                </p>
              </div>

              {/* CTA */}
              <div className="mt-8 text-center">
                <p className="text-sm text-muted mb-4">Quer&eacute;s ver c&oacute;mo tu signo se conecta con numerolog&iacute;a y zodiaco chino?</p>
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
