"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import type { UserProfile } from "@/types/user";
import { saveSession } from "@/lib/storage/ephemeral";
import { saveProfileToStorage } from "@/lib/storage/localStorage";
import { markOnboardingCompleted } from "@/lib/storage/discovery";
import { analytics } from "@/lib/analytics/analytics";
import {
  smoothReveal,
  heroReveal,
  cardReveal,
  emojiBounce,
  staggerApple,
  staggerItemSmooth,
} from "@/lib/utils/premiumMotion";
import { formatAnimalEmoji, getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { buildShareableUrl } from "@/lib/utils/profileShare";
import { ELEMENT_COLORS, ZODIAC_SYMBOLS } from "@/lib/data/constants";
import { ARCHETYPES } from "@/lib/data";

const MONTHS = [
  { value: "01", label: "Ene" },
  { value: "02", label: "Feb" },
  { value: "03", label: "Mar" },
  { value: "04", label: "Abr" },
  { value: "05", label: "May" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Ago" },
  { value: "09", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dic" },
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

type OnboardingStep = "date" | "reveal" | "name" | "complete";

export default function OnboardingPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState<OnboardingStep>("date");
  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("01");
  const [year, setYear] = useState(String(getCurrentYear() - 25));
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    setReady(true);
  }, []);

  const daysInMonth = getDaysInMonth(month, year);
  const yearOptions = Array.from({ length: 100 }, (_, i) => getCurrentYear() - i);

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

      setProfile(newProfile);
      setStep("reveal");
    } catch (err) {
      console.error(err);
      setError("Hubo un error. Intentá de nuevo.");
    }
  };

  const handleNameSubmit = () => {
    if (!profile) return;

    const updatedProfile: UserProfile = {
      ...profile,
      name: name.trim() || "Explorador",
      expressionNumber: name.trim() ? undefined : undefined,
      soulNumber: name.trim() ? undefined : undefined,
      personalityNumber: name.trim() ? undefined : undefined,
    };

    // Recalcular con nombre si se proporciona
    if (name.trim()) {
      const recalculated = calculateUserProfile(name.trim(), profile.birthDate);
      Object.assign(updatedProfile, {
        expressionNumber: recalculated.expressionNumber,
        soulNumber: recalculated.soulNumber,
        personalityNumber: recalculated.personalityNumber,
      });
    }

    saveSession({
      name: updatedProfile.name,
      birthDate: updatedProfile.birthDate,
      birthPlace: updatedProfile.birthPlace,
      birthTime: updatedProfile.birthTime,
      goal: updatedProfile.goal,
      interests: updatedProfile.interests,
      onboardingStep: updatedProfile.onboardingStep,
      completedSections: updatedProfile.completedSections,
      theme: updatedProfile.theme,
      language: updatedProfile.language,
      notifications: updatedProfile.notifications,
    });
    saveProfileToStorage(updatedProfile);
    window.dispatchEvent(new Event("molino-profile-created"));
    markOnboardingCompleted();
    analytics.trackProfileCreated(updatedProfile);
    setStep("complete");
    setTimeout(() => router.push("/profile"), 1500);
  };

  const handleSkipName = () => {
    if (!profile) return;
    const finalProfile = { ...profile, name: "Explorador" };
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
    saveProfileToStorage(finalProfile);
    window.dispatchEvent(new Event("molino-profile-created"));
    markOnboardingCompleted();
    analytics.trackProfileCreated(finalProfile);
    setStep("complete");
    setTimeout(() => router.push("/profile"), 1500);
  };

  const handleShareReveal = async () => {
    if (!profile) return;
    const shareUrl = buildShareableUrl(profile, "identity");
    const shareText = `Descubrí mi perfil de identidad en Molino.\n¿Querés descubrir el tuyo?`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Mi perfil — ${profile.name || "Explorador"}`,
          text: shareText,
          url: shareUrl,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(shareUrl);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Cargando...</div>
      </div>
    );
  }

  const display = profile ? getZodiacDisplay(profile.chineseZodiac) : null;
  const elementColor = profile ? (ELEMENT_COLORS[profile.element] || "var(--element-fire)") : "var(--element-fire)";
  const archetypeData = profile ? ARCHETYPES[profile.lifePath] : null;
  const sunSymbol = profile ? (ZODIAC_SYMBOLS[profile.sunSign] || "♈") : "♈";

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />
      <div className="relative mx-auto flex min-h-screen max-w-[640px] flex-col justify-center px-6 py-12">

        <AnimatePresence mode="wait">
          {/* ═══════════════════════════════════════════════
              STEP 1: DATE INPUT
              ═══════════════════════════════════════════════ */}
          {step === "date" && (
            <motion.div
              key="date"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-10 text-center">
                <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] uppercase tracking-[0.2em] font-medium mb-4">
                  Inteligencia Personal
                </span>
                <h1 className="font-serif text-4xl font-bold text-foreground md:text-5xl">
                  Descubrí tu mapa
                </h1>
                <p className="mt-3 text-base text-muted md:text-lg">
                  Solo necesitamos tu fecha de nacimiento.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-card">
                <form onSubmit={handleDateSubmit} className="space-y-6">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium mb-2">Día</p>
                      <select
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        className="w-full px-3 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent min-h-[48px]"
                        required
                        aria-label="Día"
                      >
                        <option value="">Día</option>
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                          <option key={d} value={String(d)}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium mb-2">Mes</p>
                      <select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="w-full px-3 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent min-h-[48px]"
                        required
                        aria-label="Mes"
                      >
                        {MONTHS.map((m) => (
                          <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium mb-2">Año</p>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full px-3 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent min-h-[48px]"
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

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-6 py-4 text-base bg-primary text-primary-foreground shadow-sm hover:bg-accent hover:text-accent-foreground min-h-[52px]"
                  >
                    Descubrir mi mapa →
                  </button>

                  <p className="text-xs text-muted text-center">
                    Sin servidor. Sin cuentas.
                  </p>
                </form>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════
              STEP 2: REVEAL — THE BIG MOMENT
              ═══════════════════════════════════════════════ */}
          {step === "reveal" && profile && display && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Animal hero — THE reveal */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                className="text-center mb-6"
              >
                <span className="inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-border bg-card mb-2">
                  <svg viewBox="0 0 24 24" className="w-10 h-10 sm:w-12 sm:h-12 text-accent" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M8 12h8" />
                    <path d="M12 8v8" />
                  </svg>
                </span>
              </motion.div>

              {/* Name + identity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-center mb-8"
              >
                <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-2">
                  {display.name}
                </h1>
                <p className="text-lg" style={{ color: elementColor }}>
                  {display.name} de {profile.chineseZodiacInfo?.element ?? ""}
                </p>
                <p className="text-sm text-muted mt-2">
                  {sunSymbol} {profile.sunSign} · Camino {profile.lifePath}
                </p>
              </motion.div>

              {/* Quote */}
              {archetypeData?.quote && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="text-center mb-8"
                >
                  <p className="font-serif text-lg italic text-muted max-w-md mx-auto">
                    &ldquo;{archetypeData.quote}&rdquo;
                  </p>
                </motion.div>
              )}

              {/* Archetype badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="text-center mb-10"
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card">
                  <span className="text-sm">{sunSymbol}</span>
                  <span className="text-[11px] uppercase tracking-[0.2em] font-medium" style={{ color: elementColor }}>
                    Tu arquetipo es {archetypeData?.name || "Explorador"}
                  </span>
                </span>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="space-y-3"
              >
                <button
                  type="button"
                  onClick={() => setStep("name")}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-6 py-4 text-base bg-primary text-primary-foreground shadow-sm hover:bg-accent hover:text-accent-foreground min-h-[52px]"
                >
                  Entrar a mi Molino →
                </button>
                <button
                  type="button"
                  onClick={handleShareReveal}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all px-6 py-3 text-sm border border-border bg-card hover:bg-background"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  Compartir mi identidad
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════
              STEP 3: NAME (OPTIONAL)
              ═══════════════════════════════════════════════ */}
          {step === "name" && (
            <motion.div
              key="name"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-10 text-center">
                <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] uppercase tracking-[0.2em] font-medium mb-4">
                  Profundizar
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">
                  ¿Querés agregar tu nombre?
                </h1>
                <p className="text-sm text-muted">
                  Esto desbloquea capas adicionales de identidad: números de expresión, alma y personalidad.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-card">
                <div className="space-y-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium mb-2">Nombre o alias</p>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent min-h-[48px]"
                      placeholder="Ej: Marian, Sol, Charly..."
                      minLength={2}
                      maxLength={40}
                      aria-label="Nombre o alias"
                      autoFocus
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleNameSubmit}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-6 py-4 text-base bg-primary text-primary-foreground shadow-sm hover:bg-accent hover:text-accent-foreground min-h-[52px]"
                  >
                    {name.trim() ? "Desbloquear capas adicionales →" : "Entrar como Explorador →"}
                  </button>

                  <button
                    type="button"
                    onClick={handleSkipName}
                    className="w-full text-sm text-muted hover:text-foreground transition-colors py-2"
                  >
                    Saltar por ahora
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════
              STEP 4: COMPLETE
              ═══════════════════════════════════════════════ */}
          {step === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              className="text-center"
            >
              <svg className="w-10 h-10 text-accent mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9L12 21l1.9-5.8 5.8-1.9-5.8-1.9z" />
              </svg>
              <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                Tu mapa está listo
              </h1>
              <p className="text-sm text-muted">
                Redirigiendo a tu Inteligencia Personal...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
