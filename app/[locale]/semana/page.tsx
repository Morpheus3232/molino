"use client";

import { useMemo } from "react";
import { Suspense } from "react";
import { useRouter, Link } from "@/lib/i18n/navigation";
import { useProfile } from "@/lib/hooks/useProfile";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import { toLocalDateKey } from "@/lib/session/dailyHistory";
import { formatDate } from "@/lib/i18n/format";
import { Breadcrumb, CONTAINER, KnowledgeSection } from "@/components/knowledge/Kit";

export default function SemanaPage() {
  return (
    <Suspense fallback={null}>
      <SemanaContent />
    </Suspense>
  );
}

function SemanaContent() {
  const router = useRouter();
  const { profile, mounted, loading } = useProfile({ redirectIfNotFound: false });

  // Get Monday to Sunday of current week
  const weekDays = useMemo(() => {
    if (!profile) return [];
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ...
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
    monday.setHours(0, 0, 0, 0);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d);
    }
    return days;
  }, [profile]);

  // Mismo motor que /hoy (calculateDailyEnergy): personalDay, theme y
  // descripción reales según el perfil — no el engine de "viajes"
  // (dateVibration.ts) que mostraba un número/label desconectado del resto
  // del sitio y una leyenda genérica ("días ideales para viajar").
  const weekResults = useMemo(() => {
    if (!profile || weekDays.length === 0) return [];
    // calculateDailyEnergy().date usa toISOString() (UTC) — se pisa acá con
    // toLocalDateKey() para no correr un día en husos horarios negativos
    // (ver comentario en lib/session/dailyHistory.ts).
    return weekDays.map(d => ({ ...calculateDailyEnergy(profile, d), date: toLocalDateKey(d) }));
  }, [profile, weekDays]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = toLocalDateKey(today);

  const crumbs = [
    { href: "/", label: "Inicio" },
    { href: "/calendario", label: "Calendario" },
    { label: "Semana" },
  ];

  if (loading || !mounted) {
    return (
      <main id="main-content" className="bg-background">
        <div className={`${CONTAINER} pt-12 sm:pt-16 pb-24`}>
          <Breadcrumb items={crumbs} />
          <div className="mt-10 animate-pulse space-y-6" aria-hidden="true">
            <div className="h-20 bg-ink/5 w-1/2" />
            <div className="h-64 bg-ink/5" />
          </div>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main id="main-content" className="bg-background">
        <div className={`${CONTAINER} pt-12 sm:pt-16 pb-24`}>
          <Breadcrumb items={crumbs} />
          <div className="mt-10 max-w-2xl">
            <p className="text-sm text-accent mb-4 label-caps">Semana · requiere tu mapa</p>
            <h1 className="font-display font-normal text-[clamp(3rem,7.5vw,6rem)] leading-[0.95] tracking-tight text-foreground">
              Creá tu mapa primero
            </h1>
            <p className="mt-6 text-xl text-foreground/85 leading-snug">
              La semana se arma con tu Día Personal, que sale de tu fecha de nacimiento. Sin ella, mirá el número del día,
              que es igual para todos.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <button
                type="button"
                onClick={() => router.push("/onboarding")}
                className="inline-flex items-center justify-center px-8 py-4 bg-vermilion text-paper text-sm font-bold hover:bg-vermilion-hover transition-colors label-caps"
              >
                Crear mi mapa
              </button>
              <Link href="/calendario" className="text-base underline underline-offset-4 hover:no-underline">
                Ver el calendario del mes
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const weekRange = weekDays.length >= 2
    ? `${formatDate(weekDays[0], { day: "numeric", month: "long" })} – ${formatDate(weekDays[6], { day: "numeric", month: "long" })}`
    : "";
  const todayResult = weekResults.find((d) => d.date === todayKey);

  return (
    <main id="main-content" className="bg-background">
      <header className="border-b border-ink/10">
        <div className={`${CONTAINER} pt-12 sm:pt-16 pb-16 sm:pb-20`}>
          <Breadcrumb items={crumbs} />
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-6 items-end">
            <div className="lg:col-span-7">
              <p className="text-sm text-accent mb-4 label-caps">{weekRange}</p>
              <h1 className="font-display font-normal text-[clamp(3.5rem,9vw,7rem)] leading-[0.92] tracking-tight text-foreground">
                Tu semana
              </h1>
            </div>
            <p className="lg:col-span-5 text-xl sm:text-2xl text-foreground/85 leading-snug">
              Siete días con tu Día Personal: el número que sale de sumar tu fecha de nacimiento con cada fecha. Hoy va en
              negro.
            </p>
          </div>

          {/* La semana como instrumento: siete columnas con filete */}
          <ol className="mt-14 grid grid-cols-1 sm:grid-cols-7 gap-px bg-ink/15 border border-ink/15">
            {weekResults.map((day) => {
              const isTodayCell = day.date === todayKey;
              const date = new Date(day.date + "T12:00:00");
              const dayName = date.toLocaleDateString("es-AR", { weekday: "long" });
              return (
                <li
                  key={day.date}
                  className={`p-5 sm:p-4 lg:p-6 flex sm:flex-col items-center sm:items-start gap-x-5 ${
                    isTodayCell ? "bg-ink text-paper" : "bg-background text-foreground"
                  }`}
                  aria-current={isTodayCell ? "date" : undefined}
                >
                  <div className="w-24 sm:w-auto shrink-0">
                    <p className={`text-sm capitalize ${isTodayCell ? "text-paper/75" : "text-muted"}`}>
                      {dayName}
                      {isTodayCell && " · hoy"}
                    </p>
                    <p className={`text-base tabular-nums ${isTodayCell ? "text-paper/75" : "text-muted"}`}>{date.getDate()}</p>
                  </div>
                  <p className={`sm:mt-6 font-display text-5xl lg:text-7xl leading-none tabular-nums ${isTodayCell ? "text-paper" : "text-foreground"}`}>{day.personalDay}</p>
                  <p className={`sm:mt-3 font-display text-xl sm:text-base lg:text-xl leading-tight hyphens-auto break-words min-w-0 ${isTodayCell ? "text-paper" : "text-foreground"}`} lang="es">{day.theme}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </header>

      {todayResult && (
        <KnowledgeSection label="Tu día de hoy" title={<>Día {todayResult.personalDay}: {todayResult.theme}</>}>
          <p className="text-xl text-foreground/85 leading-relaxed max-w-3xl">{todayResult.description}</p>
          <p className="mt-6 text-base">
            <Link href="/hoy" className="underline underline-offset-4 hover:no-underline">Ver todo el día de hoy</Link>
          </p>
        </KnowledgeSection>
      )}

      <KnowledgeSection label="Día por día" title="La semana entera" tone="alt">
        <div className="border-t-2 border-ink">
          {weekResults.map((day) => {
            const date = new Date(day.date + "T12:00:00");
            const isTodayCell = day.date === todayKey;
            return (
              <article key={day.date} className="grid grid-cols-1 md:grid-cols-[14rem_1fr] gap-x-10 gap-y-2 py-6 border-b border-ink/15">
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-5xl leading-none text-foreground tabular-nums">{day.personalDay}</span>
                  <span className="text-base text-foreground capitalize">
                    {date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric" })}
                    {isTodayCell && <span className="text-muted"> · hoy</span>}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-2xl text-foreground">{day.theme}</h3>
                  <p className="mt-1 text-lg text-foreground/85 leading-relaxed max-w-3xl">{day.description}</p>
                </div>
              </article>
            );
          })}
        </div>
        <p className="mt-8 text-base">
          <Link href="/calendario" className="underline underline-offset-4 hover:no-underline">Ver el mes completo</Link>
        </p>
      </KnowledgeSection>
    </main>
  );
}
