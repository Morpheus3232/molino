"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { EntityProfile } from "@/lib/data/entities";
import { UserProfile } from "@/types/user";
import { calculateCompatibility } from "@/lib/engines/compatibilityEngine";
import CategoryGrid from "./CategoryGrid";

interface CompatibilityExplorerProps {
  user: UserProfile;
  entities: EntityProfile[];
  categories: { id: string; label: string; icon?: string }[];
}

export default function CompatibilityExplorer({
  user,
  entities,
  categories,
}: CompatibilityExplorerProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [view, setView] = useState<"list" | "grid">("list");
  const [sortBy, setSortBy] = useState<"compatibility" | "name">("compatibility");

  const results = useMemo(() => {
    let filtered = entities;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((e) => e.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(term) ||
          e.context.keyThemes.some((t) => t.toLowerCase().includes(term))
      );
    }

    const scored = filtered.map((entity) => ({
      entity,
      score: calculateCompatibility(user, entity).scores.overall,
    }));

    if (sortBy === "compatibility") {
      scored.sort((a, b) => b.score - a.score);
    } else {
      scored.sort((a, b) => a.entity.name.localeCompare(b.entity.name));
    }

    return scored;
  }, [entities, selectedCategory, searchTerm, user, sortBy]);

  const handleEntityClick = (entityId: string) => {
    router.push(`/match/${entityId}`);
  };

  return (
    <div className="space-y-6">
      <CategoryGrid selectedId={selectedCategory} onSelect={setSelectedCategory} />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar entidades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
            aria-label="Buscar entidades"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
        </div>

        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "compatibility" | "name")}
            className="input"
            aria-label="Ordenar por"
          >
            <option value="compatibility">Compatibilidad</option>
            <option value="name">Nombre</option>
          </select>

          <button
            onClick={() => setView(view === "list" ? "grid" : "list")}
            className="btn btn-secondary"
            aria-label={view === "list" ? "Ver en grid" : "Ver en lista"}
          >
            {view === "list" ? "Grid" : "Lista"}
          </button>
        </div>
      </div>

      <div className="text-xs text-muted">
        {results.length} {results.length === 1 ? "resultado" : "resultados"}
      </div>

      {results.length === 0 ? (
        <div className="text-center py-12 text-muted">
          <p className="text-lg">No se encontraron resultados</p>
          <p className="text-sm mt-2">Probá con otra categoría o búsqueda</p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map(({ entity, score }) => (
            <button
              key={entity.id}
              onClick={() => handleEntityClick(entity.id)}
              className="card text-left"
            >
              <div className="text-3xl mb-2">{entity.emoji}</div>
              <p className="font-medium text-sm text-foreground">{entity.name}</p>
              <p className="text-xs text-muted mt-1">
                {entity.context.keyThemes.slice(0, 2).join(" · ")}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-muted capitalize">{entity.category}</span>
                <span
                  className={`text-sm font-bold ${
                    score >= 80 ? "text-green-500" :
                    score >= 60 ? "text-blue-500" :
                    score >= 40 ? "text-yellow-500" :
                    "text-red-500"
                  }`}
                >
                  {score}%
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {results.map(({ entity, score }) => (
            <button
              key={entity.id}
              onClick={() => handleEntityClick(entity.id)}
              className="w-full flex items-center justify-between p-4 card text-left"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{entity.emoji}</span>
                <div className="text-left">
                  <p className="font-medium text-foreground">{entity.name}</p>
                  <p className="text-sm text-muted">
                    {entity.context.keyThemes.slice(0, 2).join(" · ")}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`text-lg font-medium ${
                    score >= 80 ? "text-green-500" :
                    score >= 60 ? "text-blue-500" :
                    score >= 40 ? "text-yellow-500" :
                    "text-red-500"
                  }`}
                >
                  {score}%
                </span>
                <p className="text-xs text-muted">
                  {score >= 80 ? "Excelente" :
                   score >= 60 ? "Muy buena" :
                   score >= 40 ? "Buena" :
                   "Baja"}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
