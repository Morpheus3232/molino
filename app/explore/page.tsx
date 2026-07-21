"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserProfile, type UserProfile } from "@/lib/storage/userProfile";
import { ENTITIES, EntityProfile } from "@/lib/data/entities";
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
];

export default function ExplorePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const savedProfile = getUserProfile();
    if (!savedProfile) {
      router.push("/");
      return;
    }
    setProfile(savedProfile);
  }, [router]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--muted)]">Cargando tu perfil...</div>
      </div>
    );
  }

  const archetypeName = ARCHETYPES[profile.lifePath]?.name || profile.archetype;

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
        entities={ENTITIES}
        categories={CATEGORIES}
      />
    </div>
  );
}
