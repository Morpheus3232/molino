import Link from "next/link";
import { Asterisk, GitBranch, ShieldCheck, Zap, Heart, BookOpen, Code2, ArrowRight, Bookmark, Users, Sun, MapPin, Bitcoin, Gift } from "lucide-react";
import Card from "@/components/ui/Card";
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
    <main id="main-content" className="bg-background pt-20 sm:pt-24 pb-24 text-foreground">
      <div className="mx-auto max-w-5xl px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="page-eyebrow mb-4">
            <GitBranch className="w-3.5 h-3.5" />
            <span className="text-sm font-bold label-caps">
              Registro Público de Novedades
            </span>
          </div>

          <h1 className="page-title text-foreground">
            Evolución & Changelog
          </h1>

          <p className="text-sm sm:text-base text-muted mt-4 leading-relaxed">
            Cada cambio en Molino responde a dos principios innegociables: <strong>privacidad total sin cuentas</strong> y <strong>claridad simbólica estructurada</strong>.
          </p>
        </div>

        {/* Releases Timeline */}
        <div className="space-y-12 relative before:absolute before:inset-0 before:left-4 md:before:left-8 before:w-0.5 before:bg-ink/10">
          {RELEASES.map((release) => (
            <div key={release.version} className="relative pl-10 md:pl-20">
              {/* Timeline Dot */}
              <div className="absolute left-2.5 md:left-6.5 top-1.5 w-3.5 h-3.5 rounded-full bg-accent border-4 border-background -translate-x-1/2" />

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="font-display text-2xl font-bold text-foreground">
                  {release.version}
                </span>
                <span className="text-xs font-mono text-muted">
                  {release.date}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-bold label-caps">
                  {release.badge}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {release.highlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Card key={item.title} padding="md" className="border-ink/10 bg-card/60">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-heading text-sm font-bold text-foreground mb-1">
                            {item.title}
                          </h3>
                          <p className="text-xs text-muted leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Open Source / GitHub Footer banner */}
        <div className="mt-16 p-6 sm:p-8 rounded-xl bg-accent/5 border border-accent/20 text-center space-y-3">
          <span className="text-sm text-accent font-bold label-caps">
            Código Abierto & Transparencia
          </span>
          <h4 className="font-heading text-lg font-bold text-foreground">
            Molino es un proyecto abierto y auditable
          </h4>
          <p className="text-xs text-muted max-w-md mx-auto">
            Podés revisar cada línea de cálculo y contribuir en nuestro repositorio público de GitHub.
          </p>
          <div className="pt-2">
            <a
              href="https://github.com/Morpheus3232/molino"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ink/5 hover:bg-ink/10 border border-ink/10 text-xs font-mono text-foreground font-semibold transition-colors"
            >
              <span>Ver repositorio en GitHub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
