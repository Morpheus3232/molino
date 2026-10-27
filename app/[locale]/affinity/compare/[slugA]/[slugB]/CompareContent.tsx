"use client";
import { useL, type Pick2 } from "@/lib/i18n/useL";

import { useMemo } from "react";
import { useRouter } from "@/lib/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
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

const TYPE_LABEL = (L: Pick2): Record<string, string> => ({
  brand: L("Marca", "Brand"), city: "Ciudad", country: "País", university: L("Universidad", "University"),
  team: L("Equipo", "Team"), movie: L("Película", "Movie"), artist: L("Famoso", "Famous person"),
});
import { formatAnimalSimple } from "@/lib/utils/zodiacDisplay";
import Button from "@/components/ui/Button";
import EntityVisual from "@/components/ui/EntityVisual";

const transitionVariants = {
  enter: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } },
};

interface CompareContentProps {
  entityA: SymbolicEntity;
  entityB: SymbolicEntity;
}

export default function CompareContent({ entityA, entityB }: CompareContentProps) {
  const L = useL();
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

  const showContent = mounted && profile && resultA && resultB && entityComparison;

  const tierA = resultA ? TIER_META[resultA.tier] : null;
  const tierB = resultB ? TIER_META[resultB.tier] : null;
  const compTier = entityComparison ? TIER_META[entityComparison.tier] : null;
  const metaA = { label: TYPE_LABEL(L)[entityA.type] ?? entityA.type };
  const metaB = { label: TYPE_LABEL(L)[entityB.type] ?? entityB.type };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {!mounted ? (
          <motion.div
            key="loading"
            variants={transitionVariants}
            initial="enter"
            animate="show"
            exit="exit"
          >
            <main className="mx-auto max-w-[800px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24" id="main-content">
              <p className="sr-only" role="status" aria-label="Cargando comparación...">{L("Cargando comparación...", "Loading comparison...")}</p>
              <div className="animate-pulse">
                <div className="h-3 bg-[var(--skeleton)] rounded w-10rem mb-6" />
                <div className="h-8 bg-[var(--skeleton)] rounded w-3/4 mb-4" />
                <div className="h-4 bg-[var(--skeleton)] rounded w-1/2 mb-12" />
                <div className="h-64 bg-[var(--skeleton)] border border-ink/10 rounded-md mb-6" />
              </div>
            </main>
          </motion.div>
        ) : !profile ? (
          <motion.div
            key="no-profile"
            variants={transitionVariants}
            initial="enter"
            animate="show"
            exit="exit"
          >
            <main className="mx-auto max-w-content px-4 sm:px-6 py-24 text-center" id="main-content">
              <div className="w-8 h-2 bg-accent mx-auto mb-8" />
              <h1 className="page-title text-foreground mb-4">
                {entityA.emoji} {entityA.name} vs {entityB.emoji} {entityB.name}
              </h1>
              <p className="text-muted mb-8 max-w-md mx-auto">{L(<>
                Creá tu perfil para descubrir la comparación simbólica entre {entityA.name} y {entityB.name}.
              </>, <>Create your profile to discover the symbolic comparison between {entityA.name} and {entityB.name}.</>)}</p>
              <Button variant="primary" size="lg" onClick={() => router.push("/onboarding")}>{L("Crear mi perfil", "Create my profile")}</Button>
            </main>
          </motion.div>
        ) : !resultA || !resultB || !entityComparison ? (
          <motion.div
            key="no-data"
            variants={transitionVariants}
            initial="enter"
            animate="show"
            exit="exit"
          >
            <main className="mx-auto max-w-content px-4 sm:px-6 py-24 text-center" id="main-content">
              <div className="w-8 h-2 bg-accent mx-auto mb-8" />
              <h1 className="page-title text-foreground mb-4">{L("No se pudo calcular la comparación", "The comparison couldn't be calculated")}</h1>
              <p className="text-muted mb-8 max-w-md mx-auto">{L(<>
                Ocurrió un error al calcular la afinidad entre {entityA.name} y {entityB.name}. Intentá de nuevo.
              </>, <>Something went wrong calculating the affinity between {entityA.name} and {entityB.name}. Try again.</>)}</p>
              <Button variant="primary" size="lg" onClick={() => router.push("/affinity/compare")}>{L("Volver a comparar", "Compare again")}</Button>
            </main>
          </motion.div>
        ) : showContent && tierA && tierB && compTier && resultA && resultB && entityComparison ? (
          <motion.div
            key="content"
            variants={transitionVariants}
            initial="enter"
            animate="show"
            exit="exit"
          >
            <main className="mx-auto max-w-[800px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24" id="main-content">

              {/* Back */}
              <motion.div {...fadeUp}>
                <button
                  type="button"
                  onClick={() => router.push("/affinity/compare")}
                  className="text-sm text-muted hover:text-accent transition-colors mb-8 inline-flex items-center gap-2 min-h-[44px]"
                >{L(<>
                  &larr; Elegir otras entidades
                </>, <>&larr; Pick other entities</>)}</button>
              </motion.div>

              {/* Header */}
              <motion.section {...fadeUp} className="mb-12 text-center">
                <h1 className="page-title text-foreground mb-3 line-clamp-2">
                  <span className="inline-block max-w-[45%] truncate align-bottom">{entityA.emoji} {entityA.name}</span>
                  <span className="text-muted mx-2 sm:mx-3">vs</span>
                  <span className="inline-block max-w-[45%] truncate align-bottom">{entityB.emoji} {entityB.name}</span>
                </h1>
                <p className="text-sm text-muted">{L("Según el zodíaco chino", "According to the Chinese zodiac")}</p>
              </motion.section>

              {/* Data base — side by side */}
              <motion.section {...fadeUp} className="mb-12">
                <SectionHeader title={L("Datos base", "Base data")} />
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
                <SectionHeader title={L("Relación entre ambos", "Relationship between the two")} />
                <div className="p-6 border border-ink/10 bg-transparent">
                  <div className="flex items-center justify-center gap-4 sm:gap-8 mb-6">
                    <div className="text-center">
                      <EntityVisual
                        visualType={entityA.visualType}
                        emoji={entityA.emoji}
                        imageUrl={entityA.imageUrl}
                        name={entityA.name}
                        type={entityA.type}
                        category={entityA.category}
                        countryISO={entityA.countryISO}
                        size={48}
                        shape="circle"
                        className="mx-auto mb-2"
                      />
                      <p className="font-heading text-xl font-bold text-foreground">{formatAnimalSimple(resultA.entityAnimal)}</p>
                      <p className="text-xs text-muted mt-1">{entityA.name}</p>
                    </div>

                    <div className="flex flex-col items-center">
                      <span
                        className="font-heading text-lg font-bold text-center"
                        style={{ color: compTier.color }}
                      >
                        {entityComparison.relationship}
                      </span>
                    </div>

                    <div className="text-center">
                      <EntityVisual
                        visualType={entityB.visualType}
                        emoji={entityB.emoji}
                        imageUrl={entityB.imageUrl}
                        name={entityB.name}
                        type={entityB.type}
                        category={entityB.category}
                        countryISO={entityB.countryISO}
                        size={48}
                        shape="circle"
                        className="mx-auto mb-2"
                      />
                      <p className="font-heading text-xl font-bold text-foreground">{formatAnimalSimple(resultB.entityAnimal)}</p>
                      <p className="text-xs text-muted mt-1">{entityB.name}</p>
                    </div>
                  </div>

                  <div className="h-px bg-border my-5" />

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
                <SectionHeader title={L("Tu conexión personal", "Your personal connection")} />
                <p className="text-xs text-muted mb-4">{L(<>
                  Según esta tradición, existe una relación simbólica de{" "}
                  <span className="font-medium text-foreground">{resultA.relationship}</span> entre vos y{" "}
                  <span className="font-medium text-foreground">{entityA.name}</span>, y de{" "}
                  <span className="font-medium text-foreground">{resultB.relationship}</span> entre vos y{" "}
                  <span className="font-medium text-foreground">{entityB.name}</span>.
                </>, <>According to this tradition, there's a symbolic relationship of{" "}<span className="font-medium text-foreground">{resultA.relationship}</span> between you and{" "}<span className="font-medium text-foreground">{entityA.name}</span>, and of{" "}<span className="font-medium text-foreground">{resultB.relationship}</span> between you and{" "}<span className="font-medium text-foreground">{entityB.name}</span>.</>)}</p>
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
                <SectionHeader title={L("Diferencias simbólicas", "Symbolic differences")} />
                <div className="p-6 border border-ink/10 bg-transparent space-y-4">
                  <DifferenceRow
                    label={L("Signos", "Signs")}
                    valueA={`${formatAnimalSimple(resultA.entityAnimal)} (${entityA.name})`}
                    valueB={`${formatAnimalSimple(resultB.entityAnimal)} (${entityB.name})`}
                  />
                  <DifferenceRow
                    label={L("Evento base", "Base event")}
                    valueA={`${resultA.primaryEvent.label} (${resultA.entityYear})`}
                    valueB={`${resultB.primaryEvent.label} (${resultB.entityYear})`}
                  />
                  <DifferenceRow
                    label={L("Precisión", "Precision")}
                    valueA={resultA.isApproximate ? L("Año registrado", "Recorded year") : L("Fecha exacta", "Exact date")}
                    valueB={resultB.isApproximate ? L("Año registrado", "Recorded year") : L("Fecha exacta", "Exact date")}
                  />
                  <DifferenceRow
                    label={L("Relación con vos", "Relationship with you")}
                    valueA={resultA.relationship}
                    valueB={resultB.relationship}
                  />
                  <DifferenceRow
                    label={L("Afinidad personal", "Personal affinity")}
                    valueA={tierA.label}
                    valueB={tierB.label}
                  />
                </div>
              </motion.section>

              {/* Disclaimer */}
              <motion.section {...fadeUp} className="mb-12">
                <div className="p-6 border border-ink/10 bg-transparent">
                  <p className="text-sm text-muted font-medium mb-2 label-caps">{L("Aviso importante", "Important notice")}</p>
                  <p className="text-xs text-muted leading-relaxed">{L("La comparación es una lectura simbólica basada en tradiciones del zodíaco chino, no una medición científica. Molino es una plataforma educativa y de entretenimiento. Cada persona puede interpretar estos sistemas de forma diferente.", "The comparison is a symbolic reading based on Chinese zodiac traditions, not a scientific measurement. Molino is an educational and entertainment platform. Each person may interpret these systems differently.")}</p>
                </div>
              </motion.section>

              {/* CTAs */}
              <motion.section {...fadeUp}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => router.push(`/affinity/${entityA.type}/${entityA.id}`)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all px-6 py-3 text-sm border border-border bg-card text-foreground hover:border-accent min-h-[44px]"
                  >{L(<>
                    Ver {entityA.name}
                  </>, <>See {entityA.name}</>)}</button>
                  <button
                    type="button"
                    onClick={() => router.push(`/affinity/${entityB.type}/${entityB.id}`)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all px-6 py-3 text-sm border border-border bg-card text-foreground hover:border-accent min-h-[44px]"
                  >{L(<>
                    Ver {entityB.name}
                  </>, <>See {entityB.name}</>)}</button>
                  <button
                    type="button"
                    onClick={() => router.push("/affinity")}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all px-6 py-3 text-sm bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground min-h-[44px]"
                  >{L("Explorar más", "Explore more")}</button>
                </div>
              </motion.section>
            </main>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function EntityBaseCard({
  entity,
  result,
  tierMeta,
  typeLabel,
}: {
  entity: SymbolicEntity;
  result: AffinityResult;
  tierMeta: { label: string; color: string; description: string };
  typeLabel: string;
}) {
  const L = useL();
  return (
    <div className="p-6 border border-ink/10 bg-transparent">
      <div className="flex items-center gap-3 mb-4">
        <EntityVisual
          visualType={entity.visualType}
          emoji={entity.emoji}
          imageUrl={entity.imageUrl}
          name={entity.name}
          type={entity.type}
          category={entity.category}
          countryISO={entity.countryISO}
          size={36}
        />
        <div>
          <p className="font-heading text-lg font-semibold text-foreground">{entity.name}</p>
          <p className="text-xs text-muted">{typeLabel} · {entity.country}</p>
        </div>
      </div>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">{L(<>
          <span className="text-muted">Evento</span>
          <span className="text-foreground text-right">{result.primaryEvent.label}</span>
        </>, <><span className="text-muted">Event</span><span className="text-foreground text-right">{result.primaryEvent.label}</span></>)}</div>
        <div className="flex justify-between">{L(<>
          <span className="text-muted">Fecha</span>
          <span className="text-foreground">
            {result.primaryEvent.date
              ? formatDisplayDate(result.primaryEvent.date)
              : String(result.primaryEvent.year)}
          </span>
        </>, <><span className="text-muted">Date</span><span className="text-foreground">{result.primaryEvent.date ? formatDisplayDate(result.primaryEvent.date) : String(result.primaryEvent.year)}</span></>)}</div>
        <div className="flex justify-between">{L(<>
          <span className="text-muted">Animal chino</span>
          <span className="font-medium text-foreground">{result.entityAnimal}</span>
        </>, <><span className="text-muted">Chinese animal</span><span className="font-medium text-foreground">{result.entityAnimal}</span></>)}</div>
        <div className="h-px bg-border my-2" />
        <div className="flex justify-between items-center">{L(<>
          <span className="text-muted">Afinidad personal</span>
          <span className="font-medium" style={{ color: tierMeta.color }}>
            {tierMeta.label}
          </span>
        </>, <><span className="text-muted">Personal affinity</span><span className="font-medium" style={{ color: tierMeta.color }}>{tierMeta.label}</span></>)}</div>
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
  const L = useL();
  return (
    <div className="p-6 border border-ink/10 bg-transparent">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg shrink-0">{emoji ?? "·"}</span>
          <span className="text-sm font-medium text-foreground truncate">{entityName}</span>
        </div>
        <span className="font-heading text-sm font-bold shrink-0 label-caps" style={{ color: tierMeta.color }}>
          {tierMeta.label}
        </span>
      </div>
      <p className="text-xs text-muted mb-1">{L(<>
        Tu signo: <span className="font-medium text-foreground">{userAnimal || "—"}</span> · el suyo: {animal}
      </>, <>Your sign: <span className="font-medium text-foreground">{userAnimal || "—"}</span> · theirs: {animal}</>)}</p>
      <p className="text-xs text-muted">{L(<>
        Relación: <span className="font-medium text-foreground">{relationship}</span>
      </>, <>Relationship: <span className="font-medium text-foreground">{relationship}</span></>)}</p>
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
      <span className="text-muted font-medium w-16 sm:w-24 text-center shrink-0">{label}</span>
      <span className="text-foreground text-left truncate" title={valueB}>{valueB}</span>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-px bg-border" aria-hidden="true" />
      <h2 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
    </div>
  );
}

function formatDisplayDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const monthIdx = parseInt(month, 10) - 1;
  return `${parseInt(day, 10)} de ${months[monthIdx]} de ${year}`;
}
