"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import PartnershipComparison from "@/components/couple/PartnershipComparison";
import WorkProfilePanel from "@/components/couple/WorkProfilePanel";
import DateInput from "@/components/ui/DateInput";
import Button from "@/components/ui/Button";
import { Handshake, Sparkles, ShieldCheck, User, Users } from "lucide-react";

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

export default function SociosClient() {
  const searchParams = useSearchParams();

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

  const urlDateA = parseDateParam(searchParams.get("a"));
  const urlDateB = parseDateParam(searchParams.get("b"));
  const urlNameA = searchParams.get("na") || "";
  const urlNameB = searchParams.get("nb") || "";

  const [dateA, setDateA] = useState(urlDateA);
  const [dateB, setDateB] = useState(urlDateB);
  const [nameA, setNameA] = useState(urlNameA);
  const [nameB, setNameB] = useState(urlNameB);
  const [isComparing, setIsComparing] = useState(
    Boolean(urlDateA && urlDateB && isValidDate(urlDateA) && isValidDate(urlDateB))
  );

  useEffect(() => {
    if (urlDateA && urlDateB && isValidDate(urlDateA) && isValidDate(urlDateB)) {
      setDateA(urlDateA);
      setDateB(urlDateB);
      setIsComparing(true);
    }
  }, [urlDateA, urlDateB]);

  const profileA = useMemo<UserProfile | null>(() => {
    if (!dateA || !isValidDate(dateA)) return null;
    try {
      return calculateUserProfile(nameA.trim(), dateA);
    } catch {
      return null;
    }
  }, [dateA, nameA]);

  const profileB = useMemo<UserProfile | null>(() => {
    if (!dateB || !isValidDate(dateB)) return null;
    try {
      return calculateUserProfile(nameB.trim(), dateB);
    } catch {
      return null;
    }
  }, [dateB, nameB]);

  const handleCompare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileA || !profileB) return;

    setIsComparing(true);
    const query = new URLSearchParams();
    query.set("a", dateA);
    query.set("b", dateB);
    if (nameA.trim()) query.set("na", nameA.trim());
    if (nameB.trim()) query.set("nb", nameB.trim());

    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `/socios?${query.toString()}`);
    }
  };

  const handleReset = () => {
    setIsComparing(false);
    setDateA("");
    setDateB("");
    setNameA("");
    setNameB("");
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", "/socios");
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24 pb-24">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <header className="mb-10 sm:mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
            <Handshake className="w-3.5 h-3.5 text-accent" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
              Modo Socios · Afinidad de Trabajo
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground uppercase tracking-tight">
            Comparativa de Sociedad
          </h1>
          <p className="text-sm sm:text-base text-muted mt-2 leading-relaxed">
            Para socios, empleador y empleado, o cualquier par armando un proyecto juntos: ingresá dos
            fechas de nacimiento y vean cómo se complementan sus caminos de vida, signos solares,
            zodíaco chino y química elemental trabajando en equipo. También podés analizar una sola
            fecha para ver el perfil de trabajo de esa persona.
          </p>

          <div className="inline-flex items-center gap-1 mt-6 p-1 rounded-xl bg-ink/5 border border-ink/10">
            <button
              type="button"
              onClick={() => setMode("compare")}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider font-semibold transition-colors ${
                mode === "compare" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Comparar dos
            </button>
            <button
              type="button"
              onClick={() => setMode("solo")}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider font-semibold transition-colors ${
                mode === "solo" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Analizar una
            </button>
          </div>
        </header>

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
                  <div className="rounded-3xl border border-accent/25 bg-card p-6 sm:p-8 shadow-sm space-y-5">
                    <div>
                      <label
                        htmlFor="name-solo"
                        className="block font-mono text-xs uppercase tracking-wider text-muted mb-1.5 font-semibold"
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
                      <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-3 font-semibold text-center">
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
                      <Sparkles className="w-4 h-4 mr-2" />
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
          {isComparing && profileA && profileB ? (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              <PartnershipComparison profileA={profileA} profileB={profileB} onReset={handleReset} />
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
                  <div className="rounded-3xl border border-amber-500/25 bg-card p-6 sm:p-8 shadow-sm space-y-5 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 font-bold">
                        Socio A
                      </span>
                      <span className="font-mono text-xs text-muted">Primer mapa</span>
                    </div>

                    <div>
                      <label
                        htmlFor="name-a"
                        className="block font-mono text-xs uppercase tracking-wider text-muted mb-1.5 font-semibold"
                      >
                        Nombre o apodo (opcional)
                      </label>
                      <input
                        id="name-a"
                        type="text"
                        placeholder="Ej. Alex"
                        value={nameA}
                        onChange={(e) => setNameA(e.target.value)}
                        className="w-full rounded-xl bg-background border border-ink/10 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-3 font-semibold text-center">
                        Fecha de Nacimiento
                      </label>
                      <DateInput value={dateA} onChange={setDateA} />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-blue-500/25 bg-card p-6 sm:p-8 shadow-sm space-y-5 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 font-bold">
                        Socio B
                      </span>
                      <span className="font-mono text-xs text-muted">Segundo mapa</span>
                    </div>

                    <div>
                      <label
                        htmlFor="name-b"
                        className="block font-mono text-xs uppercase tracking-wider text-muted mb-1.5 font-semibold"
                      >
                        Nombre o apodo (opcional)
                      </label>
                      <input
                        id="name-b"
                        type="text"
                        placeholder="Ej. Sam"
                        value={nameB}
                        onChange={(e) => setNameB(e.target.value)}
                        className="w-full rounded-xl bg-background border border-ink/10 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-3 font-semibold text-center">
                        Fecha de Nacimiento
                      </label>
                      <DateInput value={dateB} onChange={setDateB} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    disabled={!isValidDate(dateA) || !isValidDate(dateB)}
                    className="w-full sm:w-auto min-w-[240px] text-base py-4"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Comparar mapas
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-muted font-mono pt-4">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Sin registro · 100% calculado en tu navegador</span>
                </div>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 pt-12 border-t border-ink/10">
                <div className="p-4 rounded-2xl bg-card border border-ink/5">
                  <span className="font-mono text-xs text-accent font-bold uppercase tracking-wider block mb-1">
                    01 · Numerología
                  </span>
                  <p className="text-xs text-muted leading-relaxed">
                    Compara los Números de Camino de Vida y la compatibilidad de propósitos centrales.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-card border border-ink/5">
                  <span className="font-mono text-xs text-amber-700 font-bold uppercase tracking-wider block mb-1">
                    02 · Astrología & Elementos
                  </span>
                  <p className="text-xs text-muted leading-relaxed">
                    Analiza la química entre signos solares y la armonía entre fuego, tierra, aire y agua.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-card border border-ink/5">
                  <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                    03 · Zodíaco Chino
                  </span>
                  <p className="text-xs text-muted leading-relaxed">
                    Descubre tríadas de afinidad, amigos secretos y puntos de contraste tradicionales.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        )}
      </div>
    </div>
  );
}
