"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { ARCHETYPES } from "@/lib/data";
import { safeNumber } from "@/lib/utils/score";
import { buildIdentityProfile } from "@/lib/engines/perspectivesEngine";
import { buildPersonalCode } from "@/lib/engines/synthesisEngine";
import { fetchSynthesis, type SynthesisResult } from "@/lib/api/client";
import { useCachedFetch } from "@/lib/hooks/useCachedFetch";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { getFamousByAnimal } from "@/lib/data/famousPeople";
import { calculateLuckyNumber } from "@/lib/calculations";
import { buildLifePathProof, buildLuckyNumberProof } from "@/lib/calculations/proof";
import EditorialSection from "@/components/ui/EditorialSection";
import ZodiacMark from "@/components/ui/ZodiacMark";
import ConvergentSection from "@/components/profile/ConvergentSection";
import IdentityCard from "@/components/profile/IdentityCard";
import PersonalScoreCard from "@/components/profile/PersonalScoreCard";
import KnowledgeConnections from "@/components/academy/KnowledgeConnections";
import ShareableImageCard from "@/components/profile/ShareableImageCard";
import CalculationProof from "@/components/shared/CalculationProof";
import type { ProfileTab } from "@/components/profile/ProfileTabs";

const PERSONAL_CODE_CACHE = new Map<string, SynthesisResult["personalCode"]>();

interface IdentityScreenProps {
  profile: UserProfile;
  onNavigate?: (tab: ProfileTab) => void;
}

export default function IdentityScreen({ profile }: IdentityScreenProps) {
  const lifePath = safeNumber(profile.lifePath, 1);
  const name = typeof profile.name === "string" ? profile.name : "";
  const birthDate = typeof profile.birthDate === "string" ? profile.birthDate : "";
  const sunSign = typeof profile.sunSign === "string" ? profile.sunSign : "";
  const chineseZodiac = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";
  const chineseElement = typeof profile.chineseZodiacInfo?.element === "string" ? profile.chineseZodiacInfo.element : "";
  const archetype = ARCHETYPES[lifePath];

  const cacheKey = `${profile.birthDate || ""}:${profile.name || ""}`;
  const { data: apiPersonalCode, error: personalCodeError, retry: retryPersonalCode } = useCachedFetch(
    PERSONAL_CODE_CACHE,
    cacheKey,
    () => fetchSynthesis(profile.birthDate || "", profile.name || "").then((data) => data.personalCode)
  );

  // Fallback local inmediato: el mapa siempre se renderiza, aunque la
  // síntesis remota no esté disponible. buildPersonalCode es un engine
  // puro que usa las mismas tablas de significado.
  const personalCode = apiPersonalCode ?? buildPersonalCode(profile);

  const identityProfile = useMemo(() => buildIdentityProfile(profile), [profile]);

  const birthParts = useMemo(() => {
    const parts = (birthDate || "").split("-");
    if (parts.length !== 3) return null;
    const day = parseInt(parts[2], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[0], 10);
    if (!day || !month || !year) return null;
    return { day, month, year };
  }, [birthDate]);

  const lifePathProof = useMemo(
    () => (birthParts ? buildLifePathProof(birthParts.day, birthParts.month, birthParts.year) : null),
    [birthParts]
  );
  const luckyNumber = useMemo(
    () => (birthParts ? calculateLuckyNumber(birthParts.month, birthParts.year) : profile.luckyNumber ?? 0),
    [birthParts, profile.luckyNumber]
  );
  const luckyProof = useMemo(
    () => (birthParts ? buildLuckyNumberProof(birthParts.month, birthParts.year) : null),
    [birthParts]
  );

  const zodiacDisplay = getZodiacDisplay(chineseZodiac);
  const userYear = parseInt(birthDate?.split("-")[0] || "0", 10);

  // Famous people sharing the user's energy
  const famousByAnimal = useMemo(() => getFamousByAnimal(chineseZodiac, userYear), [chineseZodiac, userYear]);
  const matchingFamous = useMemo(() => {
    const both = famousByAnimal.filter(p => p.westernSign === sunSign);
    if (both.length > 0) return both[0];
    if (famousByAnimal.length > 0) return famousByAnimal[0];
    return null;
  }, [famousByAnimal, sunSign]);

  // Format date: "1990-03-15" → "15 de marzo de 1990"
  const MONTH_NAMES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const formattedDate = (() => {
    if (!birthDate) return "";
    const parts = birthDate.split("-");
    if (parts.length !== 3) return birthDate;
    const day = parseInt(parts[2], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[0], 10);
    if (!day || !month || !year) return birthDate;
    return `${day} de ${MONTH_NAMES[month - 1]} de ${year}`;
  })();

  const synthesisLine = archetype
    ? `Tu Camino de Vida ${lifePath} te marca como ${archetype.name.toLowerCase()} (${archetype.keywords.slice(0, 3).join(", ").toLowerCase()}).`
    : `Tu Camino de Vida ${lifePath} define el eje de tu recorrido.`;

  // Aviso sutil solo si la síntesis remota falló: la pantalla ya está
  // renderizada con el engine local, no hay pantalla en blanco.
  const remoteWarning = personalCodeError && !apiPersonalCode ? (
    <div role="status" className="flex items-center gap-2 mt-4">
      <p className="text-xs text-muted">Mostrando tu código calculado localmente.</p>
      <button
        type="button"
        onClick={retryPersonalCode}
        className="text-xs text-accent hover:underline"
      >
        Reintentar síntesis completa
      </button>
    </div>
  ) : null;

  // TU CÓDIGO — "Expresión"/"Alma" solo existen si hay nombre (se calculan
  // letra por letra); "Personalidad" siempre existe porque sale del día de
  // nacimiento. El onboarding actual no pide nombre, así que Expresión/Alma
  // no aplican para casi nadie — se ocultan en vez de mostrar un "—" que
  // aparenta un dato roto (ver KnowledgeConnections más abajo).
  const allCodeRows: { label: string; number: number | null; name: string; meaning?: string }[] = [
    { label: "Expresión", number: profile.expressionNumber ?? null, name: personalCode?.expression?.name || "" },
    { label: "Alma", number: profile.soulNumber ?? null, name: personalCode?.soul?.name || "" },
    { label: "Personalidad", number: profile.personalityNumber ?? null, name: personalCode?.personality?.name || "", meaning: personalCode?.personality?.meaning },
  ];
  const codeRows = allCodeRows.filter(row => row.number);
  const hiddenNameDerivedRows = !profile.name && allCodeRows.some(row => !row.number && row.label !== "Personalidad");

  return (
    <div
      id="panel-identity"
      role="tabpanel"
      aria-labelledby="tab-identity"
      className="bg-background"
    >
      {/* ═══════════════════════════════════════════════
          1 · APERTURA — el comienzo de la lectura
          ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-ink/10">
        <div className="relative mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-16 sm:pb-24">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="label-micro text-accent font-semibold mb-8"
          >
            Mi identidad
          </motion.p>

          {name && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="font-heading text-sm sm:text-base uppercase tracking-[0.3em] text-muted mb-3"
            >
              {name}
            </motion.p>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="font-display text-[clamp(2.5rem,8vw,6.5rem)] leading-[0.9] tracking-tight text-foreground uppercase"
          >
            {formattedDate}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-3 mt-6"
          >
            <ZodiacMark animal={chineseZodiac} color="var(--color-accent)" size="sm" showLabel={false} />
            <p className="label-micro text-muted">
              {zodiacDisplay.name.toUpperCase()} · {chineseElement.toUpperCase()} · CAMINO {lifePath}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 sm:gap-12"
          >
            <span
              className="font-display text-[clamp(7rem,24vw,15rem)] leading-none tracking-tight text-accent"
              aria-hidden="true"
            >
              {lifePath}
            </span>
            <div className="sm:text-right">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted mb-3">Tu arquetipo</p>
              <p className="font-display text-3xl sm:text-5xl uppercase text-foreground tracking-tight">
                # {archetype?.name}
              </p>
            </div>
          </motion.div>

          {archetype?.quote && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-12 text-lg sm:text-xl italic text-foreground leading-relaxed max-w-2xl"
            >
              &ldquo;{archetype.quote}&rdquo;
            </motion.p>
          )}

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-6 text-sm text-muted leading-relaxed max-w-xl"
          >
            {synthesisLine}
          </motion.p>

            {matchingFamous && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-14 font-mono text-xs uppercase tracking-[0.2em] text-muted"
              >
                Compartís energía con {matchingFamous.name} — {matchingFamous.field} · {matchingFamous.country}
              </motion.p>
            )}

            {remoteWarning}
          </div>
        </section>

      {/* ═══════════════════════════════════════════════
          2 · TU CÓDIGO — el número protagonista
          ═══════════════════════════════════════════════ */}
      <EditorialSection
        eyebrow="TU CÓDIGO PERSONAL"
        title={<>LOS NÚMEROS<br />QUE TE DEFINEN.</>}
      >
        <div className="pt-4">
          {/* Camino de Vida — protagonista */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="flex items-start gap-6 sm:gap-10 pb-10 border-b border-ink/10"
          >
            <span className="font-display text-[clamp(4rem,14vw,7rem)] leading-none tracking-tight text-accent shrink-0">
              {personalCode.lifePath.number}
            </span>
            <div className="pt-2">
              <p className="label-micro text-muted mb-2">Camino de Vida</p>
              <p className="font-heading text-xl sm:text-2xl font-semibold text-foreground mb-2">
                {personalCode.lifePath.name}
              </p>
              <p className="text-sm text-muted leading-relaxed max-w-lg">{personalCode.lifePath.meaning}</p>
              {lifePathProof && (
                <CalculationProof label="Camino de Vida" data={lifePathProof} className="mt-6" />
              )}
            </div>
          </motion.div>

          {/* Número de la Suerte — derivado de la fecha, no del nombre */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
            className="border-b border-ink/10"
          >
            <div className="flex items-baseline justify-between gap-4 py-5">
              <span className="text-xs uppercase tracking-[0.2em] text-muted font-medium">
                Número de la Suerte
              </span>
              <div className="flex items-baseline gap-3">
                {luckyNumber ? (
                  <>
                    <span className="font-display text-2xl text-foreground">{luckyNumber}</span>
                    <span className="text-xs text-muted">de tu fecha</span>
                  </>
                ) : (
                  <span className="text-lg text-muted">—</span>
                )}
              </div>
            </div>
            {luckyProof && (
              <CalculationProof label="Número de la Suerte" data={luckyProof} className="pb-6" />
            )}
          </motion.div>

          {/* Expresión · Alma · Personalidad — solo filas con dato real */}
          {codeRows.map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: 0.05 * (i + 1), duration: 0.4 }}
              className="py-5 border-b border-ink/10 last:border-b-0"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.2em] text-muted font-medium">{row.label}</span>
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-2xl text-foreground">{row.number}</span>
                  <span className="text-xs text-muted">{row.name}</span>
                </div>
              </div>
              {row.meaning && (
                <p className="text-xs text-muted mt-2">{row.meaning}</p>
              )}
            </motion.div>
          ))}
          {hiddenNameDerivedRows && (
            <p className="text-xs text-muted pt-4">
              Expresión y Alma se calculan a partir de las letras de tu nombre — como Molino no lo pidió al empezar, no aparecen acá.
            </p>
          )}
        </div>
      </EditorialSection>

      {/* ═══════════════════════════════════════════════
          3 · LAS TRES LECTURAS — capítulos de la lectura
          ═══════════════════════════════════════════════ */}
      <EditorialSection
        tone="ink"
        eyebrow="CADA SISTEMA, SU VOZ"
        title={<>LO QUE DICE<br />CADA UNO.</>}
        texture="circle"
      >
        <div className="pt-2">
          {identityProfile.perspectives.map((persp, i) => (
            <motion.div
              key={persp.system}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="py-10 lg:py-12 border-b border-paper/15 last:border-b-0"
            >
              <div className="flex items-center gap-4 mb-5">
                <span className="font-mono text-xs text-paper/60">{String(i + 1).padStart(2, "0")}</span>
                <span className="w-8 h-px shrink-0" style={{ backgroundColor: persp.color }} aria-hidden="true" />
                <span className="font-mono text-xs uppercase tracking-[0.25em] font-semibold text-paper/85">
                  {persp.systemLabel}
                </span>
              </div>
              <p className="font-heading text-xl sm:text-2xl font-semibold text-paper mb-3">{persp.headline}</p>
              <p className="text-sm text-paper/70 leading-relaxed max-w-2xl">{persp.detail}</p>
            </motion.div>
          ))}
        </div>
      </EditorialSection>

      {/* ═══════════════════════════════════════════════
          4 · CONVERGENCIA
          ═══════════════════════════════════════════════ */}
      <ConvergentSection profile={profile} />

      {/* ═══════════════════════════════════════════════
          5 · FORTALEZAS / ÁREAS A CUIDAR
          ═══════════════════════════════════════════════ */}
      <IdentityCard profile={profile} />

      {/* ═══════════════════════════════════════════════
          6 · EVIDENCIA SIMBÓLICA
          ═══════════════════════════════════════════════ */}
      <PersonalScoreCard profile={profile} />

      {/* ═══════════════════════════════════════════════
          7 · FUENTES DEL CONOCIMIENTO
          ═══════════════════════════════════════════════ */}
      <KnowledgeConnections profile={profile} />

      {/* ═══════════════════════════════════════════════
          8 · COMPARTIR — cierre de la lectura
          ═══════════════════════════════════════════════ */}
      <EditorialSection tone="paperAlt" eyebrow="COMPARTIR" title="ESTO MERECE SER COMPARTIDO.">
        <div className="pt-10">
          <ShareableImageCard profile={profile} currentTab="identity" />
        </div>
      </EditorialSection>
    </div>
  );
}
