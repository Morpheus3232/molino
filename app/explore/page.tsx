"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getSession, isSessionValid } from "@/lib/storage/ephemeral";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import { ENTITIES, EntityProfile, EXTENDED_ENTITIES } from "@/lib/data/entities";
import { ARCHETYPES } from "@/lib/data";
import CompatibilityExplorer from "@/components/explore/CompatibilityExplorer";

const CATEGORIES = [
  { id: "all", label: "Todos", icon: "🔍" },
  { id: "country", label: "Países", icon: "🌍" },
  { id: "city", label: "Ciudades", icon: "🏙️" },
  { id: "brand", label: "Marcas", icon: "🏷️" },
  { id: "band", label: "Bandas", icon: "🎸" },
  { id: "movie", label: "Películas", icon: "🎬" },
  { id: "person", label: "Personajes", icon: "🧠" },
  { id: "sport", label: "Deportes", icon: "⚽" },
  { id: "food", label: "Gastronomía", icon: "🍽️" },
  { id: "tech", label: "Tecnología", icon: "💻" },
  { id: "nature", label: "Naturaleza", icon: "🌿" },
  { id: "art", label: "Arte", icon: "🎨" },
  { id: "book", label: "Libros", icon: "📚" },
  { id: "videoGame", label: "Videojuegos", icon: "🎮" },
  { id: "anime", label: "Anime", icon: "🇯🇵" },
  { id: "comic", label: "Comics", icon: "🦸" },
  { id: "drink", label: "Bebidas", icon: "🥤" },
  { id: "dessert", label: "Dulces", icon: "🍫" },
  { id: "philosophy", label: "Filosofía", icon: "📖" },
  { id: "historicalEvent", label: "Eventos", icon: "📜" },
  { id: "color", label: "Colores", icon: "🎨" },
  { id: "crystal", label: "Cristales", icon: "💎" },
  { id: "deity", label: "Deidades", icon: "✨" },
];

function getOrCreateProfile(): UserProfile | null {
  const existing = getSession();
  if (existing && isSessionValid()) {
    return calculateUserProfile(existing.name, existing.birthDate);
  }
  return null;
}

export default function ExplorePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(getOrCreateProfile);

  useEffect(() => {
    const current = getOrCreateProfile();
    if (!current) {
      router.push("/");
      return;
    }
    setProfile(current);
  }, [router]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--muted)]">Cargando tu perfil...</div>
      </div>
    );
  }

  const archetypeName = ARCHETYPES[profile.lifePath]?.name || profile.archetype;
  const allEntities = useMemo(() => [...ENTITIES, ...EXTENDED_ENTITIES], []);

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-8">
        <button
          onClick={() => router.push("/profile")}
          className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-4"
        >
          ← Volver a mi perfil
        </button>
        <h1 className="font-serif text-3xl font-light tracking-tight">
          Explorar compatibilidad
        </h1>
        <p className="text-[var(--muted)] mt-2">
          {archetypeName} · {profile.lifePath} · {profile.sunSign}
        </p>
      </div>

      <CompatibilityExplorer
        user={profile}
        entities={allEntities}
        categories={CATEGORIES}
      />
    </div>
  );
}
