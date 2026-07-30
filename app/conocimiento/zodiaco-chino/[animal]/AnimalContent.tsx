"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import UniversityFooter from "@/components/layout/UniversityFooter";
import { CHINESE_ANIMALS, CHINESE_ZODIAC_DISCLAIMER } from "@/lib/data/zodiaco-chino-content";

export default function AnimalContent() {
  const router = useRouter();
  const params = useParams();
  const [copied, setCopied] = useState(false);
  const animalId = params.animal as string;
  const animal = CHINESE_ANIMALS.find(a => a.name.toLowerCase() === animalId.toLowerCase());

  if (!animal) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24">
          <h1 className="font-heading text-4xl font-semibold text-foreground">Animal no encontrado</h1>
          <p className="text-muted mt-4">El animal &quot;{animalId}&quot; no existe en la base del zodiaco chino de Molino.</p>
          <button onClick={() => router.push("/conocimiento/zodiaco-chino")} className="mt-6 text-sm text-accent hover:text-accent/80">&larr; Volver al Zodiaco Chino</button>
        </main>
        <UniversityFooter />
      </div>
    );
  }

  const currentIndex = CHINESE_ANIMALS.findIndex(a => a.name === animal.name);
  const prev = currentIndex > 0 ? CHINESE_ANIMALS[currentIndex - 1] : null;
  const next = currentIndex < CHINESE_ANIMALS.length - 1 ? CHINESE_ANIMALS[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">
        <nav className="text-xs text-muted mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-accent transition-colors">Inicio</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <Link href="/conocimiento/zodiaco-chino" className="hover:text-accent transition-colors">Zodiaco Chino</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <span className="text-foreground font-medium" aria-current="page">{animal.name}</span>
        </nav>

        {/* Hero */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{animal.emoji}</span>
            <div>
              <h1 className="font-heading text-4xl sm:text-5xl font-semibold text-foreground leading-[1.1]">{animal.name}</h1>
              <p className="text-sm text-muted mt-1">{animal.years}</p>
            </div>
          </div>
          {animal.traits.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {animal.traits.slice(0, 4).map((tag) => (
                <span key={tag} className="text-[9px] uppercase tracking-[0.15em] text-muted font-medium px-2 py-0.5 rounded-md border border-border bg-card shadow-sm">{tag}</span>
              ))}
            </div>
          )}
        </motion.section>

        {/* Significado */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Significado</h2>
          </div>
          <p className="text-base text-foreground leading-relaxed max-w-3xl">{animal.meaning}</p>
        </motion.section>

        {/* Historia */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Historia y simbolismo</h2>
          </div>
          <p className="text-sm text-foreground leading-relaxed max-w-3xl">{animal.history}</p>
        </motion.section>

        {/* Características, Fortalezas, Desafíos */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="p-6 rounded-md border border-border bg-card shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-3">Características</p>
              <ul className="space-y-1.5">
                {animal.traits.map(t => <li key={t} className="text-sm text-foreground">{t}</li>)}
              </ul>
            </div>
            <div className="p-6 rounded-md border border-border bg-card shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-3">Fortalezas</p>
              <ul className="space-y-1.5">
                {animal.strengths.map(s => <li key={s} className="text-sm text-foreground">{s}</li>)}
              </ul>
            </div>
            <div className="p-6 rounded-md border border-border bg-card shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Desafíos</p>
              <ul className="space-y-1.5">
                {animal.challenges.map(c => <li key={c} className="text-sm text-foreground">{c}</li>)}
              </ul>
            </div>
            <div className="p-6 rounded-md border border-border bg-card shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Elemento</p>
              <p className="text-sm text-foreground">{animal.elements[0]?.element ?? "—"}</p>
            </div>
          </div>
        </motion.section>

        {/* Compatibilidades */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Compatibilidades tradicionales</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-md border border-border bg-card shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-2">Compatibles</p>
              <div className="flex flex-wrap gap-2">
                {animal.compatibility.friendly.map(f => <span key={f} className="text-sm text-foreground px-2 py-1 rounded bg-background border border-border">{f}</span>)}
              </div>
            </div>
            <div className="p-4 rounded-md border border-border bg-card shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Desafiantes</p>
              <div className="flex flex-wrap gap-2">
                {animal.compatibility.challenging.map(c => <span key={c} className="text-sm text-foreground px-2 py-1 rounded bg-background border border-border">{c}</span>)}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Elementos */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Los 5 elementos del {animal.name}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {animal.elements.map((el) => (
              <div key={el.element} className="p-4 rounded-md border border-border bg-card shadow-sm">
                <p className="text-sm font-medium text-foreground">{animal.name} de {el.element}</p>
                <p className="text-xs text-muted mt-1">{el.modifier}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Aviso + Disclaimer consolidados */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <div className="p-6 rounded-md border border-border bg-card shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Aviso importante</p>
            <p className="text-sm text-muted leading-relaxed">{animal.scientificNote}</p>
            <p className="text-xs text-muted leading-relaxed mt-3">{CHINESE_ZODIAC_DISCLAIMER}</p>
          </div>
        </motion.section>

        {/* Herramienta relacionada */}
        <motion.section {...fadeUp} className="mb-12">
          <div className="p-6 rounded-md border border-border bg-card shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Conocé tu animal</p>
            <p className="text-sm text-muted leading-relaxed mb-3">
              Calculá tu animal del zodiaco chino y descubrí tu afinidad con entidades del mundo.
            </p>
            <Link href="/herramientas/zodiaco-chino" className="text-sm font-medium text-accent hover:underline">
              Calculá tu animal →
            </Link>
          </div>
        </motion.section>

        {/* Navegación */}
        <motion.section {...fadeUp} className="flex justify-between items-center pt-8 border-t border-border">
          {prev ? (
            <button onClick={() => router.push(`/conocimiento/zodiaco-chino/${prev.name.toLowerCase()}`)} className="text-sm text-accent hover:text-accent/80 transition-colors">
              &larr; {prev.emoji} {prev.name}
            </button>
          ) : <div />}
          {next ? (
            <button onClick={() => router.push(`/conocimiento/zodiaco-chino/${next.name.toLowerCase()}`)} className="text-sm text-accent hover:text-accent/80 transition-colors">
              {next.emoji} {next.name} &rarr;
            </button>
          ) : <div />}
        </motion.section>
      </main>
      <UniversityFooter />
    </div>
  );
}
