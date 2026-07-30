"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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

    // Count by event type
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

    // Daily evolution
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

    // Ratios
    const base = counts.result_viewed || 1;
    const ratios = {
      save_rate: counts.save_clicked / base,
      share_rate: counts.shared / base,
      profile_rate: counts.profile_cta / base,
      recommendation_rate: counts.recommendation_clicked / base,
    };

    // Unique users per event
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

  if (!loaded || !analyticsData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-content px-4 sm:px-6 py-24 text-center">
          <p className="text-muted">Cargando datos de Affinity...</p>
        </div>
        <UniversityFooter />
      </div>
    );
  }

  const { counts, daily, ratios, userCounts, totalEvents } = analyticsData;
  const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-content px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">

        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-medium mb-4">Analytics</p>
          <h1 className="font-heading text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-2">
            Affinity Experiment
          </h1>
          <p className="text-sm text-muted">
            P4-A: {totalEvents} eventos de Affinity en total.
          </p>
        </div>

        {/* Event counts */}
        <section className="mb-12">
          <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium mb-5">Conteo por evento</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {([
              ["date_entered", counts.date_entered],
              ["result_viewed", counts.result_viewed],
              ["shared", counts.shared],
              ["profile_cta", counts.profile_cta],
              ["recommendation_clicked", counts.recommendation_clicked],
              ["save_clicked", counts.save_clicked],
            ] as const).map(([key, value]) => (
              <div key={key} className="p-4 rounded-none border border-border bg-card text-center">
                <div className="font-heading text-2xl font-bold text-foreground">{value}</div>
                <div className="text-[10px] text-muted mt-1 uppercase tracking-wider">{EVENT_LABELS[`affinity_${key === "profile_cta" ? "profile_cta_clicked" : key === "date_entered" ? "date_entered" : key === "result_viewed" ? "result_viewed" : key === "shared" ? "shared" : key === "recommendation_clicked" ? "recommendation_clicked" : "save_clicked"}` as EventType]}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Ratios */}
        <section className="mb-12">
          <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium mb-5">Ratios (base: resultado visto)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <RatioCard label="Save rate" value={pct(ratios.save_rate)} desc={`${counts.save_clicked} / ${counts.result_viewed}`} />
            <RatioCard label="Share rate" value={pct(ratios.share_rate)} desc={`${counts.shared} / ${counts.result_viewed}`} />
            <RatioCard label="Profile CTA rate" value={pct(ratios.profile_rate)} desc={`${counts.profile_cta} / ${counts.result_viewed}`} />
            <RatioCard label="Recommendation rate" value={pct(ratios.recommendation_rate)} desc={`${counts.recommendation_clicked} / ${counts.result_viewed}`} />
          </div>
        </section>

        {/* Unique users */}
        <section className="mb-12">
          <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium mb-5">Usuarios únicos por evento</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {([
              ["date_entered", userCounts.date_entered],
              ["result_viewed", userCounts.result_viewed],
              ["shared", userCounts.shared],
              ["profile_cta", userCounts.profile_cta],
              ["recommendation_clicked", userCounts.recommendation_clicked],
              ["save_clicked", userCounts.save_clicked],
            ] as const).map(([key, value]) => (
              <div key={key} className="p-4 rounded-none border border-border bg-card text-center">
                <div className="font-heading text-2xl font-bold text-foreground">{value}</div>
                <div className="text-[10px] text-muted mt-1 uppercase tracking-wider">usuarios</div>
              </div>
            ))}
          </div>
        </section>

        {/* Daily evolution */}
        {daily.length > 0 && (
          <section className="mb-12">
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium mb-5">Evolución diaria</h2>
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
    </div>
  );
}

function RatioCard({ label, value, desc }: { label: string; value: string; desc: string }) {
  return (
    <div className="p-4 rounded-none border border-border bg-card text-center">
      <div className="font-heading text-2xl font-bold text-foreground">{value}</div>
      <div className="text-[10px] text-muted mt-1 uppercase tracking-wider">{label}</div>
      <div className="text-[10px] text-muted mt-0.5">{desc}</div>
    </div>
  );
}
