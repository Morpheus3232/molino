import { createRouteMetadata } from "@/lib/seo";
import { getMemberCount, getMonthlyMemberCounts } from "@/lib/metrics";

export const metadata = createRouteMetadata({
  title: "Transparencia — Molino",
  description:
    "Métricas públicas y honestas de Molino: cuántos miembros reales (pagos validados) hay, mes a mes, y cómo financiamos el proyecto sin vender tus datos.",
  path: "/transparencia",
});

const CONTACT_EMAIL = "hola@molino.app";

export default async function TransparenciaPage() {
  const memberCount = await getMemberCount();
  const monthly = await getMonthlyMemberCounts(12);

  return (
    <main id="main-content" className="bg-background pt-20 sm:pt-24 pb-24 text-foreground">
      <div className="mx-auto max-w-3xl px-4 sm:px-8">
        <header className="mb-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-bold mb-3">
            Transparencia Pública
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground uppercase">
            Transparencia
          </h1>
          <p className="text-sm text-muted mt-3 leading-relaxed">
            Creemos que un producto honesto muestra cómo se financia. Estas son las
            métricas públicas de Molino: solo cuentan pagos reales validados, no
            visitas ni usuarios inventados.
          </p>
        </header>

        {/* Member counter — honest, only shown when there's real data */}
        <section className="rounded-2xl bg-card border border-ink/10 p-6 mb-8">
          <h2 className="font-heading text-base font-bold mb-1">Miembros</h2>
          <p className="text-xs text-muted mb-4">
            Personas que desbloquearon acceso premium mediante un pago único validado.
          </p>
          <div className="font-display text-5xl font-bold text-accent">
            {memberCount > 0 ? memberCount.toLocaleString("es-AR") : "—"}
          </div>
          <p className="text-xs text-muted font-mono mt-2">
            Se actualiza una vez por día. Sin tracking, sin inflar: es el conteo real.
          </p>
        </section>

        {/* Monthly breakdown */}
        <section className="rounded-2xl bg-card border border-ink/10 p-6">
          <h2 className="font-heading text-base font-bold mb-4">Nuevos miembros por mes</h2>
          <div className="space-y-2">
            {monthly.map(({ month, count }) => (
              <div key={month} className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted font-mono">{month}</span>
                <div className="flex-1 h-2 bg-ink/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent/70 rounded-full"
                    style={{ width: `${Math.min(100, (count / Math.max(...monthly.map((m) => m.count), 1)) * 100)}%` }}
                  />
                </div>
                <span className="text-foreground font-mono w-10 text-right">{count}</span>
              </div>
            ))}
          </div>
          {monthly.every((m) => m.count === 0) && (
            <p className="text-xs text-muted mt-3">Todavía no hay datos suficientes para mostrar.</p>
          )}
        </section>

        {/* Financing philosophy + contact */}
        <section className="mt-10 rounded-2xl bg-paper-alt border border-border p-6">
          <h2 className="font-heading text-base font-bold mb-2">Cómo nos financiamos</h2>
          <p className="text-sm text-muted leading-relaxed mb-4">
            Molino se sostiene con un pago único opcional de acceso premium. No vendemos
            datos, no mostramos publicidad y no usamos tracking de terceros.
          </p>

          <h4 className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-foreground">
            ¿Hablamos?
          </h4>
          <p className="mt-2 text-sm text-muted">
            Escribinos a{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
              {CONTACT_EMAIL}
            </a>
          </p>
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted font-mono">
            🛡️ No vendemos tus datos. Tu privacidad importa.
          </p>
        </section>
      </div>
    </main>
  );
}