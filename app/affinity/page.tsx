"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import { useProfile } from "@/lib/hooks/useProfile";
import { ENTITY_TYPES, getAvailableTypes, getEntitiesByType } from "@/lib/data/symbolic-entities";
import type { EntityType } from "@/lib/data/symbolic-entities";
import { calculateAllAffinity } from "@/lib/engines/affinityEngine";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import LoadingState from "@/components/ui/LoadingState";

export default function AffinityHub() {
  const router = useRouter();
  const { profile, mounted } = useProfile({ redirectIfNotFound: false });

  if (!mounted) return <LoadingState message="Cargando..." />;

  const availableTypes = getAvailableTypes();

  const personalizedCounts = profile ? (() => {
    const counts: Record<string, number> = {};
    availableTypes.forEach(type => {
      const entities = getEntitiesByType(type);
      const results = calculateAllAffinity(profile, entities);
      counts[type] = results.filter(r => r.score >= 50).length;
    });
    return counts;
  })() : null;

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />
      <main className="mx-auto max-w-content px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">

        {/* Hero */}
        <motion.section {...fadeUp} className="mb-16 sm:mb-20">
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-4">Afinidad Simbólica</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1] max-w-3xl">
            Descubrí tus afinidades
          </h1>
          <p className="text-base sm:text-lg text-muted mt-6 max-w-xl leading-relaxed">
            Explorá qué entidades resuenan con tu perfil simbólico. Marcas, ciudades, países, universidades, equipos y más.
          </p>
          {profile && (
            <p className="text-sm text-muted mt-3">
              Camino de Vida {profile.lifePath} · {profile.chineseZodiac}
            </p>
          )}
          {!profile && (
            <div className="mt-6">
              <button type="button" onClick={() => router.push("/onboarding")} className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-6 py-3 text-sm bg-primary text-primary-foreground shadow-sm hover:bg-accent hover:text-accent-foreground min-h-[44px]">
                Crear tu perfil para afinidad personalizada
              </button>
              <p className="text-xs text-muted mt-2">Sin registro. Sin guardar datos.</p>
            </div>
          )}
        </motion.section>

        {/* Category grid */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Explorar por categoría</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableTypes.map((type, i) => {
              const meta = ENTITY_TYPES[type];
              const totalCount = getEntitiesByType(type).length;
              const personalCount = personalizedCounts?.[type] ?? null;
              
              return (
                <motion.button
                  key={type}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  onClick={() => router.push(`/affinity/${type}`)}
                  className="text-left p-6 rounded-xl border border-border bg-card hover:border-accent transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl bg-accent/80" />
                  <span className="text-3xl mb-3 block">{meta.icon}</span>
                  <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-accent transition-colors">{meta.plural}</h3>
                  <p className="text-sm text-muted mt-2 leading-relaxed">{meta.description}</p>
                  <div className="mt-4 pt-3 border-t border-border">
                    {personalCount !== null ? (
                      <>
                        <p className="font-serif text-lg font-semibold text-accent">{personalCount} <span className="text-sm text-muted font-normal">resuenan con tu perfil</span></p>
                        <p className="text-xs text-muted mt-1">{totalCount} {meta.plural.toLowerCase()} en total</p>
                      </>
                    ) : (
                      <p className="text-xs text-accent font-medium">{totalCount} {meta.plural.toLowerCase()}</p>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Disclaimer */}
        <div className="mt-16 p-5 rounded-xl border border-border bg-card">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Metodología y transparencia</p>
          <p className="text-xs text-muted leading-relaxed">
            Las afinidades se calculan a partir del zodíaco chino, comparando el animal del usuario con el del evento histórico principal de cada entidad.
            Todos los cálculos son determinísticos y transparentes.
            Molino es una plataforma educativa y de entretenimiento. Estas interpretaciones no constituyen predicciones científicas.
          </p>
        </div>

        {/* Compare CTA */}
        <div className="mt-8">
          <button
            type="button"
            onClick={() => router.push("/affinity/compare")}
            className="w-full text-left p-6 rounded-xl border border-border bg-card hover:border-accent transition-all group"
          >
            <span className="text-3xl mb-3 block">\u2694\ufe0f</span>
            <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-accent transition-colors">Comparar dos entidades</h3>
            <p className="text-sm text-muted mt-2 leading-relaxed">Elegí dos entidades y descubrí la relación simbólica entre ellas.</p>
          </button>
        </div>
      </main>
      <UniversityFooter />
    </div>
  );
}
