"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { hasStoredProfile, clearStoredProfile } from "@/lib/session/localStorage";
import { Menu, X, ChevronDown, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import SavedProfilesDrawer from "@/components/profile/SavedProfilesDrawer";

/* ═══ Navegación Principal (5 esenciales) ═══ */
const PRIMARY_NAV = [
  { href: "/", label: "Inicio" },
  { href: "/profile", label: "Mi Mapa" },
  { href: "/hoy", label: "Hoy" },
  { href: "/pareja", label: "Pareja" },
  { href: "/journal", label: "Journal" },
];

/* ═══ Navegación Secundaria (Menú Explorar) ═══ */
const EXPLORE_NAV = [
  { href: "/calendario", label: "Calendario", desc: "Ciclos y vibración mensual" },
  { href: "/biblioteca", label: "Biblioteca", desc: "Fuentes clásicas y autores" },
  { href: "/academy", label: "Academia", desc: "La historia de las tradiciones simbólicas" },
  { href: "/premium", label: "Precios & Premium", desc: "Acceso y síntesis completa" },
  { href: "/blog", label: "Blog", desc: "Artículos y análisis simbólico" },
  { href: "/docs", label: "API / Docs", desc: "Endpoints para desarrolladores" },
  { href: "/atlas", label: "Atlas", desc: "Explorá tu mapa en el mundo" },
  { href: "/nosotros", label: "Nosotros", desc: "Manifiesto y código abierto" },
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
  const headerRef = useRef<HTMLElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    setMenuOpen(false);
    setExploreOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showConfirm) {
          setShowConfirm(false);
          triggerRef.current?.focus();
        }
        setMenuOpen(false);
        setExploreOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showConfirm]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) {
        setExploreOpen(false);
      }
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNewProfile = useCallback(() => {
    setShowConfirm(true);
  }, []);

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
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 bg-background transition-shadow duration-300 ${
          scrolled ? "border-b border-ink/10 shadow-sm" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="Molino — Ir al inicio">
            <span className="inline-flex h-9 w-9 items-center justify-center bg-background text-foreground border border-ink/10 rounded-xl">
              <Logo className="w-6 h-6" />
            </span>
            <span className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-foreground group-hover:text-accent transition-colors">
              Molino
            </span>
          </Link>

          {/* Desktop primary nav (5 links + Explorar dropdown) */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Navegación principal">
            {PRIMARY_NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-xs font-mono font-semibold tracking-[0.15em] uppercase transition-colors rounded-xl ${
                  isActive(link.href)
                    ? "text-foreground bg-ink/[0.06] font-bold"
                    : "text-muted hover:text-foreground hover:bg-ink/[0.02]"
                }`}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}

            {/* Explorar Dropdown Menu */}
            <div ref={exploreRef} className="relative">
              <button
                type="button"
                onClick={() => setExploreOpen(!exploreOpen)}
                className={`px-3 py-1.5 text-xs font-mono font-semibold tracking-[0.15em] uppercase transition-colors rounded-xl inline-flex items-center gap-1 ${
                  exploreOpen
                    ? "text-accent bg-accent/10"
                    : "text-muted hover:text-foreground hover:bg-ink/[0.02]"
                }`}
                aria-expanded={exploreOpen}
                aria-label="Menú explorar más secciones"
              >
                <span>Explorar</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    exploreOpen ? "rotate-180 text-accent" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {exploreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-card border border-ink/15 p-2 shadow-2xl z-50"
                  >
                    <div className="space-y-0.5">
                      {EXPLORE_NAV.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setExploreOpen(false)}
                          className={`block p-2.5 rounded-xl transition-colors ${
                            isActive(item.href)
                              ? "bg-accent/10 text-accent"
                              : "hover:bg-ink/5 text-foreground"
                          }`}
                        >
                          <span className="font-heading text-xs font-bold block">
                            {item.label}
                          </span>
                          <span className="text-[11px] font-mono text-muted block mt-0.5">
                            {item.desc}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right side: saved profiles vault & mobile hamburger */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <SavedProfilesDrawer className="!py-1 !px-2.5 !text-[11px]" />
            </div>

            <button
              type="button"
              className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-muted hover:text-foreground hover:bg-ink/5 transition-colors rounded-xl"
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
              <nav className="px-4 py-4 space-y-1 max-h-[calc(100dvh-4rem)] overflow-y-auto" aria-label="Menú móvil">
                <p className="px-3 py-1 text-[11px] font-mono tracking-[0.2em] text-muted uppercase font-bold">
                  Navegación Principal
                </p>
                {PRIMARY_NAV.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center min-h-[44px] px-3 py-2 text-sm font-medium rounded-xl transition-colors ${
                      isActive(link.href) ? "bg-accent/10 text-accent font-bold" : "text-foreground hover:text-accent"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="border-t border-ink/10 my-2" />

                <div className="px-3 py-1.5">
                  <SavedProfilesDrawer className="w-full justify-center !min-h-[44px] !py-2.5" />
                </div>

                <div className="border-t border-ink/10 my-2" />

                <p className="px-3 py-1 text-[11px] font-mono tracking-[0.2em] text-muted uppercase font-bold">
                  Explorar Más
                </p>
                {EXPLORE_NAV.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center min-h-[44px] px-3 py-1.5 text-xs text-muted hover:text-foreground transition-colors`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="border-t border-ink/10 my-2" />

                {hasProfile ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      handleNewProfile();
                    }}
                    className="flex items-center min-h-[44px] w-full text-left px-3 py-2 text-xs font-mono text-muted hover:text-rose-400 transition-colors"
                  >
                    Reiniciar perfil actual
                  </button>
                ) : (
                  <Link
                    href="/onboarding"
                    className="flex items-center justify-center min-h-[44px] mx-3 mt-2 px-4 py-2.5 text-xs font-mono font-semibold tracking-[0.2em] uppercase bg-accent text-accent-foreground hover:opacity-90 transition-opacity text-center rounded-xl"
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
          <div ref={modalRef} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
            <motion.div
              className="relative bg-card border border-ink/10 p-6 sm:p-8 max-w-sm w-full rounded-3xl shadow-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <h3 id="confirm-title" className="font-heading text-lg font-bold text-foreground mb-2">
                ¿Crear nuevo mapa?
              </h3>
              <p className="text-xs text-muted mb-6 leading-relaxed">
                Se limpiará la fecha activa. Si querés conservarla, guardala primero en tu Bóveda Local.
              </p>
              <div className="flex gap-3">
                <Button variant="ghost" size="sm" onClick={() => { setShowConfirm(false); triggerRef.current?.focus(); }} className="flex-1">
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" onClick={confirmNewProfile} className="flex-1">
                  Confirmar
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
