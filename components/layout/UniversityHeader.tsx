"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { hasStoredProfile, clearStoredProfile } from "@/lib/session/localStorage";
import { Menu, X, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import SavedProfilesDrawer from "@/components/profile/SavedProfilesDrawer";

/* ═══ Navegación (todo visible, sin dropdown) ═══ */
const NAV_LINKS = [
  { href: "/hoy", label: "Hoy" },
  { href: "/atlas", label: "Atlas" },
  { href: "/biblioteca", label: "Biblioteca" },
  { href: "/academy", label: "Academia" },
  { href: "/blog", label: "Blog" },
  { href: "/journal", label: "Journal" },
  { href: "/profile", label: "Mi Mapa" },
  { href: "/calendario", label: "Calendario" },
];

export default function UniversityHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [hasProfile, setHasProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
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
  }, [pathname]);

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
    const handleClickOutside = (e: MouseEvent) => {
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
          {/* Logo — el wordmark "Molino" se esconde en el rango 1024-1279px
              para darle ese espacio al nav (9 links necesitan margen para
              quedar legibles ahí); el ícono solo ya identifica la marca. */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0" aria-label="Molino — Ir al inicio">
            <span className="inline-flex h-10 w-10 items-center justify-center bg-background text-foreground border border-ink/10 rounded-xl">
              <Logo className="w-7 h-7" />
            </span>
            <span className="hidden xl:inline font-heading text-base font-semibold uppercase tracking-[0.2em] text-foreground group-hover:text-accent transition-colors">
              Molino
            </span>
          </Link>

          {/* Desktop nav — todos los links visibles, sin dropdown, en una
              sola línea desde 1024px. Con 9 items no entra con el tracking
              ancho/padding que usaba el header viejo de 4 links — text-sm
              en vez de text-xs, medido con margen de sobra en ambos rangos. */}
          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Navegación principal">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2.5 xl:px-3 py-1.5 text-sm font-mono font-semibold tracking-[0.05em] xl:tracking-[0.12em] uppercase transition-colors rounded-xl whitespace-nowrap ${
                  isActive(link.href)
                    ? "text-foreground bg-ink/[0.06] font-bold"
                    : "text-muted hover:text-foreground hover:bg-ink/[0.02]"
                }`}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
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
                {NAV_LINKS.map((link) => (
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
