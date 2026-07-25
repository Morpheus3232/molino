"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { hasStoredProfile, clearStoredProfile } from "@/lib/storage/localStorage";

const NAV_GROUPS = [
  {
    label: "Descubrir",
    items: [
      { href: "/explore", label: "Explorar" },
      { href: "/affinity", label: "Afinidad Simb\u00f3lica" },
      { href: "/conocimiento/numerologia", label: "Numerolog\u00eda" },
      { href: "/conocimiento/astrologia", label: "Astrolog\u00eda" },
      { href: "/conocimiento/zodiaco-chino", label: "Zod\u00edaco Chino" },
      { href: "/conocimiento/fuentes", label: "Fuentes" },
    ],
  },
  {
    label: "Relacionarte",
    items: [
      { href: "/compatibility/countries", label: "Pa\u00edses" },
      { href: "/compatibility/brands", label: "Marcas" },
    ],
  },
  {
    label: "Orientarte",
    items: [
      { href: "/timing", label: "Timing" },
      { href: "/decisions", label: "Decisiones" },
      { href: "/daily-energy", label: "Energ\u00eda diaria" },
      { href: "/herramientas", label: "Herramientas" },
    ],
  },
];

function isGroupActive(group: typeof NAV_GROUPS[0], pathname: string): boolean {
  return group.items.some(item =>
    pathname === item.href || pathname.startsWith(item.href + "/")
  );
}

export default function UniversityHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const hasProfile = hasStoredProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMobileMenuOpen(false); setShowConfirm(false); }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleNewProfile = useCallback(() => { setShowConfirm(true); }, []);

  const confirmNewProfile = useCallback(() => {
    clearStoredProfile();
    setShowConfirm(false);
    window.dispatchEvent(new Event("molino-profile-cleared"));
    router.push("/");
  }, [router]);

  const isOnHome = pathname === "/";

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="Molino \u2014 Ir al inicio">
            <svg width="24" height="24" viewBox="0 0 64 64" className="shrink-0" aria-hidden="true">
              <rect width="64" height="64" rx="14" fill="var(--color-foreground)" />
              <text x="32" y="44" fontFamily="Georgia, serif" fontSize="36" fontWeight="700" fill="var(--color-accent)" textAnchor="middle">M</text>
            </svg>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-serif font-bold text-lg text-foreground tracking-tight">Molino</span>
              <span className="text-[9px] uppercase tracking-[0.15em] text-muted font-medium">Inteligencia Personal</span>
            </div>
            <span className="sm:hidden font-serif font-bold text-lg text-foreground tracking-tight">Molino</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Navegaci\u00f3n principal">
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="relative group">
                <button type="button" className={`px-3 py-1.5 rounded-full text-sm transition-all ${(isOnHome && group.label === "Descubrir") || isGroupActive(group, pathname) ? "bg-foreground text-background" : "text-muted hover:text-foreground hover:bg-foreground/5"}`}>
                  {group.label}
                </button>
                <div className="absolute top-full left-0 mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50" role="menu">
                  <div className="bg-card border border-border rounded-xl shadow-lg py-1 min-w-[200px]">
                    {group.label === "Descubrir" && (
                      <Link href="/" className={`block px-4 py-2 text-sm transition-colors ${isOnHome ? "text-foreground bg-foreground/5" : "text-muted hover:text-foreground hover:bg-foreground/5"}`} role="menuitem">Inicio</Link>
                    )}
                    {group.items.map((item) => (
                      <Link key={item.href} href={item.href} className={`block px-4 py-2 text-sm transition-colors ${pathname === item.href ? "text-foreground bg-foreground/5" : "text-muted hover:text-foreground hover:bg-foreground/5"}`} role="menuitem">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Separator */}
            <div className="w-px h-4 bg-border mx-1" aria-hidden="true" />

            {/* Mi mapa */}
            <Link href={hasProfile ? "/profile" : "/onboarding"} className={`px-3 py-1.5 rounded-full text-sm transition-all ${pathname === "/profile" ? "bg-foreground text-background" : "text-muted hover:text-foreground hover:bg-foreground/5"}`} aria-current={pathname === "/profile" ? "page" : undefined}>
              Mi mapa
            </Link>

            {/* CTA */}
            {hasProfile && (
              <button type="button" onClick={handleNewProfile} className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all px-3 py-1.5 text-xs text-muted hover:text-foreground hover:bg-foreground/5 border border-border">
                Nuevo perfil
              </button>
            )}
            {!hasProfile && (
              <Link href="/onboarding" className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all px-4 py-1.5 text-sm bg-primary text-primary-foreground shadow-sm hover:bg-accent hover:text-accent-foreground">
                Crear mi perfil
              </Link>
            )}
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-3 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-accent/40 rounded-lg" aria-label={mobileMenuOpen ? "Cerrar men\u00fa" : "Abrir men\u00fa"} aria-expanded={mobileMenuOpen} aria-controls="mobile-menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {mobileMenuOpen ? (<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>) : (<><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>)}
              </svg>
            </button>
            <ThemeToggle />
          </div>

          <div className="hidden lg:block"><ThemeToggle /></div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="lg:hidden border-t border-border bg-background" role="navigation" aria-label="Men\u00fa m\u00f3vil">
            <nav className="px-4 py-3 space-y-1">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-3 min-h-[44px] rounded-lg text-sm transition-colors flex items-center ${isOnHome ? "bg-foreground text-background" : "text-muted hover:text-foreground hover:bg-foreground/5"}`}>
                Inicio
              </Link>
              <Link href={hasProfile ? "/profile" : "/onboarding"} onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-3 min-h-[44px] rounded-lg text-sm font-medium transition-colors flex items-center ${pathname === "/profile" ? "bg-foreground text-background" : "text-muted hover:text-foreground hover:bg-foreground/5"}`}>
                Mi mapa
              </Link>

              {NAV_GROUPS.map((group) => (
                <div key={group.label}>
                  <div className="pt-3 pb-1"><p className="px-3 text-[11px] uppercase tracking-[0.2em] text-muted font-medium">{group.label}</p></div>
                  {group.items.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-3 min-h-[44px] rounded-lg text-sm transition-colors flex items-center ${pathname === item.href ? "bg-foreground text-background" : "text-muted hover:text-foreground hover:bg-foreground/5"}`}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              ))}

              <div className="pt-4 border-t border-border mt-2">
                {hasProfile ? (
                  <button type="button" onClick={() => { setMobileMenuOpen(false); handleNewProfile(); }} className="w-full text-left px-3 py-3 min-h-[44px] rounded-lg text-sm text-muted hover:text-foreground hover:bg-foreground/5 transition-colors flex items-center">
                    Nuevo perfil
                  </button>
                ) : (
                  <Link href="/onboarding" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 min-h-[44px] rounded-lg text-sm font-medium text-foreground bg-foreground/5 transition-colors flex items-center">
                    Crear mi perfil
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-card border border-border rounded-2xl shadow-xl p-6 sm:p-8 max-w-sm mx-4 w-full">
            <h3 id="confirm-title" className="font-serif text-xl font-semibold text-foreground mb-2">Nuevo perfil</h3>
            <p className="text-sm text-muted mb-6">Se eliminar\u00e1 el perfil actual. Pod\u00e9s crear uno nuevo despu\u00e9s.</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowConfirm(false)} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all px-4 py-3 text-sm bg-transparent text-foreground border border-border hover:bg-foreground/5">
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
