"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getSession, isSessionValid } from "@/lib/storage/ephemeral";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import { ENTITIES, EntityProfile } from "@/lib/data/entities";
import { calculateCompatibility } from "@/lib/engines/compatibilityEngine";
import MatchResult from "@/components/match/MatchResult";

function getOrCreateProfile(): UserProfile | null {
  const existing = getSession();
  if (existing && isSessionValid()) {
    return calculateUserProfile(existing.name, existing.birthDate);
  }
  return null;
}

export default function MatchPage() {
  const router = useRouter();
  const params = useParams();
  const entityId = params.entityId as string;

  const [profile, setProfile] = useState<UserProfile | null>(getOrCreateProfile);
  const [entity, setEntity] = useState<EntityProfile | null>(null);
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const current = getOrCreateProfile();
    if (!current) {
      router.push("/");
      return;
    }
    setProfile(current);
  }, [router]);

  useEffect(() => {
    if (!profile || !entityId) return;

    const foundEntity = ENTITIES.find((e) => e.id === entityId);
    if (!foundEntity) {
      router.push("/explore");
      return;
    }

    setEntity(foundEntity);
    const compatibilityResult = calculateCompatibility(profile, foundEntity);
    setResult(compatibilityResult);
    setIsLoading(false);
  }, [profile, entityId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--muted)]">Analizando compatibilidad...</div>
      </div>
    );
  }

  if (!profile || !entity || !result) return null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <MatchResult
        user={profile}
        entity={entity}
        score={result.scores.overall}
      />
    </div>
  );
}
