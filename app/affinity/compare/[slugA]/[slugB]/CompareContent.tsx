"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import { useProfile } from "@/lib/hooks/useProfile";
import {
  calculateAffinity,
  calculateAnimalComparison,
  TIER_META,
  type AffinityResult,
  type AnimalComparison,
} from "@/lib/engines/affinityEngine";
import type { SymbolicEntity } from "@/lib/data/symbolic-entities";
import { ENTITY_TYPES } from "@/lib/data/symbolic-entities";
import { formatAnimalSimple } from "@/lib/utils/zodiacDisplay";
import UniversityFooter from "@/components/layout/UniversityFooter";
import LoadingState from "@/components/ui/LoadingState";

interface CompareContentProps {
  entityA: SymbolicEntity;
  entityB: SymbolicEntity;
}

export default function CompareContent({ entityA, entityB }: CompareContentProps) {
  const router = useRouter();
  const { profile, mounted } = useProfile({ redirectIfNotFound: false });

  const resultA = useMemo(() => {
    if (!profile) return null;
    return calculateAffinity(profile, entityA);
  }, [profile, entityA]);

  const resultB = useMemo(() => {
    if (!profile) return null;
    return calculateAffinity(profile, entityB);
  }, [profile, entityB]);

  const entityComparison = useMemo(() => {
    if (!resultA || !resultB) return null;
    return calculateAnimalComparison(resultA.entityAnimal, resultB.entityAnimal);
  }, [resultA, resultB]);

  if (!mounted) return <LoadingState message="Cargando..." />;

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-content px-4 sm:px-6 py-24 text-center">
          <div className="w-8 h-2 bg-accent mx-auto mb-8" />
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent font-medium mb-4">
            Afinidad Personal · Comparación
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">
            {entityA.emoji} {entityA.name} vs {entityB.emoji} {entityB.name}
          </h1>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Creá tu perfil para descubrir la comparación simbólica entre {entityA.name} y {entityB.name}.
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

  if (!resultA || !resultB || !entityComparison) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-content px-4 sm:px-6 py-24 text-center">
          <div className="w-8 h-2 bg-accent mx-auto mb-8" />
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent font-medium mb-4">
            Afinidad Personal · Comparación
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">
            No se pudo calcular la comparación
          </h1>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Ocurrió un error al calcular la afinidad entre {entityA.name} y {entityB.name}. Intentá de nuevo.
          </p>
          <button
            type="button"
            onClick={() => router.push("/affinity/compare")}
            className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-8 py-4 text-base bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground min-h-[52px]"
          >
            Volver a comparar
          </button>
        </div>
        <UniversityFooter />
      </div>
    );
  }

  const tierA = TIER_META[resultA.tier];
  const tierB = TIER_META[resultB.tier];
  const compTier = TIER_META[entityComparison.tier];
  const metaA = ENTITY_TYPES[entityA.type];
  const metaB = ENTITY_TYPES[entityB.type];

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[800px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">

        {/* Back */}
        <motion.div {...fadeUp}>
          <button
            type="button"
            onClick={() => router.push("/affinity/compare")}
            className="text-sm text-muted hover:text-accent transition-colors mb-8 inline-flex items-center gap-2 min-h-[44px]"
          >
            &larr; Elegir otras entidades
          </button>
        </motion.div>

        {/* Header */}
        <motion.section {...fadeUp} className="mb-12 text-center">
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent font-medium mb-4">
            Comparación Simbólica
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-[1.1] mb-3 line-clamp-2">
            <span className="inline-block max-w-[45%] truncate align-bottom">{entityA.emoji} {entityA.name}</span>
            <span className="text-muted mx-2 sm:mx-3">vs</span>
            <span className="inline-block max-w-[45%] truncate align-bottom">{entityB.emoji} {entityB.name}</span>
          </h1>
          <p className="text-sm text-muted">Según el zodíaco chino</p>
        </motion.section>

        {/* Data base — side by side */}
        <motion.section {...fadeUp} className="mb-12">
          <SectionHeader title="Datos base" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <EntityBaseCard
              entity={entityA}
              result={resultA}
              tierMeta={tierA}
              typeLabel={metaA?.label ?? entityA.type}
            />
            <EntityBaseCard
              entity={entityB}
              result={resultB}
              tierMeta={tierB}
              typeLabel={metaB?.label ?? entityB.type}
            />
          </div>
        </motion.section>

        {/* Entity vs Entity comparison */}
        <motion.section {...fadeUp} className="mb-12">
          <SectionHeader title="Relación entre ambos" />
          <div className="p-6 rounded-none border border-border bg-card">
            {/* Animals face to face */}
            <div className="flex items-center justify-center gap-4 sm:gap-8 mb-6">
              <div className="text-center">
                <span className="text-3xl block mb-2">{entityA.emoji}</span>
                <p className="font-heading text-xl font-bold text-foreground">{formatAnimalSimple(resultA.entityAnimal)}</p>
                <p className="text-xs text-muted mt-1">{entityA.name}</p>
              </div>

              <div className="flex flex-col items-center">
                <span
                  className="font-heading text-3xl font-bold"
                  style={{ color: compTier.color }}
                >
                  {entityComparison.score}
                </span>
                <span className="text-[10px] text-muted mt-1">/ 100</span>
              </div>

              <div className="text-center">
                <span className="text-3xl block mb-2">{entityB.emoji}</span>
                <p className="font-heading text-xl font-bold text-foreground">{formatAnimalSimple(resultB.entityAnimal)}</p>
                <p className="text-xs text-muted mt-1">{entityB.name}</p>
              </div>
            </div>

            {/* Relationship label */}
            <div className="text-center mb-5">
              <span
                className="text-[10px] font-medium uppercase tracking-wider px-3 py-1 rounded-full"
                style={{ color: compTier.color, backgroundColor: `${compTier.color}15` }}
              >
                {entityComparison.relationship}
              </span>
            </div>

            <div className="h-px bg-border my-5" />

            {/* Explanation */}
            <p className="text-sm text-foreground leading-relaxed mb-3">
              {entityComparison.explanation}
            </p>
            {entityComparison.tradition && (
              <p className="text-xs text-muted italic">{entityComparison.tradition}</p>
            )}
          </div>
        </motion.section>

        {/* Your personal connection to each */}
        <motion.section {...fadeUp} className="mb-12">
          <SectionHeader title="Tu conexión personal" />
          <p className="text-xs text-muted mb-4">
            Según esta tradición, existe una relación simbólica de{" "}
            <span className="font-medium text-foreground">{resultA.relationship}</span> entre vos y{" "}
            <span className="font-medium text-foreground">{entityA.name}</span>, y de{" "}
            <span className="font-medium text-foreground">{resultB.relationship}</span> entre vos y{" "}
            <span className="font-medium text-foreground">{entityB.name}</span>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PersonalCard
              entityName={entityA.name}
              emoji={entityA.emoji}
              animal={resultA.entityAnimal}
              userAnimal={resultA.userAnimal}
              score={resultA.score}
              tierMeta={tierA}
              relationship={resultA.relationship}
            />
            <PersonalCard
              entityName={entityB.name}
              emoji={entityB.emoji}
              animal={resultB.entityAnimal}
              userAnimal={resultB.userAnimal}
              score={resultB.score}
              tierMeta={tierB}
              relationship={resultB.relationship}
            />
          </div>
        </motion.section>

        {/* Symbolic differences */}
        <motion.section {...fadeUp} className="mb-12">
          <SectionHeader title="Diferencias simbólicas" />
          <div className="p-6 rounded-none border border-border bg-card space-y-4">
            <DifferenceRow
              label="Animales"
              valueA={`${formatAnimalSimple(resultA.entityAnimal)} (${entityA.name})`}
              valueB={`${formatAnimalSimple(resultB.entityAnimal)} (${entityB.name})`}
            />
            <DifferenceRow
              label="Evento base"
              valueA={`${resultA.primaryEvent.label} (${resultA.entityYear})`}
              valueB={`${resultB.primaryEvent.label} (${resultB.entityYear})`}
            />
            <DifferenceRow
              label="Precisión"
              valueA={resultA.isApproximate ? "Año aproximado" : "Fecha exacta"}
              valueB={resultB.isApproximate ? "Año aproximado" : "Fecha exacta"}
            />
            <DifferenceRow
              label="Relación con vos"
              valueA={resultA.relationship}
              valueB={resultB.relationship}
            />
            <DifferenceRow
              label="Score personal"
              valueA={`${resultA.score}/100`}
              valueB={`${resultB.score}/100`}
            />
          </div>
        </motion.section>

        {/* Disclaimer */}
        <motion.section {...fadeUp} className="mb-12">
          <div className="p-5 rounded-none border border-border bg-card">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Aviso importante</p>
            <p className="text-xs text-muted leading-relaxed">
              La comparación es una lectura simbólica basada en tradiciones del zodíaco chino, no una medición científica.
              Molino es una plataforma educativa y de entretenimiento. Cada persona puede interpretar estos sistemas de forma diferente.
            </p>
          </div>
        </motion.section>

        {/* CTAs */}
        <motion.section {...fadeUp}>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => router.push(`/affinity/${entityA.type}/${entityA.id}`)}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-6 py-3 text-sm border border-border bg-card text-foreground hover:border-accent min-h-[44px]"
            >
              Ver {entityA.name}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/affinity/${entityB.type}/${entityB.id}`)}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-6 py-3 text-sm border border-border bg-card text-foreground hover:border-accent min-h-[44px]"
            >
              Ver {entityB.name}
            </button>
            <button
              type="button"
              onClick={() => router.push("/affinity")}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-6 py-3 text-sm bg-primary text-primary-foreground shadow-sm hover:bg-accent hover:text-accent-foreground min-h-[44px]"
            >
              Explorar más
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

function EntityBaseCard({
  entity,
  result,
  tierMeta,
  typeLabel,
}: {
  entity: SymbolicEntity;
  result: AffinityResult;
  tierMeta: { label: string; color: string };
  typeLabel: string;
}) {
  return (
    <div className="p-5 rounded-none border border-border bg-card">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{entity.emoji}</span>
        <div>
          <p className="font-heading text-lg font-semibold text-foreground">{entity.name}</p>
          <p className="text-xs text-muted">{typeLabel} · {entity.country}</p>
        </div>
      </div>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-muted">Evento</span>
          <span className="text-foreground text-right">{result.primaryEvent.label}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Fecha</span>
          <span className="text-foreground">
            {result.primaryEvent.date
              ? formatDisplayDate(result.primaryEvent.date)
              : `circa ${result.primaryEvent.year}`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Animal chino</span>
          <span className="font-medium text-foreground">{result.entityAnimal}</span>
        </div>
        <div className="h-px bg-border my-2" />
        <div className="flex justify-between items-center">
          <span className="text-muted">Afinidad personal</span>
          <span className="font-medium" style={{ color: tierMeta.color }}>
            {result.score}/100 · {tierMeta.label}
          </span>
        </div>
      </div>
    </div>
  );
}

function PersonalCard({
  entityName,
  emoji,
  animal,
  userAnimal,
  score,
  tierMeta,
  relationship,
}: {
  entityName: string;
  emoji?: string;
  animal: string;
  userAnimal: string;
  score: number;
  tierMeta: { label: string; color: string; description: string };
  relationship: string;
}) {
  return (
    <div className="p-5 rounded-none border border-border bg-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg shrink-0">{emoji ?? "·"}</span>
          <span className="text-sm font-medium text-foreground truncate">{entityName}</span>
        </div>
        <span className="font-heading text-xl font-bold shrink-0" style={{ color: tierMeta.color }}>
          {score}
        </span>
      </div>
      <p className="text-xs text-muted mb-1">
        Tu animal: <span className="font-medium text-foreground">{userAnimal || "—"}</span> ↔ {animal}
      </p>
      <p className="text-xs text-muted">
        Relación: <span className="font-medium text-foreground">{relationship}</span>
      </p>
    </div>
  );
}

function DifferenceRow({
  label,
  valueA,
  valueB,
}: {
  label: string;
  valueA: string;
  valueB: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center text-xs">
      <span className="text-foreground text-right truncate" title={valueA}>{valueA}</span>
      <span className="text-muted font-medium w-24 text-center shrink-0">{label}</span>
      <span className="text-foreground text-left truncate" title={valueB}>{valueB}</span>
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

function formatDisplayDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const monthIdx = parseInt(month, 10) - 1;
  return `${parseInt(day, 10)} de ${months[monthIdx]} de ${year}`;
}
