export interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

export const headerNavLinks: NavLink[] = [
  { href: "/", label: "INICIO" },
  { href: "/biblioteca", label: "BIBLIOTECA" },
  { href: "/filosofia", label: "FILOSOFÍA" },
  { href: "https://github.com/Morpheus3232/molino", label: "GITHUB", external: true },
];

/**
 * Las cuatro superficies centrales del producto. Siempre visibles/enlazables
 * en el header, independientemente de si hay un perfil guardado — cada
 * página maneja su propio estado sin-perfil (CTA a /onboarding).
 */
export const productNavLinks: NavLink[] = [
  { href: "/hoy", label: "HOY" },
  { href: "/timing", label: "TIMING" },
  { href: "/decisions", label: "DECISIONES" },
  { href: "/evolution", label: "EVOLUCIÓN" },
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
      { href: "/guia", label: "GUÍA" },
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
];
