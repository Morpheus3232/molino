"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { fadeUp, fadeUpDelayed, staggerContainer, staggerItem, useReducedMotion } from "@/lib/utils/motion";
import { useProfile } from "@/lib/hooks/useProfile";
import { calculateAffinity, calculateAllAffinity, TIER_META, type AffinityResult } from "@/lib/engines/affinityEngine";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import { buildEntityConnectionStory, getRelationColor, getRelationIcon } from "@/lib/engines/entityStoryEngine";
import type { EntityType, HistoricalEvent } from "@/lib/data/symbolic-entities";
import type { SymbolicEntity } from "@/lib/data/symbolic-entities";
import { SYMBOLIC_ENTITIES, ENTITY_TYPES } from "@/lib/data/symbolic-entities";
import UniversityFooter from "@/components/layout/UniversityFooter";
import LoadingState from "@/components/ui/LoadingState";
import ReadingNumber from "@/components/ui/ReadingNumber";
import AffinityShareableCard from "@/components/profile/AffinityShareableCard";
import AnimalQuickSelector from "@/components/affinity/AnimalQuickSelector";
import { formatAnimalSimple } from "@/lib/utils/zodiacDisplay";
import { analytics } from "@/lib/analytics/analytics";
import { saveAffinityResult, hasSavedAffinity } from "@/lib/session/localStorage";

const AFFINITY_DATE_KEY = "molino.affinity-date.v1";
const MONTHS = ["01","02","03","04","05","06","07","08","09","10","11","12"];
const MONTH_LABELS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

interface AffinityDetailContentProps {
  entity: SymbolicEntity;
  meta: { label: string; plural: string; icon: string; description: string };
  type: EntityType;
}

export default function AffinityDetailContent({ entity, meta, type }: AffinityDetailContentProps) {
  const router = useRouter();
  const { profile, mounted } = useProfile({ redirectIfNotFound: false });
  const [showOtherEvents, setShowOtherEvents] = useState(false);

  const result = useMemo(() => {
    if (!profile) return null;
    return calculateAffinity(profile, entity);
  }, [profile, entity]);

  // Discovery loop — top 3 related entities across all types (excluding current)
  const relatedEntities = useMemo(() => {
    if (!profile || !result) return [];
    return calculateAllAffinity(profile, SYMBOLIC_ENTITIES)
      .filter(r => r.entity.id !== entity.id)
      .slice(0, 3);
  }, [profile, entity, result]);

  if (!mounted) return <LoadingState message="Cargando..." />;

  if (!profile) {
    return (
      <QuickAffinity entity={entity} meta={meta} type={type} />
    );
  }

  const tierMeta = result ? TIER_META[result.tier] : null;
  const primaryEvent = result?.primaryEvent;
  const otherEvents = result?.otherEvents ?? [];

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[800px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">

        {/* Back */}
        <motion.div {...fadeUp}>
          <button
            type="button"
            onClick={() => router.push(`/affinity/${type}`)}
            className="text-sm text-muted hover:text-accent transition-colors mb-8 inline-flex items-center gap-2 min-h-[44px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
          >
            &larr; {meta.plural}
          </button>
        </motion.div>

        {/* Hero — premium reveal */}
        {result && tierMeta && (
          <PremiumHero result={result} entity={entity} meta={meta} type={type} />
        )}

        {/* Quick selector — same type entities */}
        {result && profile && (
          <AnimalQuickSelector profile={profile} currentEntity={entity} type={type} />
        )}

        {/* Share CTA — right after hero, before details */}
        {result && (
          <ShareInlineCTA result={result} entity={entity} />
        )}

        {/* Base del cálculo simbólico */}
        {result && primaryEvent && (
          <motion.section {...fadeUp} className="mb-12" role="region" aria-labelledby="section-calculo">
            <CollapsibleSection title="Base del cálculo simbólico" id="section-calculo">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Tu año */}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Tu año</p>
                  <p className="font-heading text-3xl font-bold text-foreground">{result.userYear}</p>
                  <p className="text-sm text-muted mt-1">{formatAnimalSimple(result.userAnimal)}</p>
                </div>
                {/* Evento de la entidad */}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">
                    {primaryEvent.label}
                  </p>
                  <p className="font-heading text-3xl font-bold text-foreground">{result.entityYear}</p>
                  <p className="text-sm text-muted mt-1">{formatAnimalSimple(result.entityAnimal)}</p>
                </div>
              </div>

              {/* Event detail line */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span>{entity.name}</span>
                  <span aria-hidden="true">·</span>
                  <span>{primaryEvent.label}</span>
                  <span aria-hidden="true">·</span>
                  <span>{primaryEvent.date ? formatDisplayDate(primaryEvent.date) : `circa ${primaryEvent.year}`}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-foreground">{formatAnimalSimple(result.entityAnimal)}</span>
                </div>
              </div>

              {/* Precision indicator */}
              <div className="mt-4">
                {primaryEvent.date ? (
                  <p className="text-xs text-muted flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-success shrink-0" />
                    Calculado con fecha exacta
                  </p>
                ) : (
                  <p className="text-xs text-muted flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-warning shrink-0" />
                    Calculado desde el año disponible
                  </p>
                )}
              </div>
            </CollapsibleSection>
          </motion.section>
        )}

        {/* Relationship */}
        {result && (
          <motion.section {...fadeUp} className="mb-12" role="region" aria-labelledby="section-relacion">
            <CollapsibleSection title="Relación entre ambos animales" id="section-relacion">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{entity.emoji}</span>
                <p className="text-sm font-medium text-foreground">
                  {formatAnimalSimple(result.userAnimal)} ↔ {formatAnimalSimple(result.entityAnimal)}
                </p>
                <span
                  className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-sm"
                  style={{ color: tierMeta?.color, backgroundColor: `${tierMeta?.color}15` }}
                >
                  {result.relationship}
                </span>
              </div>
              <div className="h-px bg-border my-4" />
              <p className="text-sm text-foreground leading-relaxed mb-3">{result.explanation}</p>
              {result.tradition && (
                <p className="text-xs text-muted italic">{result.tradition}</p>
              )}
            </CollapsibleSection>
          </motion.section>
        )}

        {/* Why this affinity */}
        {result && (
          <motion.section {...fadeUp} className="mb-12" role="region" aria-labelledby="section-por-que">
            <CollapsibleSection title="¿Por qué esta afinidad?" id="section-por-que">
              <p className="text-sm text-foreground leading-relaxed mb-4">{result.summary}</p>
              <p className="text-xs text-muted leading-relaxed italic">{result.methodNote}</p>
            </CollapsibleSection>
          </motion.section>
        )}

        {/* Link to multi-factor analysis — after deep content */}
        <motion.section {...fadeUp} className="mb-12">
          <div className="p-6 rounded-md border border-accent/20 bg-accent/[0.03]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-2">Análisis multi-factor</p>
            <p className="text-sm text-muted leading-relaxed mb-3">
              Este resultado usa solo el zodíaco chino. Si querés ver numerología, astrología y arquetipos, explorá el análisis avanzado.
            </p>
            <button
              type="button"
              onClick={() => router.push(`/compatibility/${entity.id}`)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
            >
              Explorar análisis avanzado
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </motion.section>

        {/* Other historical events — collapsible */}
        {otherEvents.length > 0 && (
          <motion.section {...fadeUp} className="mb-12">
            <SectionHeader title="Otros eventos históricos" />
            <div className="rounded-md border border-border bg-card shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => setShowOtherEvents(!showOtherEvents)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/30 transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-t-2xl"
                aria-expanded={showOtherEvents}
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {otherEvents.length} {otherEvents.length === 1 ? "evento" : "eventos"} histórico{otherEvents.length === 1 ? "" : "s"} adicional{otherEvents.length === 1 ? "" : "es"}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {otherEvents.map(e => `${e.label} (${e.year})`).join(", ")}
                  </p>
                </div>
                <svg
                  className={`w-4 h-4 text-muted transition-transform duration-200 shrink-0 ml-4 ${showOtherEvents ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {showOtherEvents && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 space-y-3">
                      {otherEvents.map(event => (
                        <OtherEventCard key={event.id} event={event} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        )}

        {/* Documented data */}
        <motion.section {...fadeUp} className="mb-12">
          <CollapsibleSection title="Datos documentados">
            <div className="space-y-3">
              <DataRow label="Nombre" value={entity.name} />
              <DataRow label="Tipo" value={meta.label} />
              <DataRow label="País de origen" value={entity.country} />
              {primaryEvent && (
                <>
                  <DataRow label="Evento principal" value={primaryEvent.label} />
                  {primaryEvent.date && (
                    <DataRow label="Fecha" value={formatDisplayDate(primaryEvent.date)} />
                  )}
                  {!primaryEvent.date && (
                    <DataRow label="Año" value={String(primaryEvent.year)} />
                  )}
                  <DataRow label="Fuente" value={primaryEvent.source} />
                </>
              )}
              <DataRow label="Temas clave" value={entity.keyThemes.join(", ")} />
              {entity.sourceNote && (
                <DataRow label="Nota" value={entity.sourceNote} />
              )}
            </div>
          </CollapsibleSection>
        </motion.section>

        {/* Disclaimer */}
        <motion.section {...fadeUp} className="mb-12">
          <div className="p-6 rounded-md border border-border bg-card shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Aviso importante</p>
            <p className="text-xs text-muted leading-relaxed">
              La afinidad es una lectura simbólica basada en tradiciones del zodíaco chino, no una medición científica.
              Molino es una plataforma educativa y de entretenimiento. Cada persona puede interpretar estos sistemas de forma diferente.
            </p>
          </div>
        </motion.section>

        {/* Shareable card */}
        {result && (
          <motion.section {...fadeUp} className="mb-12">
            <SectionHeader title="Compartir" />
            <AffinityShareableCard result={result} />
          </motion.section>
        )}

        {/* "Sos X como Y" narrative */}
        {result && profile && (() => {
          const story = buildEntityConnectionStory(profile, entity);
          if (!story) return null;
          const relationColor = getRelationColor(story.relationType);
          const relationIcon = getRelationIcon(story.relationType);
          return (
            <motion.section {...fadeUp} className="mb-12">
              <SectionHeader title="Tu conexión" />
              <div className="p-6 rounded-md border border-border bg-card shadow-sm">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-3xl shrink-0">{entity.emoji}</span>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-1">
                      {story.headline}
                    </h3>
                    <p className="text-sm text-muted">{story.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">{relationIcon}</span>
                  <span
                    className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-sm"
                    style={{ color: relationColor, backgroundColor: `${relationColor}15` }}
                  >
                    {story.relationLabel} · {story.relationScore}/100
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{story.explanation}</p>
              </div>
            </motion.section>
          );
        })()}

        {/* Discovery loop — related entities across all types */}
        {relatedEntities.length > 0 && (
          <motion.section {...fadeUp} className="mb-12">
            <SectionHeader title="Descubrí algo más" />
            <div className="space-y-3">
              {relatedEntities.map((rel, idx) => {
                const relTier = TIER_META[rel.tier];
                const typeMeta = ENTITY_TYPES[rel.entity.type];
                return (
                  <Link
                    key={rel.entity.id}
                    href={`/affinity/${rel.entity.type}/${rel.entity.id}`}
                    onClick={() => analytics.trackAffinityRecommendationClicked(type, entity.id, rel.entity.id, idx)}
                    className="block w-full text-left p-4 rounded-md border border-border bg-card shadow-sm hover:border-accent/40 transition-colors group focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl shrink-0">{rel.entity.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors truncate">
                          {rel.entity.name}
                        </p>
                        <p className="text-xs text-muted">
                          {typeMeta?.label ?? rel.entity.type}
                          <span aria-hidden="true"> · </span>
                          {rel.relationship}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-sm"
                          style={{ color: relTier.color, backgroundColor: `${relTier.color}12` }}
                        >
                          {rel.score}
                        </span>
                        <span className="text-xs text-accent group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* CTAs */}
        <motion.section {...fadeUp}>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => router.push("/conocimiento/zodiaco-chino")}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all px-6 py-3 text-sm border border-accent/30 bg-accent/[0.03] text-accent hover:bg-accent/10 min-h-[44px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 sm:border-accent/30 sm:bg-accent/[0.03]"
            >
              Conocé el zodíaco chino →
            </button>
            <button
              type="button"
              onClick={() => router.push(`/affinity/${type}`)}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all px-6 py-3 text-xs sm:text-sm border border-border bg-transparent text-muted hover:border-accent hover:text-foreground min-h-[44px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Ver todas las {meta.plural.toLowerCase()}
            </button>
          </div>
        </motion.section>
      </main>
      <UniversityFooter />
    </div>
  );
}

// ════════════════════════════════════════════════════
// SUB-COMPONENTS
// ════════════════════════════════════════════════════

function PremiumHero({
  result,
  entity,
  meta,
  type,
}: {
  result: AffinityResult;
  entity: SymbolicEntity;
  meta: { label: string; plural: string; icon: string; description: string };
  type: EntityType;
}) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const tierMeta = TIER_META[result.tier];
  const explanation = buildContextualExplanation(result);

  // Stagger delays (seconds)
  const d = {
    animals: reducedMotion ? 0 : 0,
    gauge: reducedMotion ? 0 : 0.15,
    tier: reducedMotion ? 0 : 0.35,
    explanation: reducedMotion ? 0 : 0.5,
    ctas: reducedMotion ? 0 : 0.65,
  };

  return (
    <motion.section
      className="mb-12"
      variants={staggerContainer}
      initial="initial"
      whileInView="whileInView"
      viewport={{ once: true, margin: "-40px" }}
    >
      {/* Label */}
      <motion.div variants={staggerItem}>
        <p className="text-[10px] uppercase tracking-[0.35em] text-accent font-medium mb-6 text-center">
          Afinidad Personal · {meta.label}
        </p>
      </motion.div>

      {/* Animals facing each other — approach animation for high scores */}
      <motion.div
        variants={staggerItem}
        className="flex items-end justify-center gap-6 sm:gap-10 mb-8"
      >
        {/* Entity — moves right for high scores */}
        <motion.div
          className="text-center"
          animate={reducedMotion ? {} : { x: result.score >= 75 ? 12 : 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        >
          <span className="text-5xl sm:text-6xl block mb-2" role="img" aria-label={entity.name}>
            {entity.emoji}
          </span>
          <p className="font-heading text-lg sm:text-xl font-semibold text-foreground leading-tight">
            {entity.name}
          </p>
          <p className="text-xs text-muted mt-0.5">{formatAnimalSimple(result.entityAnimal)}</p>
        </motion.div>

        {/* VS divider — fades for high scores */}
        <motion.div
          className="flex flex-col items-center pb-6"
          animate={reducedMotion ? {} : { opacity: result.score >= 75 ? 0.3 : 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium">vs</span>
        </motion.div>

        {/* User — moves left for high scores */}
        <motion.div
          className="text-center"
          animate={reducedMotion ? {} : { x: result.score >= 75 ? -12 : 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        >
          <span className="text-5xl sm:text-6xl block mb-2" role="img" aria-label="Vos">
            🪞
          </span>
          <p className="font-heading text-lg sm:text-xl font-semibold text-foreground leading-tight">
            Vos
          </p>
          <p className="text-xs text-muted mt-0.5">{formatAnimalSimple(result.userAnimal)}</p>
        </motion.div>
      </motion.div>

      {/* Score — número editorial, sin gauge ni badge */}
      <motion.div variants={staggerItem} className="flex justify-center mb-6 text-center">
        <ReadingNumber
          value={result.score}
          label={`Afinidad · ${meta.label}`}
          color={tierMeta.color}
          context={tierMeta.label}
          size="xl"
        />
      </motion.div>

      {/* Contextual explanation */}
      <motion.div variants={staggerItem} className="text-center mb-8 px-4">
        <p className="text-sm text-foreground leading-relaxed max-w-md mx-auto">
          {explanation}
        </p>
      </motion.div>

      {/* CTAs — primary Share + secondary Explore */}
      <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          type="button"
          onClick={() => router.push(`/affinity/compare?from=${entity.id}`)}
          className="inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all px-6 py-3 text-sm border border-border bg-card text-foreground hover:border-accent min-h-[44px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          Explorar otra entidad
          <span aria-hidden="true">→</span>
        </button>
      </motion.div>
    </motion.section>
  );
}

function buildContextualExplanation(result: AffinityResult): string {
  const { entity, userAnimal, entityAnimal, relationship, score } = result;
  const eName = entity.name;

  if (entityAnimal === userAnimal) {
    return `${userAnimal} y ${entityAnimal} son el mismo signo — una conexión directa con ${eName}.`;
  }
  if (score >= 75) {
    return `${userAnimal} y ${entityAnimal} tienen una fuerte resonancia simbólica según la tradición del zodíaco chino.`;
  }
  if (score >= 60) {
    return `${userAnimal} y ${entityAnimal} comparten una conexión moderada que revela puntos de interés con ${eName}.`;
  }
  if (score >= 45) {
    return `${userAnimal} y ${entityAnimal} son diferentes pero se enriquecen mutuamente en el ciclo del zodíaco chino.`;
  }
  if (score >= 30) {
    return `La relación entre ${userAnimal} y ${entityAnimal} genera una tensión creativa según esta tradición.`;
  }
  return `${userAnimal} y ${entityAnimal} tienen una baja resonancia simbólica, pero no por eso menos interesante.`;
}

function ShareButton({
  result,
  entity,
  tierMeta,
}: {
  result: AffinityResult;
  entity: SymbolicEntity;
  tierMeta: { label: string; color: string; description: string };
}) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/affinity/${entity.type}/${entity.id}`;

  const shareText = useMemo(() => {
    const { entityAnimal, userAnimal, score } = result;
    const emoji = entity.emoji || "";
    return `${emoji} ${entity.name} y ${userAnimal}: ${score}/100 según el zodíaco chino. ¿Cuál es la tuya? Descubríla en Molino ✨`;
  }, [result, entity]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Afinidad simbólica con ${entity.name} — Molino`,
          text: shareText,
          url: shareUrl,
        });
        analytics.trackAffinityShared(entity.type, "share");
        toast.success("Afinidad compartida", {
          description: "Link copiado al portapapeles",
          duration: 3000,
        });
      } catch {
        // User cancelled — no toast needed
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        analytics.trackAffinityShared(entity.type, "clipboard");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("¡Afinidad copiada!", {
          description: "Compartí la afinidad con quien quieras",
          duration: 3000,
        });
      } catch {
        toast.error("No pudimos copiar. Intentá de nuevo.");
      }
    }
  }, [entity, shareText, shareUrl]);

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all px-6 py-3 text-sm min-h-[44px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      style={{ backgroundColor: tierMeta.color, color: "#fff" }}
      aria-label={`Compartí tu afinidad con ${entity.name}`}
    >
      {copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Enlace copiado
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Compartí tu afinidad
        </>
      )}
    </button>
  );
}

function ShareInlineCTA({ result, entity }: { result: AffinityResult; entity: SymbolicEntity }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/affinity/${entity.type}/${entity.id}`;

  const shareText = useMemo(() => {
    const { entityAnimal, userAnimal, score, relationship } = result;
    const emoji = entity.emoji || "";
    const tierLabel = TIER_META[result.tier].label;

    if (entityAnimal === userAnimal) {
      return `${emoji} ${entity.name} y yo somos el mismo signo: ${userAnimal}. Afinidad ${score}/100 — ${tierLabel}. ¿Cuál es la tuya? Descubrílo en Molino ✨`;
    }
    if (relationship === "tríada compatible") {
      return `${userAnimal} y ${entityAnimal} comparten una tríada según el zodíaco chino. ${emoji} ${entity.name}: ${score}/100 — ${tierLabel}. ¿Y vos? Descubrí tu afinidad en Molino ✨`;
    }
    if (relationship === "armonía natural") {
      return `${userAnimal} y ${entityAnimal} se complementan. ${emoji} ${entity.name}: ${score}/100 — ${tierLabel}. Descubrí tu afinidad simbólica en Molino ✨`;
    }
    if (relationship === "opuestos en el ciclo") {
      return `${userAnimal} y ${entityAnimal}: opuestos que se atraen. ${emoji} ${entity.name}: ${score}/100. Mirá qué significa tu conexión en Molino ✨`;
    }
    if (relationship === "requiere atención") {
      return `${userAnimal} y ${entityAnimal}: tensión creativa según la tradición. ${emoji} ${entity.name}: ${score}/100. Descubrí tu afinidad en Molino ✨`;
    }
    return `Mi afinidad simbólica con ${emoji} ${entity.name}: ${score}/100 — ${relationship}. ¿Cuál es la tuya? Descubrílo en Molino ✨`;
  }, [result, entity]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Afinidad simbólica con ${entity.name} — Molino`,
          text: shareText,
          url: shareUrl,
        });
        analytics.trackAffinityShared(entity.type, "share");
        toast.success("Afinidad compartida", {
          description: "Link copiado al portapapeles",
          duration: 3000,
        });
      } catch {
        // User cancelled — no toast needed
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        analytics.trackAffinityShared(entity.type, "clipboard");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("¡Afinidad copiada!", {
          description: "Compartí la afinidad con quien quieras",
          duration: 3000,
        });
      } catch {
        toast.error("No pudimos copiar. Intentá de nuevo.");
      }
    }
  }, [shareText, shareUrl, entity]);

  const tierMeta = TIER_META[result.tier];
  const isHighAffinity = result.score >= 75;

  return (
    <motion.section {...fadeUp} className="mb-12">
      <div
        className="p-6 rounded-md border-2 transition-colors"
        style={{
          borderColor: isHighAffinity ? `${tierMeta.color}30` : "var(--border)",
          backgroundColor: isHighAffinity ? `${tierMeta.color}05` : "var(--card)",
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground mb-1">
              {isHighAffinity
                ? `¡${entity.name} tiene una afinidad destacada con vos!`
                : `¿Te sorprendió esta conexión con ${entity.name}?`}
            </p>
            <p className="text-xs text-muted">
              Compartí tu afinidad simbólica y descubrí qué tienen los demás.
            </p>
          </div>
          <button
            type="button"
            onClick={handleShare}
            className="shrink-0 inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all px-6 py-2.5 text-sm min-h-[40px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            style={{
              backgroundColor: tierMeta.color,
              color: "#fff",
            }}
            aria-label={`Compartí tu afinidad con ${entity.name}`}
          >
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Enlace copiado
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                Compartí tu afinidad
              </>
            )}
          </button>
        </div>
      </div>
    </motion.section>
  );
}

function OtherEventCard({ event }: { event: HistoricalEvent }) {
  const { animal, isApproximate } = useMemo(() => {
    if (event.calculatedAnimal) {
      return { animal: event.calculatedAnimal, isApproximate: event.isApproximate ?? false };
    }
    return { animal: null, isApproximate: false };
  }, [event]);

  return (
    <div className="p-4 rounded-md bg-muted/30 border border-border/50">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{event.label}</span>
          <span className="text-xs text-muted">({event.year})</span>
        </div>
        {animal && (
          <span className="text-xs font-medium text-foreground">{animal}</span>
        )}
      </div>
      <p className="text-xs text-muted leading-relaxed">{event.description}</p>
      <div className="flex items-center gap-3 mt-2">
        <p className="text-[10px] text-muted">Fuente: {event.source}</p>
        {isApproximate && (
          <p className="text-[10px] text-muted">· Año aproximado</p>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ title, id }: { title: string; id?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-px bg-border" aria-hidden="true" />
      <h2 id={id} className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">{title}</h2>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-xs text-muted w-32 shrink-0">{label}</span>
      <span className="text-xs text-foreground">{value}</span>
    </div>
  );
}

function formatDisplayDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const monthIdx = parseInt(month, 10) - 1;
  return `${parseInt(day, 10)} de ${months[monthIdx]} de ${year}`;
}

/**
 * Collapsible section — always expanded on desktop (sm:), collapsed on mobile by default.
 * Tap to expand on mobile. Uses CSS transitions for smooth animation.
 */
function CollapsibleSection({
  title,
  id,
  children,
  defaultOpen = false,
}: {
  title: string;
  id?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-md border border-border bg-card shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/20 transition-colors sm:pointer-events-none sm:cursor-default focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-t-2xl"
        aria-expanded={open}
        aria-controls={id}
      >
        <SectionHeader title={title} id={id} />
        <svg
          className={`w-4 h-4 text-muted transition-transform duration-200 shrink-0 ml-4 sm:hidden ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`${open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"} sm:max-h-none sm:opacity-100 transition-all duration-300 ease-in-out overflow-hidden`}
      >
        <div className="px-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * QuickAffinity — P0 flow: user enters ONLY birth date, sees Affinity result immediately.
 * No onboarding, no name, no login. Date persisted in sessionStorage across entity pages.
 */
function QuickAffinity({
  entity,
  meta,
  type,
}: {
  entity: SymbolicEntity;
  meta: { label: string; plural: string; icon: string; description: string };
  type: EntityType;
}) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const currentYear = new Date().getFullYear();
  const [saved, setSaved] = useState(() => {
    if (typeof window === "undefined") return false;
    return hasSavedAffinity(entity.id);
  });

  // Date state — initialize from sessionStorage if available
  const [day, setDay] = useState(() => {
    if (typeof window === "undefined") return "";
    try {
      const saved = sessionStorage.getItem(AFFINITY_DATE_KEY);
      if (saved) {
        const parts = saved.split("-");
        return parts[2] || "";
      }
    } catch {}
    return "";
  });
  const [month, setMonth] = useState(() => {
    if (typeof window === "undefined") return "01";
    try {
      const saved = sessionStorage.getItem(AFFINITY_DATE_KEY);
      if (saved) {
        const parts = saved.split("-");
        return parts[1] || "01";
      }
    } catch {}
    return "01";
  });
  const [year, setYear] = useState(() => {
    if (typeof window === "undefined") return String(currentYear - 25);
    try {
      const saved = sessionStorage.getItem(AFFINITY_DATE_KEY);
      if (saved) {
        const parts = saved.split("-");
        return parts[0] || String(currentYear - 25);
      }
    } catch {}
    return String(currentYear - 25);
  });
  const [error, setError] = useState("");

  // Calculate result from saved or entered date
  const result = useMemo(() => {
    let birthDate = "";
    try {
      birthDate = sessionStorage.getItem(AFFINITY_DATE_KEY) || "";
    } catch {}
    if (!birthDate && day && month && year) {
      birthDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    if (!birthDate) return null;
    const profile = calculateUserProfile("", birthDate);
    return calculateAffinity(profile, entity);
  }, [day, month, year, entity]);

  // Recommendations — top 3 across all types (excluding current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const relatedEntities = useMemo(() => {
    if (!result) return [];
    let birthDate = "";
    try {
      birthDate = sessionStorage.getItem(AFFINITY_DATE_KEY) || "";
    } catch {}
    if (!birthDate && day && month && year) {
      birthDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    if (!birthDate) return [];
    const profile = calculateUserProfile("", birthDate);
    return calculateAllAffinity(profile, SYMBOLIC_ENTITIES)
      .filter(r => r.entity.id !== entity.id)
      .slice(0, 3);
  }, [day, month, year, entity, result]);

  const handleSubmit = useCallback(() => {
    setError("");
    const parsedDay = parseInt(day, 10);
    const parsedMonth = parseInt(month, 10);
    const parsedYear = parseInt(year, 10);
    if (!parsedDay || !parsedMonth || !parsedYear) {
      setError("Seleccioná día, mes y año");
      return;
    }
    const birthDate = `${parsedYear}-${String(parsedMonth).padStart(2, "0")}-${String(parsedDay).padStart(2, "0")}`;
    try {
      sessionStorage.setItem(AFFINITY_DATE_KEY, birthDate);
    } catch {}
    analytics.trackAffinityDateEntered(type);
    // Force re-render by updating state
    setDay(String(parsedDay));
    setMonth(String(parsedMonth).padStart(2, "0"));
    setYear(String(parsedYear));
  }, [day, month, year, type]);

  const handleSave = useCallback(() => {
    if (!result || saved) return;
    let birthDate = "";
    try { birthDate = sessionStorage.getItem(AFFINITY_DATE_KEY) || ""; } catch {}
    saveAffinityResult({
      entityId: entity.id,
      entityType: entity.type,
      entityName: entity.name,
      entityEmoji: entity.emoji || "",
      birthDate,
      userAnimal: result.userAnimal,
      entityAnimal: result.entityAnimal,
      score: result.score,
      tier: result.tier,
      relationship: result.relationship,
    });
    analytics.trackAffinitySaveClicked(type, entity.id, result.score, result.tier);
    setSaved(true);
    toast.success("Afinidad guardada ✓", {
      description: "Encontrala en tus conexiones personales",
      duration: 4000,
    });
  }, [result, saved, entity, type]);

  const tierMeta = result ? TIER_META[result.tier] : null;
  const yearOptions = Array.from({ length: 100 }, (_, i) => currentYear - i);

  // Has a result been calculated?
  const hasResult = result && result.score > 0 && result.userAnimal;

  // Track result viewed
  useEffect(() => {
    if (hasResult && result) {
      analytics.trackAffinityResultViewed(type, result.score, result.tier);
    }
  }, [hasResult, result, type]);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[800px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">

        {/* Back */}
        <motion.div {...fadeUp}>
          <button
            type="button"
            onClick={() => router.push(`/affinity/${type}`)}
            className="text-sm text-muted hover:text-accent transition-colors mb-8 inline-flex items-center gap-2 min-h-[44px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
          >
            &larr; {meta.plural}
          </button>
        </motion.div>

        {/* Hero — entity info always visible */}
        <motion.section {...fadeUp} className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent font-medium mb-4 text-center">
            Afinidad Personal · {meta.label}
          </p>
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-5xl">{entity.emoji}</span>
            <div>
              <h1 className="font-heading text-4xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.1]">
                {entity.name}
              </h1>
              <p className="text-sm text-muted mt-1">{entity.country}</p>
            </div>
          </div>
        </motion.section>

        {/* Date input OR Result */}
        {!hasResult ? (
          /* Date input — shown when no date is saved */
          <motion.section {...fadeUp} className="mb-12">
            <div className="max-w-md mx-auto p-6 rounded-md border border-border bg-card shadow-sm">
              <p className="text-sm font-medium text-foreground mb-1 text-center">
                Ingresá tu fecha de nacimiento para descubrir tu afinidad con {entity.name}
              </p>
              <p className="text-xs text-muted mb-6 text-center">
                Solo necesitamos tu fecha. No se guarda permanentemente.
              </p>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium mb-1.5 block" htmlFor="qa-day">Día</label>
                  <select
                    id="qa-day"
                    value={day}
                    onChange={e => setDay(e.target.value)}
                    className="w-full px-3 py-3 rounded-md border border-border bg-card shadow-sm text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent min-h-[44px]"
                  >
                    <option value="">—</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium mb-1.5 block" htmlFor="qa-month">Mes</label>
                  <select
                    id="qa-month"
                    value={month}
                    onChange={e => setMonth(e.target.value)}
                    className="w-full px-3 py-3 rounded-md border border-border bg-card shadow-sm text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent min-h-[44px]"
                  >
                    {MONTHS.map((m, i) => (
                      <option key={m} value={m}>{MONTH_LABELS[i]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium mb-1.5 block" htmlFor="qa-year">Año</label>
                  <select
                    id="qa-year"
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    className="w-full px-3 py-3 rounded-md border border-border bg-card shadow-sm text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent min-h-[44px]"
                  >
                    {yearOptions.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-500 mb-3 text-center">{error}</p>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all px-6 py-3.5 text-sm bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground min-h-[48px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Descubrir mi afinidad
              </button>
            </div>
          </motion.section>
        ) : (
          /* Result — shown after date is entered */
          <>
            {/* PremiumHero reuses the same component from the with-profile flow */}
            {result && tierMeta && (
              <PremiumHero result={result} entity={entity} meta={meta} type={type} />
            )}

            {/* Save result + secondary onboarding CTA */}
            <motion.section {...fadeUp} className="mb-12">
              <div className="p-6 rounded-md border border-border bg-card shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-1">Guardá tu resultado</p>
                    <p className="text-sm text-muted leading-relaxed">
                      {saved
                        ? "Tu afinidad con esta entidad está guardada."
                        : "Guardá tu afinidad para accederla después sin reingresar tu fecha."
                      }
                    </p>
                  </div>
                  {saved ? (
                    <span className="shrink-0 inline-flex items-center gap-1.5 rounded-md font-medium px-4 py-2 text-sm text-green-700 bg-green-50 min-h-[40px]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Guardada
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSave}
                      className="shrink-0 inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all px-6 py-2.5 text-sm border border-accent/30 bg-accent/[0.03] text-accent hover:bg-accent/10 min-h-[40px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                    >
                      Guardar mi afinidad
                    </button>
                  )}
                </div>
                {!saved && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <button
                      type="button"
                      onClick={() => router.push("/onboarding")}
                      className="text-xs text-muted hover:text-accent transition-colors"
                    >
                      Creá tu perfil para explorar más →
                    </button>
                  </div>
                )}
              </div>
            </motion.section>

            {/* Recommendations — next discoveries */}
            {relatedEntities.length > 0 && (
              <motion.section {...fadeUp} className="mb-12">
                <SectionHeader title="Seguí descubriendo" />
                <div className="space-y-3">
                  {relatedEntities.map((rel, idx) => {
                    const relTier = TIER_META[rel.tier];
                    const typeMeta = ENTITY_TYPES[rel.entity.type];
                    return (
                      <Link
                        key={rel.entity.id}
                        href={`/affinity/${rel.entity.type}/${rel.entity.id}`}
                        onClick={() => analytics.trackAffinityRecommendationClicked(type, entity.id, rel.entity.id, idx)}
                        className="block w-full text-left p-4 rounded-md border border-border bg-card shadow-sm hover:border-accent/40 transition-colors group focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl shrink-0">{rel.entity.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors truncate">
                              {rel.entity.name}
                            </p>
                            <p className="text-xs text-muted">
                              {typeMeta?.label ?? rel.entity.type}
                              <span aria-hidden="true"> · </span>
                              {rel.relationship}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className="text-xs font-semibold px-2 py-0.5 rounded-sm"
                              style={{ color: relTier.color, backgroundColor: `${relTier.color}12` }}
                            >
                              {rel.score}
                            </span>
                            <span className="text-xs text-accent group-hover:translate-x-1 transition-transform">→</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.section>
            )}
          </>
        )}
      </main>
      <UniversityFooter />
    </div>
  );
}
