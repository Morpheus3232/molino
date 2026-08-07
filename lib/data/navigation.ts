import { t } from "@/lib/i18n";

export interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

/**
 * Nav primaria simplificada a 4 items: Inicio, Mi Mapa, Explorar, Filosofía
 * Todo lo demás (Timing, Decisiones, Evolución, Biblioteca) va al menú secundario
 */
export const primaryNavLinks: NavLink[] = [
  { href: "/", label: t.nav.inicio },
  { href: "/profile", label: t.nav.miMapa },
  { href: "/explore", label: t.nav.explorar },
  { href: "/filosofia", label: t.nav.filosofia },
];

export const secondaryNavLinks: NavLink[] = [
  { href: "/timing", label: t.nav.timing },
  { href: "/decisions", label: t.nav.decisiones },
  { href: "/evolution", label: t.nav.evolucion },
];

export const knowledgeNavLinks: NavLink[] = [
  { href: "/biblioteca", label: t.nav.biblioteca },
  { href: "/filosofia", label: t.nav.filosofia },
];

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export const footerColumns: FooterColumn[] = [
  {
    title: "EXPLORAR",
    links: [
      { href: "/", label: "INICIO" },
      { href: "/profile", label: "MI MAPA" },
      { href: "/hoy", label: "ENERGÍA DE HOY" },
      { href: "/timing", label: "TIMING" },
      { href: "/affinity", label: "AFINIDAD" },
      { href: "/evolution", label: "MI EVOLUCIÓN" },
      { href: "/explore", label: "EXPLORAR" },
      { href: "/biblioteca", label: "BIBLIOTECA" },
    ],
  },
  {
    title: "PRINCIPIOS",
    links: [
      { href: "/filosofia#conocimiento-libre", label: "CONOCIMIENTO LIBRE" },
      { href: "/filosofia#privacidad-radical", label: "PRIVACIDAD RADICAL" },
      { href: "/filosofia#transparencia-total", label: "TRANSPARENCIA TOTAL" },
      { href: "/filosofia#codigo-abierto", label: "CÓDIGO ABIERTO" },
      { href: "/filosofia#sin-tracking", label: "SIN TRACKING" },
    ],
  },
  {
    title: "LEGAL",
    links: [
      { href: "/privacidad", label: "PRIVACIDAD" },
      { href: "/terminos", label: "TÉRMINOS" },
    ],
  },
];
