import { Asterisk, ShieldCheck, Zap, Heart, BookOpen, Code2, Bookmark, Users, Sun, MapPin, Bitcoin, Gift } from "lucide-react";
import { PageHero } from "@/components/knowledge/Kit";
import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Changelog & Novedades",
  description:
    "Registro público de mejoras técnicas, nuevas funcionalidades, motores de cálculo y actualizaciones de privacidad en Molino.",
  path: "/changelog",
});

const RELEASES = [
  {
    version: "v2.4.0",
    date: "17 de Octubre, 2026",
    badge: "Último lanzamiento",
    highlights: [
      {
        icon: BookOpen,
        title: "Edición de libro",
        desc: "El sitio pasa a blanco y negro y a una sola tipografía, Garamond. Versalitas en lugar de etiquetas en mayúsculas, emoji monocromos y sin gradientes.",
      },
      {
        icon: Sun,
        title: "La energía del día en la portada",
        desc: "La fecha de hoy encabeza la portada, con el consejo del momento, el número del día y los próximos días, para cualquiera que entre.",
      },
      {
        icon: Users,
        title: "Modo Socios para equipos",
        desc: "Comparación de hasta cinco personas: cada par del equipo con su nivel de afinidad y el detalle completo de ese par.",
      },
      {
        icon: MapPin,
        title: "El Atlas se explica al entrar",
        desc: "Cuenta qué reúne y cómo cada entidad toma su signo del zodíaco chino de su fecha de origen. La página Transparencia se retiró: su contenido vive en Filosofía.",
      },
    ],
  },
  {
    version: "v2.3.0",
    date: "4 de Octubre, 2026",
    badge: "Datos y búsqueda",
    highlights: [
      {
        icon: MapPin,
        title: "38 ciudades con fecha exacta",
        desc: "Chile, Perú, México y Colombia, cargadas solo si Wikidata y Wikipedia coinciden en día, mes y año.",
      },
      {
        icon: Gift,
        title: "Regalos atados a su código",
        desc: "Un pago de regalo solo se activa con el código que se generó para él.",
      },
      {
        icon: Code2,
        title: "Fichas de afinidad indexables",
        desc: "Las fichas tienen su contenido real en el HTML y se corrigieron los 140 enlaces rotos que reportaba Google.",
      },
      {
        icon: ShieldCheck,
        title: "Privacidad y términos al día",
        desc: "Los textos legales describen exactamente qué datos viajan y cuáles no.",
      },
    ],
  },
  {
    version: "v2.2.0",
    date: "3 de Septiembre, 2026",
    badge: "Mapa, lectura y pagos",
    highlights: [
      {
        icon: Asterisk,
        title: "Mi Mapa con la lectura gratuita completa",
        desc: "El cuadro de nacimiento y los dos movimientos pasan a Mi Mapa, sin pagar.",
      },
      {
        icon: BookOpen,
        title: "Lectura Pro y chat",
        desc: "Quien compró ve su lectura completa y puede hacerle preguntas a la IA sobre su mapa.",
      },
      {
        icon: Bitcoin,
        title: "Pago con Bitcoin",
        desc: "Opción junto a MercadoPago: el comprobante se verifica contra la blockchain, sin intermediarios.",
      },
      {
        icon: Gift,
        title: "Códigos de canje",
        desc: "Una Lectura Pro se puede regalar o canjear con un código en /canjear.",
      },
    ],
  },
  {
    version: "v2.1.0",
    date: "14 de Agosto, 2026",
    badge: "Multi-perfil y API",
    highlights: [
      {
        icon: Zap,
        title: "Web Worker & Multi-threading",
        desc: "Cálculos pesados de sinastría y ciclos delegados a un worker en segundo plano para garantizar 60 FPS continuos.",
      },
      {
        icon: Bookmark,
        title: "Bóveda de Mapas Locales (Multi-Perfil)",
        desc: "Guardá y alterná perfiles (tu mapa, pareja, mamá, socios) 100% en tu navegador con un solo clic.",
      },
      {
        icon: Code2,
        title: "API Pública v1 & Widget Embebible",
        desc: "Endpoint /api/v1/map con CORS y widget /embed para que terapeutas y desarrolladores integren Molino en sus sitios.",
      },
      {
        icon: ShieldCheck,
        title: "Resiliencia & Error Boundaries",
        desc: "Fallbacks amigables y skeletons dedicados para evitar pantallas de error o timeouts en conexiones lentas.",
      },
    ],
  },
  {
    version: "v2.0.0",
    date: "10 de Agosto, 2026",
    badge: "Evolución de Producto",
    highlights: [
      {
        icon: Asterisk,
        title: "Dashboard Diario /hoy",
        desc: "Vibración diaria, fase lunar, foco de acción y pronóstico extendido a 3 días según tu fecha de nacimiento.",
      },
      {
        icon: Heart,
        title: "Modo Pareja & Comparativa",
        desc: "Sinergia multi-sistema cruzando Camino de Vida, signos solares, química elemental y zodíaco chino.",
      },
      {
        icon: BookOpen,
        title: "Journal de Autoconocimiento",
        desc: "Registro emocional reflexivo cruzado automáticamente con tu Día y Año Personal.",
      },
    ],
  },
  {
    version: "v1.0.0",
    date: "1 de Julio, 2026",
    badge: "Lanzamiento Inicial",
    highlights: [
      {
        icon: Asterisk,
        title: "Núcleo Simbólico Molino",
        desc: "Integración de numerología pitagórica, astrología solar y zodíaco chino con cálculo 100% local en tu navegador.",
      },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <main id="main-content" className="bg-background pt-12 sm:pt-16 pb-24 text-foreground">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <PageHero
          bare
          crumbs={[{ href: "/", label: "Inicio" }, { label: "Novedades" }]}
          eyebrow="Registro público de cambios"
          title="Evolución de Molino"
          lead="Cada cambio responde a dos reglas: privacidad total sin cuentas y claridad en cada lectura."
        />

        <ol>
          {RELEASES.map((release) => (
            <li key={release.version} className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-6 py-12 border-b border-ink/15 first:pt-0">
              <div className="lg:col-span-3 lg:sticky lg:top-24 self-start">
                <p className="font-display text-5xl leading-none text-foreground">{release.version}</p>
                <p className="mt-3 text-lg text-foreground">{release.date}</p>
                <p className="mt-1 text-base text-muted">{release.badge}</p>
              </div>
              <ul className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-px bg-ink/15 border border-ink/15">
                {release.highlights.map((item) => (
                  <li key={item.title} className="bg-background p-6 sm:p-7">
                    <h3 className="font-display text-2xl leading-tight text-foreground">{item.title}</h3>
                    <p className="mt-2 text-lg text-foreground/80 leading-relaxed">{item.desc}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <div className="mt-16 border-2 border-ink p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">Un proyecto abierto y auditable</h2>
            <p className="mt-3 text-lg text-muted">Cada línea de cálculo está a la vista en el repositorio público, y podés contribuir.</p>
          </div>
          <a
            href="https://github.com/Morpheus3232/molino"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-lg underline underline-offset-4 hover:no-underline"
          >
            Ver el repositorio en GitHub
          </a>
        </div>
      </div>
    </main>
  );
}
