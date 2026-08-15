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
import CountryGrid from "@/components/atlas/CountryGrid";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";

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
      <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground uppercase mb-3">
        {label}
      </h3>

      <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5 mb-3">
        {entities.map((e, i) => (
          <span key={e.id} className="inline-flex items-center">
            <Link
              href={`/affinity/${e.type}/${e.id}`}
              className="inline-flex items-center gap-1.5 text-sm text-foreground hover:text-accent transition-colors py-1 px-2 -mx-2 rounded-md hover:bg-ink/[0.04]"
            >
              <span className="text-base leading-none shrink-0" role="img" aria-label={e.name}>
                {e.emoji || "🔮"}
              </span>
              <span className="truncate max-w-[200px]">{e.name}</span>
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
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">
        {selected ? "Cambiar animal" : "Elegí tu animal para explorar"}
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
              className={`flex min-w-0 items-center gap-1.5 px-2.5 py-2 rounded-xl border text-xs font-medium transition-colors ${
                isActive
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-ink/10 text-foreground hover:border-accent/40"
              }`}
            >
              <span className="text-base leading-none" aria-hidden="true">
                {emoji}
              </span>
              <span className="truncate">{animal}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NoCoverageBanner({ country, topCountries }: { country: string; topCountries: AtlasCountry[] }) {
  return (
    <div className="mb-8 p-4 rounded-2xl border border-ink/10 bg-card">
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
            {c.flag} {c.name}
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
        <motion.p
          className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-semibold mb-8"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          Atlas
        </motion.p>

        <div className="flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-12">
          <div className="flex-1">
            <motion.h2
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground uppercase leading-[0.92]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            >
              Tu mapa de afinidades
            </motion.h2>
            <motion.p
              className="text-sm sm:text-base text-muted mt-4 max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            >
              Explorá el mundo a través de tu animal del Zodiaco Chino.
            </motion.p>
          </div>

          <motion.div
            className="shrink-0 w-full lg:w-[320px]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          >
            <AnimalSelector selected={userAnimal} onSelect={handleSelectAnimal} />
          </motion.div>
        </div>

        {/* Subtle bottom rule */}
        <motion.div
          className="mt-12 h-px bg-ink/10"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          style={{ transformOrigin: "left" }}
        />
      </section>

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
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">
                Energía opuesta
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground/60 uppercase">
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
        className="border-t border-ink/10 pt-12"
        {...fadeUp}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted font-medium">
            Explorar todo el Atlas
          </h2>
          {!countriesExpanded && (
            <button
              type="button"
              onClick={() => setCountriesExpanded(true)}
              className="text-xs text-muted hover:text-accent transition-colors"
            >
              {countries.length} países →
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
          <p className="text-xs text-muted">
            {countries.length} países con entidades verificadas. Desplegá para navegar por país y categoría.
          </p>
        )}

        {userCountryISO && (
          <div className="mt-8 flex flex-wrap gap-2">
            {(
              [
                ["city", "Ciudades"],
                ["brand", "Marcas"],
                ["team", "Equipos"],
                ["university", "Universidades"],
                ["artist", "Artistas"],
                ["movie", "Películas"],
              ] as const
            ).map(([cat, label]) => (
              <Link
                key={cat}
                href={`/atlas/${userCountryISO}/${cat}`}
                className="px-3 py-1.5 rounded-lg border border-ink/10 text-xs font-medium text-foreground hover:border-accent/40 hover:text-accent transition-colors"
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
