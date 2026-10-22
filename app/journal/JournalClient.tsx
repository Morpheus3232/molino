"use client";

import { useState, useEffect, useMemo } from "react";
import type { UserProfile } from "@/types/user";
import type { JournalEntry } from "@/types/journal";
import { loadProfileFromStorage } from "@/lib/session/localStorage";
import { getSession } from "@/lib/session/ephemeral";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import { useJournal } from "@/lib/hooks/useJournal";
import { computeJournalStreak } from "@/lib/utils/journalStreak";
import JournalEditor from "@/components/journal/JournalEditor";
import JournalTimeline from "@/components/journal/JournalTimeline";
import Link from "next/link";

function loadUser(): UserProfile | null {
  const stored = loadProfileFromStorage();
  if (stored) return stored as UserProfile;
  const session = getSession();
  if (session?.name && session?.birthDate) {
    const calculated = calculateUserProfile(session.name, session.birthDate);
    return {
      ...calculated,
      birthPlace: session.birthPlace || "",
      birthTime: session.birthTime,
      goal: (session.goal as UserProfile["goal"]) || "life",
      interests: session.interests || [],
      onboardingStep: session.onboardingStep || 1,
      completedSections: session.completedSections || ["identity"],
      theme: (session.theme as UserProfile["theme"]) || "light",
      language: (session.language as UserProfile["language"]) || "es",
      notifications: session.notifications ?? true,
      cycles: calculated.cycles || { personalYear: 0, personalMonth: 0, personalDay: 0 },
      recommendations: calculated.recommendations || { strengths: [], challenges: [], practices: [] },
    } as UserProfile;
  }
  return null;
}

export default function JournalClient() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [contextualPrompt, setContextualPrompt] = useState<string | undefined>(undefined);
  const { entries, addEntry, updateEntry, deleteEntry, loading } = useJournal();

  useEffect(() => {
    const user = loadUser();
    if (user) setProfile(user);

    const prompt = new URLSearchParams(window.location.search).get("prompt");
    if (prompt) setContextualPrompt(prompt);
  }, []);

  const handleSave = async (
    data: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">
  ) => {
    if (editingEntry) {
      await updateEntry(editingEntry.id, data);
      setEditingEntry(null);
    } else {
      await addEntry(data);
    }
  };

  // Stats — instantáneas sobre las entradas reales, sin inventar nada.
  const stats = useMemo(() => {
    if (entries.length === 0) return null;
    const total = entries.length;
    const avgMood = entries.reduce((acc, curr) => acc + curr.mood, 0) / total;
    const uniqueDates = new Set(entries.map((e) => e.date)).size;
    const topTheme = () => {
      const counts = new Map<string, number>();
      entries.forEach((e) => {
        const theme = e.cycleContext?.dayEnergy?.theme;
        if (theme) counts.set(theme, (counts.get(theme) || 0) + 1);
      });
      return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    };
    return { total, avgMood, uniqueDates, topTheme: topTheme() };
  }, [entries]);

  const journalStreak = useMemo(() => computeJournalStreak(entries), [entries]);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-3xl px-4 sm:px-8 pt-16 sm:pt-24 pb-24" id="main-content">
        {/* Header */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-ink/10">
            <div className="max-w-2xl">
              <h1 className="font-display italic font-normal text-5xl sm:text-6xl lg:text-7xl text-foreground tracking-tight">
                Diario
              </h1>
              <p className="text-base sm:text-lg text-muted mt-3 leading-relaxed">
                Lo que escribís acá queda en este navegador. Nadie más lo lee.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {journalStreak >= 2 && (
                <span className="text-base italic text-muted">
                  {journalStreak} días seguidos escribiendo
                </span>
              )}
            </div>
          </div>

          {!profile && (
            <p className="mt-4 text-sm text-muted">
              Si creás tu mapa, cada página anota sola tu día y tu año personal.{" "}
              <Link href="/onboarding" className="text-foreground underline underline-offset-4 hover:no-underline">
                Crear mi mapa
              </Link>
            </p>
          )}
        </header>

        {/* Lo que va del cuaderno, en una frase — sin tablero de métricas. */}
        {stats && (
          <p className="mb-12 text-base italic text-muted">
            {stats.total} {stats.total === 1 ? "página" : "páginas"} en {stats.uniqueDates}{" "}
            {stats.uniqueDates === 1 ? "día" : "días"} · ánimo medio {stats.avgMood.toFixed(1)} de 5
            {stats.topTheme ? ` · lo que más aparece: ${stats.topTheme}` : ""}
          </p>
        )}

        {/* Una sola columna, como la hoja de un cuaderno: la página de hoy y
            debajo las anteriores. En dos columnas, con el historial vacío, en
            la PC se veía solo la mitad izquierda. */}
        <div className="space-y-16">
          <div className="space-y-6">
            {/* La key remonta el editor cuando cambia la página que se corrige:
                el texto vive en un useState, y sin remontar, "Editar" dejaba la
                hoja vacía en vez de traer lo escrito. */}
            <JournalEditor
              key={editingEntry?.id ?? "nueva"}
              profile={profile}
              onSaveEntry={handleSave}
              editingEntry={editingEntry}
              onCancelEdit={() => setEditingEntry(null)}
              contextualPrompt={contextualPrompt}
            />

            <p className="text-sm italic text-muted">Una frase alcanza.</p>

            <Link
              href="/hoy"
              className="inline-flex items-center gap-1.5 text-sm text-foreground underline underline-offset-4 hover:no-underline"
            >
              Ver mi energía de hoy →
            </Link>
          </div>

          <div>
            <JournalTimeline
              entries={entries}
              loading={loading}
              onEditEntry={(entry) => {
                setEditingEntry(entry);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onDeleteEntry={deleteEntry}
            />
          </div>
        </div>
      </main>
    </div>
  );
}