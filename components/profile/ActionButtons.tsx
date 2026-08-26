"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import type { UserProfile } from "@/types/user";
import SavedProfilesDrawer from "@/components/profile/SavedProfilesDrawer";
import { clearStoredProfile } from "@/lib/session/localStorage";
import { clearSession } from "@/lib/session/ephemeral";
import { editorialReveal } from "@/lib/utils/motion";

interface ActionButtonsProps {
  profile: UserProfile;
}

export default function ActionButtons({ profile }: ActionButtonsProps) {
  const router = useRouter();

  const handleRedo = () => {
    if (!window.confirm("¿Borrar este mapa y volver a empezar? Si pusiste mal la fecha de nacimiento, esto te deja crear uno nuevo.")) return;
    clearStoredProfile();
    clearSession();
    router.push("/");
  };

  return (
    <motion.div
      {...editorialReveal}
      className="flex flex-wrap items-center justify-center gap-4 py-10 border-t border-border"
      role="group"
      aria-label="Acciones para tu mapa"
    >
      <SavedProfilesDrawer currentProfile={profile} />
      <button
        type="button"
        onClick={handleRedo}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-paper-alt border border-border text-xs font-mono uppercase tracking-wider text-foreground hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all"
        title="Borrar este mapa y crear uno nuevo (por ejemplo, si pusiste mal la fecha de nacimiento)"
      >
        <RotateCcw className="w-3.5 h-3.5 text-accent" />
        <span>Rehacer mi mapa</span>
      </button>
    </motion.div>
  );
}
