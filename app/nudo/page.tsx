"use client";

import { useState, useMemo, useEffect } from "react";
import { useProfile } from "@/lib/hooks/useProfile";
import { detectarNudo, type NudoInput, type NudoContext } from "@/lib/engines/nudoEngine";
import { CATEGORY_LABELS, type DecisionCategory } from "@/lib/engines/decisionsEngine";
import { INTENTION_LABELS, type TimingIntention } from "@/lib/engines/timingEngine";
import { analytics } from "@/lib/analytics/analytics";
import Button from "@/components/ui/Button";
import Link from "next/link";

const CONTEXTS: { value: NudoContext; label: string; description: string }[] = [
  { value: "decision", label: "Decisión", description: "¿Cambio de trabajo? ¿Me mudo? ¿Invierto?" },
  { value: "timing", label: "Momento", description: "¿Es buen momento para lanzar/empezar/terminar?" },
  { value: "daily_energy", label: "Energía", description: "¿Cómo está mi energía hoy/esta semana?" },
  { value: "compatibility", label: "Compatibilidad", description: "Con datos de muestra — todavía no elegís la otra persona" },
  { value: "free_text", label: "Texto libre", description: "Explorar sin pregunta específica" },
];

const TODAY = new Date().toISOString().slice(0, 10);

const COMPATIBILITY_SAMPLE_TARGET = { lifePath: 4, sunSign: "Tauro", chineseZodiac: "Buey", archetype: "El Constructor", element: "Tierra" };

export default function NudoPage() {
  const { profile, mounted, loading } = useProfile({ redirectIfNotFound: false });
  const [selectedContext, setSelectedContext] = useState<NudoContext>("decision");
  const [submitted, setSubmitted] = useState(false);

  // Input real por contexto — decision/timing/daily_energy leen esto en vez
  // de un fixture fijo. compatibility no tiene selector de otra persona
  // todavía, así que sigue usando una muestra (ver nota en el contexto).
  const [decisionQuestion, setDecisionQuestion] = useState("");
  const [decisionCategory, setDecisionCategory] = useState<DecisionCategory>("career");
  const [timingDate, setTimingDate] = useState(TODAY);
  const [timingIntention, setTimingIntention] = useState<TimingIntention>("start_project");
  const [energyDate, setEnergyDate] = useState(TODAY);

  const canDetect =
    selectedContext !== "decision" || decisionQuestion.trim().length > 0;

  const buildPayload = (): unknown => {
    switch (selectedContext) {
      case "decision":
        return { question: decisionQuestion.trim(), category: decisionCategory };
      case "timing":
        return { targetDate: new Date(`${timingDate}T00:00:00`), intention: timingIntention };
      case "daily_energy":
        return { targetDate: new Date(`${energyDate}T00:00:00`) };
      case "compatibility":
        return { target: COMPATIBILITY_SAMPLE_TARGET };
      case "free_text":
      default:
        return {};
    }
  };

  const nudoResult = useMemo(() => {
    if (!submitted || !profile) return null;
    const input: NudoInput = {
      profile,
      context: selectedContext,
      payload: buildPayload(),
    };
    return detectarNudo(input);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted, profile, selectedContext]);

  const handleDetect = () => {
    if (!profile || !canDetect) return;
    setSubmitted(true);
    analytics.trackFeatureUsed("nudo_detect");
  };

  useEffect(() => {
    if (!nudoResult) return;
    analytics.track({ type: "cognitive_lift", data: { hasRealTension: nudoResult.trace.hasRealTension } });
  }, [nudoResult]);

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-24" id="main-content">
          <div className="animate-pulse">
            <div className="h-3 bg-[var(--skeleton)] rounded w-10rem mb-6" />
            <div className="h-10 bg-[var(--skeleton)] rounded w-3/4 mb-4" />
            <div className="h-4 bg-[var(--skeleton)] rounded w-1/2 mb-12" />
          </div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 py-24 text-center" id="main-content">
          <h1 className="font-display text-5xl sm:text-6xl tracking-tight text-foreground mb-4">
            Tu brújula personal
          </h1>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Primero necesitás crear tu perfil personal para detectar nudos.
          </p>
          <Button variant="primary" size="lg" onClick={() => window.location.href = "/onboarding"}>
            Crear mi perfil
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-24" id="main-content">
        <nav className="flex items-center gap-2 text-xs text-muted mb-6" aria-label="Breadcrumb">
          <Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors">Inicio</Link>
          <span>›</span>
          <span className="text-foreground font-medium">Detectar un Nudo</span>
        </nav>

        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[0.9] tracking-tight mb-6">
          Detectar un Nudo
        </h1>

        <p className="text-muted max-w-2xl mb-8 leading-relaxed">
          Un Nudo aparece cuando dos fuerzas importantes chocan entre sí.
        </p>

        {nudoResult ? (
          <>
            <div className="border border-ink/10 p-8 lg:p-12 mb-8">
              <div className="space-y-6 max-w-2xl">
                {nudoResult.trace.hasRealTension ? (
                  <>
                    <div>
                      <p className="label-micro text-accent mb-2">FUERZA A</p>
                      <p className="text-lg text-foreground leading-relaxed">{nudoResult.fuerzaA}</p>
                    </div>
                    <div className="border-t border-ink/10 pt-6">
                      <p className="label-micro text-accent mb-2">FUERZA B</p>
                      <p className="text-lg text-foreground leading-relaxed">{nudoResult.fuerzaB}</p>
                    </div>
                    <div className="border-t border-ink/10 pt-6">
                      <p className="label-micro text-accent mb-2">TENSIÓN</p>
                      <p className="text-lg text-foreground leading-relaxed">{nudoResult.tension}</p>
                    </div>
                    <div className="border-t border-ink/10 pt-6">
                      <p className="label-micro text-accent mb-2">PREGUNTA LLAVE</p>
                      <p className="text-lg font-medium text-foreground leading-relaxed">{nudoResult.preguntaLlave}</p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted text-lg">
                      No encontramos un Nudo real con las señales disponibles.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="border border-ink/10 p-6 mb-8">
              <p className="label-micro mb-2">Trazabilidad</p>
              <ul className="text-sm text-muted space-y-1">
                <li>Fuentes: {nudoResult.trace.sources.length > 0 ? nudoResult.trace.sources.join(", ") : "Ninguna"}</li>
                <li>Tensión real: {nudoResult.trace.hasRealTension ? "Sí" : "No"}</li>
              </ul>
            </div>

            <Button variant="secondary" fullWidth onClick={() => setSubmitted(false)}>
              Detectar otro Nudo
            </Button>
          </>
        ) : (
          <div className="space-y-6 max-w-md">
            <div>
              <label className="label-micro block mb-3">Contexto</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CONTEXTS.map((ctx) => (
                  <button
                    key={ctx.value}
                    type="button"
                    onClick={() => setSelectedContext(ctx.value)}
                    className={`p-4 text-left border rounded-lg transition-colors ${
                      selectedContext === ctx.value
                        ? "border-accent bg-accent/5 text-foreground"
                        : "border-ink/10 hover:border-ink/20"
                    }`}
                  >
                    <p className="font-medium text-sm">{ctx.label}</p>
                    <p className="text-xs text-muted mt-1">{ctx.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {selectedContext === "decision" && (
              <div className="space-y-3">
                <div>
                  <label htmlFor="nudo-question" className="label-micro block mb-2">Tu pregunta</label>
                  <textarea
                    id="nudo-question"
                    value={decisionQuestion}
                    onChange={(e) => setDecisionQuestion(e.target.value)}
                    placeholder="Ej: ¿Cambio de trabajo?"
                    rows={2}
                    className="w-full px-4 py-3 border border-ink/10 bg-background text-foreground text-sm placeholder:text-muted focus:outline-none focus:border-accent transition-colors resize-none"
                  />
                </div>
                <div>
                  <label htmlFor="nudo-category" className="label-micro block mb-2">Categoría</label>
                  <select
                    id="nudo-category"
                    value={decisionCategory}
                    onChange={(e) => setDecisionCategory(e.target.value as DecisionCategory)}
                    className="w-full px-4 py-3 border border-ink/10 bg-background text-foreground text-sm focus:outline-none focus:border-accent transition-colors"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {selectedContext === "timing" && (
              <div className="space-y-3">
                <div>
                  <label htmlFor="nudo-date" className="label-micro block mb-2">Fecha</label>
                  <input
                    id="nudo-date"
                    type="date"
                    value={timingDate}
                    onChange={(e) => setTimingDate(e.target.value)}
                    className="w-full px-4 py-3 border border-ink/10 bg-background text-foreground text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="nudo-intention" className="label-micro block mb-2">Intención</label>
                  <select
                    id="nudo-intention"
                    value={timingIntention}
                    onChange={(e) => setTimingIntention(e.target.value as TimingIntention)}
                    className="w-full px-4 py-3 border border-ink/10 bg-background text-foreground text-sm focus:outline-none focus:border-accent transition-colors"
                  >
                    {Object.entries(INTENTION_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {selectedContext === "daily_energy" && (
              <div>
                <label htmlFor="nudo-energy-date" className="label-micro block mb-2">Fecha</label>
                <input
                  id="nudo-energy-date"
                  type="date"
                  value={energyDate}
                  onChange={(e) => setEnergyDate(e.target.value)}
                  className="w-full px-4 py-3 border border-ink/10 bg-background text-foreground text-sm focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            )}

            {selectedContext === "compatibility" && (
              <p className="text-xs text-muted italic">
                Este contexto todavía usa un perfil de muestra (Camino de Vida 4, Tauro, Buey) — no hay selector de la otra persona en esta versión.
              </p>
            )}

            <Button variant="primary" fullWidth onClick={handleDetect} disabled={!canDetect}>
              Detectar
            </Button>

            <div className="border border-ink/10 p-6">
              <p className="label-micro mb-2">¿Cómo funciona?</p>
              <p className="text-sm text-muted leading-relaxed">
                El Nudo cruza tu patrón estable (numerología, arquetipo, ciclos) con tu contexto actual
                para detectar una tensión real y devolver una pregunta que aumente claridad.
                No inventa tensiones — si no las hay, lo dice honestamente. Decisión, Momento y Energía
                usan lo que escribas acá arriba; Compatibilidad todavía usa un perfil de muestra.
              </p>
            </div>
          </div>
        )}

        <div className="mt-12 border-t border-ink/10 pt-8 text-center">
          <Link href="/profile" className="text-sm text-accent hover:underline">
            Ver mi perfil
          </Link>
        </div>
      </main>
    </div>
  );
}