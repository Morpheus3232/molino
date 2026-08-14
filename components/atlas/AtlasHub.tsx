"use client";

import { useMemo } from "react";
import type { AtlasCountry } from "@/lib/data/atlas-queries";
import { getCountryISO } from "@/lib/data/country-iso";
import { useUserContext } from "@/lib/hooks/useUserContext";
import CountryGrid from "@/components/atlas/CountryGrid";

interface AtlasHubProps {
  /** Países ordenados alfabéticamente (server). */
  countries: AtlasCountry[];
  /** Top-N países por cantidad de entidades (server), para sugerencias. */
  topCountries: AtlasCountry[];
}

/**
 * Atlas hub wrapper — resolves the user's country client-side (from
 * UserContext) and personalizes the grid: marks + prioritizes the user's
 * country when it has coverage, otherwise shows a suggestion banner with the
 * richest countries. Purely presentational; never touches affinity scores.
 */
export default function AtlasHub({ countries, topCountries }: AtlasHubProps) {
  const { country } = useUserContext();

  const userCountryISO = useMemo(() => {
    if (!country) return null;
    const iso = getCountryISO(country);
    if (!iso) return null;
    // Only treat as covered if the Atlas actually has this country.
    return countries.some((c) => c.iso === iso) ? iso : null;
  }, [country, countries]);

  const hasCoverage = userCountryISO !== null;

  // Prioritize user country first when it has coverage.
  const ordered = useMemo(() => {
    if (!userCountryISO) return countries;
    const idx = countries.findIndex((c) => c.iso === userCountryISO);
    if (idx <= 0) return countries;
    const copy = [...countries];
    const [user] = copy.splice(idx, 1);
    return [user, ...copy];
  }, [countries, userCountryISO]);

  return (
    <div>
      {!hasCoverage && country && (
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
      )}

      <CountryGrid countries={ordered} userCountryISO={userCountryISO} />
    </div>
  );
}

