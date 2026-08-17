"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { saveProfileToStorage } from "@/lib/session/localStorage";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import { useProfile } from "@/lib/hooks/useProfile";
import { useDailyEnergy } from "@/lib/hooks/useDailyEnergy";
import { useStreak } from "@/lib/hooks/useStreak";
import DailyEnergyCard from "@/components/daily/DailyEnergyCard";
import PersonalCyclesSection from "@/components/daily/PersonalCyclesSection";
import DailyFocus from "@/components/daily/DailyFocus";
import WeekPreview from "@/components/daily/WeekPreview";
import DateInput from "@/components/ui/DateInput";
import Button from "@/components/ui/Button";
import Link from "next/link";
import {
  Bell,
  BellOff,
  BellRing,
  Sparkles,
  Compass,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";

export default function HoyClient() {
  const { profile: storedProfile, mounted, loading } = useProfile({ redirectIfNotFound: false });
  // El perfil recién creado acá (form de fecha) se guarda en localStorage,
  // pero useProfile() solo lee storage al montar — sin este override local,
  // la tarjeta de energía no aparecería hasta el próximo mount.
  const [manualProfile, setManualProfile] = useState<UserProfile | null>(null);
  const profile = manualProfile ?? storedProfile;
  const [manualDate, setManualDate] = useState("");
  const [notificationPermission, setNotificationPermission] = useState<string>("default");
  const [notificationSuccess, setNotificationSuccess] = useState(false);

  const { streakDays, badge } = useStreak();

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const daily = useDailyEnergy(profile);

  const handleRequestNotification = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    try {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
      if (perm === "granted") {
        setNotificationSuccess(true);
        // Trigger test notification
        if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: "SCHEDULE_DAILY_NOTIFICATION",
          });
        }
        // Native local notification
        new Notification("Molino · Tu Energía de Hoy", {
          body: `Día de ${daily?.theme || "Reflexión"}. Tocá para ver tu foco de hoy.`,
          icon: "/icon-192.svg",
        });
        setTimeout(() => setNotificationSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error requesting notification permission:", err);
    }
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualDate || manualDate.length !== 10) return;
    const user = calculateUserProfile("", manualDate);
    saveProfileToStorage(user);
    setManualProfile(user);
  };

  // Esperar a que useProfile() resuelva localStorage/sesión antes de decidir
  // si hace falta pedir la fecha — evita un flash del form cuando el perfil
  // ya existe pero todavía no se leyó.
  if (!mounted || loading) return null;

  // If no profile, show friendly onboarding prompt
  if (!profile) {
    return (
      <div className="min-h-screen bg-background pt-20 sm:pt-24 pb-24 flex items-center justify-center">
        <div className="mx-auto max-w-lg px-4 sm:px-6 text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent mx-auto flex items-center justify-center">
            <Compass className="w-7 h-7" />
          </div>

          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
              Energía Diaria Personal
            </span>
            <h1 className="font-display text-2xl sm:text-3xl text-foreground uppercase tracking-tight mt-1">
              Descubrí tu energía de hoy
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
              Ingresá tu fecha de nacimiento para calcular tu Día Personal, fase lunar y foco de hoy.
            </p>
          </div>

          <form onSubmit={handleCreateProfile} className="p-6 rounded-3xl border border-ink/10 bg-card space-y-5">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-3 font-semibold">
                Fecha de Nacimiento
              </label>
              <DateInput value={manualDate} onChange={setManualDate} />
            </div>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              disabled={manualDate.length !== 10}
              className="w-full"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Ver mi energía de hoy
            </Button>

            <div className="text-center pt-2">
              <Link href="/onboarding" className="text-xs font-mono text-accent hover:underline">
                O creá tu mapa completo paso a paso →
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24 pb-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-8 space-y-8">
        {/* Top Notification Bar & Preferences */}
        <div className="flex items-center justify-between gap-3 text-xs flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted">
              Mapa de <strong className="text-foreground">{profile.name || profile.archetype}</strong>
            </span>
          </div>

          {/* Notification Button */}
          <div>
            {notificationPermission === "granted" ? (
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                <BellRing className="w-3.5 h-3.5" />
                <span>Notificaciones 8 AM activas</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleRequestNotification}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted hover:text-foreground bg-card border border-ink/10 px-3 py-1 rounded-full transition-colors"
              >
                <Bell className="w-3.5 h-3.5 text-accent" />
                <span>Activar aviso diario (8 AM)</span>
              </button>
            )}
          </div>
        </div>

        {/* 1. Daily Energy Card (Score, Theme, Moon, Streak) */}
        {daily && (
          <DailyEnergyCard
            profile={profile}
            daily={daily}
            streakDays={streakDays}
            streakBadge={badge}
          />
        )}

        {/* 1.5 Personal Cycles (Year/Month/Day, expandible) */}
        {daily && <PersonalCyclesSection profile={profile} daily={daily} />}

        {/* 2. Daily Focus vs Avoid & Journal Callout */}
        {daily && <DailyFocus daily={daily} />}

        {/* 3. Week Preview (3-day forecast) */}
        {daily?.nextDaysForecast && <WeekPreview forecast={daily.nextDaysForecast} />}
      </div>
    </div>
  );
}
