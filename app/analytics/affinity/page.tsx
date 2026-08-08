"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import UniversityFooter from "@/components/layout/UniversityFooter";
import { analytics } from "@/lib/analytics/analytics";

type EventType =
  | "affinity_date_entered"
  | "affinity_result_viewed"
  | "affinity_shared"
  | "affinity_profile_cta_clicked"
  | "affinity_recommendation_clicked"
  | "affinity_save_clicked";

const AFFINITY_EVENTS: EventType[] = [
  "affinity_date_entered",
  "affinity_result_viewed",
  "affinity_shared",
  "affinity_profile_cta_clicked",
  "affinity_recommendation_clicked",
  "affinity_save_clicked",
];

const EVENT_LABELS: Record<EventType, string> = {
  affinity_date_entered: "Fecha ingresada",
  affinity_result_viewed: "Resultado visto",
  affinity_shared: "Compartido",
  affinity_profile_cta_clicked: "CTA perfil clickeado",
  affinity_recommendation_clicked: "Recomendación clickeada",
  affinity_save_clicked: "Resultado guardado",
};

interface EventCounts {
  date_entered: number;
  result_viewed: number;
  shared: number;
  profile_cta: number;
  recommendation_clicked: number;
  save_clicked: number;
}

interface DailyCount {
  date: string;
  counts: EventCounts;
}

const transitionVariants = {
  enter: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } },
};

export default function AffinityAnalyticsPage() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const analyticsData = useMemo(() => {
    if (!loaded) return null;

    const allEvents = analytics.getEvents();
    const affinityEvents = allEvents.filter(e =>
      AFFINITY_EVENTS.includes(e.type as EventType)
    );

    const counts: EventCounts = {
      date_entered: 0,
      result_viewed: 0,
      shared: 0,
      profile_cta: 0,
      recommendation_clicked: 0,
      save_clicked: 0,
    };

    affinityEvents.forEach(e => {
      switch (e.type) {
        case "affinity_date_entered": counts.date_entered++; break;
        case "affinity_result_viewed": counts.result_viewed++; break;
        case "affinity_shared": counts.shared++; break;
        case "affinity_profile_cta_clicked": counts.profile_cta++; break;
        case "affinity_recommendation_clicked": counts.recommendation_clicked++; break;
        case "affinity_save_clicked": counts.save_clicked++; break;
      }
    });

    const dailyMap = new Map<string, EventCounts>();
    affinityEvents.forEach(e => {
      const date = e.timestamp.split("T")[0];
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { date_entered: 0, result_viewed: 0, shared: 0, profile_cta: 0, recommendation_clicked: 0, save_clicked: 0 });
      }
      const day = dailyMap.get(date)!;
      switch (e.type) {
        case "affinity_date_entered": day.date_entered++; break;
        case "affinity_result_viewed": day.result_viewed++; break;
        case "affinity_shared": day.shared++; break;
        case "affinity_profile_cta_clicked": day.profile_cta++; break;
        case "affinity_recommendation_clicked": day.recommendation_clicked++; break;
        case "affinity_save_clicked": day.save_clicked++; break;
      }
    });

    const daily = Array.from(dailyMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, counts]) => ({ date, counts }));

    const base = counts.result_viewed || 1;
    const ratios = {
      save_rate: counts.save_clicked / base,
      share_rate: counts.shared / base,
      profile_rate: counts.profile_cta / base,
      recommendation_rate: counts.recommendation_clicked / base,
    };

    const uniqueUsers = new Map<string, Set<string>>();
    affinityEvents.forEach(e => {
      if (!uniqueUsers.has(e.type)) uniqueUsers.set(e.type, new Set());
      if (e.userId) uniqueUsers.get(e.type)!.add(e.userId);
    });

    const userCounts = {
      date_entered: uniqueUsers.get("affinity_date_entered")?.size || 0,
      result_viewed: uniqueUsers.get("affinity_result_viewed")?.size || 0,
      shared: uniqueUsers.get("affinity_shared")?.size || 0,
      profile_cta: uniqueUsers.get("affinity_profile_cta_clicked")?.size || 0,
      recommendation_clicked: uniqueUsers.get("affinity_recommendation_clicked")?.size || 0,
      save_clicked: uniqueUsers.get("affinity_save_clicked")?.size || 0,
    };

    return { counts, daily, ratios, userCounts, totalEvents: affinityEvents.length };
  }, [loaded]);

  const { counts, daily, ratios, userCounts, totalEvents } = analyticsData || {
    counts: { date_entered: 0, result_viewed: 0, shared: 0, profile_cta: 0, recommendation_clicked: 0, save_clicked: 0 },
    daily: [],
    ratios: { save_rate: 0, share_rate: 0, profile_rate: 0, recommendation_rate: 0 },
    userCounts: { date_entered: 0, result_viewed: 0, shared: 0, profile_cta: 0, recommendation_clicked: 0, save_clicked: 0 },
    totalEvents: 0,
  };
  const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {!loaded || !analyticsData ? (
          <motion.div
            key="loading"
            variants={transitionVariants}
            initial="enter"
            animate="show"
            exit="exit"
          >
            <div className="mx-auto max-w-content px-4 sm:px-6 pt-12 sm:pt-20 pb-24">
              <p className="sr-only" role="status" aria-label="Cargando datos de Affinity...">
                Cargando datos de Affinity...
              </p>
              <div className="animate-pulse">
                <div className="h-3 bg-[var(--skeleton)] rounded w-8rem mb-6" />
                <div className="h-9 bg-[var(--skeleton)] rounded w-1/2 mb-2" />
                <div className="h-4 bg-[var(--skeleton)] rounded w-1/3 mb-8" />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-28 bg-[var(--skeleton)] rounded-md border border-ink/10" />
                  ))}
                </div>
                <div className="h-6 bg-[var(--skeleton)] rounded w-3/4 mb-4" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-24 bg-[var(--skeleton)] rounded-md border border-ink/10" />
                  ))}
                </div>
                <div className="h-6 bg-[var(--skeleton)] rounded w-3/4 mb-4" />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-28 bg-[var(--skeleton)] rounded-md border border-ink/10" />
                  ))}
                </div>
                {daily.length > 0 && (
                  <div className="h-80 bg-[var(--skeleton)] rounded-md border border-ink/10 mb-12" />
                )}
              </div>
              <UniversityFooter />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            variants={transitionVariants}
            initial="enter"
            animate="show"
            exit="exit"
          >
            <main className="mx-auto max-w-content px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">

              <div className="mb-8">
                <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium mb-4">Analytics</p>
                <h1 className="font-heading text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-2">
                  Affinity Experiment
                </h1>
                <p className="text-sm text-muted">
                  P4-A: {totalEvents} eventos de Affinity en total.
                </p>
              </div>

              {/* Event counts */}
              <section className="mb-12">
                <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-6">Conteo por evento</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {([
                    ["date_entered", counts.date_entered],
                    ["result_viewed", counts.result_viewed],
                    ["shared", counts.shared],
                    ["profile_cta", counts.profile_cta],
                    ["recommendation_clicked", counts.recommendation_clicked],
                    ["save_clicked", counts.save_clicked],
                  ] as const).map(([key, value], i) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                      className="p-4 rounded-md border border-border bg-card shadow-sm text-center"
                    >
                      <div className="font-heading text-2xl font-bold text-foreground">{value}</div>
                      <div className="text-xs text-muted mt-1 uppercase tracking-wider">
                        {EVENT_LABELS[
                          key === "profile_cta" ? "affinity_profile_cta_clicked"
                          : key === "recommendation_clicked" ? "affinity_recommendation_clicked"
                          : key === "date_entered" ? "affinity_date_entered"
                          : key === "result_viewed" ? "affinity_result_viewed"
                          : key === "shared" ? "affinity_shared"
                          : "affinity_save_clicked"
                        ]}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Ratios */}
              <section className="mb-12">
                <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-6">Ratios (base: resultado visto)</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <RatioCard label="Save rate" value={pct(ratios.save_rate)} desc={`${counts.save_clicked} / ${counts.result_viewed}`} />
                  <RatioCard label="Share rate" value={pct(ratios.share_rate)} desc={`${counts.shared} / ${counts.result_viewed}`} />
                  <RatioCard label="Profile CTA rate" value={pct(ratios.profile_rate)} desc={`${counts.profile_cta} / ${counts.result_viewed}`} />
                  <RatioCard label="Recommendation rate" value={pct(ratios.recommendation_rate)} desc={`${counts.recommendation_clicked} / ${counts.result_viewed}`} />
                </div>
              </section>

              {/* Unique users */}
              <section className="mb-12">
                <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-6">Usuarios únicos por evento</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {([
                    ["date_entered", userCounts.date_entered],
                    ["result_viewed", userCounts.result_viewed],
                    ["shared", userCounts.shared],
                    ["profile_cta", userCounts.profile_cta],
                    ["recommendation_clicked", userCounts.recommendation_clicked],
                    ["save_clicked", userCounts.save_clicked],
                  ] as const).map(([key, value], i) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                      className="p-4 rounded-md border border-border bg-card shadow-sm text-center"
                    >
                      <div className="font-heading text-2xl font-bold text-foreground">{value}</div>
                      <div className="text-xs text-muted mt-1 uppercase tracking-wider">usuarios</div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Daily evolution */}
              {daily.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-6">Evolución diaria</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 text-muted font-medium">Fecha</th>
                          <th className="text-right py-2 text-muted font-medium">Ingresados</th>
                          <th className="text-right py-2 text-muted font-medium">Vistos</th>
                          <th className="text-right py-2 text-muted font-medium">Guardados</th>
                          <th className="text-right py-2 text-muted font-medium">Compartidos</th>
                          <th className="text-right py-2 text-muted font-medium">Recomendados</th>
                          <th className="text-right py-2 text-muted font-medium">Perfil CTA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {daily.map(({ date, counts: c }) => (
                          <tr key={date} className="border-b border-border/50">
                            <td className="py-2 text-foreground font-medium">{date}</td>
                            <td className="py-2 text-right text-muted">{c.date_entered}</td>
                            <td className="py-2 text-right text-muted">{c.result_viewed}</td>
                            <td className="py-2 text-right text-accent font-medium">{c.save_clicked}</td>
                            <td className="py-2 text-right text-muted">{c.shared}</td>
                            <td className="py-2 text-right text-muted">{c.recommendation_clicked}</td>
                            <td className="py-2 text-right text-muted">{c.profile_cta}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* Back */}
              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => router.push("/analytics")}
                  className="text-sm text-muted hover:text-accent transition-colors"
                >
                  ← Volver a analytics
                </button>
              </div>

            </main>
            <UniversityFooter />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RatioCard({ label, value, desc }: { label: string; value: string; desc: string }) {
  return (
    <div className="p-4 rounded-md border border-border bg-card shadow-sm text-center">
      <div className="font-heading text-2xl font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted mt-1 uppercase tracking-wider">{label}</div>
      <div className="text-xs text-muted mt-0.5">{desc}</div>
    </div>
  );
}
