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
import { Menu, X, ChevronDown, Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import SavedProfilesDrawer from "@/components/profile/SavedProfilesDrawer";

/* ═══ Navegación — tres zonas fijas, siempre en el mismo lugar ═══
   Izquierda: el logo (volver al inicio). Centro: destinos — a dónde puedo
   ir. Derecha: la acción del estado — qué puedo hacer. Nada cruza de zona.

   El criterio de qué entra al centro: **el header solo lleva lo que es
   tuyo; lo que es del sitio vive en el footer.** Sin mapa todavía no hay
   nada tuyo, así que el centro se reduce a dos puertas de prueba (Atlas,
   Hoy) y la zona derecha es una sola cosa: crear el mapa. Con mapa, el
   centro son tus cuatro superficies y la derecha son tus dos objetos
   guardados (Lectura, Guardados).

   Por qué se fue "Explorar" del header: era el cajón de sobras (Academia,
   Biblioteca, Blog, Atlas, Modos) y ya estaba entero en la columna
   "Explorar" del footer. Se mantiene solo en el menú móvil (única
   navegación que tiene mobile), salvo Aprender y Modos, que ahora son
   grupos propios del centro en ambos estados — no necesitan un mapa
   activo para tener sentido y merecían su propia puerta, no una
   enterrada dentro de otro dropdown. */

interface NavLink {
  href: string;
  label: string;
}

interface NavGroup {
  heading?: string;
  links: NavLink[];
}

// Sin mapa: todo lo que se puede usar de verdad sin haber dado una fecha.
// El filtro no es "cuánto entra" sino "esto funciona sin perfil": /hoy y
// /calendario tienen contenido propio (a lo sumo un upsell al pie), igual
// que /journal, /atlas y todo el bloque de aprender. Queda afuera /semana,
// que es un muro duro ("Creá tu mapa primero", cero contenido), y /evolution
// por lo mismo — mandar a alguien ahí antes de tener mapa es el dead-end que
// este header trata de eliminar.
const NO_PROFILE_LINKS = {
  atlas: { href: "/atlas", label: "Atlas" },
  journal: { href: "/journal", label: "Journal" },
} satisfies Record<string, NavLink>;

// Mismo nombre de grupo que con perfil, menos ítems: sin mapa, Semana y Año
// no tienen nada que mostrar.
const TIME_GROUPS_NO_PROFILE: NavGroup[] = [
  {
    links: [
      { href: "/hoy", label: "Hoy" },
      { href: "/calendario", label: "Mes" },
    ],
  },
];

// Con mapa: se saca el prefijo "Mi/Mis" de todo menos del ancla. Con cinco
// labels arrancando igual, la palabra que diferencia caía siempre segunda y
// el ojo tenía que leer cada label entero en vez de escanear.
const PROFILE_LINKS = {
  journal: { href: "/journal", label: "Journal" },
} satisfies Record<string, NavLink>;

const MODES_LINKS: NavLink[] = [
  { href: "/socios", label: "Modo Socios" },
  { href: "/pareja", label: "Modo Parejas" },
  { href: "/regalar", label: "Regalar Mapa 🎁" },
];

// "Conocimiento" — los tres sistemas son la arquitectura intelectual
// dominante, así que van PRIMERO. Después el resto del contenido educativo.
// Antes este grupo se llamaba "Aprender" y arrancaba por Academia/Biblioteca,
// dejando `/conocimiento/*` (la autoridad SEO) sin puerta en el header.
const KNOWLEDGE_LINKS: NavLink[] = [
  { href: "/conocimiento/numerologia", label: "Numerología" },
  { href: "/conocimiento/astrologia", label: "Astrología" },
  { href: "/conocimiento/zodiaco-chino", label: "Zodíaco chino" },
  { href: "/blog", label: "Blog" },
  { href: "/biblioteca", label: "Biblioteca" },
  { href: "/academy", label: "Academia" },
];

// Con perfil, Atlas deja de ser link CORE del header y se agrega acá.
const KNOWLEDGE_LINKS_WITH_PROFILE: NavLink[] = [
  ...KNOWLEDGE_LINKS,
  { href: "/atlas", label: "Atlas" },
];

// "Proyecto" — la identidad open-source deja de vivir solo en el footer.
const PROJECT_LINKS: NavLink[] = [
  { href: "/filosofia", label: "Filosofía" },
  { href: "/transparencia", label: "Transparencia" },
  { href: "/metodos-y-fuentes", label: "Métodos y fuentes" },
  { href: "/changelog", label: "Changelog" },
];

// Conocimiento es accesible sin mapa — sube al header como grupo propio.
const KNOWLEDGE_GROUPS_NO_PROFILE: NavGroup[] = [{ links: KNOWLEDGE_LINKS }];

// Con perfil, Conocimiento NO desaparece del centro (antes sí — el usuario
// con mapa perdía toda puerta a `/conocimiento` desde el header).
const KNOWLEDGE_GROUPS_WITH_PROFILE: NavGroup[] = [{ links: KNOWLEDGE_LINKS_WITH_PROFILE }];

const PROJECT_GROUPS: NavGroup[] = [{ links: PROJECT_LINKS }];

// Modos (Socios/Parejas/Regalar) suben al header como grupo propio en ambos
// estados.
const MODES_GROUPS: NavGroup[] = [{ links: MODES_LINKS }];

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

type MenuId = "explore" | "affinities" | "time" | "knowledge" | "modes" | "project";

export default function UniversityHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [hasProfile, setHasProfile] = useState(false);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
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
  // El label de la bóveda distingue "hay algo guardado" de "todavía no" según
  // `vaultCount`, no según `hasProfile`: antes alguien con un perfil activo
  // pero cero mapas guardados veía igual el label de bóveda llena.
  // `isPremium` habilita el
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
      const profile = loadProfileFromStorage() as UserProfile | null;
      setActiveProfile(profile);
      // El link se muestra con solo tener un mapa activo, ya no según
      // `premium`: ese chequeo era `!!getPremiumTokenClient()`, es decir "este
      // dispositivo pagó alguna vez", no "esta fecha tiene lectura". Con un
      // mapa nuevo sin pagar el link aparecía igual y terminaba en un error
      // genérico. Ahora /lectura resuelve el entitlement real y muestra el
      // paywall cuando corresponde, así que el link es la puerta de entrada
      // al producto pago —lo vea quien lo compró o quien todavía no.
      setLecturaHref(profile ? `/lectura#${encodeProfileData(profile)}` : null);
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

  // La Lectura vive en su propia pestaña como objeto autónomo.
  // El nav del sitio no rompe esa sensación — el header sigue
  // visible para que el usuario siempre tenga puerta a las otras
  // capas del producto (Mapa, IA, resto del sitio).

  // El label anterior de la bóveda era el plural literal del ancla del
  // centro: dos etiquetas casi idénticas a tres ítems de distancia, una para
  // el mapa activo y otra para la bóveda. "Guardados" no compite con ella.
  const vaultLabel = vaultCount > 0 ? "Guardados" : "Guardar";

  const navButtonClass = (active: boolean) =>
    `px-3 py-1.5 text-sm font-mono font-semibold tracking-[0.08em] uppercase transition-colors rounded-xl whitespace-nowrap ${
      active
        ? "text-foreground bg-ink/[0.06] font-bold"
        : "text-muted hover:text-foreground hover:bg-ink/[0.02]"
    }`;

  // Zona derecha: se ve distinta a propósito. Los destinos del centro son
  // texto plano; una acción lleva borde o relleno, así se sabe qué navega y
  // qué abre algo antes de clickear.
  const actionClass =
    "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-mono font-semibold tracking-[0.08em] uppercase whitespace-nowrap rounded-xl border border-ink/15 text-foreground hover:border-accent hover:text-accent transition-colors";

  return (
    <>
      <motion.header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 w-full z-50 bg-background transition-shadow duration-300 ${
          scrolled ? "border-b border-ink/10 shadow-sm" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 min-h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0" aria-label="Ir al inicio — Molino">
            <span className="inline-flex h-10 w-10 items-center justify-center bg-background text-foreground border border-ink/10 rounded-xl group-hover:text-accent transition-colors">
              <Logo className="w-7 h-7" />
            </span>
          </Link>

          {/* ZONA CENTRO — destinos. Solo texto: todo lo de acá navega. */}
          <nav className="hidden lg:flex items-center gap-1.5 min-w-0" aria-label="Navegación principal">
            {!hasProfile ? (
              <>
                <NavDropdown
                  id="knowledge"
                  label="Conocimiento"
                  groups={KNOWLEDGE_GROUPS_NO_PROFILE}
                  isOpen={openMenu === "knowledge"}
                  isActive={isGroupActive(KNOWLEDGE_GROUPS_NO_PROFILE)}
                  onToggle={() => toggleMenu("knowledge")}
                  isActiveLink={isActive}
                />
                <Link
                  href={NO_PROFILE_LINKS.atlas.href}
                  className={navButtonClass(isActive(NO_PROFILE_LINKS.atlas.href))}
                  aria-current={pathname === NO_PROFILE_LINKS.atlas.href ? "page" : undefined}
                >
                  {NO_PROFILE_LINKS.atlas.label}
                </Link>
                <NavDropdown
                  id="time"
                  label="Tiempo"
                  groups={TIME_GROUPS_NO_PROFILE}
                  isOpen={openMenu === "time"}
                  isActive={isGroupActive(TIME_GROUPS_NO_PROFILE)}
                  onToggle={() => toggleMenu("time")}
                  isActiveLink={isActive}
                />
                <NavDropdown
                  id="modes"
                  label="Modos"
                  groups={MODES_GROUPS}
                  isOpen={openMenu === "modes"}
                  isActive={isGroupActive(MODES_GROUPS)}
                  onToggle={() => toggleMenu("modes")}
                  isActiveLink={isActive}
                />
                <NavDropdown
                  id="project"
                  label="Proyecto"
                  groups={PROJECT_GROUPS}
                  isOpen={openMenu === "project"}
                  isActive={isGroupActive(PROJECT_GROUPS)}
                  onToggle={() => toggleMenu("project")}
                  isActiveLink={isActive}
                />
              </>
            ) : (
              <>
                <NavDropdown
                  id="knowledge"
                  label="Conocimiento"
                  groups={KNOWLEDGE_GROUPS_WITH_PROFILE}
                  isOpen={openMenu === "knowledge"}
                  isActive={isGroupActive(KNOWLEDGE_GROUPS_WITH_PROFILE)}
                  onToggle={() => toggleMenu("knowledge")}
                  isActiveLink={isActive}
                />
                <NavDropdown
                  id="affinities"
                  label="Afinidades"
                  groups={AFFINITY_GROUPS}
                  isOpen={openMenu === "affinities"}
                  isActive={isGroupActive(AFFINITY_GROUPS)}
                  onToggle={() => toggleMenu("affinities")}
                  isActiveLink={isActive}
                />
                <NavDropdown
                  id="time"
                  label="Tiempo"
                  groups={TIME_GROUPS}
                  isOpen={openMenu === "time"}
                  isActive={isGroupActive(TIME_GROUPS)}
                  onToggle={() => toggleMenu("time")}
                  isActiveLink={isActive}
                />
                <NavDropdown
                  id="modes"
                  label="Modos"
                  groups={MODES_GROUPS}
                  isOpen={openMenu === "modes"}
                  isActive={isGroupActive(MODES_GROUPS)}
                  onToggle={() => toggleMenu("modes")}
                  isActiveLink={isActive}
                />
                <Link
                  href={PROFILE_LINKS.journal.href}
                  className={navButtonClass(isActive(PROFILE_LINKS.journal.href))}
                  aria-current={pathname === PROFILE_LINKS.journal.href ? "page" : undefined}
                >
                  {PROFILE_LINKS.journal.label}
                </Link>
              </>
            )}
          </nav>

          {/* ZONA DERECHA — la acción del estado. Sin mapa es una sola cosa:
              crearlo. Antes esa acción solo existía en el menú móvil, así que
              en desktop un usuario nuevo veía seis herramientas y ninguna
              indicación de por dónde empezar. */}
          <div className="flex items-center gap-2 shrink-0">
            {!hasProfile ? (
              <Link
                href="/onboarding"
                className="hidden lg:inline-flex items-center px-4 py-2 text-sm font-mono font-semibold tracking-[0.08em] uppercase whitespace-nowrap rounded-xl bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
              >
                Crear mi mapa
              </Link>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                {lecturaHref && (
                  <>
                    <Link
                      href="/profile"
                      className="inline-flex items-center px-3 py-1.5 text-sm font-mono font-semibold tracking-[0.08em] uppercase whitespace-nowrap rounded-xl border border-ink/15 text-foreground hover:border-accent hover:text-accent transition-colors"
                    >
                      Mi Mapa
                    </Link>
                    <Link
                      href={lecturaHref}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-mono font-semibold tracking-[0.08em] uppercase whitespace-nowrap rounded-xl border border-accent/40 text-accent hover:border-accent hover:bg-accent/[0.08] transition-colors"
                    >
                      Mi Lectura
                    </Link>
                    <Link
                      href="/ai"
                      className={navButtonClass(isActive("/ai"))}
                      aria-current={pathname === "/ai" ? "page" : undefined}
                    >
                      Preguntá
                    </Link>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => {
                    handleNewProfile();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-mono font-semibold tracking-[0.08em] uppercase whitespace-nowrap rounded-xl border border-ink/15 text-foreground hover:border-accent hover:text-accent transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" focusable="false" />
                  Crear nuevo mapa
                </button>
                <SavedProfilesDrawer currentProfile={activeProfile} label={vaultLabel} premiumShortcut={isPremium} className={actionClass} />
              </div>
            )}
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
                    {/* La acción va primera, no enterrada al fondo del sheet:
                        es lo único que un usuario nuevo necesita decidir. */}
                    <Link
                      href="/onboarding"
                      className="flex items-center justify-center min-h-[44px] mb-3 px-4 py-2.5 text-xs font-mono font-semibold tracking-[0.2em] uppercase bg-accent text-accent-foreground hover:opacity-90 transition-opacity text-center rounded-xl"
                      onClick={() => setMenuOpen(false)}
                    >
                      CREAR MI MAPA
                    </Link>
                    <MobileGroups groups={KNOWLEDGE_GROUPS_NO_PROFILE} heading="Conocimiento" isActive={isActive} onNavigate={() => setMenuOpen(false)} />
                    <MobileLink link={NO_PROFILE_LINKS.atlas} isActive={isActive} onClick={() => setMenuOpen(false)} />
                    <MobileGroups groups={TIME_GROUPS_NO_PROFILE} heading="Tiempo" isActive={isActive} onNavigate={() => setMenuOpen(false)} />
                    <MobileGroups groups={MODES_GROUPS} heading="Modos" isActive={isActive} onNavigate={() => setMenuOpen(false)} />
                    <MobileGroups groups={PROJECT_GROUPS} heading="Proyecto" isActive={isActive} onNavigate={() => setMenuOpen(false)} />
                    <MobileLink link={NO_PROFILE_LINKS.journal} isActive={isActive} onClick={() => setMenuOpen(false)} />
                  </>
                ) : (
                  <>
                    <MobileGroups groups={KNOWLEDGE_GROUPS_WITH_PROFILE} heading="Conocimiento" isActive={isActive} onNavigate={() => setMenuOpen(false)} />
                    <MobileGroups groups={AFFINITY_GROUPS} heading="Afinidades" isActive={isActive} onNavigate={() => setMenuOpen(false)} />
                    <MobileGroups groups={TIME_GROUPS} heading="Tiempo" isActive={isActive} onNavigate={() => setMenuOpen(false)} />
                    <MobileGroups groups={MODES_GROUPS} heading="Modos" isActive={isActive} onNavigate={() => setMenuOpen(false)} />
                    <MobileGroups groups={PROJECT_GROUPS} heading="Proyecto" isActive={isActive} onNavigate={() => setMenuOpen(false)} />
                    <MobileLink link={PROFILE_LINKS.journal} isActive={isActive} onClick={() => setMenuOpen(false)} />

                    <div className="border-t border-ink/10 my-2" />

                    {lecturaHref && (
                      <Link
                        href="/profile"
                        className="flex items-center min-h-[44px] px-3 py-2 text-sm font-medium rounded-xl transition-colors text-foreground hover:text-accent"
                        onClick={() => setMenuOpen(false)}
                      >
                        Mi Mapa
                      </Link>
                    )}
                    {lecturaHref && (
                      <Link
                        href={lecturaHref}
                        className="flex items-center min-h-[44px] px-3 py-2 text-sm font-medium rounded-xl transition-colors text-accent/80 hover:text-accent"
                        onClick={() => setMenuOpen(false)}
                      >
                        Mi Lectura
                      </Link>
                    )}
                    <Link
                      href="/ai"
                      className="flex items-center min-h-[44px] px-3 py-2 text-sm font-medium rounded-xl transition-colors text-foreground hover:text-accent"
                      onClick={() => setMenuOpen(false)}
                    >
                      Preguntá (IA)
                    </Link>
                    <div className="px-3 py-1.5">
                      <SavedProfilesDrawer currentProfile={activeProfile} label={vaultLabel} premiumShortcut={isPremium} className="w-full justify-center !min-h-[44px] !py-2.5" />
                    </div>
                  </>
                )}

                {hasProfile && (
                  <>
                    <div className="border-t border-ink/10 my-2" />
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        handleNewProfile();
                      }}
                      className="flex items-center gap-2 min-h-[44px] w-full text-left px-3 py-2 text-xs font-mono text-muted hover:text-rose-400 transition-colors"
                    >
                      <Plus className="w-4 h-4" aria-hidden="true" focusable="false" />
                      Crear nuevo mapa
                    </button>
                  </>
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
              className="relative bg-card border border-ink/10 p-6 sm:p-8 max-w-sm w-full rounded-lg shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <h3 id="confirm-title" className="font-heading text-lg font-bold text-foreground mb-2">
                ¿Crear nuevo mapa?
              </h3>
              <p className="text-xs text-muted mb-6 leading-relaxed">
                Se limpiará la fecha activa. Si querés conservarla, guardala primero desde &laquo;Guardar&raquo;.
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
