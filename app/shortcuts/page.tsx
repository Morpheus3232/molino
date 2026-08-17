import Link from "next/link";
import { siteUrl, SITE_URL, createRouteMetadata } from "@/lib/seo";
import { Sparkles, ArrowRight, Zap, Sun, Heart, Smartphone, Moon, ExternalLink, Check, Copy } from "lucide-react";
import Card from "@/components/ui/Card";

export const metadata = createRouteMetadata({
  title: "Atajos de Apple (Siri Shortcuts) & Automatizaciones — Molino",
  description:
    "Configurá Atajos de iOS, rutinas de Siri y webhooks para consultar tu vibración diaria, fases lunares y sinastría automáticamente.",
  path: "/shortcuts",
});

const SHORTCUTS = [
  {
    id: "energia-diaria",
    title: "⚡ Vibración y Foco del Día",
    desc: "Obtené una notificación matutina o consultá a Siri '¿Cuál es mi energía de hoy?' consultando la API de Molino.",
    action: "GET /api/v1/daily?birthDate=TU_FECHA",
    siriPhrase: "Oye Siri, energía de hoy",
    directUrl: `${SITE_URL}/hoy`,
  },
  {
    id: "fase-lunar",
    title: "🌙 Fase Lunar y Tránsitos",
    desc: "Integrá la fase lunar actual en tu pantalla de bloqueo o como widget en iOS / Mac.",
    action: "GET /api/v1/daily?birthDate=TU_FECHA (campo: moonPhase)",
    siriPhrase: "Oye Siri, fase lunar Molino",
    directUrl: `${SITE_URL}/hoy`,
  },
  {
    id: "sinastria-pareja",
    title: "❤️ Sinergia Rápida en Modo Pareja",
    desc: "Abrí directamente la comparativa de mapas entre vos y otra persona con un solo toque.",
    action: "URL: https://molino.app/pareja?a=FECHA_A&b=FECHA_B",
    siriPhrase: "Oye Siri, sinastría de pareja",
    directUrl: `${SITE_URL}/pareja`,
  },
];

export default function ShortcutsPage() {
  return (
    <main id="main-content" className="bg-background pt-20 sm:pt-24 pb-24 text-foreground">
      <div className="mx-auto max-w-4xl px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <header className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent mb-4">
            <Smartphone className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] font-bold">
              iOS Shortcuts & Siri
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground uppercase">
            Atajos & Automatizaciones
          </h1>

          <p className="text-sm sm:text-base text-muted mt-3 leading-relaxed">
            Conectá Molino con la app <strong>Atajos de Apple (iOS / macOS)</strong> o IFTTT para automatizar tu rutina de autoconocimiento.
          </p>
        </header>

        {/* Shortcuts List */}
        <div className="space-y-6 mb-16">
          {SHORTCUTS.map((s) => (
            <Card key={s.id} padding="lg" className="border-ink/10 bg-card/70 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-ink/10">
                <h3 className="font-heading text-lg font-bold text-foreground">
                  {s.title}
                </h3>
                <span className="font-mono text-xs text-accent px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/20">
                  {s.siriPhrase}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                {s.desc}
              </p>

              <div className="p-3 rounded-xl bg-background border border-ink/5 font-mono text-xs text-foreground/80 flex items-center justify-between gap-2 overflow-x-auto">
                <code className="text-[11px] text-accent truncate">{s.action}</code>
                <Link
                  href={s.directUrl}
                  className="px-3 py-1 rounded-lg bg-ink/5 hover:bg-ink/10 text-xs font-mono text-foreground inline-flex items-center gap-1 flex-shrink-0 transition-colors"
                >
                  <span>Probar</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* How to configure guide */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-ink/10 space-y-4">
          <h3 className="font-heading text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" />
            <span>Cómo crear tu atajo en 3 pasos:</span>
          </h3>

          <ol className="space-y-3 text-xs sm:text-sm text-muted font-sans leading-relaxed list-decimal list-inside">
            <li>
              Abrí la app <strong>Atajos</strong> en tu iPhone, iPad o Mac y tocá en <strong>+ (Crear atajo)</strong>.
            </li>
            <li>
              Agregá la acción <strong>&ldquo;Obtener contenido de URL&rdquo;</strong> e ingresá:
              <code className="mx-1 px-2 py-0.5 rounded bg-background text-accent font-mono text-xs">
                https://molino.app/api/v1/daily?birthDate=TU_FECHA
              </code>
            </li>
            <li>
              Agregá la acción <strong>&ldquo;Mostrar notificación&rdquo;</strong> con el texto de la respuesta (ej: tema del día y fase lunar).
            </li>
          </ol>
        </div>
      </div>
    </main>
  );
}
