"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import SearchInput from "@/components/ui/SearchInput";
import EntityVisual from "@/components/ui/EntityVisual";
import type { LightweightEntity } from "@/types/atlas";

type SelectionStep = "pick-a" | "pick-b";

const TYPE_LABEL: Record<string, string> = {
  brand: "Marca",
  city: "Ciudad",
  country: "País",
  university: "Universidad",
  team: "Equipo",
  movie: "Película",
  artist: "Famoso",
};

export default function ComparePicker({ catalog }: { catalog: LightweightEntity[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromId = searchParams.get("from");

  const [step, setStep] = useState<SelectionStep>(fromId ? "pick-b" : "pick-a");
  const [selectedA, setSelectedA] = useState<string | null>(fromId);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (fromId && catalog.find(e => e.id === fromId)) {
      setSelectedA(fromId);
      setStep("pick-b");
    }
  }, [fromId, catalog]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return catalog.filter(e => {
      if (selectedA && e.id === selectedA) return false;
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.country?.toLowerCase().includes(q) ||
        (TYPE_LABEL[e.type] ?? e.type).toLowerCase().includes(q)
      );
    });
  }, [search, selectedA, catalog]);

  const handleSelect = (id: string) => {
    if (step === "pick-a") {
      setSelectedA(id);
      setStep("pick-b");
      setSearch("");
    } else {
      router.push(`/affinity/compare/${selectedA}/${id}`);
    }
  };

  const selectedEntityA = selectedA ? catalog.find(e => e.id === selectedA) : null;

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[800px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24" id="main-content">

        {/* Back */}
        <motion.div {...fadeUp}>
          <button
            type="button"
            onClick={() => {
              if (step === "pick-b") {
                setStep("pick-a");
                setSelectedA(null);
                setSearch("");
              } else {
                router.push("/affinity");
              }
            }}
            className="text-sm text-muted hover:text-accent transition-colors mb-8 inline-flex items-center gap-2 min-h-[44px]"
          >
            &larr; {step === "pick-b" ? "Cambiar primera entidad" : "Afinidad Personal"}
          </button>
        </motion.div>

        {/* Header */}
        <motion.section {...fadeUp} className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium mb-4">
            Comparación Simbólica
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-foreground leading-[1.1] mb-3">
            {step === "pick-a" ? "Elegí la primera entidad" : "Elegí la segunda entidad"}
          </h1>
          <p className="text-sm text-muted">
            {step === "pick-a"
              ? "Seleccioná una entidad para comparar."
              : `Comparando con ${selectedEntityA?.name ?? ""}. Seleccioná la segunda entidad.`}
          </p>
        </motion.section>

        {/* Selected entity preview (step B) */}
        {step === "pick-b" && selectedEntityA && (
          <motion.section {...fadeUp} className="mb-6">
            <div className="flex items-center gap-3 p-4 rounded-md border border-accent/30 bg-accent/5">
              <EntityVisual
                visualType={selectedEntityA.visualType}
                emoji={selectedEntityA.emoji}
                name={selectedEntityA.name}
                type={selectedEntityA.type}
                category={selectedEntityA.category}
                countryISO={selectedEntityA.countryISO}
                imageUrl={selectedEntityA.imageUrl}
                size={32}
              />
              <div>
                <p className="text-sm font-medium text-foreground">{selectedEntityA.name}</p>
                <p className="text-xs text-muted">{TYPE_LABEL[selectedEntityA.type] ?? selectedEntityA.type} · {selectedEntityA.country}</p>
              </div>
              <span className="text-xs text-accent font-medium ml-auto">Primera entidad</span>
            </div>
          </motion.section>
        )}

        {/* Search */}
        <motion.div {...fadeUp} className="mb-6">
          <SearchInput
            value={search}
            onValueChange={setSearch}
            placeholder="Buscar entidad..."
            label="Buscar entidad"
            className="max-w-sm"
            autoFocus
          />
        </motion.div>

        {/* Entity list */}
        <motion.div {...fadeUp} className="space-y-2">
          {filtered.map(entity => {
            return (
              <button
                key={entity.id}
                type="button"
                onClick={() => handleSelect(entity.id)}
                className="w-full text-left p-4 border border-ink/10 bg-transparent hover:border-accent transition-all group flex items-center gap-4"
              >
                <EntityVisual
                  visualType={entity.visualType}
                  emoji={entity.emoji}
                  name={entity.name}
                  type={entity.type}
                  category={entity.category}
                  countryISO={entity.countryISO}
                  imageUrl={entity.imageUrl}
                  size={32}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors truncate">
                    {entity.name}
                  </p>
                  <p className="text-xs text-muted truncate">
                    {TYPE_LABEL[entity.type] ?? entity.type} · {entity.country}
                  </p>
                </div>
                <svg className="w-4 h-4 text-muted group-hover:text-accent transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            );
          })}
        </motion.div>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center py-16"
          >
            <h2 className="font-display text-[clamp(1.5rem,4vw,2rem)] tracking-tight text-foreground mb-4">Sin resultados</h2>
            <p className="text-sm text-muted mb-6 max-w-md mx-auto">
              No se encontraron resultados para &ldquo;{search}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => router.push("/affinity")}
              className="inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all px-6 py-3 text-sm bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground min-h-[44px]"
            >
              Volver a Afinidad Personal
            </button>
          </motion.div>
        )}

        {/* Disclaimer */}
        <motion.section {...fadeUp} className="mt-16">
          <div className="p-6 border border-ink/10 bg-transparent">
            <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-2">Aviso importante</p>
            <p className="text-xs text-muted leading-relaxed">
              La comparación es una lectura simbólica basada en tradiciones del zodíaco chino, no una medición científica.
              Molino es una plataforma educativa y de entretenimiento.
            </p>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
