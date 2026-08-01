"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeUp } from "@/lib/utils/motion";
import UniversityFooter from "@/components/layout/UniversityFooter";
import EditorialSection from "@/components/ui/EditorialSection";
import Halftone from "@/components/ui/Halftone";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { CHINESE_ANIMALS, CHINESE_ZODIAC_DISCLAIMER } from "@/lib/data/zodiaco-chino-content";

const cellPad = "p-8 lg:p-12";

export default function AnimalContent() {
  const params = useParams();
  const animalId = params.animal as string;
  const animal = CHINESE_ANIMALS.find((a) => a.name.toLowerCase() === animalId.toLowerCase());

  if (!animal) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-24 pb-24">
          <h1 className="font-display text-4xl sm:text-5xl text-foreground">Animal no encontrado</h1>
          <p className="text-muted mt-4">
            El animal &quot;{animalId}&quot; no existe en la base del zodiaco chino de Molino.
          </p>
          <div className="mt-8">
            <Button asChild variant="primary">
              <Link href="/conocimiento/zodiaco-chino">Volver al Zodiaco Chino</Link>
            </Button>
          </div>
        </main>
        <UniversityFooter />
      </div>
    );
  }

  const currentIndex = CHINESE_ANIMALS.findIndex((a) => a.name === animal.name);
  const prev = currentIndex > 0 ? CHINESE_ANIMALS[currentIndex - 1] : null;
  const next = currentIndex < CHINESE_ANIMALS.length - 1 ? CHINESE_ANIMALS[currentIndex + 1] : null;

  const blocks = [
    { numeral: "01", label: "Características", items: animal.traits },
    { numeral: "02", label: "Fortalezas", items: animal.strengths },
    { numeral: "03", label: "Desafíos", items: animal.challenges },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main id="main-content">
        {/* ═══ HERO ═══ */}
        <section className="relative overflow-hidden bg-background">
          <div
            className="pointer-events-none absolute -right-40 -top-40 w-[34rem] h-[34rem] text-ink"
            style={{ opacity: 0.04 }}
          >
            <Halftone variant="circle" resolution={30} className="w-full h-full" />
          </div>

          <div className="relative mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 lg:pt-24">
            <nav className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted mb-10" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-accent transition-colors">Inicio</Link>
              <span className="mx-2" aria-hidden="true">/</span>
              <Link href="/conocimiento/zodiaco-chino" className="hover:text-accent transition-colors">
                Zodiaco Chino
              </Link>
              <span className="mx-2" aria-hidden="true">/</span>
              <span className="text-foreground" aria-current="page">{animal.name}</span>
            </nav>

            <motion.div {...fadeUp} className="border-t border-ink/10 pt-10 lg:pt-14">
              <p className="font-mono text-xs font-semibold tracking-[0.3em] uppercase text-accent mb-6">
                ZODÍACO CHINO · SIGNO {String(currentIndex + 1).padStart(2, "0")} DE 12
              </p>

              <div className="flex flex-wrap items-end gap-6 lg:gap-10">
                <span className="text-[clamp(4rem,12vw,10rem)] leading-none" role="img" aria-label={animal.name}>
                  {animal.emoji}
                </span>
                <h1 className="font-display text-[clamp(3rem,10vw,8rem)] leading-[0.85] tracking-tight text-foreground uppercase">
                  {animal.name}
                </h1>
              </div>

              <p className="font-mono text-sm text-muted mt-8 tracking-wide">{animal.years}</p>

              {animal.traits.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8">
                  {animal.traits.slice(0, 5).map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              )}
            </motion.div>

            <div className="h-16 lg:h-24" />
          </div>
        </section>

        {/* ═══ SIGNIFICADO — negro full-bleed ═══ */}
        <EditorialSection
          tone="ink"
          eyebrow="SIGNIFICADO"
          title={<>QUÉ DICE<br />SER {animal.name.toUpperCase()}.</>}
          texture="spiral"
        >
          <div className="flex flex-wrap">
            <div className={`w-full lg:w-1/2 ${cellPad} lg:border-r border-paper/15`}>
              <p className="text-base lg:text-lg text-paper/80 leading-relaxed">{animal.meaning}</p>
            </div>
            <div className={`w-full lg:w-1/2 ${cellPad} border-t lg:border-t-0 border-paper/15`}>
              <p className="font-mono text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-accent-light mb-6">
                HISTORIA Y SIMBOLISMO
              </p>
              <p className="text-sm lg:text-base text-paper/70 leading-relaxed">{animal.history}</p>
            </div>
          </div>
        </EditorialSection>

        {/* ═══ RASGOS — numerales grandes ═══ */}
        <EditorialSection
          tone="paper"
          eyebrow="RASGOS"
          title={<>CÓMO SE<br />MANIFIESTA.</>}
        >
          <div className="flex flex-wrap">
            {blocks.map((block, i) => (
              <motion.div
                key={block.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className={`w-full md:w-1/3 ${cellPad} ${
                  i < 2 ? "md:border-r border-ink/10" : ""
                } ${i < blocks.length - 1 ? "border-b md:border-b-0 border-ink/10" : ""}`}
              >
                <span className="font-display text-5xl lg:text-6xl leading-none text-ink/15 block mb-8">
                  {block.numeral}
                </span>
                <p className="font-mono text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-accent mb-6">
                  {block.label}
                </p>
                <ul className="space-y-3">
                  {block.items.map((item) => (
                    <li key={item} className="text-sm lg:text-base text-foreground leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </EditorialSection>

        {/* ═══ COMPATIBILIDADES — azul full-bleed ═══ */}
        <EditorialSection
          tone="accent"
          eyebrow="COMPATIBILIDADES TRADICIONALES"
          title={<>CON QUIÉN<br />RESUENA.</>}
          texture="wave"
        >
          <div className="flex flex-wrap">
            <div className={`w-full md:w-1/2 ${cellPad} md:border-r border-paper/20`}>
              <p className="font-mono text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-paper/85 mb-6">
                COMPATIBLES
              </p>
              <div className="flex flex-wrap gap-2">
                {animal.compatibility.friendly.map((f) => (
                  <span
                    key={f}
                    className="font-heading text-sm uppercase tracking-wider text-paper border border-paper/40 rounded-sm px-3 py-1.5"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <div className={`w-full md:w-1/2 ${cellPad} border-t md:border-t-0 border-paper/20`}>
              <p className="font-mono text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-paper/85 mb-6">
                DESAFIANTES
              </p>
              <div className="flex flex-wrap gap-2">
                {animal.compatibility.challenging.map((c) => (
                  <span
                    key={c}
                    className="font-heading text-sm uppercase tracking-wider text-paper/85 border border-paper/20 rounded-sm px-3 py-1.5"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </EditorialSection>

        {/* ═══ LOS 5 ELEMENTOS ═══ */}
        <EditorialSection
          tone="paperAlt"
          eyebrow="LOS 5 ELEMENTOS"
          title={<>CINCO VERSIONES<br />DEL MISMO SIGNO.</>}
        >
          <div className="flex flex-wrap">
            {animal.elements.map((el, i) => (
              <motion.div
                key={el.element}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={`w-full sm:w-1/2 lg:w-1/5 ${cellPad} py-8 border-b lg:border-b-0 ${
                  i < animal.elements.length - 1 ? "lg:border-r" : ""
                } border-ink/10`}
              >
                <span className="font-display text-4xl leading-none text-ink/15 block mb-6">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-display text-lg text-foreground uppercase leading-tight">
                  {el.element}
                </p>
                <p className="text-sm text-muted mt-3 leading-relaxed">{el.modifier}</p>
              </motion.div>
            ))}
          </div>
        </EditorialSection>

        {/* ═══ CTA + AVISO ═══ */}
        <section className="bg-background">
          <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
            <motion.div {...fadeUp} className="border-t border-ink/10 pt-16 lg:pt-20">
              <div className="accent-block rounded-lg p-10 lg:p-16 text-center">
                <p className="font-display text-3xl sm:text-4xl lg:text-5xl text-paper leading-[0.92] mb-6">
                  ¿CUÁL ES TU ANIMAL?
                </p>
                <p className="text-sm lg:text-base text-paper/85 max-w-lg mx-auto mb-10 leading-relaxed">
                  Calculalo con tu fecha de nacimiento y descubrí tu afinidad con entidades del mundo.
                </p>
                <Button asChild variant="inverse" size="lg">
                  <Link href="/herramientas/zodiaco-chino">
                    CALCULAR MI ANIMAL
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div {...fadeUp} className="mt-12 border border-border rounded-md bg-card shadow-sm p-8">
              <p className="font-mono text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-muted mb-4">
                AVISO IMPORTANTE
              </p>
              <p className="text-sm text-muted leading-relaxed">{animal.scientificNote}</p>
              <p className="text-xs text-muted leading-relaxed mt-4">{CHINESE_ZODIAC_DISCLAIMER}</p>
            </motion.div>

            {/* Navegación prev/next */}
            <nav
              className="mt-12 flex flex-wrap justify-between items-stretch gap-4 border-t border-ink/10 pt-8"
              aria-label="Navegación entre signos"
            >
              {prev ? (
                <Link
                  href={`/conocimiento/zodiaco-chino/${prev.name.toLowerCase()}`}
                  className="group flex items-center gap-4 flex-1 min-w-[14rem]"
                >
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted group-hover:-translate-x-1 transition-transform">
                    ←
                  </span>
                  <span>
                    <span className="block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted">Anterior</span>
                    <span className="block font-display text-xl text-foreground group-hover:text-accent transition-colors uppercase">
                      {prev.emoji} {prev.name}
                    </span>
                  </span>
                </Link>
              ) : (
                <div className="flex-1" />
              )}

              {next ? (
                <Link
                  href={`/conocimiento/zodiaco-chino/${next.name.toLowerCase()}`}
                  className="group flex items-center justify-end gap-4 flex-1 min-w-[14rem] text-right"
                >
                  <span>
                    <span className="block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted">Siguiente</span>
                    <span className="block font-display text-xl text-foreground group-hover:text-accent transition-colors uppercase">
                      {next.name} {next.emoji}
                    </span>
                  </span>
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
            </nav>

            <div className="h-20" />
          </div>
        </section>
      </main>
      <UniversityFooter />
    </div>
  );
}
