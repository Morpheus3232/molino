"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { hasStoredProfile, clearStoredProfile } from "@/lib/storage/localStorage";

export default function UniversityHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [hasProfile, setHasProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

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
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/80 backdrop-blur-sm shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-8xl px-5 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center group" aria-label="Molino — Ir al inicio">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
                <polygon points="9,22 15,22 13,11 11,11" />
                <polygon points="12,4 9,11 15,11" />
                <line x1="12" y1="4" x2="12" y2="1" />
                <line x1="17" y1="8" x2="20" y2="6" />
                <line x1="7" y1="8" x2="4" y2="6" />
              </svg>
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
                className="inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-xs font-medium text-muted hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2"
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
      </motion.header>

      {showConfirm && (
        <div ref={modalRef} className="fixed inset-0 z-[100] flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => { setShowConfirm(false); triggerRef.current?.focus(); }} />
          <div className="relative bg-card border border-border rounded-2xl shadow-xl p-6 sm:p-8 max-w-sm mx-4 w-full">
            <h3 id="confirm-title" className="font-serif text-xl font-semibold text-foreground mb-2">Nuevo perfil</h3>
            <p className="text-sm text-muted mb-6">Se eliminará el perfil actual. Podés crear uno nuevo después.</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => { setShowConfirm(false); triggerRef.current?.focus(); }} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all px-4 py-3 text-sm bg-transparent text-foreground border border-border hover:bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2">
                Cancelar
              </button>
              <button type="button" onClick={confirmNewProfile} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all px-4 py-3 text-sm bg-primary text-primary-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2">
                Crear nuevo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
