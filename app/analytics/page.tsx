"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UniversityFooter from "@/components/layout/UniversityFooter";

import { analytics } from "@/lib/analytics/analytics";
import Button from "@/components/ui/Button";

export default function AnalyticsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    setStats(analytics.getStats());
  }, []);

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted">Cargando estadísticas...</p>
      </div>
    );
  }

  const cards = [
    { label: "Eventos totales", value: stats.totalEvents, icon: "📊" },
    { label: "Visitas de página", value: stats.pageViews, icon: "👁️" },
    { label: "Perfiles creados", value: stats.profileCreated, icon: "👤" },
    { label: "Consultas a IA", value: stats.aiQueries, icon: "🤖" },
    { label: "Decisiones tomadas", value: stats.decisions, icon: "🎯" },
  ];

  const featureEntries = Object.entries(stats.features || {}) as [string, number][];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container-content">
        <div className="py-12">
          <h1 className="text-4xl font-serif text-foreground mb-2">
            Panel de análisis
          </h1>
          <p className="text-muted mb-8">
            Tu actividad en Molino hasta ahora
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {cards.map((card) => (
              <div
                key={card.label}
                className="bg-card rounded-2xl border border-card-border p-4 text-center"
              >
                <div className="text-2xl mb-1">{card.icon}</div>
                <div className="text-2xl font-serif text-foreground">
                  {card.value}
                </div>
                <div className="text-xs text-muted mt-1">
                  {card.label}
                </div>
              </div>
            ))}
          </div>

          {featureEntries.length > 0 && (
            <div className="bg-card rounded-2xl border border-card-border p-6">
              <h2 className="text-lg font-serif text-foreground mb-4">
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
                if (typeof window !== "undefined" && window.confirm("¿Estás seguro de que quieres borrar todos los datos de analytics?")) {
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
      <UniversityFooter />
    </div>
  );
}
