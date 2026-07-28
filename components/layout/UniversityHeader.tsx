"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { hasStoredProfile, clearStoredProfile } from "@/lib/storage/localStorage";

export default function UniversityHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [hasProfile, setHasProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasProfile(hasStoredProfile());
    const refresh = () => setHasProfile(hasStoredProfile());
    window.addEventListener("molino-profile-created", refresh);
    window.addEventListener("molino-profile-cleared", refresh);
    return () => {
      window.removeEventListener("molino-profile-created", refresh);
      window.removeEventListener("molino-profile-cleared", refresh);
    };
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showConfirm) {
          setShowConfirm(false);
          triggerRef.current?.focus();
        }
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showConfirm]);

  useEffect(() => {
    if (!showConfirm || !modalRef.current) return;
    const modal = modalRef.current;
    const focusable = modal.querySelectorAll<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    modal.addEventListener("keydown", handleTab);
    return () => modal.removeEventListener("keydown", handleTab);
  }, [showConfirm]);

  const handleNewProfile = useCallback(() => { setShowConfirm(true); }, []);

  const confirmNewProfile = useCallback(() => {
    clearStoredProfile();
    setShowConfirm(false);
    triggerRef.current?.focus();
    window.dispatchEvent(new Event("molino-profile-cleared"));
    router.push("/");
  }, [router]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-8xl px-5 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group" aria-label="Molino — Ir al inicio">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background text-base font-semibold tracking-tight">
              M
            </span>
            <span className="font-serif text-xl font-semibold tracking-tight text-foreground">
              Molino
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {hasProfile && (
              <Link
                href="/profile"
                className="hidden sm:inline-flex items-center rounded-full px-4 py-2 text-sm transition-colors text-muted hover:text-foreground"
                aria-current={pathname === "/profile" ? "page" : undefined}
              >
                Mi mapa
              </Link>
            )}
            {hasProfile ? (
              <button
                ref={triggerRef}
                type="button"
                onClick={handleNewProfile}
                className="inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-xs font-medium text-muted hover:text-foreground transition-colors"
              >
                Nuevo perfil
              </button>
            ) : null}
          </div>
        </div>

        {hasProfile && (
          <div className="lg:hidden px-5 sm:px-8 pb-3">
            <Link href="/profile" className="text-sm text-muted hover:text-foreground transition-colors">
              Mi mapa
            </Link>
          </div>
        )}
      </header>

      {showConfirm && (
        <div ref={modalRef} className="fixed inset-0 z-[100] flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => { setShowConfirm(false); triggerRef.current?.focus(); }} />
          <div className="relative bg-card border border-border rounded-2xl shadow-xl p-6 sm:p-8 max-w-sm mx-4 w-full">
            <h3 id="confirm-title" className="font-serif text-xl font-semibold text-foreground mb-2">Nuevo perfil</h3>
            <p className="text-sm text-muted mb-6">Se eliminará el perfil actual. Podés crear uno nuevo después.</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => { setShowConfirm(false); triggerRef.current?.focus(); }} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all px-4 py-3 text-sm bg-transparent text-foreground border border-border hover:bg-foreground/5">
                Cancelar
              </button>
              <button type="button" onClick={confirmNewProfile} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all px-4 py-3 text-sm bg-primary text-primary-foreground shadow-sm hover:bg-accent hover:text-accent-foreground">
                Crear nuevo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
