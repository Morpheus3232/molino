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
  categories: { id: string; label: string; icon: string }[];
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
            className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-full text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)]">
            🔍
          </span>
        </div>

        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "compatibility" | "name")}
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--accent)]"
          >
            <option value="compatibility">Compatibilidad</option>
            <option value="name">Nombre</option>
          </select>

          <button
            onClick={() => setView(view === "list" ? "grid" : "list")}
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm hover:border-[var(--accent)] transition-colors"
          >
            {view === "list" ? "⊞ Grid" : "☰ Lista"}
          </button>
        </div>
      </div>

      <div className="text-xs text-[#6B7280]">
        {results.length} {results.length === 1 ? "resultado" : "resultados"}
      </div>

      {results.length === 0 ? (
        <div className="text-center py-12 text-[var(--muted)]">
          <p className="text-lg">No se encontraron resultados</p>
          <p className="text-sm mt-2">Probá con otra categoría o búsqueda</p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map(({ entity, score }) => (
            <button
              key={entity.id}
              onClick={() => handleEntityClick(entity.id)}
              className="p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all text-left"
            >
              <div className="text-3xl mb-2">{entity.emoji}</div>
              <p className="font-medium text-sm text-[#1F2937]">{entity.name}</p>
              <p className="text-xs text-[#6B7280] mt-1">
                {entity.context.keyThemes.slice(0, 2).join(" · ")}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-[#6B7280] capitalize">{entity.category}</span>
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
              className="w-full flex items-center justify-between p-4 bg-[var(--background)] rounded-xl border border-[var(--border)] hover:border-[var(--accent)] transition-all group"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{entity.emoji}</span>
                <div className="text-left">
                  <p className="font-medium">{entity.name}</p>
                  <p className="text-sm text-[var(--muted)]">
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
                <p className="text-xs text-[var(--muted)]">
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

