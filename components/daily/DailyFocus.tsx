"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { EnrichedDailyEnergy } from "@/lib/hooks/useDailyEnergy";
import type { DailyEnergyResult } from "@/lib/engines/dailyEnergyEngine";
import type { JournalEntry } from "@/types/journal";
import {
  Target,
  AlertOctagon,
  Compass,
  BookOpen,
  Sparkles,
  ArrowRight,
  Flame,
  Briefcase,
  Heart,
  Palette,
  Scale,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { getScoreColor } from "@/lib/utils/score";

interface DailyFocusProps {
  daily: EnrichedDailyEnergy;
  /** Entrada de Journal de hoy, si ya existe — cambia el CTA de "Anotar" a "Ver". */
  todayEntry?: JournalEntry;
  /** Racha de journaling (días consecutivos con entrada) — 0 o 1 no se muestra. */
  journalStreak?: number;
  className?: string;
}

type AreaKey = keyof DailyEnergyResult["areas"];

const AREA_META: Record<AreaKey, { name: string; icon: typeof Briefcase }> = {
  work: { name: "Trabajo", icon: Briefcase },
  relationships: { name: "Relaciones", icon: Heart },
  creativity: { name: "Creatividad", icon: Palette },
  decisions: { name: "Decisiones", icon: Scale },
};

// Consejo genérico por área+nivel — no por día, para no fabricar precisión
// que el motor no calcula. Los niveles vienen de getAreaLabel() en
// dailyEnergyEngine.ts (calculateAreaScores) — 4 términos fijos.
const AREA_ADVICE: Record<AreaKey, Record<string, string>> = {
  work: {
    "Muy favorable": "Buen momento para avanzar en tareas grandes o cerrar pendientes importantes.",
    "Favorable": "El ritmo acompaña — es un buen día para el trabajo de rutina.",
    "Neutral": "Ni especialmente favorable ni desafiante — priorizá lo que ya tenías planeado.",
    "Desafiante": "Puede costar más de lo habitual — bajá las expectativas en vez de forzar.",
  },
  relationships: {
    "Muy favorable": "Buen día para conversaciones importantes o acercarte a alguien.",
    "Favorable": "Los vínculos fluyen con más facilidad que otros días.",
    "Neutral": "Sin señal particular — dejate guiar por lo que la relación necesite.",
    "Desafiante": "Cuidado con malentendidos — mejor escuchar más de lo que hablás.",
  },
  creativity: {
    "Muy favorable": "Ideas y proyectos creativos tienen viento a favor hoy.",
    "Favorable": "Buen momento para explorar algo nuevo o jugar con una idea.",
    "Neutral": "Sin impulso especial — la creatividad va a requerir más esfuerzo consciente.",
    "Desafiante": "El bloqueo creativo es más probable — no te exijas producir hoy.",
  },
  decisions: {
    "Muy favorable": "Tu criterio está más afilado de lo habitual — buen día para decidir.",
    "Favorable": "Podés confiar en tu criterio para decisiones cotidianas.",
    "Neutral": "Ni el mejor ni el peor momento para decidir — andá con calma.",
    "Desafiante": "Mejor posponer decisiones grandes si podés — la claridad no está a favor hoy.",
  },
};

export default function DailyFocus({ daily, todayEntry, journalStreak = 0, className = "" }: DailyFocusProps) {
  const journalHref = todayEntry
    ? "/journal"
    : `/journal?prompt=${encodeURIComponent(daily.dailyAdvice)}`;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 2-Card Grid: Focus vs Avoid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* Card 1: Focus */}
        <div className="rounded-3xl border border-emerald-500/25 bg-card p-6 sm:p-7 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>Tu foco de hoy</span>
          </div>
          <h4 className="font-heading text-base sm:text-lg font-bold text-foreground">
            Acción recomendada
          </h4>
          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
            {daily.focusAction}
          </p>
        </div>

        {/* Card 2: Avoid */}
        <div className="rounded-3xl border border-rose-500/25 bg-card p-6 sm:p-7 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
            <AlertOctagon className="w-4 h-4" />
            <span>Evitá hoy</span>
          </div>
          <h4 className="font-heading text-base sm:text-lg font-bold text-foreground">
            Punto de fricción a posponer
          </h4>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            {daily.avoidAction}
          </p>
        </div>
      </div>

      {/* Favorece Hoy: desglose por área — daily.areas ya lo calculaba el
          motor (calculateAreaScores) pero no se renderizaba en ningún lado. */}
      <div className="rounded-3xl border border-ink/10 bg-card p-6 sm:p-7 space-y-4">
        <div className="flex items-center gap-2 text-accent font-mono text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Favorece hoy</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {(Object.keys(AREA_META) as AreaKey[]).map((key) => {
            const area = daily.areas[key];
            const { name, icon: Icon } = AREA_META[key];
            const advice = AREA_ADVICE[key][area.label] || AREA_ADVICE[key]["Neutral"];
            return (
              <div key={key} className="p-4 rounded-2xl bg-background/70 border border-ink/5 space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-accent shrink-0" />
                  <span className="font-heading text-xs font-bold text-foreground">{name}</span>
                </div>
                <span
                  className="inline-block text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${getScoreColor(area.score)}20`, color: getScoreColor(area.score) }}
                >
                  {area.label}
                </span>
                <p className="text-[11px] text-muted leading-relaxed">{advice}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Advice & Journal Callout Banner */}
      <div className="rounded-3xl border border-ink/10 bg-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2 text-accent font-mono text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Consejo del Momento</span>
          </div>
          <blockquote className="text-xs sm:text-sm text-foreground/90 italic leading-relaxed border-l-2 border-accent pl-3 py-0.5">
            &ldquo;{daily.dailyAdvice}&rdquo;
          </blockquote>
          {journalStreak >= 2 && (
            <p className="inline-flex items-center gap-1.5 text-[11px] font-mono text-amber-400">
              <Flame className="w-3.5 h-3.5" />
              {journalStreak} días escribiendo en tu Journal
            </p>
          )}
        </div>

        {/* Journal CTA */}
        <div className="flex-shrink-0">
          <Link href={journalHref}>
            <Button
              variant="accent"
              size="md"
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-bold px-5 py-3 shadow-md"
            >
              <BookOpen className="w-4 h-4" />
              <span>{todayEntry ? "Ver tu entrada de hoy" : "Anotar en mi Journal"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
