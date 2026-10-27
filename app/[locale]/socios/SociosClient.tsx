"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import PartnershipComparison from "@/components/couple/PartnershipComparison";
import WorkProfilePanel from "@/components/couple/WorkProfilePanel";
import DateInput from "@/components/ui/DateInput";
import Button from "@/components/ui/Button";
import { ShieldCheck, User, UserPlus, Users } from "lucide-react";
import TeamComparison from "@/components/couple/TeamComparison";
import { PageHero } from "@/components/knowledge/Kit";

function parseDateParam(param: string | null): string {
  if (!param) return "";
  const clean = param.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean;
  if (/^\d{8}$/.test(clean)) {
    return `${clean.slice(4, 8)}-${clean.slice(2, 4)}-${clean.slice(0, 2)}`;
  }
  const parts = clean.split(/[-/]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) return `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`;
    if (parts[2].length === 4) return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
  }
  return "";
}

function isValidDate(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const d = new Date(dateStr + "T12:00:00");
  if (isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return d <= today && d.getFullYear() >= 1900;
}

type Mode = "compare" | "solo";
type Socio = { date: string; name: string };

const SLOTS = ["a", "b", "c", "d", "e"] as const;
const MIN_SOCIOS = 2;
const MAX_SOCIOS = SLOTS.length;
const socioLabel = (i: number) => `Socio ${String.fromCharCode(65 + i)}`;

/** Parámetros de la URL ya leídos en el servidor (ver page.tsx). */
export type UrlParams = Record<string, string | undefined>;

export default function SociosClient({ params }: { params: UrlParams }) {
  // Antes useSearchParams: obligaba a renderizar la página solo en el navegador
  // y Google recibía "Cargando comparativa..." en vez del formulario.
  const searchParams = { get: (k: string): string | null => params[k] ?? null };

  const [mode, setMode] = useState<Mode>((searchParams.get("mode") as Mode) === "solo" ? "solo" : "compare");

  // Modo solo — analiza una única fecha, sin comparar contra nadie.
  const urlDateSolo = parseDateParam(searchParams.get("d"));
  const urlNameSolo = searchParams.get("n") || "";
  const [dateSolo, setDateSolo] = useState(urlDateSolo);
  const [nameSolo, setNameSolo] = useState(urlNameSolo);
  const [isAnalyzingSolo, setIsAnalyzingSolo] = useState(Boolean(urlDateSolo && isValidDate(urlDateSolo)));

  const profileSolo = useMemo<UserProfile | null>(() => {
    if (!dateSolo || !isValidDate(dateSolo)) return null;
    try {
      return calculateUserProfile(nameSolo.trim(), dateSolo);
    } catch {
      return null;
    }
  }, [dateSolo, nameSolo]);

  const handleAnalyzeSolo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileSolo) return;
    setIsAnalyzingSolo(true);
    const query = new URLSearchParams();
    query.set("mode", "solo");
    query.set("d", dateSolo);
    if (nameSolo.trim()) query.set("n", nameSolo.trim());
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `/socios?${query.toString()}`);
    }
  };

  const handleResetSolo = () => {
    setIsAnalyzingSolo(false);
    setDateSolo("");
    setNameSolo("");
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", "/socios?mode=solo");
    }
  };

  // Modo comparar — de 2 a 5 socios. En la URL van como a..e (fecha) y
  // na..ne (nombre); a/b/na/nb son los parámetros de siempre, así que los
  // links viejos de dos personas siguen abriendo igual. En modo solo "d" y
  // "n" son la fecha y el nombre de esa persona: no se leen como socios.
  const urlSocios: Socio[] = mode === "solo"
    ? []
    : SLOTS.map((k) => ({ date: parseDateParam(searchParams.get(k)), name: searchParams.get(`n${k}`) || "" }))
        .filter((socio, i) => i < MIN_SOCIOS || socio.date);
  const [socios, setSocios] = useState<Socio[]>(
    urlSocios.length >= MIN_SOCIOS ? urlSocios : [{ date: "", name: "" }, { date: "", name: "" }]
  );
  const [isComparing, setIsComparing] = useState(
    urlSocios.length >= MIN_SOCIOS && urlSocios.every((socio) => isValidDate(socio.date))
  );

  const profiles = useMemo<(UserProfile | null)[]>(
    () =>
      socios.map(({ date, name }) => {
        if (!date || !isValidDate(date)) return null;
        try {
          return calculateUserProfile(name.trim(), date);
        } catch {
          return null;
        }
      }),
    [socios]
  );
  const allValid = profiles.every(Boolean);

  const updateSocio = (index: number, patch: Partial<Socio>) =>
    setSocios((prev) => prev.map((socio, i) => (i === index ? { ...socio, ...patch } : socio)));

  const handleCompare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allValid) return;

    setIsComparing(true);
    const query = new URLSearchParams();
    socios.forEach((socio, i) => {
      query.set(SLOTS[i], socio.date);
      if (socio.name.trim()) query.set(`n${SLOTS[i]}`, socio.name.trim());
    });

    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `/socios?${query.toString()}`);
    }
  };

  const handleReset = () => {
    setIsComparing(false);
    setSocios([{ date: "", name: "" }, { date: "", name: "" }]);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", "/socios");
    }
  };

  return (
    <main id="main-content" className="min-h-screen bg-background pt-12 sm:pt-16 pb-24">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <PageHero
          bare
          crumbs={[{ href: "/", label: "Inicio" }, { label: "Modo Socios" }]}
          eyebrow="Modo Socios · afinidad de trabajo"
          title="Comparativa de sociedad"
          lead="Para socios, jefe y empleado o un equipo: de dos a cinco fechas de nacimiento, cruzadas de a pares. O una sola, para ver el perfil de trabajo de esa persona."
          imageKey="paginas/socios"
        >
          <div className="inline-flex border-2 border-ink" role="group" aria-label="Modo">
            {(
              [
                ["compare", "Comparar equipo", Users],
                ["solo", "Analizar una fecha", User],
              ] as const
            ).map(([m, label, Icon]) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
                className={`inline-flex items-center gap-2 px-5 py-3 text-base transition-colors ${
                  mode === m ? "bg-ink text-paper" : "bg-background text-foreground hover:bg-paper-alt"
                }`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        </PageHero>

        {mode === "solo" ? (
          <AnimatePresence mode="wait">
            {isAnalyzingSolo && profileSolo ? (
              <motion.div
                key="solo-result"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className="max-w-2xl mx-auto"
              >
                <WorkProfilePanel profile={profileSolo} />
                <div className="text-center mt-6">
                  <button
                    type="button"
                    onClick={handleResetSolo}
                    className="font-mono text-xs text-muted hover:text-accent transition-colors"
                  >
                    Analizar otra fecha
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="solo-form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className="max-w-md mx-auto"
              >
                <form onSubmit={handleAnalyzeSolo} className="space-y-6">
                  <div className="rounded-xl border border-accent/25 bg-card p-6 sm:p-8 shadow-sm space-y-5">
                    <div>
                      <label
                        htmlFor="name-solo"
                        className="block text-sm text-muted mb-1.5 font-semibold label-caps"
                      >
                        Nombre o apodo (opcional)
                      </label>
                      <input
                        id="name-solo"
                        type="text"
                        placeholder="Ej. Alex"
                        value={nameSolo}
                        onChange={(e) => setNameSolo(e.target.value)}
                        className="w-full rounded-xl bg-background border border-ink/10 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted mb-3 font-semibold text-center label-caps">
                        Fecha de Nacimiento
                      </label>
                      <DateInput value={dateSolo} onChange={setDateSolo} />
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      variant="accent"
                      size="lg"
                      disabled={!isValidDate(dateSolo)}
                      className="w-full sm:w-auto min-w-[240px] text-base py-4"
                    >
                      Ver perfil de trabajo
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-muted font-mono">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Sin registro · 100% calculado en tu navegador</span>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
        <AnimatePresence mode="wait">
          {isComparing && allValid ? (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              {profiles.length === 2 ? (
                <PartnershipComparison profileA={profiles[0]!} profileB={profiles[1]!} onReset={handleReset} />
              ) : (
                <TeamComparison profiles={profiles as UserProfile[]} labels={socios.map((s, i) => s.name.trim() || socioLabel(i))} />
              )}
              <div className="text-center mt-8">
                <button type="button" onClick={handleReset} className="text-sm text-muted hover:text-accent transition-colors">
                  Comparar otras fechas
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="max-w-4xl mx-auto"
            >
              <form onSubmit={handleCompare} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {socios.map((socio, i) => (
                    <div key={i} className="rounded-xl border border-ink/15 bg-card p-6 sm:p-8 shadow-sm space-y-5 relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-sm px-2.5 py-1 rounded-full bg-ink/5 text-foreground font-bold label-caps">
                          {socioLabel(i)}
                        </span>
                        {socios.length > MIN_SOCIOS && (
                          <button
                            type="button"
                            onClick={() => setSocios((prev) => prev.filter((_, j) => j !== i))}
                            className="text-sm text-muted hover:text-foreground transition-colors"
                            aria-label={`Quitar ${socioLabel(i)}`}
                          >
                            Quitar
                          </button>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor={`name-${SLOTS[i]}`}
                          className="block text-sm text-muted mb-1.5 font-semibold label-caps"
                        >
                          Nombre o apodo (opcional)
                        </label>
                        <input
                          id={`name-${SLOTS[i]}`}
                          type="text"
                          placeholder={["Ej. Alex", "Ej. Sam", "Ej. Lu", "Ej. Fran", "Ej. Juli"][i]}
                          value={socio.name}
                          onChange={(e) => updateSocio(i, { name: e.target.value })}
                          className="w-full rounded-xl bg-background border border-ink/10 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-muted mb-3 font-semibold text-center label-caps">
                          Fecha de Nacimiento
                        </label>
                        <DateInput value={socio.date} onChange={(date) => updateSocio(i, { date })} />
                      </div>
                    </div>
                  ))}
                </div>

                {socios.length < MAX_SOCIOS && (
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setSocios((prev) => [...prev, { date: "", name: "" }])}
                      className="inline-flex items-center gap-2 px-5 py-2.5 border border-ink/20 text-sm text-foreground hover:border-ink transition-colors"
                    >
                      <UserPlus className="w-4 h-4" aria-hidden="true" />
                      Agregar socio ({socios.length} de {MAX_SOCIOS})
                    </button>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    disabled={!allValid}
                    className="w-full sm:w-auto min-w-[240px] text-base py-4"
                  >
                    Comparar mapas
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-muted font-mono pt-4">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Sin registro · 100% calculado en tu navegador</span>
                </div>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 pt-12 border-t border-ink/10">
                <div className="p-4 rounded-lg bg-card border border-ink/5">
                  <span className="text-sm text-accent font-bold block mb-1 label-caps">
                    01 · Numerología
                  </span>
                  <p className="text-xs text-muted leading-relaxed">
                    Compara los Números de Camino de Vida y la compatibilidad de propósitos centrales.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-card border border-ink/5">
                  <span className="text-sm text-amber-700 font-bold block mb-1 label-caps">
                    02 · Astrología & Elementos
                  </span>
                  <p className="text-xs text-muted leading-relaxed">
                    Analiza la química entre signos solares y la armonía entre fuego, tierra, aire y agua.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-card border border-ink/5">
                  <span className="text-sm text-emerald-400 font-bold block mb-1 label-caps">
                    03 · Zodíaco Chino
                  </span>
                  <p className="text-xs text-muted leading-relaxed">
                    Descubrí tríadas de afinidad, amigos secretos y puntos de contraste tradicionales.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        )}
      </div>
    </main>
  );
}
