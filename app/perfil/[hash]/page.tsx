"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import type { UserProfile } from "@/types/user";
import { decodeProfileHash } from "@/lib/profile/hash";
import LoadingState from "@/components/ui/LoadingState";
import ProfileHub from "@/components/profile/ProfileHub";

export default function SharedProfilePage() {
  const params = useParams<{ hash: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hash = params.hash;
    if (!hash) {
      setLoading(false);
      return;
    }
    const found = decodeProfileHash(hash as string);
    setProfile(found);
    setLoading(false);
  }, [params.hash]);

  if (loading) {
    return <LoadingState message="Cargando perfil compartido..." />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-content px-4 sm:px-6 py-24 text-center">
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent font-medium mb-4">Perfil no encontrado</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">
            Este perfil compartido no existe
          </h1>
          <p className="text-muted mb-8 max-w-md mx-auto">
            El enlace que seguiste podría estar vencido o mal formado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ProfileHub profile={profile} />
    </div>
  );
}