"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { EntityProfile } from "@/lib/data/entities";
import { UserProfile } from "@/types/user";
import { calculateCompatibility } from "@/lib/engines/compatibilityEngine";

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
    
    return filtered.map((entity) => ({
      entity,
      score: calculateCompatibility(user, entity).scores.overall,
    }));
  }, [entities, selectedCategory, searchTerm, user]);

  const handleEntityClick = (entityId: string) => {
    router.push(`/match/${entityId}`);
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar países, marcas, bandas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-full text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)]">
          🔍
        </span>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-1.5 rounded-full text-sm transition-all ${
              selectedCategory === cat.id
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "bg-[var(--background)] text-[var(--muted)] hover:bg-[var(--border)]"
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-3">
        {results.length === 0 ? (
          <div className="text-center py-12 text-[var(--muted)]">
            <p className="text-lg">No se encontraron resultados</p>
            <p className="text-sm mt-2">Probá con otra categoría o búsqueda</p>
          </div>
        ) : (
          results.map(({ entity, score }) => (
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
          ))
        )}
      </div>
    </div>
  );
}
