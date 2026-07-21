"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import { saveSession } from "@/lib/storage/ephemeral";
import { saveProfileToStorage } from "@/lib/storage/localStorage";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

type Step = "name" | "birth" | "objective" | "interests" | "summary";

const OBJECTIVES = [
  { id: "life", label: "Decisiones de vida", icon: "🎯" },
  { id: "love", label: "Amor y vínculos", icon: "❤️" },
  { id: "career", label: "Carrera y emprendimiento", icon: "🚀" },
  { id: "business", label: "Negocios y proyectos", icon: "🏢" },
  { id: "growth", label: "Crecimiento personal", icon: "🌱" },
];

const INTERESTS = [
  { id: "relationships", label: "Relaciones", icon: "💞" },
  { id: "career", label: "Carrera", icon: "🧭" },
  { id: "finance", label: "Finanzas", icon: "💳" },
  { id: "health", label: "Salud", icon: "🌿" },
  { id: "spirituality", label: "Espiritualidad", icon: "🧘" },
];

const STEP_META: Record<Step, { title: string; subtitle: string; progress: number }> = {
  name: { title: "Tu nombre", subtitle: "Empecemos por lo básico.", progress: 20 },
  birth: { title: "Tu nacimiento", subtitle: "Fecha, lugar y hora (opcional).", progress: 40 },
  objective: { title: "Tu objetivo", subtitle: "¿Qué querés analizar primero?", progress: 60 },
  interests: { title: "Tus intereses", subtitle: "Seleccioná al menos uno.", progress: 80 },
  summary: { title: "Resumen", subtitle: "Confirmá y generá tu perfil.", progress: 100 },
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("name");
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [goal, setGoal] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setReady(true);
  }, []);

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const canProceed = (): boolean => {
    switch (step) {
      case "name":
        return name.trim().length > 0;
      case "birth":
        return date.trim().length > 0 && birthPlace.trim().length > 0;
      case "objective":
        return goal.trim().length > 0;
      case "interests":
        return interests.length > 0;
      default:
        return true;
    }
  };

  const next = () => {
    setError("");
    const steps: Step[] = ["name", "birth", "objective", "interests", "summary"];
    const idx = steps.indexOf(step);
    if (idx < steps.length - 1) setStep(steps[idx + 1]);
  };

  const back = () => {
    setError("");
    const steps: Step[] = ["name", "birth", "objective", "interests", "summary"];
    const idx = steps.indexOf(step);
    if (idx > 0) setStep(steps[idx - 1]);
  };

  const handleFinish = async () => {
    try {
      const birthDate = `${date.split("-")[0]}-${String(date.split("-")[1]).padStart(2, "0")}-${String(date.split("-")[2]).padStart(2, "0")}`;
      const calculated = calculateUserProfile(name.trim(), birthDate);
      const profile = {
        name: calculated.name,
        birthDate: calculated.birthDate,
        birthPlace: birthPlace.trim(),
        birthTime: birthTime || undefined,
        goal: goal as UserProfile["goal"],
        interests,
        onboardingStep: 5,
        completedSections: ["identity"],
        theme: "light" as const,
        language: "es" as const,
        notifications: true,
        lifePath: calculated.lifePath,
        expressionNumber: calculated.expressionNumber,
        soulNumber: calculated.soulNumber,
        personalityNumber: calculated.personalityNumber,
        sunSign: calculated.sunSign,
        sunSignInfo: calculated.sunSignInfo,
        chineseZodiac: calculated.chineseZodiac,
        chineseZodiacInfo: calculated.chineseZodiacInfo,
        element: calculated.element,
        modality: calculated.modality,
        archetype: calculated.archetype,
        archetypeInfo: calculated.archetypeInfo,
      };

      saveSession({
        name: profile.name,
        birthDate: profile.birthDate,
        birthPlace: profile.birthPlace,
        birthTime: profile.birthTime,
        goal: profile.goal,
        interests: profile.interests,
        onboardingStep: profile.onboardingStep,
        completedSections: profile.completedSections,
        theme: profile.theme,
        language: profile.language,
        notifications: profile.notifications,
      });
      saveProfileToStorage(profile);
      router.push("/profile");
    } catch (err) {
      console.error(err);
      setError("Hubo un error generando tu perfil. Intentá de nuevo.");
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Cargando...</div>
      </div>
    );
  }

  const meta = STEP_META[step];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-[640px] mx-auto px-6 py-12">
        <Section>
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-muted mb-2">
              <span>Paso {STEP_META[step].progress}%</span>
              <span>Personal Intelligence</span>
            </div>
            <div className="h-1 w-full rounded-full bg-border">
              <div className="h-1 rounded-full bg-accent transition-all" style={{ width: `${meta.progress}%` }} />
            </div>
          </div>

          <div className="text-center mb-8">
            <span className="badge mb-3">🌾 Molino</span>
            <h1 className="font-serif text-3xl font-bold text-foreground mt-3">{meta.title}</h1>
            <p className="text-muted text-sm mt-2">{meta.subtitle}</p>
          </div>

          {step === "name" && (
            <Card hover={false}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (canProceed()) next();
                }}
                className="space-y-6"
              >
                <Input
                  label="Nombre"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: María Elena"
                  required
                />
                {error && <p className="text-sm text-error">{error}</p>}
                <Button type="submit" fullWidth size="lg">
                  Continuar →
                </Button>
              </form>
            </Card>
          )}

          {step === "birth" && (
            <Card hover={false}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (canProceed()) next();
                }}
                className="space-y-6"
              >
                <Input
                  label="Fecha de nacimiento"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
                <Input
                  label="Lugar de nacimiento"
                  type="text"
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  placeholder="Ej: Córdoba, Argentina"
                  required
                />
                <Input
                  label="Hora de nacimiento (opcional)"
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                />
                {error && <p className="text-sm text-error">{error}</p>}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="secondary" type="button" onClick={back} className="flex-1">
                    ← Volver
                  </Button>
                  <Button type="submit" fullWidth size="lg" className="sm:flex-1">
                    Continuar →
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {step === "objective" && (
            <Card hover={false}>
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {OBJECTIVES.map((obj) => {
                    const selected = goal === obj.id;
                    return (
                      <button
                        key={obj.id}
                        type="button"
                        onClick={() => setGoal(obj.id)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                          selected ? "border-accent bg-accent/10 text-foreground" : "border-border bg-background text-muted hover:text-foreground"
                        }`}
                      >
                        <span className="text-2xl">{obj.icon}</span>
                        <span className="text-xs font-medium">{obj.label}</span>
                      </button>
                    );
                  })}
                </div>
                {error && <p className="text-sm text-error">{error}</p>}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="secondary" onClick={back} className="flex-1">
                    ← Volver
                  </Button>
                  <Button onClick={next} disabled={!canProceed()} className="flex-1">
                    Continuar →
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {step === "interests" && (
            <Card hover={false}>
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {INTERESTS.map((obj) => {
                    const selected = interests.includes(obj.id);
                    return (
                      <button
                        key={obj.id}
                        type="button"
                        onClick={() => toggleInterest(obj.id)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                          selected ? "border-accent bg-accent/10 text-foreground" : "border-border bg-background text-muted hover:text-foreground"
                        }`}
                      >
                        <span className="text-2xl">{obj.icon}</span>
                        <span className="text-xs font-medium">{obj.label}</span>
                      </button>
                    );
                  })}
                </div>
                {error && <p className="text-sm text-error">{error}</p>}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="secondary" onClick={back} className="flex-1">
                    ← Volver
                  </Button>
                  <Button onClick={next} disabled={!canProceed()} className="flex-1">
                    Continuar →
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {step === "summary" && (
            <Card hover={false}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="bg-background rounded-2xl p-4 border border-border">
                    <p className="text-xs text-muted">Nombre</p>
                    <p className="text-sm text-foreground">{name}</p>
                  </div>
                  <div className="bg-background rounded-2xl p-4 border border-border">
                    <p className="text-xs text-muted">Nacimiento</p>
                    <p className="text-sm text-foreground">
                      {date}
                      {birthPlace ? ` • ${birthPlace}` : ""}
                      {birthTime ? ` • ${birthTime}` : ""}
                    </p>
                  </div>
                  <div className="bg-background rounded-2xl p-4 border border-border">
                    <p className="text-xs text-muted">Objetivo</p>
                    <p className="text-sm text-foreground">{OBJECTIVES.find((o) => o.id === goal)?.label || goal}</p>
                  </div>
                  <div className="bg-background rounded-2xl p-4 border border-border">
                    <p className="text-xs text-muted">Intereses</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {interests.map((id) => {
                        const item = INTERESTS.find((i) => i.id === id);
                        return (
                          <span key={id} className="inline-flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2 text-sm text-foreground">
                            {item?.icon} {item?.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="secondary" onClick={back} className="flex-1">
                    ← Volver
                  </Button>
                  <Button onClick={handleFinish} className="flex-1">
                    Descubrir mi perfil →
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </Section>
      </div>
    </div>
  );
}
