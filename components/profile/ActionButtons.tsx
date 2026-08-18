"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import type { UserProfile } from "@/types/user";
import SavedProfilesDrawer from "@/components/profile/SavedProfilesDrawer";
import { clearStoredProfile } from "@/lib/session/localStorage";
import { clearSession } from "@/lib/session/ephemeral";

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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="flex flex-wrap items-center justify-center gap-3 py-8 border-t border-ink/10"
      role="group"
      aria-label="Acciones para tu mapa"
    >
      <SavedProfilesDrawer currentProfile={profile} />
      <button
        type="button"
        onClick={handleRedo}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-ink/10 text-xs font-mono text-foreground/90 hover:border-accent/40 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all shadow-sm"
        title="Borrar este mapa y crear uno nuevo (por ejemplo, si pusiste mal la fecha de nacimiento)"
      >
        <RotateCcw className="w-3.5 h-3.5 text-accent" />
        <span>Rehacer mi mapa</span>
      </button>
    </motion.div>
  );
}
