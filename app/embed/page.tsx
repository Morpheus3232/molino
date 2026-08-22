"use client";

import { useState, useRef, useCallback } from "react";
import { Sparkles, ArrowRight, ShieldCheck, Copy, Check, Code2, Sliders, ExternalLink } from "lucide-react";
import DateInput, { type DateInputHandle } from "@/components/ui/DateInput";
import { saveOnboardingData } from "@/lib/session/ephemeral";
import { useRouter, useSearchParams } from "next/navigation";

function isValidBirthDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year] = value.split("-").map(Number);
  const birth = new Date(`${value}T00:00:00`);
  return year >= 1900 && birth < new Date();
}

export default function EmbedWidgetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isCompactParam = searchParams.get("compact") === "true";
  const themeParam = searchParams.get("theme") || "dark";

  const [dateValue, setDateValue] = useState("");
  const [copied, setCopied] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(themeParam);
  const [isCompact, setIsCompact] = useState(isCompactParam);
  const dateInputRef = useRef<DateInputHandle>(null);
  const isDateValid = isValidBirthDate(dateValue);

  const handleGenerate = useCallback(() => {
    if (!isDateValid) {
      dateInputRef.current?.reportIncomplete();
      return;
    }
    const [year, month, day] = dateValue.split("-");
    saveOnboardingData({ day, month, year, dateValue, dateOfBirth: dateValue });

    // Open full map in new tab if embedded in an external iframe
    if (typeof window !== "undefined" && window.top !== window.self) {
      window.open(`/profile?dob=${dateValue}`, "_blank");
    } else {
      router.push(`/profile?dob=${dateValue}`);
    }
  }, [dateValue, isDateValid, router]);

  const embedUrl = `https://molino.app/embed${
    isCompact || selectedTheme !== "dark"
      ? `?theme=${selectedTheme}${isCompact ? "&compact=true" : ""}`
      : ""
  }`;

  const embedCode = `<iframe src="${embedUrl}" width="100%" height="${
    isCompact ? "320" : "440"
  }" style="border:none;border-radius:20px;overflow:hidden;" title="Calculadora de Mapa Personal"></iframe>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className={`min-h-screen ${
        selectedTheme === "light"
          ? "bg-[#F9F8F5] text-[#1A1A1E]"
          : "bg-background text-foreground"
      } flex flex-col justify-center items-center p-4 sm:p-6`}
    >
      <div
        className={`w-full max-w-md rounded-3xl ${
          selectedTheme === "light"
            ? "bg-white border-black/10 shadow-xl"
            : "bg-card border-ink/10 shadow-2xl"
        } border p-6 sm:p-8 relative overflow-hidden text-center`}
      >
        {/* Glow */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
              Molino Widget
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className="text-[11px] font-mono text-muted hover:text-foreground inline-flex items-center gap-1 transition-colors"
            title="Personalizar e incrustar"
          >
            {showConfig ? <Code2 className="w-3.5 h-3.5" /> : <Sliders className="w-3.5 h-3.5" />}
            <span>{showConfig ? "Ver Calculadora" : "Incrustar"}</span>
          </button>
        </div>

        {!isCompact && (
          <>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Calculá tu Mapa Personal
            </h1>
            <p className="text-xs sm:text-sm text-muted mb-6 leading-relaxed">
              Descubrí tu Camino de Vida, signo solar y animal del zodíaco chino en 30 segundos.
            </p>
          </>
        )}

        {showConfig ? (
          <div className="text-left bg-background/50 p-4 rounded-2xl border border-ink/10 space-y-4 mb-2">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase text-muted font-bold block">
                Opciones del Widget
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTheme("dark")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono border ${
                    selectedTheme === "dark"
                      ? "bg-accent/20 border-accent text-accent font-bold"
                      : "border-ink/10 text-muted"
                  }`}
                >
                  Modo Oscuro
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTheme("light")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono border ${
                    selectedTheme === "light"
                      ? "bg-accent/20 border-accent text-accent font-bold"
                      : "border-ink/10 text-muted"
                  }`}
                >
                  Modo Claro
                </button>
                <button
                  type="button"
                  onClick={() => setIsCompact(!isCompact)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono border ${
                    isCompact
                      ? "bg-accent/20 border-accent text-accent font-bold"
                      : "border-ink/10 text-muted"
                  }`}
                >
                  {isCompact ? "Compacto ✓" : "Estándar"}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-muted font-bold">
                  Código iframe HTML
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="text-xs font-mono text-accent inline-flex items-center gap-1 hover:underline font-bold"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "¡Copiado!" : "Copiar código"}</span>
                </button>
              </div>
              <textarea
                readOnly
                rows={3}
                value={embedCode}
                className="w-full text-[11px] font-mono bg-card border border-ink/10 rounded-xl p-2.5 text-foreground/90 focus:outline-none resize-none"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <DateInput ref={dateInputRef} value={dateValue} onChange={setDateValue} />
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={!isDateValid}
              className={`
                w-full py-3.5 px-6 rounded-xl font-heading text-sm uppercase tracking-wider font-bold
                transition-all duration-200 inline-flex items-center justify-center gap-2
                ${
                  isDateValid
                    ? "bg-gold text-gold-foreground hover:bg-gold-hover shadow-md"
                    : "bg-ink/10 text-muted cursor-not-allowed"
                }
              `}
            >
              <span>Ver mi mapa</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-ink/10 flex items-center justify-between text-[11px] font-mono text-muted">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            100% privado y local
          </span>
          <a
            href="https://molino.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors inline-flex items-center gap-1"
          >
            <span>molino.app</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
