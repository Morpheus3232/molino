"use client";

import { useMemo, useState } from "react";
import type { UserProfile } from "@/types/user";
import type { LightweightEntity } from "@/types/atlas";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { buildAtlasSections } from "@/lib/affinity-light";
import { getCountryISO } from "@/lib/data/country-iso";
import { useUserContext } from "@/lib/hooks/useUserContext";
import { getRelationshipMap, type Animal } from "@/lib/data/animalRelations";
import { ARCHETYPES, archetypeDisplayName } from "@/lib/data";
import { safeNumber } from "@/lib/utils/score";
import PersonalSigil from "@/components/ui/PersonalSigil";
import ProfileCoordinatesSection from "@/components/profile/ProfileCoordinatesSection";
import PersonalMapSection from "@/components/profile/PersonalMapSection";
import BirthGridSection from "@/components/profile/BirthGridSection";
import { LecturaLibre, type LecturaPieces } from "@/components/profile/LecturaProfunda";
import SpaceIndex from "@/components/profile/SpaceIndex";
import ActionButtons from "@/components/profile/ActionButtons";
import { getYearTheme } from "@/lib/engines/dailyEnergyEngine";
import Link from "next/link";
import Image from "next/image";
import { getSectionImage, signImageKey, animalImageKey } from "@/lib/data/section-images";

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const YANG_ANIMALS = new Set(["Rata", "Tigre", "Dragón", "Caballo", "Mono", "Perro"]);

const CHAPTERS = [
  { numeral: "I", title: "Coordenadas", note: "Las cuatro piezas, qué son y la cuenta de cada una.", href: "#coordenadas" },
  { numeral: "II", title: "El mundo", note: "Países, marcas y personas que comparten tu signo.", href: "#mundo" },
  { numeral: "III", title: "Tu fecha", note: "Los dígitos de tu fecha en la grilla Lo Shu.", href: "#digitos" },
  { numeral: "IV", title: "Tu lectura", note: "Identidad y momento, leídos como un solo sistema.", href: "#lectura" },
];

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
  const archetypeName = archetypeDisplayName(archetype.name);

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

  const signCards = [
    {
      system: "Numerología",
      value: `${lifePath} · ${archetypeName}`,
      what: "Tu Camino de Vida: la suma de todos los dígitos de tu fecha.",
      image: `numerologia/${lifePath}`,
      href: "#pilar-numerologia",
    },
    {
      system: "Astrología",
      value: `Sol en ${profile.sunSign}`,
      what: "El tramo del zodíaco que recorría el Sol el día que naciste.",
      image: signImageKey(profile.sunSign || "Aries"),
      href: "#pilar-astrologia",
    },
    {
      system: "Zodíaco chino",
      value: `${display.name} de ${chineseElement}`,
      what: `El animal del año lunar en que naciste · polaridad ${polarity}.`,
      image: animalImageKey(display.name),
      href: "#pilar-zodiaco-chino",
    },
  ];

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
            <p className="text-sm text-accent mb-4 label-caps">
              Mapa personal simbólico
            </p>

            <h1 className="page-title text-foreground">
              Camino de Vida {lifePath} · {archetypeName}
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-muted leading-relaxed max-w-2xl italic">
              {archetype.essence || archetype.description}
            </p>

            {/* Franja de datos: fecha, cálculo local, año y atlas */}
            <div className="mt-8 pt-5 border-t border-border flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-x-6 gap-y-1.5 text-sm text-muted">
              <span>Naciste el {birthDateFormatted}</span>
              <span className="hidden sm:inline-block w-px h-3.5 bg-border" aria-hidden="true" />
              <span>Calculado en tu dispositivo</span>
              {yearTheme && (
                <>
                  <span className="hidden sm:inline-block w-px h-3.5 bg-border" aria-hidden="true" />
                  <span className="text-foreground">
                    Año personal {personalYear} · {yearTheme}
                  </span>
                </>
              )}
              {atlasEntityCount > 0 && (
                <>
                  <span className="hidden sm:inline-block w-px h-3.5 bg-border" aria-hidden="true" />
                  <Link
                    href={`/atlas/explorar/${userAnimal}`}
                    className="underline decoration-dotted underline-offset-4 hover:text-foreground py-1.5 -my-1.5"
                  >
                    {atlasEntityCount} afinidades en tu Atlas
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Tus tres signos — una tarjeta ilustrada por sistema; cada una
              baja a su pieza en el Capítulo I, con la cuenta hecha. */}
          <div className="mt-14 sm:mt-16">
            <p className="text-sm text-muted label-caps mb-4">Tus tres signos</p>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {signCards.map((card) => {
                const img = getSectionImage(card.image);
                return (
                  <li key={card.href}>
                    <a href={card.href} className="group block h-full border border-ink/15 bg-background hover:border-ink/40 transition-colors">
                      <div className="relative aspect-[2/1] md:aspect-[16/10] overflow-hidden border-b border-ink/15 bg-paper-alt">
                        {img && (
                          <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 400px"
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        )}
                      </div>
                      <div className="p-5 sm:p-6">
                        <p className="text-sm text-muted label-caps">{card.system}</p>
                        <p className="mt-2 font-display text-3xl leading-tight text-foreground">{card.value}</p>
                        <p className="mt-2 text-base text-muted leading-snug">{card.what}</p>
                        <p className="mt-4 text-sm text-foreground underline underline-offset-4 group-hover:no-underline">
                          Ver qué es y la cuenta ↓
                        </p>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Índice — cómo leer el mapa, de arriba abajo */}
          <nav aria-label="Capítulos de tu mapa" className="mt-14 sm:mt-16">
            <p className="text-sm text-muted label-caps mb-4">Cómo leer este mapa</p>
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-ink/15">
              {CHAPTERS.map((c) => (
                <li key={c.href} className="border-r border-b border-ink/15">
                  <a href={c.href} className="group flex h-full gap-4 p-5 hover:bg-ink/[0.03] transition-colors">
                    <span className="font-display text-3xl leading-none text-muted group-hover:text-foreground">{c.numeral}</span>
                    <span>
                      <span className="block font-display text-xl leading-tight text-foreground">{c.title}</span>
                      <span className="mt-1 block text-sm text-muted leading-snug">{c.note}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════
          COORDENADAS FUNDAMENTALES — Los cuatro pilares
          con gran aire vertical, números en mono de 56px,
          títulos display y descripciones serif.
          ═══════════════════════════════════════════════ */}
      <div id="coordenadas" className="scroll-mt-20">
        <ProfileCoordinatesSection profile={profile} />
      </div>

      {/* ═══════════════════════════════════════════════
          EL MAPA APLICADO — Dónde tu signo toca el mundo.
          Territorio, vestimenta, autos, aula, gente
          y pantalla con afinidad de 3 casillas.
          ═══════════════════════════════════════════════ */}
      <div id="mundo" className="scroll-mt-20">
        <PersonalMapSection profile={profile} catalog={catalog} />
      </div>

      {/* ═══════════════════════════════════════════════
          LA LECTURA — Tu cuadro de nacimiento y los dos movimientos.
          ═══════════════════════════════════════════════ */}
      <div id="digitos" className="scroll-mt-20">
        <BirthGridSection profile={profile} />
      </div>
      <div id="lectura" className="scroll-mt-20">
        <LecturaLibre profile={profile} onData={setPieces} />
      </div>

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
