"use client";

import { useMemo, useState } from "react";
import type { UserProfile } from "@/types/user";
import type { LightweightEntity } from "@/types/atlas";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { sortLightEntities, buildAtlasSections } from "@/lib/affinity-light";
import { getCountryISO } from "@/lib/data/country-iso";
import { useUserContext } from "@/lib/hooks/useUserContext";
import { getRelationshipMap, type Animal } from "@/lib/data/animalRelations";
import { ARCHETYPES } from "@/lib/data";
import { safeNumber } from "@/lib/utils/score";
import SpaceIndex from "@/components/profile/SpaceIndex";
import ConvergenceSection from "@/components/profile/ConvergenceSection";
import BirthGridSection from "@/components/profile/BirthGridSection";
import { LecturaLibre, LecturaPremium, type LecturaPieces } from "@/components/profile/LecturaProfunda";
import FamousMatch from "@/components/profile/FamousMatch";
import CalculationDetails from "@/components/profile/CalculationDetails";
import ActionButtons from "@/components/profile/ActionButtons";
import AtlasAffinitySummary from "@/components/profile/AtlasAffinitySummary";
import { getYearTheme } from "@/lib/engines/dailyEnergyEngine";
import Link from "next/link";

export default function ProfileHub({
  profile,
  catalog,
  isDemo = false,
}: {
  profile: UserProfile;
  catalog?: LightweightEntity[];
  /** /ejemplo reusa este componente con un perfil ficticio — oculta las
   * acciones que escriben en el localStorage/bóveda reales (guardar,
   * rehacer) para no dejar que datos de demo contaminen el perfil real
   * del visitante. Todo lo demás (estructura, cálculo, copy) es idéntico. */
  isDemo?: boolean;
}) {
  const [pieces, setPieces] = useState<LecturaPieces | null>(null);

  const userAnimal = (profile.chineseZodiac ?? "") as Animal;
  const display = getZodiacDisplay(userAnimal);
  const chineseElement =
    typeof profile.chineseZodiacInfo?.element === "string"
      ? profile.chineseZodiacInfo.element
      : "";
  const lifePath = safeNumber(profile.lifePath, 1);
  const archetype = ARCHETYPES[lifePath] || ARCHETYPES[1];
  const archetypeName = archetype.name;


  const worldCount = useMemo(() => {
    if (!catalog || catalog.length === 0) return 0;
    const results = sortLightEntities(profile.chineseZodiac || "", catalog);
    return results.filter((r) => r.score >= 60).length;
  }, [profile, catalog]);

  const { country } = useUserContext();
  const userCountryISO = useMemo(() => (country ? getCountryISO(country) : null), [country]);
  const atlasSections = useMemo(() => {
    if (!catalog || catalog.length === 0) return [];
    const sections = buildAtlasSections(profile.chineseZodiac || "", catalog, userCountryISO).sameAnimal;
    return [...sections].sort((a, b) => b.entities.length - a.entities.length).slice(0, 3);
  }, [profile, catalog, userCountryISO]);

  const relationMap = useMemo(
    () => getRelationshipMap(userAnimal),
    [userAnimal]
  );
  const allies = relationMap.friends
    .filter((f) => f.type === "triad")
    .map((f) => f.animal);
  const personalYear = profile.cycles?.personalYear;
  const yearTheme =
    typeof personalYear === "number" ? getYearTheme(personalYear) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* ═══════════════════════════════════════════════
          HERO — El instrumento. Silencioso, poderoso.
          Una sola idea visual dominante: tu identidad.

          No se anima. Es la respuesta a "¿cómo estoy configurado?" y es el
          elemento LCP de la página: se pinta en el primer frame.

          Antes eran cuatro motion.div encadenados con delays de
          150/300/500/700ms más un parallax que desvanecía el titular al 30%.
          Los delays tenían dos costos: ~750ms de LCP, y —peor— si el
          navegador pausa requestAnimationFrame (pestaña abierta en segundo
          plano, que es el camino por defecto de un link compartido) la
          animación nunca completa y el hero queda en opacity:0 de forma
          permanente. MotionFailsafe no lo rescata porque con la pestaña
          oculta window.innerHeight es 0 y su chequeo de viewport descarta
          todo. Sin animación no hay estado intermedio en el que quedarse.
          ═══════════════════════════════════════════════ */}
      <header className="relative overflow-hidden border-b border-ink/10">
        <div className="relative mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-20 sm:pt-28 pb-16 sm:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-16 items-center">
            {/* Identity — núcleo emocional */}
            <div className="text-center lg:text-left">
              <span className="block font-mono text-xs uppercase tracking-[0.2em] text-accent">
                CAMINO DE VIDA {lifePath}
              </span>

              <h1 className="mt-2 font-display text-[clamp(3rem,10vw,6rem)] tracking-tight text-foreground leading-[0.85] uppercase">
                {archetypeName}
              </h1>

              <p className="mt-4 text-sm sm:text-base text-muted leading-relaxed max-w-md italic">
                {archetype.description}
              </p>

              {/* Compact identity strip */}
              <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm">
                <span className="font-mono text-muted tracking-wide">
                  {profile.sunSign}
                  {profile.sunSignInfo?.element
                    ? ` · ${profile.sunSignInfo.element}`
                    : ""}
                </span>
                <span className="w-px h-4 bg-ink/10" aria-hidden="true" />
                <Link
                  href={`/atlas/explorar/${userAnimal}`}
                  className="font-mono text-muted tracking-wide hover:text-accent transition-colors underline decoration-dotted underline-offset-4"
                >
                  {display.name} de {chineseElement}
                </Link>
                {yearTheme && (
                  <>
                    <span className="w-px h-4 bg-ink/10" aria-hidden="true" />
                    <span className="font-mono text-accent tracking-wide">
                      Año {personalYear} · {yearTheme}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════
          CÁLCULO — Cómo se calculó esto (colapsable)
          ═══════════════════════════════════════════════ */}
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-6">
        <CalculationDetails profile={profile} />
        {!isDemo && <ActionButtons profile={profile} />}
      </div>

      {/* ═══════════════════════════════════════════════
          CUADRO DE NACIMIENTO — reemplaza al radar de
          "dimensiones", cuyos valores eran aritmética
          arbitraria (lifePath * 10, 50 + (lp % 5) * 10) y
          trataban etiquetas ordinales como magnitudes. Acá
          cada casilla es un conteo que el lector puede
          rehacer a mano.
          ═══════════════════════════════════════════════ */}
      <BirthGridSection profile={profile} />

      {/* ═══════════════════════════════════════════════
          CONVERGENCIA — dónde dos sistemas calculados por
          caminos distintos dan el mismo resultado. Va antes
          de la lectura interpretativa porque responde la
          pregunta de la página ("¿cómo estoy configurado?"),
          no la de /lectura ("¿qué significa?").
          ═══════════════════════════════════════════════ */}
      <ConvergenceSection profile={profile} />

      {/* ═══════════════════════════════════════════════
          LECTURA LIBRE — Patrones + Principios + Momento.
          Sin interrupción de paywall: los tres movimientos
          gratis corren completos antes de pedir nada.
          ═══════════════════════════════════════════════ */}
      <LecturaLibre profile={profile} onData={setPieces} />

      {/* ═══════════════════════════════════════════════
          SINCRONICIDAD — ¿Con quién compartís tu mapa?
          ═══════════════════════════════════════════════ */}
      <FamousMatch profile={profile} />

      {/* ═══════════════════════════════════════════════
          ATLAS — Resumen compacto de afinidad con marcas,
          ciudades y demás entidades del mismo animal.
          ═══════════════════════════════════════════════ */}
      <AtlasAffinitySummary sections={atlasSections} animalSlug={userAnimal} animalName={display.name} />

      {/* ═══════════════════════════════════════════════
          LECTURA PREMIUM — Cierre de la lectura: síntesis
          entre sistemas + chat. Acá vive el upsell.
          ═══════════════════════════════════════════════ */}
      <LecturaPremium profile={profile} pieces={pieces} />

      {/* ═══════════════════════════════════════════════
          NAV — Todas las herramientas y dimensiones del
          mapa, en un solo lugar.
          ═══════════════════════════════════════════════ */}
      <SpaceIndex
        profile={profile}
        circleName={`${display.name} de ${chineseElement}`}
        allyName={allies[0] ?? null}
        worldCount={worldCount}
        animalSlug={userAnimal}
        animalName={display.name}
      />
    </div>
  );
}
