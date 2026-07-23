"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp, fadeUpDelayed } from "@/lib/utils/motion";
import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import { ARCHETYPES } from "@/lib/data";
import { ZODIAC_SYMBOLS, ELEMENT_COLORS, ARCHETYPE_DESCRIPTIONS } from "@/lib/data/constants";
import { safeNumber } from "@/lib/utils/score";
import { useProfile } from "@/lib/hooks/useProfile";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import dynamic from "next/dynamic";
import ShareableCard from "@/components/profile/ShareableCard";
import LoadingState from "@/components/ui/LoadingState";

const ProfileRadar = dynamic(() => import("@/components/charts/ProfileRadar"), { ssr: false });

function ProfileContent({ profile }: { profile: UserProfile }) {
  const router = useRouter();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const lifePath = safeNumber(profile.lifePath, 1);
  const expressionNumber = safeNumber(profile.expressionNumber, 0);
  const soulNumber = safeNumber(profile.soulNumber, 0);
  const personalityNumber = safeNumber(profile.personalityNumber, 0);
  const name = typeof profile.name === "string" ? profile.name : "";
  const birthDate = typeof profile.birthDate === "string" ? profile.birthDate : "";
  const sunSign = typeof profile.sunSign === "string" ? profile.sunSign : "";
  const sunSignSymbol = ZODIAC_SYMBOLS[sunSign] || "♈";
  const element = typeof profile.element === "string" ? profile.element : "";
  const modality = typeof profile.modality === "string" ? profile.modality : "";
  const chineseZodiac = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";
  const chineseElement = typeof profile.chineseZodiacInfo?.element === "string" ? profile.chineseZodiacInfo.element : "";
  const archetypeName = typeof profile.archetype === "string" ? profile.archetype : "";
  const archetypeDescription = typeof profile.archetypeInfo?.description === "string" ? profile.archetypeInfo.description : ARCHETYPE_DESCRIPTIONS[lifePath] || "";
  const archetypeStrengths = Array.isArray(profile.archetypeInfo?.strengths) ? profile.archetypeInfo.strengths : [];
  const archetypeChallenges = Array.isArray(profile.archetypeInfo?.challenges) ? profile.archetypeInfo.challenges : [];
  const personalYear = safeNumber(profile.cycles?.personalYear, 0);
  const personalMonth = safeNumber(profile.cycles?.personalMonth, 0);
  const personalDay = safeNumber(profile.cycles?.personalDay, 0);
  const archetype = ARCHETYPES[lifePath];
  const elementColor = ELEMENT_COLORS[element] || "var(--element-fire)";

  const yearThemes: Record<number, string> = {
    1: "Semillas, independencia, liderazgo.",
    2: "Relaciones, paciencia, diplomacia.",
    3: "Creatividad, comunicación, alegría.",
    4: "Trabajo, estabilidad, disciplina.",
    5: "Libertad, aventura, transformación.",
    6: "Familia, hogar, servicio.",
    7: "Análisis, espiritualidad, sabiduría.",
    8: "Poder, abundancia, logros.",
    9: "Finalización, compasión, liberación.",
    11: "Intuición, inspiración, despertar espiritual.",
    22: "Visión práctica, manifestación a gran escala.",
    33: "Servicio, compasión, transformación global.",
  };

  const nextSteps = (() => {
    const steps: string[] = [];
    if (personalYear === 1 || personalYear === 11) {
      steps.push("Este es un año para empezar algo nuevo. Elegí un proyecto y lanzate.");
    } else if (personalYear === 9) {
      steps.push("Un ciclo está cerrando. Dejá ir lo que ya no te sirve.");
    } else if (personalYear === 7) {
      steps.push("Un año para profundizar. Dedicate al aprendizaje y la introspección.");
    } else {
      steps.push("Tu año tiene energía de crecimiento. Aprovechá para avanzar.");
    }
    if (archetypeStrengths.length > 0) {
      steps.push(`Tu fortaleza natural es ${archetypeStrengths[0].toLowerCase()}. Usala conscientemente esta semana.`);
    }
    if (archetypeChallenges.length > 0) {
      steps.push(`Notá si aparece ${archetypeChallenges[0].toLowerCase()}. No es un defecto, es una zona de crecimiento.`);
    }
    return steps;
  })();

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />

      <main className="mx-auto max-w-content px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">

        {/* ═══════════════════════════════════════════════════════════════
            01 — IDENTIDAD
            ═══════════════════════════════════════════════════════════════ */}
        <motion.section {...fadeUp} className="mb-16 sm:mb-24">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[11px] font-medium" style={{ color: elementColor }}>01</span>
            <div className="w-8 h-px" style={{ backgroundColor: elementColor }} aria-hidden="true" />
            <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium">Identidad</p>
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground leading-[1.05]">
            {name}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted">
            <span>{birthDate}</span>
            <span className="w-1 h-1 rounded-full bg-border" aria-hidden="true" />
            <span>{sunSignSymbol} {sunSign}</span>
            <span className="w-1 h-1 rounded-full bg-border" aria-hidden="true" />
            <span>{chineseZodiac}</span>
          </div>

          {archetype && (
            <div className="mt-8 sm:mt-10">
              <p className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium mb-2">Tu arquetipo</p>
              <p className="font-serif text-2xl sm:text-3xl font-semibold" style={{ color: elementColor }}>
                {archetype.name}
              </p>
              {archetype.quote && (
                <p className="text-base sm:text-lg text-muted mt-3 italic max-w-lg">&ldquo;{archetype.quote}&rdquo;</p>
              )}
            </div>
          )}

          {/* Identity synthesis */}
          <div className="mt-8 sm:mt-10 max-w-2xl">
            <p className="text-base sm:text-lg text-muted leading-relaxed">
              {archetypeDescription}
            </p>
          </div>

          {/* Core numbers — minimal, elegant */}
          <div className="mt-10 sm:mt-14 flex flex-wrap gap-6 sm:gap-10">
            {[
              { label: "Life Path", value: lifePath },
              { label: "Expresión", value: expressionNumber || "—" },
              { label: "Alma", value: soulNumber || "—" },
              { label: "Personalidad", value: personalityNumber || "—" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-serif font-semibold" style={{ color: elementColor }}>
                  {item.value}
                </p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium mt-1">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════════════════════════
            SHAREABLE CARD
            ═══════════════════════════════════════════════════════════════ */}
        <motion.section {...fadeUpDelayed(0.05)} className="mb-16 sm:mb-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Compartir</p>
          </div>
          <ShareableCard
            name={name}
            birthDate={birthDate}
            lifePath={lifePath}
            sunSign={sunSign}
            element={element}
            chineseZodiac={chineseZodiac}
            archetype={archetypeName}
            expressionNumber={expressionNumber}
            soulNumber={soulNumber}
            personalityNumber={personalityNumber}
          />
        </motion.section>

        {/* ═══════════════════════════════════════════════════════════════
            02 — PATRONES
            ═══════════════════════════════════════════════════════════════ */}
        <motion.section {...fadeUpDelayed(0.1)} className="mb-16 sm:mb-24">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[11px] font-medium text-muted">02</span>
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Patrones</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
            {/* Strengths */}
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-accent font-medium mb-4">Fortalezas</p>
              <ul className="space-y-3">
                {archetypeStrengths.map((item: string) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: elementColor }} aria-hidden="true" />
                    <span className="text-sm sm:text-base text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Challenges */}
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium mb-4">Desafíos</p>
              <ul className="space-y-3">
                {archetypeChallenges.map((item: string) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-border mt-2 shrink-0" aria-hidden="true" />
                    <span className="text-sm sm:text-base text-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* How you process */}
          <div className="mt-10 sm:mt-14 max-w-2xl">
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              Como <span className="text-foreground font-medium">{archetypeName}</span>, tu energía natural se organiza alrededor de{" "}
              <span className="text-foreground font-medium">{archetypeStrengths.slice(0, 2).join(" y ").toLowerCase()}</span>.
              {archetypeChallenges.length > 0 && (
                <> Tus zonas de crecimiento aparecen cuando operás desde <span className="text-foreground font-medium">{archetypeChallenges[0].toLowerCase()}</span>.</>
              )}
            </p>
          </div>

          {/* Radar chart */}
          <div className="mt-10 sm:mt-14">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium mb-4">Tu radar simbólico</p>
            <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
              <ProfileRadar
                data={[
                  { subject: "Comunicación", value: Math.min((expressionNumber || lifePath) * 10, 100) },
                  { subject: "Motivación", value: Math.min((soulNumber || lifePath) * 10, 100) },
                  { subject: "Imagen", value: Math.min((personalityNumber || lifePath) * 10, 100) },
                  { subject: "Estabilidad", value: Math.min(lifePath * 10, 100) },
                  { subject: "Intuición", value: 50 + (lifePath % 5) * 10 },
                  { subject: "Acción", value: Math.min((lifePath + expressionNumber) * 8, 100) },
                ]}
                color={elementColor}
              />
            </div>
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════════════════════════
            03 — CONEXIONES
            ═══════════════════════════════════════════════════════════════ */}
        <motion.section {...fadeUpDelayed(0.15)} className="mb-16 sm:mb-24">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[11px] font-medium text-muted">03</span>
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Conexiones</h2>
          </div>

          <div className="space-y-6">
            {/* Connection 1: Element + Life Path */}
            {element && (
              <div className="p-5 sm:p-6 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: elementColor }} aria-hidden="true" />
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium">Elemento + Life Path</p>
                </div>
                <p className="text-sm sm:text-base text-muted leading-relaxed">
                  Tu elemento <span className="text-foreground font-medium">{element}</span> y tu Life Path{" "}
                  <span className="text-foreground font-medium">{lifePath}</span> crean una base donde{" "}
                  {element === "Fuego" && "la pasión y la iniciativa se combinan con la dirección de tu camino."}
                  {element === "Tierra" && "la estabilidad y la práctica se combinan con la dirección de tu camino."}
                  {element === "Aire" && "la comunicación y la idea se combinan con la dirección de tu camino."}
                  {element === "Agua" && "la intuición y la emoción se combinan con la dirección de tu camino."}
                  {!["Fuego", "Tierra", "Aire", "Agua"].includes(element) && "tu energía única se combina con la dirección de tu camino."}
                </p>
              </div>
            )}

            {/* Connection 2: Zodiac + Expression */}
            <div className="p-5 sm:p-6 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--layer-astrology)" }} aria-hidden="true" />
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium">Signo solar + Expresión</p>
              </div>
              <p className="text-sm sm:text-base text-muted leading-relaxed">
                Tu signo <span className="text-foreground font-medium">{sunSignSymbol} {sunSign}</span>{" "}
                {expressionNumber && (
                  <>con Expression <span className="text-foreground font-medium">{expressionNumber}</span> significa que te expresás a través de{" "}
                  {expressionNumber <= 3 ? "la creatividad y la comunicación" :
                   expressionNumber <= 6 ? "el servicio y la armonía" :
                   expressionNumber <= 9 ? "el conocimiento y la visión global" :
                   "una energía única que combina intuición y acción"}.</>
                )}
                {!expressionNumber && "influye en cómo te presentás al mundo."}
              </p>
            </div>

            {/* Connection 3: Chinese + Soul */}
            <div className="p-5 sm:p-6 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--layer-cycles)" }} aria-hidden="true" />
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium">Zodiaco chino + Alma</p>
              </div>
              <p className="text-sm sm:text-base text-muted leading-relaxed">
                Tu signo chino <span className="text-foreground font-medium">{chineseZodiac}</span> ({chineseElement}){" "}
                {soulNumber && (
                  <>con Alma <span className="text-foreground font-medium">{soulNumber}</span> revela que tus deseos más profundos se orientan hacia{" "}
                  {soulNumber <= 3 ? "la expresión creativa y la alegría" :
                   soulNumber <= 6 ? "el amor, la familia y la armonía" :
                   soulNumber <= 9 ? "la sabiduría y el servicio a los demás" :
                   "una búsqueda de significado profundo"}.</>
                )}
                {!soulNumber && "suma un estilo de acción a tu forma de ser."}
              </p>
            </div>
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════════════════════════
            04 — TIMING
            ═══════════════════════════════════════════════════════════════ */}
        <motion.section {...fadeUpDelayed(0.2)} className="mb-16 sm:mb-24">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[11px] font-medium text-muted">04</span>
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Timing</h2>
          </div>

          {/* Year context */}
          <div className="mb-8">
            <p className="text-[11px] uppercase tracking-[0.2em] text-accent font-medium mb-2">Año personal {personalYear}</p>
            <p className="text-lg sm:text-xl font-serif font-semibold text-foreground">
              {yearThemes[personalYear] || "Un año de crecimiento y aprendizaje."}
            </p>
          </div>

          {/* Cycle bars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Año", value: personalYear, desc: "El tema general" },
              { label: "Mes", value: personalMonth, desc: "La energía de este mes" },
              { label: "Día", value: personalDay, desc: "Tu energía hoy" },
            ].map((cycle) => (
              <div key={cycle.label} className="p-4 rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium">{cycle.label}</p>
                  <span className="text-xl font-serif font-semibold" style={{ color: elementColor }}>{cycle.value || "—"}</span>
                </div>
                <div className="w-full h-1 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(((cycle.value || 0) / 9) * 100, 100)}%`,
                      backgroundColor: elementColor,
                    }}
                  />
                </div>
                <p className="text-xs text-muted mt-2">{cycle.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════════════════════════
            05 — DECISIONES
            ═══════════════════════════════════════════════════════════════ */}
        <motion.section {...fadeUpDelayed(0.25)} className="mb-16 sm:mb-24">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[11px] font-medium text-muted">05</span>
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Decisiones</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Aligned */}
            <div className="p-5 sm:p-6 rounded-xl border border-border bg-card">
              <p className="text-[11px] uppercase tracking-[0.2em] text-accent font-medium mb-3">Alineado</p>
              <ul className="space-y-2">
                {archetypeStrengths.slice(0, 3).map((item: string) => (
                  <li key={item} className="text-sm text-muted flex items-start gap-2">
                    <span className="text-accent mt-0.5" aria-hidden="true">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted mt-4 leading-relaxed">
                Estas áreas están naturalmente potenciadas por tu perfil.
              </p>
            </div>

            {/* Tension */}
            <div className="p-5 sm:p-6 rounded-xl border border-border bg-card">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Tensión</p>
              <ul className="space-y-2">
                {archetypeChallenges.slice(0, 3).map((item: string) => (
                  <li key={item} className="text-sm text-muted flex items-start gap-2">
                    <span className="text-border mt-0.5" aria-hidden="true">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted mt-4 leading-relaxed">
                Estas áreas te invitan a crecer y expandirte.
              </p>
            </div>
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════════════════════════
            06 — EVOLUCIÓN
            ═══════════════════════════════════════════════════════════════ */}
        <motion.section {...fadeUpDelayed(0.3)} className="mb-16 sm:mb-24">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[11px] font-medium text-muted">06</span>
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Evolución</h2>
          </div>

          <div className="space-y-4">
            {nextSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-4 p-4 sm:p-5 rounded-xl border border-border bg-card">
                <span className="text-lg font-serif font-semibold shrink-0" style={{ color: elementColor }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm sm:text-base text-muted leading-relaxed">{step}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button variant="secondary" fullWidth onClick={() => router.push("/explore")}>
              Explorar conocimiento
            </Button>
            <Button variant="secondary" fullWidth onClick={() => router.push("/compatibility/argentina")}>
              Ver compatibilidad
            </Button>
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════════════════════════
            ZODIAC SUMMARY — minimal, elegant
            ═══════════════════════════════════════════════════════════════ */}
        <motion.section {...fadeUpDelayed(0.35)} className="mb-16 sm:mb-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Tus sistemas</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-border bg-card text-center">
              <p className="text-3xl mb-2">{sunSignSymbol}</p>
              <p className="text-sm font-medium text-foreground">{sunSign}</p>
              <p className="text-xs text-muted mt-1">Elemento: {element} · {modality}</p>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card text-center">
              <p className="text-3xl mb-2">🐉</p>
              <p className="text-sm font-medium text-foreground">{chineseZodiac}</p>
              <p className="text-xs text-muted mt-1">Elemento: {chineseElement}</p>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card text-center">
              <p className="text-3xl mb-2" style={{ color: elementColor }}>∞</p>
              <p className="text-sm font-medium text-foreground">{archetypeName}</p>
              <p className="text-xs text-muted mt-1">Life Path {lifePath}</p>
            </div>
          </div>
        </motion.section>

      </main>

      {/* Back to top */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-card border border-border shadow-lg text-muted hover:text-foreground hover:border-accent transition-all focus:outline-none focus:ring-2 focus:ring-accent/40"
          aria-label="Volver arriba"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}

      <UniversityFooter />
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { profile, mounted } = useProfile({ redirectIfNotFound: false });

  if (!mounted) {
    return <LoadingState message="Cargando tu perfil..." />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <UniversityHeader />
        <div className="mx-auto max-w-content px-4 sm:px-6 py-24 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-4">Mi mapa personal</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">
            Todavía no creaste tu mapa
          </h1>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Ingresá tu nombre y fecha de nacimiento para generar tu perfil de Personal Intelligence.
          </p>
          <Button size="lg" onClick={() => router.push("/")}>
            Crear mi perfil
          </Button>
        </div>
        <UniversityFooter />
      </div>
    );
  }

  return <ProfileContent profile={profile} />;
}
