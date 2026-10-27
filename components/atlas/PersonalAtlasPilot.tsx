"use client";
import { useL, type Pick2 } from "@/lib/i18n/useL";

import { useEffect, useState } from "react";
import EntityCard from "@/components/atlas/EntityCard";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import type { FallbackLevel, PersonalAtlasGroup } from "@/lib/data/atlas-queries";

const CATEGORY_LABEL = (L: Pick2): Record<string, string> => ({
  university: L("Universidades", "Universities"),
  football_player: L("Jugadores", "Players"),
  artist: L("Famosos", "Famous people"),
  city: "Ciudades",
});

/** Etiqueta honesta del nivel — nunca oculta que un resultado viene de región/mundo. */
const LEVEL_LABEL = (L: Pick2): Record<FallbackLevel, string> => ({
  "country-animal": L("En tu país", "In your country"),
  "country-relation": L("En tu país", "In your country"),
  "region-animal": L("En tu región", "In your region"),
  "region-relation": L("En tu región", "In your region"),
  "world-animal": L("En el mundo", "In the world"),
  "world-relation": L("En el mundo", "In the world"),
});

interface PersonalAtlasPilotProps {
  /** Animal ya resuelto del perfil del usuario (o null si no hay perfil). */
  animal: string | null;
  /** UserContext.country ya traducido a ISO (o null si no hay país/no tiene cobertura). */
  countryISO: string | null;
}

/** Un bloque de categoría: título, badge honesto del nivel, grid de cards. */
function CategoryBlock({
  group,
  heading: Heading = "h3",
  label,
  entities = group.entities,
}: {
  group: PersonalAtlasGroup;
  heading?: "h3" | "h4";
  /** Override del título — usado para subgrupos (ej. "Actualidad" dentro de football_player). */
  label?: string;
  /** Override de las entidades mostradas — usado para subgrupos filtrados por category. */
  entities?: PersonalAtlasGroup["entities"];
}) {
  const L = useL();
  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-3">
        <Heading
          className={
            Heading === "h3"
              ? "font-display text-xl font-bold text-foreground label-caps"
              : "font-display text-base font-bold text-foreground/80 label-caps"
          }
        >
          {label ?? CATEGORY_LABEL(L)[group.category] ?? group.category}
        </Heading>
        <span className="shrink-0 text-sm text-muted border border-ink/10 rounded-full px-2.5 py-1 label-caps">
          {LEVEL_LABEL(L)[group.level]}
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {entities.map((entity) => (
          <EntityCard
            key={entity.id}
            entity={entity}
            countryISO={entity.countryISO ?? ""}
            category={group.category}
          />
        ))}
      </div>
      {entities === group.entities && group.totalAvailable > group.entities.length && (
        <p className="text-xs text-muted mt-3">{L(<>
          Mostrando {group.entities.length} de {group.totalAvailable}.
        </>, <>Showing {group.entities.length} of {group.totalAvailable}.</>)}</p>
      )}
    </div>
  );
}

/** Jugadores separados por category ("actual"/"historico") — mismo group.level, misma data, solo agrupación visual. */
function FootballPlayerBlock({ group }: { group: PersonalAtlasGroup }) {
  const L = useL();
  const actual = group.entities.filter((e) => e.category === "actual");
  const historico = group.entities.filter((e) => e.category === "historico");

  return (
    <div>
      <h4 className="font-display text-base font-bold text-foreground/80 mb-6 label-caps">
        {CATEGORY_LABEL(L).football_player}
      </h4>
      <div className="space-y-6 sm:pl-6 sm:border-l border-ink/10">
        {actual.length > 0 && <CategoryBlock group={group} heading="h4" label={L("Actualidad", "Today")} entities={actual} />}
        {historico.length > 0 && (
          <CategoryBlock group={group} heading="h4" label={L("Referentes históricos", "Historical figures")} entities={historico} />
        )}
      </div>
    </div>
  );
}

/**
 * Demostración piloto de getPersonalAtlas(): university/
 * football_player/artist/city, fallback país -> región -> mundo resuelto
 * server-side vía /api/atlas/personal. El cliente solo recibe
 * LightweightEntity[] + el nivel alcanzado — nunca vuelve a filtrar
 * SYMBOLIC_ENTITIES ni recibe el dataset completo.
 *
 * Agrupación de producto: los Jugadores se presentan bajo
 * "Fútbol" — misma data, misma cascada, solo agrupación visual (ver
 * getPersonalAtlas: cada categoría sigue resolviendo su propio fallback
 * de forma independiente).
 */
export default function PersonalAtlasPilot({ animal, countryISO }: PersonalAtlasPilotProps) {
  const L = useL();
  const [groups, setGroups] = useState<PersonalAtlasGroup[] | null>(null);

  useEffect(() => {
    if (!animal) {
      setGroups(null);
      return;
    }
    let cancelled = false;
    const params = new URLSearchParams({ animal });
    if (countryISO) params.set("countryISO", countryISO);

    fetch(`/api/atlas/personal?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled) setGroups(data?.groups ?? null);
      })
      .catch(() => {
        if (!cancelled) setGroups(null);
      });

    return () => {
      cancelled = true;
    };
  }, [animal, countryISO]);

  if (!animal || !groups) return null;

  const byCategory = new Map(groups.map((g) => [g.category, g]));
  const university = byCategory.get("university");
  const footballPlayer = byCategory.get("football_player");
  const artist = byCategory.get("artist");
  const city = byCategory.get("city");

  const hasUniversity = (university?.entities.length ?? 0) > 0;
  const hasFootball = (footballPlayer?.entities.length ?? 0) > 0;
  const hasArtist = (artist?.entities.length ?? 0) > 0;
  const hasCity = (city?.entities.length ?? 0) > 0;

  if (!hasUniversity && !hasFootball && !hasArtist && !hasCity) return null;

  return (
    <motion.section aria-label={L("Tu Atlas", "Your Atlas")} className="relative mb-24" {...fadeUp}>
      <div className="flex items-center gap-4 mb-10" aria-hidden="true">
        <div className="h-px flex-1 bg-ink/10" />
        <div className="w-1.5 h-1.5 rounded-full bg-accent/30" />
        <div className="h-px flex-1 bg-ink/10" />
      </div>

      <p className="text-sm text-accent font-semibold mb-2 label-caps">{L("Tu Atlas", "Your Atlas")}</p>
      <h2 className="section-title text-foreground mb-10">
        {animal}
      </h2>

      <div className="space-y-12">
        {hasUniversity && <CategoryBlock group={university!} />}

        {hasFootball && (
          <div>
            <h3 className="font-display text-xl font-bold text-foreground mb-6 label-caps">{L("Fútbol", "Football")}</h3>
            <div className="space-y-8 sm:pl-6 sm:border-l border-ink/10">
              <FootballPlayerBlock group={footballPlayer!} />
            </div>
          </div>
        )}

        {hasArtist && <CategoryBlock group={artist!} />}
        {hasCity && <CategoryBlock group={city!} />}
      </div>
    </motion.section>
  );
}
