"use client";
import { useL, type Pick2 } from "@/lib/i18n/useL";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/lib/i18n/navigation";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import SearchInput from "@/components/ui/SearchInput";
import { Breadcrumb, CONTAINER, Note } from "@/components/knowledge/Kit";
import EntityVisual from "@/components/ui/EntityVisual";
import type { LightweightEntity } from "@/types/atlas";

type SelectionStep = "pick-a" | "pick-b";

const TYPE_LABEL = (L: Pick2): Record<string, string> => ({
  brand: L("Marca", "Brand"),
  city: "Ciudad",
  country: "País",
  university: L("Universidad", "University"),
  team: L("Equipo", "Team"),
  movie: L("Película", "Movie"),
  artist: L("Famoso", "Famous person"),
});

export default function ComparePicker({ catalog }: { catalog: LightweightEntity[] }) {
  const L = useL();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromId = searchParams.get("from");

  const [step, setStep] = useState<SelectionStep>(fromId ? "pick-b" : "pick-a");
  const [selectedA, setSelectedA] = useState<string | null>(fromId);
  const [search, setSearch] = useState("");
  // Sin búsqueda se muestran las primeras PAGE; antes se pintaban todas (~600
  // filas, más de 100.000px de alto) y la página parecía rota.
  const PAGE = 30;
  const [visible, setVisible] = useState(PAGE);

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
        (TYPE_LABEL(L)[e.type] ?? e.type).toLowerCase().includes(q)
      );
    });
  }, [search, selectedA, catalog]);

  const handleSelect = (id: string) => {
    if (step === "pick-a") {
      setSelectedA(id);
      setStep("pick-b");
      setSearch("");
      setVisible(PAGE);
    } else {
      router.push(`/affinity/compare/${selectedA}/${id}`);
    }
  };

  const selectedEntityA = selectedA ? catalog.find(e => e.id === selectedA) : null;

  return (
    <div className="min-h-screen bg-background">
      <main className={`${CONTAINER} pt-12 sm:pt-16 pb-24`} id="main-content">
        <Breadcrumb items={[{ href: "/", label: L("Inicio", "Home") }, { href: "/affinity", label: L("Afinidades", "Affinities") }, { label: L("Comparar", "Compare") }]} />

        <header className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-8 items-end pb-10 border-b-2 border-ink">
          <div className="lg:col-span-7">
            <p className="text-sm text-accent mb-4 label-caps">{L(<>Comparar dos entradas · paso {L.t(step === "pick-a" ? "1" : "2")} de 2</>, <>Compare two entries · step {L.t(step === "pick-a" ? "1" : "2")} of 2</>)}</p>
            <h1 className="font-display font-normal text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.95] tracking-tight text-foreground">
              {L.t(step === "pick-a" ? L("Elegí la primera", "Pick the first one") : L("Ahora, la segunda", "Now, the second one"))}
            </h1>
            <p className="mt-5 text-xl text-foreground/85 leading-snug max-w-xl">
              {L.t(step === "pick-a"
                ? L("Una marca, un país, una ciudad o una persona del Atlas. Después elegís con quién compararla.", "A brand, a country, a city or a person from the Atlas. Then you choose what to compare it with.")
                : L(`Con qué querés comparar ${selectedEntityA?.name ?? "la primera"}.`, `What do you want to compare ${L.t(selectedEntityA?.name ?? "the first one")} with?`))}
            </p>
          </div>
          <div className="lg:col-span-5">
            {step === "pick-b" && selectedEntityA ? (
              <div className="flex items-center gap-4 border-2 border-ink p-5">
                <EntityVisual
                  visualType={selectedEntityA.visualType}
                  emoji={selectedEntityA.emoji}
                  name={selectedEntityA.name}
                  type={selectedEntityA.type}
                  category={selectedEntityA.category}
                  countryISO={selectedEntityA.countryISO}
                  imageUrl={selectedEntityA.imageUrl}
                  size={44}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted">{L("Primera entrada", "First entry")}</p>
                  <p className="font-display text-2xl text-foreground truncate">{L.t(selectedEntityA.name)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep("pick-a");
                    setSelectedA(null);
                    setSearch("");
                  }}
                  className="text-base underline underline-offset-4 hover:no-underline shrink-0 min-h-[44px]"
                >{L("Cambiar", "Change")}</button>
              </div>
            ) : (
              <SearchInput
                value={search}
                onValueChange={setSearch}
                placeholder={L("Buscar por nombre, país o tipo", "Search by name, country or type")}
                label={L("Buscar entrada", "Search entry")}
                autoFocus
              />
            )}
          </div>
        </header>

        {step === "pick-b" && (
          <div className="mt-8 max-w-xl">
            <SearchInput value={search} onValueChange={setSearch} placeholder={L("Buscar por nombre, país o tipo", "Search by name, country or type")} label={L("Buscar entrada", "Search entry")} autoFocus />
          </div>
        )}

        {/* Entity list */}
        <motion.div {...fadeUp} className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/15 border border-ink/15">
          {filtered.slice(0, search ? filtered.length : visible).map(entity => {
            return (
              <button
                key={entity.id}
                type="button"
                onClick={() => handleSelect(entity.id)}
                className="w-full text-left p-5 bg-background hover:bg-paper-alt transition-colors group flex items-center gap-4 min-h-[88px]"
              >
                <EntityVisual
                  visualType={entity.visualType}
                  emoji={entity.emoji}
                  name={entity.name}
                  type={entity.type}
                  category={entity.category}
                  countryISO={entity.countryISO}
                  imageUrl={entity.imageUrl}
                  size={40}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-display text-xl text-foreground group-hover:underline underline-offset-4 truncate">
                    {L.t(entity.name)}
                  </p>
                  <p className="text-sm text-muted truncate">
                    {L.t(TYPE_LABEL(L)[entity.type] ?? entity.type)} · {entity.country}
                  </p>
                </div>
              </button>
            );
          })}
        </motion.div>

        {!search && filtered.length > visible && (
          <div className="mt-8 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE * 2)}
              className="inline-flex items-center justify-center min-h-[48px] px-8 border-2 border-ink text-sm text-foreground hover:bg-ink hover:text-paper transition-colors label-caps"
            >{L("Ver más", "See more")}</button>
            <p className="text-base text-muted">{L(<>
              {L.t(visible)} de {filtered.length} · o buscá por nombre, país o tipo
            </>, <>{L.t(visible)} of {filtered.length} · or search by name, country or type</>)}</p>
          </div>
        )}

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center py-16"
          >
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] tracking-tight text-foreground mb-4">{L("Sin resultados", "No results")}</h2>
            <p className="text-lg text-muted mb-6 max-w-md mx-auto">{L(<>
              No se encontraron resultados para &ldquo;{L.t(search)}&rdquo;.
            </>, <>No results found for &ldquo;{L.t(search)}&rdquo;.</>)}</p>
            <button
              type="button"
              onClick={() => router.push("/affinity")}
              className="inline-flex items-center justify-center px-8 py-4 bg-vermilion text-paper text-sm font-bold hover:bg-vermilion-hover transition-colors label-caps"
            >{L("Volver a Afinidad Personal", "Back to Personal Affinity")}</button>
          </motion.div>
        )}

        <Note>
          <p>{L("La comparación es una lectura simbólica de la tradición del zodíaco chino, no una medición: cruza los signos de los años de origen de las dos entradas.", "The comparison is a symbolic reading from the Chinese zodiac tradition, not a measurement: it crosses the signs of the years of origin of the two entries.")}</p>
        </Note>
      </main>
    </div>
  );
}
