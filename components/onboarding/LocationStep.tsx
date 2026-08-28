"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import Button from "@/components/ui/Button";
import SearchInput from "@/components/ui/SearchInput";
import { COUNTRIES } from "@/lib/data/countries";
import { saveUserContext } from "@/lib/context/userContext";

interface LocationStepProps {
  onDone: () => void;
  isSubmitting?: boolean;
}

// Países con más probabilidad de ser el primer clic — mercado hispanohablante,
// Argentina primero (donde vive la mayor parte de la base actual). El resto
// del mundo sigue disponible completo por el buscador, no se pierde nada.
const SUGGESTED_COUNTRIES = ["Argentina", "México", "España", "Chile", "Colombia", "Uruguay", "Perú"];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/**
 * Segundo paso del onboarding, opcional — país "dónde estás ahora", no
 * lugar de nacimiento. No se autodetecta por IP: el usuario elige o
 * saltea. Ver lib/context/userContext.ts para por qué (VPN/viajes hacen
 * que una detección automática de país sea peor que no tener ninguna).
 *
 * Antes esto era un <select> nativo con las 199 entradas de COUNTRIES
 * agrupadas por continente — un único menú larguísimo sin buscador, donde
 * encontrar cualquier país (incluida Argentina, el mercado principal)
 * significaba escanear la lista entera. Ahora: accesos rápidos a los
 * países más probables + buscador que filtra en vivo.
 */
export default function LocationStep({ onDone, isSubmitting }: LocationStepProps) {
  const [selected, setSelected] = useState("");
  const [declined, setDeclined] = useState(false);
  const [search, setSearch] = useState("");

  const selectedCountry = useMemo(
    () => COUNTRIES.find((c) => c.name === selected) ?? null,
    [selected]
  );

  const suggested = useMemo(
    () => SUGGESTED_COUNTRIES.map((name) => COUNTRIES.find((c) => c.name === name)).filter((c): c is (typeof COUNTRIES)[number] => !!c),
    []
  );

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = normalize(search.trim());
    return COUNTRIES.filter((c) => normalize(c.name).includes(q)).slice(0, 8);
  }, [search]);

  const selectCountry = (name: string) => {
    setSelected(name);
    setDeclined(false);
    setSearch("");
  };

  const handleContinue = () => {
    if (selectedCountry) {
      saveUserContext({ country: selectedCountry.name, region: selectedCountry.continent }, "onboarding");
    }
    onDone();
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-8"
      >
        <p className="text-xs font-medium uppercase tracking-wide text-muted mb-3">Paso 2 de 2</p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground leading-[0.9] mb-3">
          ¿Dónde estás ahora?
        </h1>
        {/* Antes esto eran dos bloques (subtítulo + card "¿Para qué sirve
            esto?") que decían lo mismo con distintas palabras y empujaban el
            selector de país abajo del fold. Una sola línea: para qué sirve,
            que no rastreamos, y que se puede cambiar. */}
        <p className="text-base text-muted-foreground max-w-sm mx-auto text-balance">
          Con tu país vemos qué ciudades, países y marcas comparten tu patrón. No lo rastreamos: elegís vos y lo cambiás cuando quieras.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mb-8 max-w-sm mx-auto"
      >
        <AnimatePresence mode="wait" initial={false}>
          {declined ? (
            <motion.div
              key="declined"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-between gap-3 rounded-md border border-border bg-card px-4 py-3"
            >
              <span className="flex items-center gap-2 text-sm text-foreground">
                <Check className="w-4 h-4 text-muted shrink-0" aria-hidden="true" />
                Sin país — tu mapa prioriza el resto del mundo.
              </span>
              <button
                type="button"
                onClick={() => setDeclined(false)}
                className="inline-flex items-center justify-center w-8 h-8 rounded-sm text-muted hover:text-foreground hover:bg-ink/[0.06] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                aria-label="Elegir país"
                title="Elegir país"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </motion.div>
          ) : selectedCountry ? (
            <motion.div
              key="selected"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-between gap-3 rounded-md border border-accent/40 bg-accent/[0.06] px-4 py-3"
            >
              <span className="flex items-center gap-2 text-sm text-foreground">
                <Check className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                <span className="text-lg" aria-hidden="true">{selectedCountry.flag}</span>
                {selectedCountry.name}
              </span>
              <button
                type="button"
                onClick={() => setSelected("")}
                className="inline-flex items-center justify-center w-8 h-8 rounded-sm text-muted hover:text-foreground hover:bg-ink/[0.06] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                aria-label="Cambiar país"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="picker"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {suggested.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => selectCountry(c.name)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-sm text-foreground transition-colors hover:border-accent hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  >
                    <span aria-hidden="true">{c.flag}</span>
                    {c.name}
                  </button>
                ))}
              </div>

              <SearchInput
                value={search}
                onValueChange={setSearch}
                label="Buscar país"
                placeholder="Buscar otro país..."
              />

              {search.trim() && (
                <div className="mt-2 rounded-md border border-border bg-card overflow-hidden max-h-64 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    searchResults.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => selectCountry(c.name)}
                        className="flex w-full items-center gap-2.5 px-4 py-3 text-sm text-foreground text-left transition-colors hover:bg-ink/[0.04] focus:outline-none focus-visible:bg-ink/[0.06] border-b border-border last:border-b-0"
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
            </motion.div>
          )}
        </AnimatePresence>

        {!selectedCountry && !declined && (
          <button
            type="button"
            onClick={() => setDeclined(true)}
            className="block mx-auto mt-4 text-sm text-muted underline decoration-border underline-offset-4 hover:text-foreground hover:decoration-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-sm"
          >
            Preferí no decirlo
          </button>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex justify-center"
      >
        <Button variant="accent" size="lg" onClick={handleContinue} loading={isSubmitting}>
          {isSubmitting ? (
            "Generando tu mapa..."
          ) : (
            <>
              Ver mi mapa
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
