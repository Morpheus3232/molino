"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { hasStoredProfile, clearStoredProfile } from "@/lib/session/localStorage";
import { Menu, X, ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import SavedProfilesDrawer from "@/components/profile/SavedProfilesDrawer";

/* ═══ Navegación — Fase 4: CORE siempre visible, Exploración agrupada ═══
   CORE es lo que sostiene el mapa personal (mapa / ciclos / afinidades /
   contenido educativo). El resto son superficies de descubrimiento — útiles,
   pero no deberían competir en peso visual con el núcleo del producto. */
const CORE_LINKS = [
  { href: "/profile", label: "Mi Mapa" },
  { href: "/hoy", label: "Hoy" },
  { href: "/mundo", label: "Afinidades" },
  { href: "/academy", label: "Academia" },
];

const EXPLORE_LINKS = [
  { href: "/atlas", label: "Atlas" },
  { href: "/biblioteca", label: "Biblioteca" },
  { href: "/blog", label: "Blog" },
  { href: "/journal", label: "Journal" },
  { href: "/calendario", label: "Calendario" },
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
  const { scrollY } = useScroll();

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));
  const isExploreActive = EXPLORE_LINKS.some((l) => isActive(l.href));

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
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setExploreOpen(false);
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

  // La Lectura vive en su propia pestaña como un objeto autónomo — el nav
  // del sitio rompe esa sensación de "testamento que se despliega solo".
  if (pathname.startsWith("/lectura")) return null;

  return (
    <>
      <motion.header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 bg-background transition-shadow duration-300 ${
          scrolled ? "border-b border-ink/10 shadow-sm" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          {/* Logo — con el nav reducido a 4 items CORE + "Explorar", el
              wordmark ya entra cómodo desde el primer breakpoint donde el
              nav aparece (antes se ocultaba hasta 1280px para hacerle
              lugar a 9 links). */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0" aria-label="Ir al inicio">
            <span className="inline-flex h-10 w-10 items-center justify-center bg-background text-foreground border border-ink/10 rounded-xl">
              <Logo className="w-7 h-7" />
            </span>
            <span className="hidden sm:inline font-heading text-base font-semibold uppercase tracking-[0.2em] text-foreground group-hover:text-accent transition-colors">
              Molino
            </span>
          </Link>

          {/* Desktop nav — 4 items CORE con peso completo, + un único
              punto de entrada "Explorar" para el ecosistema (Atlas,
              Biblioteca, Blog, Journal, Calendario). Menos nodos, misma
              cantidad de rutas alcanzables. */}
          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Navegación principal">
            {CORE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-sm font-mono font-semibold tracking-[0.08em] uppercase transition-colors rounded-xl whitespace-nowrap ${
                  isActive(link.href)
                    ? "text-foreground bg-ink/[0.06] font-bold"
                    : "text-muted hover:text-foreground hover:bg-ink/[0.02]"
                }`}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}

            <div className="relative">
              <button
                type="button"
                onClick={() => setExploreOpen((v) => !v)}
                aria-expanded={exploreOpen}
                aria-haspopup="true"
                aria-controls="explore-menu"
                className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-mono font-semibold tracking-[0.08em] uppercase transition-colors rounded-xl whitespace-nowrap ${
                  isExploreActive
                    ? "text-foreground bg-ink/[0.06] font-bold"
                    : "text-muted hover:text-foreground hover:bg-ink/[0.02]"
                }`}
              >
                Explorar
                <ChevronDown
                  aria-hidden="true"
                  className={`w-3.5 h-3.5 transition-transform ${exploreOpen ? "rotate-180" : ""}`}
                />
              </button>

              {exploreOpen && (
                <div
                  id="explore-menu"
                  className="absolute top-full right-0 mt-2 w-48 py-1.5 rounded-xl border border-ink/10 bg-background shadow-lg"
                >
                  {EXPLORE_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setExploreOpen(false)}
                      className={`block px-4 py-2 text-sm transition-colors ${
                        isActive(link.href)
                          ? "text-accent font-semibold bg-ink/[0.03]"
                          : "text-foreground hover:bg-ink/[0.04] hover:text-accent"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right side: saved profiles vault & mobile hamburger */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <SavedProfilesDrawer compact className="!py-1 !px-2.5 !text-[11px]" />
            </div>

            <button
              type="button"
              className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-muted hover:text-foreground hover:bg-ink/5 transition-colors rounded-xl"
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
        <div>
          {menuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-t border-ink/10 bg-background"
            >
              <nav className="px-4 py-4 space-y-1 max-h-[calc(100dvh-4rem)] overflow-y-auto" aria-label="Menú móvil">
                {CORE_LINKS.map((link) => (
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

                <p className="px-3 pt-4 pb-1 text-[11px] font-mono uppercase tracking-[0.15em] text-muted/70">
                  Explorar
                </p>
                {EXPLORE_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center min-h-[44px] px-3 py-2 text-sm font-medium rounded-xl transition-colors ${
                      isActive(link.href) ? "bg-accent/10 text-accent font-bold" : "text-foreground/80 hover:text-accent"
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
        </div>
      </motion.header>

      {/* Confirm new profile modal */}
      <div>
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
      </div>
    </>
  );
}
