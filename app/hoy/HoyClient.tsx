"use client";

import { useState, useEffect } from "react";
import { useProfile } from "@/lib/hooks/useProfile";
import { useDailyEnergy } from "@/lib/hooks/useDailyEnergy";
import { useStreak } from "@/lib/hooks/useStreak";
import { useJournal } from "@/lib/hooks/useJournal";
import { computeJournalStreak, findEntryForDate } from "@/lib/utils/journalStreak";
import { toLocalDateKey } from "@/lib/session/dailyHistory";
import DailyEnergyCard from "@/components/daily/DailyEnergyCard";
import PersonalCyclesSection from "@/components/daily/PersonalCyclesSection";
import DailyFocus from "@/components/daily/DailyFocus";
import WeekPreview from "@/components/daily/WeekPreview";
import Link from "next/link";
import { Bell, BellRing, TrendingUp } from "lucide-react";

export default function HoyClient() {
  const { profile, mounted, loading } = useProfile({ redirectIfNotFound: false });
  const [notificationPermission, setNotificationPermission] = useState<string>("default");

  const { streakDays, badge } = useStreak();
  const { entries: journalEntries } = useJournal();
  const todayKey = toLocalDateKey(new Date());
  const todayEntry = findEntryForDate(journalEntries, todayKey);
  const journalStreak = computeJournalStreak(journalEntries);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Sin perfil, useDailyEnergy ya devuelve energía universal (misma para
  // cualquier visitante ese día — ver calculateUniversalDailyEnergy en
  // dailyEnergyEngine.ts). No hace falta pedir fecha de nacimiento para
  // mostrar algo con sentido acá.
  const daily = useDailyEnergy(profile);

  const handleRequestNotification = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    try {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
      if (perm === "granted") {
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
      }
    } catch (err) {
      console.error("Error requesting notification permission:", err);
    }
  };

  // Esperar a que useProfile() resuelva localStorage/sesión — evita un
  // flash de "sin perfil" cuando en realidad sí hay uno guardado.
  if (!mounted || loading) return null;

  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24 pb-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-8 space-y-8">
        {/* Top Notification Bar & Preferences */}
        <div className="flex items-center justify-between gap-3 text-xs flex-wrap">
          <div className="flex items-center gap-2">
            {profile ? (
              <span className="font-mono text-xs text-muted">
                Mapa de <strong className="text-foreground">{profile.name || profile.archetype}</strong>
              </span>
            ) : (
              <Link href="/onboarding" className="font-mono text-xs text-accent hover:underline">
                Creá tu mapa para sumar tu Año Personal →
              </Link>
            )}
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

        {/* 1.5 Personal Year — solo con perfil (contenido determinista, no depende de IA ni pago) */}
        {daily?.isPersonalized && profile && <PersonalCyclesSection profile={profile} daily={daily} />}

        {/* 2. Daily Focus vs Avoid & Journal Callout */}
        {daily && (
          <DailyFocus daily={daily} todayEntry={todayEntry} journalStreak={journalStreak} />
        )}

        {/* 3. Week Preview (3-day forecast) */}
        {daily?.nextDaysForecast && <WeekPreview forecast={daily.nextDaysForecast} />}

        {/* 4. Link a la vista de patrones ya construida — sin esto, /evolution
            queda aislada del loop diario */}
        <div className="text-center pt-2">
          <Link
            href="/evolution"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-accent transition-colors"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Ver tus patrones →
          </Link>
        </div>
      </div>
    </div>
  );
}
