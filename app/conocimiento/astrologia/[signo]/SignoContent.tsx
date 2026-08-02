"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import UniversityFooter from "@/components/layout/UniversityFooter";
import { ZODIAC_SIGNS, ASTROLOGY_DISCLAIMER } from "@/lib/data/astrologia-content";

function normalize(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export default function SignoContent() {
  const router = useRouter();
  const params = useParams();
  const [copied, setCopied] = useState(false);
  const signId = params.signo as string;
  const sign = ZODIAC_SIGNS.find(s => normalize(s.name) === normalize(signId));

  if (!sign) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24">
          <h1 className="font-heading text-4xl font-semibold text-foreground">Signo no encontrado</h1>
          <p className="text-muted mt-4">El signo &quot;{signId}&quot; no existe en la base de astrología de Molino.</p>
          <button onClick={() => router.push("/conocimiento/astrologia")} className="mt-6 text-sm text-accent hover:text-accent/80">&larr; Volver a Astrología</button>
        </main>
        <UniversityFooter />
      </div>
    );
  }

  const currentIndex = ZODIAC_SIGNS.findIndex(s => s.name === sign.name);
  const prev = currentIndex > 0 ? ZODIAC_SIGNS[currentIndex - 1] : null;
  const next = currentIndex < ZODIAC_SIGNS.length - 1 ? ZODIAC_SIGNS[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">
        <nav className="text-xs text-muted mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-accent transition-colors">Inicio</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <Link href="/conocimiento/astrologia" className="hover:text-accent transition-colors">Astrología</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <span className="text-foreground font-medium" aria-current="page">{sign.name}</span>
        </nav>

        {/* Hero */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{sign.symbol}</span>
            <div>
              <h1 className="font-display text-4xl sm:text-5xl tracking-tight text-foreground leading-[1.1]">{sign.name}</h1>
              <p className="text-sm text-muted mt-1">{sign.dates}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {[sign.element, sign.modality, sign.polarity, sign.rulingPlanet].map((tag) => (
              <span key={tag} className="text-[9px] uppercase tracking-[0.15em] text-muted font-medium px-2 py-0.5 border border-ink/10">{tag}</span>
            ))}
          </div>
        </motion.section>

        {/* Significado */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" />
            <h2 className="text-xs uppercase tracking-[0.25em] text-muted font-medium">Significado tradicional</h2>
          </div>
          <p className="text-base text-foreground leading-relaxed max-w-3xl">{sign.meaning}</p>
        </motion.section>

        {/* Historia */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" />
            <h2 className="text-xs uppercase tracking-[0.25em] text-muted font-medium">Historia</h2>
          </div>
          <p className="text-sm text-foreground leading-relaxed max-w-3xl">{sign.history}</p>
        </motion.section>

        {/* Fortalezas y Desafíos */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 border border-ink/10">
              <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-3">Fortalezas</p>
              <ul className="space-y-2">
                {sign.strengths.map(s => (
                  <li key={s} className="text-sm text-foreground flex items-start gap-2"><span className="text-accent mt-0.5">&bull;</span>{s}</li>
                ))}
              </ul>
            </div>
            <div className="p-6 border border-ink/10">
              <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-3">Desafíos</p>
              <ul className="space-y-2">
                {sign.challenges.map(c => (
                  <li key={c} className="text-sm text-foreground flex items-start gap-2"><span className="text-muted mt-0.5">&bull;</span>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Compatibilidades */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" />
            <h2 className="text-xs uppercase tracking-[0.25em] text-muted font-medium">Compatibilidades tradicionales</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 border border-ink/10">
              <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-2">Compatibles</p>
              <div className="flex flex-wrap gap-2">
                {sign.compatibility.friendly.map(f => (
                  <span key={f} className="text-sm text-foreground px-2 py-1 rounded bg-background border border-border">{f}</span>
                ))}
              </div>
            </div>
            <div className="p-4 border border-ink/10">
              <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-2">Desafiantes</p>
              <div className="flex flex-wrap gap-2">
                {sign.compatibility.challenging.map(c => (
                  <span key={c} className="text-sm text-foreground px-2 py-1 rounded bg-background border border-border">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Aviso + Disclaimer consolidados */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="p-6 border border-ink/10">
            <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-2">Aviso importante</p>
            <p className="text-sm text-muted leading-relaxed">{sign.scientificNote}</p>
            <p className="text-xs text-muted leading-relaxed mt-3">{ASTROLOGY_DISCLAIMER}</p>
          </div>
        </motion.section>

        {/* Navegación */}
        <motion.section {...fadeUp} className="flex justify-between items-center pt-8 border-t border-border">
          {prev ? (
            <button onClick={() => router.push(`/conocimiento/astrologia/${normalize(prev.name)}`)} className="text-sm text-accent hover:text-accent/80 transition-colors">
              &larr; {prev.symbol} {prev.name}
            </button>
          ) : <div />}
          {next ? (
            <button onClick={() => router.push(`/conocimiento/astrologia/${normalize(next.name)}`)} className="text-sm text-accent hover:text-accent/80 transition-colors">
              {next.symbol} {next.name} &rarr;
            </button>
          ) : <div />}
        </motion.section>
      </main>
      <UniversityFooter />
    </div>
  );
}
