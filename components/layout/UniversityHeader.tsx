"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useTheme } from "next-themes";
import { hasStoredProfile, clearStoredProfile } from "@/lib/session/localStorage";
import { Menu, X, Sun, Moon } from "lucide-react";

export default function UniversityHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [hasProfile, setHasProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const currentTheme = theme === "system" ? resolvedTheme : theme;

  const toggleTheme = useCallback(() => {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  }, [currentTheme, setTheme]);

  const navLinks = [
    { href: "/", label: "INICIO" },
    { href: "/biblioteca", label: "BIBLIOTECA" },
    { href: "/filosofia", label: "FILOSOFÍA" },
    { href: "https://github.com", label: "GITHUB", external: true },
  ];

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
          scrolled ? "bg-background/90 backdrop-blur-sm border-b border-ink/10" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-8xl px-5 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center group" aria-label="Molino — Ir al inicio">
            <span className="inline-flex h-10 w-10 items-center justify-center bg-background text-foreground border border-ink/10">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
                <path d="M10 30 L8 14 L24 14 L22 30 Z" />
                <path d="M7 14 L16 7 L25 14 Z" />
                <path d="M14 30 L14 23 Q14 21 16 21 Q18 21 18 23 L18 30" />
                <circle cx="16" cy="17.5" r="1.1" />
                <motion.g
                  style={{ transformOrigin: "16px 7px" }}
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
                >
                  <line x1="0" y1="7" x2="32" y2="7" />
                  <line x1="16" y1="-3" x2="16" y2="17" />
                  <line x1="0" y1="4.5" x2="32" y2="4.5" strokeWidth="0.5" />
                  <line x1="0" y1="9.5" x2="32" y2="9.5" strokeWidth="0.5" />
                  <line x1="13" y1="-3" x2="13" y2="17" strokeWidth="0.5" />
                  <line x1="19" y1="-3" x2="19" y2="17" strokeWidth="0.5" />
                </motion.g>
              </svg>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Navegación principal">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className={`text-xs font-mono font-semibold tracking-[0.15em] uppercase transition-colors hover:text-accent ${
                  pathname === link.href ? "text-foreground" : "text-muted"
                }`}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-muted hover:text-foreground hover:bg-ink/5 transition-colors"
              aria-label={currentTheme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
            >
              {currentTheme === "dark" ? <Sun className="w-5 h-5" aria-hidden="true" /> : <Moon className="w-5 h-5" aria-hidden="true" />}
            </button>

            {hasProfile && (
              <Link
                href="/profile"
                className="hidden sm:inline-flex items-center px-4 py-2 text-xs font-mono font-semibold tracking-[0.15em] uppercase text-muted hover:text-foreground transition-colors"
                aria-current={pathname === "/profile" ? "page" : undefined}
              >
                MI MAPA
              </Link>
            )}
            {hasProfile ? (
              <button
                ref={triggerRef}
                type="button"
                onClick={handleNewProfile}
                className="inline-flex items-center justify-center border border-ink/10 px-4 py-2 text-xs font-mono font-semibold tracking-[0.15em] uppercase text-muted hover:text-foreground transition-colors"
              >
                NUEVO PERFIL
              </button>
            ) : (
              <Link
                href="/onboarding"
                className="btn-accent inline-flex items-center justify-center px-5 py-2 text-xs font-bold tracking-wider uppercase"
              >
                DESCUBRIR MI MAPA
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="lg:hidden p-2 text-muted hover:text-foreground hover:bg-ink/5 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          id="mobile-menu"
          className="lg:hidden overflow-hidden border-t border-ink/10 bg-background"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: mobileMenuOpen ? 1 : 0, height: mobileMenuOpen ? "auto" : 0 }}
          transition={{ duration: 0.2 }}
        >
          <nav className="px-5 py-4 space-y-3" aria-label="Navegación móvil">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className={`block px-3 py-2 text-xs font-mono font-semibold tracking-[0.15em] uppercase transition-colors ${
                  pathname === link.href ? "bg-accent/10 text-accent" : "text-muted hover:text-foreground hover:bg-ink/5"
                }`}
                aria-current={pathname === link.href ? "page" : undefined}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-ink/10 my-2" />
            {hasProfile ? (
              <>
                <Link
                  href="/profile"
                  className="block px-3 py-2 text-xs font-mono font-semibold tracking-[0.15em] uppercase text-muted hover:text-foreground hover:bg-ink/5 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  MI MAPA
                </Link>
                <button
                  type="button"
                  onClick={handleNewProfile}
                  className="w-full text-left px-3 py-2 text-xs font-mono font-semibold tracking-[0.15em] uppercase text-muted hover:text-foreground hover:bg-ink/5 transition-colors"
                >
                  NUEVO PERFIL
                </button>
              </>
            ) : (
              <Link
                href="/onboarding"
                className="block px-3 py-2 text-xs font-mono font-semibold tracking-[0.15em] uppercase text-center bg-accent text-white hover:bg-accent/90 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                DESCUBRIR MI MAPA
              </Link>
            )}
          </nav>
        </motion.div>
      </motion.header>

      {showConfirm && (
        <div ref={modalRef} className="fixed inset-0 z-[100] flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className="absolute inset-0 bg-ink/50" onClick={() => { setShowConfirm(false); triggerRef.current?.focus(); }} />
          <div className="relative bg-background border border-ink/10 p-8 sm:p-10 max-w-sm mx-4 w-full">
            <h3 id="confirm-title" className="font-display text-lg text-foreground mb-2 uppercase">NUEVO PERFIL</h3>
            <p className="text-sm text-muted mb-6">Se eliminará el perfil actual. Podés crear uno nuevo después.</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => { setShowConfirm(false); triggerRef.current?.focus(); }} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-mono font-semibold tracking-wider uppercase bg-transparent text-foreground border border-ink/10 hover:bg-ink/5 transition-colors">
                CANCELAR
              </button>
              <button type="button" onClick={confirmNewProfile} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-mono font-semibold tracking-wider uppercase bg-accent text-white hover:bg-accent/90 transition-colors">
                CREAR NUEVO
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
