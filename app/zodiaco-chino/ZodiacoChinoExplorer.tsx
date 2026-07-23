"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import { CHINESE_ANIMALS, CHINESE_ZODIAC_DISCLAIMER } from "@/lib/data/zodiaco-chino-content";
import { MOLINO_DISCLAIMER } from "@/lib/data/sources";
import { getSexagenaryYear, ANIMALS, type SexagenaryYear } from "@/lib/data/sexagenary-cycle";

const WU_XING = [
  { name: "Madera", direction: "Este", season: "Primavera", quality: "Crecimiento, flexibilidad, expansión", generates: "Fuego", controlledBy: "Metal", color: "var(--element-wood)" },
  { name: "Fuego", direction: "Sur", season: "Verano", quality: "Pasión, transformación, energía", generates: "Tierra", controlledBy: "Agua", color: "var(--element-fire)" },
  { name: "Tierra", direction: "Centro", season: "Entre estaciones", quality: "Estabilidad, nutrición, equilibrio", generates: "Metal", controlledBy: "Madera", color: "#8B7355" },
  { name: "Metal", direction: "Oeste", season: "Otoño", quality: "Precisión, estructura, claridad", generates: "Agua", controlledBy: "Fuego", color: "var(--element-metal)" },
  { name: "Agua", direction: "Norte", season: "Invierno", quality: "Profundidad, intuición, fluidez", generates: "Madera", controlledBy: "Tierra", color: "var(--element-water)" },
];

const ELEMENT_COLORS: Record<string, string> = {
  "Madera": "var(--element-wood)", "Fuego": "var(--element-fire)", "Tierra": "#8B7355", "Metal": "var(--element-metal)", "Agua": "var(--element-water)",
};

const TABS = [
  { key: "explorar" as const, label: "Explorar" },
  { key: "animales" as const, label: "12 Animales" },
  { key: "wuxing" as const, label: "Wu Xing" },
  { key: "yinyang" as const, label: "Yin / Yang" },
  { key: "historia" as const, label: "Historia" },
];

export default function ZodiacoChinoExplorer() {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState(2024);
  const [activeTab, setActiveTab] = useState<"explorar" | "animales" | "wuxing" | "yinyang" | "historia">("explorar");
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const currentYear = useMemo(() => getSexagenaryYear(selectedYear), [selectedYear]);

  // Global year data — used across ALL tabs
  const cycleNeighbors = useMemo(() => {
    const years: { year: number; animal: string; element: string; polarity: string }[] = [];
    for (let y = selectedYear - 10; y <= selectedYear + 10; y++) {
      const sy = getSexagenaryYear(y);
      years.push({ year: y, animal: sy.animal, element: sy.element, polarity: sy.polarity });
    }
    return years;
  }, [selectedYear]);

  const cyclePosition = useMemo(() => {
    const baseYear = 1924;
    const idx = ((selectedYear - baseYear) % 60 + 60) % 60;
    return { current: idx + 1, total: 60, percent: Math.round(((idx + 1) / 60) * 100) };
  }, [selectedYear]);

  // Find the animal for the current year in the 12-animal list
  const currentAnimalIndex = useMemo(() => {
    return ANIMALS.indexOf(currentYear.animal);
  }, [currentYear]);

  // Auto-select Wu Xing element when tab changes to wuxing
  const effectiveElement = useMemo(() => {
    if (activeTab === "wuxing") {
      return selectedElement || currentYear.element;
    }
    return selectedElement;
  }, [activeTab, selectedElement, currentYear.element]);

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />
      <main className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">

        <nav className="text-xs text-muted mb-8" aria-label="Breadcrumb">
          <span className="hover:text-accent cursor-pointer" onClick={() => router.push("/")}>Inicio</span>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-foreground font-medium">Zod&#237;aco Chino</span>
        </nav>

        {/* HERO */}
        <motion.section {...fadeUp} className="mb-10 sm:mb-14">
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent font-medium mb-4">Un sistema de ciclos</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.08] max-w-4xl">
            Zod&#237;aco Chino
          </h1>
          <p className="text-lg sm:text-xl text-muted mt-4 leading-relaxed max-w-2xl">
            Un sistema tradicional que estructura el tiempo mediante 12 animales, 5 elementos y polaridades Yin/Yang, formando un ciclo de 60 combinaciones &#250;nicas.
          </p>
          <p className="text-sm text-muted mt-4 max-w-xl leading-relaxed">
            No es una ciencia. Es una tradici&#243;n cultural de m&#225;s de 2000 a&#241;os que Molino presenta como herramienta de exploraci&#243;n simb&#243;lica.
          </p>
        </motion.section>

        {/* ═══ SELECTOR GLOBAL DE A&#209;O ═══ */}
        <motion.section {...fadeUp} className="mb-8 p-6 sm:p-8 rounded-2xl border border-border bg-card">
          <label className="block text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Seleccion&#225; un a&#241;o del ciclo</label>
          <div className="flex items-center gap-4 mb-4">
            <button type="button" onClick={() => setSelectedYear(y => Math.max(1924, y - 1))} className="w-10 h-10 rounded-full border border-border text-foreground hover:border-accent transition-colors flex items-center justify-center flex-shrink-0" aria-label="A&#241;o anterior">&larr;</button>
            <input type="range" min={1924} max={2083} value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="flex-1 min-w-0" aria-label="Seleccionar a&#241;o" />
            <button type="button" onClick={() => setSelectedYear(y => Math.min(2083, y + 1))} className="w-10 h-10 rounded-full border border-border text-foreground hover:border-accent transition-colors flex items-center justify-center flex-shrink-0" aria-label="A&#241;o siguiente">&rarr;</button>
            <span className="text-3xl font-serif font-bold text-accent min-w-[80px] text-center flex-shrink-0">{selectedYear}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted">
            <span>Ciclo {cyclePosition.current} de {cyclePosition.total}</span>
            <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
              <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${cyclePosition.percent}%` }} />
            </div>
            <span>{cyclePosition.percent}%</span>
          </div>
        </motion.section>

        {/* ═══ TABS ═══ */}
        <div className="mb-10 border-b border-border">
          <div className="flex gap-1 overflow-x-auto pb-0 -mb-px">
            {TABS.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-all ${activeTab === tab.key ? "border-accent text-accent" : "border-transparent text-muted hover:text-foreground hover:border-border"}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ═══ TAB: EXPLORAR ═══ */}
        <AnimatePresence mode="wait">
          {activeTab === "explorar" && (
            <motion.div key="explorar" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-px bg-border" />
                  <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Composici&#243;n del a&#241;o {selectedYear}</h2>
                </div>

                {/* Composici&#243;n visual — protagonista */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="p-5 rounded-xl border border-border bg-card text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">A&#241;o</p>
                    <p className="font-serif text-3xl font-bold text-foreground">{selectedYear}</p>
                  </div>
                  <div className="p-5 rounded-xl border border-border bg-card text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Animal</p>
                    <p className="font-serif text-2xl font-bold text-foreground">{currentYear.animal}</p>
                    <p className="text-[10px] text-muted mt-1">{currentYear.branchName}</p>
                  </div>
                  <div className="p-5 rounded-xl border border-border bg-card text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Elemento</p>
                    <p className="font-serif text-2xl font-bold" style={{ color: ELEMENT_COLORS[currentYear.element] }}>{currentYear.element}</p>
                    <p className="text-[10px] text-muted mt-1">{currentYear.stemName}</p>
                  </div>
                  <div className="p-5 rounded-xl border border-border bg-card text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Polaridad</p>
                    <p className="font-serif text-2xl font-bold text-foreground">{currentYear.polarity}</p>
                    <p className="text-[10px] text-muted mt-1">{currentYear.polarity === "Yang" ? "Principio activo" : "Principio receptivo"}</p>
                  </div>
                </div>

                {/* Descripci&#243;n */}
                <div className="p-5 rounded-xl border border-accent/20 bg-accent/[0.03]">
                  <p className="text-sm text-foreground leading-relaxed">
                    <strong>{selectedYear}</strong> es un a&#241;o <strong>{currentYear.polarity}</strong> del signo <strong>{currentYear.animal}</strong> con elemento <strong>{currentYear.element}</strong>.
                    {currentYear.polarity === "Yang" ? " La energ&#237;a de este a&#241;o es activa, expansiva y luminosa." : " La energ&#237;a de este a&#241;o es receptiva, contemplativa y centrada."}
                    {' '}Se encuentra en la posici&#243;n {cyclePosition.current} del ciclo sexagenario.
                  </p>
                </div>

                {/* Timeline */}
                <div className="mt-8 p-6 rounded-2xl border border-border bg-card">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-4">Cerca de {selectedYear}</p>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {cycleNeighbors.map((y) => (
                      <button key={y.year} onClick={() => setSelectedYear(y.year)} className={`flex-shrink-0 w-16 p-3 rounded-xl text-center transition-all ${y.year === selectedYear ? "border-2 border-accent bg-accent/10" : "border border-border hover:border-accent/50"}`}>
                        <p className="text-xs font-medium text-foreground">{y.year}</p>
                        <p className="text-lg mt-1">{CHINESE_ANIMALS.find(a => a.name === y.animal)?.emoji || "?"}</p>
                        <p className="text-[9px] text-muted mt-0.5">{y.animal}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ TAB: 12 ANIMALES ═══ */}
        <AnimatePresence mode="wait">
          {activeTab === "animales" && (
            <motion.div key="animales" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-px bg-border" />
                  <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Los 12 animales</h2>
                </div>
                <p className="text-sm text-muted mb-8 max-w-2xl leading-relaxed">
                  Cada animal representa una energ&#237;a fundamental. El a&#241;o <strong>{selectedYear}</strong> corresponde al <strong>{currentYear.animal}</strong> (posici&#243;n {currentAnimalIndex + 1} de 12).
                </p>

                <div className="space-y-4">
                  {CHINESE_ANIMALS.map((animal, i) => {
                    const isCurrent = animal.name === currentYear.animal;
                    return (
                      <motion.button key={animal.name} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-20px" }} transition={{ delay: i * 0.02, duration: 0.3 }} onClick={() => setSelectedAnimal(selectedAnimal === animal.name ? null : animal.name)} className={`w-full text-left p-5 rounded-xl border transition-all ${isCurrent ? "border-accent bg-accent/[0.03]" : "border-border bg-card hover:border-accent"}`}>
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{animal.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                              <h3 className="font-serif text-lg font-semibold text-foreground">{animal.name}</h3>
                              <span className="text-[10px] text-muted">#{i + 1} de 12</span>
                              {isCurrent && <span className="text-[9px] px-2 py-0.5 rounded-full bg-accent text-background font-medium">Tu a&#241;o</span>}
                            </div>
                            <p className="text-xs text-muted mt-1">{animal.traits.slice(0, 3).join(" \u00b7 ")}</p>
                          </div>
                          <span className="text-sm text-muted shrink-0">{selectedAnimal === animal.name ? "\u25b2" : "\u25bc"}</span>
                        </div>
                        <AnimatePresence>
                          {selectedAnimal === animal.name && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <div className="mt-4 pt-4 border-t border-border space-y-4">
                                <div>
                                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Significado tradicional</p>
                                  <p className="text-sm text-foreground leading-relaxed">{animal.meaning}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="p-3 rounded-lg bg-background">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-1">Fortalezas</p>
                                    <p className="text-xs text-foreground">{animal.strengths.slice(0, 3).join(", ")}</p>
                                  </div>
                                  <div className="p-3 rounded-lg bg-background">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-1">Desaf&#237;os</p>
                                    <p className="text-xs text-foreground">{animal.challenges.slice(0, 3).join(", ")}</p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Compatibilidad</p>
                                  <p className="text-[10px] text-muted/70 mb-2">Seg&#250;n la tradici&#243;n de las Tr&#237;adas (San He) y los Cuatro Choques (Si Hai).</p>
                                  <div className="flex flex-wrap gap-2">
                                    <span className="text-xs px-2 py-1 rounded-full border border-accent/30 text-foreground">{animal.compatibility.friendly.join(", ")}</span>
                                    <span className="text-xs px-2 py-1 rounded-full border border-border text-muted">{animal.compatibility.challenging.join(", ")}</span>
                                  </div>
                                  <p className="text-[10px] text-muted/50 mt-2">Estas son interpretaciones de una escuela espec&#237;fica. Otras tradiciones pueden ofrecer clasificaciones diferentes.</p>
                                </div>
                                <button type="button" onClick={(e) => { e.stopPropagation(); router.push(`/conocimiento/zodiaco-chino/${animal.name.toLowerCase()}`); }} className="text-xs text-accent hover:text-accent/80 transition-colors">
                                  Explorar {animal.name} &rarr;
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    );
                  })}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ TAB: WU XING ═══ */}
        <AnimatePresence mode="wait">
          {activeTab === "wuxing" && (
            <motion.div key="wuxing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-px bg-border" />
                  <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Wu Xing &#8212; Los 5 Elementos</h2>
                </div>
                <p className="text-sm text-muted mb-4 max-w-2xl leading-relaxed">
                  El Wu Xing es un modelo de relaciones din&#225;micas. Cada elemento tiene un ciclo de generaci&#243;n y un ciclo de control.
                </p>
                <p className="text-sm text-muted mb-8">
                  El a&#241;o <strong>{selectedYear}</strong> tiene elemento <strong style={{ color: ELEMENT_COLORS[currentYear.element] }}>{currentYear.element}</strong>. Seleccion&#225; un elemento para explorar sus relaciones.
                </p>

                {/* Selector de elemento */}
                <div className="flex flex-wrap gap-3 mb-10">
                  {WU_XING.map((el) => {
                    const isCurrentYear = el.name === currentYear.element;
                    return (
                      <button key={el.name} onClick={() => setSelectedElement(effectiveElement === el.name ? null : el.name)} className={`px-5 py-3 rounded-xl text-sm font-medium transition-all border ${effectiveElement === el.name ? "bg-accent text-background border-accent" : "border-border bg-card text-foreground hover:border-accent/50"}`}>
                        <span className="w-2 h-2 rounded-full inline-block mr-2" style={{ backgroundColor: el.color }} />
                        {el.name}
                        {isCurrentYear && <span className="ml-1 text-[9px] text-accent font-medium">*</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Los 5 elementos — cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                  {WU_XING.map((el) => {
                    const isCurrentYear = el.name === currentYear.element;
                    const isSelected = effectiveElement === el.name;
                    return (
                      <div key={el.name} className={`p-5 rounded-xl border transition-all ${isSelected ? "border-accent bg-accent/[0.03]" : "border-border bg-card"}`}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: el.color }} />
                          <p className="font-serif text-lg font-semibold text-foreground">{el.name}</p>
                          {isCurrentYear && <span className="text-[9px] px-2 py-0.5 rounded-full bg-accent text-background font-medium">Tu elemento</span>}
                        </div>
                        <p className="text-xs text-muted mb-2">{el.season} \u00b7 {el.direction}</p>
                        <p className="text-sm text-foreground leading-relaxed">{el.quality}</p>
                        {isSelected && (
                          <div className="mt-4 pt-3 border-t border-border/50 space-y-2">
                            <p className="text-xs"><span className="text-accent font-medium">Genera:</span> {el.generates}</p>
                            <p className="text-xs"><span className="text-muted font-medium">Generado por:</span> {WU_XING.find(w => w.generates === el.name)?.name || "?"}</p>
                            <p className="text-xs"><span className="text-accent font-medium">Controla:</span> {el.controlledBy}</p>
                            <p className="text-xs"><span className="text-muted font-medium">Controlado por:</span> {WU_XING.find(w => w.controlledBy === el.name)?.name || "?"}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Ciclos visuales */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-6 rounded-xl border border-border bg-card">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-3">Ciclo de generaci&#243;n</p>
                    <p className="text-xs text-muted mb-4">Cada elemento &ldquo;alimenta&rdquo; al siguiente.</p>
                    <div className="space-y-2">
                      {WU_XING.map((el, i) => (
                        <div key={i} className="flex items-center gap-3 py-1.5">
                          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: el.color }} />
                          <span className="text-sm text-foreground">{el.name}</span>
                          <span className="text-accent">&rarr;</span>
                          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: ELEMENT_COLORS[el.generates] }} />
                          <span className="text-sm text-foreground">{el.generates}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 rounded-xl border border-border bg-card">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Ciclo de control</p>
                    <p className="text-xs text-muted mb-4">Cada elemento &ldquo;limita&rdquo; al siguiente.</p>
                    <div className="space-y-2">
                      {WU_XING.map((el, i) => (
                        <div key={i} className="flex items-center gap-3 py-1.5">
                          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: el.color }} />
                          <span className="text-sm text-foreground">{el.name}</span>
                          <span className="text-accent">&sup;</span>
                          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: ELEMENT_COLORS[el.controlledBy] }} />
                          <span className="text-sm text-foreground">{el.controlledBy}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ TAB: YIN / YANG ═══ */}
        <AnimatePresence mode="wait">
          {activeTab === "yinyang" && (
            <motion.div key="yinyang" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-px bg-border" />
                  <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Yin / Yang</h2>
                </div>
                <p className="text-sm text-muted mb-8 max-w-2xl leading-relaxed">
                  Yin y Yang no son &ldquo;bueno vs. malo&rdquo;. Son polaridades complementarias. En el zod&#237;aco chino, cada a&#241;o tiene una polaridad asignada seg&#250;n el tronco celeste. El a&#241;o <strong>{selectedYear}</strong> es <strong>{currentYear.polarity}</strong>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className={`p-6 rounded-xl border transition-all ${currentYear.polarity === "Yang" ? "border-accent bg-accent/[0.03]" : "border-border bg-card"}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <p className="font-serif text-2xl font-semibold text-foreground">Yang (&#38470;)</p>
                      {currentYear.polarity === "Yang" && <span className="text-[9px] px-2 py-0.5 rounded-full bg-accent text-background font-medium">Tu a&#241;o</span>}
                    </div>
                    <p className="text-sm text-muted leading-relaxed mb-3">Principio activo, expansivo, luminoso. Se asocia con el sol, el cielo y la energ&#237;a que avanza.</p>
                    <div className="flex flex-wrap gap-2">
                      {["Rata", "Tigre", "Drag\u00f3n", "Caballo", "Mono", "Perro"].map(a => (
                        <span key={a} className={`text-xs px-2 py-0.5 rounded-full border ${a === currentYear.animal && currentYear.polarity === "Yang" ? "border-accent text-accent font-medium" : "border-border text-foreground"}`}>{a}</span>
                      ))}
                    </div>
                  </div>
                  <div className={`p-6 rounded-xl border transition-all ${currentYear.polarity === "Yin" ? "border-accent bg-accent/[0.03]" : "border-border bg-card"}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <p className="font-serif text-2xl font-semibold text-foreground">Yin (&#38471;)</p>
                      {currentYear.polarity === "Yin" && <span className="text-[9px] px-2 py-0.5 rounded-full bg-accent text-background font-medium">Tu a&#241;o</span>}
                    </div>
                    <p className="text-sm text-muted leading-relaxed mb-3">Principio receptivo, contemplativo, centrado. Se asocia con la luna, la tierra y la energ&#237;a que se retrae.</p>
                    <div className="flex flex-wrap gap-2">
                      {["Buey", "Conejo", "Serpiente", "Cabra", "Gallo", "Cerdo"].map(a => (
                        <span key={a} className={`text-xs px-2 py-0.5 rounded-full border ${a === currentYear.animal && currentYear.polarity === "Yin" ? "border-accent text-accent font-medium" : "border-border text-foreground"}`}>{a}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ TAB: HISTORIA ═══ */}
        <AnimatePresence mode="wait">
          {activeTab === "historia" && (
            <motion.div key="historia" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-px bg-border" />
                  <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Historia y fuentes</h2>
                </div>
                <div className="max-w-3xl space-y-6">
                  <p className="text-sm text-foreground leading-relaxed">
                    El zod&#237;aco chino tiene al menos 2000 a&#241;os de antig&#252;edad. La data m&#225;s antigua proviene de tablillas de hueso oraculares de la dinast&#237;a Shang (c. 1250 a.C.).
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    El sistema se codific&#243; durante la dinast&#237;a Han (206 a.C. &#8211; 220 d.C.). El ciclo sexagenario combina los 12 animales con los 10 troncos celestes, creando 60 combinaciones &#250;nicas.
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    A diferencia de la astrolog&#237;a occidental, el zod&#237;aco chino se basa en un <strong>calendario</strong>. Es un sistema temporal, no astron&#243;mico.
                  </p>
                  <div className="p-5 rounded-xl border border-border bg-card">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-3">Diferencia importante</p>
                    <p className="text-sm text-foreground leading-relaxed">
                      Las interpretaciones de &ldquo;personalidad&rdquo; asociadas a cada animal son mayormente <strong>interpretaciones populares modernas</strong>, no tradiciones acad&#233;micas verificadas.
                    </p>
                  </div>
                </div>
                <div className="mt-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-px bg-border" />
                    <h3 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Fuentes</h3>
                  </div>
                  <div className="space-y-3 max-w-3xl">
                    {[
                      { title: "Chinese Zodiac", author: "Encyclopaedia Britannica", url: "https://www.britannica.com/topic/Chinese-zodiac" },
                      { title: "The Handbook of Chinese Horoscopes", author: "Theodora Lau (1979), Tuttle Publishing" },
                      { title: "Chinese Astrology: A Primer", author: "Stephen Skinner (2000)" },
                      { title: "Oracle Bones", author: "Peter Hessler (2006), HarperCollins" },
                    ].map((src) => (
                      <div key={src.title} className="flex items-start gap-3 py-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-border mt-2 shrink-0" />
                        <div>
                          <p className="text-sm text-foreground">{src.title}</p>
                          <p className="text-xs text-muted">{src.author}{src.url ? ` \u00b7 ${src.url}` : ""}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ CTA ═══ */}
        <section className="mb-8 py-10 px-6 sm:px-10 rounded-2xl border border-accent/20 bg-accent/[0.03] text-center">
          <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-medium mb-3">&#191;Quer&#233;s ver tu combinaci&#243;n personal?</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-3">Calcul&#225; tu signo chino</h2>
          <p className="text-sm text-muted mb-6 max-w-md mx-auto">
            Ingres&#225; tu fecha de nacimiento y descubr&#237; tu animal, elemento y polaridad dentro del ciclo.
          </p>
          <button type="button" onClick={() => router.push("/herramientas/zodiaco-chino")} className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-8 py-3 text-sm bg-primary text-primary-foreground shadow-md hover:bg-accent hover:text-accent-foreground min-h-[48px]">
            Calcular mi combinaci&#243;n
          </button>
        </section>

        {/* DISCLAIMER */}
        <section className="mt-8 space-y-4">
          <div className="p-5 rounded-xl border border-border bg-card">
            <p className="text-xs text-muted leading-relaxed">{CHINESE_ZODIAC_DISCLAIMER}</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-xs text-muted leading-relaxed">{MOLINO_DISCLAIMER}</p>
          </div>
        </section>

      </main>
      <UniversityFooter />
    </div>
  );
}
