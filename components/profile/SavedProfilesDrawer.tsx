"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bookmark,
  BookmarkPlus,
  Trash2,
  X,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import type { UserProfile } from "@/types/user";
import {
  getSavedProfilesVault,
  saveProfileToVault,
  deleteProfileFromVault,
  type VaultProfileItem,
} from "@/lib/session/multiProfiles";
import Link from "next/link";

interface SavedProfilesDrawerProps {
  currentProfile?: UserProfile | null;
  className?: string;
}

export default function SavedProfilesDrawer({
  currentProfile,
  className = "",
}: SavedProfilesDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [vault, setVault] = useState<VaultProfileItem[]>([]);
  const [customLabel, setCustomLabel] = useState("");
  const [savedFeedback, setSavedFeedback] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const refreshVault = useCallback(() => {
    setVault(getSavedProfilesVault());
  }, []);

  useEffect(() => {
    refreshVault();
    const handleVaultChange = () => refreshVault();
    window.addEventListener("molino-vault-updated", handleVaultChange);
    return () => window.removeEventListener("molino-vault-updated", handleVaultChange);
  }, [refreshVault]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSaveCurrent = () => {
    if (!currentProfile || !currentProfile.birthDate) return;

    const label = customLabel.trim() || currentProfile.name?.trim() || "Mi Mapa";
    saveProfileToVault({
      label,
      name: currentProfile.name,
      birthDate: currentProfile.birthDate,
      lifePath: currentProfile.lifePath,
      sunSign: currentProfile.sunSign,
      chineseZodiac: currentProfile.chineseZodiac,
    });

    setCustomLabel("");
    setSavedFeedback(true);
    refreshVault();
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteProfileFromVault(id);
    refreshVault();
  };

  const isCurrentAlreadySaved =
    currentProfile &&
    vault.some((p) => p.birthDate === currentProfile.birthDate);

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          refreshVault();
          setIsOpen(true);
        }}
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-ink/10 text-xs font-mono text-foreground/90 hover:border-accent/40 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all shadow-sm ${className}`}
        title="Ver y cambiar entre mapas guardados en este navegador"
        aria-label="Abrir bóveda de perfiles locales"
      >
        {vault.length > 0 ? (
          <Bookmark className="w-3.5 h-3.5 text-accent" />
        ) : (
          <BookmarkPlus className="w-3.5 h-3.5 text-accent" />
        )}
        <span>{vault.length > 0 ? `Bóveda Local (${vault.length})` : "Guardar en Bóveda"}</span>
      </button>

      {/* Drawer Modal Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="vault-title"
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-lg rounded-3xl bg-card border border-ink/15 p-6 sm:p-8 shadow-2xl relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-ink/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                    <Bookmark className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 id="vault-title" className="font-heading text-lg font-bold text-foreground">
                      Bóveda de Mapas Guardados
                    </h3>
                    <p className="text-[11px] font-mono text-muted">
                      100% privado en tu navegador · Sin cuentas
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
                  aria-label="Cerrar bóveda"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Save Current Profile Box */}
              {currentProfile && currentProfile.birthDate && !isCurrentAlreadySaved && (
                <div className="mt-5 p-4 rounded-2xl bg-accent/5 border border-accent/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-accent">
                      Guardar mapa actual
                    </span>
                    <span className="text-[11px] font-mono text-muted">
                      {currentProfile.birthDate}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Etiqueta (ej: Mi Mapa, Lucas, Mamá...)"
                      value={customLabel}
                      onChange={(e) => setCustomLabel(e.target.value)}
                      className="flex-1 rounded-xl bg-background border border-ink/10 px-3 py-1.5 text-xs text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent focus-visible:ring-1 focus-visible:ring-accent"
                    />
                    <button
                      type="button"
                      onClick={handleSaveCurrent}
                      className="px-3.5 py-1.5 rounded-xl bg-accent text-background font-mono text-xs font-bold hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors inline-flex items-center gap-1.5 flex-shrink-0"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      <span>Guardar</span>
                    </button>
                  </div>
                </div>
              )}

              {savedFeedback && (
                <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2">
                  <Check className="w-3.5 h-3.5" />
                  <span>¡Mapa guardado en tu bóveda local!</span>
                </div>
              )}

              {/* Vault List */}
              <div className="mt-6 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {vault.length === 0 ? (
                  <div className="py-8 text-center text-muted text-xs font-mono">
                    <p>Aún no guardaste mapas en este navegador.</p>
                    <p className="mt-1 text-[11px] text-muted/70">
                      Podés guardar tu perfil, el de tu pareja, amigos o familiares para consultarlos al instante.
                    </p>
                  </div>
                ) : (
                  vault.map((item) => {
                    const isCurrent =
                      currentProfile && currentProfile.birthDate === item.birthDate;

                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          isCurrent
                            ? "bg-accent/10 border-accent/30"
                            : "bg-background border-ink/5 hover:border-ink/20"
                        }`}
                      >
                        <Link
                          href={`/profile?dob=${item.birthDate}`}
                          onClick={() => setIsOpen(false)}
                          className="flex-1 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-heading text-sm font-bold text-foreground truncate">
                              {item.label}
                            </span>
                            {isCurrent && (
                              <span className="text-[9px] font-mono uppercase bg-accent text-background px-1.5 py-0.5 rounded font-bold">
                                Activo
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-mono text-muted mt-0.5">
                            Camino {item.lifePath} · {item.sunSign} · {item.chineseZodiac} ({item.birthDate})
                          </p>
                        </Link>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/profile?dob=${item.birthDate}`}
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 rounded-lg text-accent hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
                            title="Ver este mapa"
                            aria-label={`Ver mapa de ${item.label}`}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={(e) => handleDelete(item.id, e)}
                            className="p-1.5 rounded-lg text-muted hover:text-rose-400 hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 transition-colors"
                            title="Eliminar de la bóveda"
                            aria-label={`Eliminar mapa de ${item.label}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer Notice */}
              <div className="mt-6 pt-4 border-t border-ink/10 flex items-center justify-between text-[11px] font-mono text-muted">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Almacenado solo en este dispositivo
                </span>
                <Link
                  href="/pareja"
                  onClick={() => setIsOpen(false)}
                  className="text-accent hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent inline-flex items-center gap-1"
                >
                  Comparar con otro <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
