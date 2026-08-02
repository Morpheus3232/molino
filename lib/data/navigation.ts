export interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

/**
 * REBUILD (Bloque 2) — la nav primaria bajó de 9 links planos compitiendo
 * entre sí a 2: "Hoy" (el gancho de retorno diario) y "Afinidad" (la
 * exploración hacia el mundo). Todo lo demás — Timing, Decisiones,
 * Evolución, Biblioteca, Filosofía — sigue existiendo y es 100% alcanzable,
 * pero vive en el menú (secondaryNavLinks), no peleando en la barra
 * principal. "Mi Mapa" no es un link más: es el CTA acentuado del header.
 */
export const primaryNavLinks: NavLink[] = [
  { href: "/hoy", label: "Hoy" },
  { href: "/affinity", label: "Afinidad" },
];

export const secondaryNavLinks: NavLink[] = [
  { href: "/timing", label: "Timing" },
  { href: "/decisions", label: "Decisiones" },
  { href: "/evolution", label: "Evolución" },
];

export const knowledgeNavLinks: NavLink[] = [
  { href: "/biblioteca", label: "Biblioteca" },
  { href: "/filosofia", label: "Filosofía" },
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
