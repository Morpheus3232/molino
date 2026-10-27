"use client";
import { useL, type Pick2 } from "@/lib/i18n/useL";

import { Link } from "@/lib/i18n/navigation";
import type { EnrichedDailyEnergy } from "@/lib/hooks/useDailyEnergy";
import type { DailyEnergyResult } from "@/lib/engines/dailyEnergyEngine";
import type { JournalEntry } from "@/types/journal";
import { Briefcase, Heart, Palette, Scale } from "lucide-react";

interface DailyFocusProps {
  daily: EnrichedDailyEnergy;
  /** Entrada de Journal de hoy, si ya existe — cambia el CTA de "Anotar" a "Ver". */
  todayEntry?: JournalEntry;
  /** Racha de journaling (días consecutivos con entrada) — 0 o 1 no se muestra. */
  journalStreak?: number;
  className?: string;
}

type AreaKey = keyof DailyEnergyResult["areas"];

const AREA_META = (L: Pick2): Record<AreaKey, { name: string; icon: typeof Briefcase }> => ({
  work: { name: L("Trabajo", "Work"), icon: Briefcase },
  relationships: { name: L("Relaciones", "Relationships"), icon: Heart },
  creativity: { name: L("Creatividad", "Creativity"), icon: Palette },
  decisions: { name: L("Decisiones", "Decisions"), icon: Scale },
});

// Consejo genérico por área+nivel — no por día, para no fabricar precisión
// que el motor no calcula. Los niveles vienen de getAreaLabel() en
// dailyEnergyEngine.ts (calculateAreaScores) — 4 términos fijos.
const AREA_ADVICE = (L: Pick2): Record<AreaKey, Record<string, string>> => ({
  work: {
    "Muy favorable": L("Buen momento para avanzar en tareas grandes o cerrar pendientes importantes.", "A good moment to push forward on big tasks or wrap up important pending items."),
    "Favorable": L("El ritmo acompaña — es un buen día para el trabajo de rutina.", "The rhythm is on your side — it's a good day for routine work."),
    "Neutral": L("Ni especialmente favorable ni desafiante — priorizá lo que ya tenías planeado.", "Neither especially favorable nor challenging — prioritize what you'd already planned."),
    "Desafiante": L("Puede costar más de lo habitual — bajá las expectativas en vez de forzar.", "It may be harder than usual — lower your expectations instead of forcing it."),
  },
  relationships: {
    "Muy favorable": L("Buen día para conversaciones importantes o acercarte a alguien.", "A good day for important conversations or reaching out to someone."),
    "Favorable": L("Los vínculos fluyen con más facilidad que otros días.", "Relationships flow more easily than on other days."),
    "Neutral": L("Sin señal particular — dejate guiar por lo que la relación necesite.", "No particular signal — let yourself be guided by what the relationship needs."),
    "Desafiante": L("Cuidado con malentendidos — mejor escuchar más de lo que hablás.", "Watch out for misunderstandings — better to listen more than you talk."),
  },
  creativity: {
    "Muy favorable": L("Ideas y proyectos creativos tienen viento a favor hoy.", "Ideas and creative projects have the wind at their backs today."),
    "Favorable": L("Buen momento para explorar algo nuevo o jugar con una idea.", "A good moment to explore something new or play with an idea."),
    "Neutral": L("Sin impulso especial — la creatividad va a requerir más esfuerzo consciente.", "No special push — creativity will take more conscious effort."),
    "Desafiante": L("El bloqueo creativo es más probable — no te exijas producir hoy.", "Creative block is more likely — don't push yourself to produce today."),
  },
  decisions: {
    "Muy favorable": L("Tu criterio está más afilado de lo habitual — buen día para decidir.", "Your judgment is sharper than usual — a good day to decide."),
    "Favorable": L("Podés confiar en tu criterio para decisiones cotidianas.", "You can trust your judgment for everyday decisions."),
    "Neutral": L("Ni el mejor ni el peor momento para decidir — andá con calma.", "Neither the best nor the worst moment to decide — take it easy."),
    "Desafiante": L("Mejor posponer decisiones grandes si podés — la claridad no está a favor hoy.", "Better to postpone big decisions if you can — clarity isn't on your side today."),
  },
});

/**
 * Consejo del Momento — extraído de DailyFocus (Fase 6A) para poder
 * renderizarse más arriba en la jerarquía de /hoy (justo después del badge
 * de mapa cargado), sin duplicar el cálculo: sigue leyendo daily.dailyAdvice
 * / daily.orientationEvidence, que ahora derivan de buildOrientation()
 * (lib/utils/orientation.ts) en vez de una plantilla ad-hoc.
 */
export function MomentAdvice({ daily, todayEntry, journalStreak = 0, className = "" }: DailyFocusProps) {
  const L = useL();
  const journalHref = todayEntry
    ? "/journal"
    : `/journal?prompt=${encodeURIComponent(daily.dailyAdvice)}`;

  return (
    <div className={`border-2 border-ink p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${className}`}>
      <div className="lg:col-span-8">
        <p className="text-sm text-muted label-caps">{L("Consejo del Momento", "Advice for the Moment")}</p>
        <blockquote className="mt-4 font-display text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.12] text-foreground">
          &ldquo;{daily.dailyAdvice}&rdquo;
        </blockquote>
        {daily.orientationEvidence && daily.orientationEvidence.length > 0 && (
          <p className="mt-5 flex flex-wrap gap-x-6 gap-y-1 text-base text-muted">
            {daily.orientationEvidence.map((e) => (
              <span key={e.label}>
                {e.label}: <span className="text-foreground">{e.value}</span>
              </span>
            ))}
          </p>
        )}
        {journalStreak >= 2 && (
          <p className="mt-3 text-base text-muted">{L(<>{journalStreak} días seguidos escribiendo en tu diario.</>, <>{journalStreak} days in a row writing in your journal.</>)}</p>
        )}
      </div>
      <div className="lg:col-span-4 lg:justify-self-end">
        <Link
          href={journalHref}
          className="inline-flex w-full sm:w-auto items-center justify-center px-8 py-4 bg-vermilion text-paper text-sm font-bold hover:bg-vermilion-hover transition-colors label-caps"
        >
          {todayEntry ? L("Ver tu entrada de hoy", "See today's entry") : L("Anotar en mi diario", "Write in my journal")}
        </Link>
      </div>
    </div>
  );
}

export default function DailyFocus({ daily, className = "" }: Omit<DailyFocusProps, "todayEntry" | "journalStreak">) {
  const L = useL();
  return (
    <div className={className}>
      {/* A favor / a observar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ink/15 border border-ink/15">
        <div className="bg-background p-8 sm:p-10 border-t-4 border-t-vermilion">
          <p className="text-sm text-muted label-caps">{L("Favorable hoy", "Favorable today")}</p>
          <h3 className="mt-3 font-display text-3xl text-foreground">{L("Acción recomendada", "Recommended action")}</h3>
          <p className="mt-3 text-lg text-foreground/90 leading-relaxed">{daily.focusAction}</p>
        </div>
        <div className="bg-background p-8 sm:p-10 border-t-4 border-t-ink">
          <p className="text-sm text-muted label-caps">{L("Observar hoy", "Watch today")}</p>
          <h3 className="mt-3 font-display text-3xl text-foreground">{L("Punto de fricción a posponer", "Friction point to postpone")}</h3>
          <p className="mt-3 text-lg text-foreground/90 leading-relaxed">{daily.avoidAction}</p>
        </div>
      </div>

      {/* Áreas del día: el desglose que calcula el motor (calculateAreaScores) */}
      <h3 className="mt-14 font-display text-3xl text-foreground">{L("Áreas del día", "Areas of the day")}</h3>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ink/15 border border-ink/15">
        {(Object.keys(AREA_META(L)) as AreaKey[]).map((key) => {
          const area = daily.areas[key];
          const { name, icon: Icon } = AREA_META(L)[key];
          const advice = AREA_ADVICE(L)[key][area.label] || AREA_ADVICE(L)[key]["Neutral"];
          const strong = area.label === "Muy favorable" || area.label === "Favorable";
          return (
            <div key={key} className="bg-background p-6 sm:p-7">
              <div className="flex items-center gap-2.5">
                <Icon className="w-5 h-5 text-foreground shrink-0" aria-hidden="true" />
                <span className="font-display text-2xl text-foreground">{name}</span>
              </div>
              <p className={`mt-3 text-base ${strong ? "text-vermilion" : "text-muted"}`}>{area.label}</p>
              <p className="mt-2 text-base text-foreground/80 leading-relaxed">{advice}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
