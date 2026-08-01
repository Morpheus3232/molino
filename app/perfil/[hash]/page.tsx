"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { decodeProfileHash } from "@/lib/profile/hash";
import ProfileHub from "@/components/profile/ProfileHub";
import UniversityFooter from "@/components/layout/UniversityFooter";

const transitionVariants = {
  enter: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } },
};

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

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            variants={transitionVariants}
            initial="enter"
            animate="show"
            exit="exit"
          >
            <div className="mx-auto max-w-content px-4 sm:px-6 pt-12 sm:pt-20 pb-24">
              <p className="sr-only" role="status" aria-label="Cargando perfil compartido...">
                Cargando perfil compartido...
              </p>
              <div className="animate-pulse">
                <div className="h-3 bg-[var(--skeleton)] rounded w-10rem mb-6" />
                <div className="h-9 bg-[var(--skeleton)] rounded w-3/4 mb-4" />
                <div className="h-4 bg-[var(--skeleton)] rounded w-1/2 mb-12" />
                <div className="h-64 bg-[var(--skeleton)] border border-ink/10 rounded-md mb-6" />
              </div>
              <UniversityFooter />
            </div>
          </motion.div>
        ) : !profile ? (
          <motion.div
            key="not-found"
            variants={transitionVariants}
            initial="enter"
            animate="show"
            exit="exit"
          >
            <div className="mx-auto max-w-content px-4 sm:px-6 py-24 text-center">
              <p className="text-[10px] uppercase tracking-[0.35em] text-accent font-medium mb-4">Perfil no encontrado</p>
              <h1 className="font-heading text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">
                Este perfil compartido no existe
              </h1>
              <p className="text-muted mb-8 max-w-md mx-auto">
                El enlace que seguiste podría estar vencido o mal formado.
              </p>
            </div>
            <UniversityFooter />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            variants={transitionVariants}
            initial="enter"
            animate="show"
            exit="exit"
          >
            <ProfileHub profile={profile} />
            <UniversityFooter />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
