"use client";

import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import SavedProfilesDrawer from "@/components/profile/SavedProfilesDrawer";

interface ActionButtonsProps {
  profile: UserProfile;
}

export default function ActionButtons({ profile }: ActionButtonsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="flex flex-wrap items-center justify-center py-8 border-t border-ink/10"
      role="group"
      aria-label="Acciones para tu mapa"
    >
      <SavedProfilesDrawer currentProfile={profile} />
    </motion.div>
  );
}
