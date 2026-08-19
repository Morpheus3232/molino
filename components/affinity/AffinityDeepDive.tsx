"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import { TIER_META, type AffinityResult } from "@/lib/engines/affinityEngine";
import { buildEntityConnectionStory, getRelationColor, getRelationIcon } from "@/lib/engines/entityStoryEngine";
import type { EntityType, SymbolicEntity } from "@/lib/data/symbolic-entities";
import type { UserProfile } from "@/types/user";
import { formatAnimalSimple } from "@/lib/utils/zodiacDisplay";
import { SectionHeader, CollapsibleSection, DataRow, OtherEventCard, formatDisplayDate } from "@/components/affinity/AffinitySectionPrimitives";

/**
 * Read-only deep-dive content for the with-profile flow: calculation basis,
 * animal relationship, why-this-affinity, other historical events,
 * documented data, disclaimer, and the "Sos X como Y" connection story.
 * Only rendered once a real AffinityResult exists.
 */
export default function AffinityDeepDive({
  result,
  entity,
  meta,
  type,
  profile,
  showOtherEvents,
  onToggleOtherEvents,
}: {
  result: AffinityResult;
  entity: SymbolicEntity;
  meta: { label: string; plural: string; icon: string; description: string };
  type: EntityType;
  profile: UserProfile;
  showOtherEvents: boolean;
  onToggleOtherEvents: () => void;
}) {
  const router = useRouter();
  const tierMeta = TIER_META[result.tier];
  const primaryEvent = result.primaryEvent;
  const otherEvents = result.otherEvents ?? [];
  const story = buildEntityConnectionStory(profile, entity);

  return (
    <>
      {/* Base del cálculo simbólico */}
      {primaryEvent && (
        <motion.section {...fadeUp} className="mb-12" role="region" aria-labelledby="section-calculo">
          <CollapsibleSection title="Base del cálculo simbólico" id="section-calculo">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Tu año */}
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-3">Tu año</p>
                <p className="font-heading text-3xl font-bold text-foreground">{result.userYear}</p>
                <p className="text-sm text-muted mt-1">{formatAnimalSimple(result.userAnimal)}</p>
              </div>
              {/* Evento de la entidad */}
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-3">
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

      {/* Por qué esta afinidad — fusiona lo que antes eran dos secciones
          ("Relación entre ambos animales" + "¿Por qué esta afinidad?"):
          ambas explicaban la misma relación desde ángulos que se pisaban
          (par de animales + tradición, y resumen + método). result.explanation
          ya se muestra completo en AffinityHero (primer contacto) — no se
          repite acá. */}
      <motion.section {...fadeUp} className="mb-12" role="region" aria-labelledby="section-por-que">
        <CollapsibleSection title="¿Por qué esta afinidad?" id="section-por-que">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{entity.emoji}</span>
            <p className="text-sm font-medium text-foreground">
              {formatAnimalSimple(result.userAnimal)} ↔ {formatAnimalSimple(result.entityAnimal)}
            </p>
            <span
              className="text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded-sm"
              style={{ color: tierMeta?.color, backgroundColor: `${tierMeta?.color}15` }}
            >
              {result.relationship}
            </span>
          </div>
          <div className="h-px bg-border my-4" />
          <p className="text-sm text-foreground leading-relaxed mb-4">{result.summary}</p>
          {result.tradition && (
            <p className="text-xs text-muted italic mb-3">{result.tradition}</p>
          )}
          <p className="text-xs text-muted leading-relaxed italic">{result.methodNote}</p>
        </CollapsibleSection>
      </motion.section>

      {/* Link to multi-factor analysis — after deep content */}
      <motion.section {...fadeUp} className="mb-12">
        <div className="p-6 border border-accent/20 bg-accent/[0.03]">
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-2">Análisis multi-factor</p>
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
          <div className="border border-ink/10 bg-transparent overflow-hidden">
            <button
              type="button"
              onClick={onToggleOtherEvents}
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
        <div className="p-6 border border-ink/10 bg-transparent">
          <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-2">Aviso importante</p>
          <p className="text-xs text-muted leading-relaxed">
            La afinidad es una lectura simbólica basada en tradiciones del zodíaco chino, no una medición científica.
            Molino es una plataforma educativa y de entretenimiento. Cada persona puede interpretar estos sistemas de forma diferente.
          </p>
        </div>
      </motion.section>

      {/* "Sos X como Y" narrative */}
      {story && (
        <motion.section {...fadeUp} className="mb-12">
          <SectionHeader title="Tu conexión" />
          <div className="p-6 border border-ink/10 bg-transparent">
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
              <span className="text-lg">{getRelationIcon(story.relationType)}</span>
              <span
                className="text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded-sm"
                style={{ color: getRelationColor(story.relationType), backgroundColor: `${getRelationColor(story.relationType)}15` }}
              >
                {story.relationLabel}
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{story.explanation}</p>
          </div>
        </motion.section>
      )}
    </>
  );
}
