"use client";
import { useL, type Pick2 } from "@/lib/i18n/useL";

import { useEffect } from "react";
import { useRouter } from "@/lib/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Asterisk, Building2, Car, Globe2, GraduationCap, Trophy, Clapperboard, Mic2, Shirt, type LucideIcon } from "lucide-react";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/utils/motion";
import { useProfile } from "@/lib/hooks/useProfile";
import type { LightweightEntity } from "@/types/atlas";

const EXPLORE_COPY = (L: Pick2): Record<string, string> => ({
  autos: L("Explorar marcas de autos que comparten tu signo.", "Explore car brands that share your sign."),
  ropa: L("Explorar marcas de ropa que comparten tu signo.", "Explore clothing brands that share your sign."),
  brand: L("Explorar otras marcas que comparten tu signo.", "Explore other brands that share your sign."),
  country: "Explorar países que comparten tu signo.",
  city: "Explorar ciudades que comparten tu signo.",
  university: L("Explorar universidades que comparten tu signo.", "Explore universities that share your sign."),
  movie: L("Explorar películas que comparten tu signo.", "Explore movies that share your sign."),
  artist: L("Explorar famosos que comparten tu signo.", "Explore famous people who share your sign."),
  football_player: L("Explorar futbolistas que comparten tu signo.", "Explore footballers who share your sign."),
});

const TYPE_ICONS: Record<string, LucideIcon> = {
  autos: Car,
  ropa: Shirt,
  brand: Asterisk,
  city: Building2,
  country: Globe2,
  university: GraduationCap,
  movie: Clapperboard,
  artist: Mic2,
  football_player: Trophy,
};

const transitionVariants = {
  enter: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } },
};

interface AffinityClientProps {
  byType: Record<string, LightweightEntity[]>;
  typeMeta: Record<string, { label: string; plural: string; icon: string; description: string }>;
}

export default function AffinityHub({ byType, typeMeta }: AffinityClientProps) {
  const L = useL();
  const router = useRouter();
  const { profile, mounted, loading } = useProfile({ redirectIfNotFound: false });

  useEffect(() => {
    if (mounted && !loading && !profile) {
      toast(L("Creá tu perfil primero para ver tus afinidades", "Create your profile first to see your affinities"));
      router.push("/onboarding");
    }
  }, [mounted, loading, profile, router]);

  const availableTypes = Object.keys(byType).filter((t) => byType[t].length > 0);

  return (
    <div className="min-h-screen bg-background">
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
              <p className="sr-only" role="status" aria-label="Preparando tu afinidad...">{L("Preparando tu afinidad...", "Preparing your affinity...")}</p>
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
                <h1 className="page-title text-foreground max-w-3xl">{L("Lo que resuena con tu mapa", "What resonates with your map")}</h1>
                <p className="text-base sm:text-lg text-muted mt-6 max-w-xl leading-relaxed">{L("Cómo aparecen tus patrones en países, ciudades y marcas de tu mundo.", "How your patterns show up in the countries, cities and brands of your world.")}</p>
                {profile && (
                  <p className="text-sm text-muted mt-3">{L(<>
                    Tu signo: {profile.chineseZodiac}
                  </>, <>Your sign: {profile.chineseZodiac}</>)}</p>
                )}
              </motion.section>

              {/* Contexto editorial — qué es y qué no es la resonancia */}
              <motion.section {...fadeUp} className="mb-12 border border-ink/10 p-6">
                <p className="text-sm text-foreground leading-relaxed max-w-2xl">{L("Cada entidad tiene un signo según su fecha de origen, y se compara signo contra signo con el tuyo: tu propio signo, tus dos amigos (三合 San He), tu enemigo (六冲 Liu Chong) o el resto del ciclo.", "Each entity has a sign based on its date of origin, and it's compared sign to sign with yours: your own sign, your two friends (三合 San He), your enemy (六冲 Liu Chong) or the rest of the cycle.")}</p>
                <p className="text-xs text-muted leading-relaxed mt-3 max-w-2xl">{L("No es una predicción ni un puntaje: es una casilla del ciclo de doce. El enemigo se lee como lo que conviene evitar, no como una condena.", "It isn't a prediction or a score: it's a slot in the cycle of twelve. The enemy is read as what's best avoided, not as a sentence.")}</p>
              </motion.section>

              {/* Category grid */}
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-px bg-border" aria-hidden="true" />
                  <h2 className="text-sm text-muted font-medium label-caps">{L("Explorar por categoría", "Explore by category")}</h2>
                </div>
                <motion.div {...staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableTypes.map((type, i) => {
                    const meta = typeMeta[type] || { label: type, plural: type, icon: "", description: "" };
                    const Icon = TYPE_ICONS[type] ?? Asterisk;

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
                        <p className="text-xs text-accent font-medium mt-4 pt-3">{EXPLORE_COPY(L)[type]}</p>
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
