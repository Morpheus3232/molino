"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import { NUMBERS, NUMEROLOGY_DISCLAIMER } from "@/lib/data/numerologia-content";
import { MOLINO_DISCLAIMER } from "@/lib/data/sources";

export default function NumeroPage() {
  const router = useRouter();
  const params = useParams();
  const numId = params.numero as string;
  const num = NUMBERS.find(n => n.number === parseInt(numId));

  if (!num) {
    return (
      <div className="min-h-screen bg-background">
        <UniversityHeader />
        <main className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24">
          <h1 className="font-serif text-4xl font-semibold text-foreground">N&uacute;mero no encontrado</h1>
          <p className="text-muted mt-4">El n&uacute;mero {numId} no existe en la base de numerolog&iacute;a de Molino.</p>
          <button onClick={() => router.push("/conocimiento/numerologia")} className="mt-6 text-sm text-accent hover:text-accent/80">&larr; Volver a Numerolog&iacute;a</button>
        </main>
        <UniversityFooter />
      </div>
    );
  }

  const allNumbers = NUMBERS;
  const currentIndex = allNumbers.findIndex(n => n.number === num.number);
  const prev = currentIndex > 0 ? allNumbers[currentIndex - 1] : null;
  const next = currentIndex < allNumbers.length - 1 ? allNumbers[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />
      <main className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">

        {/* Breadcrumb */}
        <nav className="text-xs text-muted mb-8" aria-label="Breadcrumb">
          <span className="hover:text-accent cursor-pointer" onClick={() => router.push("/")}>Inicio</span>
          <span className="mx-2">&rsaquo;</span>
          <span className="hover:text-accent cursor-pointer" onClick={() => router.push("/conocimiento/numerologia")}>Numerolog&iacute;a</span>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-foreground font-medium">N&uacute;mero {num.number}</span>
        </nav>

        {/* Hero */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="grid grid-cols-[auto_1fr] gap-6 sm:gap-8 items-start">
            <p className="number-display text-[6rem] sm:text-[8rem] number-display-accent leading-none">{num.number}</p>
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground leading-[1.1]">{num.title}</h1>
              <div className="flex flex-wrap gap-2 mt-3">
                {num.keywords.map(kw => (
                  <span key={kw} className="text-[9px] uppercase tracking-[0.15em] text-muted font-medium px-2 py-0.5 rounded-full border border-border">{kw}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Significado */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Significado tradicional</h2>
          </div>
          <p className="text-base text-foreground leading-relaxed max-w-3xl">{num.meaning}</p>
        </motion.section>

        {/* Historia */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Historia y simbolismo</h2>
          </div>
          <p className="text-sm text-foreground leading-relaxed max-w-3xl mb-4">{num.history}</p>
          <p className="text-sm text-muted leading-relaxed max-w-3xl">{num.symbolism}</p>
        </motion.section>

        {/* Fortalezas y Desaf&iacute;os */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl border border-border bg-card">
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-3">Fortalezas</p>
              <ul className="space-y-2">
                {num.strengths.map(s => (
                  <li key={s} className="text-sm text-foreground flex items-start gap-2">
                    <span className="text-accent mt-0.5">&bull;</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Desaf&iacute;os</p>
              <ul className="space-y-2">
                {num.challenges.map(c => (
                  <li key={c} className="text-sm text-foreground flex items-start gap-2">
                    <span className="text-muted mt-0.5">&bull;</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Interpretaci&oacute;n */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Interpretaci&oacute;n de Molino</h2>
          </div>
          <p className="text-sm text-foreground leading-relaxed max-w-3xl">{num.interpretation}</p>
        </motion.section>

        {/* Ejemplo */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Ejemplo pr&aacute;ctico</h2>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card">
            <p className="text-sm text-foreground leading-relaxed">{num.example}</p>
          </div>
        </motion.section>

        {/* Relaci&oacute;n con otros */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Relaci&oacute;n con otros n&uacute;meros</h2>
          </div>
          <p className="text-sm text-foreground leading-relaxed max-w-3xl">{num.relationshipWithOther}</p>
        </motion.section>

        {/* Aviso cient&iacute;fico */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="p-5 rounded-xl border border-accent/20 bg-accent/[0.03]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-2">Aviso importante</p>
            <p className="text-sm text-muted leading-relaxed">{num.scientificNote}</p>
          </div>
        </motion.section>

        {/* Fuentes */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Fuentes</h2>
          </div>
          <p className="text-xs text-muted">Encyclopaedia Britannica, Stanford Encyclopedia of Philosophy, Internet Encyclopedia of Philosophy.</p>
        </motion.section>

        {/* Disclaimer */}
        <motion.section {...fadeUp} className="mb-12">
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-xs text-muted leading-relaxed">{NUMEROLOGY_DISCLAIMER}</p>
          </div>
        </motion.section>

        {/* Navegaci&oacute;n entre n&uacute;meros */}
        <motion.section {...fadeUp} className="flex justify-between items-center pt-8 border-t border-border">
          {prev ? (
            <button onClick={() => router.push(`/conocimiento/numerologia/numero-${prev.number}`)} className="text-sm text-accent hover:text-accent/80 transition-colors">
              &larr; N&uacute;mero {prev.number} &mdash; {prev.title}
            </button>
          ) : <div />}
          {next ? (
            <button onClick={() => router.push(`/conocimiento/numerologia/numero-${next.number}`)} className="text-sm text-accent hover:text-accent/80 transition-colors">
              {next.number} &mdash; {next.title} &rarr;
            </button>
          ) : <div />}
        </motion.section>

      </main>
      <UniversityFooter />
    </div>
  );
}
