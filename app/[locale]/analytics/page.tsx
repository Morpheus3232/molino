"use client";
import { useL } from "@/lib/i18n/useL";

import { useEffect, useState } from "react";
import { useRouter } from "@/lib/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { analytics } from "@/lib/analytics/analytics";
import Button from "@/components/ui/Button";

const transitionVariants = {
  enter: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } },
};

export default function AnalyticsPage() {
  const L = useL();
  const router = useRouter();
  const [stats, setStats] = useState<ReturnType<typeof analytics.getStats> | null>(null);

  useEffect(() => {
    setStats(analytics.getStats());
  }, []);

  const cards = [
    { label: L("Eventos totales", "Total events"), value: stats?.totalEvents, icon: "📊" },
    { label: L("Visitas de página", "Page views"), value: stats?.pageViews, icon: "👁" },
    { label: L("Visitas de retorno", "Return visits"), value: stats?.returnVisits, icon: "🔄" },
    { label: L("Perfiles creados", "Profiles created"), value: stats?.profileCreated, icon: "👤" },
    { label: L("Consultas a IA", "AI queries"), value: stats?.aiQueries, icon: "🤖" },
    { label: L("Decisiones tomadas", "Decisions made"), value: stats?.decisions, icon: "🎯" },
  ];

  const featureEntries = Object.entries(stats?.features || {}) as [string, number][];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <AnimatePresence mode="wait">
        {!stats ? (
          <motion.div
            key="loading"
            variants={transitionVariants}
            initial="enter"
            animate="show"
            exit="exit"
          >
            <div className="container-content py-12">
              <p className="sr-only" role="status" aria-label="Cargando estadísticas...">{L("Cargando estadísticas...", "Loading statistics...")}</p>
              <div className="animate-pulse">
                <div className="h-3 bg-[var(--skeleton)] rounded w-12rem mb-6" />
                <div className="h-10 bg-[var(--skeleton)] rounded w-3/4 mb-2" />
                <div className="h-4 bg-[var(--skeleton)] rounded w-1/2 mb-8" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-32 bg-[var(--skeleton)] rounded-md border border-ink/10" />
                  ))}
                </div>
                <div className="h-6 bg-[var(--skeleton)] rounded w-3/4 mb-4" />
                <div className="h-48 bg-[var(--skeleton)] rounded-md border border-ink/10" />
              </div>
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
            <div className="container-content">
              <div className="py-12">
                <h1 className="page-title text-foreground mb-2">{L("Panel de análisis", "Analytics panel")}</h1>
                <p className="text-muted mb-8">{L("Tu actividad en Molino hasta ahora", "Your activity on Molino so far")}</p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                  {cards.map((card) => (
                    <motion.div
                      key={card.label}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: cards.indexOf(card) * 0.04 }}
                      className="bg-card rounded-md border border-card-border p-4 text-center"
                    >
                      <div className="text-2xl mb-1">{L.t(card.icon)}</div>
                      <div className="text-2xl font-heading text-foreground">
                        {L.t(card.value)}
                      </div>
                      <div className="text-xs text-muted mt-1">
                        {L.t(card.label)}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {featureEntries.length > 0 && (
                  <div className="bg-card rounded-md border border-card-border p-6">
                    <h2 className="text-lg font-heading text-foreground mb-4">{L("Características más usadas", "Most-used features")}</h2>
                    <div className="space-y-2">
                      {featureEntries
                        .sort((a, b) => (b[1] as number) - (a[1] as number))
                        .map(([feature, count]) => (
                          <div
                            key={feature}
                            className="flex items-center justify-between py-2 border-b border-border last:border-0"
                          >{L(<>
                            <span className="text-foreground capitalize">
                              {L.t(feature.replace(/-/g, " "))}
                            </span>
                            <span className="text-sm font-medium text-accent">
                              {count} veces
                            </span>
                          </>, <><span className="text-foreground capitalize">{L.t(feature.replace(/-/g, " "))}</span><span className="text-sm font-medium text-accent">{count} times</span></>)}</div>
                        ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 flex gap-4">
                  <Button variant="secondary" onClick={() => router.push("/analytics/affinity")}>
                    Dashboard Affinity →
                  </Button>
                  <Button variant="secondary" onClick={() => router.back()}>{L("Volver", "Back")}</Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (typeof window !== "undefined" && window.confirm("¿Estás seguro de que querés borrar todos los datos de analytics?")) {
                        analytics.clearEvents();
                        setStats(analytics.getStats());
                      }
                    }}
                  >{L("Borrar datos", "Delete data")}</Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
