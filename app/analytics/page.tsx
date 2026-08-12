"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { analytics } from "@/lib/analytics/analytics";
import Button from "@/components/ui/Button";

const transitionVariants = {
  enter: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } },
};

export default function AnalyticsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<ReturnType<typeof analytics.getStats> | null>(null);

  useEffect(() => {
    setStats(analytics.getStats());
  }, []);

  const cards = [
    { label: "Eventos totales", value: stats?.totalEvents, icon: "📊" },
    { label: "Visitas de página", value: stats?.pageViews, icon: "👁️" },
    { label: "Visitas de retorno", value: stats?.returnVisits, icon: "🔄" },
    { label: "Perfiles creados", value: stats?.profileCreated, icon: "👤" },
    { label: "Consultas a IA", value: stats?.aiQueries, icon: "🤖" },
    { label: "Decisiones tomadas", value: stats?.decisions, icon: "🎯" },
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
              <p className="sr-only" role="status" aria-label="Cargando estadísticas...">
                Cargando estadísticas...
              </p>
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
                <h1 className="text-4xl font-heading text-foreground mb-2">
                  Panel de análisis
                </h1>
                <p className="text-muted mb-8">
                  Tu actividad en Molino hasta ahora
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                  {cards.map((card) => (
                    <motion.div
                      key={card.label}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: cards.indexOf(card) * 0.04 }}
                      className="bg-card rounded-md border border-card-border p-4 text-center"
                    >
                      <div className="text-2xl mb-1">{card.icon}</div>
                      <div className="text-2xl font-heading text-foreground">
                        {card.value}
                      </div>
                      <div className="text-xs text-muted mt-1">
                        {card.label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {featureEntries.length > 0 && (
                  <div className="bg-card rounded-md border border-card-border p-6">
                    <h2 className="text-lg font-heading text-foreground mb-4">
                      Características más usadas
                    </h2>
                    <div className="space-y-2">
                      {featureEntries
                        .sort((a, b) => (b[1] as number) - (a[1] as number))
                        .map(([feature, count]) => (
                          <div
                            key={feature}
                            className="flex items-center justify-between py-2 border-b border-border last:border-0"
                          >
                            <span className="text-foreground capitalize">
                              {feature.replace(/-/g, " ")}
                            </span>
                            <span className="text-sm font-medium text-accent">
                              {count} veces
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 flex gap-4">
                  <Button variant="secondary" onClick={() => router.push("/analytics/affinity")}>
                    Dashboard Affinity →
                  </Button>
                  <Button variant="secondary" onClick={() => router.back()}>
                    Volver
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (typeof window !== "undefined" && window.confirm("¿Estás seguro de que querés borrar todos los datos de analytics?")) {
                        analytics.clearEvents();
                        setStats(analytics.getStats());
                      }
                    }}
                  >
                    Borrar datos
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
