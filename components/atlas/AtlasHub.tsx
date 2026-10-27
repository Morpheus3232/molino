"use client";

import { useMemo, useState, useEffect } from "react";
import type { LightweightEntity } from "@/types/atlas";
import type { AtlasCountry } from "@/lib/data/atlas-queries";
import { getCountryISO } from "@/lib/data/country-iso";
import { useUserContext } from "@/lib/hooks/useUserContext";
import { loadProfileFromStorage } from "@/lib/session/localStorage";
import {
  buildAtlasSections,
  type LightAffinityResult,
  type AtlasSections,
} from "@/lib/affinity-light";
import { getAnimalProfile, ANIMALS } from "@/lib/data/animalRelations";
import type { Animal } from "@/lib/data/animalRelations";
import PersonalAtlasPilot from "@/components/atlas/PersonalAtlasPilot";
import CountryGrid from "@/components/atlas/CountryGrid";
import EntityVisual from "@/components/ui/EntityVisual";
import ZodiacAnimalIcon from "@/components/ui/ZodiacAnimalIcon";
import { Link } from "@/lib/i18n/navigation";
import { entityLinkRel } from "@/lib/seo/entity-links";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import { Breadcrumb } from "@/components/knowledge/Kit";
import SectionCover from "@/components/ui/SectionCover";

interface AtlasHubProps {
  countries: AtlasCountry[];
  topCountries: AtlasCountry[];
  allEntities: LightweightEntity[];
  globalCurated: Record<string, LightweightEntity[]>;
}

function CategoryPreview({
  label,
  entities,
  type,
  userAnimal,
}: {
  label: string;
  entities: LightAffinityResult[];
  type: string;
  userAnimal: string;
}) {
  if (entities.length === 0) return null;

  return (
    <motion.div className="group" {...fadeUp}>
      <h3 className="section-title text-foreground mb-3">
        {label}
      </h3>

      <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5 mb-3">
        {entities.map((e, i) => (
          <span key={e.id} className="inline-flex items-center">
            <Link
              href={`/affinity/${e.type}/${e.id}`}
              rel={entityLinkRel(e)}
              className="inline-flex items-center gap-1.5 text-sm text-foreground hover:text-accent transition-colors py-1 px-2 -mx-2 rounded-md hover:bg-ink/[0.04]"
            >
              <EntityVisual
                name={e.name}
                emoji={e.emoji}
                imageUrl={e.imageUrl}
                type={e.type}
                category={e.category}
                visualType={e.visualType}
                countryISO={e.countryISO}
                size={20}
                className="shrink-0"
              />
              <span className="truncate max-w-[200px]">{e.name}</span>
              {e.origin && (
                <span className="text-muted/70 text-[11px] whitespace-nowrap"> — {e.origin}</span>
              )}
            </Link>
            {i < entities.length - 1 && (
              <span className="text-muted/30 mx-0.5 select-none" aria-hidden="true">·</span>
            )}
          </span>
        ))}
      </div>

      <Link
        href={`/atlas/explorar/${userAnimal}/${type}`}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-accent transition-colors group/link"
      >
        <span>Ver {label.toLowerCase()}</span>
        <span className="group-hover/link:translate-x-0.5 transition-transform" aria-hidden="true">→</span>
      </Link>
    </motion.div>
  );
}

function AnimalSelector({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (animal: Animal) => void;
}) {
  return (
    <div>
      <p className="text-sm text-muted font-medium mb-3 label-caps">
        {selected ? "Cambiar signo" : "Elegí tu signo para explorar"}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {ANIMALS.map((animal) => {
          const isActive = animal === selected;
          const emoji = getAnimalProfile(animal)?.emoji ?? "";
          return (
            <button
              key={animal}
              type="button"
              onClick={() => onSelect(animal)}
              aria-pressed={isActive}
              // Ícono arriba y nombre abajo: en fila, con la columna angosta,
              // "Serpiente" o "Caballo" se cortaban en "Ser…" / "Ca…".
              className={`flex min-w-0 flex-col items-center justify-center gap-1 px-1 py-2.5 min-h-[64px] rounded-xl border text-sm font-medium transition-colors ${
                isActive
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-ink/10 text-foreground hover:border-accent/40"
              }`}
            >
              <ZodiacAnimalIcon
                animal={animal}
                size={22}
                className={`shrink-0 ${isActive ? "text-accent" : "text-foreground/70"}`}
              />
              <span className="whitespace-nowrap leading-tight">{animal}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NoCoverageBanner({ country, topCountries }: { country: string; topCountries: AtlasCountry[] }) {
  return (
    <div className="mb-8 p-4 rounded-xl border border-ink/10 bg-card">
      <p className="text-sm text-foreground">
        Todavía no tenemos entidades para {country} en el Atlas.
      </p>
      <p className="text-xs text-muted mt-1">
        Mientras tanto, estos son los países con más cobertura para explorar.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {topCountries.slice(0, 6).map((c) => (
          <a
            key={c.iso}
            href={`/atlas/${c.iso}`}
            className="px-3 py-1.5 rounded-lg border border-ink/10 text-xs font-medium text-foreground hover:border-accent/40 transition-colors"
          >
            <span className="flag-emoji">{c.flag}</span> {c.name}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function AtlasHub({ countries, topCountries, allEntities, globalCurated }: AtlasHubProps) {
  const { country } = useUserContext();

  const userCountryISO = useMemo(() => {
    if (!country) return null;
    const iso = getCountryISO(country);
    if (!iso) return null;
    return countries.some((c) => c.iso === iso) ? iso : null;
  }, [country, countries]);

  const hasCoverage = userCountryISO !== null;

  const [sections, setSections] = useState<AtlasSections | null>(null);
  const [userAnimal, setUserAnimal] = useState<string | null>(null);
  const [countriesExpanded, setCountriesExpanded] = useState(false);

  useEffect(() => {
    const profile = loadProfileFromStorage();
    const animal = profile?.chineseZodiac || null;
    setUserAnimal(animal);
    if (!animal || allEntities.length === 0) {
      setSections(null);
      return;
    }
    setSections(buildAtlasSections(animal, allEntities, userCountryISO));
  }, [allEntities, userCountryISO]);

  const handleSelectAnimal = (animal: Animal) => {
    setUserAnimal(animal);
    if (allEntities.length === 0) {
      setSections(null);
      return;
    }
    setSections(buildAtlasSections(animal, allEntities, userCountryISO));
  };

  const enemyName = sections?.enemyAnimalName ?? null;

  return (
    <div>
      {/* ═══════════ HERO ═══════════ */}
      <section aria-label="Atlas — tu mapa de afinidades" className="relative mb-20 sm:mb-28">
        <Breadcrumb items={[{ href: "/", label: "Inicio" }, { label: "Atlas" }]} />
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-10 items-start">
          <div className="lg:col-span-7">
            <p className="text-sm text-accent mb-4 label-caps">Atlas · países, ciudades, marcas y personas</p>
            <h1 className="font-display font-normal text-[clamp(3rem,7.5vw,6rem)] leading-[0.95] tracking-tight text-foreground">
              Tu mapa de afinidades
            </h1>
            {/* Qué es esta sección, para quien llega sin contexto: la regla
                completa en dos párrafos, sin vender nada. */}
            <div className="mt-6 max-w-xl space-y-4 text-xl text-foreground/85 leading-snug">
              <p>
                Cada entrada del Atlas tiene una fecha de origen —el día en que se fundó o nació— y esa fecha le da un
                signo del zodíaco chino, igual que tu fecha de nacimiento te da el tuyo.
              </p>
              <p className="text-lg text-muted">
                Primero ves lo que comparte tu signo y, aparte, lo del signo opuesto. Elegí tu signo para empezar, o más
                abajo recorré todo el Atlas por país.
              </p>
            </div>
          </div>
          <div className="lg:col-span-5 w-full">
            <AnimalSelector selected={userAnimal} onSelect={handleSelectAnimal} />
          </div>
        </div>
        <SectionCover imageKey="paginas/atlas" priority aspect="aspect-[21/9]" className="mt-14" />
      </section>

      {/* ═══════════ TU ATLAS (piloto: university/team/artist) ═══════════ */}
      <PersonalAtlasPilot animal={userAnimal} countryISO={userCountryISO} />

      {/* ═══════════ CATEGORÍAS — TU ANIMAL ═══════════ */}
      {sections && sections.sameAnimal.length > 0 && (
        <section aria-label="Tu mundo" className="relative mb-24">
          {/* Visual connector — thin accent line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-accent/15 hidden sm:block" aria-hidden="true" />

          <div className="sm:pl-10 space-y-14 sm:space-y-16">
            {sections.sameAnimal.map((section) => (
              <CategoryPreview
                key={section.type}
                label={section.label}
                entities={section.entities}
                type={section.type}
                userAnimal={userAnimal!}
              />
            ))}
          </div>
        </section>
      )}

      {/* ═══════════ ENERGÍA OPUESTA ═══════════ */}
      {sections && enemyName && sections.enemyAnimal.length > 0 && (
        <motion.section
          aria-label="Energía opuesta"
          className="relative mb-24"
          {...fadeUp}
        >
          {/* Editorial divider */}
          <div className="flex items-center gap-4 mb-10" aria-hidden="true">
            <div className="h-px flex-1 bg-ink/10" />
            <div className="w-1.5 h-1.5 rounded-full bg-accent/30" />
            <div className="h-px flex-1 bg-ink/10" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-sm text-muted font-medium mb-2 label-caps">
                Energía opuesta
              </p>
              <h2 className="section-title text-foreground/60">
                {enemyName}
              </h2>
            </div>
            <Link
              href={`/atlas/explorar/${enemyName}?enemy=1`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-accent transition-colors group shrink-0"
            >
              <span>Explorar energía opuesta</span>
              <span className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true">→</span>
            </Link>
          </div>

          <p className="text-sm text-muted max-w-lg leading-relaxed">
            Explorá entidades asociadas al animal opuesto en el ciclo zodiacal. Otra forma de recorrer el Atlas.
          </p>
        </motion.section>
      )}

      {/* ═══════════ EXPLORAR TODO EL ATLAS ═══════════ */}
      <motion.section
        aria-label="Explorar todo el Atlas"
        className="border-t-2 border-ink pt-10"
        {...fadeUp}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title text-foreground">
            Todo el Atlas, por país
          </h2>
          {!countriesExpanded && (
            <button
              type="button"
              onClick={() => setCountriesExpanded(true)}
              className="text-base underline underline-offset-4 hover:no-underline py-2 -my-2"
            >
              Ver los {countries.length} países
            </button>
          )}
        </div>

        {!hasCoverage && country && (
          <NoCoverageBanner country={country} topCountries={topCountries} />
        )}

        {countriesExpanded ? (
          <div className="mb-6">
            <CountryGrid countries={countries} userCountryISO={userCountryISO} />
            <button
              type="button"
              onClick={() => setCountriesExpanded(false)}
              className="mt-4 text-xs text-muted hover:text-accent transition-colors"
            >
              Colapsar ↑
            </button>
          </div>
        ) : (
          <p className="text-lg text-muted">
            {countries.length} países con entradas. Desplegá la lista para navegar por país y categoría.
          </p>
        )}

        {userCountryISO && (
          <div className="mt-8 flex flex-wrap gap-2">
            {(
              [
                ["city", "Ciudades"],
                ["autos", "Marcas de autos"],
                ["ropa", "Marcas de ropa"],
                ["brand", "Otras marcas"],
                ["university", "Universidades"],
                ["artist", "Famosos"],
                ["movie", "Películas"],
              ] as const
            )
              // Solo los listados que existen para ese país: los demás serían 404.
              .filter(([cat]) => countries.find((c) => c.iso === userCountryISO)?.listings.includes(cat))
              .map(([cat, label]) => (
              <Link
                key={cat}
                href={`/atlas/${userCountryISO}/${cat}`}
                className="px-4 py-2.5 border border-ink/25 text-base text-foreground hover:border-ink hover:bg-paper-alt transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
}
