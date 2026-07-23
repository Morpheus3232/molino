"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp, fadeUpDelayed } from "@/lib/utils/motion";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import { CHINESE_ANIMALS, CHINESE_ELEMENTS, CHINESE_ZODIAC_DISCLAIMER } from "@/lib/data/zodiaco-chino-content";
import { MOLINO_DISCLAIMER } from "@/lib/data/sources";

export default function ZodiacoChinoPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />
      <main className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">
        <nav className="text-xs text-muted mb-8" aria-label="Breadcrumb">
          <span className="hover:text-accent cursor-pointer" onClick={() => router.push("/")}>Inicio</span>
          <span className="mx-2">&rsaquo;</span>
          <span className="hover:text-accent cursor-pointer" onClick={() => router.push("/explore")}>Conocimiento</span>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-foreground font-medium">Zod&#237;aco Chino</span>
        </nav>

        <motion.section {...fadeUp} className="mb-16 sm:mb-20">
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-4">Conocimiento</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1]">Zod&#237;aco Chino</h1>
          <h2 className="font-serif text-xl sm:text-2xl text-muted mt-4 leading-relaxed max-w-2xl">
            Los 12 animales, los 5 elementos y el ciclo de 60 a&#241;os.
          </h2>
        </motion.section>

        <motion.section {...fadeUpDelayed(0.05)} className="mb-12">
          <div className="p-5 rounded-xl border border-accent/20 bg-accent/[0.03]">
            <p className="text-sm text-muted leading-relaxed">{CHINESE_ZODIAC_DISCLAIMER}</p>
          </div>
        </motion.section>

        {/* Historia */}
        <motion.section {...fadeUpDelayed(0.1)} className="mb-16 sm:mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Historia y origen</h2>
          </div>
          <div className="max-w-3xl space-y-4">
            <p className="text-base text-foreground leading-relaxed">
              El zod&#237;aco chino tiene una antig&#252;edad de al menos 2000 a&#241;os, con ra&#237;ces en la dinast&#237;a Han. A diferencia de la astrolog&#237;a occidental, que se basa en la posici&#243;n de las estrellas, el zod&#237;aco chino se basa en un <strong>calendario</strong>: el calendario sexagenario.
            </p>
            <p className="text-base text-foreground leading-relaxed">
              Este sistema combina <strong>12 animales</strong> (ra&#237;ces terrestres) con <strong>10 troncos celestes</strong> (asociados a los 5 elementos en polaridad Yin/Yang), creando un ciclo de <strong>60 combinaciones &#250;nicas</strong>.
            </p>
            <p className="text-base text-foreground leading-relaxed">
              La data m&#225;s antigua que se conoce proviene de tablillas de hueso oraculares de la dinast&#237;a Shang (c. 1250 a.C.), donde ya aparecen los 12 animales asociados a meses.
            </p>
            <div className="p-5 rounded-xl border border-border bg-card mt-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-2">En resumen</p>
              <p className="text-sm text-muted leading-relaxed">
                El zod&#237;aco chino es un sistema de data cultural verificable. No es un sistema de predicciones, sino un modelo c&#237;clico que estructura el tiempo de una cultura.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Los 12 animales */}
        <motion.section {...fadeUpDelayed(0.15)} className="mb-16 sm:mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Los 12 animales</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CHINESE_ANIMALS.map((animal, i) => (
              <motion.button key={animal.name} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03, duration: 0.35 }} onClick={() => router.push(`/conocimiento/zodiaco-chino/${animal.name.toLowerCase()}`)} className="text-left p-4 rounded-xl border border-border bg-card hover:border-accent transition-all group">
                <p className="text-2xl mb-1">{animal.emoji}</p>
                <h3 className="font-serif text-base font-semibold text-foreground group-hover:text-accent transition-colors">{animal.name}</h3>
                <p className="text-[10px] text-muted mt-1">{animal.traits.slice(0, 3).join(", ")}</p>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Los 5 elementos */}
        <motion.section {...fadeUpDelayed(0.2)} className="mb-16 sm:mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Los 5 elementos</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CHINESE_ELEMENTS.map((el) => (
              <div key={el.name} className="p-5 rounded-xl border border-border bg-card">
                <p className="font-serif text-xl font-semibold text-foreground mb-2">{el.name}</p>
                <p className="text-xs text-muted mb-2">Yin/Yang: {el.yinYang}</p>
                <p className="text-xs text-muted">{el.qualities.join(" · ")}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Fuentes */}
        <motion.section {...fadeUpDelayed(0.25)} className="mb-16 sm:mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Fuentes</h2>
          </div>
          <div className="space-y-3 max-w-3xl">
            {[
              { title: "Chinese Zodiac", author: "Encyclopaedia Britannica", url: "https://www.britannica.com/topic/Chinese-zodiac" },
              { title: "The Handbook of Chinese Horoscopes", author: "Theodora Lau (1979), Tuttle Publishing" },
              { title: "Chinese Astrology: A Primer", author: "Stephen Skinner (2000)" },
            ].map((src) => (
              <div key={src.title} className="flex items-start gap-3 py-2">
                <div className="w-1.5 h-1.5 rounded-full bg-border mt-2 shrink-0" />
                <div>
                  <p className="text-sm text-foreground">{src.title}</p>
                  <p className="text-xs text-muted">{src.author}{src.url ? ` · ${src.url}` : ""}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section {...fadeUpDelayed(0.3)}>
          <div className="p-5 rounded-xl border border-border bg-card">
            <p className="text-xs text-muted leading-relaxed">{MOLINO_DISCLAIMER}</p>
          </div>
        </motion.section>
      </main>
      <UniversityFooter />
    </div>
  );
}
