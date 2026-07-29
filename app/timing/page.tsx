"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/hooks/useProfile";
import { analyzeTiming, findBestDates, type TimingIntention, INTENTION_LABELS } from "@/lib/engines/timingEngine";
import MolinoInterpretation from "@/components/ui/MolinoInterpretation";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import LoadingState from "@/components/ui/LoadingState";
import Link from "next/link";

const INTENTIONS: { id: TimingIntention; label: string; icon: string }[] = [
  { id: "start_project", label: "Iniciar un proyecto", icon: "🚀" },
  { id: "change_job", label: "Cambiar de trabajo", icon: "💼" },
  { id: "launch_something", label: "Lanzar algo", icon: "🎯" },
  { id: "sign_agreement", label: "Firmar un acuerdo", icon: "📝" },
  { id: "make_decision", label: "Tomar una decisión", icon: "⚡" },
  { id: "start_relationship", label: "Empezar una relación", icon: "💕" },
  { id: "publish_something", label: "Publicar algo", icon: "📤" },
  { id: "other", label: "Otro", icon: "✨" },
];

export default function TimingPage() {
  const router = useRouter();
  const { profile, mounted, loading } = useProfile({ redirectIfNotFound: false });

  const [selectedIntention, setSelectedIntention] = useState<TimingIntention | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });
  const [showResults, setShowResults] = useState(false);

  const result = useMemo(() => {
    if (!profile || !selectedIntention) return null;
    const date = new Date(selectedDate + 'T12:00:00');
    return analyzeTiming(profile, date, selectedIntention);
  }, [profile, selectedIntention, selectedDate]);

  const bestDates = useMemo(() => {
    if (!profile || !selectedIntention) return [];
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 14);
    return findBestDates(profile, start, end, selectedIntention, 3);
  }, [profile, selectedIntention]);

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-background">
        <LoadingState message="Cargando timing..." />
        <UniversityFooter />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-content px-4 sm:px-6 py-24 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-medium mb-4">Tu momento</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">
            Tu momento personal
          </h1>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Para explorar el timing personalizado, primero necesitás crear tu perfil.
          </p>
          <Button size="lg" onClick={() => router.push("/")}>
            Crear mi perfil
          </Button>
        </div>
        <UniversityFooter />
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600";
    if (score >= 55) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-content px-4 sm:px-6 py-8 pb-24" id="main-content">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
          <span>›</span>
          <span className="text-foreground font-medium">Tu momento</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-medium mb-2">Tu timing personal</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            ¿Qué querés hacer?
          </h1>
          <p className="text-sm text-muted mt-2">
            Seleccioná una intención y analizá el mejor momento para actuar.
          </p>
        </div>

        {/* Intention Selection */}
        {!selectedIntention && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {INTENTIONS.map((intention) => (
              <button
                key={intention.id}
                onClick={() => setSelectedIntention(intention.id)}
                className="p-4 rounded-xl border border-border bg-card hover:border-accent transition-all text-left"
              >
                <span className="text-2xl mb-2 block">{intention.icon}</span>
                <p className="text-sm font-medium text-foreground">{intention.label}</p>
              </button>
            ))}
          </div>
        )}

        {/* Date Selection and Results */}
        {selectedIntention && (
          <>
            <div className="mb-8 p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-foreground">
                  {INTENTION_LABELS[selectedIntention]}
                </p>
                <button
                  onClick={() => { setSelectedIntention(null); setShowResults(false); }}
                  className="text-xs text-muted hover:text-foreground transition-colors"
                >
                  Cambiar intención
                </button>
              </div>
              <div className="flex items-center gap-4">
                <label htmlFor="target-date" className="text-sm text-muted">Fecha:</label>
                <input
                  id="target-date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => { setSelectedDate(e.target.value); setShowResults(true); }}
                  className="input max-w-xs"
                />
              </div>
            </div>

            {/* Results */}
            {result && showResults && (
              <div className="space-y-6">
                {/* Timing Score */}
                <div className="p-6 rounded-2xl border border-border bg-card">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium">Puntuación de timing</p>
                      <p className={`text-4xl font-serif font-bold ${getScoreColor(result.timingScore)}`}>
                        {result.timingScore}/100
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted">Día personal: {result.personalDay}</p>
                      <p className="text-sm text-muted">Luna {result.moonPhase}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">{result.explanation}</p>
                </div>

                {/* Favorable Dimensions */}
                {result.favorableDimensions.length > 0 && (
                  <div className="p-5 rounded-xl border border-border bg-card">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-3">Dimensiones favorables</p>
                    <ul className="space-y-2">
                      {result.favorableDimensions.map((dim, i) => (
                        <li key={i} className="text-sm text-foreground flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" aria-hidden="true" />
                          {dim}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Challenging Dimensions */}
                {result.challengingDimensions.length > 0 && (
                  <div className="p-5 rounded-xl border border-border bg-card">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Dimensiones desafiantes</p>
                    <ul className="space-y-2">
                      {result.challengingDimensions.map((dim, i) => (
                        <li key={i} className="text-sm text-muted flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-border mt-1.5 shrink-0" aria-hidden="true" />
                          {dim}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommended Window */}
                <div className="p-5 rounded-xl border border-border bg-card">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-2">Recomendación</p>
                  <p className="text-sm text-foreground leading-relaxed">{result.recommendedWindow}</p>
                </div>

                {/* Caveats */}
                <div className="p-4 rounded-xl border border-border bg-card">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Aclaraciones</p>
                  <ul className="space-y-1">
                    {result.caveats.map((caveat, i) => (
                      <li key={i} className="text-xs text-muted">• {caveat}</li>
                    ))}
                  </ul>
                </div>

                {/* AI Interpretation */}
                <MolinoInterpretation
                  profile={profile}
                  type="timing"
                  timing={result}
                  label="Interpretación de Molino"
                  description="Análisis personalizado de tu timing"
                />
              </div>
            )}

            {/* Best Dates */}
            {bestDates.length > 0 && (
              <div className="mt-8">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-4">Mejores fechas (próximos 14 días)</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {bestDates.map((date, i) => (
                    <div key={i} className="p-4 rounded-xl border border-border bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-foreground">
                          {new Date(date.date + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </p>
                        <span className={`text-sm font-semibold ${getScoreColor(date.timingScore)}`}>
                          {date.timingScore}%
                        </span>
                      </div>
                      <p className="text-xs text-muted">{date.theme}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button variant="secondary" fullWidth onClick={() => router.push("/daily-energy")}>
                Ver energía de hoy
              </Button>
              <Button variant="secondary" fullWidth onClick={() => router.push("/profile")}>
                Ver mi perfil
              </Button>
            </div>
          </>
        )}
      </main>

      <UniversityFooter />
    </div>
  );
}
