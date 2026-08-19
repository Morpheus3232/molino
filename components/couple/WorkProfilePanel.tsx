"use client";

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
  const result = useMemo(() => getWorkProfile(profile), [profile]);
  const name = profile.name?.trim() || "Esta persona";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-3xl border border-accent/25 bg-card p-6 sm:p-10 shadow-sm space-y-8 ${className}`}
    >
      <div className="flex items-center gap-2 justify-center">
        <Briefcase className="w-4 h-4 text-accent" />
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent font-bold">
          Perfil de Trabajo
        </span>
      </div>

      <div className="text-center">
        <p className="font-display text-2xl sm:text-3xl text-foreground tracking-tight">
          {name} · Camino de Vida {result.lifePath} — {result.lifePathTitle}
        </p>
        <p className="text-sm sm:text-base text-muted leading-relaxed max-w-xl mx-auto mt-4">
          {result.workStyle}
        </p>
      </div>

      {result.animal && (
        <div className="pt-6 border-t border-ink/10 text-center">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted mb-2">
            Signo del zodíaco chino: {result.animal}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {result.animalTraits.map((trait) => (
              <span
                key={trait}
                className="font-mono text-xs uppercase tracking-[0.1em] px-2.5 py-1 border border-ink/10 text-foreground"
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
