"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { fadeUp } from "@/lib/utils/motion";
import { useAffinityResult } from "@/lib/hooks/useAffinityResult";
import { TIER_META } from "@/lib/engines/affinityEngine";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import type { EntityType, SymbolicEntity } from "@/lib/data/symbolic-entities";
import type { LightweightEntity } from "@/types/atlas";
import EntityVisual from "@/components/ui/EntityVisual";
import AffinityHero from "@/components/affinity/AffinityHero";
import AffinityDiscoveryList from "@/components/affinity/AffinityDiscoveryList";
import { analytics } from "@/lib/analytics/analytics";
import { saveAffinityResult, hasSavedAffinity } from "@/lib/session/localStorage";

const AFFINITY_DATE_KEY = "molino.affinity-date.v1";
const MONTHS = ["01","02","03","04","05","06","07","08","09","10","11","12"];
const MONTH_LABELS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

const transitionVariants = {
  enter: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } },
};

/**
 * AffinityQuickEntryForm — P0 flow: user enters ONLY birth date, sees
 * Affinity result immediately. No onboarding, no name, no login. Date
 * persisted in sessionStorage across entity pages. Fully self-contained:
 * owns its own date-entry state, save/tracking side effects, and result
 * calculation — the parent (AffinityDetailContent) renders this and nothing
 * else when there is no profile yet.
 */
export default function AffinityQuickEntryForm({
  entity,
  meta,
  type,
  catalog,
}: {
  entity: SymbolicEntity;
  meta: { label: string; plural: string; icon: string; description: string };
  type: EntityType;
  catalog: LightweightEntity[];
}) {
  const router = useRouter();
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

  // Resolve birthDate from sessionStorage (persisted after handleSubmit) or
  // the in-progress day/month/year selection, then derive a profile from it.
  const birthDate = useMemo(() => {
    let stored = "";
    try {
      stored = sessionStorage.getItem(AFFINITY_DATE_KEY) || "";
    } catch {}
    if (stored) return stored;
    if (day && month && year) return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    return "";
  }, [day, month, year]);

  const quickProfile = useMemo(
    () => (birthDate ? calculateUserProfile("", birthDate) : null),
    [birthDate],
  );

  const { result, relatedEntities } = useAffinityResult(quickProfile, entity, catalog);

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
    toast.success("Resonancia guardada", {
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
      <main className="mx-auto max-w-[800px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24" id="main-content">

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
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium mb-4 text-center">
            Cómo resuena · {meta.label}
          </p>
          <div className="flex items-center justify-center gap-4 mb-4">
            <EntityVisual visualType={entity.visualType} emoji={entity.emoji} imageUrl={entity.imageUrl} name={entity.name} countryISO={entity.countryISO} size={56} shape="circle" />
            <div>
              <h1 className="font-heading text-4xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.1]">
                {entity.name}
              </h1>
              <p className="text-sm text-muted mt-1">{entity.country}</p>
            </div>
          </div>
        </motion.section>

        {/* Date input OR Result — AnimatePresence for smooth transition */}
        <AnimatePresence mode="wait">
          {!hasResult ? (
            <motion.div
              key="date-input"
              variants={transitionVariants}
              initial="enter"
              animate="show"
              exit="exit"
            >
          {/* Date input — shown when no date is saved */}
          <motion.section {...fadeUp} className="mb-12">
            <div className="max-w-md mx-auto p-6 border border-ink/10 bg-transparent">
              <p className="text-sm font-medium text-foreground mb-1 text-center">
                Ingresá tu fecha de nacimiento para ver tu resonancia con {entity.name}
              </p>
              <p className="text-xs text-muted mb-6 text-center">
                Solo necesitamos tu fecha. No se guarda permanentemente.
              </p>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-1.5 block" htmlFor="qa-day">Día</label>
                  <select
                    id="qa-day"
                    value={day}
                    onChange={e => setDay(e.target.value)}
                    className="w-full px-3 py-3 rounded-md border border-border bg-card shadow-sm text-foreground text-base focus:outline-none focus:ring-2 focus:ring-accent min-h-[44px]"
                  >
                    <option value="">—</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-1.5 block" htmlFor="qa-month">Mes</label>
                  <select
                    id="qa-month"
                    value={month}
                    onChange={e => setMonth(e.target.value)}
                    className="w-full px-3 py-3 rounded-md border border-border bg-card shadow-sm text-foreground text-base focus:outline-none focus:ring-2 focus:ring-accent min-h-[44px]"
                  >
                    {MONTHS.map((m, i) => (
                      <option key={m} value={m}>{MONTH_LABELS[i]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-1.5 block" htmlFor="qa-year">Año</label>
                  <select
                    id="qa-year"
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    className="w-full px-3 py-3 rounded-md border border-border bg-card shadow-sm text-foreground text-base focus:outline-none focus:ring-2 focus:ring-accent min-h-[44px]"
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
                Ver mi resonancia
              </button>
            </div>
          </motion.section>
          </motion.div>
        ) : (
          /* Result — shown after date is entered */
          <motion.div
            key="result"
            variants={transitionVariants}
            initial="enter"
            animate="show"
            exit="exit"
          >
            {/* AffinityHero reuses the same component from the with-profile flow */}
            {result && tierMeta && (
              <AffinityHero result={result} entity={entity} meta={meta} type={type} />
            )}

            {/* Save result + secondary onboarding CTA */}
            <motion.section {...fadeUp} className="mb-12">
              <div className="p-6 border border-ink/10 bg-transparent">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-1">Guardá tu resultado</p>
                    <p className="text-sm text-muted leading-relaxed">
                      {saved
                        ? "Tu resonancia con esta entidad está guardada."
                        : "Guardá tu resonancia para accederla después sin reingresar tu fecha."
                      }
                    </p>
                  </div>
                  {saved ? (
                    <span className="shrink-0 inline-flex items-center gap-1.5 rounded-md font-medium px-4 py-2 text-sm text-accent bg-accent/10 min-h-[40px]">
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
                      Guardar mi resonancia
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
            <AffinityDiscoveryList title="Seguí descubriendo" relatedEntities={relatedEntities} entityId={entity.id} type={type} />
          </motion.div>
        )}
        </AnimatePresence>
      </main>
    </div>
  );
}
