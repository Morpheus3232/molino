"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/hooks/useSafeReducedMotion";
import { COUNTRIES } from "@/lib/data/countries";
import { saveUserContext, resolveUserContext } from "@/lib/context/userContext";
import SearchInput from "@/components/ui/SearchInput";

const SUGGESTED = [
  "Argentina", "México", "España", "Chile", "Colombia",
  "Uruguay", "Perú", "Ecuador", "Brasil", "Italia",
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Selector de ubicación inline para /hoy. Muestra chips de acceso rápido
 * (solo hispanohablantes + Brasil/Italia) y un buscador expandible.
 * Persiste en userContext (country) — no toca scoring ni energía.
 */
export default function LocationSelector({ onCountryChange }: { onCountryChange?: (country: string | null) => void } = {}) {
  const reduceMotion = useSafeReducedMotion();
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<string | null>(() => {
    const ctx = resolveUserContext();
    return ctx.country ?? null;
  });

  const suggested = useMemo(
    () => SUGGESTED.map((n) => COUNTRIES.find((c) => c.name === n)).filter(Boolean) as typeof COUNTRIES[number][],
    [],
  );

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = normalize(search.trim());
    return COUNTRIES.filter((c) => normalize(c.name).includes(q)).slice(0, 6);
  }, [search]);

  const selectCountry = (name: string) => {
    setSelected(name);
    saveUserContext({ country: name }, "explicit");
    onCountryChange?.(name);
    setSearch("");
    setExpanded(false);
  };

  const selectedCountry = COUNTRIES.find((c) => c.name === selected);

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.1 }}
      className="border-t border-ink/10 py-6 sm:py-8"
    >
      <div className="flex items-baseline gap-3 mb-4">
        <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
        <p className="label-micro">Tu ubicación</p>
      </div>

      {/* Selected state */}
      {selectedCountry && (
        <div className="flex items-center gap-3 mb-4">
          <span className="text-lg">{selectedCountry.flag}</span>
          <span className="text-sm font-medium text-foreground">{selectedCountry.name}</span>
          <button
            type="button"
            onClick={() => { setSelected(null); setExpanded(true); onCountryChange?.(null); }}
            className="text-xs text-accent hover:underline ml-auto"
          >
            Cambiar
          </button>
        </div>
      )}

      {/* Chips — suggested */}
      {!selected && (
        <div className="flex flex-wrap gap-2 mb-3">
          {suggested.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => selectCountry(c.name)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              <span aria-hidden="true">{c.flag}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Expand toggle */}
      {!selected && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="text-xs text-accent hover:underline"
        >
          Buscar otro lugar
        </button>
      )}

      {/* Expanded search */}
      {expanded && !selected && (
        <div className="mt-3">
          <SearchInput
            value={search}
            onValueChange={setSearch}
            label="Buscar país"
            placeholder="Buscar país o ciudad..."
          />
          {search.trim() && (
            <div className="mt-2 rounded-md border border-border bg-card overflow-hidden max-h-48 overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => selectCountry(c.name)}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-foreground text-left transition-colors hover:bg-ink/[0.04] border-b border-border last:border-b-0"
                  >
                    <span aria-hidden="true">{c.flag}</span>
                    {c.name}
                  </button>
                ))
              ) : (
                <p className="px-4 py-3 text-sm text-muted">No encontramos ese país.</p>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={() => { setExpanded(false); setSearch(""); }}
            className="text-xs text-muted hover:text-accent mt-2"
          >
            Cancelar
          </button>
        </div>
      )}
    </motion.div>
  );
}
