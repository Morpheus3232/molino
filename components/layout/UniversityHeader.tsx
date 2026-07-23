"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { hasStoredProfile } from "@/lib/storage/localStorage";

const NAV_ITEMS = [
  { href: "/profile", label: "Mi mapa" },
  { href: "/explore", label: "Explorar" },
];

const KNOWLEDGE_ITEMS = [
  { href: "/numerologia", label: "Numerología" },
  { href: "/astrologia", label: "Astrología" },
  { href: "/zodiaco-chino", label: "Zodiaco Chino" },
  { href: "/biblioteca", label: "Biblioteca" },
];

function isActive(href: string, pathname: string): boolean {
  if (href === "/profile") {
    return pathname === "/profile" || pathname.startsWith("/profile/");
  }
  if (href === "/explore") {
    return pathname === "/explore" || pathname.startsWith("/explore/");
  }
  return pathname === href;
}

function isKnowledgeActive(pathname: string): boolean {
  return KNOWLEDGE_ITEMS.some((item) => pathname === item.href || pathname.startsWith(item.href + "/"));
}

export default function UniversityHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const hasProfile = hasStoredProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [mobileMenuOpen]);

  const handleCreateProfile = () => {
    router.push("/onboarding");
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="Molino — Ir al inicio">
          <svg width="24" height="24" viewBox="0 0 64 64" className="shrink-0" aria-hidden="true">
            <rect width="64" height="64" rx="14" fill="var(--color-foreground)" />
            <text x="32" y="44" fontFamily="Georgia, serif" fontSize="36" fontWeight="700" fill="var(--color-accent)" textAnchor="middle">M</text>
          </svg>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="font-serif font-bold text-lg text-foreground tracking-tight">
              Molino
            </span>
            <span className="text-[9px] uppercase tracking-[0.15em] text-muted font-medium">
              Personal Intelligence
            </span>
          </div>
          <span className="sm:hidden font-serif font-bold text-lg text-foreground tracking-tight">
            Molino
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1" aria-label="Navegación principal">
          {hasProfile && NAV_ITEMS.map((item) => {
            const active = isActive(item.href, pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  active
                    ? "bg-foreground text-background"
                    : "text-muted hover:text-foreground hover:bg-foreground/5"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Knowledge dropdown */}
          {hasProfile && (
            <div className="relative group">
              <button
                type="button"
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  isKnowledgeActive(pathname)
                    ? "bg-foreground text-background"
                    : "text-muted hover:text-foreground hover:bg-foreground/5"
                }`}
                aria-expanded="false"
                aria-haspopup="true"
              >
                Conocimiento
              </button>
              <div className="absolute top-full left-0 mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50" role="menu">
                <div className="bg-card border border-border rounded-xl shadow-lg py-1 min-w-[180px]">
                  {KNOWLEDGE_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-4 py-2 text-sm transition-colors ${
                        pathname === item.href
                          ? "text-foreground bg-foreground/5"
                          : "text-muted hover:text-foreground hover:bg-foreground/5"
                      }`}
                      role="menuitem"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!hasProfile && (
            <button
              type="button"
              onClick={handleCreateProfile}
              className="ml-2 inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all px-4 py-1.5 text-sm bg-primary text-primary-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
            >
              Crear mi perfil
            </button>
          )}
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 sm:hidden">
          {!hasProfile && (
            <button
              type="button"
              onClick={handleCreateProfile}
              className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all px-4 py-2 text-xs min-h-[44px] bg-primary text-primary-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
              Crear perfil
            </button>
          )}
          {hasProfile && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-3 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-accent/40 rounded-lg"
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {mobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          )}
          <ThemeToggle />
        </div>

        {/* Desktop theme toggle */}
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && hasProfile && (
        <div
          id="mobile-menu"
          className="sm:hidden border-t border-border bg-background"
          role="navigation"
          aria-label="Menú móvil"
        >
          <nav className="px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href, pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-3 min-h-[44px] rounded-lg text-sm transition-colors flex items-center ${
                    active
                      ? "bg-foreground text-background"
                      : "text-muted hover:text-foreground hover:bg-foreground/5"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-3 pb-1">
              <p className="px-3 text-[11px] uppercase tracking-[0.2em] text-muted font-medium">Conocimiento</p>
            </div>
            {KNOWLEDGE_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-3 min-h-[44px] rounded-lg text-sm transition-colors flex items-center ${
                    active
                      ? "bg-foreground text-background"
                      : "text-muted hover:text-foreground hover:bg-foreground/5"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
