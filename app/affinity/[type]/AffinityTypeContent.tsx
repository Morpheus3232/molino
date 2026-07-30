"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/utils/motion";
import { useProfile } from "@/lib/hooks/useProfile";
import { calculateAllAffinity, TIER_META, type AffinityResult } from "@/lib/engines/affinityEngine";
import { getEntitiesByType, type EntityType } from "@/lib/data/symbolic-entities";
import type { SymbolicEntity } from "@/lib/data/symbolic-entities";
import UniversityFooter from "@/components/layout/UniversityFooter";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";

interface AffinityTypeContentProps {
  type: EntityType;
  meta: { label: string; plural: string; icon: string; description: string };
  entities: SymbolicEntity[];
}

export default function AffinityTypeContent({ type, meta, entities }: AffinityTypeContentProps) {
  const router = useRouter();
  const { profile, mounted } = useProfile({ redirectIfNotFound: false });
  const [search, setSearch] = useState("");

  const results = useMemo(() => {
    if (!profile) return [];
    return calculateAllAffinity(profile, entities);
  }, [profile, entities]);

  const filtered = useMemo(() => {
    if (!search) return results;
    const q = search.toLowerCase();
    return results.filter((r) => r.entity.name.toLowerCase().includes(q));
  }, [results, search]);

  if (!mounted) return <LoadingState message="Cargando..." />;

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-24 text-center">
          <div className="w-8 h-2 bg-accent mx-auto mb-8" />
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent font-medium mb-4">
            Afinidad Personal · {meta.plural}
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">
            {meta.icon} {meta.plural}
          </h1>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Creá tu perfil para descubrir qué {meta.plural.toLowerCase()} resuenan con tu identidad simbólica.
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

  const userAnimal = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">

        {/* Hero */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <button
            type="button"
            onClick={() => router.push("/affinity")}
            className="text-sm text-muted hover:text-accent transition-colors mb-6 inline-flex items-center gap-2 min-h-[44px]"
          >
            &larr; Todas las categorías
          </button>
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent font-medium mb-4">
            Afinidad Personal · {meta.plural}
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1]">
            {meta.icon} {meta.plural}
            <br />
            <span className="text-muted">que resuenan con vos</span>
          </h1>
          <p className="text-base text-muted mt-6 max-w-xl leading-relaxed">
            Tu animal{" "}
            <span className="font-medium text-foreground">{userAnimal}</span> se conecta con cada{" "}
            {meta.label.toLowerCase()} a través de su zodíaco chino, basado en el evento histórico principal.
          </p>
        </motion.section>

        {/* Search */}
        {results.length > 3 && (
          <div className="mb-8">
            <input
              type="search"
              placeholder={`Buscar ${meta.plural.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-sm px-4 py-3 rounded-none border border-border bg-card text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-accent transition-colors"
              aria-label={`Buscar ${meta.plural.toLowerCase()}`}
            />
          </div>
        )}

        {/* Results */}
        {filtered.length === 0 ? (
          <EmptyState
            title="Sin resultados"
            description={`No se encontraron ${meta.plural.toLowerCase()} para "${search}".`}
            actionLabel="Limpiar búsqueda"
            onAction={() => setSearch("")}
          />
        ) : (
          <motion.div {...staggerContainer} className="space-y-3">
            {filtered.map((result, i) => (
              <EntityCard
                key={result.entity.id}
                result={result}
                index={i}
                type={type}
                onClick={() => router.push(`/affinity/${type}/${result.entity.id}`)}
              />
            ))}
          </motion.div>
        )}
      </main>
      <UniversityFooter />
    </div>
  );
}

function EntityCard({
  result,
  index,
  type,
  onClick,
}: {
  result: AffinityResult;
  index: number;
  type: EntityType;
  onClick: () => void;
}) {
  const tierMeta = TIER_META[result.tier];

  return (
    <motion.button
      {...staggerItem}
      onClick={onClick}
      className="w-full text-left p-5 sm:p-6 rounded-none border border-border bg-card/60 hover:border-accent transition-all group flex items-center gap-4 sm:gap-6 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ backgroundColor: tierMeta.color }} />
      
      {/* Rank + Emoji */}
      <div className="flex flex-col items-center gap-1 shrink-0">
        <span className="text-xs font-mono text-muted">{String(index + 1).padStart(2, "0")}</span>
        <span className="text-2xl">{result.entity.emoji}</span>
      </div>

      {/* Name + Context */}
      <div className="flex-1 min-w-0">
        <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-accent transition-colors truncate">
          {result.entity.name}
        </h3>
        <p className="text-xs text-muted truncate">
          {result.entity.country} · {result.primaryEvent.label} ({result.primaryEvent.year})
        </p>
      </div>

      {/* Score Insight */}
      <div className="text-right shrink-0">
        <div className="font-heading text-2xl font-bold" style={{ color: tierMeta.color }}>{result.score}</div>
        <div className="text-[10px] font-medium uppercase tracking-wider mt-0.5" style={{ color: tierMeta.color }}>
          {tierMeta.label}
        </div>
      </div>
    </motion.button>
  );
}
