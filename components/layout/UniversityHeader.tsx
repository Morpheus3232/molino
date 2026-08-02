"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { hasStoredProfile, clearStoredProfile } from "@/lib/session/localStorage";
import { Menu, X } from "lucide-react";
import { primaryNavLinks, secondaryNavLinks, knowledgeNavLinks } from "@/lib/data/navigation";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";

export default function UniversityHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [hasProfile, setHasProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const isNavLinkActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  // useLayoutEffect (not useEffect) so hasProfile resolves before the browser
  // paints the hydrated frame, avoiding a visible header CTA flash for returning users.
  useLayoutEffect(() => {
    setHasProfile(hasStoredProfile());
    const refresh = () => setHasProfile(hasStoredProfile());
    window.addEventListener("molino-profile-created", refresh);
    window.addEventListener("molino-profile-cleared", refresh);
    return () => {
      window.removeEventListener("molino-profile-created", refresh);
      window.removeEventListener("molino-profile-cleared", refresh);
    };
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showConfirm) {
          setShowConfirm(false);
          triggerRef.current?.focus();
        }
        setMenuOpen(false);
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
    router.push("/onboarding");
  }, [router]);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 bg-background transition-shadow duration-300 ${
          scrolled ? "border-b border-ink/10" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center group" aria-label="Molino — Ir al inicio">
            <span className="inline-flex h-10 w-10 items-center justify-center bg-background text-foreground border border-ink/10">
              <Logo className="w-6 h-6" />
            </span>
          </Link>

          {/* Primaria: solo lo que se usa a diario. Todo lo demás vive en el menú. */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Navegación principal">
            {primaryNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-mono font-semibold tracking-[0.15em] uppercase transition-colors hover:text-accent ${
                  isNavLinkActive(link.href) ? "text-foreground" : "text-muted"
                }`}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {hasProfile ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/profile"
                  className="inline-flex items-center justify-center px-4 py-2 text-xs font-mono font-semibold tracking-[0.15em] uppercase bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
                >
                  MI MAPA
                </Link>
              </div>
            ) : (
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center px-3 sm:px-4 py-2 text-xs font-mono font-semibold tracking-[0.1em] sm:tracking-[0.15em] uppercase bg-accent text-accent-foreground hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                <span className="sm:hidden">MI MAPA</span>
                <span className="hidden sm:inline">DESCUBRIR MI MAPA</span>
              </Link>
            )}

            {/* Menú — único, disponible en todos los tamaños (antes había dos
                implementaciones paralelas: una fila desktop y un panel mobile). */}
            <button
              type="button"
              className="p-2 text-muted hover:text-foreground hover:bg-ink/5 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="main-menu"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menú expandido */}
        <motion.div
          id="main-menu"
          className="overflow-hidden border-t border-ink/10 bg-background"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: menuOpen ? 1 : 0, height: menuOpen ? "auto" : 0 }}
          transition={{ duration: 0.2 }}
        >
          <nav className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 py-6 grid grid-cols-1 sm:grid-cols-3 gap-8" aria-label="Menú">
            <div className="space-y-1">
              <p className="font-mono text-[0.65rem] tracking-[0.2em] text-muted uppercase mb-3">Explorar</p>
              {[...primaryNavLinks, ...secondaryNavLinks].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2 -mx-3 text-sm transition-colors ${
                    isNavLinkActive(link.href) ? "text-accent" : "text-foreground hover:text-accent"
                  }`}
                  aria-current={pathname === link.href ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="space-y-1">
              <p className="font-mono text-[0.65rem] tracking-[0.2em] text-muted uppercase mb-3">Conocimiento</p>
              {knowledgeNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2 -mx-3 text-sm transition-colors ${
                    isNavLinkActive(link.href) ? "text-accent" : "text-foreground hover:text-accent"
                  }`}
                  aria-current={pathname === link.href ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="space-y-1">
              <p className="font-mono text-[0.65rem] tracking-[0.2em] text-muted uppercase mb-3">Mi mapa</p>
              {hasProfile ? (
                <>
                  <Link
                    href="/profile"
                    className={`block px-3 py-2 -mx-3 text-sm transition-colors sm:hidden ${
                      isNavLinkActive("/profile") ? "text-accent" : "text-foreground hover:text-accent"
                    }`}
                    aria-current={pathname === "/profile" ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                  >
                    Mi mapa
                  </Link>
                  <button
                    type="button"
                    onClick={handleNewProfile}
                    className="block w-full text-left px-3 py-2 -mx-3 text-sm text-muted hover:text-foreground transition-colors"
                  >
                    Crear nuevo perfil
                  </button>
                </>
              ) : (
                <Link
                  href="/onboarding"
                  className="inline-flex items-center justify-center px-4 py-2 text-xs font-mono font-semibold tracking-[0.15em] uppercase bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
                  onClick={() => setMenuOpen(false)}
                >
                  DESCUBRIR MI MAPA
                </Link>
              )}
            </div>
          </nav>
        </motion.div>
      </motion.header>

      <AnimatePresence>
        {showConfirm && (
          <div ref={modalRef} className="fixed inset-0 z-[100] flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
            <motion.div
              className="absolute inset-0 bg-ink/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15, ease: "easeOut" } }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={() => { setShowConfirm(false); triggerRef.current?.focus(); }}
            />
            <motion.div
              className="relative bg-background border border-ink/10 p-8 sm:p-10 max-w-sm mx-4 w-full"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15, ease: "easeOut" } }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <h3 id="confirm-title" className="font-display text-lg text-foreground mb-2 uppercase">CREAR NUEVO PERFIL</h3>
              <p className="text-sm text-muted mb-6">Se eliminará el perfil actual. Podés crear uno nuevo después.</p>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => { setShowConfirm(false); triggerRef.current?.focus(); }} className="flex-1">
                  CANCELAR
                </Button>
                <Button variant="primary" onClick={confirmNewProfile} className="flex-1">
                  CREAR NUEVO PERFIL
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
