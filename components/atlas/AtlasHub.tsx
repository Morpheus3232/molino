"use client";

import { useMemo, useState, useEffect } from "react";
import type { LightweightEntity } from "@/types/atlas";
import type { AtlasCountry } from "@/lib/data/atlas-queries";
import { getCountryISO } from "@/lib/data/country-iso";
import { getCuratedLocalFromPool, getCurationCategoryLabel, CURATION_SECTION_ORDER, FEATURED_COUNTRY_ISOS } from "@/lib/data/atlas-curation-helpers";
import { useUserContext } from "@/lib/hooks/useUserContext";
import { loadProfileFromStorage } from "@/lib/session/localStorage";
import { sortLightEntities, selectAtlasRecommendations, type LightAffinityResult, type AtlasRecommendations } from "@/lib/affinity-light";
import CountryGrid from "@/components/atlas/CountryGrid";
import Link from "next/link";

interface AtlasHubProps {
  countries: AtlasCountry[];
  topCountries: AtlasCountry[];
  allEntities: LightweightEntity[];
  globalCurated: Record<string, LightweightEntity[]>;
}

const BUCKET_LABELS: Record<keyof AtlasRecommendations, { title: string; subtitle: string }> = {
  high:   { title: "Resonancia Alta", subtitle: "Entidades cuya energía se cruza con la tuya." },
  medium: { title: "Afinidad Media", subtitle: "Energías independientes con puntos en común." },
  enemy:  { title: "Desafiantes", subtitle: "Oposición que invita a definir una postura." },
};

const BUCKET_STYLE: Record<keyof AtlasRecommendations, string> = {
  high:   "border-emerald-500/20 bg-emerald-500/[0.03]",
  medium: "border-amber-500/15 bg-amber-500/[0.02]",
  enemy:  "border-red-500/15 bg-red-500/[0.02]",
};

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-px bg-border" aria-hidden="true" />
      <h3 className="text-xs uppercase tracking-[0.2em] text-muted font-medium">{label}</h3>
    </div>
  );
}

function EntityChip({ entity }: { entity: LightweightEntity }) {
  return (
    <Link
      href={`/affinity/${entity.type}/${entity.id}`}
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-ink/10 bg-card hover:border-accent/40 hover:bg-ink/[0.02] transition-colors group"
    >
      <span className="text-lg leading-none shrink-0" role="img" aria-label={entity.name}>
        {entity.emoji || "🔮"}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground group-hover:text-accent transition-colors truncate">
          {entity.name}
        </p>
        <p className="text-[10px] text-muted truncate">
          {entity.animal}{entity.country ? ` · ${entity.country}` : ""}
        </p>
      </div>
    </Link>
  );
}

function CuratedChips({ entities, label }: { entities: LightweightEntity[]; label: string }) {
  if (entities.length === 0) return null;
  return (
    <div className="mb-6">
      <SectionHeader label={label} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {entities.map((entity) => (
          <EntityChip key={entity.id} entity={entity} />
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

function RecommendationCard({ item }: { item: LightAffinityResult }) {
  return (
    <Link
      href={`/affinity/${item.type}/${item.id}`}
      className="flex items-center gap-3 p-3 rounded-xl border border-ink/10 bg-card/60 hover:border-accent/40 hover:bg-ink/[0.02] transition-colors group"
    >
      <span className="text-2xl leading-none shrink-0" role="img" aria-label={item.name}>
        {item.emoji || "🔮"}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors truncate">
          {item.name}
        </p>
        <p className="text-[11px] text-muted mt-0.5">
          {item.animal}{item.country ? ` · ${item.country}` : ""}
        </p>
      </div>
      <span className="shrink-0 font-mono text-xs text-muted tabular-nums">{item.score}</span>
    </Link>
  );
}

/** Order countries: user first, then featured, then the rest alphabetically. */
function orderCountryGrid(
  countries: AtlasCountry[],
  userCountryISO: string | null,
): AtlasCountry[] {
  const userIdx = userCountryISO ? countries.findIndex((c) => c.iso === userCountryISO) : -1;
  const userCountry = userIdx >= 0 ? countries[userIdx] : null;
  const rest = countries.filter((c) => c.iso !== userCountryISO);

  const featured = rest.filter((c) => FEATURED_COUNTRY_ISOS.includes(c.iso));
  const others = rest.filter((c) => !FEATURED_COUNTRY_ISOS.includes(c.iso));

  const result: AtlasCountry[] = [];
  if (userCountry) result.push(userCountry);
  result.push(...featured);
  result.push(...others);
  return result;
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

  const ordered = useMemo(
    () => orderCountryGrid(countries, userCountryISO),
    [countries, userCountryISO],
  );

  const localCurated = useMemo(() => {
    if (!userCountryISO) return {};
    return getCuratedLocalFromPool(allEntities, userCountryISO, globalCurated);
  }, [userCountryISO, allEntities, globalCurated]);

  const [recommendations, setRecommendations] = useState<AtlasRecommendations | null>(null);
  const [userAnimal, setUserAnimal] = useState<string | null>(null);
  const [countriesExpanded, setCountriesExpanded] = useState(false);

  useEffect(() => {
    const profile = loadProfileFromStorage();
    const animal = profile?.chineseZodiac || null;
    setUserAnimal(animal);
    if (!animal || allEntities.length === 0) {
      setRecommendations(null);
      return;
    }
    const ranked = sortLightEntities(animal, allEntities);
    setRecommendations(selectAtlasRecommendations(ranked, userCountryISO));
  }, [allEntities, userCountryISO]);

  const showGlobal = CURATION_SECTION_ORDER.some(
    (type) => (globalCurated[type]?.length ?? 0) > 0,
  );
  const showLocal = CURATION_SECTION_ORDER.some(
    (type) => (localCurated[type]?.length ?? 0) > 0,
  );

  return (
    <div>
      {/* 1. AFFINITY RECOMMENDATIONS */}
      {recommendations && (
        <section aria-label="Recomendaciones personalizadas" className="mb-16">
          <SectionHeader label={`Recomendaciones — ${userAnimal}`} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {(["high", "medium", "enemy"] as (keyof AtlasRecommendations)[]).map((bucket) => {
              const items = recommendations[bucket];
              if (items.length === 0) return null;
              const { title, subtitle } = BUCKET_LABELS[bucket];
              return (
                <div key={bucket} className={`rounded-2xl border ${BUCKET_STYLE[bucket]} p-5`}>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{title}</h3>
                  <p className="text-xs text-muted mb-4">{subtitle}</p>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <RecommendationCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 2. CURATED GLOBAL SECTIONS */}
      {showGlobal && (
        <section aria-label="Entidades del mundo" className="mb-16">
          <h2 className="text-sm font-semibold text-foreground mb-6">Entidades del mundo</h2>
          {CURATION_SECTION_ORDER.map((type) => (
            <CuratedChips
              key={`global-${type}`}
              entities={globalCurated[type] ?? []}
              label={getCurationCategoryLabel(type)}
            />
          ))}
        </section>
      )}

      {/* 3. CURATED LOCAL SECTIONS */}
      {showLocal && (
        <section aria-label="Entidades de tu país" className="mb-16">
          <h2 className="text-sm font-semibold text-foreground mb-6">
            {country ? `Entidades de ${country}` : "Entidades de tu país"}
          </h2>
          {CURATION_SECTION_ORDER.map((type) => (
            <CuratedChips
              key={`local-${type}`}
              entities={localCurated[type] ?? []}
              label={getCurationCategoryLabel(type)}
            />
          ))}
        </section>
      )}

      {/* 4. COUNTRIES — compact, collapsible */}
      <section aria-label="Explorar por país" className="mt-16 border-t border-ink/10 pt-12">
        <button
          type="button"
          onClick={() => setCountriesExpanded((v) => !v)}
          className="flex items-center gap-3 mb-6 w-full text-left group"
          aria-expanded={countriesExpanded}
        >
          <div className="w-8 h-px bg-border" aria-hidden="true" />
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-medium group-hover:text-foreground transition-colors">
            Explorar por país
          </h2>
          <span className={`text-[10px] text-muted transition-transform ${countriesExpanded ? "rotate-90" : "rotate-0"}`} aria-hidden="true">
            ›
          </span>
        </button>

        {!hasCoverage && country && (
          <NoCoverageBanner country={country} topCountries={topCountries} />
        )}

        {countriesExpanded && (
          <CountryGrid countries={ordered} userCountryISO={userCountryISO} />
        )}
        {!countriesExpanded && (
          <p className="text-xs text-muted mt-2">
            {countries.length} países con entidades verificadas. Desplegá para navegar por país.
          </p>
        )}
      </section>
    </div>
  );
}
