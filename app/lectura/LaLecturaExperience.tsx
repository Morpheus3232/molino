"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSafeReducedMotion } from "@/lib/hooks/useSafeReducedMotion";
import { getProfileSalt } from "@/lib/profile-salt";
import { getPremiumTokenClient } from "@/lib/premium";
import { ELEMENT_COLORS } from "@/lib/data/constants";
import { getCachedLectura, setCachedLectura } from "@/lib/session/lecturaCache";
import { getChineseZodiacRecommendations } from "@/lib/engines/chineseZodiacEngine";
import { buildPatterns, buildRules, buildPrinciples } from "@/lib/engines/synthesisEngine";
import { buildLuckyNumberProof } from "@/lib/calculations/proof";
import CalculationProof from "@/components/shared/CalculationProof";
import type { UserProfile } from "@/types/user";
import type { LightweightEntity } from "@/types/atlas";
import type { MolinoInterpretation } from "@/lib/engines/intelligence/types";
import Logo from "@/components/ui/Logo";
import BuildingMolino from "@/components/ui/BuildingMolino";
import LecturaAfinidadesFull from "@/components/lectura/LecturaAfinidadesFull";

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

export default function LaLecturaExperience({ profile, catalog }: Props) {
  const reduceMotion = useSafeReducedMotion();

  const [interpretation, setInterpretation] = useState<MolinoInterpretation | null>(null);
  const [fetchDone, setFetchDone] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // "La Lectura" es un documento único e irrepetible — si ya se generó para
  // este perfil, reabrirla la muestra tal cual quedó, sin recrearla ni
  // repetir la animación de construcción (ver lib/session/lecturaCache.ts).
  // El chequeo vive en este efecto (no en el estado inicial) a propósito:
  // localStorage no existe en el render de servidor, así que leerlo en el
  // inicializador de useState produce un mismatch de hidratación — server y
  // cliente arrancan iguales (revealed=false) y este efecto, que solo corre
  // en el cliente después del mount, resuelve el caché sin ese desajuste.
  useEffect(() => {
    const cached = getCachedLectura(profile.birthDate, profile.name || "");
    if (cached) {
      setInterpretation(cached);
      setFetchDone(true);
      setRevealed(true);
      return;
    }
    let cancelled = false;
    fetchLectura(profile).then((result) => {
      if (cancelled) return;
      setInterpretation(result);
      setFetchDone(true);
      if (result) setCachedLectura(profile.birthDate, profile.name || "", result);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.birthDate, profile.name]);

  const elementColor = ELEMENT_COLORS[typeof profile.element === "string" ? profile.element : ""] || "var(--color-accent)";
  const userAnimal = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";

  // Las 4 lecturas nuevas del zodíaco chino (alimento, mascota, timing,
  // color de elemento) — cálculo puro y local, sin IA, mismo criterio que
  // el resto de Molino.
  const zodiacExtras = useMemo(() => {
    try {
      return getChineseZodiacRecommendations(profile.birthDate);
    } catch {
      return null;
    }
  }, [profile.birthDate]);

  const luckyNumberInputs = useMemo(() => {
    const [year, month] = profile.birthDate.split("-").map((p) => parseInt(p, 10));
    return Number.isFinite(year) && Number.isFinite(month) ? { month, year } : null;
  }, [profile.birthDate]);

  // "02 · Tus principios" — antes vivía en /profile (gratis, sin IA); movido
  // acá porque es contenido de lectura, no de "cómo estoy configurado".
  // Determinista, mismas funciones puras que /profile usaba.
  const principles = useMemo(() => {
    const rules = buildRules(profile);
    const patterns = buildPatterns(profile);
    return buildPrinciples(rules, patterns, profile.archetypeInfo);
  }, [profile]);

  return (
    <main className="min-h-screen bg-background">
      {/* Salida arriba — visible sin esperar la IA ni scrollear hasta el pie */}
      <div className="flex items-center justify-between mx-auto max-w-[760px] px-6 sm:px-8 pt-8">
        <Link href="/profile" className="text-xs font-mono text-muted hover:text-accent transition-colors">
          ← Tu mapa
        </Link>
      </div>

      {/* Cresta — el molino, quieto, coronando la lectura */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.6, ease: "easeOut" }}
        className="flex justify-center pt-8 pb-8"
      >
        <Logo className="h-10 w-10 text-accent" />
      </motion.div>

      <div className="mx-auto max-w-[760px] px-6 sm:px-8 pb-32">
        {/* La IA es un enriquecimiento encima del contenido determinista de
            abajo, no un gate para verlo — mientras carga o si falla, el
            zodíaco/número de la suerte/afinidades siguen disponibles. */}
        {!revealed ? (
          <div className="py-16">
            <BuildingMolino done={fetchDone} onComplete={() => setRevealed(true)} />
          </div>
        ) : !interpretation ? (
          <p className="text-center text-muted text-sm py-16">
            No pudimos generar tu lectura esta vez. El resto de tu lectura sigue disponible abajo.
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
          </>
        )}

        {/* Companion — contenido determinista, calculado localmente sin IA.
            Renderiza siempre, sin esperar fetchLectura ni depender de que
            haya salido bien: primero las 4 lecturas nuevas del zodíaco
            chino, después el número de la suerte, después las afinidades.
            Una sola franja visual (border-t-2) marca dónde termina la
            lectura narrativa (si la hubo) y empieza el material de
            referencia. */}
        {(principles.length > 0 || zodiacExtras || catalog.length > 0) && (
              <div className="border-t-2 border-ink/15 pt-10 mt-4 space-y-14 sm:space-y-16">
                {principles.length > 0 && (
                  <motion.section
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.5 }}
                  >
                    <p className="font-heading text-lg sm:text-xl text-foreground mb-6">Tus principios</p>
                    <div className="max-w-2xl space-y-8">
                      {principles.map((p, i) => (
                        <div key={p.title} className="flex items-start gap-5">
                          <span className="font-mono text-xs text-muted leading-[1.7] shrink-0 w-5">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <div>
                            <p className="font-heading text-base sm:text-lg text-foreground leading-snug">
                              {p.title}
                            </p>
                            <p className="text-sm text-muted leading-relaxed mt-1.5">{p.body}</p>
                            {p.source && (
                              <p className="mt-2 font-mono text-xs text-accent">{p.source}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                )}

                {zodiacExtras && (
                  <motion.section
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.55 }}
                  >
                    <p className="font-heading text-lg sm:text-xl text-foreground mb-2">
                      Tu ciclo, en detalle
                    </p>
                    <p className="text-xs text-muted mb-6">
                      Cuatro lecturas más de tu signo del zodíaco chino, {zodiacExtras.sign}.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-ink/10">
                      <div className="bg-paper p-6 sm:p-7">
                        <h3 className="font-heading text-sm text-foreground mb-2">Alimento</h3>
                        {zodiacExtras.food.restriction === "EVITAR" ? (
                          <p className="text-sm text-muted leading-relaxed">
                            Alimento a moderar: <strong className="text-foreground">{zodiacExtras.food.alimento}</strong>. {zodiacExtras.food.razon}
                          </p>
                        ) : (
                          <p className="text-sm text-muted leading-relaxed">Sin restricción alimentaria específica según esta tradición.</p>
                        )}
                      </div>
                      <div className="bg-paper-alt p-6 sm:p-7">
                        <h3 className="font-heading text-sm text-foreground mb-2">Mascota</h3>
                        <p className="text-sm text-muted leading-relaxed">
                          Energía en tensión: <strong className="text-foreground">{zodiacExtras.pet.petToAvoid}</strong>. {zodiacExtras.pet.razon}
                        </p>
                      </div>
                      <div className="bg-paper p-6 sm:p-7">
                        <h3 className="font-heading text-sm text-foreground mb-2">Timing anual</h3>
                        <p className="text-sm text-muted leading-relaxed">
                          {zodiacExtras.timing.consejo}{" "}
                          {zodiacExtras.timing.isOwnYear ? (
                            <>
                              Estás transitando tu año propio ({zodiacExtras.timing.currentYear}). El siguiente será en{" "}
                              <strong className="text-foreground">{zodiacExtras.timing.nextOwnYear}</strong>.
                            </>
                          ) : (
                            <>
                              Tu próximo año propio:{" "}
                              <strong className="text-foreground">{zodiacExtras.timing.nextOwnYear}</strong>.
                            </>
                          )}
                        </p>
                      </div>
                      <div className="bg-paper-alt p-6 sm:p-7">
                        <h3 className="font-heading text-sm text-foreground mb-2">Color de tu elemento</h3>
                        <p className="text-sm text-muted leading-relaxed flex items-start gap-2">
                          <span
                            className="mt-1 w-3 h-3 rounded-full shrink-0 border border-ink/10"
                            style={{ backgroundColor: zodiacExtras.elementColor.colorHex }}
                            aria-hidden="true"
                          />
                          <span>
                            <strong className="text-foreground">{zodiacExtras.elementColor.color}</strong> — {zodiacExtras.elementColor.descripcion}
                          </span>
                        </p>
                      </div>
                    </div>
                  </motion.section>
                )}

                {luckyNumberInputs && (
                  <motion.section
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.6 }}
                  >
                    <p className="font-heading text-lg sm:text-xl text-foreground mb-2">Tu número de la suerte</p>
                    <p
                      className="font-display italic text-4xl sm:text-5xl mt-2 mb-3"
                      style={{ color: elementColor }}
                    >
                      {profile.luckyNumber}
                    </p>
                    <p className="text-sm text-muted leading-relaxed max-w-xl">
                      Sale de combinar la primera cifra de tu mes de nacimiento con la última cifra distinta de
                      cero de tu año. Es un número de referencia personal, no una predicción.
                    </p>
                    <CalculationProof
                      label="Número de la suerte"
                      data={buildLuckyNumberProof(luckyNumberInputs.month, luckyNumberInputs.year)}
                      className="mt-4"
                    />
                  </motion.section>
                )}

                {/* 05 — Tu relación con el mundo: catálogo completo categorizado por relación */}
                <LecturaAfinidadesFull userAnimal={userAnimal} catalog={catalog} />
              </div>
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
