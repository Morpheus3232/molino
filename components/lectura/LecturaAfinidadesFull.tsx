"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { LightweightEntity } from "@/types/atlas";
import {
  getRelation,
  getFriends,
  getClashPartner,
  type Animal,
} from "@/lib/data/animalRelations";
import EntityVisual from "@/components/ui/EntityVisual";
import { Compass, ArrowRight, Sparkles, Shield, AlertCircle } from "lucide-react";

export type RelationTabKey = "same" | "triad" | "clash";

export type CategoryFilterKey =
  | "all"
  | "country"
  | "city"
  | "football"
  | "university"
  | "team"
  | "artist"
  | "brand"
  | "movie";

interface LecturaAfinidadesFullProps {
  userAnimal: string;
  catalog: LightweightEntity[];
  className?: string;
}

const RELATION_CONFIG: Record<
  RelationTabKey,
  {
    label: string;
    tag: string;
    hint: (userAnimal: string, allies: string[], clashAnimal?: string) => string;
    icon: typeof Sparkles;
  }
> = {
  same: {
    label: "Alta compatibilidad",
    tag: "Mismo animal",
    hint: (userAnimal) =>
      `Comparte tu mismo animal del zodíaco chino (${userAnimal}). Máxima sintonía de ritmo y cualidades compartidas.`,
    icon: Sparkles,
  },
  triad: {
    label: "Buena compatibilidad",
    tag: "Animales aliados",
    hint: (_userAnimal, allies) =>
      `Pertenece a tus dos animales aliados en el ciclo (${allies.join(" y ")}). Colaboración natural y complementariedad fluida.`,
    icon: Shield,
  },
  clash: {
    label: "Energía opuesta",
    tag: "Posición de contraste",
    hint: (_userAnimal, _allies, clashAnimal) =>
      `Pertenece a ${clashAnimal || "tu signo opuesto"}, el animal en posición opuesta (180°). Tensión que conviene observar con cautela.`,
    icon: AlertCircle,
  },
};

const CATEGORY_TABS: { key: CategoryFilterKey; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "country", label: "Países" },
  { key: "city", label: "Ciudades" },
  { key: "football", label: "Fútbol" },
  { key: "university", label: "Universidades" },
  { key: "team", label: "Equipos" },
  { key: "artist", label: "Famosos" },
  { key: "brand", label: "Marcas" },
  { key: "movie", label: "Películas" },
];

const TYPE_LABELS_ES: Record<string, string> = {
  country: "País",
  city: "Ciudad",
  university: "Universidad",
  team: "Equipo",
  football_player: "Jugador",
  artist: "Famoso",
  brand: "Marca",
  movie: "Película",
};

const PAGE_SIZE = 6;

export default function LecturaAfinidadesFull({
  userAnimal,
  catalog,
  className = "",
}: LecturaAfinidadesFullProps) {
  const [activeRelation, setActiveRelation] = useState<RelationTabKey>("same");
  const [activeCategory, setActiveCategory] = useState<CategoryFilterKey>("all");
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  const allies = useMemo(() => {
    if (!userAnimal) return [];
    try {
      return getFriends(userAnimal as Animal)
        .filter((f) => f.type === "triad")
        .map((f) => f.animal);
    } catch {
      return [];
    }
  }, [userAnimal]);

  const clashAnimal = useMemo(() => {
    if (!userAnimal) return undefined;
    try {
      return getClashPartner(userAnimal as Animal);
    } catch {
      return undefined;
    }
  }, [userAnimal]);

  // Agrupación de todo el catálogo por relación con el animal del usuario
  const groupedByRelation = useMemo(() => {
    const groups: Record<RelationTabKey, LightweightEntity[]> = {
      same: [],
      triad: [],
      clash: [],
    };

    if (!userAnimal || !catalog || catalog.length === 0) return groups;

    for (const entity of catalog) {
      if (!entity.animal) continue;
      try {
        const relation = getRelation(userAnimal as Animal, entity.animal as Animal);
        if (relation.type === "same") {
          groups.same.push(entity);
        } else if (relation.type === "triad") {
          groups.triad.push(entity);
        } else if (relation.type === "clash") {
          groups.clash.push(entity);
        }
      } catch {
        // Silencioso en caso de dato no estándar
      }
    }

    return groups;
  }, [userAnimal, catalog]);

  // Entidades activas según la relación seleccionada
  const activeRelationEntities = useMemo(() => {
    return groupedByRelation[activeRelation] || [];
  }, [groupedByRelation, activeRelation]);

  // Filtro por categoría dentro de la relación activa
  const filteredEntities = useMemo(() => {
    if (activeCategory === "all") return activeRelationEntities;
    if (activeCategory === "football") {
      return activeRelationEntities.filter(
        (e) => e.type === "team" || e.type === "football_player"
      );
    }
    return activeRelationEntities.filter((e) => e.type === activeCategory);
  }, [activeRelationEntities, activeCategory]);

  // Conteos por categoría para las píldoras de navegación
  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryFilterKey, number> = {
      all: activeRelationEntities.length,
      country: 0,
      city: 0,
      football: 0,
      university: 0,
      team: 0,
      artist: 0,
      brand: 0,
      movie: 0,
    };

    for (const entity of activeRelationEntities) {
      if (entity.type === "country") counts.country++;
      else if (entity.type === "city") counts.city++;
      else if (entity.type === "university") counts.university++;
      else if (entity.type === "team") counts.team++;
      else if (entity.type === "artist") counts.artist++;
      else if (entity.type === "brand") counts.brand++;
      else if (entity.type === "movie") counts.movie++;

      if (entity.type === "team" || entity.type === "football_player") {
        counts.football++;
      }
    }

    return counts;
  }, [activeRelationEntities]);

  // Cambio de pestaña de relación: resetea paginación
  const handleSelectRelation = useCallback((rel: RelationTabKey) => {
    setActiveRelation(rel);
    setActiveCategory("all");
    setVisibleCount(PAGE_SIZE);
  }, []);

  // Cambio de filtro de categoría: resetea paginación
  const handleSelectCategory = useCallback((cat: CategoryFilterKey) => {
    setActiveCategory(cat);
    setVisibleCount(PAGE_SIZE);
  }, []);

  // Cargar más resultados (+6)
  const handleShowMore = useCallback(() => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  }, []);

  const visibleEntities = useMemo(() => {
    return filteredEntities.slice(0, visibleCount);
  }, [filteredEntities, visibleCount]);

  const hasMore = filteredEntities.length > visibleCount;
  const currentConfig = RELATION_CONFIG[activeRelation];
  const Icon = currentConfig.icon;

  if (!userAnimal) return null;

  return (
    <section
      aria-labelledby="lectura-afinidades-title"
      className={`space-y-8 pt-12 border-t-2 border-ink/15 ${className}`}
    >
      {/* Encabezado editorial */}
      <div>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-semibold block mb-2">
          05 · Tu relación con el mundo
        </span>
        <h2
          id="lectura-afinidades-title"
          className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground uppercase"
        >
          Afinidades y Correspondencias
        </h2>
        <p className="text-sm text-muted mt-2 max-w-xl leading-relaxed">
          Explorá países, ciudades, marcas e instituciones del mundo organizadas por su nivel de sintonía o contraste con tu mapa.
        </p>
      </div>

      {/* 1. Selector Principal de Relación (3 Pestañas de Alto Nivel) */}
      <div
        role="tablist"
        aria-label="Nivel de compatibilidad"
        className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-1.5 rounded-2xl bg-paper-alt border border-ink/10"
      >
        {(["same", "triad", "clash"] as RelationTabKey[]).map((relKey) => {
          const cfg = RELATION_CONFIG[relKey];
          const isSelected = activeRelation === relKey;
          const count = groupedByRelation[relKey].length;

          return (
            <button
              key={relKey}
              role="tab"
              type="button"
              aria-selected={isSelected}
              onClick={() => handleSelectRelation(relKey)}
              className={`flex items-center justify-between p-3.5 rounded-xl text-left transition-all min-h-[48px] ${
                isSelected
                  ? "bg-foreground text-background shadow-md font-bold ring-1 ring-foreground/20"
                  : "bg-transparent text-muted hover:text-foreground/70 hover:bg-ink/[0.04]"
              }`}
            >
              <div className="min-w-0 pr-2">
                <span className="block text-xs sm:text-sm tracking-tight truncate">
                  {cfg.label}
                </span>
                <span className={`font-mono text-[10px] block mt-0.5 truncate ${
                  isSelected ? "text-background/70" : "text-muted"
                }`}>
                  {cfg.tag}
                </span>
              </div>
              <span
                className={`font-mono text-[11px] px-2 py-0.5 rounded-md shrink-0 border ${
                  isSelected
                    ? "bg-background/20 border-background/30 text-background font-bold"
                    : "bg-ink/5 border-ink/10 text-muted"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Explicación contextual de la relación activa */}
      <div className="p-4 rounded-xl bg-ink/[0.02] border border-ink/5 flex items-start gap-3">
        <Icon className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed">
          {currentConfig.hint(userAnimal, allies, clashAnimal)}
        </p>
      </div>

      {/* 2. Selector de Categorías (Píldoras) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted font-semibold">
            Categoría
          </span>
          <span className="font-mono text-[11px] text-muted">
            {filteredEntities.length} {filteredEntities.length === 1 ? "entidad" : "entidades"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          {CATEGORY_TABS.map((cat) => {
            const count = categoryCounts[cat.key];
            if (count === 0 && cat.key !== "all") return null;
            const isSelected = activeCategory === cat.key;

            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => handleSelectCategory(cat.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 min-h-[44px] border ${
                  isSelected
                    ? "bg-foreground text-background border-foreground font-bold shadow-xs"
                    : "bg-card text-muted border-ink/10 hover:border-accent/40 hover:text-foreground"
                }`}
              >
                <span>{cat.label}</span>
                <span className="opacity-70 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Grid de Resultados Paginados (Primeras 6 + expansión progresiva) */}
      <div>
        {visibleEntities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {visibleEntities.map((entity) => (
              <Link
                key={entity.id}
                href={`/affinity/${entity.type}/${entity.id}`}
                className="group flex flex-col justify-between p-4 rounded-xl border border-ink/10 bg-card hover:border-accent/40 hover:bg-ink/[0.02] transition-all min-h-[110px]"
              >
                <div className="flex items-start gap-3">
                  <EntityVisual
                    visualType={entity.visualType}
                    emoji={entity.emoji || "🔮"}
                    imageUrl={entity.imageUrl}
                    name={entity.name}
                    countryISO={entity.countryISO}
                    type={entity.type}
                    category={entity.category}
                    size={36}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors truncate">
                      {entity.name}
                    </p>
                    <p className="text-xs text-muted mt-0.5 truncate">
                      {TYPE_LABELS_ES[entity.type] || entity.type}
                      {entity.country ? ` · ${entity.country}` : ""}
                    </p>
                    {entity.origin && (
                      <p className="font-mono text-[10px] text-muted/70 truncate mt-1">
                        {entity.origin}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-ink/5 flex items-center justify-between text-[11px] font-mono text-muted">
                  <span>{currentConfig.label}</span>
                  <span className="text-accent group-hover:translate-x-1 transition-transform" aria-hidden="true">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-ink/15 rounded-2xl">
            <p className="text-sm text-muted">
              No hay entidades registradas en esta categoría para {currentConfig.label.toLowerCase()}.
            </p>
          </div>
        )}
      </div>

      {/* Botón de Expansión Local (Mostrar más) */}
      {hasMore && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={handleShowMore}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-ink/15 bg-card hover:border-accent hover:text-accent font-mono text-xs uppercase tracking-wider font-semibold transition-all min-h-[44px]"
          >
            <span>Mostrar más ({filteredEntities.length - visibleCount} restantes)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4. Puente de salida a Atlas */}
      <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-paper-alt border border-ink/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-accent font-bold">
            <Compass className="w-4 h-4" />
            <span>Atlas Mundial</span>
          </div>
          <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
            Explorá todo tu Atlas
          </h3>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            El Atlas contiene el catálogo completo de países, ciudades, universidades y clubes del mundo organizado para explorar sin límites.
          </p>
        </div>

        <Link
          href="/atlas"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background hover:bg-accent hover:text-background font-heading font-bold text-xs uppercase tracking-wider transition-colors shrink-0 min-h-[44px]"
        >
          <span>Ir al Atlas</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
