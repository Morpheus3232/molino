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
import CountryGrid from "@/components/atlas/CountryGrid";
import Link from "next/link";

interface AtlasHubProps {
  countries: AtlasCountry[];
  topCountries: AtlasCountry[];
  allEntities: LightweightEntity[];
  globalCurated: Record<string, LightweightEntity[]>;
}

const CATEGORY_LINK_MAP: Record<string, string> = {
  country: "country",
  city: "city",
  brand: "brand",
  team: "team",
  university: "university",
  artist: "artist",
  movie: "movie",
};

function EntityRow({ entity }: { entity: LightAffinityResult }) {
  return (
    <Link
      href={`/affinity/${entity.type}/${entity.id}`}
      className="flex items-center gap-3 py-2.5 px-3 -mx-3 rounded-lg hover:bg-ink/[0.03] transition-colors group"
    >
      <span className="text-lg leading-none shrink-0 select-none" role="img" aria-label={entity.name}>
        {entity.emoji || "🔮"}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors truncate">
          {entity.name}
        </p>
      </div>
      <span className="shrink-0 text-[11px] text-muted truncate max-w-[120px] text-right">
        {entity.country || ""}
      </span>
    </Link>
  );
}

function CategorySection({
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

  const searchParams = new URLSearchParams();
  searchParams.set("animal", userAnimal);

  return (
    <div className="mb-10">
      <div className="flex items-end justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">{label}</h3>
        <Link
          href={`/explore?category=${type}&${searchParams.toString()}`}
          className="text-xs text-muted hover:text-accent transition-colors whitespace-nowrap"
        >
          Ver {label.toLowerCase()} {userAnimal} →
        </Link>
      </div>
      <div className="divide-y divide-ink/[0.06]">
        {entities.map((e) => (
          <EntityRow key={e.id} entity={e} />
        ))}
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
  const [enemyExpanded, setEnemyExpanded] = useState(false);

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

  const enemyName = sections?.enemyAnimalName ?? null;

  return (
    <div>
      {/* 1. TU ATLAS — same-animal categories */}
      {sections && sections.sameAnimal.length > 0 && (
        <section aria-label="Tu Atlas" className="mb-20">
          <div className="mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground uppercase mb-2">
              Tu mundo {userAnimal}
            </h2>
            <p className="text-sm text-muted max-w-xl leading-relaxed">
              Explorá lugares, marcas y entidades que comparten tu mismo animal del Zodiaco Chino.
            </p>
          </div>

          {sections.sameAnimal.map((section) => (
            <CategorySection
              key={section.type}
              label={section.label}
              entities={section.entities}
              type={section.type}
              userAnimal={userAnimal!}
            />
          ))}
        </section>
      )}

      {/* 2. ENERGÍA OPUESTA — collapsed */}
      {sections && enemyName && sections.enemyAnimal.length > 0 && (
        <section aria-label="Energía opuesta" className="mb-20 border-t border-ink/10 pt-12">
          <button
            type="button"
            onClick={() => setEnemyExpanded((v) => !v)}
            className="flex items-center gap-3 mb-4 w-full text-left group"
            aria-expanded={enemyExpanded}
          >
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <div>
              <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-medium group-hover:text-foreground transition-colors">
                Energía opuesta
              </h2>
              <p className="text-sm text-muted mt-0.5">
                {enemyName} — Explorá entidades asociadas a tu animal enemigo en el ciclo zodiacal.
              </p>
            </div>
            <span
              className={`ml-auto text-[10px] text-muted transition-transform ${enemyExpanded ? "rotate-90" : "rotate-0"}`}
              aria-hidden="true"
            >
              ›
            </span>
          </button>

          {enemyExpanded && (
            <div className="mt-6 pl-11">
              {sections.enemyAnimal.map((section) => (
                <CategorySection
                  key={section.type}
                  label={section.label}
                  entities={section.entities}
                  type={section.type}
                  userAnimal={enemyName!}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* 3. EXPLORAR TODO EL ATLAS — catalog, compact */}
      <section
        aria-label="Explorar todo el Atlas"
        className="border-t border-ink/10 pt-12"
      >
        <button
          type="button"
          onClick={() => setCountriesExpanded((v) => !v)}
          className="flex items-center gap-3 mb-6 w-full text-left group"
          aria-expanded={countriesExpanded}
        >
          <div className="w-8 h-px bg-border" aria-hidden="true" />
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-medium group-hover:text-foreground transition-colors">
            Explorar todo el Atlas
          </h2>
          <span
            className={`text-[10px] text-muted transition-transform ${countriesExpanded ? "rotate-90" : "rotate-0"}`}
            aria-hidden="true"
          >
            ›
          </span>
        </button>

        {!hasCoverage && country && (
          <NoCoverageBanner country={country} topCountries={topCountries} />
        )}

        {countriesExpanded && (
          <div className="mb-8">
            <CountryGrid countries={countries} userCountryISO={userCountryISO} />
          </div>
        )}
        {!countriesExpanded && (
          <p className="text-xs text-muted mt-2">
            {countries.length} países con entidades verificadas. Desplegá para navegar por país y categoría.
          </p>
        )}

        {/* Quick links to country drill-downs */}
        {userCountryISO && (
          <div className="mt-8 flex flex-wrap gap-3">
            {["city", "brand", "team", "university"].map((cat) => (
              <Link
                key={cat}
                href={`/atlas/${userCountryISO}/${cat}`}
                className="px-3 py-2 rounded-lg border border-ink/10 text-xs font-medium text-foreground hover:border-accent/40 transition-colors"
              >
                {cat === "city" ? "Ciudades" : cat === "brand" ? "Marcas" : cat === "team" ? "Equipos" : "Universidades"}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
