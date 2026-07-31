"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/utils/motion";
import { useProfile } from "@/lib/hooks/useProfile";
import { calculateAllAffinity, calculateAffinity, TIER_META, type AffinityResult } from "@/lib/engines/affinityEngine";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import { getEntitiesByType, type EntityType } from "@/lib/data/symbolic-entities";
import type { SymbolicEntity } from "@/lib/data/symbolic-entities";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import SearchInput from "@/components/ui/SearchInput";
import { formatAnimalSimple } from "@/lib/utils/zodiacDisplay";

interface AffinityTypeContentProps {
  type: EntityType;
  meta: { label: string; plural: string; icon: string; description: string };
  entities: SymbolicEntity[];
}

const MONTHS = ["01","02","03","04","05","06","07","08","09","10","11","12"];
const MONTH_LABELS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const AFFINITY_DATE_KEY = "molino.affinity-date.v1";

export default function AffinityTypeContent({ type, meta, entities }: AffinityTypeContentProps) {
  const router = useRouter();
  const { profile, mounted } = useProfile({ redirectIfNotFound: false });
  const [search, setSearch] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");
  const [quickResult, setQuickResult] = useState<AffinityResult | null>(null);
  const currentYear = new Date().getFullYear();

  const yearOptions = useMemo(() => Array.from({ length: 100 }, (_, i) => currentYear - i), []);

  const handleQuickDiscover = () => {
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
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(AFFINITY_DATE_KEY, birthDate);
      }
    } catch {}
    const p = calculateUserProfile("", birthDate);
    if (entities.length > 0) {
      const result = calculateAffinity(p, entities[0]);
      setQuickResult(result);
    }
  };

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

  const sortedEntities = useMemo(() => {
    if (!entities.length) return [];
    if (profile) return filtered;
    return entities.slice(0, 20).map((entity) => {
      const p = calculateUserProfile("", "1990-01-01");
      return calculateAffinity(p, entity);
    }).sort((a, b) => b.score - a.score);
  }, [entities, profile, filtered]);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">

        {/* HERO */}
        <motion.section {...fadeUp} className="mb-16 sm:mb-20">
          <p className="label-micro text-accent mb-4">Afinidades</p>
          <h1 className="font-heading uppercase text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1] max-w-3xl">
            ¿Qué países resuenan con vos?
          </h1>
          <p className="text-base sm:text-lg text-muted mt-6 max-w-xl leading-relaxed">
            Descubrí qué países comparten una afinidad simbólica con tu perfil según tu animal del zodíaco chino.
          </p>
          <p className="text-sm text-muted mt-4 max-w-lg">
            Tu afinidad se calcula comparando tu animal con el animal asociado a cada país según su evento histórico principal.
          </p>
        </motion.section>

        {/* QUICK DISCOVERY */}
        <motion.section {...fadeUp} className="mb-16 sm:mb-20">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-heading uppercase text-xl sm:text-2xl font-semibold text-foreground mb-2">
                Descubrí tus afinidades
              </h2>
              <p className="text-sm text-muted">
                Ingresá tu fecha y conocé tu afinidad simbólica con los países.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-md border border-border bg-card shadow-sm">
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium mb-1.5 block" htmlFor="cta-day">Día</label>
                  <select id="cta-day" value={day} onChange={(e) => setDay(e.target.value)} className="w-full px-3 py-3 rounded-md border border-border bg-background shadow-sm text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent min-h-[44px]">
                    <option value="">—</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium mb-1.5 block" htmlFor="cta-month">Mes</label>
                  <select id="cta-month" value={month} onChange={(e) => setMonth(e.target.value)} className="w-full px-3 py-3 rounded-md border border-border bg-background shadow-sm text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent min-h-[44px]">
                    <option value="">—</option>
                    {MONTHS.map((m, i) => (
                      <option key={m} value={m}>{MONTH_LABELS[i]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium mb-1.5 block" htmlFor="cta-year">Año</label>
                  <select id="cta-year" value={year} onChange={(e) => setYear(e.target.value)} className="w-full px-3 py-3 rounded-md border border-border bg-background shadow-sm text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent min-h-[44px]">
                    <option value="">—</option>
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
                onClick={handleQuickDiscover}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all px-6 py-3.5 text-sm bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground min-h-[48px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Descubrir mis afinidades →
              </button>

              <p className="text-[11px] text-muted text-center mt-3">
                Sin registro. No guardamos tu fecha.
              </p>
            </div>
          </div>
        </motion.section>

        {/* RESULTS (when profile exists) */}
        {profile && (
          <motion.section {...fadeUp} className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-border" aria-hidden="true" />
              <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Tus afinidades con países</h2>
            </div>

            {results.length > 3 && (
              <div className="mb-8">
                <SearchInput
                  value={search}
                  onValueChange={setSearch}
                  placeholder={`Buscar países...`}
                  label="Buscar países"
                  className="max-w-sm"
                />
              </div>
            )}

            {filtered.length === 0 ? (
              <EmptyState
                title="Sin resultados"
                description={`No se encontraron países para "${search}".`}
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
          </motion.section>
        )}

        {/* EXPLORAR */}
        <motion.section {...fadeUp} className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Explorar por país</h2>
          </div>
          <p className="text-sm text-muted mb-8 max-w-xl">
            Cada país tiene un animal asociado según su evento histórico principal. Explorá las afinidades simbólicas y descubrí qué lugares resuenan con diferentes energías.
          </p>

          {sortedEntities.length === 0 ? (
            <EmptyState
              title="Exploración por país en expansión"
              description="Los países se están incorporando a Molino. Volvé pronto para descubrir tus afinidades."
            />
          ) : (
            <motion.div {...staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedEntities.slice(0, 12).map((result, i) => (
                <motion.button
                  key={result.entity.id}
                  {...staggerItem}
                  onClick={() => router.push(`/affinity/${type}/${result.entity.id}`)}
                  className="text-left p-5 rounded-md border border-border bg-card shadow-sm hover:border-accent transition-all group focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl shrink-0">{result.entity.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-accent transition-colors truncate">
                        {result.entity.name}
                      </h3>
                      <p className="text-xs text-muted mt-1">
                        {result.entity.country} · {formatAnimalSimple(result.entityAnimal)}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="font-heading text-lg font-bold" style={{ color: TIER_META[result.tier].color }}>
                          {result.score}
                        </div>
                        <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: TIER_META[result.tier].color }}>
                          {TIER_META[result.tier].label}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </motion.section>

        {/* CTA a descubrimiento personal */}
        {!profile && (
          <motion.section {...fadeUp} className="mb-12 text-center">
            <div className="p-8 rounded-md border border-border bg-card shadow-sm max-w-lg mx-auto">
              <p className="text-sm text-foreground mb-2">¿Querés ver tu afinidad personalizada?</p>
              <p className="text-xs text-muted mb-6">Creá tu perfil sin registro y descubrí tus afinidades.</p>
              <button
                type="button"
                onClick={() => router.push("/onboarding")}
                className="inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all px-6 py-3 text-sm bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground min-h-[44px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Crear mi perfil
              </button>
            </div>
          </motion.section>
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
      className="w-full text-left p-6 rounded-md border border-border bg-card shadow-sm hover:border-accent transition-all group flex items-center gap-4 relative overflow-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ backgroundColor: tierMeta.color }} />

      {/* Emoji */}
      <div className="shrink-0">
        <span className="text-3xl">{result.entity.emoji}</span>
      </div>

      {/* Name + Context */}
      <div className="flex-1 min-w-0">
        <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-accent transition-colors truncate">
          {result.entity.name}
        </h3>
        <p className="text-xs text-muted mt-1">
          {result.entity.country} · {formatAnimalSimple(result.entityAnimal)}
        </p>
      </div>

      {/* Score */}
      <div className="text-right shrink-0">
        <div className="font-heading text-xl font-bold" style={{ color: tierMeta.color }}>{result.score}</div>
        <div className="text-[11px] font-medium uppercase tracking-wider mt-0.5" style={{ color: tierMeta.color }}>
          {tierMeta.label}
        </div>
      </div>
    </motion.button>
  );
}