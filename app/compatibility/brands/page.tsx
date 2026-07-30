"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import { useProfile } from "@/lib/hooks/useProfile";
import { calculateAllBrandCompatibility, type CompatibilityResult } from "@/lib/engines/compatibilityScoreEngine";
import { getBrandCategories } from "@/lib/data/brands";
import UniversityFooter from "@/components/layout/UniversityFooter";
import LoadingState from "@/components/ui/LoadingState";

export default function BrandsPage() {
  const router = useRouter();
  const { profile, mounted } = useProfile({ redirectIfNotFound: false });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState("score-desc");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const results = useMemo(() => {
    if (!profile) return [];
    return calculateAllBrandCompatibility(profile);
  }, [profile]);

  const top10 = useMemo(() => results.slice(0, 10), [results]);

  const filtered = useMemo(() => {
    let items = [...results];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(r => r.name.toLowerCase().includes(q));
    }
    if (category !== "all") {
      items = items.filter(r => r.meta.category === category);
    }
    if (sortBy === "score-desc") items.sort((a, b) => b.score - a.score);
    else if (sortBy === "score-asc") items.sort((a, b) => a.score - b.score);
    else items.sort((a, b) => a.name.localeCompare(b.name));
    return items;
  }, [results, search, category, sortBy]);

  const categories = useMemo(() => getBrandCategories(), []);

  if (!mounted) return <LoadingState message="Cargando..." />;

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-content px-4 sm:px-6 py-24 text-center">
          <div className="w-8 h-2 bg-accent mx-auto mb-8" />
          <h1 className="font-heading text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">Marcas que resuenan con tu mapa</h1>
          <p className="text-muted mb-8 max-w-md mx-auto">Creá tu perfil para descubrir con qué marcas resonás más.</p>
          <button type="button" onClick={() => router.push("/onboarding")} className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-8 py-4 text-base bg-primary text-primary-foreground shadow-md hover:bg-accent hover:text-accent-foreground min-h-[52px]">Crear mi perfil</button>
        </div>
        <UniversityFooter />
      </div>
    );
  }

  const userAnimal = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";
  const userElement = typeof profile.element === "string" ? profile.element : "";

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">

        {/* Hero */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <button type="button" onClick={() => router.push("/profile")} className="text-sm text-muted hover:text-accent transition-colors mb-6 inline-flex items-center gap-2">&larr; Volver a mi mapa</button>
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent font-medium mb-4">Compatibilidad · Marcas</p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1]">
            Marcas que resuenan
            <br /><span className="text-muted">con tu mapa</span>
          </h1>
          <p className="text-base text-muted mt-6 max-w-xl leading-relaxed">
            Tu signo <span className="font-medium text-foreground">{userAnimal}</span> se conecta con cada marca a través de la relación entre tu animal del zodiaco chino y el animal asociado al año de fundación de la marca.
          </p>
          <p className="text-xs text-muted mt-3">Basado en la relación entre animales del zodíaco chino · Interpretación simbólica — no es una predicción ni una verdad objetiva.</p>
        </motion.section>

        {/* Top 10 */}
        {top10.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-border" aria-hidden="true" />
              <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Tus 10 marcas ideales</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {top10.map((r, i) => (
                <motion.button
                  key={r.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.35 }}
                  onClick={() => setExpandedItem(expandedItem === `top-${r.name}` ? null : `top-${r.name}`)}
                  className="p-4 rounded-none border border-border bg-card text-center hover:border-accent/50 transition-colors group"
                >
                  <p className="text-2xl mb-1">{r.meta.logo}</p>
                  <p className="font-heading text-base font-semibold text-foreground group-hover:text-accent transition-colors truncate">{r.name}</p>
                  <p className="text-xl font-heading font-bold mt-1" style={{ color: r.score >= 75 ? "var(--score-excellent)" : r.score >= 55 ? "var(--score-good)" : "var(--score-neutral)" }}>{r.score}%</p>
                  <p className="text-[8px] uppercase tracking-[0.15em] text-muted">{r.targetAnimal} · {r.meta.category}</p>
                  <AnimatePresence>
                    {expandedItem === `top-${r.name}` && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-3">
                        <div className="text-left space-y-1 pt-2 border-t border-border">
                          {r.reasons.map((reason, j) => (<p key={j} className="text-[11px] text-muted leading-relaxed">{reason}</p>))}
                          <p className="text-[9px] text-muted mt-1">Zodiac: {r.zodiacScore}/100</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          </section>
        )}

        {/* Filters */}
        <section className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Explorar todas las marcas</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar marca..." className="input flex-1 max-w-sm" aria-label="Buscar marca" />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input max-w-[200px]" aria-label="Categoría">
              <option value="all">Todas</option>
              {categories.map(c => (<option key={c} value={c}>{c}</option>))}
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input max-w-[200px]" aria-label="Ordenar">
              <option value="score-desc">Mayor compatibilidad</option>
              <option value="score-asc">Menor compatibilidad</option>
              <option value="name">Alfabético</option>
            </select>
          </div>
          <p className="text-xs text-muted mt-2">{filtered.length} marcas</p>
        </section>

        {/* Results */}
        <section>
          <div className="space-y-0">
            {filtered.map((r, i) => (
              <motion.div key={r.name} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-10px" }} transition={{ duration: 0.2 }}>
                <button type="button" onClick={() => setExpandedItem(expandedItem === r.name ? null : r.name)} className="w-full text-left py-4 border-b border-border hover:bg-neutral-900/[0.02] transition-colors px-2 rounded-none">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{r.meta.logo}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-base font-semibold text-foreground">{r.name}</p>
                      <p className="text-xs text-muted">{r.meta.category} · {r.meta.country} · {r.targetAnimal} de {r.targetElement} · Fundada {r.meta.year}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-heading font-bold" style={{ color: r.score >= 75 ? "var(--score-excellent)" : r.score >= 55 ? "var(--score-good)" : "var(--score-neutral)" }}>{r.score}%</p>
                    </div>
                  </div>
                </button>
                <AnimatePresence>
                  {expandedItem === r.name && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-2 py-4 pl-12 space-y-2">
                        <p className="text-sm font-medium text-foreground">Por qué resuena</p>
                        {r.reasons.map((reason, j) => (<p key={j} className="text-sm text-muted leading-relaxed">{reason}</p>))}
                        <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted">
                          <span>Tu signo: {userAnimal}</span><span>·</span><span>Marca: {r.targetAnimal} de {r.targetElement}</span><span>·</span><span>Fundada: {r.meta.year}</span>
                        </div>
                        <p className="text-[10px] text-muted">Zodiac: {r.zodiacScore}/100 · Numerología: {r.numerologyScore}/100 · Final: {r.score}/100</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <UniversityFooter />
    </div>
  );
}
