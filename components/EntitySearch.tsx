"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getChineseAnimal, getCompatibilityScore, getCompatibilityDescription } from "@/lib/data";
import { getEntitiesByCategory, getEntityById, EntityCategory } from "@/lib/data/entities";
import { useAuthSession } from "@/hooks/useAuthSession";
import { saveEntity, removeEntity } from "@/lib/auth/userService";
import { getScoreColor, getScoreLabel, getScoreBgColor } from "@/lib/utils/score";

interface EntitySearchProps {
  userBirthDate: { day: number; month: number; year: number };
  category?: EntityCategory;
  onSelectEntity?: (entity: any) => void;
  selectedEntity?: any;
}

const CATEGORY_META: Record<EntityCategory, { label: string; icon: string }> = {
  country: { label: "Países", icon: "🌍" },
  city: { label: "Ciudades", icon: "🏙️" },
  brand: { label: "Marcas", icon: "🏷️" },
  band: { label: "Bandas", icon: "🎸" },
  movie: { label: "Películas", icon: "🎬" },
  tvshow: { label: "Series", icon: "📺" },
  car: { label: "Autos", icon: "🚗" },
  person: { label: "Personajes", icon: "🧠" },
  sport: { label: "Deportes", icon: "⚽" },
  food: { label: "Gastronomía", icon: "🍽️" },
  drink: { label: "Bebidas", icon: "🥤" },
  dessert: { label: "Dulces", icon: "🍫" },
  tech: { label: "Tecnología", icon: "💻" },
  nature: { label: "Naturaleza", icon: "🌿" },
  art: { label: "Arte", icon: "🎨" },
  music: { label: "Música", icon: "🎵" },
  book: { label: "Libros", icon: "📚" },
  mythology: { label: "Mitología", icon: "🏛️" },
  architecture: { label: "Arquitectura", icon: "🏗️" },
  dance: { label: "Danza", icon: "💃" },
  fashion: { label: "Moda", icon: "👗" },
  philosophy: { label: "Filosofía", icon: "📖" },
  science: { label: "Ciencia", icon: "🔬" },
  spirituality: { label: "Espiritualidad", icon: "✨" },
  videoGame: { label: "Videojuegos", icon: "🎮" },
  anime: { label: "Anime", icon: "🇯🇵" },
  comic: { label: "Comics", icon: "🦸" },
  historicalEvent: { label: "Eventos históricos", icon: "📜" },
  color: { label: "Colores", icon: "🎨" },
  crystal: { label: "Cristales", icon: "💎" },
  deity: { label: "Deidades", icon: "✨" },
};

export default function EntitySearch({ userBirthDate, category = "country", onSelectEntity, selectedEntity }: EntitySearchProps) {
  const [selectedType, setSelectedType] = useState<EntityCategory>(category);
  const [searchTerm, setSearchTerm] = useState("");
  const [internalSelectedEntity, setInternalSelectedEntity] = useState<any | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const { session, refreshSession } = useAuthSession();

  const userAnimal = useMemo(() => getChineseAnimal(userBirthDate.year), [userBirthDate]);
  const activeSelectedEntity = selectedEntity ?? internalSelectedEntity;

  const handleSearch = useCallback(() => {
    if (!searchTerm.trim()) { setResults([]); return; }
    const term = searchTerm.trim().toLowerCase();
    const entities = getEntitiesByCategory(selectedType);
    const found: any[] = [];

    for (const entity of entities) {
      if (entity.name.toLowerCase().includes(term)) {
        const targetAnimal = entity.symbolism.chineseZodiac || "";
        const score = targetAnimal ? getCompatibilityScore(userAnimal, targetAnimal) : 50;
        found.push({ ...entity, score, description: getCompatibilityDescription(score, targetAnimal) });
      }
    }

    found.sort((a, b) => b.score - a.score);
    setResults(found.slice(0, 20));
  }, [searchTerm, userAnimal, selectedType]);

  


  const isSaved = (entityId: string) => {
    return session?.user.savedEntities?.includes(entityId) || false;
  };


  const getEntityIcon = (entity: any) => {
    return CATEGORY_META[entity.category as EntityCategory]?.icon || '📦';
  };

  const handleToggleSave = async (entityId: string) => {
    if (!session?.user.id) return;
    if (isSaved(entityId)) {
      await removeEntity(session.user.id, entityId);
    } else {
      await saveEntity(session.user.id, entityId);
    }
    refreshSession();
  };

  const handleSelect = (entity: any) => {
    setInternalSelectedEntity(entity);
    onSelectEntity?.(entity);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {(Object.keys(CATEGORY_META) as EntityCategory[]).map((key) => (
          <button
            key={key}
            onClick={() => { setSelectedType(key); setSearchTerm(""); setResults([]); setInternalSelectedEntity(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedType === key ? "bg-foreground text-background shadow-md" : "bg-background text-muted hover:bg-card"
            }`}
          >
            <span>{CATEGORY_META[key].icon}</span>
            <span>{CATEGORY_META[key].label}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder={`Buscar en ${CATEGORY_META[selectedType]?.label.toLowerCase()}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 input"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-foreground text-background rounded-xl hover:bg-accent text-sm font-medium transition-colors"
        >
          Buscar
        </button>
      </div>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <p className="text-xs text-muted uppercase tracking-wider">{results.length} resultados encontrados</p>
            {results.map((entity) => (
              <motion.div
                key={entity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                  activeSelectedEntity?.id === entity.id ? "border-foreground bg-background" : "border-border bg-card"
                }`}
                onClick={() => handleSelect(entity)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getEntityIcon(entity)}</span>
                    <div>
                      <p className="font-medium text-sm text-foreground">{entity.name}</p>
                      <p className="text-xs text-muted">
                        {entity.symbolism.chineseZodiac} ({entity.symbolism.element}) • {entity.context.keyThemes?.slice(0, 2).join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(entity.score)}`}>
                      {entity.score}%
                    </div>
                    {session?.user.id && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleSave(entity.id); }}
                        className="text-lg"
                      >
                        {isSaved(entity.id) ? "❤️" : "🤍"}
                      </button>
                    )}
                  </div>
                </div>

                {activeSelectedEntity?.id === entity.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 pt-3 border-t border-border space-y-2"
                  >
                    <p className="text-sm text-muted">{entity.context.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-muted">
                      <span>Tu animal: {userAnimal}</span>
                      <span>•</span>
                      <span>Animal de {entity.name}: {entity.symbolism.chineseZodiac}</span>
                      {entity.symbolism.lifePath && <><span>•</span><span>Camino de Vida: {entity.symbolism.lifePath}</span></>}
                      {entity.symbolism.sunSign && <><span>•</span><span>Signo: {entity.symbolism.sunSign}</span></>}
                      {entity.context.keyThemes?.length > 0 && <><span>•</span><span>Temas: {entity.context.keyThemes.slice(0, 2).join(", ")}</span></>}
                      {entity.context.funFact && <><span>•</span><span>Dato: {entity.context.funFact}</span></>}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
