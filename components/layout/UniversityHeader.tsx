"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { hasStoredProfile, clearStoredProfile } from "@/lib/session/localStorage";
import { Menu, X, ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";

/* ═══ Sitio: siempre visibles, en desktop y mobile ═══ */
const SITE_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/ejemplo", label: "Ejemplo" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/#faq", label: "FAQ" },
];

/* ═══ Primary: siempre visibles en desktop ═══ */
const PRIMARY = [
  { href: "/profile", label: "Mi mapa" },
  { href: "/hoy", label: "Energía de hoy" },
];

/* ═══ Secondary: dentro del dropdown "Explorar" ═══ */
const EXPLORE_ITEMS = [
  { href: "/affinity", label: "[PERSON_NAME]" },
  { href: "/evolution", label: "Tu evolución" },
  { href: "/explore", label: "Explorar sistemas" },
];

export default function UniversityHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [hasProfile, setHasProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

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

  useEffect(() => { setMenuOpen(false); setExploreOpen(false); }, [pathname]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showConfirm) { setShowConfirm(false); triggerRef.current?.focus(); }
        setMenuOpen(false);
        setExploreOpen(false);
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
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last?.focus(); } }
      else { if (document.activeElement === last) { e.preventDefault(); first?.focus(); } }
    };
    modal.addEventListener("keydown", handleTab);
    return () => modal.removeEventListener("keydown", handleTab);
  }, [showConfirm]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setExploreOpen(false);
      }
    };
    if (exploreOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [exploreOpen]);

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
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="Molino — Ir al inicio">
            <span className="inline-flex h-9 w-9 items-center justify-center bg-background text-foreground border border-ink/10">
              <Logo className="w-6 h-6" />
            </span>
            <span className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-foreground group-hover:text-accent transition-colors">
              Molino
            </span>
          </Link>

          {/* Desktop primary nav + dropdown */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navegación principal">
            {SITE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-xs font-mono font-semibold tracking-[0.2em] uppercase transition-colors rounded-sm ${
                  isActive(link.href)
                    ? "text-foreground bg-ink/[0.04]"
                    : "text-muted hover:text-foreground"
                }`}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}

            <div className="w-px h-4 bg-ink/10 mx-1" aria-hidden="true" />

            {PRIMARY.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-xs font-mono font-semibold tracking-[0.2em] uppercase transition-colors rounded-sm ${
                  isActive(link.href)
                    ? "text-foreground bg-ink/[0.04]"
                    : "text-muted hover:text-foreground"
                }`}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}

            {/* Explorar dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setExploreOpen(!exploreOpen)}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-semibold tracking-[0.2em] uppercase transition-colors rounded-sm ${
                  EXPLORE_ITEMS.some((item) => isActive(item.href))
                    ? "text-foreground bg-ink/[0.04]"
                    : "text-muted hover:text-foreground"
                }`}
                aria-expanded={exploreOpen}
                aria-haspopup="true"
              >
                Explorar
                <ChevronDown aria-hidden="true" focusable="false" className={`w-3 h-3 transition-transform ${exploreOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {exploreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 w-48 bg-background border border-ink/10 shadow-lg py-1 z-50"
                  >
                    {EXPLORE_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          isActive(item.href)
                            ? "text-accent bg-accent/5"
                            : "text-foreground hover:text-accent hover:bg-ink/[0.02]"
                        }`}
                        onClick={() => setExploreOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right side: mobile hamburger */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="md:hidden p-2 text-muted hover:text-foreground hover:bg-ink/5 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {menuOpen ? <X aria-hidden="true" focusable="false" className="w-5 h-5" /> : <Menu aria-hidden="true" focusable="false" className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-ink/10 bg-background"
            >
              <nav className="px-4 py-4 space-y-1" aria-label="Menú móvil">
                {SITE_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive(link.href) ? "text-accent" : "text-foreground hover:text-accent"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="border-t border-ink/10 my-2" />

                <p className="px-3 py-1.5 text-xs font-mono tracking-[0.2em] text-muted uppercase">Tu mapa</p>
                {PRIMARY.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-3 py-2.5 text-sm transition-colors ${
                      isActive(link.href) ? "text-accent" : "text-foreground hover:text-accent"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="border-t border-ink/10 my-2" />

                <p className="px-3 py-1.5 text-xs font-mono tracking-[0.2em] text-muted uppercase">Explorar</p>
                {EXPLORE_ITEMS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-3 py-2.5 text-sm transition-colors ${
                      isActive(link.href) ? "text-accent" : "text-foreground hover:text-accent"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="border-t border-ink/10 my-2" />

                {hasProfile ? (
                  <>
                    <Link
                      href="/profile"
                      className={`block px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive("/profile") ? "text-accent" : "text-foreground hover:text-accent"
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      Mi mapa
                    </Link>
                    <button
                      type="button"
                      onClick={() => { setMenuOpen(false); handleNewProfile(); }}
                      className="block w-full text-left px-3 py-2.5 text-sm text-muted hover:text-foreground transition-colors"
                    >
                      Crear nuevo perfil
                    </button>
                  </>
                ) : (
                  <Link
                    href="/onboarding"
                    className="block mx-3 mt-2 px-4 py-2.5 text-xs font-mono font-semibold tracking-[0.2em] uppercase bg-accent text-accent-foreground hover:opacity-90 transition-opacity text-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    CREAR MI MAPA
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Confirm new profile modal */}
      <AnimatePresence>
        {showConfirm && (
          <div ref={modalRef} className="fixed inset-0 z-[100] flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
            <motion.div
              className="absolute inset-0 bg-ink/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.2 }}
              onClick={() => { setShowConfirm(false); triggerRef.current?.focus(); }}
            />
            <motion.div
              className="relative bg-background border border-ink/10 p-8 sm:p-10 max-w-sm mx-4 w-full"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.2 }}
            >
              <h3 id="confirm-title" className="font-heading text-lg text-foreground mb-2 uppercase">CREAR NUEVO PERFIL</h3>
              <p className="text-sm text-muted mb-6">Se eliminará el perfil actual. Podés crear uno nuevo después.</p>
              <div className="flex flex-col sm:flex-row gap-3">
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