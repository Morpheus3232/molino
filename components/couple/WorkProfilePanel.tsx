"use client";
import { useL } from "@/lib/i18n/useL";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { getWorkProfile } from "@/lib/engines/workProfileEngine";
import { Briefcase } from "lucide-react";

interface WorkProfilePanelProps {
  profile: UserProfile;
  className?: string;
}

export default function WorkProfilePanel({ profile, className = "" }: WorkProfilePanelProps) {
  const L = useL();
  const result = useMemo(() => getWorkProfile(profile), [profile]);
  const name = profile.name?.trim() || L("Esta persona", "This person");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`rounded-xl border border-accent/25 bg-card p-6 sm:p-10 shadow-sm space-y-8 ${className}`}
    >
      <div className="flex items-center gap-2 justify-center">
        <Briefcase className="w-4 h-4 text-accent" />
        <span className="text-sm text-accent font-bold label-caps">{L("Perfil de Trabajo", "Work Profile")}</span>
      </div>

      <div className="text-center">
        <p className="font-display text-2xl sm:text-3xl text-foreground tracking-tight">{L(<>
          {name} · Camino de Vida {result.lifePath} — {result.lifePathTitle}
        </>, <>{name} · Life Path {result.lifePath} — {result.lifePathTitle}</>)}</p>
        <p className="text-sm sm:text-base text-muted leading-relaxed max-w-xl mx-auto mt-4">
          {result.workStyle}
        </p>
      </div>

      {result.animal && (
        <div className="pt-6 border-t border-ink/10 text-center">
          <p className="text-sm text-muted mb-2 label-caps">{L(<>
            Signo del zodíaco chino: {result.animal}
          </>, <>Chinese zodiac sign: {result.animal}</>)}</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {result.animalTraits.map((trait) => (
              <span
                key={trait}
                className="text-sm px-2.5 py-1 border border-ink/10 text-foreground label-caps"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
