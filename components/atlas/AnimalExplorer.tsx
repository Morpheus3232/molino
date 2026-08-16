"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, fadeUpDelayed } from "@/lib/utils/motion";
import type { LightweightEntity } from "@/types/atlas";
import { getAnimalProfile } from "@/lib/data/animalRelations";
import type { Animal } from "@/lib/data/animalRelations";
import { getCountryISO } from "@/lib/data/country-iso";
import { useUserContext } from "@/lib/hooks/useUserContext";
import AtlasBreadcrumbs from "@/components/atlas/AtlasBreadcrumbs";

const CATEGORY_ORDER = [
  { type: "country", label: "Países" },
  { type: "city", label: "Ciudades" },
  { type: "brand", label: "Marcas" },
  { type: "team", label: "Equipos" },
  { type: "university", label: "Universidades" },
  { type: "artist", label: "Artistas" },
  { type: "movie", label: "Películas" },
];

interface AnimalExplorerProps {
  animal: string;
  entities: LightweightEntity[];
  isEnemy?: boolean;
}

function entityHref(entity: LightweightEntity): string {
  return `/affinity/${entity.type}/${entity.id}`;
}

export default function AnimalExplorer({ animal, entities, isEnemy }: AnimalExplorerProps) {
  const { country } = useUserContext();
  const userCountryISO = useMemo(() => (country ? getCountryISO(country) : null), [country]);

  const profile = useMemo(() => {
    try { return getAnimalProfile(animal as Animal); } catch { return null; }
  }, [animal]);
  const animalEmoji = profile?.emoji ?? "";

  const grouped = useMemo(() => {
    const map = new Map<string, LightweightEntity[]>();
    for (const e of entities) {
      const list = map.get(e.type) ?? [];
      list.push(e);
      map.set(e.type, list);
    }
    const result: { type: string; label: string; entities: LightweightEntity[] }[] = [];
    for (const { type, label } of CATEGORY_ORDER) {
      const pool = map.get(type);
      if (!pool || pool.length === 0) continue;
      const sorted = [...pool];
      if (userCountryISO) {
        sorted.sort((a, b) => {
          const aMatch = a.countryISO === userCountryISO ? 1 : 0;
          const bMatch = b.countryISO === userCountryISO ? 1 : 0;
          return bMatch - aMatch;
        });
      }
      result.push({ type, label, entities: sorted });
    }
    return result;
  }, [entities, userCountryISO]);

  return (
    <main id="main-content" className="bg-background pt-20 sm:pt-24 pb-24 text-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <AtlasBreadcrumbs
          crumbs={[
            { href: "/atlas", label: "Atlas" },
            { label: isEnemy ? "Energía opuesta" : "Explorar" },
          ]}
        />

        <motion.header className="mb-16" {...fadeUp}>
          {isEnemy ? (
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">
              Energía opuesta
            </p>
          ) : (
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-semibold mb-3">
              Explorar
            </p>
          )}

          <div className="flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-10">
            <div className="flex-1">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground uppercase leading-[0.92]">
                {animal}
              </h1>
              <p className="text-sm sm:text-base text-muted mt-4 max-w-xl leading-relaxed">
                {isEnemy
                  ? "Explorá entidades asociadas al animal opuesto en el ciclo zodiacal."
                  : "Explorá países, ciudades, marcas y entidades que comparten este animal del Zodiaco Chino."}
              </p>
            </div>
            {animalEmoji && (
              <div className="shrink-0 select-none">
                <span className="text-[clamp(3rem,6vw,5rem)] leading-none opacity-20">
                  {animalEmoji}
                </span>
              </div>
            )}
          </div>
        </motion.header>

        {/* Categories */}
        <section aria-label="Categorías" className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-accent/15 hidden sm:block" aria-hidden="true" />

          <div className="sm:pl-10 space-y-14 sm:space-y-16">
            {grouped.map((g, i) => (
              <motion.div key={g.type} {...fadeUpDelayed(i * 0.05)}>
                <div className="flex items-end justify-between mb-4">
                  <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground uppercase">
                    {g.label}
                  </h2>
                  <span className="font-mono text-[11px] text-muted">
                    {g.entities.length} {g.entities.length === 1 ? "entidad" : "entidades"}
                  </span>
                </div>

                <div className="space-y-2">
                  {g.entities.slice(0, 6).map((e) => (
                    <Link
                      key={e.id}
                      href={entityHref(e)}
                      className="flex items-center gap-3 py-2.5 px-3 -mx-3 rounded-lg hover:bg-ink/[0.03] transition-colors group"
                    >
                      <span className="text-lg leading-none shrink-0 select-none" role="img" aria-label={e.name}>
                        {e.emoji || "🔮"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors truncate">
                          {e.name}
                        </p>
                        {e.origin && (
                          <p className="text-[11px] text-muted mt-0.5 truncate">{e.origin}</p>
                        )}
                      </div>
                      <span className="shrink-0 text-[11px] text-muted truncate max-w-[120px] text-right">
                        {e.country || ""}
                      </span>
                    </Link>
                  ))}
                </div>

                {g.entities.length > 6 && (
                  <Link
                    href={`/atlas/explorar/${animal}/${g.type}`}
                    className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-muted hover:text-accent transition-colors group/link"
                  >
                    <span>Ver todas las {g.label.toLowerCase()}</span>
                    <span className="group-hover/link:translate-x-0.5 transition-transform" aria-hidden="true">→</span>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {grouped.length === 0 && (
          <motion.div {...fadeUpDelayed(0.1)} className="text-center py-16">
            <p className="text-sm text-muted">
              No hay entidades registradas para {animal} en este momento.
            </p>
          </motion.div>
        )}

        <div className="mt-16 pt-12 border-t border-ink/10">
          <Link
            href="/atlas"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-accent transition-colors group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform" aria-hidden="true">←</span>
            <span>Volver al Atlas</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
