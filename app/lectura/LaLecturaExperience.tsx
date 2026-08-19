"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSafeReducedMotion } from "@/lib/hooks/useSafeReducedMotion";
import { getProfileSalt } from "@/lib/profile-salt";
import { getPremiumTokenClient } from "@/lib/premium";
import { sortLightEntities, type LightAffinityResult } from "@/lib/affinity-light";
import { ELEMENT_COLORS } from "@/lib/data/constants";
import type { UserProfile } from "@/types/user";
import type { LightweightEntity } from "@/types/atlas";
import type { MolinoInterpretation } from "@/lib/engines/intelligence/types";
import Logo from "@/components/ui/Logo";
import BuildingMolino from "@/components/ui/BuildingMolino";
import EntityVisual from "@/components/ui/EntityVisual";

interface Props {
  profile: UserProfile;
  catalog: LightweightEntity[];
}

async function fetchLectura(profile: UserProfile): Promise<MolinoInterpretation | null> {
  try {
    const res = await fetch("/api/intelligence/interpret", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: profile.name,
        dob: profile.birthDate,
        salt: getProfileSalt(),
        type: "personal_profile",
        premiumToken: getPremiumTokenClient(),
      }),
    });
    const data = await res.json();
    if (!res.ok) return null;
    return (data.ai as MolinoInterpretation) ?? (data.fallback as MolinoInterpretation) ?? null;
  } catch {
    return null;
  }
}

/** Un panel de afinidades — top 3 de un tipo de entidad, computado con la
 * misma fórmula real que /affinity (sortLightEntities · getRelation). */
function AfinidadPanel({ title, entities }: { title: string; entities: LightAffinityResult[] }) {
  if (entities.length === 0) return null;
  return (
    <div className="py-6 sm:py-8 border-t border-ink/10 first:border-t-0">
      <h3 className="font-heading text-base sm:text-lg text-foreground mb-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {entities.map((e) => (
          <Link
            key={e.id}
            href={`/affinity/${e.type}/${e.id}`}
            target="_blank"
            className="flex items-center gap-3 p-3 border border-ink/10 bg-paper-alt hover:border-accent/40 transition-colors group"
          >
            <EntityVisual visualType={e.visualType} emoji={e.emoji} name={e.name} countryISO={e.countryISO} size={32} />
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate group-hover:text-accent transition-colors">{e.name}</p>
              <p className="text-xs text-muted">{e.relationship}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function LaLecturaExperience({ profile, catalog }: Props) {
  const reduceMotion = useSafeReducedMotion();
  const [interpretation, setInterpretation] = useState<MolinoInterpretation | null>(null);
  const [fetchDone, setFetchDone] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchLectura(profile).then((result) => {
      if (cancelled) return;
      setInterpretation(result);
      setFetchDone(true);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.birthDate, profile.name]);

  const elementColor = ELEMENT_COLORS[typeof profile.element === "string" ? profile.element : ""] || "var(--color-accent)";
  const userAnimal = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";

  const affinities = useMemo(() => {
    if (!userAnimal) return { countries: [], cities: [], brands: [] };
    const sorted = sortLightEntities(userAnimal, catalog);
    return {
      countries: sorted.filter((e) => e.type === "country").slice(0, 3),
      cities: sorted.filter((e) => e.type === "city").slice(0, 3),
      brands: sorted.filter((e) => e.type === "brand").slice(0, 3),
    };
  }, [userAnimal, catalog]);

  const hasAffinities = affinities.countries.length + affinities.cities.length + affinities.brands.length > 0;

  if (!revealed) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">
          <BuildingMolino done={fetchDone} onComplete={() => setRevealed(true)} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Cresta — el molino, quieto, coronando la lectura */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.6, ease: "easeOut" }}
        className="flex justify-center pt-16 pb-8"
      >
        <Logo className="h-10 w-10 text-accent" />
      </motion.div>

      <div className="mx-auto max-w-[760px] px-6 sm:px-8 pb-32">
        {!interpretation ? (
          <p className="text-center text-muted text-sm py-20">
            No pudimos generar tu lectura esta vez. Volvé a{" "}
            <Link href="/profile" className="text-accent underline underline-offset-4">tu mapa</Link> e intentá de nuevo.
          </p>
        ) : (
          <>
            {/* Panel central — el ícono de este testamento */}
            <motion.section
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : 0.1 }}
              className="text-center mb-16 sm:mb-20"
            >
              {interpretation.opening && (
                <p className="font-display italic text-2xl sm:text-3xl leading-[1.3] text-foreground mb-8 max-w-2xl mx-auto">
                  {interpretation.opening}
                </p>
              )}
              <p
                className="font-display italic text-[clamp(2.25rem,6vw,3.75rem)] leading-[1.05] tracking-tight max-w-2xl mx-auto"
                style={{ color: elementColor }}
              >
                {interpretation.summary}
              </p>
              {interpretation.corePattern && (
                <p className="text-base sm:text-lg text-foreground/80 leading-relaxed max-w-xl mx-auto mt-8">
                  {interpretation.corePattern.whyItMatters}
                </p>
              )}
            </motion.section>

            {/* Las dos alas — fortalezas y tensiones, abriéndose desde el centro */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-ink/10 mb-16 sm:mb-20">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : 0.25 }}
                className="bg-paper p-8 sm:p-10"
              >
                <h2 className="font-heading text-lg sm:text-xl text-foreground mb-5">Lo que te sostiene</h2>
                {interpretation.strengths.length > 0 && (
                  <ul className="space-y-3 mb-6">
                    {interpretation.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-foreground leading-relaxed">
                        <span className="w-3 h-px bg-accent mt-[0.6em] shrink-0" aria-hidden="true" />
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
                {interpretation.howYouOperate && (
                  <p className="text-sm text-muted leading-relaxed pt-4 border-t border-ink/10">
                    {interpretation.howYouOperate}
                  </p>
                )}
              </motion.div>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : 0.25 }}
                className="bg-paper-alt p-8 sm:p-10"
              >
                <h2 className="font-heading text-lg sm:text-xl text-foreground mb-5">Lo que pide tu atención</h2>
                {interpretation.tensions.length > 0 && (
                  <ul className="space-y-3 mb-6">
                    {interpretation.tensions.map((t, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted leading-relaxed">
                        <span className="w-3 h-px bg-ink/30 mt-[0.6em] shrink-0" aria-hidden="true" />
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
                {interpretation.whatToConsider.length > 0 && (
                  <ul className="space-y-2 pt-4 border-t border-ink/10">
                    {interpretation.whatToConsider.map((c, i) => (
                      <li key={i} className="text-xs text-muted leading-relaxed">{c}</li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </div>

            {/* Recomendación — el paso siguiente, destacado */}
            {interpretation.suggestedNextStep && (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.4 }}
                className="text-center mb-16 sm:mb-20 py-8 border-y border-ink/10"
              >
                <p className="text-base sm:text-lg text-foreground font-medium leading-relaxed max-w-xl mx-auto">
                  {interpretation.suggestedNextStep}
                </p>
              </motion.div>
            )}

            {/* Cierre — la síntesis, como colofón */}
            {interpretation.closingSynthesis && (
              <motion.blockquote
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.5 }}
                className="text-center font-display italic text-xl sm:text-2xl leading-[1.5] text-foreground max-w-xl mx-auto mb-20 sm:mb-24"
              >
                &ldquo;{interpretation.closingSynthesis}&rdquo;
              </motion.blockquote>
            )}

            {/* Predela — tus mayores afinidades, en el mismo lenguaje que /affinity */}
            {hasAffinities && (
              <motion.section
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.6 }}
                className="border-t-2 border-ink/15 pt-10"
              >
                <p className="font-heading text-lg sm:text-xl text-foreground mb-2">Lo que resuena con vos</p>
                <p className="text-xs text-muted mb-2">
                  Calculado con el mismo criterio que el resto de Molino — tu animal del zodíaco chino contra el de cada entidad.
                </p>
                <AfinidadPanel title="Países" entities={affinities.countries} />
                <AfinidadPanel title="Ciudades" entities={affinities.cities} />
                <AfinidadPanel title="Marcas" entities={affinities.brands} />
              </motion.section>
            )}

            {/* Confianza — sin mencionar el mecanismo de generación, a pedido
                explícito: esta lectura no se presenta como salida de un
                sistema, es tu mapa. */}
            <p className="text-center font-mono text-[11px] text-muted/60 mt-16">
              Confianza: {interpretation.confidence}
            </p>
          </>
        )}

        <div className="text-center mt-16">
          <Link href="/profile" className="text-xs font-mono text-muted hover:text-accent transition-colors">
            ← Volver a tu mapa
          </Link>
        </div>
      </div>
    </main>
  );
}
