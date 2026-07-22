"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import { saveSession } from "@/lib/storage/ephemeral";
import { saveProfileToStorage } from "@/lib/storage/localStorage";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const MONTHS = [
  { value: "01", label: "ENE" },
  { value: "02", label: "FEB" },
  { value: "03", label: "MAR" },
  { value: "04", label: "ABR" },
  { value: "05", label: "MAY" },
  { value: "06", label: "JUN" },
  { value: "07", label: "JUL" },
  { value: "08", label: "AGO" },
  { value: "09", label: "SEP" },
  { value: "10", label: "OCT" },
  { value: "11", label: "NOV" },
  { value: "12", label: "DIC" },
];

function getDaysInMonth(month: string, year: string): number {
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  if (!m || !y) return 31;
  return new Date(y, m, 0).getDate();
}

function getCurrentYear(): number {
  return new Date().getFullYear();
}

export default function OnboardingPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("01");
  const [year, setYear] = useState(String(getCurrentYear() - 25));
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setReady(true);
  }, []);

  const daysInMonth = getDaysInMonth(month, year);
  const yearOptions = Array.from({ length: 100 }, (_, i) => getCurrentYear() - i);

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const parsedDay = parseInt(day, 10);
    const parsedMonth = parseInt(month, 10);
    const parsedYear = parseInt(year, 10);

    if (!parsedDay || !parsedMonth || !parsedYear) {
      setError("Seleccioná día, mes y año");
      return;
    }

    try {
      const birthDate = `${parsedYear}-${String(parsedMonth).padStart(2, "0")}-${String(parsedDay).padStart(2, "0")}`;
      const calculated = calculateUserProfile(name.trim(), birthDate);
      const profile: UserProfile = {
        ...calculated,
        birthPlace: "",
        birthTime: undefined,
        goal: "life",
        interests: [],
        onboardingStep: 1,
        completedSections: ["identity"],
        theme: "light",
        language: "es",
        notifications: true,
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />
      <div className="relative mx-auto flex min-h-screen max-w-[640px] flex-col justify-center px-6 py-12">
        <div className="mb-10 text-center">
          <span className="badge mb-4">Personal Intelligence</span>
      <h1 className="font-serif text-4xl font-bold text-foreground md:text-5xl">
        Tu identidad simbólica
      </h1>
      <p className="mt-3 text-base text-muted md:text-lg">
        Poné un nombre o alias y tu fecha de nacimiento para crear tu perfil.
      </p>
        </div>

        <Card hover={false} padding="lg">
          <form onSubmit={handleFinish} className="space-y-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium mb-2">Nombre o alias</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input min-h-[48px]"
                placeholder="Ej: Marian, Sol, Charly..."
                required
                minLength={2}
                maxLength={40}
                aria-label="Nombre o alias"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium mb-2">Día</p>
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="input min-h-[48px]"
                  required
                  aria-label="Día"
                >
                  <option value="">Día</option>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={String(d)}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium mb-2">Mes</p>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="input min-h-[48px]"
                  required
                  aria-label="Mes"
                >
                  {MONTHS.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium mb-2">Año</p>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="input min-h-[48px]"
                  required
                  aria-label="Año"
                >
                  <option value="">Año</option>
                  {yearOptions.map((y) => (
                    <option key={y} value={String(y)}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && <p className="text-sm text-error">{error}</p>}
            <Button type="submit" fullWidth size="lg">
              Descubrir mi perfil →
            </Button>
            <p className="text-xs text-muted text-center">
              Sesión efímera. No guardamos información personal.
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
