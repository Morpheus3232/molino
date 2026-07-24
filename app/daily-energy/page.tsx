"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/hooks/useProfile";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import MolinoInterpretation from "@/components/ui/MolinoInterpretation";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import LoadingState from "@/components/ui/LoadingState";
import Link from "next/link";

export default function DailyEnergyPage() {
  const router = useRouter();
  const { profile, mounted, loading } = useProfile({ redirectIfNotFound: false });

  const energy = useMemo(() => {
    if (!profile) return null;
    return calculateDailyEnergy(profile, new Date());
  }, [profile]);

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-background">
        <UniversityHeader />
        <LoadingState message="Calculando tu energía diaria..." />
        <UniversityFooter />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <UniversityHeader />
        <div className="mx-auto max-w-content px-4 sm:px-6 py-24 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-medium mb-4">Energía Diaria</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">
            Tu energía de hoy
          </h1>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Para ver tu energía diaria, primero necesitás crear tu perfil personal.
          </p>
          <Button size="lg" onClick={() => router.push("/")}>
            Crear mi perfil
          </Button>
        </div>
        <UniversityFooter />
      </div>
    );
  }

  if (!energy) return null;

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600";
    if (score >= 55) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 75) return "bg-green-50";
    if (score >= 55) return "bg-blue-50";
    if (score >= 40) return "bg-yellow-50";
    return "bg-red-50";
  };

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />

      <main className="mx-auto max-w-content px-4 sm:px-6 py-8 pb-24" id="main-content">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
          <span>›</span>
          <span className="text-foreground font-medium">Energía Diaria</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-medium mb-2">Energía Diaria</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h1>
          <p className="text-sm text-muted mt-2">
            {profile.name} · Camino de Vida {profile.lifePath} · {profile.sunSign}
          </p>
        </div>

        {/* Energy Score */}
        <div className="mb-8 p-6 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium">Energía del día</p>
              <p className="text-4xl font-serif font-bold" style={{ color: energy.overallScore >= 75 ? "var(--score-excellent)" : energy.overallScore >= 55 ? "var(--score-good)" : energy.overallScore >= 40 ? "var(--score-neutral)" : "var(--score-poor)" }}>
                {energy.overallScore}/100
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-serif font-semibold text-foreground">{energy.theme}</p>
              <p className="text-sm text-muted">Día personal: {energy.personalDay}</p>
            </div>
          </div>
          <p className="text-sm text-muted leading-relaxed">{energy.description}</p>
        </div>

        {/* Moon Phase */}
        <div className="mb-8 p-4 rounded-xl border border-border bg-card flex items-center gap-4">
          <span className="text-3xl">{energy.moonPhase.emoji}</span>
          <div>
            <p className="text-sm font-medium text-foreground">Luna {energy.moonPhase.phase}</p>
            <p className="text-xs text-muted">{energy.moonPhase.description}</p>
          </div>
        </div>

        {/* Strengths and Cautions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-3">Fortalezas</p>
            <ul className="space-y-2">
              {energy.strengths.map((s, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Precauciones</p>
            <ul className="space-y-2">
              {energy.cautions.map((c, i) => (
                <li key={i} className="text-sm text-muted flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-border mt-1.5 shrink-0" aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Area Scores */}
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-4">Áreas relevantes</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(energy.areas).map(([key, area]) => (
              <div key={key} className={`p-4 rounded-xl border border-border ${getScoreBg(area.score)}`}>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-1 capitalize">
                  {key === 'work' ? 'Trabajo' : key === 'relationships' ? 'Relaciones' : key === 'creativity' ? 'Creatividad' : 'Decisiones'}
                </p>
                <p className={`text-lg font-semibold ${getScoreColor(area.score)}`}>{area.score}%</p>
                <p className="text-xs text-muted mt-1">{area.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Explanation */}
        <div className="mb-8 p-5 rounded-xl border border-border bg-card">
          <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-3">Interpretación</p>
          <p className="text-sm text-muted leading-relaxed">{energy.explanation}</p>
        </div>

        {/* Element Influence */}
        <div className="mb-8 p-4 rounded-xl border border-border bg-card">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Influencia de tu elemento</p>
          <p className="text-sm text-foreground">{energy.elementInfluence}</p>
        </div>

        {/* AI Interpretation */}
        <div className="mb-8">
          <MolinoInterpretation
            profile={profile}
            type="daily_energy"
            dailyEnergy={energy}
            label="Interpretación de Molino"
            description="Análisis personalizado de tu energía del día"
          />
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="secondary" fullWidth onClick={() => router.push("/timing")}>
            Explorar fechas
          </Button>
          <Button variant="secondary" fullWidth onClick={() => router.push("/decisions")}>
            Tomar una decisión
          </Button>
          <Button variant="secondary" fullWidth onClick={() => router.push("/profile")}>
            Ver mi perfil
          </Button>
        </div>
      </main>

      <UniversityFooter />
    </div>
  );
}
