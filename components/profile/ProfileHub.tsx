"use client";

import { useMemo, useState } from "react";
import type { UserProfile } from "@/types/user";
import type { LightweightEntity } from "@/types/atlas";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { buildAtlasSections } from "@/lib/affinity-light";
import { getCountryISO } from "@/lib/data/country-iso";
import { useUserContext } from "@/lib/hooks/useUserContext";
import { getRelationshipMap, type Animal } from "@/lib/data/animalRelations";
import { ARCHETYPES } from "@/lib/data";
import { safeNumber } from "@/lib/utils/score";
import PersonalSigil from "@/components/ui/PersonalSigil";
import ProfileCoordinatesSection from "@/components/profile/ProfileCoordinatesSection";
import PersonalMapSection from "@/components/profile/PersonalMapSection";
import BirthGridSection from "@/components/profile/BirthGridSection";
import ConvergenceSection from "@/components/profile/ConvergenceSection";
import { LecturaLibre, type LecturaPieces } from "@/components/profile/LecturaProfunda";
import SpaceIndex from "@/components/profile/SpaceIndex";
import ActionButtons from "@/components/profile/ActionButtons";
import { getYearTheme } from "@/lib/engines/dailyEnergyEngine";
import Link from "next/link";

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const YANG_ANIMALS = new Set(["Rata", "Tigre", "Dragón", "Caballo", "Mono", "Perro"]);

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
  const userAnimal = (profile.chineseZodiac ?? "") as Animal;
  const display = getZodiacDisplay(userAnimal);
  const chineseElement =
    typeof profile.chineseZodiacInfo?.element === "string"
      ? profile.chineseZodiacInfo.element
      : "";
  const polarity = YANG_ANIMALS.has(userAnimal) ? "Yang" : "Yin";

  const lifePath = safeNumber(profile.lifePath, 1);
  const archetype = ARCHETYPES[lifePath] || ARCHETYPES[1];
  const archetypeName = archetype.name;

  const [birthY, birthM, birthD] = useMemo(() => {
    const parts = (profile.birthDate || "1990-01-01").split("-").map(Number);
    return [parts[0] || 1990, parts[1] || 1, parts[2] || 1];
  }, [profile.birthDate]);

  const birthDateFormatted = `${birthD} de ${MESES[birthM - 1]} de ${birthY}`;

  const { country } = useUserContext();
  const userCountryISO = useMemo(() => (country ? getCountryISO(country) : null), [country]);
  const atlasEntityCount = useMemo(() => {
    if (!catalog || catalog.length === 0) return 0;
    const sections = buildAtlasSections(profile.chineseZodiac || "", catalog, userCountryISO).sameAnimal;
    return sections.reduce((sum, s) => sum + s.entities.length, 0);
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

  // Las piezas de lectura gratuita que calcula LecturaLibre ya se consumen
  // en /lectura; acá no hay lectura Pro embebida, así que solo se retienen
  // para cumplir el contrato del componente sin descartarlas.
  const [, setPieces] = useState<LecturaPieces | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* ═══════════════════════════════════════════════
          HERO — El instrumento simbólico.
          Sello Personal determinístico en el fondo (8-12% opacidad).
          Tríada en tipografía display grande.
          Jerarquía tipográfica pura, sin cards con sombras.
          ═══════════════════════════════════════════════ */}
      <header className="relative overflow-hidden border-b border-border bg-background">
        {/* Sello Personal determinístico de fondo (8-12% opacidad) */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-[0.09] pointer-events-none overflow-hidden select-none"
          aria-hidden="true"
        >
          <svg viewBox="0 0 880 880" className="w-[680px] h-[680px] sm:w-[960px] sm:h-[960px] max-w-none text-ink">
            <PersonalSigil
              lifePath={lifePath}
              birthDay={birthD}
              birthMonth={birthM}
              width={880}
              height={880}
            />
          </svg>
        </div>

        <div className="relative mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-20 sm:pt-28 pb-16 sm:pb-24">
          <div className="max-w-4xl text-left">
            <span className="block font-mono text-xs uppercase tracking-[0.25em] text-accent mb-4">
              MAPA PERSONAL SIMBÓLICO
            </span>

            {/* Tríada simbólica en tipografía display grande */}
            <div className="space-y-1 sm:space-y-2">
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl tracking-tight text-foreground leading-[1.0] uppercase">
                Camino de Vida {lifePath} · {archetypeName}
              </h1>
              <p className="font-display text-3xl sm:text-5xl lg:text-6xl tracking-tight text-foreground leading-[1.0] uppercase">
                Sol en {profile.sunSign}
              </p>
              <p className="font-display text-3xl sm:text-5xl lg:text-6xl tracking-tight text-foreground leading-[1.0] uppercase">
                {display.name} · {chineseElement} · {polarity}
              </p>
            </div>

            <p className="mt-6 text-base sm:text-lg text-muted leading-relaxed max-w-2xl font-serif italic">
              {archetype.essence || archetype.description}
            </p>

            {/* Franja técnica inferior: fecha, cálculo local, ciclos y atlas */}
            <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-muted">
              <span>Naciste el {birthDateFormatted}</span>
              <span className="w-px h-3.5 bg-border" aria-hidden="true" />
              <span>Calculado 100% localmente en tu dispositivo</span>
              {yearTheme && (
                <>
                  <span className="w-px h-3.5 bg-border" aria-hidden="true" />
                  <span className="text-accent">
                    Año {personalYear} · {yearTheme}
                  </span>
                </>
              )}
              {atlasEntityCount > 0 && (
                <>
                  <span className="w-px h-3.5 bg-border" aria-hidden="true" />
                  <Link
                    href={`/atlas/explorar/${userAnimal}`}
                    className="text-muted hover:text-accent transition-colors underline decoration-dotted underline-offset-4"
                  >
                    {atlasEntityCount} afinidades en tu Atlas
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════
          COORDENADAS FUNDAMENTALES — Los cuatro pilares
          con gran aire vertical, números en mono de 56px,
          títulos display y descripciones serif.
          ═══════════════════════════════════════════════ */}
      <ProfileCoordinatesSection profile={profile} />

      {/* ═══════════════════════════════════════════════
          EL MAPA APLICADO — Dónde tu signo toca el mundo.
          Territorio, vestimenta, autos, cancha, aula, gente
          y pantalla con afinidad de 3 casillas.
          ═══════════════════════════════════════════════ */}
      <PersonalMapSection profile={profile} catalog={catalog} />

      {/* ═══════════════════════════════════════════════
          LA LECTURA — Tu cuadro de nacimiento, dónde
          coinciden tus sistemas y los dos movimientos.
          ═══════════════════════════════════════════════ */}
      <BirthGridSection profile={profile} />
      <ConvergenceSection profile={profile} />
      <LecturaLibre profile={profile} onData={setPieces} />

      {/* ═══════════════════════════════════════════════
          ACCIONES DEL MAPA — Guardar / Rehacer
          ═══════════════════════════════════════════════ */}
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-6">
        {!isDemo && <ActionButtons profile={profile} />}
      </div>

      {/* ═══════════════════════════════════════════════
          NAV — Explorá tu mapa (Lectura, Hoy, Pareja, Círculo)
          ═══════════════════════════════════════════════ */}
      <SpaceIndex
        profile={profile}
        circleName={`${display.name} de ${chineseElement}`}
        allyName={allies[0] ?? null}
      />
    </div>
  );
}
