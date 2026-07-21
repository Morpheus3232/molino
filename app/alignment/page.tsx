"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadProfileFromStorage } from "@/lib/storage/localStorage";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import AlignmentDashboard from "@/components/alignment/AlignmentDashboard";

export default function AlignmentPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = loadProfileFromStorage();
    if (stored) {
      setProfile(stored as UserProfile);
    } else {
      router.push("/");
    }
  }, [router]);

  if (!mounted || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <UniversityHeader />
      <div className="max-w-content mx-auto px-4 sm:px-6 py-8 pb-24">
        <AlignmentDashboard profile={profile} />
      </div>
      <UniversityFooter />
    </div>
  );
}
