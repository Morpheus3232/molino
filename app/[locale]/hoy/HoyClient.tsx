"use client";
import { useL } from "@/lib/i18n/useL";

import { useMemo, type ReactNode } from "react";
import { Link } from "@/lib/i18n/navigation";
import { useProfile } from "@/lib/hooks/useProfile";
import { useDailyEnergy } from "@/lib/hooks/useDailyEnergy";
import { useStreak } from "@/lib/hooks/useStreak";
import { useJournal } from "@/lib/hooks/useJournal";
import { computeJournalStreak, findEntryForDate } from "@/lib/utils/journalStreak";
import { toLocalDateKey } from "@/lib/session/dailyHistory";
import { getCalendarDayContent, getDateNumberBreakdown, formatDateNumberBreakdown } from "@/lib/numerology/calendar";
import DailyEnergyCard from "@/components/daily/DailyEnergyCard";
import PersonalCyclesSection from "@/components/daily/PersonalCyclesSection";
import DailyFocus, { MomentAdvice } from "@/components/daily/DailyFocus";
import WeekPreview from "@/components/daily/WeekPreview";
import NineDial, { DIAL_MARKS } from "@/components/daily/NineDial";
import { Breadcrumb, CONTAINER, KnowledgeSection } from "@/components/knowledge/Kit";
import SectionCover from "@/components/ui/SectionCover";

/**
 * /hoy en el lenguaje de Mi Mapa: el número del día en un cuadrante de nueve
 * con la cuenta a la vista, el consejo del momento, qué hacer con el día, tu
 * año personal y los próximos días. El h1 llega armado desde page.tsx (Server
 * Component) y se pinta siempre; lo que depende de la fecha local espera al
 * navegador.
 */
export default function HoyClient({ heading }: { heading: ReactNode }) {
  const L = useL();
  const { profile, mounted, loading } = useProfile({ redirectIfNotFound: false });
  const { streakDays, badge } = useStreak();
  const { entries: journalEntries } = useJournal();
  const ready = mounted && !loading;

  const todayKey = useMemo(() => (ready ? toLocalDateKey(new Date()) : null), [ready]);
  const todayEntry = todayKey ? findEntryForDate(journalEntries, todayKey) : undefined;
  const journalStreak = computeJournalStreak(journalEntries);
  const today = useMemo(() => (todayKey ? getCalendarDayContent(todayKey) : null), [todayKey]);
  const breakdown = useMemo(() => (todayKey ? getDateNumberBreakdown(todayKey) : null), [todayKey]);

  // Sin perfil, useDailyEnergy devuelve la energía universal del día.
  const daily = useDailyEnergy(profile);
  const personal = Boolean(daily?.isPersonalized && profile);

  const formattedToday = ready
    ? new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })
    : L("Hoy", "Today");

  return (
    <main id="main-content" className="bg-background">
      <header className="border-b border-ink/10">
        <div className={`${CONTAINER} pt-12 sm:pt-16 pb-16 sm:pb-24`}>
          <Breadcrumb items={[{ href: "/", label: L("Inicio", "Home") }, { href: "/calendario", label: L("Calendario", "Calendar") }, { label: L("Hoy", "Today") }]} />
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-10 items-center">
            <div className="lg:col-span-6">
              <p className="text-sm text-accent mb-4 label-caps first-letter:uppercase">
                {L.t(formattedToday)}
                {L.t(ready && (personal ? L(` · mapa de ${profile?.name || profile?.archetype}`, ` · ${L.t(profile?.name || profile?.archetype)}'s map`) : L(" · energía universal del día", " · universal energy of the day")))}
              </p>
              {L.t(heading)}

              {ready && today && breakdown ? (
                <>
                  <p className="mt-8 font-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.1] text-foreground">{L(<>
                    Día {today.number}: {L.t(today.title)}.
                  </>, <>Day {today.number}: {L.t(today.title)}.</>)}</p>
                  <p className="mt-4 text-xl text-foreground/85 leading-snug max-w-xl">{L.t(today.description)}</p>

                  <div className="mt-8 max-w-xl border-l-2 border-ink pl-5">
                    <p className="text-sm text-muted">{L("La cuenta con la fecha de hoy", "The math with today's date")}</p>
                    <p className="mt-1 font-mono tabular-nums text-lg text-foreground break-words">
                      {L.t(formatDateNumberBreakdown(breakdown))}
                    </p>
                    {(breakdown.isMaster || breakdown.isAbundance) && (
                      <p className="mt-1 text-base text-muted">
                        {breakdown.isMaster ? L("Número maestro: no se reduce.", "Master number: not reduced.") : L("El 28, número de la abundancia: no se reduce.", "28, the number of abundance: not reduced.")}
                      </p>
                    )}
                  </div>

                  <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/10 max-w-xl">
                    {[
                      { mark: DIAL_MARKS.day, text: <>{L(<>En negro, el número del día, igual para todos: <span className="text-foreground">{today.number}</span>.</>, <>In black, the number of the day, the same for everyone: <span className="text-foreground">{today.number}</span>.</>)}</> },
                      ...(personal && daily
                        ? [
                            { mark: DIAL_MARKS.personalDay, text: <>{L(<>El punto rojo, tu Día Personal, que suma tu fecha de nacimiento: <span className="text-foreground">{L.t(daily.personalDay)}</span>.</>, <>The red dot, your Personal Day, which adds in your date of birth: <span className="text-foreground">{L.t(daily.personalDay)}</span>.</>)}</> },
                            { mark: DIAL_MARKS.personalYear, text: <>{L(<>El anillo, tu Año Personal: <span className="text-foreground">{daily.personalYear}</span>.</>, <>The ring, your Personal Year: <span className="text-foreground">{daily.personalYear}</span>.</>)}</> },
                          ]
                        : []),
                    ].map((row, i) => (
                      <div key={i} className="grid grid-cols-[2.5rem_1fr] gap-x-4 py-3 items-start">
                        <dt className="pt-0.5" aria-hidden="true">{L.t(row.mark)}</dt>
                        <dd className="text-base leading-snug text-muted">{L.t(row.text)}</dd>
                      </div>
                    ))}
                  </dl>
                  {!personal && (
                    <p className="mt-6 text-base text-muted max-w-xl">{L(<>
                      Con tu mapa, la rueda suma tu Día y tu Año Personal.{" "}
                      <Link href="/onboarding" className="text-foreground underline underline-offset-4 hover:no-underline">
                        Crear mi mapa
                      </Link>
                    </>, <>With your map, the wheel adds your Personal Day and Year.{" "}<Link href="/onboarding" className="text-foreground underline underline-offset-4 hover:no-underline">Create my map</Link></>)}</p>
                  )}
                </>
              ) : (
                <div className="mt-8 space-y-3 max-w-xl animate-pulse" aria-hidden="true">
                  <div className="h-10 bg-ink/5 w-4/5" />
                  <div className="h-6 bg-ink/5" />
                  <div className="h-6 bg-ink/5 w-2/3" />
                </div>
              )}
              {!ready && <p className="sr-only" role="status">{L("Cargando tu energía del día…", "Loading your energy for the day…")}</p>}
            </div>

            <div className="lg:col-span-6">
              {ready && today ? (
                <NineDial
                  key={today.number}
                  day={today.number}
                  personalDay={personal ? daily?.personalDay : null}
                  personalYear={personal ? daily?.personalYear : null}
                  ariaLabel={L(`Cuadrante del ciclo de nueve con el ${today.number} marcado${personal && daily ? `, tu Día Personal ${daily.personalDay} y tu Año Personal ${daily.personalYear}` : ""}.`, `Dial of the cycle of nine with ${today.number} marked${personal && daily ? `, your Personal Day ${L.t(daily.personalDay)} and your Personal Year ${daily.personalYear}` : ""}.`)}
                  className="mx-auto max-w-[34rem]"
                />
              ) : (
                <div className="mx-auto max-w-[34rem] aspect-square rounded-full border border-ink/15" aria-hidden="true" />
              )}
            </div>
          </div>
        </div>
      </header>

      {ready && daily && (
        <>
          {/* Consejo del momento: lo primero que se hace con el día */}
          <section className="bg-background border-b border-ink/10">
            <div className={`${CONTAINER} py-12 sm:py-16`}>
              <MomentAdvice daily={daily} todayEntry={todayEntry} journalStreak={journalStreak} />
            </div>
          </section>

          <KnowledgeSection label={L("El día", "The day")}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              <div className="lg:col-span-7">
                <DailyEnergyCard profile={profile} daily={daily} streakDays={streakDays} streakBadge={badge} />
              </div>
              <div className="lg:col-span-5">
                <SectionCover imageKey="paginas/hoy" />
              </div>
            </div>
          </KnowledgeSection>

          <KnowledgeSection label={L("Qué hacer con el día", "What to do with the day")} title={L("A favor y en contra", "For and against")} tone="alt">
            <DailyFocus daily={daily} />
          </KnowledgeSection>

          {personal && profile && <PersonalCyclesSection profile={profile} daily={daily} />}

          {daily.nextDaysForecast?.length > 0 && (
            <KnowledgeSection label={L("Lo que viene", "What's coming")} title={L("Los próximos días", "The next few days")}>
              <WeekPreview forecast={daily.nextDaysForecast} />
            </KnowledgeSection>
          )}

          <section className="bg-background">
            <div className={`${CONTAINER} py-12 flex flex-wrap gap-x-8 gap-y-3 text-base`}>{L(<>
              <Link href="/semana" className="underline underline-offset-4 hover:no-underline">Ver mi semana</Link>
              <Link href="/calendario" className="underline underline-offset-4 hover:no-underline">Ver el mes</Link>
              <Link href="/evolution" className="underline underline-offset-4 hover:no-underline">Ver tus patrones</Link>
            </>, <><Link href="/semana" className="underline underline-offset-4 hover:no-underline">See my week</Link><Link href="/calendario" className="underline underline-offset-4 hover:no-underline">See the month</Link><Link href="/evolution" className="underline underline-offset-4 hover:no-underline">See your patterns</Link></>)}</div>
          </section>
        </>
      )}
    </main>
  );
}
