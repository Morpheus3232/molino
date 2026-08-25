"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { hasStoredProfile, clearStoredProfile, loadProfileFromStorage } from "@/lib/session/localStorage";
import { getSavedProfilesVault } from "@/lib/session/multiProfiles";
import { getPremiumTokenClient } from "@/lib/premium";
import { encodeProfileData } from "@/lib/utils/profileShare";
import type { UserProfile } from "@/types/user";
import { Menu, X, ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import SavedProfilesDrawer from "@/components/profile/SavedProfilesDrawer";

/* ═══ Navegación — Fase 5: header contextual según haya o no perfil activo ═══
   Sin perfil el sitio ofrece exploración general; con perfil, el nav habla
   en primera persona sobre el contenido del usuario (Mi Mapa, Mis
   Afinidades, Mi Tiempo, Mi Journal, Mis Mapas) y el contenido general se
   repliega a un único punto de entrada "Explorar". Mismas rutas reales de
   siempre — esto es reorganización de navegación, no una superficie nueva. */

interface NavLink {
  href: string;
  label: string;
}

interface NavGroup {
  heading?: string;
  links: NavLink[];
}

const NO_PROFILE_LINKS: NavLink[] = [
  { href: "/atlas", label: "Atlas" },
  { href: "/hoy", label: "Hoy" },
  { href: "/calendario", label: "Calendario" },
  { href: "/journal", label: "Journal" },
];

const MODES_LINKS: NavLink[] = [
  { href: "/socios", label: "Modo Socios" },
  { href: "/pareja", label: "Modo Parejas" },
];

// "Aprender" difiere apenas por perfil: sin perfil, Atlas ya es un link CORE
// (no se duplica acá); con perfil, Atlas deja de ser CORE y entra a Explorar.
const LEARN_LINKS_NO_PROFILE: NavLink[] = [
  { href: "/academy", label: "Academia" },
  { href: "/biblioteca", label: "Biblioteca" },
  { href: "/blog", label: "Blog" },
];

const LEARN_LINKS_WITH_PROFILE: NavLink[] = [
  { href: "/academy", label: "Academia" },
  { href: "/atlas", label: "Atlas" },
  { href: "/biblioteca", label: "Biblioteca" },
  { href: "/blog", label: "Blog" },
];

const EXPLORE_GROUPS_NO_PROFILE: NavGroup[] = [
  { heading: "Modos", links: MODES_LINKS },
  { heading: "Aprender", links: LEARN_LINKS_NO_PROFILE },
];

const EXPLORE_GROUPS_WITH_PROFILE: NavGroup[] = [
  { heading: "Aprender", links: LEARN_LINKS_WITH_PROFILE },
  { heading: "Modos", links: MODES_LINKS },
];

// Categorías reales de /affinity/[type] — mismas 7 que generateStaticParams
// en app/affinity/[type]/page.tsx. No se agrega ninguna que no tenga ruta.
const AFFINITY_GROUPS: NavGroup[] = [
  {
    heading: "Afinidades",
    links: [
      { href: "/affinity/country", label: "Países" },
      { href: "/affinity/city", label: "Ciudades" },
      { href: "/affinity/brand", label: "Marcas" },
      { href: "/affinity/university", label: "Universidades" },
      { href: "/affinity/artist", label: "Famosos" },
      { href: "/affinity/movie", label: "Películas" },
      { href: "/affinity/team", label: "Equipos" },
    ],
  },
];

// Mes → /calendario (vista mensual real) y Año → /evolution ("de dónde
// venís, dónde estás y qué ciclo se abre" — la única ruta real centrada en
// el arco temporal largo). No existe una ruta /mes ni /año dedicada.
const TIME_GROUPS: NavGroup[] = [
  {
    links: [
      { href: "/hoy", label: "Hoy" },
      { href: "/semana", label: "Semana" },
      { href: "/calendario", label: "Mes" },
      { href: "/evolution", label: "Año" },
    ],
  },
];

type MenuId = "explore" | "affinities" | "time";

export default function UniversityHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [hasProfile, setHasProfile] = useState(false);
  const [vaultCount, setVaultCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [lecturaHref, setLecturaHref] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));
  const isGroupActive = (groups: NavGroup[]) =>
    groups.some((g) => g.links.some((l) => isActive(l.href)));

  const toggleMenu = (id: MenuId) => setOpenMenu((v) => (v === id ? null : id));

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  // hasProfile arranca en `false` tanto en SSR como en el primer render
  // cliente (determinista, sin mismatch de hidratación) y se corrige en
  // useLayoutEffect antes del paint — mismo patrón que ya usaba este header.
  // saveProfileToStorage/clearStoredProfile (lib/session/localStorage.ts)
  // son el único choke point de escritura del perfil, así que estos dos
  // eventos cubren crear, cargar un perfil guardado, cambiar de perfil y
  // eliminarlo — sin un segundo estado global.
  // "Mis Mapas" solo tiene sentido una vez que hay algo guardado — antes el
  // label ya distinguía "Guardar mi mapa" vs "Mis Mapas" pero lo hacía según
  // hasProfile, no según la bóveda real, así que alguien con un perfil activo
  // pero cero mapas guardados igual veía "Mis Mapas". `isPremium` habilita el
  // atajo dorado al mapa reciente (ver SavedProfilesDrawer) y el link "Mi
  // Lectura", cuyo href necesita el perfil completo (la lectura vive en
  // /lectura#<hash>, nunca en query string). Un solo efecto: los cuatro
  // eventos comparten el mismo choke point de escritura
  // (saveProfileToStorage/clearStoredProfile, saveProfileToVault,
  // savePremiumTokenClient) así que cualquiera de ellos puede volver
  // desactualizado a los otros tres.
  useLayoutEffect(() => {
    const refresh = () => {
      setHasProfile(hasStoredProfile());
      setVaultCount(getSavedProfilesVault().length);
      const premium = !!getPremiumTokenClient();
      setIsPremium(premium);
      const profile = premium ? loadProfileFromStorage() : null;
      setLecturaHref(profile ? `/lectura#${encodeProfileData(profile as UserProfile)}` : null);
    };
    refresh();
    window.addEventListener("molino-profile-created", refresh);
    window.addEventListener("molino-profile-cleared", refresh);
    window.addEventListener("molino-vault-updated", refresh);
    window.addEventListener("molino-premium-updated", refresh);
    return () => {
      window.removeEventListener("molino-profile-created", refresh);
      window.removeEventListener("molino-profile-cleared", refresh);
      window.removeEventListener("molino-vault-updated", refresh);
      window.removeEventListener("molino-premium-updated", refresh);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showConfirm) {
          setShowConfirm(false);
          triggerRef.current?.focus();
        }
        setMenuOpen(false);
        setOpenMenu(null);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showConfirm]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setOpenMenu(null);
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
    router.push("/onboarding");
  }, [router]);

  // La Lectura vive en su propia pestaña como un objeto autónomo — el nav
  // del sitio rompe esa sensación de "testamento que se despliega solo".
  if (pathname.startsWith("/lectura")) return null;

  const exploreGroups = hasProfile ? EXPLORE_GROUPS_WITH_PROFILE : EXPLORE_GROUPS_NO_PROFILE;
  // "Mis Mapas" solo cuando ya hay algo guardado en la bóveda — antes se
  // mostraba con solo tener un perfil activo, aunque nunca se hubiera
  // guardado nada.
  const vaultLabel = vaultCount > 0 ? "Mis Mapas" : "Guardar mi mapa";

  const navButtonClass = (active: boolean) =>
    `px-3 py-1.5 text-sm font-mono font-semibold tracking-[0.08em] uppercase transition-colors rounded-xl whitespace-nowrap ${
      active
        ? "text-foreground bg-ink/[0.06] font-bold"
        : "text-muted hover:text-foreground hover:bg-ink/[0.02]"
    }`;

  return (
    <>
      <motion.header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 bg-background transition-shadow duration-300 ${
          scrolled ? "border-b border-ink/10 shadow-sm" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0" aria-label="Ir al inicio">
            <span className="inline-flex h-10 w-10 items-center justify-center bg-background text-foreground border border-ink/10 rounded-xl">
              <Logo className="w-7 h-7" />
            </span>
            <span className="hidden sm:inline font-heading text-base font-semibold uppercase tracking-[0.2em] text-foreground group-hover:text-accent transition-colors">
              Molino
            </span>
          </Link>

          {/* Desktop nav — mismo orden en ambos estados: perfil (o su
              ausencia) define de qué habla el nav, no cuántos ítems tiene. */}
          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Navegación principal">
            {!hasProfile ? (
              <>
                {NO_PROFILE_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={navButtonClass(isActive(link.href))}
                    aria-current={pathname === link.href ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
                <NavDropdown
                  id="explore"
                  label="Explorar"
                  groups={exploreGroups}
                  isOpen={openMenu === "explore"}
                  isActive={isGroupActive(exploreGroups)}
                  onToggle={() => toggleMenu("explore")}
                  isActiveLink={isActive}
                />
                <SavedProfilesDrawer label={vaultLabel} premiumShortcut={isPremium} className={navButtonClass(false)} />
              </>
            ) : (
              <>
                <Link
                  href="/profile"
                  className={navButtonClass(isActive("/profile"))}
                  aria-current={pathname === "/profile" ? "page" : undefined}
                >
                  Mi Mapa
                </Link>
                <NavDropdown
                  id="affinities"
                  label="Mis Afinidades"
                  groups={AFFINITY_GROUPS}
                  isOpen={openMenu === "affinities"}
                  isActive={isGroupActive(AFFINITY_GROUPS)}
                  onToggle={() => toggleMenu("affinities")}
                  isActiveLink={isActive}
                />
                <NavDropdown
                  id="time"
                  label="Mi Tiempo"
                  groups={TIME_GROUPS}
                  isOpen={openMenu === "time"}
                  isActive={isGroupActive(TIME_GROUPS)}
                  onToggle={() => toggleMenu("time")}
                  isActiveLink={isActive}
                />
                <Link
                  href="/journal"
                  className={navButtonClass(isActive("/journal"))}
                  aria-current={pathname === "/journal" ? "page" : undefined}
                >
                  Mi Journal
                </Link>
                {/* Solo para quien ya pagó o canjeó un cupón — mismo criterio
                    que el atajo dorado de Mis Mapas (getPremiumTokenClient). */}
                {lecturaHref && (
                  <Link
                    href={lecturaHref}
                    className="px-3 py-1.5 text-sm font-mono font-semibold tracking-[0.08em] uppercase rounded-xl whitespace-nowrap text-gold/80 hover:text-gold hover:bg-ink/[0.02] transition-colors"
                  >
                    Mi Lectura
                  </Link>
                )}
                <SavedProfilesDrawer label={vaultLabel} premiumShortcut={isPremium} className={navButtonClass(false)} />
                <NavDropdown
                  id="explore"
                  label="Explorar"
                  groups={exploreGroups}
                  isOpen={openMenu === "explore"}
                  isActive={isGroupActive(exploreGroups)}
                  onToggle={() => toggleMenu("explore")}
                  isActiveLink={isActive}
                />
              </>
            )}
          </nav>

          <div className="flex items-center gap-2">
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

        {/* Mobile menu — mismo orden que el desktop, agrupado en vez de
            comprimido: cada dropdown se aplana a una sección con su
            encabezado, nunca una fila de 15 links sueltos. */}
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
                {!hasProfile ? (
                  <>
                    {NO_PROFILE_LINKS.map((link) => (
                      <MobileLink key={link.href} link={link} isActive={isActive} onClick={() => setMenuOpen(false)} />
                    ))}
                    <MobileGroups groups={exploreGroups} heading="Explorar" isActive={isActive} onNavigate={() => setMenuOpen(false)} />
                    <div className="px-3 py-1.5">
                      <SavedProfilesDrawer label={vaultLabel} premiumShortcut={isPremium} className="w-full justify-center !min-h-[44px] !py-2.5" />
                    </div>
                  </>
                ) : (
                  <>
                    <MobileLink link={{ href: "/profile", label: "Mi Mapa" }} isActive={isActive} onClick={() => setMenuOpen(false)} />
                    <MobileGroups groups={AFFINITY_GROUPS} heading="Mis Afinidades" isActive={isActive} onNavigate={() => setMenuOpen(false)} />
                    <MobileGroups groups={TIME_GROUPS} heading="Mi Tiempo" isActive={isActive} onNavigate={() => setMenuOpen(false)} />
                    <MobileLink link={{ href: "/journal", label: "Mi Journal" }} isActive={isActive} onClick={() => setMenuOpen(false)} />
                    {lecturaHref && (
                      <Link
                        href={lecturaHref}
                        className="flex items-center min-h-[44px] px-3 py-2 text-sm font-medium rounded-xl transition-colors text-gold/80 hover:text-gold"
                        onClick={() => setMenuOpen(false)}
                      >
                        Mi Lectura
                      </Link>
                    )}
                    <div className="px-3 py-1.5">
                      <SavedProfilesDrawer label={vaultLabel} premiumShortcut={isPremium} className="w-full justify-center !min-h-[44px] !py-2.5" />
                    </div>
                    <MobileGroups groups={exploreGroups} heading="Explorar" isActive={isActive} onNavigate={() => setMenuOpen(false)} />
                  </>
                )}

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
                Se limpiará la fecha activa. Si querés conservarla, guardala primero en Mis Mapas.
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

/** Dropdown de desktop — un solo patrón de accesibilidad (aria-expanded,
 * aria-haspopup, cierre por Escape/click-afuera ya cubiertos por los
 * listeners globales del header) reutilizado por Explorar / Mis Afinidades
 * / Mi Tiempo en vez de tres implementaciones separadas. */
function NavDropdown({
  id,
  label,
  groups,
  isOpen,
  isActive,
  onToggle,
  isActiveLink,
}: {
  id: string;
  label: string;
  groups: NavGroup[];
  isOpen: boolean;
  isActive: boolean;
  onToggle: () => void;
  isActiveLink: (href: string) => boolean;
}) {
  const menuId = `${id}-menu`;
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={menuId}
        className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-mono font-semibold tracking-[0.08em] uppercase transition-colors rounded-xl whitespace-nowrap ${
          isActive
            ? "text-foreground bg-ink/[0.06] font-bold"
            : "text-muted hover:text-foreground hover:bg-ink/[0.02]"
        }`}
      >
        {label}
        <ChevronDown
          aria-hidden="true"
          className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          id={menuId}
          className="absolute top-full right-0 mt-2 w-56 py-1.5 rounded-xl border border-ink/10 bg-background shadow-lg"
        >
          {groups.map((group, i) => (
            <div key={group.heading ?? i} className={i > 0 ? "mt-1.5 pt-1.5 border-t border-ink/10" : ""}>
              {group.heading && (
                <p className="px-4 pt-1 pb-1 text-[10px] font-mono uppercase tracking-[0.15em] text-muted/70">
                  {group.heading}
                </p>
              )}
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActiveLink(link.href) ? "page" : undefined}
                  className={`block px-4 py-2 text-sm transition-colors ${
                    isActiveLink(link.href)
                      ? "text-accent font-semibold bg-ink/[0.03]"
                      : "text-foreground hover:bg-ink/[0.04] hover:text-accent"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileLink({
  link,
  isActive,
  onClick,
}: {
  link: NavLink;
  isActive: (href: string) => boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={link.href}
      aria-current={isActive(link.href) ? "page" : undefined}
      className={`flex items-center min-h-[44px] px-3 py-2 text-sm font-medium rounded-xl transition-colors ${
        isActive(link.href) ? "bg-accent/10 text-accent font-bold" : "text-foreground hover:text-accent"
      }`}
      onClick={onClick}
    >
      {link.label}
    </Link>
  );
}

function MobileGroups({
  groups,
  heading,
  isActive,
  onNavigate,
}: {
  groups: NavGroup[];
  heading: string;
  isActive: (href: string) => boolean;
  onNavigate: () => void;
}) {
  return (
    <>
      <p className="px-3 pt-4 pb-1 text-[11px] font-mono uppercase tracking-[0.15em] text-muted/70">
        {heading}
      </p>
      {groups.flatMap((g) => g.links).map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={isActive(link.href) ? "page" : undefined}
          className={`flex items-center min-h-[44px] px-3 py-2 text-sm font-medium rounded-xl transition-colors ${
            isActive(link.href) ? "bg-accent/10 text-accent font-bold" : "text-foreground/80 hover:text-accent"
          }`}
          onClick={onNavigate}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}
