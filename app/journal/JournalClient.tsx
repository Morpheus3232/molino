"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import type { JournalEntry } from "@/types/journal";
import { loadProfileFromStorage } from "@/lib/session/localStorage";
import { getSession } from "@/lib/session/ephemeral";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import { useJournal } from "@/lib/hooks/useJournal";
import JournalEditor from "@/components/journal/JournalEditor";
import JournalTimeline from "@/components/journal/JournalTimeline";
import { BookOpen, ShieldCheck, Sparkles, Heart, Activity } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";

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
  // Pregunta contextual pasada desde /hoy (?prompt=...) — leída directo de
  // window.location en vez de useSearchParams para no forzar un boundary de
  // Suspense en una página que hoy no lo necesita (mismo patrón que
  // getSearchParam en PremiumGate.tsx).
  const [contextualPrompt, setContextualPrompt] = useState<string | undefined>(undefined);
  const {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
    loading,
    storageSizeKB,
    exportEntriesJSON,
    importEntriesJSON,
  } = useJournal();

  useEffect(() => {
    const user = loadUser();
    if (user) setProfile(user);

    const prompt = new URLSearchParams(window.location.search).get("prompt");
    if (prompt) setContextualPrompt(prompt);
  }, []);

  const handleExport = () => {
    const jsonStr = exportEntriesJSON();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `molino-journal-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

  // Stats calculation
  const stats = useMemo(() => {
    if (entries.length === 0) return null;
    const total = entries.length;
    const avgMood = (
      entries.reduce((acc, curr) => acc + curr.mood, 0) / total
    ).toFixed(1);
    const uniqueDates = new Set(entries.map((e) => e.date)).size;

    return { total, avgMood, uniqueDates };
  }, [entries]);

  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24 pb-24">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        {/* Page Hero */}
        <header className="mb-10 sm:mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-ink/10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-semibold">
                  Registro & Autoconocimiento
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground uppercase tracking-tight">
                Journal de Autoconocimiento
              </h1>
              <p className="text-sm sm:text-base text-muted max-w-2xl mt-2 leading-relaxed">
                Registrá cómo te sentís día a día y descubrí cómo interactúan tus emociones y
                decisiones con tus ciclos numerológicos y astrológicos.
              </p>
            </div>

            {/* Quick Metrics Strip */}
            <div className="flex flex-wrap items-center gap-3">
              {stats ? (
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-card border border-ink/10 text-xs font-mono">
                  <div className="px-2 py-1 bg-ink/5 rounded">
                    <span className="text-accent font-bold">{stats.total}</span>{" "}
                    <span className="text-muted">entradas</span>
                  </div>
                  <div className="px-2 py-1 bg-ink/5 rounded">
                    <span className="text-amber-700 font-bold">{stats.avgMood}</span>{" "}
                    <span className="text-muted">promedio</span>
                  </div>
                </div>
              ) : null}

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% privado en tu navegador</span>
              </div>
            </div>
          </div>

          {/* Profile Notice if no profile yet */}
          {!profile && (
            <div className="mt-4 p-3.5 rounded-xl bg-accent/5 border border-accent/20 flex items-center justify-between flex-wrap gap-3 text-xs">
              <span className="text-muted">
                Para cruzar automáticamente tus entradas con tu Camino de Vida y año personal, calculá tu mapa.
              </span>
              <Link href="/onboarding">
                <Button variant="accent" size="sm">
                  Calcular mi mapa
                </Button>
              </Link>
            </div>
          )}
        </header>

        {/* Main Grid: Editor on top/left, Timeline on right/bottom */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Editor Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <JournalEditor
              profile={profile}
              onSaveEntry={handleSave}
              editingEntry={editingEntry}
              onCancelEdit={() => setEditingEntry(null)}
              contextualPrompt={contextualPrompt}
            />

            {/* Reflection Tip Card */}
            <div className="p-5 rounded-2xl bg-card border border-ink/5 text-xs text-muted leading-relaxed space-y-2">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-accent font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Consejo de registro</span>
              </div>
              <p>
                No necesitás escribir párrafos largos. Una frase sobre cómo te sentís o qué decisión tomaste
                hoy es suficiente para ofrecer una perspectiva sobre patrones cuando mires hacia atrás.
              </p>
            </div>
          </div>

          {/* Timeline & Analysis Column */}
          <div className="lg:col-span-7">
            <JournalTimeline
              entries={entries}
              loading={loading}
              storageSizeKB={storageSizeKB}
              onEditEntry={(entry) => {
                setEditingEntry(entry);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onDeleteEntry={deleteEntry}
              onExportJSON={handleExport}
              onImportJSON={importEntriesJSON}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
