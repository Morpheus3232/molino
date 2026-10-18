"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useProfile } from "@/lib/hooks/useProfile";
import { useDailyEnergy } from "@/lib/hooks/useDailyEnergy";
import { getCalendarDayContent, getDateNumberBreakdown, formatDateNumberBreakdown } from "@/lib/numerology/calendar";
import { toLocalDateKey } from "@/lib/session/dailyHistory";

/**
 * El día de la portada contado como un capítulo de libro, no como un
 * tablero: epígrafe, capítulos con número romano, capitular, índices con
 * puntos guía y asterismo entre partes. Mismos datos que /hoy (que conserva
 * su vista de detalle); acá no hay cajas, íconos ni pastillas.
 */

const AREAS: { key: "work" | "relationships" | "creativity" | "decisions"; name: string }[] = [
  { key: "work", name: "Trabajo" },
  { key: "relationships", name: "Vínculos" },
  { key: "creativity", name: "Creatividad" },
  { key: "decisions", name: "Decisiones" },
];

function Chapter({ numeral, title, id }: { numeral: string; title: string; id: string }) {
  return (
    <header className="text-center mb-6">
      <p className="text-sm text-muted label-caps" aria-hidden="true">
        {numeral}
      </p>
      <h3 id={id} className="mt-1 font-display italic font-normal text-2xl sm:text-3xl text-foreground">
        {title}
      </h3>
    </header>
  );
}

/** Renglón de índice: "Trabajo ········ neutral", como la tabla de contenidos de un libro. */
function Leader({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <li className="flex items-baseline gap-2">
      <span className="shrink-0">{left}</span>
      <span className="flex-1 min-w-4 border-b border-dotted border-ink/40 translate-y-[-0.3em]" aria-hidden="true" />
      <span className="shrink-0 italic text-right">{right}</span>
    </li>
  );
}

function Asterism() {
  return (
    <p className="my-12 text-center text-xl text-muted select-none" aria-hidden="true">
      ⁂
    </p>
  );
}

export default function HomeBook() {
  const { profile, mounted, loading } = useProfile({ redirectIfNotFound: false });
  // Sin perfil devuelve la energía universal del día (igual para todos).
  const daily = useDailyEnergy(profile);

  const todayKey = useMemo(() => toLocalDateKey(new Date()), []);
  const dayContent = useMemo(() => getCalendarDayContent(todayKey), [todayKey]);
  const breakdown = useMemo(() => formatDateNumberBreakdown(getDateNumberBreakdown(todayKey)), [todayKey]);

  if (!mounted || loading || !daily) {
    return (
      <p className="sr-only" role="status" aria-live="polite">
        Cargando el día…
      </p>
    );
  }

  return (
    <article className="mx-auto max-w-[38rem] text-lg leading-[1.75] text-foreground">
      {/* Epígrafe: el consejo del momento, como abren los capítulos. */}
      <blockquote className="ml-auto max-w-[26rem] text-right italic text-muted">
        <p>&laquo;{daily.dailyAdvice}&raquo;</p>
        <footer className="mt-1 text-base not-italic">— consejo del día · luna {daily.moonPhase.phase.toLowerCase()}</footer>
      </blockquote>

      <Asterism />

      <section aria-labelledby="cap-numero">
        <Chapter numeral="I" title="El número del día" id="cap-numero" />
        <p className="sm:text-justify hyphens-auto first-letter:float-left first-letter:font-display first-letter:text-[3.6em] first-letter:leading-[0.78] first-letter:mr-2 first-letter:mt-1">
          Hoy es día {dayContent.number}, el de <em>{dayContent.title.toLowerCase().replace(/^\w|^./, (c) => c.toUpperCase())}</em>.{" "}
          {dayContent.description}
        </p>
        <p className="mt-4 text-sm text-muted">
          <span className="italic">La cuenta:</span> <span className="font-mono">{breakdown}</span>.{" "}
          <Link href="/calendario" className="underline underline-offset-4 hover:no-underline">
            Ver el calendario del mes
          </Link>
        </p>
      </section>

      <Asterism />

      <section aria-labelledby="cap-trae">
        <Chapter numeral="II" title="Lo que trae" id="cap-trae" />
        <p className="sm:text-justify hyphens-auto">
          <em>{daily.theme}.</em> {daily.description}
        </p>
        <p className="mt-4 sm:text-justify hyphens-auto">
          <em>Conviene</em> {daily.focusAction.charAt(0).toLowerCase() + daily.focusAction.slice(1)}{" "}
          <em>Mejor evitar</em> {daily.avoidAction.charAt(0).toLowerCase() + daily.avoidAction.slice(1)}
        </p>
        {daily.isPersonalized && (
          <p className="mt-4 text-base italic text-muted">
            En tu mapa: año personal {daily.personalYear}, mes {daily.personalMonth}, día {daily.personalDay}.
          </p>
        )}
        <ul className="mt-6 space-y-1 text-base" aria-label="Cómo viene cada área">
          {AREAS.map(({ key, name }) => (
            <Leader key={key} left={name} right={daily.areas[key].label.toLowerCase()} />
          ))}
        </ul>
      </section>

      {daily.nextDaysForecast?.length > 0 && (
        <>
          <Asterism />
          <section aria-labelledby="cap-dias">
            <Chapter numeral="III" title="Los próximos días" id="cap-dias" />
            <ul className="space-y-1 text-base">
              {daily.nextDaysForecast.map((d) => (
                <Leader
                  key={d.date}
                  left={
                    <>
                      {d.dayName} {d.dayNumber}
                    </>
                  }
                  right={`día ${d.personalDay}, ${d.theme.toLowerCase()}`}
                />
              ))}
            </ul>
          </section>
        </>
      )}

      <Asterism />

      <p className="text-center italic">
        ¿Qué te deja el día?{" "}
        <Link href={`/journal?prompt=${encodeURIComponent(daily.dailyAdvice)}`} className="not-italic underline underline-offset-4 hover:no-underline">
          Escribilo en tu diario
        </Link>
        {!profile && (
          <>
            {" "}o{" "}
            <Link href="/onboarding" className="not-italic underline underline-offset-4 hover:no-underline">
              creá tu mapa
            </Link>{" "}
            para sumar tu año personal
          </>
        )}
        .
      </p>
    </article>
  );
}
