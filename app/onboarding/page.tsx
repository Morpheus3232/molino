"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import type { UserProfile } from "@/types/user";
import { saveSession } from "@/lib/storage/ephemeral";
import { saveProfileToStorage } from "@/lib/storage/localStorage";
import { markOnboardingCompleted } from "@/lib/storage/discovery";
import { analytics } from "@/lib/analytics/analytics";
import DatePicker from "@/components/ui/DatePicker";

export default function OnboardingPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setReady(true);
  }, []);

  const finishOnboarding = useCallback((profile: UserProfile) => {
    saveSession({
      name: "Explorador",
      birthDate: profile.birthDate,
      birthPlace: "",
      birthTime: undefined,
      goal: "life",
      interests: [],
      onboardingStep: 1,
      completedSections: ["identity"],
      theme: "light",
      language: "es",
      notifications: true,
    });
    saveProfileToStorage(profile);
    window.dispatchEvent(new Event("molino-profile-created"));
    markOnboardingCompleted();
    analytics.trackProfileCreated(profile);
  }, []);

  const handleDateSubmit = async (e: React.FormEvent) => {
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
      const calculated = calculateUserProfile("", birthDate);
      const newProfile: UserProfile = {
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

      finishOnboarding(newProfile);
      setSpinning(true);

      setTimeout(() => {
        router.push("/profile");
      }, 2500);
    } catch {
      setError("Hubo un error. Intentá de nuevo.");
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

        <AnimatePresence mode="wait">
          {!spinning ? (
            <motion.div
              key="date"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-10 text-center">
                <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] uppercase tracking-[0.2em] font-medium mb-4">
                  Inteligencia Personal
                </span>
                <h1 className="font-heading uppercase text-4xl font-semibold text-foreground md:text-5xl">
                  Descubrí tu mapa
                </h1>
                <p className="mt-3 text-base text-muted md:text-lg">
                  Solo necesitamos tu fecha de nacimiento.
                </p>
              </div>

              <div>
                <form onSubmit={handleDateSubmit} className="space-y-8">
                  <DatePicker
                    day={day}
                    month={month}
                    year={year}
                    onDayChange={setDay}
                    onMonthChange={setMonth}
                    onYearChange={setYear}
                  />

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 font-semibold transition-all px-6 py-4 text-base bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground min-h-[52px]"
                  >
                    Descubrir mi mapa →
                  </button>

                  <p className="text-xs text-muted text-center">
                    Sin servidor. Sin cuentas.
                  </p>

                  <div className="flex items-center justify-center gap-3 text-[11px] text-muted/60 font-mono tracking-wider">
                    <span>3 sistemas</span>
                    <span className="w-px h-3 bg-border" />
                    <span>13 fuentes</span>
                    <span className="w-px h-3 bg-border" />
                    <span>0 servidores</span>
                  </div>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="spinning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="flex flex-col items-center justify-center gap-8">
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-24 h-24 text-foreground"
                  aria-hidden="true"
                >
                  <path d="M10 30 L8 14 L24 14 L22 30 Z" />
                  <path d="M7 14 L16 7 L25 14 Z" />
                  <path d="M14 30 L14 23 Q14 21 16 21 Q18 21 18 23 L18 30" />
                  <circle cx="16" cy="17.5" r="1.1" />
                  <motion.g
                    style={{ transformOrigin: "16px 7px" }}
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 720 }}
                    transition={{
                      duration: 2.5,
                      ease: [0.05, 0.7, 0.1, 1],
                      repeat: 0,
                    }}
                  >
                    <line x1="0" y1="7" x2="32" y2="7" />
                    <line x1="16" y1="-3" x2="16" y2="17" />
                    <line x1="0" y1="4.5" x2="32" y2="4.5" strokeWidth="0.5" />
                    <line x1="0" y1="9.5" x2="32" y2="9.5" strokeWidth="0.5" />
                    <line x1="13" y1="-3" x2="13" y2="17" strokeWidth="0.5" />
                    <line x1="19" y1="-3" x2="19" y2="17" strokeWidth="0.5" />
                  </motion.g>
                </svg>
                <p className="font-heading uppercase text-sm tracking-[0.2em] text-muted">
                  Leyendo tu mapa...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
