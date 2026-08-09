export interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

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
      { href: "/affinity", label: "AFINIDAD" },
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
