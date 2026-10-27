"use client";
import { useL } from "@/lib/i18n/useL";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, Link } from "@/lib/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import CoupleComparison from "@/components/couple/CoupleComparison";
import DateInput from "@/components/ui/DateInput";
import Button from "@/components/ui/Button";
import { buildInviteMessage } from "@/lib/viral/invite";
import {
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  Zap,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import { PageHero } from "@/components/knowledge/Kit";

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

/** Parámetros de la URL ya leídos en el servidor (ver page.tsx). */
export type UrlParams = Record<string, string | undefined>;

export default function ParejaClient({ params }: { params: UrlParams }) {
  const L = useL();
  const router = useRouter();
  // Antes useSearchParams: obligaba a renderizar la página solo en el navegador
  // y Google recibía "Cargando comparativa..." en vez del formulario.
  const searchParams = { get: (k: string): string | null => params[k] ?? null };

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
    <main id="main-content" className="min-h-screen bg-background pt-12 sm:pt-16 pb-24">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <PageHero
          bare
          crumbs={[{ href: "/", label: L("Inicio", "Home") }, { label: L("Modo Pareja", "Couple Mode") }]}
          eyebrow={L("Modo Pareja · dos mapas cruzados", "Couple Mode · two maps crossed")}
          title={L("Comparativa de mapas", "Map comparison")}
          lead={L("Dos fechas de nacimiento y los tres sistemas cara a cara: Camino de Vida, signo solar, zodíaco chino y elementos.", "Two dates of birth and the three systems face to face: Life Path, sun sign, Chinese zodiac and elements.")}
          imageKey="paginas/pareja"
        />

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
              <div className="mb-6 p-4 rounded-xl bg-accent/5 border border-accent/20 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted">{L("¿Querés ver cómo funciona sin ingresar fechas?", "Want to see how it works without entering dates?")}</p>
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
                  className="px-3 py-1.5 rounded-lg bg-accent/15 hover:bg-accent/25 border border-accent/30 text-accent font-mono text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                >{L(<>
                  Cargar ejemplo (Ana & Lucas)
                </>, <>Load example (Ana & Lucas)</>)}</button>
              </div>

              <form onSubmit={handleCompare} className="space-y-8">
                {/* Two Input Cards Grid (Side by side on desktop, stacked on mobile) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card 1: Persona A */}
                  <div className="rounded-xl border border-gold/30 bg-card p-6 sm:p-8 shadow-sm space-y-5 relative overflow-hidden">
                    <div className="flex items-center justify-between">{L(<>
                      <span className="text-sm px-2.5 py-1 rounded-full bg-gold/10 text-foreground font-bold label-caps">
                        Persona A
                      </span>
                      <span className="font-mono text-xs text-muted">Primer mapa</span>
                    </>, <><span className="text-sm px-2.5 py-1 rounded-full bg-gold/10 text-foreground font-bold label-caps">Person A</span><span className="font-mono text-xs text-muted">First map</span></>)}</div>

                    <div>
                      <label
                        htmlFor="name-a"
                        className="block text-sm text-muted mb-1.5 font-semibold label-caps"
                      >{L("Nombre o apodo (opcional)", "Name or nickname (optional)")}</label>
                      <input
                        id="name-a"
                        type="text"
                        placeholder={L("Ej. Alex", "E.g. Alex")}
                        value={nameA}
                        onChange={(e) => setNameA(e.target.value)}
                        className="w-full rounded-md bg-background border border-ink/10 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted mb-3 font-semibold text-center label-caps">{L("Fecha de Nacimiento", "Date of Birth")}</label>
                      <DateInput value={dateA} onChange={setDateA} />
                    </div>
                  </div>

                  {/* Card 2: Persona B */}
                  <div className="rounded-xl border border-ink/20 bg-card p-6 sm:p-8 shadow-sm space-y-5 relative overflow-hidden">
                    <div className="flex items-center justify-between">{L(<>
                      <span className="text-sm px-2.5 py-1 rounded-full bg-ink/5 text-foreground font-bold label-caps">
                        Persona B
                      </span>
                      <span className="font-mono text-xs text-muted">Segundo mapa</span>
                    </>, <><span className="text-sm px-2.5 py-1 rounded-full bg-ink/5 text-foreground font-bold label-caps">Person B</span><span className="font-mono text-xs text-muted">Second map</span></>)}</div>

                    <div>
                      <label
                        htmlFor="name-b"
                        className="block text-sm text-muted mb-1.5 font-semibold label-caps"
                      >{L("Nombre o apodo (opcional)", "Name or nickname (optional)")}</label>
                      <input
                        id="name-b"
                        type="text"
                        placeholder={L("Ej. Sam", "E.g. Sam")}
                        value={nameB}
                        onChange={(e) => setNameB(e.target.value)}
                        className="w-full rounded-md bg-background border border-ink/10 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted mb-3 font-semibold text-center label-caps">{L("Fecha de Nacimiento", "Date of Birth")}</label>
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
                  >{L("Comparar mapas", "Compare maps")}</Button>

                  {isValidDate(dateA) && !isValidDate(dateB) && (
                    <button
                      type="button"
                      onClick={() => {
                        const inviteMsg = buildInviteMessage({ birthDate: dateA, name: nameA.trim() || undefined });
                        navigator.clipboard.writeText(inviteMsg);
                        setCopiedInvite(true);
                        setTimeout(() => setCopiedInvite(false), 2500);
                      }}
                      className="w-full sm:w-auto px-5 py-3.5 rounded-md bg-accent/10 hover:bg-accent/20 border border-accent/25 text-accent font-mono text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors"
                      title={L("Copiar invitación P2P para tu pareja", "Copy a P2P invitation for your partner")}
                    >
                      {copiedInvite ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400">{L("¡Invitación copiada!", "Invitation copied!")}</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4" />
                          <span>{L("Invitar a tu pareja a completar", "Invite your partner to fill it in")}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Privacy & Methodology Footer note */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted font-mono pt-4">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{L("Sin registro · 100% calculado en tu navegador", "No sign-up · 100% calculated in your browser")}</span>
                </div>
              </form>

              {/* Explanatory Pills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 pt-12 border-t border-ink/10">
                <div className="p-4 rounded-xl bg-card border border-ink/5">
                  <span className="text-sm text-accent font-bold block mb-1 label-caps">{L("01 · Numerología", "01 · Numerology")}</span>
                  <p className="text-xs text-muted leading-relaxed">{L("Compara los Números de Camino de Vida y la compatibilidad de propósitos centrales.", "Compares the Life Path Numbers and how well their core purposes fit.")}</p>
                </div>

                <div className="p-4 rounded-xl bg-card border border-ink/5">
                  <span className="text-sm text-foreground font-bold block mb-1 label-caps">{L(<>
                    02 · Astrología & Elementos
                  </>, <>02 · Astrology & Elements</>)}</span>
                  <p className="text-xs text-muted leading-relaxed">{L("Analiza la química entre signos solares y la armonía entre fuego, tierra, aire y agua.", "Analyzes the chemistry between sun signs and the harmony between fire, earth, air and water.")}</p>
                </div>

                <div className="p-4 rounded-xl bg-card border border-ink/5">
                  <span className="text-sm text-foreground font-bold block mb-1 label-caps">{L("03 · Zodíaco Chino", "03 · Chinese Zodiac")}</span>
                  <p className="text-xs text-muted leading-relaxed">{L("Descubrí tríadas de afinidad, amigos secretos y puntos de contraste tradicionales.", "Discover affinity triads, secret friends and the traditional points of contrast.")}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
