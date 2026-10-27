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
import { Link } from "@/lib/i18n/navigation";
import Image from "next/image";
import { SectionCredit } from "@/components/ui/SectionCover";
import { getSectionImage } from "@/lib/data/section-images";
import { Breadcrumb, CONTAINER } from "@/components/knowledge/Kit";

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

  const cover = getSectionImage("paginas/journal");

  return (
    <main id="main-content" className="bg-background">
      {/* Portada: el cuaderno y lo que lleva escrito */}
      <header className="border-b border-ink/10">
        <div className={`${CONTAINER} pt-12 sm:pt-16 pb-16 sm:pb-20`}>
          <Breadcrumb items={[{ href: "/", label: "Inicio" }, { label: "Diario" }]} />
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-10 items-center">
            <div className="lg:col-span-7">
              <p className="text-sm text-accent mb-4 label-caps">Diario · se guarda solo en este navegador</p>
              <h1 className="font-display font-normal text-[clamp(3.5rem,9vw,7rem)] leading-[0.92] tracking-tight text-foreground">
                Diario
              </h1>
              <p className="mt-6 text-xl sm:text-2xl text-foreground/85 leading-snug max-w-xl">
                Una página por día. Cada una anota sola tu día personal, el tema y la luna, para que con el tiempo veas
                qué se repite. Nadie más la lee.
              </p>

              {stats ? (
                <dl className="mt-10 grid grid-cols-3 gap-px bg-ink/15 border border-ink/15 max-w-xl">
                  {[
                    { k: stats.total === 1 ? "Página" : "Páginas", v: String(stats.total) },
                    { k: stats.uniqueDates === 1 ? "Día escrito" : "Días escritos", v: String(stats.uniqueDates) },
                    journalStreak >= 2
                      ? { k: "Días seguidos", v: String(journalStreak) }
                      : { k: "Ánimo medio", v: `${stats.avgMood.toFixed(1)}/5` },
                  ].map((c) => (
                    <div key={c.k} className="bg-background p-5">
                      <dd className="font-display text-4xl sm:text-5xl leading-none text-foreground tabular-nums">{c.v}</dd>
                      <dt className="mt-2 text-sm text-muted">{c.k}</dt>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="mt-8 text-base text-muted max-w-xl">Todavía no hay páginas. La primera es la de hoy, acá abajo.</p>
              )}
              {stats?.topTheme && (
                <p className="mt-4 text-base text-muted">
                  Lo que más aparece en tus días: <span className="text-foreground">{stats.topTheme}</span>.
                </p>
              )}
              {!profile && (
                <p className="mt-6 text-base text-muted max-w-xl">
                  Con tu mapa creado, cada página anota sola tu día y tu año personal.{" "}
                  <Link href="/onboarding" className="text-foreground underline underline-offset-4 hover:no-underline">
                    Crear mi mapa
                  </Link>
                </p>
              )}
            </div>
            {cover && (
              <figure className="lg:col-span-5">
                <div className="relative aspect-[16/9] lg:aspect-[4/5] lg:max-h-[34rem] mx-auto overflow-hidden border border-ink/15 bg-paper-alt">
                  <Image src={cover.src} alt={cover.alt} fill priority sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
                </div>
                <SectionCredit img={cover} />
              </figure>
            )}
          </div>
        </div>
      </header>

      {/* La hoja de hoy (o la que se corrige), con notas al margen */}
      <section id="hoja" className="bg-background border-b border-ink/10 scroll-mt-20">
        <div className={`${CONTAINER} py-16 sm:py-20`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-10">
            <div className="lg:col-span-8">
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
            </div>
            <aside className="lg:col-span-4 lg:pt-2">
              <div className="lg:sticky lg:top-28 border-t-2 border-ink">
                <dl className="divide-y divide-ink/15">
                  {[
                    { k: "Una frase alcanza", v: "No hace falta escribir mucho: lo que importa es volver mañana." },
                    { k: "Se anota solo", v: "La fecha, tu día personal, el tema del día y la fase de la luna quedan guardados con la página." },
                    { k: "Solo en este navegador", v: "No sube a ningún servidor. Si borrás los datos del navegador, se borra el diario." },
                  ].map((r) => (
                    <div key={r.k} className="py-5">
                      <dt className="font-display text-xl text-foreground">{r.k}</dt>
                      <dd className="mt-1 text-base text-muted leading-relaxed">{r.v}</dd>
                    </div>
                  ))}
                </dl>
                <Link href="/hoy" className="mt-2 inline-block text-base text-foreground underline underline-offset-4 hover:no-underline">
                  Ver mi energía de hoy
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Las páginas anteriores */}
      {(loading || entries.length > 0) && (
        <section className="bg-paper-alt/70 border-b border-ink/10">
          <div className={`${CONTAINER} py-16 sm:py-24`}>
            <p className="text-sm text-muted mb-3 label-caps">El cuaderno</p>
            <h2 className="section-title text-foreground">Las páginas anteriores</h2>
            <div className="mt-10">
              <JournalTimeline
                entries={entries}
                loading={loading}
                onEditEntry={(entry) => {
                  setEditingEntry(entry);
                  document.getElementById("hoja")?.scrollIntoView({ behavior: "smooth" });
                }}
                onDeleteEntry={deleteEntry}
              />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
