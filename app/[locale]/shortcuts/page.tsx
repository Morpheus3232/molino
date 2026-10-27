import { initLocale, getL } from "@/lib/i18n/server";
import { type Pick2 } from "@/lib/i18n/useL";
import { Link } from "@/lib/i18n/navigation";
import { siteUrl, SITE_URL, metadataFor } from "@/lib/seo";
import { Asterisk, ArrowRight, Zap, Sun, Heart, Smartphone, Moon, ExternalLink, Check, Copy } from "lucide-react";
import Card from "@/components/ui/Card";

export const generateMetadata = metadataFor({
  title: ["Atajos de Apple (Siri Shortcuts) & Automatizaciones", "Apple Shortcuts (Siri Shortcuts) & Automations"],
  description:
    ["Configurá Atajos de iOS, rutinas de Siri y webhooks para consultar tu vibración diaria, fases lunares y sinastría automáticamente.", "Set up iOS Shortcuts, Siri routines and webhooks to check your daily vibration, moon phases and synastry automatically."],
  path: "/shortcuts",
});

const SHORTCUTS = (L: Pick2) => ([
  {
    id: "energia-diaria",
    title: L("⚡ Vibración y Foco del Día", "⚡ Vibration and Focus of the Day"),
    desc: L("Obtené una notificación matutina o consultá a Siri '¿Cuál es mi energía de hoy?' consultando la API de Molino.", "Get a morning notification or ask Siri \"What's my energy today?\" by querying the Molino API."),
    action: L("GET /api/v1/daily?birthDate=TU_FECHA", "GET /api/v1/daily?birthDate=YOUR_DATE"),
    siriPhrase: L("Oye Siri, energía de hoy", "Hey Siri, today's energy"),
    directUrl: `${SITE_URL}/hoy`,
  },
  {
    id: "fase-lunar",
    title: L("🌙 Fase Lunar y Tránsitos", "🌙 Moon Phase and Transits"),
    desc: L("Integrá la fase lunar actual en tu pantalla de bloqueo o como widget en iOS / Mac.", "Put the current moon phase on your lock screen or as a widget on iOS / Mac."),
    action: L("GET /api/v1/daily?birthDate=TU_FECHA (campo: moonPhase)", "GET /api/v1/daily?birthDate=YOUR_DATE (field: moonPhase)"),
    siriPhrase: L("Oye Siri, fase lunar Molino", "Hey Siri, Molino moon phase"),
    directUrl: `${SITE_URL}/hoy`,
  },
  {
    id: "sinastria-pareja",
    title: L("❤ Sinergia Rápida en Modo Pareja", "❤ Quick Synergy in Couple Mode"),
    desc: L("Abrí directamente la comparativa de mapas entre vos y otra persona con un solo toque.", "Open the map comparison between you and another person directly, with a single tap."),
    action: L("URL: https://molino.app/pareja?a=FECHA_A&b=FECHA_B", "URL: https://molino.app/en/pareja?a=DATE_A&b=DATE_B"),
    siriPhrase: L("Oye Siri, sinastría de pareja", "Hey Siri, couple synastry"),
    directUrl: `${SITE_URL}/pareja`,
  },
]);

export default async function ShortcutsPage({ params }: { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  const L = await getL();
  return (
    <main id="main-content" className="bg-background pt-20 sm:pt-24 pb-24 text-foreground">
      <div className="mx-auto max-w-4xl px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <header className="text-center max-w-2xl mx-auto mb-16">
          <div className="page-eyebrow mb-4">
            <Smartphone className="w-3.5 h-3.5" />
            <span className="text-sm font-bold label-caps">
              iOS Shortcuts & Siri
            </span>
          </div>

          <h1 className="page-title text-foreground">{L(<>
            Atajos & Automatizaciones
          </>, <>Shortcuts & Automations</>)}</h1>

          <p className="text-sm sm:text-base text-muted mt-3 leading-relaxed">{L(<>
            Conectá Molino con la app <strong>Atajos de Apple (iOS / macOS)</strong> o IFTTT para automatizar tu rutina de autoconocimiento.
          </>, <>Connect Molino with the <strong>Apple Shortcuts app (iOS / macOS)</strong> or IFTTT to automate your self-knowledge routine.</>)}</p>
        </header>

        {/* Shortcuts List */}
        <div className="space-y-6 mb-16">
          {SHORTCUTS(L).map((s) => (
            <Card key={s.id} padding="lg" className="border-ink/10 bg-card/70 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-ink/10">
                <h3 className="font-heading text-lg font-bold text-foreground">
                  {L.t(s.title)}
                </h3>
                <span className="font-mono text-xs text-accent px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/20">
                  {L.t(s.siriPhrase)}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                {L.t(s.desc)}
              </p>

              <div className="p-3 rounded-xl bg-background border border-ink/5 font-mono text-xs text-foreground/80 flex items-center justify-between gap-2 overflow-x-auto">
                <code className="text-[11px] text-accent truncate">{L.t(s.action)}</code>
                <Link
                  href={s.directUrl}
                  className="px-3 py-1 rounded-lg bg-ink/5 hover:bg-ink/10 text-xs font-mono text-foreground inline-flex items-center gap-1 flex-shrink-0 transition-colors"
                >
                  <span>{L("Probar", "Try it")}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* How to configure guide */}
        <div className="p-6 sm:p-8 rounded-xl bg-card border border-ink/10 space-y-4">
          <h3 className="font-heading text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" />
            <span>{L("Cómo crear tu atajo en 3 pasos:", "How to create your shortcut in 3 steps:")}</span>
          </h3>

          <ol className="space-y-3 text-xs sm:text-sm text-muted font-sans leading-relaxed list-decimal list-inside">
            <li>{L(<>
              Abrí la app <strong>Atajos</strong> en tu iPhone, iPad o Mac y tocá en <strong>+ (Crear atajo)</strong>.
            </>, <>Open the <strong>Shortcuts</strong> app on your iPhone, iPad or Mac and tap <strong>+ (Create Shortcut)</strong>.</>)}</li>
            <li>{L(<>
              Agregá la acción <strong>&ldquo;Obtener contenido de URL&rdquo;</strong> e ingresá:
              <code className="mx-1 px-2 py-0.5 rounded bg-background text-accent font-mono text-xs">
                https://molino.app/api/v1/daily?birthDate=TU_FECHA
              </code>
            </>, <>Add the <strong>&ldquo;Get Contents of URL&rdquo;</strong> action and enter: <code className="mx-1 px-2 py-0.5 rounded bg-background text-accent font-mono text-xs">https://molino.app/api/v1/daily?birthDate=YOUR_DATE</code></>)}</li>
            <li>{L(<>
              Agregá la acción <strong>&ldquo;Mostrar notificación&rdquo;</strong> con el texto de la respuesta (ej: tema del día y fase lunar).
            </>, <>Add the <strong>&ldquo;Show Notification&rdquo;</strong> action with the text of the response (e.g. theme of the day and moon phase).</>)}</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
