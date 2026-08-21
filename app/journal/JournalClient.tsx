"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import type { JournalEntry } from "@/types/journal";
import { loadProfileFromStorage } from "@/lib/session/localStorage";
import { getSession } from "@/lib/session/ephemeral";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import { useJournal } from "@/lib/hooks/useJournal";
import { computeJournalStreak } from "@/lib/utils/journalStreak";
import JournalEditor from "@/components/journal/JournalEditor";
import JournalTimeline from "@/components/journal/JournalTimeline";
import CountUp from "@/components/ui/CountUp";
import { BookOpen, ShieldCheck, Sparkles, Flame } from "lucide-react";
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
      <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-24" id="main-content">
        {/* Header */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-ink/10">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-accent" />
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
                  Registro & Autoconocimiento
                </span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground tracking-tight">
                Journal
              </h1>
              <p className="text-sm sm:text-base text-muted mt-2 leading-relaxed">
                Registrá cómo te sentís día a día y descubrí cómo interactúan tus emociones y
                decisiones con tus ciclos numerológicos y astrológicos.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {journalStreak >= 2 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-700 text-xs font-mono font-bold">
                  <Flame className="w-3.5 h-3.5" />
                  {journalStreak} días seguidos
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% privado en tu navegador
              </span>
            </div>
          </div>

          {!profile && (
            <div className="mt-4 p-4 rounded-xl bg-accent/5 border border-accent/20 flex items-center justify-between flex-wrap gap-3 text-xs">
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

        {/* Stats strip — Wrapped style, dinámico desde entradas reales */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12"
          >
            <div className="p-5 rounded-xl bg-card border border-ink/10">
              <p className="font-mono text-[9px] uppercase tracking-wider text-muted block mb-1">Entradas</p>
              <p className="font-heading text-2xl font-bold text-foreground">
                <CountUp target={stats.total} />
              </p>
            </div>
            <div className="p-5 rounded-xl bg-card border border-ink/10">
              <p className="font-mono text-[9px] uppercase tracking-wider text-muted mb-1">Energía media</p>
              <p className="font-heading text-2xl font-bold text-foreground">
                <CountUp target={stats.avgMood} format={(n) => n.toFixed(1)} />
              </p>
            </div>
            <div className="p-5 rounded-xl bg-card border border-ink/10">
              <p className="font-mono text-[9px] uppercase tracking-wider text-muted mb-1">Días únicos</p>
              <p className="font-heading text-2xl font-bold text-foreground">
                <CountUp target={stats.uniqueDates} />
              </p>
            </div>
            <div className="p-5 rounded-xl bg-card border border-ink/10">
              <p className="font-mono text-[9px] uppercase tracking-wider text-muted mb-1">Tema destacado</p>
              <p className="font-heading text-lg font-bold text-foreground truncate">
                {stats.topTheme || "—"}
              </p>
            </div>
          </motion.div>
        )}

        {/* Main Grid: Editor on left, Timeline on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <JournalEditor
              profile={profile}
              onSaveEntry={handleSave}
              editingEntry={editingEntry}
              onCancelEdit={() => setEditingEntry(null)}
              contextualPrompt={contextualPrompt}
            />

            {/* Reflection Tip Card */}
            <div className="p-6 rounded-xl bg-card border border-ink/5 text-xs text-muted leading-relaxed space-y-2">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-accent font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Consejo de registro</span>
              </div>
              <p>
                No necesitás escribir párrafos largos. Una frase sobre cómo te sentís o qué decisión tomaste
                hoy es suficiente para ofrecer una perspectiva sobre patrones cuando mires hacia atrás.
              </p>
            </div>

            <Link
              href="/hoy"
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-accent font-medium hover:text-accent/80 transition-colors"
            >
              Explorá cómo tus ciclos de hoy influyen en tu energía →
            </Link>
          </div>

          {/* Timeline & Analysis Column */}
          <div className="lg:col-span-7">
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