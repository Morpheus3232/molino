"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import CoupleComparison from "@/components/couple/CoupleComparison";
import DateInput from "@/components/ui/DateInput";
import Button from "@/components/ui/Button";
import {
  Heart,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  Zap,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";

function parseDateParam(param: string | null): string {
  if (!param) return "";
  const clean = param.trim();
  // Format: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
    return clean;
  }
  // Format: DDMMYYYY (8 digits)
  if (/^\d{8}$/.test(clean)) {
    const day = clean.slice(0, 2);
    const month = clean.slice(2, 4);
    const year = clean.slice(4, 8);
    return `${year}-${month}-${day}`;
  }
  // Format: DD-MM-YYYY or DD/MM/YYYY
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

export default function ParejaClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlDateA = parseDateParam(searchParams.get("a"));
  const urlDateB = parseDateParam(searchParams.get("b"));
  const urlNameA = searchParams.get("na") || "";
  const urlNameB = searchParams.get("nb") || "";

  const [dateA, setDateA] = useState(urlDateA);
  const [dateB, setDateB] = useState(urlDateB);
  const [nameA, setNameA] = useState(urlNameA);
  const [nameB, setNameB] = useState(urlNameB);
  const [copiedInvite, setCopiedInvite] = useState(false);
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
      window.history.replaceState(null, "", `/pareja?${query.toString()}`);
    }
  };

  const handleReset = () => {
    setIsComparing(false);
    setDateA("");
    setDateB("");
    setNameA("");
    setNameB("");
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", "/pareja");
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24 pb-24">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <header className="mb-10 sm:mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
            <Heart className="w-3.5 h-3.5 text-accent animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
              Modo Pareja · Sinergia Simbólica
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground uppercase tracking-tight">
            Comparativa de Mapas
          </h1>
          <p className="text-sm sm:text-base text-muted mt-2 leading-relaxed">
            Ingresá dos fechas de nacimiento para cruzar sus caminos de vida, signos solares, zodíaco
            chino y química elemental.
          </p>
        </header>

        {/* View Mode: Comparison or Input Form */}
        <AnimatePresence mode="wait">
          {isComparing && profileA && profileB ? (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              <CoupleComparison
                profileA={profileA}
                profileB={profileB}
                onReset={handleReset}
              />
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
              {/* Quick Sample Demo Banner */}
              <div className="mb-6 p-4 rounded-2xl bg-accent/5 border border-accent/20 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent flex-shrink-0" />
                  <p className="text-xs text-muted">
                    ¿Querés ver cómo funciona sin ingresar fechas?
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setNameA("Ana");
                    setDateA("1990-03-15");
                    setNameB("Lucas");
                    setDateB("1988-07-22");
                    setIsComparing(true);
                    if (typeof window !== "undefined") {
                      window.history.replaceState(null, "", "/pareja?a=1990-03-15&b=1988-07-22&na=Ana&nb=Lucas");
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-accent/15 hover:bg-accent/25 border border-accent/30 text-accent font-mono text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Cargar ejemplo (Ana & Lucas)
                </button>
              </div>

              <form onSubmit={handleCompare} className="space-y-8">
                {/* Two Input Cards Grid (Side by side on desktop, stacked on mobile) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card 1: Persona A */}
                  <div className="rounded-3xl border border-amber-500/25 bg-card p-6 sm:p-8 shadow-sm space-y-5 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-bold">
                        Persona A
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

                  {/* Card 2: Persona B */}
                  <div className="rounded-3xl border border-blue-500/25 bg-card p-6 sm:p-8 shadow-sm space-y-5 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 font-bold">
                        Persona B
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

                {/* Submit & P2P Invite Buttons */}
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

                  {isValidDate(dateA) && !isValidDate(dateB) && (
                    <button
                      type="button"
                      onClick={() => {
                        const origin = typeof window !== "undefined" ? window.location.origin : "https://molino.app";
                        const inviteUrl = `${origin}/pareja?a=${dateA}${nameA ? `&na=${encodeURIComponent(nameA)}` : ""}`;
                        navigator.clipboard.writeText(
                          `¡Hola! Creé mi mapa en Molino y quiero ver nuestra compatibilidad. Entrá acá y completá tu fecha: ${inviteUrl}`
                        );
                        setCopiedInvite(true);
                        setTimeout(() => setCopiedInvite(false), 2500);
                      }}
                      className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-accent/10 hover:bg-accent/20 border border-accent/25 text-accent font-mono text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors"
                      title="Copiar invitación P2P para tu pareja"
                    >
                      {copiedInvite ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400">¡Invitación copiada!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4" />
                          <span>Invitar a tu pareja a completar</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Privacy & Methodology Footer note */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted font-mono pt-4">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Sin registro · 100% calculado en tu navegador</span>
                </div>
              </form>

              {/* Explanatory Pills Grid */}
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
                  <span className="font-mono text-xs text-amber-400 font-bold uppercase tracking-wider block mb-1">
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
      </div>
    </div>
  );
}
