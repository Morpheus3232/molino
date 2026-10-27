import { useL, type Pick2 } from "@/lib/i18n/useL";
import { Asterisk, ShieldCheck, Zap, Heart, BookOpen, Code2, Bookmark, Users, Sun, MapPin, Bitcoin, Gift } from "lucide-react";
import { PageHero } from "@/components/knowledge/Kit";
import { metadataFor } from "@/lib/seo";

export const generateMetadata = metadataFor({
  title: ["Changelog & Novedades", "Changelog & What's New"],
  description:
    ["Registro público de mejoras técnicas, nuevas funcionalidades, motores de cálculo y actualizaciones de privacidad en Molino.", "A public record of technical improvements, new features, calculation engines and privacy updates on Molino."],
  path: "/changelog",
});

const RELEASES = (L: Pick2) => ([
  {
    version: "v2.4.0",
    date: "17 de Octubre, 2026",
    badge: L("Último lanzamiento", "Latest release"),
    highlights: [
      {
        icon: BookOpen,
        title: L("Edición de libro", "Book edition"),
        desc: L("El sitio pasa a blanco y negro y a una sola tipografía, Garamond. Versalitas en lugar de etiquetas en mayúsculas, emoji monocromos y sin gradientes.", "The site switches to black and white and a single typeface, Garamond. Small caps instead of uppercase labels, monochrome emoji and no gradients."),
      },
      {
        icon: Sun,
        title: L("La energía del día en la portada", "The energy of the day on the home page"),
        desc: L("La fecha de hoy encabeza la portada, con el consejo del momento, el número del día y los próximos días, para cualquiera que entre.", "Today's date heads the home page, with the advice for the moment, the number of the day and the next few days, for anyone who visits."),
      },
      {
        icon: Users,
        title: L("Modo Socios para equipos", "Partners Mode for teams"),
        desc: L("Comparación de hasta cinco personas: cada par del equipo con su nivel de afinidad y el detalle completo de ese par.", "Comparison of up to five people: each pair on the team with its affinity level and the full detail of that pair."),
      },
      {
        icon: MapPin,
        title: L("El Atlas se explica al entrar", "The Atlas explains itself when you enter"),
        desc: L("Cuenta qué reúne y cómo cada entidad toma su signo del zodíaco chino de su fecha de origen. La página Transparencia se retiró: su contenido vive en Filosofía.", "It tells you what it gathers and how each entity takes its Chinese zodiac sign from its date of origin. The Transparency page was retired: its content lives in Philosophy."),
      },
    ],
  },
  {
    version: "v2.3.0",
    date: "4 de Octubre, 2026",
    badge: L("Datos y búsqueda", "Data and search"),
    highlights: [
      {
        icon: MapPin,
        title: L("38 ciudades con fecha exacta", "38 cities with an exact date"),
        desc: L("Chile, Perú, México y Colombia, cargadas solo si Wikidata y Wikipedia coinciden en día, mes y año.", "Chile, Peru, Mexico and Colombia, loaded only if Wikidata and Wikipedia agree on the day, month and year."),
      },
      {
        icon: Gift,
        title: L("Regalos atados a su código", "Gifts tied to their code"),
        desc: L("Un pago de regalo solo se activa con el código que se generó para él.", "A gift payment is only activated with the code that was generated for it."),
      },
      {
        icon: Code2,
        title: L("Fichas de afinidad indexables", "Indexable affinity pages"),
        desc: L("Las fichas tienen su contenido real en el HTML y se corrigieron los 140 enlaces rotos que reportaba Google.", "The pages have their real content in the HTML, and the 140 broken links Google was reporting were fixed."),
      },
      {
        icon: ShieldCheck,
        title: L("Privacidad y términos al día", "Privacy and terms up to date"),
        desc: L("Los textos legales describen exactamente qué datos viajan y cuáles no.", "The legal texts describe exactly which data travels and which doesn't."),
      },
    ],
  },
  {
    version: "v2.2.0",
    date: "3 de Septiembre, 2026",
    badge: L("Mapa, lectura y pagos", "Map, reading and payments"),
    highlights: [
      {
        icon: Asterisk,
        title: L("Mi Mapa con la lectura gratuita completa", "My Map with the complete free reading"),
        desc: L("El cuadro de nacimiento y los dos movimientos pasan a Mi Mapa, sin pagar.", "The birth chart and the two movements move to My Map, free of charge."),
      },
      {
        icon: BookOpen,
        title: L("Lectura Pro y chat", "Pro Reading and chat"),
        desc: L("Quien compró ve su lectura completa y puede hacerle preguntas a la IA sobre su mapa.", "Buyers see their complete reading and can ask the AI questions about their map."),
      },
      {
        icon: Bitcoin,
        title: L("Pago con Bitcoin", "Bitcoin payment"),
        desc: L("Opción junto a MercadoPago: el comprobante se verifica contra la blockchain, sin intermediarios.", "An option alongside MercadoPago: the receipt is verified against the blockchain, with no intermediaries."),
      },
      {
        icon: Gift,
        title: L("Códigos de canje", "Redemption codes"),
        desc: L("Una Lectura Pro se puede regalar o canjear con un código en /canjear.", "A Pro Reading can be given as a gift or redeemed with a code at /canjear."),
      },
    ],
  },
  {
    version: "v2.1.0",
    date: "14 de Agosto, 2026",
    badge: L("Multi-perfil y API", "Multi-profile and API"),
    highlights: [
      {
        icon: Zap,
        title: "Web Worker & Multi-threading",
        desc: L("Cálculos pesados de sinastría y ciclos delegados a un worker en segundo plano para garantizar 60 FPS continuos.", "Heavy synastry and cycle calculations delegated to a background worker to guarantee a steady 60 FPS."),
      },
      {
        icon: Bookmark,
        title: L("Bóveda de Mapas Locales (Multi-Perfil)", "Local Map Vault (Multi-Profile)"),
        desc: L("Guardá y alterná perfiles (tu mapa, pareja, mamá, socios) 100% en tu navegador con un solo clic.", "Save and switch between profiles (your map, your partner, your mom, your partners) 100% in your browser with a single click."),
      },
      {
        icon: Code2,
        title: L("API Pública v1 & Widget Embebible", "Public API v1 & Embeddable Widget"),
        desc: L("Endpoint /api/v1/map con CORS y widget /embed para que terapeutas y desarrolladores integren Molino en sus sitios.", "An /api/v1/map endpoint with CORS and an /embed widget so therapists and developers can integrate Molino into their sites."),
      },
      {
        icon: ShieldCheck,
        title: L("Resiliencia & Error Boundaries", "Resilience & Error Boundaries"),
        desc: L("Fallbacks amigables y skeletons dedicados para evitar pantallas de error o timeouts en conexiones lentas.", "Friendly fallbacks and dedicated skeletons to avoid error screens or timeouts on slow connections."),
      },
    ],
  },
  {
    version: "v2.0.0",
    date: "10 de Agosto, 2026",
    badge: L("Evolución de Producto", "Product Evolution"),
    highlights: [
      {
        icon: Asterisk,
        title: L("Dashboard Diario /hoy", "Daily Dashboard /hoy"),
        desc: L("Vibración diaria, fase lunar, foco de acción y pronóstico extendido a 3 días según tu fecha de nacimiento.", "Daily vibration, moon phase, focus for action and a 3-day extended forecast according to your date of birth."),
      },
      {
        icon: Heart,
        title: L("Modo Pareja & Comparativa", "Couple Mode & Comparison"),
        desc: L("Sinergia multi-sistema cruzando Camino de Vida, signos solares, química elemental y zodíaco chino.", "Multi-system synergy crossing Life Path, sun signs, elemental chemistry and the Chinese zodiac."),
      },
      {
        icon: BookOpen,
        title: L("Journal de Autoconocimiento", "Self-Knowledge Journal"),
        desc: L("Registro emocional reflexivo cruzado automáticamente con tu Día y Año Personal.", "A reflective emotional log automatically crossed with your Personal Day and Year."),
      },
    ],
  },
  {
    version: "v1.0.0",
    date: "1 de Julio, 2026",
    badge: L("Lanzamiento Inicial", "Initial Launch"),
    highlights: [
      {
        icon: Asterisk,
        title: L("Núcleo Simbólico Molino", "Molino Symbolic Core"),
        desc: L("Integración de numerología pitagórica, astrología solar y zodíaco chino con cálculo 100% local en tu navegador.", "Integration of Pythagorean numerology, sun-sign astrology and the Chinese zodiac, calculated 100% locally in your browser."),
      },
    ],
  },
]);

export default function ChangelogPage() {
  const L = useL();
  return (
    <main id="main-content" className="bg-background pt-12 sm:pt-16 pb-24 text-foreground">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <PageHero
          bare
          crumbs={[{ href: "/", label: L("Inicio", "Home") }, { label: L("Novedades", "What's new") }]}
          eyebrow={L("Registro público de cambios", "Public changelog")}
          title={L("Evolución de Molino", "The evolution of Molino")}
          lead={L("Cada cambio responde a dos reglas: privacidad total sin cuentas y claridad en cada lectura.", "Every change answers to two rules: total privacy with no accounts, and clarity in every reading.")}
        />

        <ol>
          {RELEASES(L).map((release) => (
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
            <h2 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">{L("Un proyecto abierto y auditable", "An open, auditable project")}</h2>
            <p className="mt-3 text-lg text-muted">{L("Cada línea de cálculo está a la vista en el repositorio público, y podés contribuir.", "Every line of calculation is in plain sight in the public repository, and you can contribute.")}</p>
          </div>
          <a
            href="https://github.com/Morpheus3232/molino"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-lg underline underline-offset-4 hover:no-underline"
          >{L("Ver el repositorio en GitHub", "See the repository on GitHub")}</a>
        </div>
      </div>
    </main>
  );
}
