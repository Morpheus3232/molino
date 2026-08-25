"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bookmark,
  BookmarkPlus,
  Trash2,
  X,
  ArrowRight,
  ShieldCheck,
  Check,
  Plus,
  Sparkles,
  Lock,
  Gift,
} from "lucide-react";
import type { UserProfile } from "@/types/user";
import {
  getSavedProfilesVault,
  saveProfileToVault,
  deleteProfileFromVault,
  type VaultProfileItem,
} from "@/lib/session/multiProfiles";
import { hasStoredProfile, clearStoredProfile } from "@/lib/session/localStorage";
import { getProfileSalt } from "@/lib/profile-salt";
import Link from "next/link";

interface SavedProfilesDrawerProps {
  currentProfile?: UserProfile | null;
  className?: string;
  /** Oculta el texto del botón trigger hasta 2xl — solo para el header, donde
   * el espacio es escaso con los 9 links de nav. En el resto de usos el
   * texto siempre se muestra. */
  compact?: boolean;
  /** Override del texto/aria-label del trigger (ej. "Guardar mi mapa" /
   * "Mis Mapas" en el header, según haya o no perfil activo). La
   * funcionalidad del drawer no cambia, solo la etiqueta visible. */
  label?: string;
  /** Atajo dorado para usuarios premium: en vez de abrir el drawer, el
   * trigger se vuelve un link directo al mapa guardado más reciente (el
   * primero de la bóveda, que ya queda ordenada por fecha de guardado en
   * multiProfiles.ts). Solo se activa si además hay al menos un mapa
   * guardado — sin eso no hay "más reciente" al que ir. Pensado para el
   * header; el resto de los usos del drawer (ej. ActionButtons en
   * /profile) no lo pasan y mantienen el modal completo. */
  premiumShortcut?: boolean;
}

export default function SavedProfilesDrawer({
  currentProfile,
  className = "",
  compact = false,
  label,
  premiumShortcut = false,
}: SavedProfilesDrawerProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [vault, setVault] = useState<VaultProfileItem[]>([]);
  const [customLabel, setCustomLabel] = useState("");
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [confirmNewMap, setConfirmNewMap] = useState(false);
  /** id del mapa → tiene La Lectura desbloqueada. Vacío hasta que responde el
   * servidor: el estado premium no vive en localStorage (es por fecha +
   * dispositivo, en KV), así que no se puede derivar del item guardado. */
  const [lecturaStatus, setLecturaStatus] = useState<Record<string, boolean>>({});
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
    if (!isOpen) setConfirmNewMap(false);
  }, [isOpen]);

  // Estado de La Lectura por mapa — una sola request para toda la bóveda, solo
  // mientras el drawer está abierto (nadie necesita este dato con el modal
  // cerrado). Si falla, los badges simplemente no aparecen: es un indicador
  // informativo, nunca el control de acceso — ese vive en el servidor, en
  // /api/intelligence/interpret.
  useEffect(() => {
    if (!isOpen || vault.length === 0) return;
    let cancelled = false;
    fetch("/api/mp/check-batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        salt: getProfileSalt(),
        profiles: vault.map((v) => ({ id: v.id, name: v.name, birthDate: v.birthDate })),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data?.status) setLecturaStatus(data.status);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isOpen, vault]);

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

  // "Crear nuevo mapa" — el único slot de perfil activo (lib/session/
  // localStorage.ts) impide arrancar uno nuevo mientras haya uno cargado;
  // /onboarding rebota a /profile si hasStoredProfile() es true. El mapa
  // activo ya está en la bóveda (o el usuario eligió no guardarlo), así que
  // limpiarlo acá nunca pierde nada — solo confirma antes por si no lo guardó.
  const handleCreateNewMap = () => {
    if (hasStoredProfile()) {
      setConfirmNewMap(true);
      return;
    }
    setIsOpen(false);
    router.push("/onboarding");
  };

  const confirmCreateNewMap = () => {
    clearStoredProfile();
    setConfirmNewMap(false);
    setIsOpen(false);
    router.push("/onboarding");
  };

  const isCurrentAlreadySaved =
    currentProfile &&
    vault.some((p) => p.birthDate === currentProfile.birthDate);

  // La bóveda ya queda ordenada por fecha de guardado (más nuevo primero,
  // ver saveProfileToVault en multiProfiles.ts) — vault[0] es "el mapa
  // reciente" sin ordenar nada acá.
  const mostRecent = vault[0] ?? null;
  const goldShortcut = premiumShortcut && mostRecent !== null;

  return (
    <>
      {/* Trigger — para usuarios premium con al menos un mapa guardado, el
          dorado marca el atajo visualmente, pero el click sigue abriendo la
          bóveda (no navega directo): un link directo escondía "crear nuevo
          mapa" y la lista de mapas guardados detrás de una sola fecha. */}
      {goldShortcut ? (
        <button
          type="button"
          onClick={() => {
            refreshVault();
            setIsOpen(true);
          }}
          // Color inline, no por clase: `className` acá suele venir de
          // navButtonClass() del header, que ya trae su propio text-muted —
          // dos utilities de color de igual especificidad hacen que quién
          // gane dependa del orden interno de Tailwind, no de la intención.
          // El inline style siempre gana sobre eso.
          style={{ color: "var(--color-gold-foreground)" }}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gold/15 border border-gold/40 text-xs font-mono font-semibold hover:bg-gold/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-all shadow-sm ${className}`}
          title={label ?? "Ver tus mapas guardados o crear uno nuevo"}
          aria-label={label ?? "Mis Mapas"}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span className={compact ? "hidden lg:inline" : ""}>{label ?? "Mis Mapas"}</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            refreshVault();
            setIsOpen(true);
          }}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-ink/10 text-xs font-mono text-foreground/90 hover:border-accent/40 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all shadow-sm ${className}`}
          title={label ?? "Ver y cambiar entre mapas guardados en este navegador"}
          aria-label={label ?? "Abrir bóveda de perfiles locales"}
        >
          {vault.length > 0 ? (
            <Bookmark className="w-3.5 h-3.5 text-accent" />
          ) : (
            <BookmarkPlus className="w-3.5 h-3.5 text-accent" />
          )}
          <span className={compact ? "hidden lg:inline" : ""}>{label ?? (vault.length > 0 ? `Bóveda Local (${vault.length})` : "Guardar en Bóveda")}</span>
        </button>
      )}

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
              className="w-full max-w-lg rounded-md bg-card border border-ink/15 p-6 sm:p-8 shadow-2xl relative overflow-hidden"
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
                    <p className="text-xs font-mono text-muted">
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

              {/* Crear nuevo mapa — así alguien con su mapa ya cargado (o
                  premium, con el atajo dorado) puede armar el de otra
                  persona sin que el único slot de perfil activo se lo
                  impida. Si hay un perfil activo, confirma antes de
                  limpiarlo (ya está en la bóveda o el usuario elige no
                  guardarlo). */}
              {confirmNewMap ? (
                <div className="mt-5 p-4 rounded-md bg-ink/5 border border-ink/10 space-y-3">
                  <p className="text-xs text-foreground leading-relaxed">
                    Se va a limpiar el mapa activo para armar uno nuevo. Si no lo guardaste en la bóveda, se pierde.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmNewMap(false)}
                      className="flex-1 px-3.5 py-1.5 rounded-xl border border-ink/10 text-muted font-mono text-xs hover:text-foreground hover:border-ink/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={confirmCreateNewMap}
                      className="flex-1 px-3.5 py-1.5 rounded-xl bg-accent text-background font-mono text-xs font-bold hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
                    >
                      Crear nuevo mapa
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleCreateNewMap}
                  className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-dashed border-accent/40 text-accent font-mono text-xs font-bold hover:bg-accent/5 hover:border-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Crear nuevo mapa</span>
                </button>
              )}

              {/* Save Current Profile Box */}
              {currentProfile && currentProfile.birthDate && !isCurrentAlreadySaved && (
                <div className="mt-5 p-4 rounded-md bg-accent/5 border border-accent/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-accent">
                      Guardar mapa actual
                    </span>
                    <span className="text-xs font-mono text-muted">
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
                <div className="mt-3 p-2.5 rounded-xl bg-success/10 border border-success/20 text-success text-xs font-mono flex items-center gap-2">
                  <Check className="w-3.5 h-3.5" />
                  <span>¡Mapa guardado en tu bóveda local!</span>
                </div>
              )}

              {/* Vault List */}
              <div className="mt-6 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {vault.length === 0 ? (
                  <div className="py-8 text-center text-muted text-xs font-mono">
                    <p>Aún no guardaste mapas en este navegador.</p>
                    <p className="mt-1 text-xs text-muted/70">
                      Podés guardar tu perfil, el de tu pareja, amigos o familiares para consultarlos al instante.
                    </p>
                  </div>
                ) : (
                  vault.map((item) => {
                    const isCurrent =
                      currentProfile && currentProfile.birthDate === item.birthDate;
                    const hasLectura = lecturaStatus[item.id];

                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-md border transition-all flex items-center justify-between gap-3 ${
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
                              <span className="text-xs font-mono uppercase bg-accent text-background px-1.5 py-0.5 rounded font-bold">
                                Activo
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-mono text-muted mt-0.5">
                            Camino {item.lifePath} · {item.sunSign} · {item.chineseZodiac} ({item.birthDate})
                          </p>
                          {/* Cada mapa se paga por separado (el acceso es por
                              fecha), así que la bóveda distingue cuál ya tiene
                              La Lectura y cuál no. Sin dato del servidor
                              todavía, no se muestra nada — mejor ningún badge
                              que uno equivocado. */}
                          {hasLectura !== undefined && (
                            <span
                              className={`mt-1.5 inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.1em] px-1.5 py-0.5 rounded ${
                                hasLectura
                                  ? "bg-gold/15 border border-gold/40"
                                  : "text-muted/80 border border-ink/10"
                              }`}
                              style={hasLectura ? { color: "var(--color-gold-foreground)" } : undefined}
                            >
                              {hasLectura ? (
                                <>
                                  <Sparkles className="w-2.5 h-2.5" aria-hidden="true" />
                                  Lectura incluida
                                </>
                              ) : (
                                <>
                                  <Lock className="w-2.5 h-2.5" aria-hidden="true" />
                                  Sin lectura
                                </>
                              )}
                            </span>
                          )}
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
                            className="p-1.5 rounded-lg text-muted hover:text-error hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error transition-colors"
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

              {/* Regalar — /regalar existe completo (compra de código +
                  canje con la fecha del destinatario) pero no se linkeaba
                  desde ningún lado del sitio. Este es el lugar natural:
                  quien está mirando los mapas de otras personas es
                  exactamente quien puede querer regalarle la lectura a
                  alguien. */}
              <Link
                href="/regalar"
                onClick={() => setIsOpen(false)}
                className="mt-4 flex items-center gap-3 p-3.5 rounded-md border border-gold/30 bg-gold/[0.06] hover:bg-gold/[0.12] hover:border-gold/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-colors"
              >
                <Gift className="w-4 h-4 shrink-0" style={{ color: "var(--color-gold-foreground)" }} aria-hidden="true" />
                <span className="flex-1 min-w-0">
                  <span className="block font-heading text-sm font-bold text-foreground">
                    Regalar una lectura
                  </span>
                  <span className="block text-xs text-muted mt-0.5">
                    Comprás un código y la persona lo canjea con su propia fecha.
                  </span>
                </span>
                <ArrowRight className="w-4 h-4 text-muted shrink-0" aria-hidden="true" />
              </Link>

              {/* Footer Notice */}
              <div className="mt-6 pt-4 border-t border-ink/10 flex items-center justify-between text-xs font-mono text-muted">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-success" />
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
