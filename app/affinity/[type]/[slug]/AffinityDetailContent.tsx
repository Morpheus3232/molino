"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import { useProfile } from "@/lib/hooks/useProfile";
import { calculateAffinity, TIER_META, type AffinityResult } from "@/lib/engines/affinityEngine";
import type { EntityType, HistoricalEvent } from "@/lib/data/symbolic-entities";
import type { SymbolicEntity } from "@/lib/data/symbolic-entities";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import LoadingState from "@/components/ui/LoadingState";
import AffinityShareableCard from "@/components/profile/AffinityShareableCard";
import { formatAnimalSimple } from "@/lib/utils/zodiacDisplay";

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

  if (!mounted) return <LoadingState message="Cargando..." />;

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <UniversityHeader />
        <div className="mx-auto max-w-content px-4 sm:px-6 py-24 text-center">
          <div className="w-8 h-2 bg-accent mx-auto mb-8" />
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent font-medium mb-4">
            Afinidad Personal · {meta.label}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">
            {entity.emoji} {entity.name}
          </h1>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Creá tu perfil para descubrir tu afinidad simbólica con {entity.name}.
          </p>
          <button
            type="button"
            onClick={() => router.push("/onboarding")}
            className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-8 py-4 text-base bg-primary text-primary-foreground shadow-md hover:bg-accent hover:text-accent-foreground min-h-[52px]"
          >
            Crear mi perfil
          </button>
        </div>
        <UniversityFooter />
      </div>
    );
  }

  const tierMeta = result ? TIER_META[result.tier] : null;
  const primaryEvent = result?.primaryEvent;
  const otherEvents = result?.otherEvents ?? [];

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />
      <main className="mx-auto max-w-[800px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">

        {/* Back */}
        <motion.div {...fadeUp}>
          <button
            type="button"
            onClick={() => router.push(`/affinity/${type}`)}
            className="text-sm text-muted hover:text-accent transition-colors mb-8 inline-flex items-center gap-2 min-h-[44px]"
          >
            &larr; {meta.plural}
          </button>
        </motion.div>

        {/* Hero */}
        <motion.section {...fadeUp} className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent font-medium mb-4">
            Afinidad Personal · {meta.label}
          </p>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{entity.emoji}</span>
            <div>
              <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.1]">
                {entity.name}
              </h1>
              <p className="text-sm text-muted mt-1">{entity.country}</p>
            </div>
          </div>
        </motion.section>

        {/* Score hero */}
        {result && tierMeta && (
          <motion.section {...fadeUp} className="mb-12">
            <div className="flex items-center gap-6 p-6 rounded-2xl border border-border bg-card">
              <div className="text-center">
                <div className="font-serif text-5xl font-bold text-foreground">{result.score}</div>
                <div className="text-xs text-muted mt-1">/ 100</div>
              </div>
              <div className="h-12 w-px bg-border" aria-hidden="true" />
              <div>
                <div
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: tierMeta.color }}
                >
                  {tierMeta.label}
                </div>
                <p className="text-xs text-muted mt-1 max-w-xs">{tierMeta.description}</p>
              </div>
            </div>
          </motion.section>
        )}

        {/* Base del cálculo simbólico */}
        {result && primaryEvent && (
          <motion.section {...fadeUp} className="mb-12">
            <SectionHeader title="Base del cálculo simbólico" />
            <div className="p-6 rounded-2xl border border-border bg-card">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Tu año */}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Tu año</p>
                  <p className="font-serif text-3xl font-bold text-foreground">{result.userYear}</p>
                  <p className="text-sm text-muted mt-1">{formatAnimalSimple(result.userAnimal)}</p>
                </div>
                {/* Evento de la entidad */}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">
                    {primaryEvent.label}
                  </p>
                  <p className="font-serif text-3xl font-bold text-foreground">{result.entityYear}</p>
                  <p className="text-sm text-muted mt-1">{formatAnimalSimple(result.entityAnimal)}</p>
                </div>
              </div>

              {/* Event detail line */}
              <div className="mt-5 pt-5 border-t border-border">
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
                  <p className="text-xs text-muted/70 flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-400 shrink-0" />
                    Calculado con fecha exacta
                  </p>
                ) : (
                  <p className="text-xs text-muted/70 flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    Calculado desde el año disponible
                  </p>
                )}
              </div>
            </div>
          </motion.section>
        )}

        {/* Relationship */}
        {result && (
          <motion.section {...fadeUp} className="mb-12">
            <SectionHeader title="Relación entre ambos animales" />
            <div className="p-6 rounded-2xl border border-border bg-card">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{entity.emoji}</span>
                <p className="text-sm font-medium text-foreground">
                  {formatAnimalSimple(result.userAnimal)} ↔ {formatAnimalSimple(result.entityAnimal)}
                </p>
                <span
                  className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ color: tierMeta?.color, backgroundColor: `${tierMeta?.color}15` }}
                >
                  {result.relationship}
                </span>
              </div>
              <div className="h-px bg-border my-4" />
              <p className="text-sm text-foreground leading-relaxed mb-3">{result.explanation}</p>
              {result.tradition && (
                <p className="text-xs text-muted/70 italic">{result.tradition}</p>
              )}
            </div>
          </motion.section>
        )}

        {/* Why this affinity */}
        {result && (
          <motion.section {...fadeUp} className="mb-12">
            <SectionHeader title="¿Por qué esta afinidad?" />
            <div className="p-6 rounded-2xl border border-border bg-card">
              <p className="text-sm text-foreground leading-relaxed mb-4">{result.summary}</p>
              <p className="text-xs text-muted leading-relaxed italic">{result.methodNote}</p>
            </div>
          </motion.section>
        )}

        {/* Other historical events — collapsible */}
        {otherEvents.length > 0 && (
          <motion.section {...fadeUp} className="mb-12">
            <SectionHeader title="Otros eventos históricos" />
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <button
                type="button"
                onClick={() => setShowOtherEvents(!showOtherEvents)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
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
                    <div className="px-5 pb-5 space-y-3">
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
          <SectionHeader title="Datos documentados" />
          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
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
        </motion.section>

        {/* Disclaimer */}
        <motion.section {...fadeUp} className="mb-12">
          <div className="p-5 rounded-2xl border border-border bg-card">
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

        {/* CTAs */}
        <motion.section {...fadeUp}>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => router.push(`/affinity/compare?from=${entity.id}`)}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-6 py-3 text-sm border border-border bg-card text-foreground hover:border-accent min-h-[44px]"
            >
              Comparar con otra entidad
            </button>
            <button
              type="button"
              onClick={() => router.push(`/affinity/${type}`)}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-6 py-3 text-sm border border-border bg-card text-foreground hover:border-accent min-h-[44px]"
            >
              Ver todas las {meta.plural.toLowerCase()}
            </button>
            <button
              type="button"
              onClick={() => router.push("/affinity")}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-6 py-3 text-sm bg-primary text-primary-foreground shadow-sm hover:bg-accent hover:text-accent-foreground min-h-[44px]"
            >
              Explorar
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

function OtherEventCard({ event }: { event: HistoricalEvent }) {
  const { animal, isApproximate } = useMemo(() => {
    if (event.calculatedAnimal) {
      return { animal: event.calculatedAnimal, isApproximate: event.isApproximate ?? false };
    }
    return { animal: null, isApproximate: false };
  }, [event]);

  return (
    <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
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
        <p className="text-[10px] text-muted/60">Fuente: {event.source}</p>
        {isApproximate && (
          <p className="text-[10px] text-muted/60">· Año aproximado</p>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-8 h-px bg-border" aria-hidden="true" />
      <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">{title}</h2>
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
