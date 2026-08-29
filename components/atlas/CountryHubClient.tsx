"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, MapPin, Building2, ArrowRight } from "lucide-react";
import type { AtlasCategory } from "@/lib/data/atlas-queries";
import type { LightweightEntity } from "@/types/atlas";
import CategoryGrid from "@/components/atlas/CategoryGrid";
import EntityVisual from "@/components/ui/EntityVisual";
import { fadeUp } from "@/lib/utils/motion";

interface CountryHubClientProps {
  countryISO: string;
  countryName: string;
  flagEmoji: string;
  categories: AtlasCategory[];
  cities: LightweightEntity[];
  countryEntity: LightweightEntity | null;
}

export default function CountryHubClient({
  countryISO,
  countryName,
  flagEmoji,
  categories,
  cities,
  countryEntity,
}: CountryHubClientProps) {
  const [cityQuery, setCityQuery] = useState("");

  const filteredCities = useMemo(() => {
    if (!cityQuery.trim()) return cities;
    const q = cityQuery.toLowerCase().trim();
    return cities.filter((c) => c.name.toLowerCase().includes(q));
  }, [cities, cityQuery]);

  const totalEntities = useMemo(() => {
    return categories.reduce((acc, curr) => acc + curr.count, 0);
  }, [categories]);

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-5xl sm:text-6xl leading-none select-none" role="img" aria-label={countryName}>
              {flagEmoji}
            </span>
            <div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground uppercase leading-[0.92]">
                {countryName}
              </h1>
              <p className="font-mono text-xs uppercase tracking-wider text-muted mt-1.5">
                {totalEntities} {totalEntities === 1 ? "entidad registrada" : "entidades registradas"}
              </p>
            </div>
          </div>

          {countryEntity && (
            <Link
              href={`/affinity/country/${countryEntity.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-accent/30 bg-accent/5 hover:bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider transition-colors self-start sm:self-auto min-h-[44px]"
            >
              <span>Ficha simbólica de {countryName}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        <p className="text-sm sm:text-base text-muted max-w-2xl leading-relaxed pt-2">
          Explorá las ciudades, instituciones y entidades registradas de {countryName}.
          Podés recorrerlas por categoría o descubrir su afinidad con tu mapa.
        </p>
      </header>

      {/* Explorador de Ciudades del País */}
      {cities.length > 0 && (
        <section aria-labelledby="cities-heading" className="space-y-4 pt-4 border-t border-ink/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent shrink-0" />
              <h2 id="cities-heading" className="font-heading text-lg sm:text-xl font-bold text-foreground">
                Ciudades de {countryName}
              </h2>
              <span className="font-mono text-xs text-muted">({cities.length})</span>
            </div>

            {/* Buscador de ciudades */}
            {cities.length > 3 && (
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={cityQuery}
                  onChange={(e) => setCityQuery(e.target.value)}
                  placeholder={`Buscar ciudad en ${countryName}...`}
                  className="w-full bg-background border border-ink/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all min-h-[40px]"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredCities.map((city) => (
              <Link
                key={city.id}
                href={`/affinity/city/${city.id}`}
                className="group flex items-center justify-between p-3.5 rounded-xl border border-ink/10 bg-card hover:border-accent/40 hover:bg-ink/[0.02] transition-all min-h-[52px]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <EntityVisual visualType="flag" emoji={city.emoji} name={city.name} type="city" countryISO={city.countryISO} size={28} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors truncate">
                      {city.name}
                    </p>
                    {city.origin && (
                      <p className="font-mono text-[10px] text-muted truncate mt-0.5">
                        {city.origin}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-xs text-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 ml-2">
                  →
                </span>
              </Link>
            ))}
          </div>

          {filteredCities.length === 0 && (
            <p className="text-xs text-muted py-4">
              No se encontraron ciudades que coincidan con &quot;{cityQuery}&quot;.
            </p>
          )}
        </section>
      )}

      {/* Categorías del País */}
      {categories.length > 0 && (
        <section aria-labelledby="categories-heading" className="space-y-4 pt-4 border-t border-ink/10">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-accent shrink-0" />
            <h2 id="categories-heading" className="font-heading text-lg sm:text-xl font-bold text-foreground">
              Categorías en {countryName}
            </h2>
          </div>
          <CategoryGrid countryISO={countryISO} categories={categories} />
        </section>
      )}

      {/* Footer Navigation */}
      <div className="pt-8 border-t border-ink/10">
        <Link
          href="/atlas"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted hover:text-accent transition-colors min-h-[44px]"
        >
          <span>← Volver al Atlas</span>
        </Link>
      </div>
    </div>
  );
}
