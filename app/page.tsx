"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import { getOrCreateProfile } from "@/lib/hooks/useProfile";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import { analyzeTiming } from "@/lib/engines/timingEngine";
import { buildPersonalRecommendations } from "@/lib/engines/personalRecommendationEngine";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { ARCHETYPES } from "@/lib/data";
import { getDayRule, YEAR_2026 } from "@/lib/data/symbolic-rules";
import type { UserProfile } from "@/types/user";
import type { PersonalRecommendation } from "@/lib/engines/personalRecommendationEngine";

/* ═══ Static data for non-profile home ═══ */

const SYSTEMS = [
  { title: "Numerolog\u00eda", subtitle: "El lenguaje de los n\u00fameros", description: "Tu Camino de Vida, Expression, Alma y Personalidad revelan capas diferentes de qui\u00e9n sos.", href: "/conocimiento/numerologia", color: "var(--element-fire)", icon: "\u2726" },
  { title: "Astrolog\u00eda", subtitle: "El mapa del cielo de tu nacimiento", description: "Tu signo solar, los planetas y las casas forman un mapa del cielo en el momento de tu nacimiento.", href: "/conocimiento/astrologia", color: "var(--layer-astrology)", icon: "\u2b50" },
  { title: "Zodiaco Chino", subtitle: "El ciclo de 12 animales", description: "Un sistema de 12 animales y 5 elementos que se repite cada 60 a\u00f1os. Tu animal y elemento definen tu estilo.", href: "/conocimiento/zodiaco-chino", color: "var(--layer-moment)", icon: "\ud83d\udc09" },
];

const STEPS = [
  { number: "01", title: "Cre\u00e1 tu perfil", description: "Ingres\u00e1 tu nombre y fecha de nacimiento. Molino calcula tu mapa a partir de m\u00faltiples sistemas simb\u00f3licos." },
  { number: "02", title: "Conoc\u00e9 tu mapa", description: "Numerolog\u00eda, astrolog\u00eda, zodiaco chino y arquetipos conectados en una sola lectura." },
  { number: "03", title: "Explor\u00e1 tus patrones", description: "Descubr\u00ed fortalezas, zonas de atenci\u00f3n y ciclos personales." },
  { number: "04", title: "Conect\u00e1 con el mundo", description: "Compar\u00e1 tu perfil con pa\u00edses, marcas, personas y conceptos." },
  { number: "05", title: "Tom\u00e1 perspectiva", description: "Us\u00e1 la informaci\u00f3n como herramienta de autoconocimiento y reflexi\u00f3n." },
];

const ENTITY_TYPE_ICONS: Record<string, string> = {
  brand: "\u2726", country: "\ud83c\udf0d", city: "\ud83c\udfdb\ufe0f",
  university: "\ud83c\udf93", team: "\u26bd", movie: "\ud83c\udfac", artist: "\ud83c\udfa4",
};

/* ═══ Helpers ═══ */

function formatTodayDate(): string {
  return new Date().toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
}

function getScoreColor(score: number): string {
  if (score >= 75) return "text-green-600";
  if (score >= 55) return "text-blue-600";
  if (score >= 40) return "text-yellow-600";
  return "text-red-600";
}

function getEnergyIcon(score: number): string {
  if (score >= 75) return "\u26a1";
  if (score >= 55) return "\ud83d\udd0b";
  if (score >= 40) return "\ud83c\udf19";
  return "\ud83d\udca4";
}

function getEnergyCopy(score: number, theme: string): { title: string; detail: string } {
  if (score >= 75) {
    return {
      title: "Tu energ\u00eda hoy est\u00e1 en su punto m\u00e1s alto",
      detail: `Con ${score}/100, tu energ\u00eda favorece la acci\u00f3n y la toma de decisiones. Tema del d\u00eda: ${theme}.`,
    };
  }
  if (score >= 55) {
    return {
      title: `Hoy tu energ\u00eda es ${theme || "equilibrada"}`,
      detail: `Con ${score}/100, es un buen momento para avanzar en lo que ten\u00e9s entre manos.`,
    };
  }
  return {
    title: "Hoy es un d\u00eda para pausar y observar",
    detail: `Con ${score}/100, tu energ\u00eda favorece la reflexi\u00f3n. Aprovech\u00e1 para revisar tus patrones.`,
  };
}

/* ═══ Personalized home (with profile) ═══ */

function PersonalizedHome({ profile }: { profile: UserProfile }) {
  const router = useRouter();
  const userAnimal = (profile.chineseZodiac ?? "") as string;
  const display = getZodiacDisplay(userAnimal);
  const lifePath = typeof profile.lifePath === "number" ? profile.lifePath : 1;
  const archetype = ARCHETYPES[lifePath] || ARCHETYPES[1];

  const today = useMemo(() => new Date(), []);

  const energy = useMemo(() => calculateDailyEnergy(profile, today), [profile, today]);
  const recMap = useMemo(() => buildPersonalRecommendations(profile), [profile]);

  const topResonances: PersonalRecommendation[] = useMemo(() => {
    return recMap.recommendations.filter((r) => r.totalScore >= 45).slice(0, 3);
  }, [recMap]);

  const discovery: PersonalRecommendation | null = recMap.recommendations[0] ?? null;

  const energyCopy = getEnergyCopy(energy.overallScore, energy.theme);
  const energyIcon = getEnergyIcon(energy.overallScore);
  const todayStr = useMemo(() => formatTodayDate(), []);

  const dayRule = useMemo(() => getDayRule(energy.personalDay), [energy.personalDay]);
  const is2026 = today.getFullYear() === 2026;
  const careers: string[] = useMemo(() => (archetype.careers || []).slice(0, 3), [archetype]);
  const luckyNumber = profile.luckyNumber;

  return (
    <>
      {/* ═══ 1. TU ENERGÍA DE HOY — Card unificada ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-20 sm:mb-28"
      >
        <div className="mb-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-3">
            Tu energ&iacute;a de hoy
          </p>
          <p className="text-sm text-muted">{todayStr}</p>
        </div>

        <div
          className="p-6 sm:p-8 rounded-2xl border border-border bg-card hover:border-accent/30 transition-all cursor-pointer"
          onClick={() => router.push("/daily-energy")}
        >
          {/* Score + theme */}
          <div className="flex items-start gap-5 mb-5">
            <span className="text-3xl shrink-0">{energyIcon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-serif text-xl sm:text-2xl font-semibold text-foreground mb-2">
                {energyCopy.title}
              </p>
              <p className="text-sm text-muted leading-relaxed mb-3">
                {energyCopy.detail}
              </p>
              <div className="flex items-center gap-3">
                <span className={`text-2xl font-serif font-bold ${getScoreColor(energy.overallScore)}`}>
                  {energy.overallScore}/100
                </span>
                <span className="text-xs text-muted">&middot; D&iacute;a personal {energy.personalDay} &middot; {energy.theme}</span>
              </div>
            </div>
          </div>

          {/* Day rule — favorece / evitá */}
          {dayRule && (
            <div className="border-t border-border pt-4 mb-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-2">
                Hoy es un d&iacute;a {dayRule.theme.toLowerCase()}
              </p>
              <p className="text-sm text-foreground leading-relaxed mb-3">
                {dayRule.interpretation}
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[140px]">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-muted font-medium mb-1.5">Hoy favorece</p>
                  <div className="flex flex-wrap gap-1.5">
                    {dayRule.favors.map((f) => (
                      <span key={f} className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">{f}</span>
                    ))}
                  </div>
                </div>
                <div className="flex-1 min-w-[140px]">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-muted font-medium mb-1.5">Evit&aacute;</p>
                  <div className="flex flex-wrap gap-1.5">
                    {dayRule.watchOut.map((w) => (
                      <span key={w} className="text-[10px] px-2 py-0.5 rounded-full bg-background text-muted font-medium border border-border">{w}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Year context — subtle line */}
          {is2026 && (
            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted leading-relaxed">
                {YEAR_2026.advice}
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="flex items-center gap-2 mt-4 text-sm font-medium text-accent">
            <span>Conoc&eacute; tu momento</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </div>
      </motion.section>

      {/* ═══ 2. LO QUE MÁS RESUENA CON VOS ═══ */}
      {topResonances.length > 0 && (
        <motion.section {...fadeUp} className="mb-20 sm:mb-28">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">
              Lo que m&aacute;s resuena con vos
            </h2>
          </div>

          <div className="space-y-3">
            {topResonances.map((rec, i) => (
              <motion.button
                key={rec.entity.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => router.push(`/affinity/${rec.entity.type}/${rec.entity.id}`)}
                className="w-full text-left p-5 rounded-xl border border-border bg-card hover:border-accent/30 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl shrink-0">
                    {rec.entity.emoji || ENTITY_TYPE_ICONS[rec.entity.type] || "\u2726"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground mb-1 group-hover:text-accent transition-colors">
                      {rec.entity.name}
                    </p>
                    <p className="text-xs text-muted/70 leading-relaxed">
                      {rec.entity.name} resuena especialmente con tu energ&iacute;a de {display.name}.
                    </p>
                  </div>
                  <span className="text-xs text-accent shrink-0 hidden sm:block mt-1 group-hover:translate-x-1 transition-transform">
                    &rarr;
                  </span>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => router.push("/affinity")}
              className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-6 py-3 text-sm border border-accent/30 bg-accent/[0.03] text-accent hover:bg-accent/10 min-h-[44px]"
            >
              Descubrir m&aacute;s &rarr;
            </button>
          </div>
        </motion.section>
      )}

      {/* ═══ 3. PODRÍA RESONAR CON VOS — 3 carreras ═══ */}
      {careers.length > 0 && (
        <motion.section {...fadeUp} className="mb-20 sm:mb-28">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">
              Podr&iacute;a resonar con vos
            </h2>
          </div>

          <p className="text-sm text-muted mb-6 max-w-lg">
            &Aacute;reas que podr&iacute;an conectarse con tus patrones simb&oacute;licos. {archetype.name} &mdash; {archetype.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {careers.map((career) => (
              <div
                key={career}
                className="p-4 rounded-xl border border-border bg-card"
              >
                <p className="text-sm font-medium text-foreground">{career}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => router.push("/profile?tab=identity")}
              className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-6 py-3 text-sm border border-accent/30 bg-accent/[0.03] text-accent hover:bg-accent/10 min-h-[44px]"
            >
              Explor&aacute; tu identidad &rarr;
            </button>
          </div>
        </motion.section>
      )}

      {/* ═══ 4. TU NÚMERO DE LA SUERTE ═══ */}
      {luckyNumber != null && (
        <motion.section {...fadeUp} className="mb-20 sm:mb-28">
          <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-4">
              <span className="text-3xl shrink-0">{"\ud83c\udf40"}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-1">
                  Tu n&uacute;mero de la suerte
                </p>
                <p className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                  {luckyNumber}
                </p>
                <p className="text-xs text-muted mt-1">
                  Tu n&uacute;mero simb&oacute;lico personal, calculado desde tu fecha de nacimiento.
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* ═══ 5. TU PRÓXIMO DESCUBRIMIENTO ═══ */}
      {discovery && (
        <motion.section {...fadeUp} className="mb-20 sm:mb-28">
          <div
            className="p-5 sm:p-6 rounded-2xl border border-border bg-card hover:border-accent/30 transition-all cursor-pointer"
            onClick={() => router.push(`/affinity/${discovery.entity.type}/${discovery.entity.id}`)}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl shrink-0">
                {discovery.entity.emoji || "\u25c6"}
              </span>
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium">
                Tu pr&oacute;ximo descubrimiento
              </p>
            </div>
            <p className="text-sm text-foreground leading-relaxed mb-3">
              {discovery.entity.name} resuena especialmente con tu energ&iacute;a de {display.name}.
            </p>
            <p className="text-xs text-muted leading-relaxed mb-4">
              {discovery.explanation}
            </p>
            <span className="text-sm font-medium text-accent group-hover:translate-x-1 transition-transform inline-block">
              Explorar &rarr;
            </span>
          </div>
        </motion.section>
      )}
    </>
  );
}

/* ═══ Generic home (no profile) ═══ */

function GenericHome() {
  const router = useRouter();

  return (
    <>
      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-24 sm:mb-32"
      >
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-5"
        >
          Inteligencia Personal
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground leading-[1.05] max-w-4xl"
        >
          Conoc&eacute; tu mapa.
          <br />
          <span className="text-muted">Entend&eacute; tus patrones.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-base sm:text-lg text-muted mt-7 max-w-xl leading-relaxed"
        >
          Molino conecta numerolog&iacute;a, astrolog&iacute;a, zodiaco chino y otros sistemas simb&oacute;licos para ayudarte a explorar patrones, ciclos, compatibilidades y decisiones.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row gap-3"
        >
          <button type="button" onClick={() => router.push("/onboarding")} className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-8 py-3.5 text-sm bg-primary text-primary-foreground shadow-md hover:bg-accent hover:text-accent-foreground min-h-[48px]">
            Crear mi perfil
          </button>
          <button type="button" onClick={() => router.push("/explore")} className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all px-8 py-3.5 text-sm bg-transparent text-secondary border border-border hover:border-accent hover:text-accent min-h-[48px]">
            Explorar Molino
          </button>
        </motion.div>
      </motion.section>

      {/* LOS TRES SISTEMAS */}
      <motion.section {...fadeUp} className="mb-24 sm:mb-32">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-px bg-border" aria-hidden="true" />
          <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Los tres sistemas</h2>
        </div>
        <div className="space-y-5">
          {SYSTEMS.map((system, i) => (
            <motion.button
              key={system.href}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -2 }}
              onClick={() => router.push(system.href)}
              className="w-full text-left p-6 sm:p-8 rounded-2xl border border-border bg-card hover:border-accent/40 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-start gap-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 transition-colors duration-300 group-hover:scale-105"
                  style={{ backgroundColor: `${system.color}12`, color: system.color }}
                  aria-hidden="true"
                >
                  {system.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-foreground group-hover:text-accent transition-colors duration-300">{system.title}</h3>
                  <p className="text-sm text-accent/80 mt-1 font-medium">{system.subtitle}</p>
                  <p className="text-sm text-muted mt-3 leading-relaxed max-w-lg">{system.description}</p>
                </div>
                <span className="text-sm text-muted group-hover:text-accent transition-colors duration-300 mt-2 shrink-0 hidden sm:block opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1">&rarr;</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* CÓMO FUNCIONA */}
      <motion.section {...fadeUp} className="mb-24 sm:mb-32 section-dark py-16 sm:py-20 rounded-2xl">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-px bg-background/20" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-background/60 font-medium">C&oacute;mo funciona</h2>
          </div>
          <div className="space-y-6">
            {STEPS.map((step, i) => (
              <motion.div key={step.number} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: i * 0.06, duration: 0.4 }} className="grid grid-cols-[auto_1fr] gap-6 sm:gap-8 py-5 border-b border-background/10 last:border-b-0">
                <span className="number-display text-2xl sm:text-3xl number-display-accent">{step.number}</span>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-semibold text-background">{step.title}</h3>
                  <p className="text-sm text-background/60 mt-1 leading-relaxed max-w-lg">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* HERRAMIENTAS */}
      <motion.section {...fadeUp} className="mb-24 sm:mb-32">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-px bg-border" aria-hidden="true" />
          <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Calcul&aacute; tu identidad</h2>
        </div>
        <p className="text-sm text-muted mb-8 max-w-lg">Sin registro. Sin guardar datos. Resultado inmediato.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Camino de Vida", icon: "\ud83d\udd22", href: "/herramientas/camino-de-vida", desc: "Tu n\u00famero numerol\u00f3gico" },
            { title: "Signo Solar", icon: "\u2b50", href: "/herramientas/signo-solar", desc: "Tu signo zodiacal" },
            { title: "Zod\u00edaco Chino", icon: "\ud83d\udc09", href: "/herramientas/zodiaco-chino", desc: "Tu animal y elemento" },
            { title: "Compatibilidad", icon: "\u2726", href: "/herramientas/compatibilidad", desc: "Conect\u00e1 dos perfiles" },
          ].map((tool) => (
            <button key={tool.href} type="button" onClick={() => router.push(tool.href)} className="text-left p-5 rounded-xl border border-border bg-card hover:border-accent/40 hover:shadow-md transition-all duration-300 group">
              <p className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-300">{tool.icon}</p>
              <p className="font-serif text-base font-semibold text-foreground group-hover:text-accent transition-colors duration-300">{tool.title}</p>
              <p className="text-xs text-muted mt-1.5">{tool.desc}</p>
            </button>
          ))}
        </div>
      </motion.section>

      {/* AFINIDAD SIMBÓLICA */}
      <motion.section {...fadeUp} className="mb-24 sm:mb-32">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-px bg-border" aria-hidden="true" />
          <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Afinidad Simb&oacute;lica</h2>
        </div>
        <p className="text-sm text-muted mb-8 max-w-lg">Descubr&iacute; c&oacute;mo resuenan entidades reales con tu perfil. Pa&iacute;ses, marcas, universidades, equipos y m&aacute;s.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { icon: "\ud83c\udf0d", label: "Pa&iacute;ses", href: "/affinity/country" },
            { icon: "\u2726", label: "Marcas", href: "/affinity/brand" },
            { icon: "\ud83c\udfdb\ufe0f", label: "Ciudades", href: "/affinity/city" },
            { icon: "\ud83c\udf93", label: "Universidades", href: "/affinity/university" },
          ].map((item) => (
            <button key={item.label} type="button" onClick={() => router.push(item.href)} className="text-left p-5 rounded-xl border border-border bg-card hover:border-accent/40 hover:shadow-md transition-all duration-300 group">
              <p className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-300">{item.icon}</p>
              <p className="font-serif text-base font-semibold text-foreground group-hover:text-accent transition-colors duration-300">{item.label}</p>
            </button>
          ))}
        </div>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => router.push("/affinity")}
            className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-6 py-3 text-sm border border-accent/30 bg-accent/[0.03] text-accent hover:bg-accent/10 min-h-[44px]"
          >
            Explorar todas las entidades &rarr;
          </button>
        </div>
      </motion.section>

      {/* CONCEPTOS */}
      <motion.section {...fadeUp} className="mb-24 sm:mb-32">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-px bg-border" aria-hidden="true" />
          <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Conceptos clave</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Arquetipos", description: "Los 9 arquetipos numerol\u00f3gicos y lo que revelan sobre tu energ\u00eda natural.", href: "/conocimiento/numerologia" },
            { title: "Elementos", description: "Fuego, Tierra, Aire, Agua. Cada elemento tiene una cualidad fundamental.", href: "/conocimiento/astrologia" },
            { title: "Ciclos", description: "Tu a\u00f1o, mes y d\u00eda personal. C\u00f3mo cambia tu energ\u00eda a lo largo del tiempo.", href: "/profile" },
            { title: "N\u00fameros maestros", description: "11, 22, 33. N\u00fameros especiales que amplifican la energ\u00eda de tu Camino de Vida.", href: "/conocimiento/numerologia" },
            { title: "Modalidades", description: "Cardinal, Fijo, Mutable. C\u00f3mo implement\u00e1s tu energ\u00eda en el mundo.", href: "/conocimiento/astrologia" },
            { title: "Compatibilidad", description: "C\u00f3mo conect\u00e1s con personas, pa\u00edses, marcas y conceptos a trav\u00e9s de tus sistemas.", href: "/compatibility/countries" },
          ].map((concept, i) => (
            <motion.button key={concept.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: i * 0.05, duration: 0.4 }} onClick={() => router.push(concept.href)} className="text-left p-5 rounded-xl border border-border bg-card hover:border-accent/40 hover:shadow-md transition-all duration-300 group">
              <h3 className="text-sm font-medium text-foreground group-hover:text-accent transition-colors duration-300">{concept.title}</h3>
              <p className="text-xs text-muted mt-2 leading-relaxed">{concept.description}</p>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* CTA FINAL */}
      <motion.section {...fadeUp}>
        <div className="w-8 h-px bg-border mx-auto mb-10" />
        <div className="text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-4">Tu mapa es el comienzo.</h2>
          <p className="text-sm text-muted mb-8 max-w-md mx-auto leading-relaxed">Cre&aacute; tu perfil personal y explor&aacute; las conexiones entre identidad, patrones, timing y decisiones.</p>
          <button type="button" onClick={() => router.push("/onboarding")} className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-8 py-3.5 text-sm bg-primary text-primary-foreground shadow-md hover:bg-accent hover:text-accent-foreground min-h-[48px]">
            Crear mi perfil
          </button>
        </div>
      </motion.section>
    </>
  );
}

/* ═══ Main ═══ */

export default function Home() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProfile(getOrCreateProfile());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />
      <main className="mx-auto max-w-wide px-5 sm:px-8 lg:px-12 pt-14 sm:pt-24 pb-28" id="main-content">
        {mounted && profile ? (
          <PersonalizedHome profile={profile} />
        ) : (
          <GenericHome />
        )}
      </main>
      <UniversityFooter />
    </div>
  );
}
