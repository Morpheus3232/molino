"use client";

import { useMemo, useState, useEffect } from "react";
import type { LightweightEntity } from "@/types/atlas";
import type { AtlasCountry } from "@/lib/data/atlas-queries";
import { getCountryISO } from "@/lib/data/country-iso";
import { useUserContext } from "@/lib/hooks/useUserContext";
import { loadProfileFromStorage } from "@/lib/session/localStorage";
import { sortLightEntities, selectAtlasRecommendations, type LightAffinityResult, type AtlasRecommendations } from "@/lib/affinity-light";
import CountryGrid from "@/components/atlas/CountryGrid";
import Link from "next/link";

interface AtlasHubProps {
  countries: AtlasCountry[];
  topCountries: AtlasCountry[];
  allEntities: LightweightEntity[];
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

export default function AtlasHub({ countries, topCountries, allEntities }: AtlasHubProps) {
  const { country } = useUserContext();

  const userCountryISO = useMemo(() => {
    if (!country) return null;
    const iso = getCountryISO(country);
    if (!iso) return null;
    return countries.some((c) => c.iso === iso) ? iso : null;
  }, [country, countries]);

  const hasCoverage = userCountryISO !== null;

  const ordered = useMemo(() => {
    if (!userCountryISO) return countries;
    const idx = countries.findIndex((c) => c.iso === userCountryISO);
    if (idx <= 0) return countries;
    const copy = [...countries];
    const [user] = copy.splice(idx, 1);
    return [user, ...copy];
  }, [countries, userCountryISO]);

  const [recommendations, setRecommendations] = useState<AtlasRecommendations | null>(null);
  const [userAnimal, setUserAnimal] = useState<string | null>(null);

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

  return (
    <div>
      {recommendations && (
        <section aria-label="Recomendaciones personalizadas" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-medium">
              Recomendaciones{userAnimal ? ` — ${userAnimal}` : ""}
            </h2>
          </div>

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

      <section aria-label="Países del Atlas">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-border" aria-hidden="true" />
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-medium">Países</h2>
        </div>

        {!hasCoverage && country && (
          <NoCoverageBanner country={country} topCountries={topCountries} />
        )}

        <CountryGrid countries={ordered} userCountryISO={userCountryISO} />
      </section>
    </div>
  );
}
