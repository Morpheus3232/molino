"use client";
import { useL, type Pick2 } from "@/lib/i18n/useL";

import { useMemo } from "react";
import { Link } from "@/lib/i18n/navigation";
import { entityLinkRel } from "@/lib/seo/entity-links";
import { motion } from "framer-motion";
import { fadeUp, fadeUpDelayed } from "@/lib/utils/motion";
import type { LightweightEntity } from "@/types/atlas";
import { getAnimalProfile } from "@/lib/data/animalRelations";
import type { Animal } from "@/lib/data/animalRelations";
import { getCountryISO } from "@/lib/data/country-iso";
import { useUserContext } from "@/lib/hooks/useUserContext";
import AtlasBreadcrumbs from "@/components/atlas/AtlasBreadcrumbs";
import EntityVisual from "@/components/ui/EntityVisual";
import ZodiacAnimalIcon from "@/components/ui/ZodiacAnimalIcon";

const CATEGORY_LABELS = (L: Pick2): Record<string, string> => ({
  country: "Países",
  city: "Ciudades",
  autos: L("Marcas de autos", "Car brands"),
  ropa: L("Marcas de ropa", "Clothing brands"),
  brand: L("Otras marcas", "Other brands"),
  university: L("Universidades", "Universities"),
  artist: L("Famosos", "Famous people"),
  movie: L("Películas", "Movies"),
});

interface AnimalCategoryListingProps {
  animal: string;
  category: string;
  entities: LightweightEntity[];
}

export default function AnimalCategoryListing({ animal, category, entities }: AnimalCategoryListingProps) {
  const L = useL();
  const { country } = useUserContext();
  const userCountryISO = useMemo(() => (country ? getCountryISO(country) : null), [country]);
  const catLabel = CATEGORY_LABELS(L)[category] ?? category;

  const profile = useMemo(() => {
    try { return getAnimalProfile(animal as Animal); } catch { return null; }
  }, [animal]);
  const animalEmoji = profile?.emoji ?? "";

  const sorted = useMemo(() => {
    const copy = [...entities];
    if (userCountryISO) {
      copy.sort((a, b) => {
        const aMatch = a.countryISO === userCountryISO ? 1 : 0;
        const bMatch = b.countryISO === userCountryISO ? 1 : 0;
        return bMatch - aMatch;
      });
    }
    return copy;
  }, [entities, userCountryISO]);

  return (
    <main id="main-content" className="bg-background pt-20 sm:pt-24 pb-24 text-foreground">
      <div className="mx-auto max-w-4xl px-4 sm:px-8">
        <AtlasBreadcrumbs
          crumbs={[
            { href: "/atlas", label: "Atlas" },
            { href: `/atlas/explorar/${animal}`, label: animal },
            { label: catLabel },
          ]}
        />

        <motion.header className="mb-12" {...fadeUp}>
          <p className="text-sm text-accent font-semibold mb-3 label-caps">
            {L.t(animal)}
          </p>

          <div className="flex items-end gap-4">
            <h1 className="page-title text-foreground">
              {L.t(catLabel)}
            </h1>
            <ZodiacAnimalIcon animal={animal} size={28} className="text-accent/40 shrink-0" />
          </div>

          <p className="text-sm text-muted mt-3">{L(<>
            {entities.length} {entities.length === 1 ? "entidad" : "entidades"} con animal {L.t(animal)} — priorizando tu país.
          </>, <>{entities.length} {entities.length === 1 ? "entity" : "entities"} with the {L.t(animal)} animal — your country first.</>)}</p>
        </motion.header>

        <section aria-label={L(`${catLabel} de ${animal}`, `${L.t(catLabel)} of ${L.t(animal)}`)} className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-accent/15 hidden sm:block" aria-hidden="true" />

          <div className="sm:pl-10 space-y-2">
            {sorted.map((e, i) => (
              <motion.div
                key={e.id}
                {...fadeUpDelayed(i * 0.03)}
              >
                <Link
                  href={`/affinity/${e.type}/${e.id}`}
                  rel={entityLinkRel(e)}
                  className="flex items-center gap-3 py-2.5 px-3 -mx-3 rounded-lg hover:bg-ink/[0.03] transition-colors group"
                >
                  <EntityVisual
                    name={e.name}
                    emoji={e.emoji}
                    imageUrl={e.imageUrl}
                    type={e.type}
                    category={e.category}
                    visualType={e.visualType}
                    countryISO={e.countryISO}
                    size={28}
                    className="shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors truncate">
                      {L.t(e.name)}
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] text-muted truncate max-w-[120px] text-right">
                    {L.t(e.country || "")}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {sorted.length === 0 && (
          <motion.div {...fadeUpDelayed(0.1)} className="text-center py-16">
            <p className="text-sm text-muted">{L(<>
              No hay {L.t(catLabel.toLowerCase())} registradas para {L.t(animal)} en este momento.
            </>, <>There are no {L.t(catLabel.toLowerCase())} recorded for {L.t(animal)} right now.</>)}</p>
          </motion.div>
        )}

        <div className="mt-16 pt-12 border-t border-ink/10">{L(<>
          <Link
            href={`/atlas/explorar/${animal}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-accent transition-colors group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform" aria-hidden="true">←</span>
            <span>Volver a {L.t(animal)}</span>
          </Link>
        </>, <><Link href={`/atlas/explorar/${animal}`} className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-accent transition-colors group"><span className="group-hover:-translate-x-0.5 transition-transform" aria-hidden="true">←</span><span>Back to {L.t(animal)}</span></Link></>)}</div>
      </div>
    </main>
  );
}
