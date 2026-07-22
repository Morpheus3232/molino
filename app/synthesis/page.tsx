"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadProfileFromStorage } from "@/lib/storage/localStorage";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import SynthesisCard from "@/components/profile/SynthesisCard";

export default function SynthesisPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = loadProfileFromStorage();
    if (stored) {
      const calculated = calculateUserProfile(stored.name, stored.birthDate);
      setProfile({
        ...calculated,
        ...stored,
      } as UserProfile);
    } else {
      router.push("/");
    }
  }, [router]);

  if (!mounted || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Cargando síntesis...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />
      <div className="max-w-content mx-auto px-4 sm:px-6 py-10 pb-24">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => router.back()}>
            ← Volver
          </Button>
          <Button variant="ghost" onClick={() => router.push("/profile")}>
            Ir al perfil →
          </Button>
        </div>

        <SynthesisCard profile={profile} />
      </div>
      <UniversityFooter />
    </div>
  );
}
