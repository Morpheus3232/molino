"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import { saveSession } from "@/lib/storage/ephemeral";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

type Step = "identity" | "context";

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

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("identity");
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

  const handleIdentitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !date || !birthPlace.trim() || !goal) {
      setError("Completá todos los campos");
      return;
    }
    const [year, month, day] = date.split("-").map(Number);
    if (!day || !month || !year || day < 1 || month < 1 || month > 12) {
      setError("Formato de fecha inválido");
      return;
    }
    if (interests.length === 0) {
      setError("Seleccioná al menos un interés");
      return;
    }
    setStep("context");
  };

  const handleFinish = async () => {
    try {
      const birthDate = `${date.split("-")[0]}-${String(date.split("-")[1]).padStart(2, "0")}-${String(date.split("-")[2]).padStart(2, "0")}`;
      const calculated = calculateUserProfile(name.trim(), birthDate);
      saveSession({
        name: calculated.name,
        birthDate: calculated.birthDate,
        birthPlace: birthPlace.trim(),
        birthTime: birthTime || undefined,
        goal,
        interests,
        onboardingStep: 2,
        completedSections: ["identity"],
        theme: "light",
        language: "es",
        notifications: true,
      });
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-[640px] mx-auto px-6 py-12">
        <Section>
          <div className="text-center mb-8">
            <span className="badge mb-3">🌾 Molino</span>
            <h1 className="font-serif text-3xl font-bold text-foreground mt-3">Personal Intelligence</h1>
            <p className="text-muted text-sm mt-2">
              {step === "identity" ? "Ingresá tus datos para calcular tu mapa simbólico" : "Seleccioná tus intereses"}
            </p>
          </div>

          {step === "identity" ? (
            <Card hover={false}>
              <form onSubmit={handleIdentitySubmit} className="space-y-6">
                <Input
                  label="Nombre"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: María Elena"
                  required
                />
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
                <div>
                  <p className="text-xs text-muted mb-2">Objetivo principal</p>
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
                </div>
                <div>
                  <p className="text-xs text-muted mb-2">Intereses principales</p>
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
                </div>
                {error && <p className="text-sm text-error">{error}</p>}
                <Button type="submit" fullWidth size="lg">
                  Continuar →
                </Button>
                <p className="text-xs text-muted text-center mt-2">Sesión efímera. No guardamos información.</p>
              </form>
            </Card>
          ) : (
            <Card hover={false}>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Resumen</p>
                  <div className="space-y-2">
                    <div className="bg-background rounded-2xl p-4 border border-border">
                      <p className="text-xs text-muted">Nombre</p>
                      <p className="text-sm text-foreground">{name}</p>
                    </div>
                    <div className="bg-background rounded-2xl p-4 border border-border">
                      <p className="text-xs text-muted">Nacimiento</p>
                      <p className="text-sm text-foreground">{date}{birthPlace ? ` • ${birthPlace}` : ""}</p>
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
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="secondary" onClick={() => setStep("identity")} className="flex-1">
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
