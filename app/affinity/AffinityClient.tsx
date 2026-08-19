"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Sparkles, Building2, Globe2, GraduationCap, Trophy, Clapperboard, Mic2, type LucideIcon } from "lucide-react";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/utils/motion";
import { useProfile } from "@/lib/hooks/useProfile";
import { ENTITY_TYPES, getAvailableTypes, getEntitiesByType, focusEntitiesByCountry, type EntityType } from "@/lib/data/symbolic-entities";
import { calculateAllAffinity } from "@/lib/engines/affinityEngine";
import { useUserContext } from "@/lib/hooks/useUserContext";

const TYPE_ICONS: Record<EntityType, LucideIcon> = {
  brand: Sparkles,
  city: Building2,
  country: Globe2,
  university: GraduationCap,
  team: Trophy,
  movie: Clapperboard,
  artist: Mic2,
};

const transitionVariants = {
  enter: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } },
};

export default function AffinityHub() {
  const router = useRouter();
  const { profile, mounted, loading } = useProfile({ redirectIfNotFound: false });
  const userCountry = useUserContext().country;

  useEffect(() => {
    if (mounted && !loading && !profile) {
      toast("Creá tu perfil primero para ver tus afinidades");
      router.push("/onboarding");
    }
  }, [mounted, loading, profile, router]);

  const availableTypes = getAvailableTypes();

  // Los conteos reflejan lo mismo que se ve al entrar a cada categoría:
  // acotado al país del usuario cuando hay cobertura local (ciudad, artista,
  // universidad, equipo) — nunca una cifra global que después se reduce.
  const focusedEntitiesByType = Object.fromEntries(
    availableTypes.map((type) => [type, focusEntitiesByCountry(getEntitiesByType(type), type, userCountry)])
  ) as Record<EntityType, ReturnType<typeof getEntitiesByType>>;

  const personalizedCounts = profile ? (() => {
    const counts: Record<string, number> = {};
    availableTypes.forEach(type => {
      const results = calculateAllAffinity(profile, focusedEntitiesByType[type]);
      counts[type] = results.filter(r => r.score >= 50).length;
    });
    return counts;
  })() : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Sin mode="wait": con "wait" el swap loading→contenido se queda
          esperando para siempre a que la animación de salida del skeleton
          termine — reproducido en local, la página no pasa nunca de
          "Preparando tu afinidad...". Sin mode="wait" cross-fadea y sí commitea. */}
      <AnimatePresence>
        {!mounted || loading || !profile ? (
          <motion.div
            key="loading"
            variants={transitionVariants}
            initial="enter"
            animate="show"
            exit="exit"
          >
            <main className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24" id="main-content">
              <p className="sr-only" role="status" aria-label="Preparando tu afinity...">
                Preparando tu afinidad...
              </p>
              <div className="animate-pulse">
                <div className="h-3 bg-[var(--skeleton)] rounded w-12rem mb-6" />
                <div className="h-10 bg-[var(--skeleton)] rounded w-3/4 mb-4" />
                <div className="h-4 bg-[var(--skeleton)] rounded w-1/2 mb-12" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-48 bg-[var(--skeleton)] border border-ink/10 rounded-md" />
                  ))}
                </div>
              </div>
            </main>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            variants={transitionVariants}
            initial="enter"
            animate="show"
            exit="exit"
          >
            <main className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24" id="main-content">

              {/* Hero */}
              <motion.section {...fadeUp} className="mb-16 sm:mb-20">
                <h1 className="font-heading uppercase text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1] max-w-3xl">
                  Lo que resuena con tu mapa
                </h1>
                <p className="text-base sm:text-lg text-muted mt-6 max-w-xl leading-relaxed">
                  Cómo aparecen tus patrones en países, ciudades y marcas de tu mundo.
                </p>
                {profile && (
                  <p className="text-sm text-muted mt-3">
                    Camino de Vida {profile.lifePath} · {profile.chineseZodiac}
                  </p>
                )}
              </motion.section>

              {/* Contexto editorial — qué es y qué no es la resonancia */}
              <motion.section {...fadeUp} className="mb-12 border border-ink/10 p-6">
                <p className="text-sm text-foreground leading-relaxed max-w-2xl">
                  Cada entidad tiene un animal asociado según su fecha de origen. La resonancia compara ese animal con el de tu mapa.
                </p>
                <p className="text-xs text-muted leading-relaxed mt-3 max-w-2xl">
                  No es una predicción ni una medida de compatibilidad personal. Es una lectura simbólica basada exclusivamente en la relación entre ambos animales del zodíaco chino.
                </p>
              </motion.section>

              {/* Category grid */}
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-px bg-border" aria-hidden="true" />
                  <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-medium">Explorar por categoría</h2>
                </div>
                <motion.div {...staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableTypes.map((type, i) => {
                    const meta = ENTITY_TYPES[type];
                    const Icon = TYPE_ICONS[type];
                    const totalCount = focusedEntitiesByType[type].length;
                    const personalCount = personalizedCounts?.[type] ?? null;

                    return (
                      <motion.button
                        key={type}
                        {...staggerItem}
                        onClick={() => router.push(`/affinity/${type}`)}
                        className="text-left p-6 border-t border-ink/10 border-b border-ink/10 hover:bg-ink/[0.02] transition-colors group relative"
                      >
                        <Icon className="w-7 h-7 mb-3 text-accent" strokeWidth={1.5} aria-hidden="true" />
                        <h3 className="font-heading uppercase text-xl font-semibold text-foreground group-hover:text-accent transition-colors">{meta.plural}</h3>
                        <p className="text-sm text-muted mt-2 leading-relaxed">{meta.description}</p>
                        <div className="mt-4 pt-3">
                          {personalCount !== null ? (
                            <>
                              <p className="font-heading text-lg font-semibold text-accent">{personalCount} <span className="text-sm text-muted font-normal">con presencia en tu mapa</span></p>
                              <p className="text-xs text-muted mt-1">{totalCount} {meta.plural.toLowerCase()} en total</p>
                            </>
                          ) : (
                            <p className="text-xs text-accent font-medium">{totalCount} {meta.plural.toLowerCase()}</p>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </section>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}