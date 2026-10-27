"use client";
import { useL } from "@/lib/i18n/useL";

import { motion } from "framer-motion";
import { useRouter } from "@/lib/i18n/navigation";
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
  const L = useL();
  const router = useRouter();

  const handleRedo = () => {
    if (!window.confirm(L("¿Borrar este mapa y volver a empezar? Si pusiste mal la fecha de nacimiento, esto te deja crear uno nuevo.", "Delete this map and start over? If you entered the wrong date of birth, this lets you create a new one."))) return;
    clearStoredProfile();
    clearSession();
    router.push("/");
  };

  return (
    <motion.div
      {...editorialReveal}
      className="flex flex-wrap items-center justify-center gap-4 py-10 border-t border-border"
      role="group"
      aria-label={L("Acciones para tu mapa", "Actions for your map")}
    >
      <SavedProfilesDrawer currentProfile={profile} />
      <button
        type="button"
        onClick={handleRedo}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-paper-alt border border-border text-sm text-foreground hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all label-caps"
        title={L("Borrar este mapa y crear uno nuevo (por ejemplo, si pusiste mal la fecha de nacimiento)", "Delete this map and create a new one (for example, if you entered the wrong date of birth)")}
      >
        <RotateCcw className="w-3.5 h-3.5 text-accent" />
        <span>{L("Rehacer mi mapa", "Redo my map")}</span>
      </button>
    </motion.div>
  );
}
