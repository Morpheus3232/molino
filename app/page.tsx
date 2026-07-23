"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp, fadeUpDelayed } from "@/lib/utils/motion";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import { ELEMENT_COLORS } from "@/lib/data/constants";
import LoadingState from "@/components/ui/LoadingState";

const DEMO = {
  name: "Martín",
  birthDate: "12/04/1992",
  lifePath: 7,
  sunSign: "Aries",
  sunSymbol: "♈",
  element: "Fuego",
  modality: "Cardinal",
  chineseZodiac: "Mono",
  chineseElement: "Metal",
  archetype: "El Investigador",
  archetypeQuote: "La verdad no teme a la pregunta.",
  archetypeDescription: "Tu energía es la verdad interna. Desarrollás la sabiduría, la observación y la capacidad de ir más allá de lo superficial.",
  personalYear: 3,
  personalMonth: 5,
  personalDay: 9,
  expressionNumber: 5,
  soulNumber: 3,
  personalityNumber: 7,
  strengths: ["Análisis", "Sabiduría", "Observación", "Intuición"],
};

const PILLARS = [
  { num: "01", title: "Identity", subtitle: "Quién sos", description: "Tu Life Path, arquetipo y elemento fundamental." },
  { num: "02", title: "Patterns", subtitle: "Qué se repite", description: "Fortalezas, desafíos y tendencias recurrentes." },
  { num: "03", title: "Alignment", subtitle: "Qué encaja", description: "Afinidad con personas, lugares y conceptos." },
  { num: "04", title: "Timing", subtitle: "Cuándo actuar", description: "Tu año, mes y día personal." },
  { num: "05", title: "Decisions", subtitle: "Cómo elegir", description: "Herramientas para tomar decisiones con más conciencia." },
];

const LAYERS = [
  { title: "Numerología", description: "Life Path, Expression, Alma y Personalidad.", color: "var(--element-fire)" },
  { title: "Astrología", description: "Signo solar, elemento y modalidad.", color: "var(--layer-astrology)" },
  { title: "Zodiaco chino", description: "Animal y elemento del ciclo lunar.", color: "var(--layer-moment)" },
  { title: "Ciclos", description: "Año, mes y día personal.", color: "var(--layer-cycles)" },
  { title: "Patrones", description: "Fortalezas y desafíos recurrentes.", color: "var(--layer-patterns)" },
  { title: "Timing", description: "El momento actual y能量.", color: "var(--layer-identity)" },
  { title: "Decisiones", description: "Cómo usar la información.", color: "var(--score-good)" },
  { title: "Evolución", description: "Cómo cambia con el tiempo.", color: "var(--element-earth)" },
];

const QUESTIONS = [
  "¿Por qué repito ciertos patrones?",
  "¿Qué tipo de energía tengo en este ciclo?",
  "¿Qué áreas de mi vida están pidiendo atención?",
  "¿Qué momento estoy atravesando?",
  "¿Qué decisiones puedo mirar desde otra perspectiva?",
];

export default function Home() {
  const router = useRouter();
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("molino.user-profile.v1");
    if (stored) {
      router.replace("/profile");
    } else {
      setCheckingProfile(false);
    }
  }, [router]);

  if (checkingProfile) {
    return <LoadingState message="Cargando..." />;
  }

  const elementColor = ELEMENT_COLORS[DEMO.element] || "var(--element-fire)";

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />

      <main id="main-content">

        {/* ═══════════════════════════════════════════════════════════════
            1. HERO
            ═══════════════════════════════════════════════════════════════ */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] via-transparent to-transparent pointer-events-none" aria-hidden="true" />

          <div className="mx-auto max-w-[1200px] w-full px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center relative">
            <motion.div {...fadeUp} className="space-y-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-8 h-px bg-accent" aria-hidden="true" />
                <p className="text-[11px] uppercase tracking-[0.35em] text-accent font-medium">
                  Personal Intelligence Platform
                </p>
                <div className="w-8 h-px bg-accent" aria-hidden="true" />
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-foreground leading-[1.08] max-w-4xl mx-auto">
                Conocé tu sistema personal.
              </h1>

              <p className="mx-auto max-w-2xl text-base sm:text-lg text-muted leading-relaxed">
                Una lectura integrada de tu identidad, patrones, ciclos y timing a partir de tus datos de nacimiento.
              </p>

              <motion.div {...fadeUpDelayed(0.15)} className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/onboarding")}
                  className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all px-10 py-4 text-base bg-primary text-primary-foreground shadow-md hover:bg-accent hover:text-accent-foreground hover:shadow-lg min-h-[56px]"
                >
                  Crear mi perfil
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/explore")}
                  className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all px-8 py-4 text-base bg-transparent text-secondary border border-border hover:border-accent hover:text-accent min-h-[56px]"
                >
                  Explorar conocimiento
                </button>
              </motion.div>

              <motion.p {...fadeUpDelayed(0.2)} className="text-xs text-muted">
                Gratis · Sin registro · Tu mapa se genera en segundos
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            2. PROFILE PREVIEW
            ═══════════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-24 border-t border-border">
          <div className="mx-auto max-w-[1100px] w-full px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp}>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-accent font-medium mb-2">Tu mapa personal</p>
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
                    Así se ve tu perfil
                  </h2>
                </div>
                <span className="text-[11px] uppercase tracking-[0.15em] text-muted border border-border rounded-full px-3 py-1 self-start sm:self-auto">
                  Ejemplo ilustrativo
                </span>
              </div>
            </motion.div>

            {/* Profile card */}
            <motion.div {...fadeUpDelayed(0.1)} className="border border-border rounded-2xl overflow-hidden bg-card">
              {/* Header */}
              <div className="px-6 sm:px-8 py-5 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-serif font-bold" style={{ backgroundColor: elementColor, color: "var(--color-background)" }}>
                    {DEMO.lifePath}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-semibold text-foreground">{DEMO.name}</h3>
                    <p className="text-sm text-muted">{DEMO.birthDate} · {DEMO.sunSymbol} {DEMO.sunSign} · {DEMO.chineseZodiac}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium">Arquetipo</p>
                  <p className="text-sm font-medium" style={{ color: elementColor }}>{DEMO.archetype}</p>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 sm:px-8 py-6 sm:py-8">
                {/* Identity reading */}
                <div className="mb-8 p-5 rounded-xl bg-background">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-accent font-medium mb-2">Tu identidad</p>
                  <p className="text-sm text-muted leading-relaxed">
                    <span className="text-foreground font-medium">{DEMO.name}</span> es un <span className="text-foreground font-medium">{DEMO.archetype}</span>. {DEMO.archetypeDescription}
                  </p>
                </div>

                {/* Core numbers */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
                  {[
                    { label: "Life Path", value: DEMO.lifePath },
                    { label: "Expresión", value: DEMO.expressionNumber },
                    { label: "Alma", value: DEMO.soulNumber },
                    { label: "Personalidad", value: DEMO.personalityNumber },
                  ].map((item) => (
                    <div key={item.label} className="text-center p-4 rounded-xl bg-background">
                      <p className="text-3xl sm:text-4xl font-serif font-semibold" style={{ color: elementColor }}>{item.value}</p>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium mt-2">{item.label}</p>
                    </div>
                  ))}
                </div>

                {/* Strengths */}
                <div className="mb-8">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-accent font-medium mb-3">Fortalezas</p>
                  <div className="flex flex-wrap gap-2">
                    {DEMO.strengths.map((s) => (
                      <span key={s} className="px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-background text-foreground">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cycles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  {[
                    { label: "Año personal", value: DEMO.personalYear, desc: "El tema general" },
                    { label: "Mes personal", value: DEMO.personalMonth, desc: "La energía de este mes" },
                    { label: "Día personal", value: DEMO.personalDay, desc: "Tu energía hoy" },
                  ].map((item) => (
                    <div key={item.label} className="p-4 rounded-xl border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium">{item.label}</p>
                        <span className="text-xl font-serif font-semibold" style={{ color: elementColor }}>{item.value}</span>
                      </div>
                      <div className="w-full h-1 rounded-full bg-border overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(item.value / 9) * 100}%`, backgroundColor: elementColor }} />
                      </div>
                      <p className="text-xs text-muted mt-2">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.p {...fadeUpDelayed(0.2)} className="text-center text-xs text-muted mt-6">
              Ejemplo ilustrativo — los resultados se generan a partir de tus propios datos.
            </motion.p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            3. PERSONAL INTELLIGENCE SYSTEM
            ═══════════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-24 border-t border-border">
          <div className="mx-auto max-w-[1100px] w-full px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-12">
              <p className="text-[11px] uppercase tracking-[0.25em] text-accent font-medium mb-3">El método Molino</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
                Un sistema. Cinco dimensiones.
              </h2>
              <p className="text-sm text-muted mt-3 max-w-xl mx-auto">
                Cada perfil se construye alrededor de cinco dimensiones que se conectan entre sí.
              </p>
            </motion.div>

            <motion.div {...fadeUpDelayed(0.1)} className="relative">
              {/* Desktop: horizontal flow */}
              <div className="hidden lg:flex items-start justify-between gap-2">
                {PILLARS.map((pillar, i) => (
                  <div key={pillar.num} className="flex-1 relative">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-accent font-medium mb-3">{pillar.num}</div>
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-1">{pillar.title}</h3>
                    <p className="text-sm text-muted mb-2">{pillar.subtitle}</p>
                    <p className="text-xs text-muted leading-relaxed">{pillar.description}</p>
                    {i < PILLARS.length - 1 && (
                      <div className="absolute top-5 -right-4 text-border text-lg" aria-hidden="true">→</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile: vertical flow */}
              <div className="lg:hidden space-y-8">
                {PILLARS.map((pillar) => (
                  <div key={pillar.num} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center shrink-0">
                      <span className="text-xs font-medium text-muted">{pillar.num}</span>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-foreground">{pillar.title}</h3>
                      <p className="text-sm text-muted">{pillar.subtitle}</p>
                      <p className="text-xs text-muted mt-1 leading-relaxed">{pillar.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            4. UN MAPA, MUCHAS CAPAS
            ═══════════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-24 border-t border-border">
          <div className="mx-auto max-w-[1100px] w-full px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-12">
              <p className="text-[11px] uppercase tracking-[0.25em] text-accent font-medium mb-3">Un mapa. Muchas capas.</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
                Múltiples perspectivas. Un solo perfil.
              </h2>
            </motion.div>

            <motion.div {...fadeUpDelayed(0.1)} className="relative max-w-3xl mx-auto">
              {/* Central node */}
              <div className="flex justify-center mb-8">
                <div className="px-6 py-3 rounded-full border border-accent/30 bg-accent/5">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-accent font-medium">Tu Mapa</p>
                </div>
              </div>

              {/* Connector line */}
              <div className="hidden sm:block absolute left-1/2 top-12 bottom-0 w-px bg-border -translate-x-1/2" aria-hidden="true" />

              {/* Layers grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {LAYERS.map((layer, i) => (
                  <motion.div
                    key={layer.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: i * 0.05, duration: 0.4, ease: "easeOut" }}
                    className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-accent/50 transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: layer.color }} aria-hidden="true" />
                    <div>
                      <h3 className="text-sm font-medium text-foreground">{layer.title}</h3>
                      <p className="text-xs text-muted mt-0.5">{layer.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.p {...fadeUpDelayed(0.15)} className="text-center text-xs text-muted mt-8 max-w-xl mx-auto">
              Un solo perfil. Múltiples perspectivas. Todo conectado.
            </motion.p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            5. QUÉ PODÉS DESCUBRIR
            ═══════════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-24 border-t border-border">
          <div className="mx-auto max-w-[900px] w-full px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-10">
              <p className="text-[11px] uppercase tracking-[0.25em] text-accent font-medium mb-3">Reflexión</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
                ¿Qué podés descubrir?
              </h2>
            </motion.div>

            <motion.div {...fadeUpDelayed(0.1)} className="space-y-4">
              {QUESTIONS.map((q, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" }}
                  className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card"
                >
                  <span className="text-lg font-serif font-semibold shrink-0" style={{ color: elementColor }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm sm:text-base text-foreground">{q}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            6. DOS MANERAS DE USAR MOLINO
            ═══════════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-24 border-t border-border">
          <div className="mx-auto max-w-[900px] w-full px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-10">
              <p className="text-[11px] uppercase tracking-[0.25em] text-accent font-medium mb-3">Molino</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
                Dos maneras de empezar
              </h2>
            </motion.div>

            <motion.div {...fadeUpDelayed(0.1)} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card">
                <p className="text-[11px] uppercase tracking-[0.2em] text-accent font-medium mb-3">A</p>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">Crear tu perfil</h3>
                <p className="text-sm text-muted leading-relaxed mb-6">
                  Generá tu mapa personal y explorá las capas de tu identidad, patrones y timing.
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/onboarding")}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all px-6 py-3 text-sm bg-primary text-primary-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
                >
                  Crear mi perfil
                </button>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card">
                <p className="text-[11px] uppercase tracking-[0.2em] text-accent font-medium mb-3">B</p>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">Explorar libremente</h3>
                <p className="text-sm text-muted leading-relaxed mb-6">
                  Aprendé sobre numerología, astrología, zodiaco chino y más sin crear perfil.
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/explore")}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all px-6 py-3 text-sm bg-transparent text-secondary border border-border hover:border-accent hover:text-accent"
                >
                  Explorar conocimiento
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            7. TRUST
            ═══════════════════════════════════════════════════════════════ */}
        <section className="py-12 sm:py-16 border-t border-border">
          <div className="mx-auto max-w-[900px] w-full px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center">
              <p className="text-sm font-medium text-foreground mb-2">Autoconocimiento, no predicción.</p>
              <p className="text-xs text-muted leading-relaxed max-w-xl mx-auto">
                Molino combina sistemas simbólicos y herramientas de reflexión para ayudarte a explorar patrones personales. No busca predecir tu futuro ni reemplaza decisiones profesionales.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            8. FINAL CTA
            ═══════════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-24 border-t border-border">
          <div className="mx-auto max-w-[900px] w-full px-4 sm:px-6 lg:px-8 text-center">
            <motion.div {...fadeUp}>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-3">
                Tu perfil es el comienzo.
              </h2>
              <p className="text-sm text-muted mb-8 max-w-md mx-auto">
                Creá tu mapa personal y explorá las conexiones entre identidad, patrones, timing y decisiones.
              </p>
              <button
                type="button"
                onClick={() => router.push("/onboarding")}
                className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all px-10 py-4 text-base bg-primary text-primary-foreground shadow-md hover:bg-accent hover:text-accent-foreground hover:shadow-lg min-h-[56px]"
              >
                Crear mi perfil
              </button>
            </motion.div>
          </div>
        </section>

      </main>

      <UniversityFooter />
    </div>
  );
}
